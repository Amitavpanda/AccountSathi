import { z } from "zod";



export const addSupplierPurchaseSchema = z.object({
    nameOfTheSupplier: z.string().min(1).max(255),
    phoneNumber : z.string(),
    address : z.string(), 
    totalAmountDue : z.string(), 
    listOfItems : z.string()
  })


  export const addSupplierPurchaseDetailsSchema = z.object({
    stockName: z.string().min(1).max(255),
    date : z.date(),
    quantity : z.string(), 
    price : z.string(), 
    amountPaid : z.string(),
    amountPaidDescription : z.string(),
    supplierPurchaseId : z.string(),
    dateDescription : z.string().optional()
  })


  export const addSalesInfoSchema = z.object({
    name: z.string().min(1).max(255),
    phoneNumber : z.string(),
    address : z.string(), 
    propieder : z.string(),
    totalAmountDue : z.string(), 
  })

  export const addSalesDetailsSchema = z.object({
    stockName: z.string().min(1).max(255),
    date : z.date().optional(),
    quantity : z.string(), 
    price : z.string(), 
    amountPaid : z.string(),
    amountPaidDescription : z.string(),
    salesInfoId : z.string(),
    dateDescription : z.string().optional()
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