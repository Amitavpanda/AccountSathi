import { z } from "zod";



export const addSupplierPurchaseSchema = z.object({
    nameOfTheSupplier: z.string().min(1).max(255),
    phoneNumber : z.string(),
    address : z.string(), 
    totalAmountDue : z.string(), 
    listOfItems : z.string(),
    accountDetails : z.string().optional(),
    additionalDetails : z.string().optional()
  })


  export const addSupplierPurchaseDetailsSchema = z.object({
    stockName: z.string().min(1).max(255),
    stockNameDetails : z.string().optional(),
    date : z.date(),
    quantity : z.string(), 
    quantityType : z.string().optional(),
    quantityDetails : z.string().optional(),
    price : z.string(), 
    priceDetails : z.string().optional(),
    amountPaid : z.string(),
    amountPaidDescription : z.string(),
    supplierPurchaseId : z.string(),
    dateDescription : z.string().optional(),
    additionalDetails1 : z.string().optional(),
    additionalDetails2 : z.string().optional(),
    isPaymentDone : z.string().optional(),
    extraAmount : z.string().optional(),
    extraAmountDescription : z.string().optional()
  })


  export const addSalesInfoSchema = z.object({
    name: z.string().min(1).max(255),
    phoneNumber : z.string(),
    address : z.string(), 
    propieder : z.string(),
    totalAmountDue : z.string(), 
    accountDetails : z.string().optional(), 
    additionalDetails : z.string().optional()
  })

  export const addSalesDetailsSchema = z.object({
    stockName: z.string().min(1).max(255),
    stockNameDetails : z.string().optional(),
    date : z.date(),
    quantity : z.string(), 
    quantityType : z.string().optional(),
    quantityDetails : z.string().optional(),
    price : z.string(), 
    priceDetails : z.string().optional(),
    amountPaid : z.string(),
    amountPaidDescription : z.string(),
    salesInfoId : z.string(),
    dateDescription : z.string().optional(),
    additionalDetails1 : z.string().optional(),
    additionalDetails2 : z.string().optional(),
    supplierName : z.string().optional(),
    isPaymentDone : z.string().optional(),
    extraAmount : z.string().optional(),
    extraAmountDescription : z.string().optional()
  })

  export const salesDataDurationSchema = z.object({
    salesInfoId : z.string(),
    startingDate : z.date(),
    endDate : z.date()
  })

  export const infoPerDayMonthSchema = z.object({
    date : z.date(),
  })

  export const purchaseDataDurationSchema = z.object({
    purchaseInfoId : z.string(),
    startingDate : z.date(),
    endDate : z.date()
  })