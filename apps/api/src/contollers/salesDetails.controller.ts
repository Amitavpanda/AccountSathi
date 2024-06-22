



import { Request, Response, response } from "express";
import { error, info } from "@repo/logs/logs";
import { addSalesDetail, getSalesDetailsBySalesInfoId } from "../service/salesDetailsService.js";
export async function addSalesDetailsHandler(req : Request, res : Response) {

    info("req body :", req);
    const response = await addSalesDetail(req);

    return res.send(response);
}

export async function getSalesDetailsHandler(req : Request, res : Response) {
    const {salesInfoId} = req.params;
    info("req params")
    if (!salesInfoId) {
        error("sales info ID is missing in the request params");
        return res.status(400).send({ success: false, error: 'sales info ID is required' });
      }
    
      info("Sales info id is", salesInfoId);
    const response = await getSalesDetailsBySalesInfoId(salesInfoId);

    info("response is ", response)

    return res.send(response);

}

