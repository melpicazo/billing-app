import { Router } from "express";
import { BillingController } from "../controllers/billing.controller";

const router = Router();
const billingController = new BillingController();

/* Status */
router.get("/status", billingController.getBillingStatus);

/* Calculations */
router.get("/calculations/firm", billingController.getFirmTotals);
router.get("/calculations/clients", billingController.getClientTotals);
router.get("/calculations/client/:clientId", billingController.getClientTotals);
router.get(
  "/calculations/clients/:clientId/portfolios",
  billingController.getClientPortfolios
);
router.get("/calculations/assets", billingController.getAssets);

/* Tiers */
router.get("/tiers", billingController.getBillingTiers);

/* Reset */
router.delete("/reset", billingController.resetAllData);

export default router;
