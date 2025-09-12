import * as z from "zod";
import { string } from "zod";
const payload = {
    body: z.object({
        nameOfTheSupplier: z.string().min(1).max(255),
        phoneNumber: z.string(),
        address: z.string(),
        totalAmountDue: z.number(),
        listOfItems: z.array(z.string()),
        accountDetails: z.string().optional(),
        additionalDetails: z.string().optional()
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
});
export const deleteOrderSchema = z.object({
    ...params,
});
export const getSupplierPurchaseSchema = z.object({
    ...params,
});
