/**
 * PORTFOLIO LEVEL VIEW
 * Calculates portfolio values in CAD and determines applicable fee percentages.
 * Uses 1.41 as CAD/USD exchange rate (1 USD = 1.41 CAD).
 * Also stores the applied fee percentage based on the portfolio's CAD value
 */
CREATE OR REPLACE VIEW totals_portfolio AS
WITH portfolio_totals AS (
  SELECT 
    p.id,
    p.external_portfolio_id,
    p.client_id,
    SUM(a.asset_value * CASE a.currency 
      WHEN 'USD' THEN 1.41 
      ELSE 1.0 
    END) as cad_value,
    COUNT(DISTINCT a.asset_id) as num_assets
  FROM portfolios p
  LEFT JOIN assets a ON a.portfolio_id = p.id
  GROUP BY p.id, p.external_portfolio_id, p.client_id
)
SELECT 
  t.id as portfolio_id,
  t.external_portfolio_id,
  t.client_id,
  bt.external_tier_id as tier_id,
  COALESCE(t.cad_value, 0) as portfolio_value_cad,
  COALESCE(btr.fee_percentage, 0) as fee_percentage,
  t.num_assets
FROM portfolio_totals t
JOIN clients c ON c.id = t.client_id
LEFT JOIN billing_tiers bt ON bt.id = c.billing_tier_id
LEFT JOIN billing_tier_ranges btr ON btr.billing_tier_id = bt.id
  AND t.cad_value BETWEEN btr.portfolio_aum_min AND btr.portfolio_aum_max;

/**
 * CLIENT LEVEL VIEW
 * Aggregates portfolio data to calculate client-level metrics:
 * - Total AUM in CAD across all portfolios
 * - Total fees charged based on portfolio-level fee calculations
 * - Effective fee rate (Total Fees / Total AUM)
 * - Number of portfolios under management
 */
CREATE OR REPLACE VIEW totals_client AS
WITH client_portfolio_totals AS (
  SELECT 
    c.id as client_id,
    c.external_client_id,
    c.client_name,
    c.billing_tier_id as tier_id,
    bt.external_tier_id,
    SUM(tp.portfolio_value_cad) as total_aum_cad,
    SUM(tp.portfolio_value_cad * tp.fee_percentage) as total_fees_cad
  FROM clients c
  LEFT JOIN totals_portfolio tp ON tp.client_id = c.id
  LEFT JOIN billing_tiers bt ON bt.id = c.billing_tier_id
  GROUP BY c.id, c.external_client_id, c.client_name, c.billing_tier_id, bt.external_tier_id
)
SELECT 
  client_id,
  external_client_id,
  client_name,
  tier_id,
  external_tier_id,
  COALESCE(total_aum_cad, 0) as total_aum_cad,
  COALESCE(total_fees_cad, 0) as total_fees_cad,
  CASE 
    WHEN COALESCE(total_aum_cad, 0) > 0 
    THEN (total_fees_cad / total_aum_cad)
    ELSE 0 
  END as effective_fee_rate
FROM client_portfolio_totals
ORDER BY total_aum_cad DESC;

/**
 * FIRM LEVEL VIEW
 * Calculates company-wide metrics including:
 * - Total AUM across all portfolios
 * - Total revenue from all client fees
 * - Average effective fee rate across all AUM
 * - Total number of clients
 */
CREATE OR REPLACE VIEW totals_firm AS
SELECT 
  SUM(total_aum_cad) as firm_aum_cad,
  SUM(total_fees_cad) as firm_revenue_cad,
  CASE 
    WHEN SUM(total_aum_cad) > 0 
    THEN SUM(total_fees_cad) / SUM(total_aum_cad)
    ELSE 0 
  END as firm_average_fee_rate,
  COUNT(DISTINCT client_id) as num_clients,
  CURRENT_DATE as calculation_date
FROM totals_client;