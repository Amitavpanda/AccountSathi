import { PrismaClient, SupplierPurchase, SupplierPurchaseDetail } from "@repo/db/client";
import { error, info } from "@repo/logs/logs";
const prisma = new PrismaClient();
import {AddSupplierPurchaseDetailSchema} from "@repo/validations/purchaseDetailSchema";
import { count } from "console";
import { format } from 'date-fns';
import { enIN } from 'date-fns/locale';


async function getTotalAmountDueOfTheSupplier(supplierPurchaseId: string): Promise<number | null> {
    try {
      // Fetch the SupplierPurchase record by id
      const supplierPurchase = await prisma.supplierPurchase.findUnique({
        where: { id: supplierPurchaseId },
        select: { totalAmountDue: true },
      });
  
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
    const {stockName, date, price, quantity, supplierPurchaseId, amountPaid, amountPaidDescription, dateDescription} = requestData








    try{
        const amount : number =  price * quantity;
        let totalAmountDue : number ;

        if(!hasSupplierPurchaseDetails){
            totalAmountDue = await getTotalAmountDueOfTheSupplier(supplierPurchaseId) || 0;
        }
        else{
            const latestTotalAmountDue = await getLatestTotalAmountDue(supplierPurchaseId) || 0;
            totalAmountDue = (latestTotalAmountDue + amount) - amountPaid;
        }

        await prisma.supplierPurchase.update({
            where: { id: supplierPurchaseId },
            data: { totalAmountDue },
          });

        const supplierPurchaseDetail = await prisma.supplierPurchaseDetail.create({
            data : {
                stockName : stockName,
                date : date,
                quantity : quantity,
                price : price,
                amount : amount,
                totalAmountDue : totalAmountDue,
                amountPaid : amountPaid,
                amountPaidDescription : amountPaidDescription,
                dateDescription : dateDescription,
                supplierPurchaseId : supplierPurchaseId
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








