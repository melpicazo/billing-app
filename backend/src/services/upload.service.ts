import * as XLSX from "xlsx";
import pool from "../db/db";
import { DataType, EXCEL_HEADERS } from "../types/database.types";
import { type PoolClient } from "pg";
import {
  type ExcelClient,
  type ExcelPortfolio,
  type ExcelAsset,
  type ExcelBillingTier,
} from "../types/excel.types";

/**
 * Interface for the results of the file processing
 * Useful for returning the results of the file processing to the controller,
 * and displaying the results to the user
 */
interface FileProcessResult {
  filename: string;
  status: "success" | "error";
  message?: string;
}

export class UploadService {
  private readonly REQUIRED_TYPES = Object.values(DataType);

  /**
   * Constant for the order of processing files in order of dependencies
   * We need to ensure that certain tables are created before others,
   * e.g. billing tiers must be created before clients because clients
   * reference the billing tiers table by ID
   */
  private readonly PROCESS_ORDER = [
    DataType.BILLING /* Step 1: Billing tiers */,
    DataType.CLIENT /* Step 2: Clients */,
    DataType.PORTFOLIO /* Step 3: Portfolios */,
    DataType.ASSET /* Step 4: Assets */,
  ];

  /**
   * Process the files and insert them into the database
   * All files must be valid for any changes to be committed, otherwise the transaction will be rolled back
   * @param files - The files to process
   * @returns The results of the file processing, `FileProcessResult[]`
   */
  async processFilesIntoDatabase(
    files: Express.Multer.File[]
  ): Promise<FileProcessResult[]> {
    /* Create a results array to store the results of the file processing */
    const fileProcessResults: FileProcessResult[] = [];

    /* Connect to the database */
    const client = await pool.connect();

    /* Create a set to store the processed data types */
    const processedTypes = new Set<DataType>();

    try {
      /* Begin the database transaction */
      await client.query("BEGIN");

      /* Process the files based on the file type */
      if (files[0].originalname.endsWith(".xlsx")) {
        await this.processExcelFile(
          files[0],
          client,
          fileProcessResults,
          processedTypes
        );
      } else {
        await this.processCSVFiles(
          files,
          client,
          fileProcessResults,
          processedTypes
        );
      }

      /* Validate that all required types were processed */
      this.validateRequiredTypes(processedTypes);

      /* Commit the transaction and return the results */
      await client.query("COMMIT");
      return fileProcessResults;
    } catch (error) {
      /* Rollback the transaction if an error occurs */
      await client.query("ROLLBACK");
      console.error("Error processing files:", error);
      return fileProcessResults;
    } finally {
      /* Release the client */
      client.release();
    }
  }

  private async processSheets(
    sheets: any,
    client: PoolClient,
    results: FileProcessResult[],
    processedTypes: Set<DataType>,
    file: Express.Multer.File
  ): Promise<void> {
    for (const type of this.PROCESS_ORDER) {
      const sheet = sheets.get(type);
      if (!sheet) {
        results.push({
          filename: `${file.originalname} - ${type}`,
          status: "error",
          message: `Missing required sheet for ${type}`,
        });
        throw new Error(`Missing required sheet: ${type}`);
      }

      try {
        const data = this.getSheetData(sheet, type);
        await this.processData(type, data, client);
        processedTypes.add(type);

        /* Add success result */
        results.push({
          filename: `${file.originalname} - ${type}`,
          status: "success",
        });
      } catch (error) {
        /* Add error result and rethrow */
        results.push({
          filename: `${file.originalname} - ${type}`,
          status: "error",
          message: error instanceof Error ? error.message : "Unknown error",
        });
        throw error;
      }
    }
  }

  /**
   * Process the .xlsx file and insert the data into the database
   * @param file - The file to process
   * @param client - The client to use
   * @param results - The results of the file processing
   * @param processedTypes - The types of data that have been processed
   */
  private async processExcelFile(
    file: Express.Multer.File,
    client: PoolClient,
    results: FileProcessResult[],
    processedTypes: Set<DataType>
  ): Promise<void> {
    /**
     * Read the file with date parsing enabled
     * We want to convert the Excel dates to YYYY-MM-DD format
     */
    const workbook = XLSX.read(file.buffer, {
      cellDates: true,
      dateNF: "YYYY-MM-DD",
    });

    /* Create a map of data type to worksheet */
    const sheets = new Map(
      workbook.SheetNames.map((name) => [
        this.getDataTypeFromName(name),
        workbook.Sheets[name],
      ])
    );

    await this.processSheets(sheets, client, results, processedTypes, file);
  }

  /**
   * Process the .csv files and insert the data into the database
   * @param files - The files to process
   * @param client - The client to use
   * @param results - The results of the file processing
   * @param processedTypes - The types of data that have been processed
   */
  private async processCSVFiles(
    files: Express.Multer.File[],
    client: PoolClient,
    results: FileProcessResult[],
    processedTypes: Set<DataType>
  ): Promise<void> {
    /* Create a map of data type to worksheet */
    const sheets = new Map<DataType, XLSX.WorkSheet>();

    /* First, read all files and map them to their types */
    for (const file of files) {
      const workbook = XLSX.read(file.buffer, {
        cellDates: true,
        dateNF: "YYYY-MM-DD",
      });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const dataType = this.getDataTypeFromName(file.originalname);

      if (!dataType) {
        results.push({
          filename: file.originalname,
          status: "error",
          message: `Invalid file name: ${file.originalname}`,
        });
        continue;
      }

      sheets.set(dataType, worksheet);
    }

    /* Process in specific order */
    for (const type of this.PROCESS_ORDER) {
      const sheet = sheets.get(type);
      if (!sheet) continue;

      try {
        const data = this.getSheetData(sheet, type);
        await this.processData(type, data, client);
        processedTypes.add(type);

        results.push({
          filename: `${type}.csv`,
          status: "success",
        });
      } catch (error) {
        results.push({
          filename: `${type}.csv`,
          status: "error",
          message: error instanceof Error ? error.message : "Unknown error",
        });
        throw error;
      }
    }
  }

  /**
   * Get the data type from the name of the file
   * @param name - The name of the file
   * @returns The data type of the file as the `DataType`
   */
  private getDataTypeFromName(name: string): DataType | null {
    for (const type of this.REQUIRED_TYPES) {
      if (name.toLowerCase().includes(type)) {
        return type;
      }
    }
    return null;
  }

  private validateRequiredTypes(processedTypes: Set<DataType>): void {
    const missingTypes = this.REQUIRED_TYPES.filter(
      (type) => !processedTypes.has(type)
    );
    if (missingTypes.length > 0) {
      throw new Error(`Missing required data: ${missingTypes.join(", ")}`);
    }
  }

  private async processData(
    type: DataType,
    data: unknown[],
    client: PoolClient
  ): Promise<void> {
    /* Process billing tiers first since other tables depend on it */
    if (type === DataType.BILLING) {
      await this.parseBillingTiers(data as ExcelBillingTier[], client);
      return;
    }

    /* Then process the rest in order of dependencies */
    switch (type) {
      case DataType.CLIENT:
        await this.parseClients(data as ExcelClient[], client);
        break;
      case DataType.PORTFOLIO:
        await this.parsePortfolios(data as ExcelPortfolio[], client);
        break;
      case DataType.ASSET:
        await this.parseAssets(data as ExcelAsset[], client);
        break;
    }
  }

  /**
   * Parse the clients file and insert the data into the database
   * Client schema can be found in `src/db/schema.sql`
   * @param data - The data to parse
   * @param client - The client to use
   */
  private async parseClients(
    data: ExcelClient[],
    client: PoolClient
  ): Promise<void> {
    for (const row of data) {
      const { rows } = await client.query(
        `SELECT id FROM billing_tiers WHERE external_tier_id = $1`,
        [row.billing_tier_id]
      );
      if (!rows.length) {
        throw new Error(`Billing tier ${row.billing_tier_id} not found`);
      }
      await client.query(
        `INSERT INTO clients (external_client_id, client_name, province, country, billing_tier_id)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          row.external_client_id,
          row.client_name,
          row.province,
          row.country,
          rows[0].id,
        ]
      );
    }
  }

  /**
   * Parse the portfolios file and insert the data into the database
   * Portfolio schema can be found in `src/db/schema.sql`
   * @param data - The data to parse
   * @param client - The client to use
   */
  private async parsePortfolios(
    data: ExcelPortfolio[],
    client: PoolClient
  ): Promise<void> {
    for (const row of data) {
      try {
        const { rows } = await client.query(
          `SELECT id FROM clients WHERE external_client_id = $1`,
          [row.external_client_id]
        );

        if (!rows.length) {
          console.warn(
            `Skipping portfolio ${row.external_portfolio_id}: Client ${row.external_client_id} not found`
          );
          continue; // Skip this portfolio but continue processing others
        }

        await client.query(
          `INSERT INTO portfolios (external_portfolio_id, client_id, currency)
           VALUES ($1, $2, $3)`,
          [row.external_portfolio_id, rows[0].id, row.currency]
        );
      } catch (error) {
        console.error(
          `Error processing portfolio ${row.external_portfolio_id}:`,
          error
        );
        // Decide if you want to throw or continue
        throw error;
      }
    }
  }

  /**
   * Parse the assets file and insert the data into the database
   * Asset schema can be found in `src/db/schema.sql`
   * @param data - The data to parse
   * @param client - The client to use
   */
  private async parseAssets(
    data: ExcelAsset[],
    client: PoolClient
  ): Promise<void> {
    for (const row of data) {
      try {
        const { rows } = await client.query(
          `SELECT id FROM portfolios WHERE external_portfolio_id = $1`,
          [row.external_portfolio_id]
        );

        if (!rows.length) {
          console.warn(
            `Skipping asset ${row.asset_id}: Portfolio ${row.external_portfolio_id} not found`
          );
          continue; // Skip this asset but continue processing others
        }

        await client.query(
          `INSERT INTO assets (portfolio_id, asset_id, asset_value, currency, date)
           VALUES ($1, $2, $3, $4, $5)`,
          [rows[0].id, row.asset_id, row.asset_value, row.currency, row.date]
        );
      } catch (error) {
        console.error(`Error processing asset ${row.asset_id}:`, error);
        throw error;
      }
    }
  }

  /**
   * Parse the billing tiers file and insert the data into the database
   * We create two tables to store the billing tiers and the tier ranges because:
   * 1. Data that comes from the .csv files is not normalized (i.e., multiple rows for the same billing tier ID)
   * 2. Provides better data integrity and flexibility
   * Billing tier schema and supplementing tier ranges can be found in `src/db/schema.sql`
   */
  private async parseBillingTiers(
    data: ExcelBillingTier[],
    client: PoolClient
  ): Promise<void> {
    /* Group rows by external_tier_id */
    const tierGroups = data.reduce(
      (groups, row) => ({
        ...groups,
        [row.external_tier_id]: [...(groups[row.external_tier_id] || []), row],
      }),
      {} as Record<string, ExcelBillingTier[]>
    );

    /* Process each tier and its ranges */
    for (const [external_tier_id, ranges] of Object.entries(tierGroups)) {
      try {
        /* Insert tier and get its ID */
        const {
          rows: [{ id: tier_id }],
        } = await client.query(
          `INSERT INTO billing_tiers (external_tier_id)
           VALUES ($1)
           ON CONFLICT (external_tier_id) DO UPDATE 
           SET external_tier_id = EXCLUDED.external_tier_id
           RETURNING id`,
          [external_tier_id]
        );

        /* Insert the ranges for this tier */
        await this.insertTierRanges(tier_id, ranges, client);
      } catch (error) {
        console.error(`Error processing tier ${external_tier_id}:`, error);
        throw new Error(`Failed to process billing tier ${external_tier_id}`);
      }
    }
  }

  /**
   * Insert the ranges for a billing tier into billing_tier_ranges table
   * @param tier_id - The ID of the billing tier
   * @param ranges - The ranges to insert
   * @param client - The client to use
   */
  private async insertTierRanges(
    tier_id: number,
    ranges: ExcelBillingTier[],
    client: PoolClient
  ): Promise<void> {
    for (const range of ranges) {
      await client.query(
        `INSERT INTO billing_tier_ranges (billing_tier_id, portfolio_aum_min, portfolio_aum_max, fee_percentage)
         VALUES ($1, $2, $3, $4)`,
        [
          tier_id,
          range.portfolio_aum_min,
          range.portfolio_aum_max,
          range.fee_percentage,
        ]
      );
    }
  }

  private getSheetData(worksheet: XLSX.WorkSheet, type: DataType): unknown[] {
    return XLSX.utils.sheet_to_json(worksheet, {
      header: [...EXCEL_HEADERS[type]],
      range: 1 /* Skip the header row for the import */,
    });
  }
}
