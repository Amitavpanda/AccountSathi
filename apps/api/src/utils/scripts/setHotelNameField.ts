import { PrismaClient } from "@repo/db/client";

const prisma = new PrismaClient();

async function fillHotelName() {
    const salesInfoDetails = await prisma.salesInfoDetail.findMany();

    for(const detail of salesInfoDetails){
        const salesInfoId = detail.salesInfoId;
        let hotelName
        hotelName = await prisma.salesInfo.findUnique({
            where : {
                id : salesInfoId
            },
            select : {
                name : true
            }
        })

        hotelName = hotelName?.name;
        console.log("hotelName ", hotelName)
        if(hotelName){
            await prisma.salesInfoDetail.updateMany({
                where : {
                    salesInfoId : salesInfoId
                },
                data : {
                    hotelName : hotelName
                }
            })
        }
    }

}

fillHotelName().then(() => 
    console.log("hotelName filled successfully")
).catch(
    (error) => console.error("error filling hotelName", error)
).finally(
    () => prisma.$disconnect()
);

