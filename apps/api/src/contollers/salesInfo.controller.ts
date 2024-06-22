
import { Request, Response, response } from "express";
import { info } from "@repo/logs/logs";
import { addSalesInfo, getAllSalesInfo } from "../service/salesInfoService.js";
export async function addSalesInfoHandler(req : Request, res : Response) {
    info("req body: ", req);
    const response = await addSalesInfo(req);
    return res.send(response);

}



export async function getSalesInfoHandler(req : Request, res : Response) {

    const response = await getAllSalesInfo();
    return res.send(response);
}


