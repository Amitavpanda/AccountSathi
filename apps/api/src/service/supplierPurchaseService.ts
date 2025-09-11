import { PrismaClient, Prisma } from "@repo/db/client";
import { error, info } from "@repo/logs/logs";
const prisma = new PrismaClient();
export async function addSupplierPurchase(input : Prisma.SupplierPurchaseCreateInput){
    try{
        const supplierPurchase = await prisma.supplierPurchase.create({
            data : {
                nameOfTheSupplier : input.nameOfTheSupplier,
                phoneNumber : input.phoneNumber,
                address : input.address,
                totalAmountDue : input.totalAmountDue,
                listOfItems : input.listOfItems,
                accountDetails : input.accountDetails,
                additionalDetails : input.additionalDetails
                
            }
        })

        return {success : true, data : supplierPurchase};
    }
    catch(error){
        console.log("Error adding supplier Purchase", error);
        return {success : false, error : 'Failed to add supplier Purchase'};
    }
}


export async function getAllSuppliers(){
    try{
        const getAllSuppliers = await prisma.supplierPurchase.findMany({
            select : {
                id : true,
                nameOfTheSupplier : true
            }
        });

        return {success : true, data : getAllSuppliers};
    }
    catch(error){
        console.log("Error getting all suppliers", error);
        return {success : false, error : 'Failed to get all Suppliers'};
    }
}


export async function getAllSupplierPurchase(){
    try{
        const suppliers = await prisma.supplierPurchase.findMany();
        return {success : true, data : suppliers};
    }
    catch(error){
        console.log("error in getting suppliers", error);
        return {success : false, error : "failed to get suppliers"};
    }
}













