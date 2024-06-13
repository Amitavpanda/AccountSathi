import { NextFunction, Response, Request } from "express";
import { AnyZodObject } from "zod";
import { error, info } from "@repo/logs/logs";
import path from "path";


const validate = (schema : AnyZodObject) => (req : Request, res : Response, next : NextFunction) => {
    try{
        info("req body ", req.body);
        schema.parse({
            body: req.body,
            params: req.params,
          });
        next();
    }
    catch(e : any){
        info("Validation errors");
        error("Validation errors in ", e.errors);
        return res.status(400).send(e.errors);
    }
}


export default validate;