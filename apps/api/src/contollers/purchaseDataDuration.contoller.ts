

import { info } from "@repo/logs/logs";
import { Request, Response, response } from "express";
import { purchaseDataDurationService } from "../service/purchaseDataDurationService.js";

export async function purchaseDataDurationHandler(req : Request, res : Response) {

    info("req body :", req);
    const response = await purchaseDataDurationService(req);

    return res.send(response);
}