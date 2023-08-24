import express from "express";
import { createInvoice, getRequiredSalesData, getSaleData } from "../Controllers/invoice.js";

const router = express.Router()

router.post("/create", createInvoice)

router.get("/salesreport", getSaleData)

router.get("/selected-salesreport", getRequiredSalesData)

export const invoiceRouter = router