import * as z from "zod";
import { object, number, string, TypeOf } from "zod";
import path from "path";


const payload = {
  body: z.object({
    nameOfTheSupplier: z.string().min(1).max(255),
    phoneNumber : z.string(),
    address : z.string(), 
    totalAmountDue : z.number(), 
    listOfItems : z.array(z.string())
  }),
};

const params = {
  params: z.object({
    purchaseId: string({
      required_error: "OrderId is required",
    }),
  }),
};

  export const addSupplierPurchaseSchema = z.object({
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

export type AddSupplierPurchaseDetailSchema = z.infer<typeof addSupplierPurchaseSchema>;
export type UpdateOrder = z.infer<typeof updateOrderSchema>;
export type DeleteOrderSchema = z.infer<typeof updateOrderSchema>;
export type GetSupplierPurchaseSchema = z.infer<typeof getSupplierPurchaseSchema>;

