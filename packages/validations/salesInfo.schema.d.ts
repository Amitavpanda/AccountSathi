import * as z from "zod";
export declare const addSalesInfoSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        phoneNumber: z.ZodString;
        address: z.ZodString;
        propieder: z.ZodString;
        totalAmountDue: z.ZodNumber;
        accountDetails: z.ZodOptional<z.ZodString>;
        additionalDetails: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        phoneNumber: string;
        address: string;
        totalAmountDue: number;
        name: string;
        propieder: string;
        accountDetails?: string | undefined;
        additionalDetails?: string | undefined;
    }, {
        phoneNumber: string;
        address: string;
        totalAmountDue: number;
        name: string;
        propieder: string;
        accountDetails?: string | undefined;
        additionalDetails?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        phoneNumber: string;
        address: string;
        totalAmountDue: number;
        name: string;
        propieder: string;
        accountDetails?: string | undefined;
        additionalDetails?: string | undefined;
    };
}, {
    body: {
        phoneNumber: string;
        address: string;
        totalAmountDue: number;
        name: string;
        propieder: string;
        accountDetails?: string | undefined;
        additionalDetails?: string | undefined;
    };
}>;
export declare const updateOrderSchema: z.ZodObject<{
    params: z.ZodObject<{
        salesInfoId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        salesInfoId: string;
    }, {
        salesInfoId: string;
    }>;
    body: z.ZodObject<{
        name: z.ZodString;
        phoneNumber: z.ZodString;
        address: z.ZodString;
        propieder: z.ZodString;
        totalAmountDue: z.ZodNumber;
        accountDetails: z.ZodOptional<z.ZodString>;
        additionalDetails: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        phoneNumber: string;
        address: string;
        totalAmountDue: number;
        name: string;
        propieder: string;
        accountDetails?: string | undefined;
        additionalDetails?: string | undefined;
    }, {
        phoneNumber: string;
        address: string;
        totalAmountDue: number;
        name: string;
        propieder: string;
        accountDetails?: string | undefined;
        additionalDetails?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        salesInfoId: string;
    };
    body: {
        phoneNumber: string;
        address: string;
        totalAmountDue: number;
        name: string;
        propieder: string;
        accountDetails?: string | undefined;
        additionalDetails?: string | undefined;
    };
}, {
    params: {
        salesInfoId: string;
    };
    body: {
        phoneNumber: string;
        address: string;
        totalAmountDue: number;
        name: string;
        propieder: string;
        accountDetails?: string | undefined;
        additionalDetails?: string | undefined;
    };
}>;
export declare const deleteOrderSchema: z.ZodObject<{
    params: z.ZodObject<{
        salesInfoId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        salesInfoId: string;
    }, {
        salesInfoId: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        salesInfoId: string;
    };
}, {
    params: {
        salesInfoId: string;
    };
}>;
export declare const getSupplierPurchaseSchema: z.ZodObject<{
    params: z.ZodObject<{
        salesInfoId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        salesInfoId: string;
    }, {
        salesInfoId: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        salesInfoId: string;
    };
}, {
    params: {
        salesInfoId: string;
    };
}>;
export type AddSalesInfoSchema = z.infer<typeof addSalesInfoSchema>;
export type UpdateOrder = z.infer<typeof updateOrderSchema>;
export type DeleteOrderSchema = z.infer<typeof updateOrderSchema>;
export type GetProductSchema = z.infer<typeof getSupplierPurchaseSchema>;
//# sourceMappingURL=salesInfo.schema.d.ts.map