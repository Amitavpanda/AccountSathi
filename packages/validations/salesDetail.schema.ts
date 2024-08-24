import * as z from "zod";
import { object, number, string, TypeOf } from "zod";
import path from "path";


const payload = {
  body: z.object({
    stockName: z.string().min(1).max(255),
    stockNameDetails : z.string().optional(),
    date : z.string(),
    quantity : z.number(),
    quantityType : z.string().optional(),
    quantityDetails : z.string().optional(),
    price : z.number(),
    priceDetails : z.string().optional(),
    amountPaid : z.number(),
    amountPaidDescription : z.string(),
    dateDescription : z.string(),
    salesInfoId : z.string(),
    additionalDetails1 : z.string().optional(),
    additionalDetails2 : z.string().optional(),
    supplierName : z.string().optional()
  }),
};

const perDayMonthPayload = {
  body: z.object({
    date : z.string().optional(),
    month : z.string().optional()
  }),
}

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

  export const getInfoPerDayMonthSchema = z.object({
    ...perDayMonthPayload,
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
export type GetInfoPerDayMonthSchema = z.infer<typeof getInfoPerDayMonthSchema>;


