import { Prisma, PrismaClient } from "@repo/db/client";
import { info } from "@repo/logs/logs";
import { GetSalesDetaDurationSchema } from "@repo/validations/getSalesDataDuration";
const prisma = new PrismaClient();

import { format } from 'date-fns';
import { enIN } from 'date-fns/locale';
import { existsSync } from "fs";
import { start } from "repl";
import { object } from "zod";



interface NotCashPaid  {
    cashPaid : String,
    stockName : String,
    quantity : number,
    price : number,
    amount : number,
    presentAmount : number,
    previousAmount : number
    totalAmountDue : number,
    isPaymentDone : string | null

}

interface CashPaid {
    cashPaid : String,
    amountPaid : number,
    amountPaidDescription : String,
    presentAmount : number
    previousAmount : number
    totalAmountDue : number
}

interface ExtraAmount {
    extraAmount : number,
    extraAmountDescription : string | null,
    presentAmount : number,
    previousAmount : number
    totalAmountDue : number,
}


interface ObjectType {
    date : string,
    info : (CashPaid | NotCashPaid | ExtraAmount)[];
    finalAmount : number 
}
export async function salesDataDurationService(input : GetSalesDetaDurationSchema) {
    console.log("I am inside saleDataDurationService");
    const {salesInfoId, startingDate, endDate} = input.body;
    // let response : Map<string, ObjectType>[] = [];
    let presentAmount : number = 0;
    let previousAmount : number = 0;
    let previousDate : string = "";
    let response = new Map<string, ObjectType>();
    
    // Convert date strings to ISO DateTime format for Prisma
    const startDateTime = new Date(startingDate + 'T00:00:00.000Z').toISOString();
    const endDateTime = new Date(endDate + 'T23:59:59.999Z').toISOString();
    
    const salesDataDuration = await prisma.salesInfoDetail.findMany({
        where : {
            salesInfoId,
            date : {
                gte : startDateTime,
                lte : endDateTime
            }
        },
        orderBy : [
            { date : 'asc' },
            { createdAt : 'asc' }
        ]
    })
    const formattedSalesDataDuration = salesDataDuration.map((detail: any) => {
        return {
            ...detail,
            date : format(new Date(detail.date), 'dd/MM/yyyy hh:mm a', { locale: enIN }),
        }
    }) 
    console.log("formattedSalesDuration", formattedSalesDataDuration);

    // Calculate BF (Brought Forward) from the last entry BEFORE the selected date range
    let BF = 0;
    
    // Get the last entry before the starting date to use as BF
    const entryBeforeRange = await prisma.salesInfoDetail.findFirst({
        where: {
            salesInfoId,
            date: {
                lt: startDateTime  // Less than start date
            }
        },
        orderBy: [
            { date: 'desc' },
            { createdAt: 'desc' }
        ]
    });

    if (entryBeforeRange) {
        // BF is the totalAmountDue from the last entry before this date range
        BF = entryBeforeRange.totalAmountDue;
    } else {
        // No entries before the range, BF is 0
        BF = 0;
    }
    
    presentAmount = BF;
    for (const d of formattedSalesDataDuration){
        info("i am in");
        if(previousDate !== d.date){
            previousDate = d.date;
            let infoList : (CashPaid | NotCashPaid | ExtraAmount)[] = [];


            

             if(d.extraAmount && d.extraAmount > 0 && d.extraAmountDescription !== ""){
                presentAmount += d.extraAmount;
                previousAmount = presentAmount - d.extraAmount;
                const item : ExtraAmount = {
                    extraAmount : d.extraAmount,
                    extraAmountDescription : d.extraAmountDescription,
                    presentAmount : presentAmount,
                    previousAmount : previousAmount,
                    totalAmountDue : d.totalAmountDue
                }
                infoList.push(item);
                console.log("info list", infoList);

            }

            else if(d.amountPaid === 0 && d.amountPaidDescription === ""){
                if(d.isPaymentDone === 'Yes'){
                    presentAmount = presentAmount;
                    previousAmount = presentAmount;
                }
                else{
                    presentAmount += d.amount;
                    previousAmount = presentAmount - d.amount;
                }
                const item : NotCashPaid = {
                    cashPaid : "no",
                    stockName : d.stockName,
                    quantity : d.quantity,
                    price : d.price,
                    amount : d.amount,
                    presentAmount : presentAmount,
                    previousAmount : previousAmount,
                    totalAmountDue : d.totalAmountDue,
                    isPaymentDone : d.isPaymentDone
                }
                infoList.push(item);
                console.log("info list", infoList);
            }
            else if(d.amountPaid > 0 && d.amountPaidDescription !== "" ){
                presentAmount -= d.amountPaid
                previousAmount = d.amountPaid + presentAmount;

                const item : CashPaid = {
                    cashPaid : "yes",
                    amountPaid : d.amountPaid,
                    amountPaidDescription : d.amountPaidDescription,
                    presentAmount : presentAmount,
                    previousAmount : previousAmount,
                    totalAmountDue : d.totalAmountDue
                }
                infoList.push(item);
                console.log("info list", infoList);
            }

            const object = {
                date : d.date,
                info : infoList,
                finalAmount : presentAmount,
                dateDescription : d.dateDescription
            }
            response.set(d.date, object);
            console.log("response", response);
        }
        else{
            let existingData : ObjectType | undefined  = response.get(d.date)  ;
            console.log("existing data", existingData);
            
             if(d.extraAmount && d.extraAmount > 0 && d.extraAmountDescription !== ""){
                presentAmount += d.extraAmount;
                previousAmount = presentAmount - d.extraAmount;
                const item : ExtraAmount = {
                    extraAmount : d.extraAmount,
                    extraAmountDescription : d.extraAmountDescription,
                    presentAmount : presentAmount,
                    previousAmount : previousAmount,
                    totalAmountDue : d.totalAmountDue
                }
                existingData?.info.push(item);
                console.log("response inside extraAmount,", response);
                if (existingData) {
                    existingData.finalAmount = presentAmount;
                  }
            }

            else if(d.amountPaid === 0 && d.amountPaidDescription === ""){
                if(d.isPaymentDone === 'Yes'){
                    presentAmount = presentAmount;
                    previousAmount = presentAmount;
                }
                else{
                    presentAmount += (d.amount + (d.extraAmount || 0));
                    previousAmount = presentAmount - (d.amount + (d.extraAmount || 0));
                }
                const item : NotCashPaid = {
                    cashPaid : "no",
                    stockName : d.stockName,
                    quantity : d.quantity,
                    price : d.price,
                    amount : d.amount,
                    presentAmount : presentAmount,
                    previousAmount : previousAmount,
                    totalAmountDue : d.totalAmountDue,
                    isPaymentDone : d.isPaymentDone
                }
                existingData?.info.push(item);
                console.log("response inside amount not paid,", response);    
                if (existingData) {
                    existingData.finalAmount = presentAmount;
                  }
            }
            else if(d.amountPaid > 0 && d.amountPaidDescription !== "" ){
                presentAmount -= d.amountPaid
                previousAmount = d.amountPaid + presentAmount;

                const item : CashPaid = {
                    cashPaid : "yes",
                    amountPaid : d.amountPaid,
                    amountPaidDescription : d.amountPaidDescription,
                    presentAmount : presentAmount,
                    previousAmount : previousAmount,
                    totalAmountDue : d.totalAmountDue
                }
                existingData?.info.push(item);
                console.log("response inside amountpaid,", response);
                if (existingData) {
                    existingData.finalAmount = presentAmount;
                  }
            }

            
        }

        

    }

    // console.log("final response", response);
    const hotelInfo = await prisma.salesInfo.findUnique({
        where : {
            id : salesInfoId
        },
        select : {
            name : true,
            address : true,
            phoneNumber : true,
            totalAmountDue : true
        }
    })

    const startingDateResponse = format(new Date(startingDate), 'MMMM do yyyy', { locale: enIN });
    const endDateResponse = format(new Date(endDate), 'MMMM do yyyy', { locale: enIN });

    console.log("final response", response);
    return {
        success : true,
        BF: BF,
        data : Object.fromEntries(response),
        hotelName : { name: hotelInfo?.name },
        hotelAddress : { address: hotelInfo?.address },
        hotelPhone : { phoneNumber: hotelInfo?.phoneNumber },
        hotelTotalAmountDue : hotelInfo?.totalAmountDue ?? 0,
        startingDateResponse,
        endDateResponse
    }
}








