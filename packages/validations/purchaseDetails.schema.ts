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
    dateDescription : z.string(),
    supplierPurchaseId : z.string()
  }),
};

const params = {
  params: z.object({
    supplierPurchaseId: string({
      required_error: "OrderId is required",
    }),
  }),
};

  export const addSupplierPurchaseDetailSchema = z.object({
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

export type AddSupplierPurchaseDetailSchema = z.infer<typeof addSupplierPurchaseDetailSchema>;
export type UpdateOrder = z.infer<typeof updateOrderSchema>;
export type DeleteOrderSchema = z.infer<typeof updateOrderSchema>;
export type GetProductSchema = z.infer<typeof getSupplierPurchaseSchema>;

