
import { Request, Response, response } from "express";
import { info } from "@repo/logs/logs";
import { addSalesInfo, getAllSalesInfo, updateSalesInfo, getSalesOverview } from "../service/salesInfoService.js";
export async function addSalesInfoHandler(req : Request, res : Response) {
    info("req body: ", req);
    const response = await addSalesInfo(req);
    return res.send(response);

}



export async function getSalesInfoHandler(req : Request, res : Response) {

    const response = await getAllSalesInfo();
    return res.send(response);
}


export async function updateSalesInfoHandler(req: Request, res: Response) {
    info("update sales info req body: ", req);
    const response = await updateSalesInfo(req);
    return res.send(response);
}


export async function getSalesOverviewHandler(req: Request, res: Response) {
    const response = await getSalesOverview();
    return res.send(response);
}


