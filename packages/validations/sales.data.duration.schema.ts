import * as z from "zod";
import { object, number, string, TypeOf } from "zod";
import path from "path";


const payload = {
  body: z.object({
    salesInfoId : z.string(),
    startingDate : z.string(),
    endDate : z.string(),
  }),
};




  export const getSalesDataDurationSchema = z.object({
      ...payload,
  });



export type GetSalesDetaDurationSchema = z.infer<typeof getSalesDataDurationSchema>;


