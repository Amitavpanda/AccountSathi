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
    supplierPurchaseId : z.string()
  })