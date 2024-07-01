import { Request, Response, response } from "express";
import { error, info } from "@repo/logs/logs";
import { addSupplierPurchaseDetail, getSupplierPurchaseDetailBySupplierId } from "../service/supplierPurchaseDetailServce.js";
export async function addSupplierPurchaseDetailHandler(req : Request, res : Response) {

    info("req body :", req);
    const response = await addSupplierPurchaseDetail(req);

    return res.send(response);
}

export async function getSupplierPurchaseDetailHandler(req : Request, res : Response) {
    const {supplierId} = req.params;
    info("req params")
    if (!supplierId) {
        error("Supplier ID is missing in the request params");
        return res.status(400).send({ success: false, error: 'Supplier ID is required' });
      }
    
      info("Supplier ID is", supplierId);
    const response = await getSupplierPurchaseDetailBySupplierId(supplierId);

    return res.send(response);

}