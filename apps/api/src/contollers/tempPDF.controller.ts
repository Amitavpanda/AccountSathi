import { Request, Response } from "express";
import { saveTempPDF } from "../service/tempPDFService.js";

/**
 * POST /uploadTempPDF
 * Body: { pdfBase64: string, fileName: string }
 * Returns: { success: true, url: string }
 */
export async function uploadTempPDFHandler(req: Request, res: Response) {
    const { pdfBase64, fileName } = req.body;

    if (!pdfBase64 || !fileName) {
        return res.status(400).json({ success: false, error: "pdfBase64 and fileName are required." });
    }

    try {
        // derive a public base URL if env var missing (useful during local development)
        const baseUrl =
            process.env.API_PUBLIC_URL || `${req.protocol}://${req.get("host")}`;
        const url = saveTempPDF(pdfBase64, fileName, baseUrl);
        return res.status(200).json({ success: true, url });
    } catch (err: any) {
        console.error("[uploadTempPDF] Error:", err);
        return res.status(500).json({ success: false, error: err.message || "Failed to upload PDF." });
    }
}
