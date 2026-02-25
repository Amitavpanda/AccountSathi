import { Request, Response } from "express";
import { sendWhatsAppPDF } from "../service/whatsappService.js";

/**
 * POST /sendWhatsAppPDF
 * Body: { pdfBase64: string, fileName: string, phoneNumber: string, caption?: string }
 */
export async function sendWhatsAppPDFHandler(req: Request, res: Response) {
    const { pdfBase64, fileName, phoneNumber, caption } = req.body;

    if (!pdfBase64 || !fileName || !phoneNumber) {
        return res.status(400).json({
            success: false,
            error: "pdfBase64, fileName and phoneNumber are required.",
        });
    }

    try {
        const result = await sendWhatsAppPDF({ pdfBase64, fileName, phoneNumber, caption });
        return res.status(200).json(result);
    } catch (err: any) {
        console.error("[sendWhatsAppPDF] Error:", err);
        return res.status(500).json({ success: false, error: err.message || "Failed to send WhatsApp PDF." });
    }
}
