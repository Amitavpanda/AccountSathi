import { Express, Request, Response } from "express";
import validate from "./middleware/validateResource";
import { addSupplierPurchaseSchema } from "../../../packages/validations/purchase.schema";
import { addSupplierPurchaseHandler, getSupplierPurchaseHandler } from "./contollers/supplierPurchase.contoller";
import { addSupplierPurchaseDetailSchema } from "@repo/validations/purchaseDetailSchema";
import { addSupplierPurchaseDetailHandler, getSupplierPurchaseDetailHandler } from "./contollers/supplierPurchaseDetail.controller";


function routes(app : Express){
    app.get('/healthcheck', (req : Request, res : Response)  => res.sendStatus(200));

    app.post('/addSupplierPurchase', validate(addSupplierPurchaseSchema), addSupplierPurchaseHandler);
    app.get('/getSupplierPurchase', getSupplierPurchaseHandler);

    app.post('/addSupplierPurchaseDetails', validate(addSupplierPurchaseDetailSchema), addSupplierPurchaseDetailHandler);
    app.get('/getSupplierPurchaseDetails/:supplierId',  getSupplierPurchaseDetailHandler);

}

export default routes;