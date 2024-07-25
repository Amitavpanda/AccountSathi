import { PrismaClient, SupplierPurchase, SupplierPurchaseDetail } from "@repo/db/client";
import { error, info } from "@repo/logs/logs";
const prisma = new PrismaClient();
import { format } from 'date-fns';
import { enIN } from 'date-fns/locale';


import {AddSupplierPurchaseDetailSchema} from "@repo/validations/purchaseDetailSchema";
import { count } from "console";
import { AddSalesDetailsSchema } from "../../../../packages/validations/salesDetail.schema.js";


async function getTotalAmountDueOfTheHotel(salesInfoId: string): Promise<number | null> {
    try {
      // Fetch the SupplierPurchase record by id
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

    const {stockName, date, price, quantity, amountPaid, amountPaidDescription, salesInfoId} = input.body;
    

    try{
        const amount : number =  price * quantity;
        let totalAmountDue : number;
        console.log("hasSalesDetails ",hasSalesDetails(salesInfoId));
        const hasSalesDetailsValue = await hasSalesDetails(salesInfoId);
        console.log("hasSalesDetailsValue ",hasSalesDetailsValue);
        if(!hasSalesDetailsValue){
            const totalAmountDueValue= await getTotalAmountDueOfTheHotel(salesInfoId) || 0;
            totalAmountDue = (totalAmountDueValue + amount) - amountPaid;
            console.log("totalAmountDue", totalAmountDue);
        }
        else{
            const latestTotalAmountDue = await getLatestTotalAmountDue(salesInfoId) || 0;
            totalAmountDue = (latestTotalAmountDue + amount) - amountPaid;
            console.log("totalAmountDue else", totalAmountDue);
        }

        await prisma.salesInfo.update({
            where: { id: salesInfoId },
            data: { totalAmountDue },
          });

        const salesDetails = await prisma.salesInfoDetail.create({
            data : {
                stockName : stockName,
                date : date,
                quantity : quantity,
                price : price,
                amount : amount,
                totalAmountDue : totalAmountDue,
                amountPaid : amountPaid,
                amountPaidDescription : amountPaidDescription,
                salesInfoId : salesInfoId
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








