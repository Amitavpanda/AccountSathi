import { Prisma, PrismaClient } from "@repo/db/client";
import { GetSalesDetaDurationSchema } from "@repo/validations/getSalesDataDuration";
const prisma = new PrismaClient();



export async function salesDataDurationService(input : GetSalesDetaDurationSchema) {
    const {salesInfoId, startingDate, endDate} = input.body;

    const salesDataDuration = await prisma.salesInfoDetail.findMany({
        where : {
            salesInfoId,
            date : {
                gte : startingDate,
                lte : endDate
            }
        },
        orderBy : {
            date : 'asc'
        }
    })

    return {success : true, data : salesDataDuration}
}








