import { PrismaClient } from "@repo/db/client";
import { error, info } from "@repo/logs/logs";

const prisma = new PrismaClient();

interface hotelListType {
    name: string,
    quantity: number,
    price: number,
    amount: number,
    supplier: string | null
}

interface collectionItemType {
    hotelName: string | null,
    amountPaid: number,
    amountPaidDescription: string
}
interface ObjectType {
    hotelName: string | null,
    info: (hotelListType)[]
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
                        quantity: obj.quantity,
                        price: obj.price,
                        amount: obj.amount,
                        supplier: obj.supplierName
                    }
                    let existingData: any = ans.get(obj.salesInfoId);
                    console.log("existingData", existingData);
                    existingData?.info.push(hotelListItem);
                }
                else if (obj.amountPaid > 0 && obj.amountPaidDescription !== "") {
                    const collectionItem: collectionItemType = {
                        hotelName: obj.hotelName,
                        amountPaid: obj.amountPaid,
                        amountPaidDescription: obj.amountPaidDescription
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
                        quantity: obj.quantity,
                        price: obj.price,
                        amount: obj.amount,
                        supplier: obj.supplierName
                    }
                    console.log("hotelListITem", hotelListItem)
                    hotelList.push(hotelListItem);
                }
                else if (obj.amountPaid > 0 && obj.amountPaidDescription !== "") {
                    const collectionItem: collectionItemType = {
                        hotelName: obj.hotelName,
                        amountPaid: obj.amountPaid,
                        amountPaidDescription: obj.amountPaidDescription
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

