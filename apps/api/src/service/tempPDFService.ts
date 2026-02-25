import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const TEMP_DIR = path.join(__dirname, "..", "..", "temp");

// Ensure temp directory exists at module load
if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
}

const TTL_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Saves a base64-encoded PDF to the temp directory and schedules deletion.
 * Returns the public URL the caller should share.
 */
/**
 * Saves a base64-encoded PDF to the temp directory and schedules deletion.
 *
 * @param pdfBase64 - base64 string without data URI prefix
 * @param fileName - original filename (used to generate safe name)
 * @param baseUrl - optional public base URL for the API; if omitted will read
 *                  from process.env.API_PUBLIC_URL. In development the
 *                  controller will pass a host-based fallback so this is only
 *                  required for production setups.
 * @returns the publicly reachable URL where the file can be downloaded
 */
export function saveTempPDF(
    pdfBase64: string,
    fileName: string,
    baseUrl?: string
): string {
    const apiPublicUrl = baseUrl || process.env.API_PUBLIC_URL;
    if (!apiPublicUrl) {
        throw new Error(
            "API_PUBLIC_URL is not set in environment variables and no baseUrl was provided."
        );
    }

    const safeFileName = `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const filePath = path.join(TEMP_DIR, safeFileName);

    const buffer = Buffer.from(pdfBase64, "base64");
    fs.writeFileSync(filePath, buffer);

    // Auto-delete after TTL
    setTimeout(() => {
        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log("[TempPDF] Deleted:", safeFileName);
            }
        } catch (e) {
            console.error("[TempPDF] Failed to delete:", e);
        }
    }, TTL_MS);

    return `${apiPublicUrl}/temp/${safeFileName}`;
}
