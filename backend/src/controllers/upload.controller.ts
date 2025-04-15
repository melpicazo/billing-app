import { type Request, type Response } from "express";
import { UploadService } from "../services/upload.service";
import { UploadDbService } from "../services/uploadDb.service";
export class UploadController {
  private uploadService: UploadService;
  private uploadDbService: UploadDbService;

  constructor() {
    this.uploadDbService = new UploadDbService();
    this.uploadService = new UploadService(this.uploadDbService);
  }

  /**
   * Upload files to the server
   * Perform validation on the files before passing it to the service
   * @param req - The request object
   * @param res - The response object
   * @returns - The response object
   */
  uploadFiles = async (req: Request, res: Response): Promise<void> => {
    try {
      /* Check if files are provided */
      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        res
          .status(400)
          .json({ error: "No file(s) provided. Please attach file(s)" });
        return;
      }

      /* If file is .xlsx file, validate that there is only one file */
      if (
        req.files[0].originalname.endsWith(".xlsx") &&
        req.files.length !== 1
      ) {
        res.status(400).json({ error: "Please upload exactly one Excel file" });
        return;
      }

      /* If file is a .csv file, validate that there are four files */
      if (
        req.files[0].originalname.endsWith(".csv") &&
        req.files.length !== 4
      ) {
        res.status(400).json({ error: "Please upload exactly four CSV files" });
        return;
      }

      /* Send files to service and return results */
      const results = await this.uploadService.processFilesIntoDatabase(
        req.files
      );
      res.json(results);
    } catch (error) {
      console.error("Error processing files:", error);
      res.status(500).json({ error: "Failed to process files" });
    }
  };
}
