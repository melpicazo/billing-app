import { Router, type Request, type Response } from "express";
const router = Router();

function getHealth(_req: Request, res: Response) {
  res.status(200).send();
}

router.post("/health", getHealth);

export default router;
