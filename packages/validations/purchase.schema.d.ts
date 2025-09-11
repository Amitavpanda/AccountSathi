import * as z from "zod";
export declare const addSupplierPurchaseSchema: z.ZodObject<{
    body: z.ZodObject<{
        nameOfTheSupplier: z.ZodString;
        phoneNumber: z.ZodString;
        address: z.ZodString;
        totalAmountDue: z.ZodNumber;
        listOfItems: z.ZodArray<z.ZodString, "many">;
        accountDetails: z.ZodOptional<z.ZodString>;
        additionalDetails: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        nameOfTheSupplier: string;
        phoneNumber: string;
        address: string;
        totalAmountDue: number;
        listOfItems: string[];
        accountDetails?: string | undefined;
        additionalDetails?: string | undefined;
    }, {
        nameOfTheSupplier: string;
        phoneNumber: string;
        address: string;
        totalAmountDue: number;
        listOfItems: string[];
        accountDetails?: string | undefined;
        additionalDetails?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        nameOfTheSupplier: string;
        phoneNumber: string;
        address: string;
        totalAmountDue: number;
        listOfItems: string[];
        accountDetails?: string | undefined;
        additionalDetails?: string | undefined;
    };
}, {
    body: {
        nameOfTheSupplier: string;
        phoneNumber: string;
        address: string;
        totalAmountDue: number;
        listOfItems: string[];
        accountDetails?: string | undefined;
        additionalDetails?: string | undefined;
    };
}>;
export declare const updateOrderSchema: z.ZodObject<{
    params: z.ZodObject<{
        purchaseId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        purchaseId: string;
    }, {
        purchaseId: string;
    }>;
    body: z.ZodObject<{
        nameOfTheSupplier: z.ZodString;
        phoneNumber: z.ZodString;
        address: z.ZodString;
        totalAmountDue: z.ZodNumber;
        listOfItems: z.ZodArray<z.ZodString, "many">;
        accountDetails: z.ZodOptional<z.ZodString>;
        additionalDetails: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        nameOfTheSupplier: string;
        phoneNumber: string;
        address: string;
        totalAmountDue: number;
        listOfItems: string[];
        accountDetails?: string | undefined;
        additionalDetails?: string | undefined;
    }, {
        nameOfTheSupplier: string;
        phoneNumber: string;
        address: string;
        totalAmountDue: number;
        listOfItems: string[];
        accountDetails?: string | undefined;
        additionalDetails?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        purchaseId: string;
    };
    body: {
        nameOfTheSupplier: string;
        phoneNumber: string;
        address: string;
        totalAmountDue: number;
        listOfItems: string[];
        accountDetails?: string | undefined;
        additionalDetails?: string | undefined;
    };
}, {
    params: {
        purchaseId: string;
    };
    body: {
        nameOfTheSupplier: string;
        phoneNumber: string;
        address: string;
        totalAmountDue: number;
        listOfItems: string[];
        accountDetails?: string | undefined;
        additionalDetails?: string | undefined;
    };
}>;
export declare const deleteOrderSchema: z.ZodObject<{
    params: z.ZodObject<{
        purchaseId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        purchaseId: string;
    }, {
        purchaseId: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        purchaseId: string;
    };
}, {
    params: {
        purchaseId: string;
    };
}>;
export declare const getSupplierPurchaseSchema: z.ZodObject<{
    params: z.ZodObject<{
        purchaseId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        purchaseId: string;
    }, {
        purchaseId: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        purchaseId: string;
    };
}, {
    params: {
        purchaseId: string;
    };
}>;
export type AddSupplierPurchaseDetailSchema = z.infer<typeof addSupplierPurchaseSchema>;
export type UpdateOrder = z.infer<typeof updateOrderSchema>;
export type DeleteOrderSchema = z.infer<typeof updateOrderSchema>;
export type GetSupplierPurchaseSchema = z.infer<typeof getSupplierPurchaseSchema>;
//# sourceMappingURL=purchase.schema.d.ts.map