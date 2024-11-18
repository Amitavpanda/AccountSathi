import { Prisma, PrismaClient , SalesInfoDetail, SupplierPurchaseDetail} from "@repo/db/client";
const prisma = new PrismaClient();
import { startOfDay } from 'date-fns';


async function updateSalesInfoDetailDates() {
    
    try{
        const details = await prisma.supplierPurchaseDetail.findMany();

        for(const detail of details){
            const originalDate = new Date(detail.date);
            const updatedDate = new Date(Date.UTC(originalDate.getUTCFullYear(), originalDate.getUTCMonth(), originalDate.getUTCDate(), 0, 0, 0));
      
            await prisma.supplierPurchaseDetail.update({
                where : {
                    id : detail.id
                },
                data : {
                    date : updatedDate
                }
            })
            console.log(`Updated date for record ID ${detail.id} to ${updatedDate}`);

        }


    }

    catch(error){
    console.error("Error updating dates in SalesInfoDetail table:", error);

    }
    finally{
        await prisma.$disconnect()
    }
}

updateSalesInfoDetailDates();
