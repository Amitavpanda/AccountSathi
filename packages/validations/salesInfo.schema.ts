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
    additionalDetails : z.string().optional(),
    city : z.string().optional()
  }),
};

const params = {
  params: z.object({
    salesInfoId: string({
      required_error: "Sales Info Id is required",
    }),
  }),
};

const updatePayload = {
  body: z.object({
    id: z.string(),
    city: z.string().optional(),
    name: z.string().optional(),
    phoneNumber: z.string().optional(),
    address: z.string().optional(),
    propieder: z.string().optional(),
    accountDetails: z.string().optional(),
    additionalDetails: z.string().optional(),
    hotelExpiry: z.enum(["continue", "uncontinue", "not_to_give"]).optional(),
    status: z.string().optional()
  }),
};

  export const addSalesInfoSchema = z.object({
      ...payload,
  });

export const updateSalesInfoSchema = z.object({
  ...updatePayload,
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
export type UpdateSalesInfoSchema = z.infer<typeof updateSalesInfoSchema>;
export type UpdateOrder = z.infer<typeof updateOrderSchema>;
export type DeleteOrderSchema = z.infer<typeof updateOrderSchema>;
export type GetProductSchema = z.infer<typeof getSupplierPurchaseSchema>;

