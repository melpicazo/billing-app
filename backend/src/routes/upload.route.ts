import {
  Router,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import multer, { MulterError } from "multer";
import { UploadController } from "../controllers/upload.controller";

const router = Router();

/**
 * Multer config for handling file uploads
 * Use `multer.memoryStorage()` for our serverless environment deployed on Vercel
 * We save it in memory because the file(s) will be dumped when the request ends, making it perfect for our use case
 * 4.5MB limit for Vercel
 */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 4.5 * 1024 * 1024,
  },
});

const uploadController = new UploadController();

/**
 * Error handling function for middleware to handle Multer errors
 * We want to catch the `LIMIT_FILE_SIZE` error and return a custom error message,
 * since we are setting a limit of 4.5MB for the file size and the default error message is not verbose
 *
 * @param err - The error object
 * @param req - The request object
 * @param res - The response object
 * @param next - The next function
 * @returns - The response object
 */
const handleUploadError = (
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
const handleUploadMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  upload.array("files")(req, res, function (err) {
    if (err) return handleUploadError(err, req, res, next);
    next();
  });
};

router.post("/", handleUploadMiddleware, uploadController.uploadFiles);

export default router;
