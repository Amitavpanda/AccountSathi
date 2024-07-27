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
    totalAmountDue : number
}

interface CashPaid {
    cashPaid : String,
    amountPaid : number,
    amountPaidDescription : String,
    presentAmount : number
    previousAmount : number
    totalAmountDue : number
}



interface ObjectType {
    date : string,
    info : (CashPaid | NotCashPaid)[];
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
            date : format(new Date(detail.date), 'dd/MM/yyyy', { locale: enIN }),
        }
    }) 
    console.log("formattedSalesDuration", formattedSalesDataDuration);

    // const getTotalAmountDueFromSalesInfo = await prisma.salesInfo.findUnique({

    // })

    let flag = 1;
    let BF = 0;
    for(const d of formattedSalesDataDuration){
        if(flag > 1) break;

        if(d.amountPaid === 0 && d.amountPaidDescription === ""){
            BF = d.totalAmountDue - d.amount;
        }
        if(d.amountPaid > 0 && d.amountPaidDescription !== ""){
            BF = d.amountPaid + d.totalAmountDue;
        }
        flag += 1;
    }
    presentAmount = BF;
    for (const d of formattedSalesDataDuration){
        info("i am in");
        if(previousDate !== d.date){
            previousDate = d.date;
            let infoList : (CashPaid | NotCashPaid)[] = [];
            if(d.amountPaid === 0 && d.amountPaidDescription === ""){
                presentAmount += d.amount,
                previousAmount = presentAmount - d.amount;
                const item : NotCashPaid = {
                    cashPaid : "no",
                    stockName : d.stockName,
                    quantity : d.quantity,
                    price : d.price,
                    amount : d.amount,
                    presentAmount : presentAmount,
                    previousAmount : previousAmount,
                    totalAmountDue : d.totalAmountDue
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
            if(d.amountPaid === 0 && d.amountPaidDescription === ""){
                presentAmount += d.amount,
                previousAmount = presentAmount - d.amount;
                const item : NotCashPaid = {
                    cashPaid : "no",
                    stockName : d.stockName,
                    quantity : d.quantity,
                    price : d.price,
                    amount : d.amount,
                    presentAmount : presentAmount,
                    previousAmount : previousAmount,
                    totalAmountDue : d.totalAmountDue
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
    const hotelName = await prisma.salesInfo.findUnique({
        where : {
            id : salesInfoId
        },
        select : {
            name : true
        }
    })

    const hotelAddress = await prisma.salesInfo.findUnique({
        where : {
            id : salesInfoId
        },
        select : {
            address : true
        }
    })

    const startingDateResponse = format(new Date(startingDate), 'MMMM do yyyy', { locale: enIN });
    const endDateResponse = format(new Date(endDate), 'MMMM do yyyy', { locale: enIN });

    console.log("final response", response);
    return {success : true, BF: BF, data : Object.fromEntries(response), hotelName : hotelName, startingDateResponse : startingDateResponse, endDateResponse : endDateResponse, hotelAddress : hotelAddress}
}








