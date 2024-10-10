import { PrismaClient } from "@repo/db/client";
import { error, info } from "@repo/logs/logs";

const prisma = new PrismaClient();

interface supplierListType {
    name: string,
    stockNameDetails: string | null,
    quantity: number,
    quantityType: string | null,
    price: number,
    amount: number,
    additionalDetails: string | null
}

interface debitItemType {
    amountPaid: number,
    amountPaidDescription: string,
    additionalDetails: string | null
}
interface ObjectType {
    hotelName: string | null,
    info: (supplierListType)[]
}


export async function getInfoPerDayPurchase(date: string) {
    console.log("Inside getInfoPerDayPurchase");
    const Date = date.split('T')[0];
    try {
        const response = await prisma.supplierPurchaseDetail.findMany({
            where: {
                date: {
                    gte: `${Date}T00:00:00.000Z`,
                    lte: `${Date}T23:59:59.999Z`
                }
            }
        });
        const ans = new Map<String | null, Object>();
        console.log("response", response);


        for (const obj of response) {
            if (ans.has(obj.supplierPurchaseId)) {
            }
            else {
                let supplierList: (supplierListType)[] = [];
                let debitList: (debitItemType)[] = [];
                if (obj.amountPaid === 0 && obj.amountPaidDescription === "") {
                    const supplierListItem: supplierListType = {
                        name: obj.stockName,
                        stockNameDetails: obj.stockNameDetails,
                        quantity: obj.quantity,
                        quantityType: obj.quantityType,
                        price: obj.price,
                        amount: obj.amount,
                        additionalDetails: obj.additionalDetails1
                    }
                    console.log("supplierListItem", supplierListItem)
                    supplierList.push(supplierListItem);
                }
                else if (obj.amountPaid > 0 && obj.amountPaidDescription !== "") {
                    const debitItem: debitItemType = {
                        amountPaid: obj.amountPaid,
                        amountPaidDescription: obj.amountPaidDescription,
                        additionalDetails: obj.additionalDetails1
                    }
                    console.log("collectionItem", debitItem);
                    debitList.push(debitItem);
                }


                const object = {
                    hotelName: obj,
                    info: hotelList,
                    collectionInfo: collectionList
                }
                console.log("object", object);
                ans.set(obj.salesInfoId, object);
                console.log("ans is ", ans);
            }
        }

    }

    catch (error) {
        console.error("the error is ", error);
    }
}

export async function getInfoPerDay(date: string) {
    console.log("isnide getInfoPerDay");
    const Date = date.split('T')[0];
    try {
        const response = await prisma.salesInfoDetail.findMany({
            where: {
                date: {
                    gte: `${Date}T00:00:00.000Z`,
                    lte: `${Date}T23:59:59.999Z`
                }
            }
        });
        const ans = new Map<String | null, Object>();
        console.log("response", response);
        for (const obj of response) {

            if (ans.has(obj.salesInfoId)) {
                if (obj.amountPaid === 0 && obj.amountPaidDescription === "") {
                    const hotelListItem: hotelListType = {
                        name: obj.stockName,
                        stockNameDetails: obj.stockNameDetails,
                        quantity: obj.quantity,
                        quantityType: obj.quantityType,
                        price: obj.price,
                        amount: obj.amount,
                        supplier: obj.supplierName,
                        additionalDetails: obj.additonalDetails1
                    }
                    let existingData: any = ans.get(obj.salesInfoId);
                    console.log("existingData", existingData);
                    existingData?.info.push(hotelListItem);
                }
                else if (obj.amountPaid > 0 && obj.amountPaidDescription !== "") {
                    const collectionItem: collectionItemType = {
                        hotelName: obj.hotelName,
                        amountPaid: obj.amountPaid,
                        amountPaidDescription: obj.amountPaidDescription,
                        additionalDetails: obj.additonalDetails1
                    }
                    let existingData: any = ans.get(obj.salesInfoId);
                    console.log("existingData", existingData);
                    existingData?.collectionInfo.push(collectionItem);
                }
                console.log("ans", ans);
            }
            else {
                let hotelList: (hotelListType)[] = [];
                let collectionList: (collectionItemType)[] = [];
                if (obj.amountPaid === 0 && obj.amountPaidDescription === "") {
                    const hotelListItem: hotelListType = {
                        name: obj.stockName,
                        stockNameDetails: obj.stockNameDetails,
                        quantity: obj.quantity,
                        quantityType: obj.quantityType,
                        price: obj.price,
                        amount: obj.amount,
                        supplier: obj.supplierName,
                        additionalDetails: obj.additonalDetails1
                    }
                    console.log("hotelListITem", hotelListItem)
                    hotelList.push(hotelListItem);
                }
                else if (obj.amountPaid > 0 && obj.amountPaidDescription !== "") {
                    const collectionItem: collectionItemType = {
                        hotelName: obj.hotelName,
                        amountPaid: obj.amountPaid,
                        amountPaidDescription: obj.amountPaidDescription,
                        additionalDetails: obj.additonalDetails1
                    }
                    console.log("collectionItem", collectionItem);
                    collectionList.push(collectionItem);
                }


                const object = {
                    hotelName: obj.hotelName,
                    info: hotelList,
                    collectionInfo: collectionList
                }
                console.log("object", object);
                ans.set(obj.salesInfoId, object);
                console.log("ans is ", ans);
            }


        }
        return ans;

    }
    catch (error) {
        console.error("error in getting info per day", error);
        return "error in getting info per day";
    }
}

export async function getInfoPerMonth(month: string) {
    const ans = new Map<String | null, Object>();

    return ans;
}

