import * as z from "zod";
import { object, number, string, TypeOf } from "zod";
import path from "path";


const payload = {
  body: z.object({
    stockName: z.string().min(1).max(255),
    date : z.string(),
    quantity : z.number(), 
    price : z.number(), 
    amountPaid : z.number(),
    amountPaidDescription : z.string(),
    salesInfoId : z.string()
  }),
};

const params = {
  params: z.object({
    salesInfoId: string({
      required_error: "salesInfoId is required",
    }),
  }),
};

  export const addSalesDetailsSchema = z.object({
      ...payload,
  });

export const updateOrderSchema = z.object({
  ...payload,
  ...params,
})

export const deleteOrderSchema = z.object({
  ...params,

})

export const getSupplierPurchaseSchema = z.object({
  ...params,

})

export type AddSalesDetailsSchema = z.infer<typeof addSalesDetailsSchema>;
export type UpdateOrder = z.infer<typeof updateOrderSchema>;
export type DeleteOrderSchema = z.infer<typeof updateOrderSchema>;
export type GetProductSchema = z.infer<typeof getSupplierPurchaseSchema>;

