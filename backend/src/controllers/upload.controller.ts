import { type Request, type Response, type NextFunction } from "express";
import multer, { MulterError } from "multer";
import { UploadService } from "../services/upload.service";
import { UploadDbService } from "../services/uploadDb.service";

export class UploadController {
  private uploadService: UploadService;
  private uploadDbService: UploadDbService;
  private upload: multer.Multer;

  constructor() {
    this.uploadDbService = new UploadDbService();
    this.uploadService = new UploadService(this.uploadDbService);

    /**
     * Multer config for handling file uploads
     * Use `multer.memoryStorage()` for our serverless environment deployed on Vercel
     * We save it in memory because the file(s) will be dumped when the request ends
     * 4.5MB limit for Vercel
     */
    this.upload = multer({
      storage: multer.memoryStorage(),
      limits: {
        fileSize: 4.5 * 1024 * 1024,
      },
    });
  }

  /**
   * Error handling function for middleware to handle Multer errors
   * We want to catch the `LIMIT_FILE_SIZE` error and return a custom error message,
   * since we are setting a limit of 4.5MB for the file size
   */
  private handleUploadError = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (err instanceof MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          error: "File is too large. Maximum size is 4.5MB",
        });
      }
      return res.status(400).json({
        error: `Upload error: ${err.message}`,
      });
    }
    next(err);
  };

  /**
   * Middleware to handle file uploads
   * @param req - The request object
   * @param res - The response object
   * @param next - The next function
   */
  handleUploadMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    this.upload.array("files")(req, res, (err) => {
      if (err) return this.handleUploadError(err, req, res, next);
      next();
    });
  };

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
