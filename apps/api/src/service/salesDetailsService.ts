import { PrismaClient, SupplierPurchase, SupplierPurchaseDetail } from "@repo/db/client";
import { error, info } from "@repo/logs/logs";
const prisma = new PrismaClient();
import { format } from 'date-fns';
import { enIN } from 'date-fns/locale';


import {AddSupplierPurchaseDetailSchema} from "@repo/validations/purchaseDetailSchema";
import { count } from "console";
import { AddSalesDetailsSchema, GetInfoPerDayMonthSchema } from "../../../../packages/validations/salesDetail.schema.js";
import { getInfoPerDay, getInfoPerMonth } from "../utils/salesDetailsUtil.js";
import { late } from "zod";


async function getTotalAmountDueOfTheHotel(salesInfoId: string): Promise<number | null> {
    try {
      // Fetch the SalesDetails record by id
      const salesInfo = await prisma.salesInfo.findUnique({
        where: { id: salesInfoId },
        select: { totalAmountDue: true },
      });
  
      // If the record is found, return the totalAmountDue, otherwise return null
      return salesInfo ? salesInfo.totalAmountDue : null;
    } catch (error) {
      console.error('Error fetching total amount due:', error);
      return null;
    }
  }

  async function hasSalesDetails(salesInfoId: string): Promise<boolean> {
    const count = await prisma.salesInfoDetail.count({
      where: { salesInfoId },
    });
    return count > 0;
  }

  async function getLatestTotalAmountDue(salesInfoId: string): Promise<number | null> {
    try {
      // Fetch the latest entry for the given supplierPurchaseId, sorted by date in descending order
      const latestDetail = await prisma.salesInfoDetail.findFirst({
        where: { salesInfoId },
        orderBy: { createdAt: 'desc' }, // Assuming 'date' field exists and represents the timestamp of the entry
        select: { totalAmountDue: true },
      });
  
      return latestDetail ? latestDetail.totalAmountDue : null;
    } catch (error) {
      console.error('Error fetching latest total amount due:', error);
      return null;
    }
  }


export async function addSalesDetail(input : AddSalesDetailsSchema){

    const {stockName, date, price, priceDetails,quantity, amountPaid, amountPaidDescription, salesInfoId, dateDescription, stockNameDetails, quantityType, quantityDetails, additionalDetails1, additionalDetails2, supplierName, isPaymentDone, extraAmount, extraAmountDescription} = input.body;
    
  
    try{
        const amount : number =  price * quantity;
        let totalAmountDue : number;
        console.log("hasSalesDetails ",hasSalesDetails(salesInfoId));
        const hasSalesDetailsValue = await hasSalesDetails(salesInfoId);
        console.log("hasSalesDetailsValue ",hasSalesDetailsValue);
        if(!hasSalesDetailsValue){
            const totalAmountDueValue= await getTotalAmountDueOfTheHotel(salesInfoId) || 0;
            if(isPaymentDone === 'Yes'){
              totalAmountDue = totalAmountDueValue;
            }
            else {
              totalAmountDue = (totalAmountDueValue + amount + extraAmount) - amountPaid;
            }
            console.log("totalAmountDue", totalAmountDue);
        }
        else{
            const latestTotalAmountDue = await getLatestTotalAmountDue(salesInfoId) || 0;
            if(isPaymentDone === 'Yes'){
              totalAmountDue = latestTotalAmountDue;
            }
            else {
              totalAmountDue = (latestTotalAmountDue + amount + extraAmount) - amountPaid;
            }
            console.log("totalAmountDue else", totalAmountDue);
        }

        await prisma.salesInfo.update({
            where: { id: salesInfoId },
            data: { totalAmountDue },
          });
          let hotelName;
           hotelName = await prisma.salesInfo.findUnique({
            where : {
              id : salesInfoId
            },
            select : {
              name : true
            }
          })
          hotelName = hotelName?.name;

          const originalDate = new Date(date);
          const updatedDate = new Date(Date.UTC(originalDate.getUTCFullYear(), originalDate.getUTCMonth(), originalDate.getUTCDate(), 0, 0, 0));
          

          console.log("hotelName", hotelName);
        const salesDetails = await prisma.salesInfoDetail.create({
            data : {
                stockName : stockName,
                stockNameDetails : stockNameDetails,
                date : updatedDate,
                quantity : quantity,
                quantityType : quantityType,
                quantityDetails : quantityDetails,
                price : price,
                priceDetails : priceDetails,
                amount : amount,
                totalAmountDue : totalAmountDue,
                amountPaid : amountPaid,
                amountPaidDescription : amountPaidDescription, 
                extraAmount : extraAmount,
                extraAmountDescription : extraAmountDescription,
                dateDescription : dateDescription,
                salesInfoId : salesInfoId,
                hotelName : hotelName,
                additonalDetails1 : additionalDetails1,
                additonalDetails2 : additionalDetails2,
                supplierName : supplierName,
                isPaymentDone : isPaymentDone
            }
        })

        return {success : true, data : salesDetails};
    }
    catch(error){
        console.log("Error adding sales Info Details", error);
        return {success : false, error : 'Failed to add sales Info Details'};
    }
}


export async function getSalesDetailsBySalesInfoId(salesInfoId :string){
    try{
        const details = await prisma.salesInfoDetail.findMany({
            where: { salesInfoId : salesInfoId},
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
        console.log("error in getting sales details", error);
        return {success : false, error : "failed to get sales details"};
    }
}

export async function getInfoPerDayMonth(input : GetInfoPerDayMonthSchema){
  const {date, month} = input.body;
  let perDayData;
  let perMonthData;
  let perDayDataPurchase
  try{
      if(date != null){
      perDayData = await getInfoPerDay(date);
      // perDayDataPurchase = await getInfoPerDayPurchase(date);
      // perMonthData = await getInfoPerMonth(month);
      }
      // else if(month !=null){
      //  perMonthData = await getInfoPerMonth(month);
      // }
      // else if(date != null){
      //   perDayData = await getInfoPerDay(date);
      // }
      else {
        return {success : false, error : "please provide date or month/ date or month is null"}
      }
      if (perDayData instanceof Map) {
        return { success: true, perDayData: Object.fromEntries(perDayData) };
      } else {
        return { success: false, error: "error in getting data else" };
      }
  }

  catch(error){
      console.log("error in getting sales details", error);
      return {success : false, error : "failed to get sales details"};
  }
}