"use client"


import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@repo/ui/dialog"

import { format } from "date-fns"

import { Button } from "@repo/ui/button"



import { DataTable } from './SalesDetailsComponent/data-table';


import "../globals.css";



import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { z } from "zod"
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/popover"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@repo/ui/calendar"

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@repo/ui/form"
import { salesDataDurationSchema } from "../utils/validator"
import { cn } from "../../../../packages/ui/@/lib/utils"
import axios from "axios"
import { useEffect, useState, useRef } from "react"
import { SalesDetailsType, columns } from "./SalesDetailsComponent/columns";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";


interface SalesDataDownloadPDFProps {
    id: string
}

export function SalesDataDownloadPDF({ id }: SalesDataDownloadPDFProps) {
    let tempAmountSum = 0;
    const [salesDataDuration, setSalesDataDuration] = useState<SalesDetailsType[]>([]);
    const [endDate, setEndDate] = useState<String>("");
    const [startingDate, setStartingDate] = useState<String>("");
    const [hotelName, setHotelName] = useState<String>();

    const salesDataDurationRef = useRef(null);

    const form = useForm<z.infer<typeof salesDataDurationSchema>>({
        resolver: zodResolver(salesDataDurationSchema),
        defaultValues: {
            salesInfoId: id,
        },
    })


    async function onSubmit(values: z.infer<typeof salesDataDurationSchema>) {


        try {
            const baseUri = process.env.NEXT_PUBLIC_UI_BASE_URI;
            console.log("form data submitted", values);
            const response = await axios.post(`${baseUri}/getSalesDataDuration`, values);
            console.log("response", response.data);
            setSalesDataDuration(response.data.data);
            setEndDate(response.data.endDateResponse);
            setStartingDate(response.data.startingDateResponse);
            setHotelName(response.data.hotelName.name);

            if (response.status = 200) {
                console.log('Successfully got the data from the backend.');

                await new Promise(resolve => setTimeout(resolve, 1000));
                form.reset();
            }
            else {
                console.error("does not got the data from the backend");
            }

        }

        catch (err) {
            console.error("Error Getting response: ", err);
        }

    }
    console.log("the salesDataDuration", salesDataDuration);
    const handleGeneratePDF = async () => {
        const inputData = salesDataDurationRef.current;

        try {
            const canvas = await html2canvas(inputData);
            const imgData = canvas.toDataURL("image/png");

            const pdf = new jsPDF({
                orientation: "landscape",
                unit: "px",
                format: "a4",
            });

            const width = pdf.internal.pageSize.getWidth();
            const height = (canvas.height * width) / canvas.width;


            pdf.addImage(imgData, "PNG", 0, 0, width, height);
            pdf.save(`${hotelName} ${startingDate} - ${endDate}.pdf`);
        }

        catch (error) {
            console.log(error);
        }
    }
    return (
        <>

            <div className="flex flex-col gap-y-4 p-20">

                <h1>Download the data between a specified duration</h1>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="grid gap-4 py-4">

                            <div className="grid grid-cols-4 items-center gap-4 mb-4">
                                <FormField
                                    control={form.control}
                                    name="startingDate"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Starting Date</FormLabel>
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
                            <div className="grid grid-cols-4 items-center gap-4">
                                <FormField
                                    control={form.control}
                                    name="endDate"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>End Date</FormLabel>
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


                {salesDataDuration && (
                    <>

                        <div className="">
                            <DataTable columns={columns} data={salesDataDuration} id={id} />
                        </div>

                        <div className="flex flex-col gap-y-4 p-5 bg-white w-[45rem] rounded-xl
                        " ref={salesDataDurationRef}>

                            <h1 className="text-[24px] font-[700] leading-[120%] text-center">Hotel {hotelName}</h1>
                            <h1 className="text-[16px] font-[700] leading-[120%] text-center">Data between {startingDate} and {endDate}</h1>

                            {Object.keys(salesDataDuration).map((date: string) => (

                                <div className="flex flex-col">
                                    <h1 className="underline">{date}</h1>
                                    {salesDataDuration[date].info.map((item: any) => (
                                        <>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center justify-center gap-4">
                                                    {item.cashPaid === "no" ? (
                                                        <>
                                                            <h1>{item.stockName}</h1>
                                                            <div className="flex flex-row item-center justify-center gap-2">
                                                                <h1>{item.quantity} *</h1>
                                                                <h1> Rs {item.price} </h1>
                                                            </div>
                                                            <div>=</div>
                                                            <div className="flex flex-row item-center justify-center gap-2">
                                                                <h1> Rs {item.amount} + </h1>
                                                                <h1 className="font-[700]"> Rs {item.previousAmount}</h1>
                                                            </div>

                                                        </>

                                                    ) :
                                                        (
                                                            <div className="bg-green-50 rounded-xl p-2">
                                                                <h1>{item.amountPaidDescription}(Rs {item.amountPaid})</h1>
                                                                <div className="flex flex-row item-center justify-center gap-2">
                                                                    <h1 className="font-[700]"> Rs {item.previousAmount} - </h1>
                                                                    <h1>Rs {item.amountPaid}</h1>
                                                                </div>

                                                            </div>
                                                        )}
                                                </div>
                                                <div> = </div>
                                                <div >
                                                    <h1> Rs {item.presentAmount}</h1>
                                                </div>
                                            </div>
                                        </>
                                    ))}
                                </div>
                            ))}
                        </div>
                        <Button onClick={() => handleGeneratePDF()} className="w-40 h-15 rounded-md bg-blue-90 text-white rounded-xl">Download PDF</Button>

                    </>
                )}
            </div>
        </>
    )
}