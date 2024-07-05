import { Prisma, PrismaClient } from "@repo/db/client";
import { GetSalesDetaDurationSchema } from "@repo/validations/getSalesDataDuration";
const prisma = new PrismaClient();

import { format } from 'date-fns';
import { enIN } from 'date-fns/locale';
import { start } from "repl";


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
    const formattedSalesDataDuration = salesDataDuration.map((detail) => {
        return {
            ...detail,
            date : format(new Date(detail.date), 'MMMM do yyyy', { locale: enIN }),
        }
    }) 

    const hotelName = await prisma.salesInfo.findUnique({
        where : {
            id : salesInfoId
        },
        select : {
            name : true
        }
    })

    const startingDateResponse = format(new Date(startingDate), 'MMMM do yyyy', { locale: enIN });
    const endDateResponse = format(new Date(endDate), 'MMMM do yyyy', { locale: enIN });


    return {success : true, data : formattedSalesDataDuration, hotelName : hotelName, startingDateResponse : startingDateResponse, endDateResponse : endDateResponse}
}








