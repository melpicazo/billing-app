import pool from "../db/db";

export class BillingService {
  async getBillingStatus(): Promise<boolean> {
    try {
      const result = await pool.query(`
        SELECT EXISTS (
          SELECT 1 FROM clients 
          WHERE EXISTS (
            SELECT 1 FROM portfolios 
            WHERE EXISTS (
              SELECT 1 FROM assets
            )
          )
        ) as has_data
      `);
      return result.rows[0].has_data;
    } catch (error) {
      console.error("Error getting system status:", error);
      return false;
    }
  }

  async getFirmTotals() {
    try {
      const result = await pool.query("SELECT * FROM totals_firm");
      return result.rows[0];
    } catch (error) {
      console.error("Error getting firm totals:", error);
      throw error;
    }
  }

  async getClientTotals(clientId?: string) {
    try {
      const query =
        "SELECT * FROM totals_client WHERE ($1::text IS NULL OR external_client_id = $1)";
      const result = await pool.query(query, [clientId]);
      return clientId ? result.rows[0] : result.rows;
    } catch (error) {
      console.error("Error getting client totals:", error);
      throw error;
    }
  }

  async getPortfolioTotalsByClientId(clientId: string) {
    try {
      const query = `
        SELECT 
          portfolio_id,
          external_portfolio_id,
          portfolio_value_cad as total_aum_cad,
          fee_percentage as effective_fee_rate,
          (portfolio_value_cad * fee_percentage) as total_fees_cad
        FROM totals_portfolio
        WHERE client_id = $1
        ORDER BY portfolio_value_cad DESC
      `;
      const result = await pool.query(query, [clientId]);
      return result.rows;
    } catch (error) {
      console.error("Error in getPortfolioTotalsByClientId:", error);
      throw error;
    }
  }

  async getBillingTiers() {
    try {
      const query = `
        SELECT 
          bt.id,
          bt.external_tier_id,
          json_agg(
            json_build_object(
              'portfolio_aum_min', btr.portfolio_aum_min,
              'portfolio_aum_max', btr.portfolio_aum_max,
              'fee_percentage', btr.fee_percentage
            ) ORDER BY btr.portfolio_aum_min
          ) as ranges
        FROM billing_tiers bt
        LEFT JOIN billing_tier_ranges btr ON btr.billing_tier_id = bt.id
        GROUP BY bt.id, bt.external_tier_id
        ORDER BY bt.external_tier_id
      `;
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error("Error in getBillingTiers:", error);
      throw error;
    }
  }

  async resetAllData() {
    try {
      await pool.query(`
        DELETE FROM billing_tier_ranges;
        DELETE FROM assets;
        DELETE FROM portfolios;
        DELETE FROM clients;
        DELETE FROM billing_tiers;
      `);
    } catch (error) {
      console.error("Error in resetAllData:", error);
      throw error;
    }
  }

  async getAssets() {
    try {
      const query = `
        SELECT 
          a.asset_id,
          a.asset_value,
          a.currency,
          a.date,
          p.external_portfolio_id
        FROM assets a
        JOIN portfolios p ON p.id = a.portfolio_id
        ORDER BY a.date DESC
      `;
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error("Error in getAssets:", error);
      throw error;
    }
  }
}
