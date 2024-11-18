import * as z from "zod";
import { object, number, string, TypeOf } from "zod";
import path from "path";


const payload = {
  body: z.object({
    purchaseInfoId : z.string(),
    startingDate : z.string(),
    endDate : z.string(),
  }),
};




  export const getPurchaseDataDurationSchema = z.object({
      ...payload,
  });



export type GetPurchaseDetaDurationSchema = z.infer<typeof getPurchaseDataDurationSchema>;


