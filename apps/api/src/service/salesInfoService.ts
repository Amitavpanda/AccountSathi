import { PrismaClient, Prisma } from "@repo/db/client";
import { error, info } from "@repo/logs/logs";
import { AddSalesInfoSchema, UpdateSalesInfoSchema } from "../../../../packages/validations/salesInfo.schema.js";
const prisma = new PrismaClient();
export async function addSalesInfo(input : AddSalesInfoSchema){
    const {name, phoneNumber, address, totalAmountDue, propieder, accountDetails, additionalDetails, city} = input.body

    try{
        const salesInfoDetails = await prisma.salesInfo.create({
            data : {
                name : name,
                phoneNumber : phoneNumber,
                address : address,
                propieder : propieder,
                totalAmountDue : totalAmountDue,
                accountDetails : accountDetails,
                additionalDetails : additionalDetails,
                city : city
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
        let totalAmountDueSum = 0;
        console.log("salesInfoDetails",salesInfo);
        for(const salesInfoIndex of salesInfo){
            totalAmountDueSum += salesInfoIndex.totalAmountDue;
        }
        return {success : true, data : salesInfo, totalAmountDueSum : totalAmountDueSum};
    }

    catch(error){
        console.log("error in getting sales Info", error);
        return {success : false, error : "failed to get sales Info"};
    }
}


export async function updateSalesInfo(input: UpdateSalesInfoSchema) {
    const { id, city, name, phoneNumber, address, propieder, accountDetails, additionalDetails, hotelExpiry, status } = input.body;

    try {
        const updateData: Prisma.SalesInfoUpdateInput = {};
        
        if (city !== undefined) updateData.city = city;
        if (name !== undefined) updateData.name = name;
        if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
        if (address !== undefined) updateData.address = address;
        if (propieder !== undefined) updateData.propieder = propieder;
        if (accountDetails !== undefined) updateData.accountDetails = accountDetails;
        if (additionalDetails !== undefined) updateData.additionalDetails = additionalDetails;
        if (hotelExpiry !== undefined) updateData.hotelExpiry = hotelExpiry;
        if (status !== undefined) updateData.status = status;

        const updatedSalesInfo = await prisma.salesInfo.update({
            where: { id },
            data: updateData
        });

        return { success: true, data: updatedSalesInfo };
    } catch (error) {
        console.log("Error updating Sales Info", error);
        return { success: false, error: 'Failed to update Sales Info' };
    }
}


export async function getSalesOverview() {
    try {
        const salesInfoList = await prisma.salesInfo.findMany({
            include: {
                details: true
            }
        });

        let totalAmountDueSum = 0;

        const overviewData = salesInfoList.map((salesInfo) => {
            totalAmountDueSum += salesInfo.totalAmountDue;

            // Filter payment entries (stockName === "null" AND amountPaid > 0)
            // Note: trim stockName to handle entries with trailing spaces like "null "
            const paymentEntries = salesInfo.details.filter(detail => {
                const trimmedStockName = detail.stockName?.trim() || "";
                return trimmedStockName === "null" && detail.amountPaid > 0;
            });
            
            // Filter rice supply entries (stockName !== "null" AND has value AND quantity > 0 AND price > 0 AND amountPaid === 0)
            const riceSupplyEntries = salesInfo.details.filter(detail => {
                const trimmedStockName = detail.stockName?.trim() || "";
                return trimmedStockName !== "null" && 
                    trimmedStockName !== "" &&
                    detail.quantity > 0 && 
                    detail.price > 0 && 
                    detail.amountPaid === 0;
            });

            // Find the most recent payment by comparing dates
            let lastPayment = null;
            for (const entry of paymentEntries) {
                if (!lastPayment || new Date(entry.date) > new Date(lastPayment.date)) {
                    lastPayment = entry;
                }
            }

            // Find the most recent rice supply by comparing dates
            let lastRiceSupply = null;
            for (const entry of riceSupplyEntries) {
                if (!lastRiceSupply || new Date(entry.date) > new Date(lastRiceSupply.date)) {
                    lastRiceSupply = entry;
                }
            }

            return {
                id: salesInfo.id,
                name: salesInfo.name,
                totalAmountDue: salesInfo.totalAmountDue,
                city: salesInfo.city,
                hotelExpiry: salesInfo.hotelExpiry,
                status: salesInfo.status,
                lastPaymentDate: lastPayment ? lastPayment.date : null,
                lastRiceSupplyDate: lastRiceSupply ? lastRiceSupply.date : null
            };
        });

        return { success: true, data: overviewData, totalAmountDueSum };
    } catch (error) {
        console.log("Error getting sales overview", error);
        return { success: false, error: 'Failed to get sales overview' };
    }
}








