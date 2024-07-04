

import { info } from "@repo/logs/logs";
import { Request, Response, response } from "express";
import { salesDataDurationService } from "../service/dataDurationService.js";

export async function salesDataDurationHandler(req : Request, res : Response) {

    info("req body :", req);
    const response = await salesDataDurationService(req);

    return res.send(response);
}