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
    const result = await pool.query("SELECT * FROM totals_firm");
    return result.rows[0];
  }

  async getClientTotals(clientId?: string) {
    const query =
      "SELECT * FROM totals_client WHERE ($1::text IS NULL OR external_client_id = $1)";
    const result = await pool.query(query, [clientId]);
    return clientId ? result.rows[0] : result.rows;
  }

  async getPortfolioTotals(portfolioId?: string) {
    const query =
      "SELECT * FROM totals_portfolio WHERE ($1::text IS NULL OR external_portfolio_id = $1)";
    const result = await pool.query(query, [portfolioId]);
    return portfolioId ? result.rows[0] : result.rows;
  }
}
