import * as z from "zod";
import { object, number, string, TypeOf } from "zod";
import path from "path";


const payload = {
  body: z.object({
    name: z.string().min(1).max(255),
    phoneNumber : z.string(),
    address : z.string(), 
    propieder : z.string(),
    totalAmountDue : z.number(),
    accountDetails : z.string().optional(),
    additionalDetails : z.string().optional()
  }),
};

const params = {
  params: z.object({
    salesInfoId: string({
      required_error: "Sales Info Id is required",
    }),
  }),
};

  export const addSalesInfoSchema = z.object({
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

export type AddSalesInfoSchema = z.infer<typeof addSalesInfoSchema>;
export type UpdateOrder = z.infer<typeof updateOrderSchema>;
export type DeleteOrderSchema = z.infer<typeof updateOrderSchema>;
export type GetProductSchema = z.infer<typeof getSupplierPurchaseSchema>;

