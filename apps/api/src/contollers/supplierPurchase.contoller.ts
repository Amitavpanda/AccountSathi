import { Request, Response, response } from "express";
import { info } from "@repo/logs/logs";
import { addSupplierPurchase, getAllSupplierPurchase } from "../service/supplierPurchaseService";
export async function addSupplierPurchaseHandler(req : Request, res : Response) {

    const body = req.body;
    info("req body :", {body});
    const response = await addSupplierPurchase(body);

    return res.send(response);

    console.log("made changes to check git");

}


export async function getSupplierPurchaseHandler(req : Request, res : Response) {

    const response = await getAllSupplierPurchase();
    return res.send(response);
}





