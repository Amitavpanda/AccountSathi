import { PrismaClient, SalesInfo} from "@repo/db/client";
import { error, info } from "@repo/logs/logs";
import { AddSalesInfoSchema } from "../../../../packages/validations/salesInfo.schema.js";
const prisma = new PrismaClient();
export async function addSalesInfo(input : AddSalesInfoSchema){
    const {name, phoneNumber, address, totalAmountDue, propieder} = input.body

    try{
        const salesInfoDetails = await prisma.salesInfo.create({
            data : {
                name : name,
                phoneNumber : phoneNumber,
                address : address,
                propieder : propieder,
                totalAmountDue : totalAmountDue
            }
        })

        return {success : true, data : salesInfoDetails};
    }
    catch(error){
        console.log("Error adding Sales Info", error);
        return {success : false, error : 'Failed to add Sales Info'};
    }
}


export async function getAllSalesInfo(){
    try{
        const  salesInfo = await prisma.salesInfo.findMany();
        return {success : true, data : salesInfo};
    }

    catch(error){
        console.log("error in getting sales Info", error);
        return {success : false, error : "failed to get sales Info"};
    }
}








