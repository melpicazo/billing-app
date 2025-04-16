import { Router } from "express";
import { UploadController } from "../controllers/upload.controller";

const router = Router();
const uploadController = new UploadController();

router.post(
  "/",
  uploadController.handleUploadMiddleware,
  uploadController.uploadFiles
);

export default router;
