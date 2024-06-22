import { Express, Request, Response } from "express";
import validate from "./middleware/validateResource.js";
import { addSupplierPurchaseSchema } from "../../../packages/validations/purchase.schema.js";
import { addSupplierPurchaseHandler, getSupplierPurchaseHandler } from "./contollers/supplierPurchase.contoller.js";
import { addSupplierPurchaseDetailSchema } from "@repo/validations/purchaseDetailSchema";
import { addSupplierPurchaseDetailHandler, getSupplierPurchaseDetailHandler } from "./contollers/supplierPurchaseDetail.controller.js";
import { addSalesInfoSchema } from "@repo/validations/salesInfoSchema";
import { addSalesInfoHandler, getSalesInfoHandler } from "./contollers/salesInfo.controller.js";
import { getAllSalesInfo } from "./service/salesInfoService.js";
import { addSalesDetailsSchema } from "../../../packages/validations/salesDetail.schema.js";
import { addSalesDetailsHandler, getSalesDetailsHandler } from "./contollers/salesDetails.controller.js";


function routes(app : Express){
    app.get('/healthcheck', (req : Request, res : Response)  => res.sendStatus(200));

    app.post('/addSalesDetails', validate(addSalesDetailsSchema), addSalesDetailsHandler);
    app.get('/getSalesDetails/:salesInfoId',  getSalesDetailsHandler);

    app.post('/addSalesInfo', validate(addSalesInfoSchema), addSalesInfoHandler);
    app.get('/getSalesInfo', getSalesInfoHandler);

    app.post('/addSupplierPurchaseDetails', validate(addSupplierPurchaseDetailSchema), addSupplierPurchaseDetailHandler);
    app.get('/getSupplierPurchaseDetails/:supplierId',  getSupplierPurchaseDetailHandler);

    
    app.post('/addSupplierPurchase', validate(addSupplierPurchaseSchema), addSupplierPurchaseHandler);
    app.get('/getSupplierPurchase', getSupplierPurchaseHandler);

    app.post('/addSupplierPurchaseDetails', validate(addSupplierPurchaseDetailSchema), addSupplierPurchaseDetailHandler);
    app.get('/getSupplierPurchaseDetails/:supplierId',  getSupplierPurchaseDetailHandler);


}

export default routes;