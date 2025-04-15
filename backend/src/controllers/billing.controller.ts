import { type Request, type Response } from "express";
import { BillingService } from "../services/billing.service";

export class BillingController {
  private billingService: BillingService;

  constructor() {
    this.billingService = new BillingService();
  }

  getBillingStatus = async (req: Request, res: Response) => {
    try {
      const status = await this.billingService.getBillingStatus();
      res.json(status);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve system status" });
    }
  };

  getFirmTotals = async (req: Request, res: Response) => {
    try {
      const totals = await this.billingService.getFirmTotals();
      res.json(totals);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve firm totals" });
    }
  };

  getClientTotals = async (req: Request, res: Response) => {
    try {
      const clientId = req.params.clientId;
      const totals = await this.billingService.getClientTotals(clientId);
      res.json(totals);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve client totals" });
    }
  };

  getPortfolioTotals = async (req: Request, res: Response) => {
    try {
      const portfolioId = req.params.portfolioId;
      const totals = await this.billingService.getPortfolioTotals(portfolioId);
      res.json(totals);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve portfolio totals" });
    }
  };

  getClientPortfolios = async (req: Request, res: Response) => {
    try {
      const { clientId } = req.params;
      const portfolios = await this.billingService.getPortfolioTotalsByClientId(
        clientId
      );
      res.json(portfolios);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve client portfolios" });
    }
  };
}
