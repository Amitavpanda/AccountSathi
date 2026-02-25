import twilio from "twilio";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMP_DIR = path.join(__dirname, "..", "..", "temp");

// Ensure temp directory exists
if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
}

/**
 * Sends a PDF to a WhatsApp number using Twilio WhatsApp API.
 * The PDF is saved temporarily to disk, served publicly, sent via WhatsApp,
 * then deleted after 10 minutes.
 */
export async function sendWhatsAppPDF({
    pdfBase64,
    fileName,
    phoneNumber,
    caption,
}: {
    pdfBase64: string;
    fileName: string;
    phoneNumber: string;
    caption?: string;
}) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const whatsappFrom = process.env.TWILIO_WHATSAPP_FROM; // e.g. "+14155238886" (sandbox) or your approved number
    const apiPublicUrl = process.env.API_PUBLIC_URL; // e.g. "https://your-api.example.com"

    if (!accountSid || !authToken || !whatsappFrom || !apiPublicUrl) {
        throw new Error(
            "Missing Twilio config. Ensure TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM and API_PUBLIC_URL are set."
        );
    }

    // Sanitise phone number – strip everything except digits and leading +
    const sanitisedPhone = phoneNumber.trim().replace(/[^\d+]/g, "");
    const toNumber = sanitisedPhone.startsWith("+")
        ? sanitisedPhone
        : `+${sanitisedPhone}`;

    // Write PDF to temp dir
    const safeFileName = `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const filePath = path.join(TEMP_DIR, safeFileName);

    const pdfBuffer = Buffer.from(pdfBase64, "base64");
    fs.writeFileSync(filePath, pdfBuffer);

    // Public URL for Twilio to fetch the file
    const mediaUrl = `${apiPublicUrl}/temp/${safeFileName}`;

    const client = twilio(accountSid, authToken);

    const message = await client.messages.create({
        from: `whatsapp:${whatsappFrom}`,
        to: `whatsapp:${toNumber}`,
        body: caption || `Please find your PDF report attached.`,
        mediaUrl: [mediaUrl],
    });

    console.log("[WhatsApp] Message sent, SID:", message.sid);

    // Clean up temp file after 10 minutes
    setTimeout(() => {
        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log("[WhatsApp] Temp file deleted:", safeFileName);
            }
        } catch (e) {
            console.error("[WhatsApp] Failed to delete temp file:", e);
        }
    }, 10 * 60 * 1000);

    return { success: true, messageSid: message.sid };
}
