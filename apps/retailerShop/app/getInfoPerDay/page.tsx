"use client"


import axios from "axios";
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { infoPerDayMonthSchema } from "../utils/validator";
import { format } from "date-fns"
import { cn } from "../../../../packages/ui/@/lib/utils"

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@repo/ui/form"

import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/popover"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@repo/ui/calendar"
import { Button } from "@repo/ui/button";



function GetInfoPerDay() {

    const [infoDetails, setInfoDetails] = useState([]);

    const form = useForm<z.infer<typeof infoPerDayMonthSchema>>({
        resolver: zodResolver(infoPerDayMonthSchema),
        defaultValues: {

        },
    })

    async function onSubmit(values: z.infer<typeof infoPerDayMonthSchema>) {
        console.log(" I am getting called after clicking button");
        try {
            const baseUri = process.env.NEXT_PUBLIC_UI_BASE_URI;
            console.log("the  values are ", values);
            const response = await axios.post(`${baseUri}/infoPerDayMonth`, values);
            console.log("the response.data", response.data);
            console.log("the perDayDetails", response.data.perDayData);
            setInfoDetails(response.data.perDayData);


            if (response.status == 200) {
                console.log("data fetched from backend successfully");
                await new Promise(resolve => setTimeout(resolve, 100));
                form.reset();
            }
        }

        catch (err) {
            console.error("error in getting the inforPerDay");
        }
    }

    return (
        <>

            <div className="flex flex-col gap-3 p-20">
                <h1 className="text-black bold-24">Info Per Day Month</h1>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4 mb-4">
                                <FormField
                                    control={form.control}
                                    name="date"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Date</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-[240px] pl-3 text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(field.value, "PPP")
                                                            ) : (
                                                                <span>Pick a date</span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50 " />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar className="bg-blue-90 text-white rounded-xl"
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        disabled={(date) =>
                                                            date > new Date() || date < new Date("1900-01-01")
                                                        }
                                                        initialFocus



                                                    />
                                                </PopoverContent>
                                            </Popover>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <Button type="submit" className="w-40 h-15 rounded-md bg-blue-90 text-white rounded-xl">Submit</Button>
                        </div>
                    </form>
                </Form>

                {/* purchase */}
                <div>
                    <h1 className="text-black bold-20 text-center items-center">Purchase</h1>
                </div>
                {/* sales */}
                <div>
                    <h1 className="text-black bold-20 text-center items-center">Sales</h1>

                    {/* info */}
                    <div className="flex flex-col">
                        <h1>Info</h1>
                        {Object.keys(infoDetails).map((salesInfoId) => (
                            <>
                                {/* <h1>length of info {infoDetails[salesInfoId].info.length}</h1>
                                <h1>lenght of collection {infoDetails[salesInfoId].collectionInfo.length}</h1> */}
                                <h1>{infoDetails[salesInfoId].info.length > 0  && ` hotel name ${infoDetails[salesInfoId].hotelName}`}</h1>
                                {infoDetails[salesInfoId].info.length > 0 ? (
                                    <>
                                        <div className="flex flex-col">
                                            {infoDetails[salesInfoId].info.map((item : any) => (
                                                <>
                                                    <div className="flex items-center justify-center">
                                                        <h1>name {item.name}</h1>
                                                        <h1>quantity {item.quantity}</h1>
                                                        <h1>price {item.price}</h1>
                                                        <h1>supplier {item.supplier}</h1>
                                                    </div>
                                                </>
                                            ))}
                                        </div>
                                    </>
                                ): 
                                (
                                    <>
                                    </>
                                )}

                            </>
                        ))}

                    </div>

                    {/* collection */}
                    <div className="flex flex-col">
                        <h1>Collection</h1>
                        {Object.keys(infoDetails).map((salesInfoId) => (
                            <>
                                {/* <h1>length of info {infoDetails[salesInfoId].info.length}</h1>
                                <h1>lenght of collection {infoDetails[salesInfoId].collectionInfo.length}</h1> */}
                                <h1>{infoDetails[salesInfoId].collectionInfo.length > 0  && ` hotel name ${infoDetails[salesInfoId].hotelName}`}</h1>
                                {infoDetails[salesInfoId].collectionInfo.length > 0 ? (
                                    <>
                                        <div className="flex flex-col">
                                            {infoDetails[salesInfoId].collectionInfo.map((item : any) => (
                                                <>
                                                    <div className="flex items-center justify-center">
                                                            <h1>amount paid {item.amountPaid}</h1>
                                                            <h1>amount paid description {item.amountPaidDescription}</h1>
                                                    </div>
                                                </>
                                            ))}
                                        </div>
                                    </>
                                ): 
                                (
                                    <>
                                    </>
                                )}
                            </>
                        ))}

                    </div>

                </div>
            </div>
        </>

    )
}





export default GetInfoPerDay