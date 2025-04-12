import * as XLSX from "xlsx";
import pool from "../db/db";
import { DataType } from "../types/database.types";
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

      /* Commit the transaction */
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
    /* Read the workbook */
    const workbook = XLSX.read(file.buffer);

    /* Loop over the sheets in the workbook */
    for (const sheetName of workbook.SheetNames) {
      try {
        /* Get the worksheet  */
        const worksheet = workbook.Sheets[sheetName];

        /* Get the data from the worksheet */
        const data = XLSX.utils.sheet_to_json(worksheet);

        /* Get the data type from the sheet name */
        const dataType = this.getDataTypeFromName(sheetName);

        /* If the data type is not found, add an error to the results */
        if (!dataType) {
          results.push({
            filename: `${file.originalname} - ${sheetName}`,
            status: "error",
            message: `Invalid sheet name: ${sheetName}`,
          });
          continue;
        }

        /* Add the data type to the processed types */
        processedTypes.add(dataType);

        /* Process the data */
        await this.processData(dataType, data, client);

        /* Add the results to the results array */
        results.push({
          filename: `${file.originalname} - ${sheetName}`,
          status: "success",
        });
      } catch (error) {
        /* Add the error to the results array and throw an error */
        results.push({
          filename: `${file.originalname} - ${sheetName}`,
          status: "error",
          message: error instanceof Error ? error.message : "Unknown error",
        });
        throw error;
      }
    }
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
    for (const file of files) {
      try {
        /* Read the workbook */
        const workbook = XLSX.read(file.buffer);

        /* Get the worksheet */
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];

        /* Get the data from the worksheet */
        const data = XLSX.utils.sheet_to_json(worksheet);
        const dataType = this.getDataTypeFromName(file.originalname);

        /* If the data type is not found, add an error to the results */
        if (!dataType) {
          results.push({
            filename: file.originalname,
            status: "error",
            message: `Invalid file name: ${file.originalname}`,
          });
          continue;
        }

        /* Add the data type to the processed types */
        processedTypes.add(dataType);
        await this.processData(dataType, data, client);

        results.push({
          filename: file.originalname,
          status: "success",
        });
      } catch (error) {
        results.push({
          filename: file.originalname,
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
      case DataType.BILLING:
        await this.parseBillingTiers(data as ExcelBillingTier[], client);
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
      await client.query(
        `INSERT INTO clients (external_client_id, client_name, province, country, billing_tier_id)
         VALUES ($1, $2, $3, $4, (SELECT id FROM billing_tiers WHERE external_tier_id = $5))`,
        [
          row.external_client_id,
          row.client_name,
          row.province,
          row.country,
          row.billing_tier_id,
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
      await client.query(
        `INSERT INTO portfolios (external_portfolio_id, client_id, currency)
         VALUES ($1, (SELECT id FROM clients WHERE external_client_id = $2), $3)`,
        [row.external_portfolio_id, row.client_id, row.currency]
      );
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
      await client.query(
        `INSERT INTO assets (portfolio_id, asset_id, asset_value, currency, date)
         VALUES ((SELECT id FROM portfolios WHERE external_portfolio_id = $1), $2, $3, $4, $5)`,
        [
          row.portfolio_id,
          row.asset_id,
          row.asset_value,
          row.currency,
          row.date,
        ]
      );
    }
  }

  /**
   * Parse the billing tiers file and insert the data into the database
   * Billing tier schema can be found in `src/db/schema.sql`
   * @param data - The data to parse
   * @param client - The client to use
   */
  private async parseBillingTiers(
    data: ExcelBillingTier[],
    client: PoolClient
  ): Promise<void> {
    for (const row of data) {
      await client.query(
        `INSERT INTO billing_tiers (external_tier_id, portfolio_aum_min, portfolio_aum_max, fee_percentage)
         VALUES ($1, $2, $3, $4)`,
        [
          row.external_tier_id,
          row.portfolio_aum_min,
          row.portfolio_aum_max,
          row.fee_percentage,
        ]
      );
    }
  }
}
