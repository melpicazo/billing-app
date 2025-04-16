import { type PoolClient } from "pg";
import {
  type ExcelClient,
  type ExcelPortfolio,
  type ExcelAsset,
  type ExcelBillingTier,
} from "../types/excel.types";
import _ from "lodash";

export interface ParseResult {
  processed: number;
  skipped: {
    count: number;
    ids: string[];
  };
}

interface ValidatedData<T> {
  validData: T[];
  skippedRows: T[];
}

export class UploadDbService {
  /**
   * Helper function to validate data against a reference map
   * @param data - The data to validate
   * @param referenceMap - Map of valid external IDs to internal IDs
   * @param externalIdKey - Key to check in the data
   */
  private validateDataWithMap<T>(
    data: T[],
    referenceMap: Record<string, { id: number }>,
    externalIdKey: keyof T
  ): ValidatedData<T> {
    const validData = data.filter(
      (row) => referenceMap[String(row[externalIdKey])]
    );
    const skippedRows = data.filter(
      (row) => !referenceMap[String(row[externalIdKey])]
    );
    return { validData, skippedRows };
  }

  /**
   * Helper function to create a parse result
   * @param validData - The valid data that was processed
   * @param skippedRows - The skipped rows
   * @param formatSkippedRow - Function to format skipped row messages
   */
  private createParseResult<T>(
    validData: T[],
    skippedRows: T[],
    formatSkippedRow: (row: T) => string
  ): ParseResult {
    return {
      processed: validData.length,
      skipped: {
        count: skippedRows.length,
        ids: skippedRows.map(formatSkippedRow),
      },
    };
  }

  /**
   * Helper function to create bulk insert values for a given table
   * @param data - The data to insert
   * @param numColumns - The number of columns in the table
   * @param mapRow - Function to map the row to the values
   * @returns The values and params for the bulk insert
   */
  private createBulkInsertValues<T>(
    data: T[],
    numColumns: number,
    mapRow: (item: T) => unknown[]
  ) {
    const values = data
      .map(
        (_, i) =>
          `(${Array.from(
            { length: numColumns },
            (_, j) => `$${i * numColumns + j + 1}`
          ).join(", ")})`
      )
      .join(",");
    const params = data.flatMap(mapRow);
    return { values, params };
  }

  /**
   * Parse the clients file and insert the data into the database
   * Client schema can be found in `src/db/schema.sql`
   * @param data - The data to parse
   * @param client - The client to use
   */
  async parseClients(
    data: ExcelClient[],
    client: PoolClient
  ): Promise<ParseResult> {
    const { rows: billingTiers } = await client.query(
      `SELECT id, external_tier_id FROM billing_tiers WHERE external_tier_id = ANY($1)`,
      [_.map(data, "billing_tier_id")]
    );

    const tierMap = _.keyBy(billingTiers, "external_tier_id") as Record<
      string,
      { id: number }
    >;

    const { validData, skippedRows } = this.validateDataWithMap(
      data,
      tierMap,
      "billing_tier_id"
    );

    const { values, params } = this.createBulkInsertValues<ExcelClient>(
      validData,
      5,
      (row) => [
        row.external_client_id,
        row.client_name,
        row.province,
        row.country,
        tierMap[row.billing_tier_id].id,
      ]
    );

    if (validData.length > 0) {
      await client.query(
        `INSERT INTO clients (external_client_id, client_name, province, country, billing_tier_id)
         VALUES ${values}`,
        params
      );
    }

    return this.createParseResult(
      validData,
      skippedRows,
      (row) => `${row.external_client_id} (missing tier ${row.billing_tier_id})`
    );
  }

  /**
   * Parse the portfolios file and insert the data into the database
   * Portfolio schema can be found in `src/db/schema.sql`
   * @param data - The data to parse
   * @param client - The client to use
   */
  async parsePortfolios(
    data: ExcelPortfolio[],
    client: PoolClient
  ): Promise<ParseResult> {
    const { rows: clients } = await client.query(
      `SELECT id, external_client_id FROM clients WHERE external_client_id = ANY($1)`,
      [_.map(data, "external_client_id")]
    );

    const clientMap = _.keyBy(clients, "external_client_id") as Record<
      string,
      { id: number }
    >;

    const { validData, skippedRows } = this.validateDataWithMap(
      data,
      clientMap,
      "external_client_id"
    );

    const { values, params } = this.createBulkInsertValues<ExcelPortfolio>(
      validData,
      3,
      (row) => [
        row.external_portfolio_id,
        clientMap[row.external_client_id].id,
        row.currency,
      ]
    );

    if (validData.length > 0) {
      await client.query(
        `INSERT INTO portfolios (external_portfolio_id, client_id, currency)
         VALUES ${values}`,
        params
      );
    }

    return this.createParseResult(
      validData,
      skippedRows,
      (row) =>
        `${row.external_portfolio_id} (missing client ${row.external_client_id})`
    );
  }

  /**
   * Parse the assets file and insert the data into the database
   * Asset schema can be found in `src/db/schema.sql`
   * @param data - The data to parse
   * @param client - The client to use
   */
  async parseAssets(
    data: ExcelAsset[],
    client: PoolClient
  ): Promise<ParseResult> {
    const { rows: portfolios } = await client.query(
      `SELECT id, external_portfolio_id FROM portfolios WHERE external_portfolio_id = ANY($1)`,
      [_.map(data, (row: ExcelAsset) => row.external_portfolio_id)]
    );

    const portfolioMap = _.keyBy(portfolios, "external_portfolio_id") as Record<
      string,
      { id: number }
    >;

    const { validData, skippedRows } = this.validateDataWithMap(
      data,
      portfolioMap,
      "external_portfolio_id"
    );

    const { values, params } = this.createBulkInsertValues<ExcelAsset>(
      validData,
      5,
      (row: ExcelAsset) => [
        portfolioMap[row.external_portfolio_id].id,
        row.asset_id,
        row.asset_value,
        row.currency,
        row.date,
      ]
    );

    if (validData.length > 0) {
      await client.query(
        `INSERT INTO assets (portfolio_id, asset_id, asset_value, currency, date)
         VALUES ${values}`,
        params
      );
    }

    return this.createParseResult(
      validData,
      skippedRows,
      (row) =>
        `${row.asset_id} (missing portfolio ${row.external_portfolio_id})`
    );
  }

  /**
   * Parse the billing tiers file and insert the data into the database
   * We create two tables to store the billing tiers and the tier ranges because:
   * 1. Data that comes from the .csv files is not normalized (i.e., multiple rows for the same billing tier ID)
   * 2. Provides better data integrity and flexibility
   * Billing tier schema and supplementing tier ranges can be found in `src/db/schema.sql`
   */
  async parseBillingTiers(
    data: ExcelBillingTier[],
    client: PoolClient
  ): Promise<Record<string, { id: number }>> {
    const uniqueTierIds = _.uniqBy(data, "external_tier_id").map(
      (row) => row.external_tier_id
    );

    const values = uniqueTierIds.map((_, i) => `($${i + 1})`).join(",");

    const { rows: insertedTiers } = await client.query(
      `INSERT INTO billing_tiers (external_tier_id)
       VALUES ${values}
       ON CONFLICT (external_tier_id) DO UPDATE 
       SET external_tier_id = EXCLUDED.external_tier_id
       RETURNING id, external_tier_id`,
      uniqueTierIds
    );

    return _.keyBy(insertedTiers, "external_tier_id");
  }

  async parseBillingTierRanges(
    data: ExcelBillingTier[],
    tierMap: Record<string, { id: number }>,
    client: PoolClient
  ): Promise<void> {
    const validData = data.filter((row) => tierMap[row.external_tier_id]);

    const { values, params } = this.createBulkInsertValues<ExcelBillingTier>(
      validData,
      4,
      (row) => [
        tierMap[row.external_tier_id].id,
        row.portfolio_aum_min,
        row.portfolio_aum_max,
        row.fee_percentage,
      ]
    );

    await client.query(
      `INSERT INTO billing_tier_ranges (billing_tier_id, portfolio_aum_min, portfolio_aum_max, fee_percentage)
       VALUES ${values}`,
      params
    );
  }
}
