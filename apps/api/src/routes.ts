import { Express, Request, Response } from "express";
import validate from "./middleware/validateResource.js";
import { addSupplierPurchaseSchema } from "../../../packages/validations/purchase.schema.js";
import { addSupplierPurchaseHandler, getAllSuppliersHandler, getSupplierPurchaseHandler } from "./contollers/supplierPurchase.contoller.js";
import { addSupplierPurchaseDetailSchema } from "@repo/validations/purchaseDetailSchema";
import { addSupplierPurchaseDetailHandler, getSupplierPurchaseDetailHandler } from "./contollers/supplierPurchaseDetail.controller.js";
import { addSalesInfoSchema } from "@repo/validations/salesInfoSchema";
import { addSalesInfoHandler, getSalesInfoHandler } from "./contollers/salesInfo.controller.js";
import { getAllSalesInfo } from "./service/salesInfoService.js";
import { addSalesDetailsSchema, getInfoPerDayMonthSchema } from "../../../packages/validations/salesDetail.schema.js";
import { addSalesDetailsHandler, getInfoPerDayMonthHandler, getSalesDetailsHandler } from "./contollers/salesDetails.controller.js";
import { getSalesDataDurationSchema } from "@repo/validations/getSalesDataDuration";
import { salesDataDurationHandler } from "./contollers/dataDuration.controller.js";
import {loginUserSchema, otpVerificationSchema, registerUserSchema} from "@repo/validations/userSchema"
import { loginHandler, otpVerificationHandler, register } from "./contollers/users.controller.js";
import { getPurchaseDataDurationSchema } from "@repo/validations/getPurchaseDataDuration";
import { purchaseDataDurationHandler } from "./contollers/purchaseDataDuration.contoller.js";

function routes(app : Express){
    app.get('/healthcheck', (req : Request, res : Response)  => res.sendStatus(200));


    app.post('/getPurchasesDataDuration', validate(getPurchaseDataDurationSchema), purchaseDataDurationHandler);
    app.post('/getSalesDataDuration', validate(getSalesDataDurationSchema), salesDataDurationHandler);
    
    app.post('/addSalesDetails', validate(addSalesDetailsSchema), addSalesDetailsHandler);
    app.get('/getSalesDetails/:salesInfoId',  getSalesDetailsHandler);

    app.post('/addSalesInfo', validate(addSalesInfoSchema), addSalesInfoHandler);
    app.get('/getSalesInfo', getSalesInfoHandler);

    app.post('/addSupplierPurchaseDetails', validate(addSupplierPurchaseDetailSchema), addSupplierPurchaseDetailHandler);
    app.get('/getSupplierPurchaseDetails/:supplierId',  getSupplierPurchaseDetailHandler);
    app.get('/getAllSuppliers', getAllSuppliersHandler);
    
    app.post('/addSupplierPurchase', validate(addSupplierPurchaseSchema), addSupplierPurchaseHandler);
    app.get('/getSupplierPurchase', getSupplierPurchaseHandler);
    app.post('/addSupplierPurchaseDetails', validate(addSupplierPurchaseDetailSchema), addSupplierPurchaseDetailHandler);
    app.get('/getSupplierPurchaseDetails/:supplierId',  getSupplierPurchaseDetailHandler);
    app.post('/infoPerDayMonth', validate(getInfoPerDayMonthSchema), getInfoPerDayMonthHandler);

    app.post('/register', validate(registerUserSchema), register );
    app.post('/login', validate(loginUserSchema), loginHandler);
    app.post('/otpVerification', validate(otpVerificationSchema), otpVerificationHandler);




}

export default routes;