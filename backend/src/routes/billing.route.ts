import { Router } from "express";
import { BillingController } from "../controllers/billing.controller";

const router = Router();
const billingController = new BillingController();

// Check system status
router.get("/status", billingController.getBillingStatus);

// Get calculations at different levels
router.get("/calculations/firm", billingController.getFirmTotals);
router.get("/calculations/clients", billingController.getClientTotals);
router.get("/calculations/client/:clientId", billingController.getClientTotals);
router.get(
  "/calculations/clients/:clientId/portfolios",
  billingController.getClientPortfolios
);
router.get("/calculations/portfolios", billingController.getPortfolioTotals);
router.get(
  "/calculations/portfolio/:portfolioId",
  billingController.getPortfolioTotals
);

export default router;
