import { PrismaClient, SupplierPurchase, SupplierPurchaseDetail } from "@repo/db/client";
import { error, info } from "@repo/logs/logs";
const prisma = new PrismaClient();
import {AddSupplierPurchaseDetailSchema} from "@repo/validations/purchaseDetailSchema";
import { count, log } from "console";
import { format } from 'date-fns';
import { enIN } from 'date-fns/locale';


async function getTotalAmountDueOfTheSupplier(supplierPurchaseId: string): Promise<number | null> {
    try {
      // Fetch the SupplierPurchase record by id
      console.log("supplierPurchaseId : ", supplierPurchaseId)
      const supplierPurchase = await prisma.supplierPurchase.findUnique({
        where: { id: supplierPurchaseId },
        select: { totalAmountDue: true },
      });
      
      console.log("totalAmountDue : ", supplierPurchase?.totalAmountDue);
      // If the record is found, return the totalAmountDue, otherwise return null
      return supplierPurchase ? supplierPurchase.totalAmountDue : null;
    } catch (error) {
      console.error('Error fetching total amount due:', error);
      return null;
    }
  }

  async function hasSupplierPurchaseDetails(supplierPurchaseId: string): Promise<boolean> {
    const count = await prisma.supplierPurchaseDetail.count({
      where: { supplierPurchaseId },
    });
    return count > 0;
  }

  async function getLatestTotalAmountDue(supplierPurchaseId: string): Promise<number | null> {
    try {
      // Fetch the latest entry for the given supplierPurchaseId, sorted by date in descending order
      const latestDetail = await prisma.supplierPurchaseDetail.findFirst({
        where: { supplierPurchaseId },
        orderBy: { createdAt: 'desc' }, // Assuming 'date' field exists and represents the timestamp of the entry
        select: { totalAmountDue: true },
      });
  
      return latestDetail ? latestDetail.totalAmountDue : null;
    } catch (error) {
      console.error('Error fetching latest total amount due:', error);
      return null;
    }
  }


export async function addSupplierPurchaseDetail(input : AddSupplierPurchaseDetailSchema){
    console.log("the input inside service is ", input);
    const requestData = input.body;
    console.log("the requestData", requestData);
    const {stockName, stockNameDetails, date, price, priceDetails, quantity, quantityDetails, quantityType, supplierPurchaseId, amountPaid, amountPaidDescription, dateDescription, additionalDetails1, additionalDetails2, isPaymentDone} = requestData








    try{
        const amount : number =  price * quantity;
        let totalAmountDue : number ;

        if(!hasSupplierPurchaseDetails){
            const totalAmountDueValue = await getTotalAmountDueOfTheSupplier(supplierPurchaseId) || 0;
            console.log("totalAmountDueValue inside addSupplierPurchaseDetail method: ", totalAmountDueValue);
            if(isPaymentDone === 'Yes'){
              totalAmountDue = totalAmountDueValue;
            }
            else {
              totalAmountDue = (totalAmountDueValue + amount) - amountPaid;
            }
            console.log("totalAmountDue", totalAmountDue);
        }
        else{
            const latestTotalAmountDue = await getLatestTotalAmountDue(supplierPurchaseId) || 0;
            if(isPaymentDone === 'Yes'){
              totalAmountDue = latestTotalAmountDue;
            }
            else {
              totalAmountDue = (latestTotalAmountDue + amount) - amountPaid;
            }
            console.log("totalAmountDue", totalAmountDue);
        }

        await prisma.supplierPurchase.update({
            where: { id: supplierPurchaseId },
            data: { totalAmountDue },
          });

        
        const supplierName = await prisma.supplierPurchase.findUnique({
          where : {
            id : supplierPurchaseId
          },
          select : {
            nameOfTheSupplier : true
          }
        })

        const supplierPurchaseDetail = await prisma.supplierPurchaseDetail.create({
            data : {
                stockName : stockName,
                stockNameDetails : stockNameDetails,
                date : date,
                quantity : quantity,
                quantityType : quantityType,
                quantityDetails : quantityDetails,
                price : price,
                priceDetails : priceDetails,
                amount : amount,
                totalAmountDue : totalAmountDue,
                amountPaid : amountPaid,
                amountPaidDescription : amountPaidDescription,
                dateDescription : dateDescription,
                supplierPurchaseId : supplierPurchaseId,
                additionalDetails1 : additionalDetails1,
                additionalDetails2 : additionalDetails2,
                isPaymentDone : isPaymentDone,
                supplierName : supplierName?.nameOfTheSupplier
            }
        })

        return {success : true, data : supplierPurchaseDetail};
    }
    catch(error){
        console.log("Error adding supplier Purchase Detail", error);
        return {success : false, error : 'Failed to add supplier Purchase Detail'};
    }
}


export async function getSupplierPurchaseDetailBySupplierId(supplierId :string){
    try{
        const details = await prisma.supplierPurchaseDetail.findMany({
            where: { supplierPurchaseId : supplierId},
            orderBy: { date: 'asc' }, // Optional: Order by date ascending
          });

          const formattedDetails = details.map((detail) => {
            return {
              ...detail,
              date: format(new Date(detail.date), 'MMMM do yyyy', { locale: enIN }),
            };
          });

          return{success : true, data : formattedDetails}
    }

    catch(error){
        console.log("error in getting supplier purchase details", error);
        return {success : false, error : "failed to get supplier purchase details"};
    }
}








