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
import _ from "lodash";
import { UploadDbService } from "./uploadDb.service";

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

  constructor(private uploadDbService: UploadDbService) {}

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

  /**
   * Process the sheets in the order of the PROCESS_ORDER
   * @param sheets - The sheets to process
   * @param client - The client to use
   * @param results - The results of the file processing
   * @param processedTypes - The types of data that have been processed
   */
  private async processSheets(
    sheets: Map<DataType, XLSX.WorkSheet>,
    client: PoolClient,
    results: FileProcessResult[],
    processedTypes: Set<DataType>
  ): Promise<void> {
    for (const type of this.PROCESS_ORDER) {
      const sheet = sheets.get(type);
      if (!sheet) {
        results.push({
          filename: `${type}`,
          status: "error",
          message: `Missing required sheet for ${type}`,
        });
        throw new Error(`Missing required sheet: ${type}`);
      }

      try {
        /* Get data for the sheet and skip the header row for the import */
        const data = XLSX.utils.sheet_to_json(sheet, {
          header: [...EXCEL_HEADERS[type]],
          range: 1,
        });

        /* Process the data and add to the processed types*/
        await this.processDataTypes(type, data, client);
        processedTypes.add(type);

        /* Add success result */
        results.push({
          filename: `${type}`,
          status: "success",
        });
      } catch (error) {
        /* Add error result and rethrow */
        results.push({
          filename: `${type}`,
          status: "error",
          message: error instanceof Error ? error.message : "Unknown error",
        });
        throw error;
      }
    }
  }

  /**
   * Process the data based on the data type
   * We need to typecast `data` to the correct type because parsing it
   * through the xlsx library returns an unknown type
   * @param type - The type of data to process
   * @param data - The data to process
   * @param client - The client to use
   */
  private async processDataTypes(
    type: DataType,
    data: unknown[],
    client: PoolClient
  ): Promise<void> {
    switch (type) {
      case DataType.BILLING:
        const tierMap = await this.uploadDbService.parseBillingTiers(
          data as ExcelBillingTier[],
          client
        );
        await this.uploadDbService.parseBillingTierRanges(
          data as ExcelBillingTier[],
          tierMap,
          client
        );
        break;
      case DataType.CLIENT:
        await this.uploadDbService.parseClients(data as ExcelClient[], client);
        break;
      case DataType.PORTFOLIO:
        await this.uploadDbService.parsePortfolios(
          data as ExcelPortfolio[],
          client
        );
        break;
      case DataType.ASSET:
        await this.uploadDbService.parseAssets(data as ExcelAsset[], client);
        break;
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

    /* Process the sheets in the order of the PROCESS_ORDER */
    await this.processSheets(sheets, client, results, processedTypes);
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

    /* Process the sheets in the order of the PROCESS_ORDER */
    await this.processSheets(sheets, client, results, processedTypes);
  }

  /**
   * Get the data type from the name of the file
   * @param name - The name of the file
   * @returns The data type of the file as the `DataType`
   */
  private getDataTypeFromName(name: string): DataType {
    for (const type of this.REQUIRED_TYPES) {
      if (name.toLowerCase().includes(type)) {
        return type;
      }
    }
    throw new Error(`Invalid sheet name: ${name}`);
  }

  /**
   * Validate that all required types were processed
   * @param processedTypes - The types of data that have been processed
   */
  private validateRequiredTypes(processedTypes: Set<DataType>): void {
    const missingTypes = this.REQUIRED_TYPES.filter(
      (type) => !processedTypes.has(type)
    );
    if (missingTypes.length > 0) {
      throw new Error(`Missing required data: ${missingTypes.join(", ")}`);
    }
  }
}
