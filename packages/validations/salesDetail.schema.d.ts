import * as z from "zod";
export declare const addSalesDetailsSchema: z.ZodObject<{
    body: z.ZodObject<{
        stockName: z.ZodString;
        stockNameDetails: z.ZodOptional<z.ZodString>;
        date: z.ZodString;
        quantity: z.ZodNumber;
        quantityType: z.ZodOptional<z.ZodString>;
        quantityDetails: z.ZodOptional<z.ZodString>;
        price: z.ZodNumber;
        priceDetails: z.ZodOptional<z.ZodString>;
        amountPaid: z.ZodNumber;
        amountPaidDescription: z.ZodString;
        dateDescription: z.ZodString;
        salesInfoId: z.ZodString;
        additionalDetails1: z.ZodOptional<z.ZodString>;
        additionalDetails2: z.ZodOptional<z.ZodString>;
        supplierName: z.ZodOptional<z.ZodString>;
        isPaymentDone: z.ZodOptional<z.ZodString>;
        extraAmount: z.ZodNumber;
        extraAmountDescription: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        date: string;
        stockName: string;
        quantity: number;
        price: number;
        amountPaid: number;
        amountPaidDescription: string;
        dateDescription: string;
        extraAmount: number;
        salesInfoId: string;
        stockNameDetails?: string | undefined;
        quantityType?: string | undefined;
        quantityDetails?: string | undefined;
        priceDetails?: string | undefined;
        additionalDetails1?: string | undefined;
        additionalDetails2?: string | undefined;
        isPaymentDone?: string | undefined;
        extraAmountDescription?: string | undefined;
        supplierName?: string | undefined;
    }, {
        date: string;
        stockName: string;
        quantity: number;
        price: number;
        amountPaid: number;
        amountPaidDescription: string;
        dateDescription: string;
        extraAmount: number;
        salesInfoId: string;
        stockNameDetails?: string | undefined;
        quantityType?: string | undefined;
        quantityDetails?: string | undefined;
        priceDetails?: string | undefined;
        additionalDetails1?: string | undefined;
        additionalDetails2?: string | undefined;
        isPaymentDone?: string | undefined;
        extraAmountDescription?: string | undefined;
        supplierName?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        date: string;
        stockName: string;
        quantity: number;
        price: number;
        amountPaid: number;
        amountPaidDescription: string;
        dateDescription: string;
        extraAmount: number;
        salesInfoId: string;
        stockNameDetails?: string | undefined;
        quantityType?: string | undefined;
        quantityDetails?: string | undefined;
        priceDetails?: string | undefined;
        additionalDetails1?: string | undefined;
        additionalDetails2?: string | undefined;
        isPaymentDone?: string | undefined;
        extraAmountDescription?: string | undefined;
        supplierName?: string | undefined;
    };
}, {
    body: {
        date: string;
        stockName: string;
        quantity: number;
        price: number;
        amountPaid: number;
        amountPaidDescription: string;
        dateDescription: string;
        extraAmount: number;
        salesInfoId: string;
        stockNameDetails?: string | undefined;
        quantityType?: string | undefined;
        quantityDetails?: string | undefined;
        priceDetails?: string | undefined;
        additionalDetails1?: string | undefined;
        additionalDetails2?: string | undefined;
        isPaymentDone?: string | undefined;
        extraAmountDescription?: string | undefined;
        supplierName?: string | undefined;
    };
}>;
export declare const getInfoPerDayMonthSchema: z.ZodObject<{
    body: z.ZodObject<{
        date: z.ZodOptional<z.ZodString>;
        month: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        date?: string | undefined;
        month?: string | undefined;
    }, {
        date?: string | undefined;
        month?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        date?: string | undefined;
        month?: string | undefined;
    };
}, {
    body: {
        date?: string | undefined;
        month?: string | undefined;
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
        stockName: z.ZodString;
        stockNameDetails: z.ZodOptional<z.ZodString>;
        date: z.ZodString;
        quantity: z.ZodNumber;
        quantityType: z.ZodOptional<z.ZodString>;
        quantityDetails: z.ZodOptional<z.ZodString>;
        price: z.ZodNumber;
        priceDetails: z.ZodOptional<z.ZodString>;
        amountPaid: z.ZodNumber;
        amountPaidDescription: z.ZodString;
        dateDescription: z.ZodString;
        salesInfoId: z.ZodString;
        additionalDetails1: z.ZodOptional<z.ZodString>;
        additionalDetails2: z.ZodOptional<z.ZodString>;
        supplierName: z.ZodOptional<z.ZodString>;
        isPaymentDone: z.ZodOptional<z.ZodString>;
        extraAmount: z.ZodNumber;
        extraAmountDescription: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        date: string;
        stockName: string;
        quantity: number;
        price: number;
        amountPaid: number;
        amountPaidDescription: string;
        dateDescription: string;
        extraAmount: number;
        salesInfoId: string;
        stockNameDetails?: string | undefined;
        quantityType?: string | undefined;
        quantityDetails?: string | undefined;
        priceDetails?: string | undefined;
        additionalDetails1?: string | undefined;
        additionalDetails2?: string | undefined;
        isPaymentDone?: string | undefined;
        extraAmountDescription?: string | undefined;
        supplierName?: string | undefined;
    }, {
        date: string;
        stockName: string;
        quantity: number;
        price: number;
        amountPaid: number;
        amountPaidDescription: string;
        dateDescription: string;
        extraAmount: number;
        salesInfoId: string;
        stockNameDetails?: string | undefined;
        quantityType?: string | undefined;
        quantityDetails?: string | undefined;
        priceDetails?: string | undefined;
        additionalDetails1?: string | undefined;
        additionalDetails2?: string | undefined;
        isPaymentDone?: string | undefined;
        extraAmountDescription?: string | undefined;
        supplierName?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        salesInfoId: string;
    };
    body: {
        date: string;
        stockName: string;
        quantity: number;
        price: number;
        amountPaid: number;
        amountPaidDescription: string;
        dateDescription: string;
        extraAmount: number;
        salesInfoId: string;
        stockNameDetails?: string | undefined;
        quantityType?: string | undefined;
        quantityDetails?: string | undefined;
        priceDetails?: string | undefined;
        additionalDetails1?: string | undefined;
        additionalDetails2?: string | undefined;
        isPaymentDone?: string | undefined;
        extraAmountDescription?: string | undefined;
        supplierName?: string | undefined;
    };
}, {
    params: {
        salesInfoId: string;
    };
    body: {
        date: string;
        stockName: string;
        quantity: number;
        price: number;
        amountPaid: number;
        amountPaidDescription: string;
        dateDescription: string;
        extraAmount: number;
        salesInfoId: string;
        stockNameDetails?: string | undefined;
        quantityType?: string | undefined;
        quantityDetails?: string | undefined;
        priceDetails?: string | undefined;
        additionalDetails1?: string | undefined;
        additionalDetails2?: string | undefined;
        isPaymentDone?: string | undefined;
        extraAmountDescription?: string | undefined;
        supplierName?: string | undefined;
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
export type AddSalesDetailsSchema = z.infer<typeof addSalesDetailsSchema>;
export type UpdateOrder = z.infer<typeof updateOrderSchema>;
export type DeleteOrderSchema = z.infer<typeof updateOrderSchema>;
export type GetProductSchema = z.infer<typeof getSupplierPurchaseSchema>;
export type GetInfoPerDayMonthSchema = z.infer<typeof getInfoPerDayMonthSchema>;
//# sourceMappingURL=salesDetail.schema.d.ts.map