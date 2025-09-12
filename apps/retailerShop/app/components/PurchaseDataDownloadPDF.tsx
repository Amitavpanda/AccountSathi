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


import { DataTable } from './PurchaseDetailsComponent/data-table';


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
import { purchaseDataDurationSchema } from "../utils/validator"
import { cn } from "../../../../packages/ui/@/lib/utils"
import axios from "axios"
import { useEffect, useState, useRef } from "react"
import { PurchaseDetailsType, columns } from "./PurchaseDetailsComponent/columns";
import html2canvas from "html2canvas";
import html2pdf from "html2pdf.js";
import jsPDF from "jspdf";


interface PurchaseDataDownloadPDFProps {
    id: string
}

export function PurchaseDataDownloadPDF({ id }: PurchaseDataDownloadPDFProps) {
    let finalAmount = 0;
    const [purchaseDataDuration, setPurchaseDataDuration] = useState<{ [date: string]: { info: PurchaseDetailsType[], dateDescription: string, finalAmount: number } }>({});
    const [endDate, setEndDate] = useState<String>("");
    const [startingDate, setStartingDate] = useState<String>("");
    const [supplierName, setSupplierName] = useState<String>();
    const [supplierAddress, setSupplierAddress] = useState<String>();

    const [BF, setBF] = useState<number>(0);

    const purchaseDataDurationRef = useRef(null);

    const form = useForm<z.infer<typeof purchaseDataDurationSchema>>({
        resolver: zodResolver(purchaseDataDurationSchema),
        defaultValues: {
            purchaseInfoId: id,
        },
    })


    async function onSubmit(values: z.infer<typeof purchaseDataDurationSchema>) {


        try {
            const baseUri = process.env.NEXT_PUBLIC_UI_BASE_URI;
            console.log("form data submitted", values);
            const response = await axios.post(`${baseUri}/getPurchasesDataDuration`, values);
            console.log("response", response.data);
            setPurchaseDataDuration(response.data.data);
            setEndDate(response.data.endDateResponse);
            setStartingDate(response.data.startingDateResponse);
            setSupplierName(response.data.supplierName.nameOfTheSupplier);
            setSupplierAddress(response.data.supplierAddress.address);
            setBF(response.data.BF);

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
    console.log("the purchaseDataDuration", purchaseDataDuration);
    const handleGeneratePDF = async () => {
        // const inputData = purchaseDataDurationRef.current;

        try {
            // // Capture the content as a canvas
            // const canvas = await html2canvas(inputData);

            // // Set image and page dimensions
            // const imgWidth = 300; // A4 page width in landscape mode (px)
            // const pageHeight = 300; // A4 page height in landscape mode (px)
            // const imgHeight = (canvas.height * imgWidth) / canvas.width; // Scale height based on width

            // let heightLeft = imgHeight;
            // let position = 0;

            // // Initialize jsPDF document (landscape, A4 format)
            // const pdf = new jsPDF({
            //     orientation: "landscape",
            //     unit: "px",
            //     format: "a4"
            // });

            // // Add the first page with content
            // pdf.addImage(canvas, "PNG", 0, position, imgWidth, imgHeight);
            // heightLeft -= pageHeight;

            // // Add new pages as needed if content exceeds one page
            // while (heightLeft > 0) {
            //     position = heightLeft - imgHeight;
            //     pdf.addPage();
            //     pdf.addImage(canvas, "PNG", 0, position, imgWidth, imgHeight);
            //     heightLeft -= pageHeight;
            // }

            // // Save the PDF with a filename
            // pdf.save(`${supplierName} ${startingDate} - ${endDate}.pdf`);
            const element = document.querySelector("#pdfDownload") as HTMLElement;
            if (element) {
                html2pdf(element);
                const opt = {
                    margin: 0.5, // Adjust margin as needed
                    filename: `${supplierName}.pdf`,
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: { scale: 2, logging: true, dpi: 192, letterRendering: true },
                    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
                    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] } // Avoids splitting content across pages
                };

                // Generate the PDF
                html2pdf().from(element).set(opt).save();
            }
        } catch (error) {
            console.log("Error generating PDF:", error);
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
                            <Button type="submit" className="w-40 h-15 bg-blue-90 text-white rounded-xl">Submit</Button>
                        </div>
                    </form>
                </Form>


                {purchaseDataDuration && (
                    <>

                        <div className="">
                            <DataTable columns={columns} data={Object.values(purchaseDataDuration).flatMap(item => item.info)} />
                        </div>

                        <div className="flex flex-col gap-y-3 p-5 bg-white w-[35rem] rounded-xl
                        " ref={purchaseDataDurationRef} id="pdfDownload">

                            <h1 className="text-[24px] font-[700] leading-[120%] text-center"> {supplierName}</h1>
                            <h1 className="text-[16px] font-[700] leading-[120%] text-center -mt-2">{supplierAddress}</h1>

                            {/* <h1 className="text-[16px] font-[700] leading-[120%] text-center">Data between {startingDate} and {endDate}</h1> */}
                            <div className="flex flex-row items-center justify-end gap-2 mr-1">

                                {BF !== 0 && (
                                    <>
                                        <h1>BF Total Balance</h1>
                                        <h1>=</h1>
                                        <h1>Rs {BF}</h1>

                                    </>
                                )}
                            </div>

                            {Object.keys(purchaseDataDuration).map((date: string) => (

                                <div className="flex flex-col">
                                    {purchaseDataDuration[date]?.dateDescription !== "no" && (
                                        <div className="break-inside-avoid overflow-visible">
                                            <h1 className="underline ">{date}</h1>
                                        </div>
                                    )}
                                    {purchaseDataDuration[date]?.info?.map((item: any, index: number) => (

                                        <>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center justify-center gap-4 overflow-visible	break-inside-avoid">

                                                    {item.extraAmount > 0 ? (

                                                        <>
                                                            <div className="bg-yellow-50 rounded-xl p-2">
                                                                <h1>{item.extraAmountDescription}</h1>

                                                            </div>

                                                        </>
                                                    ) :

                                                        item.cashPaid === "no" ? (
                                                            <>
                                                                <h1>{item.stockName}</h1>
                                                                <div className="flex flex-row item-center justify-center gap-2">
                                                                    <h1>{item.quantity} X</h1>
                                                                    <h1> Rs {item.price} </h1>
                                                                </div>

                                                                {item.isPaymentDone === "Yes" && <>
                                                                    <div className="bg-green-50 rounded-xl p-2">
                                                                        <h1>Payment Done</h1>
                                                                        {/* <div className="flex flex-row item-center justify-center gap-2">
                                                                    <h1 className="font-[700]"> Rs {item.previousAmount} - </h1>
                                                                    <h1>Rs {item.amountPaid}</h1>
                                                                </div> */}

                                                                    </div>
                                                                </>}
                                                                {/* <div>=</div>
                                                            <div className="flex flex-row item-center justify-center gap-2">
                                                                <h1> Rs {item.amount} + </h1>
                                                                <h1 className="font-[700]"> Rs {item.previousAmount}</h1>
                                                            </div> */}

                                                            </>

                                                        ) :
                                                            (
                                                                <div className="bg-green-50 rounded-xl p-2 break-inside-avoid overflow-visible">
                                                                    <h1>{item.amountPaidDescription}</h1>
                                                                    {/* <div className="flex flex-row item-center justify-center gap-2">
                                                                    <h1 className="font-[700]"> Rs {item.previousAmount} - </h1>
                                                                    <h1>Rs {item.amountPaid}</h1>
                                                                </div> */}

                                                                </div>
                                                            )}
                                                </div>
                                                {/* <div> = </div> */}
                                                <div className="break-inside-avoid overflow-visible">

                                                    {item.extraAmount > 0 ? (


                                                        <>
                                                            <h1><span className="font-[700] text-[20px]"> + </span> Rs {item.extraAmount}</h1>

                                                        </>
                                                    ) :

                                                        item.cashPaid === "no" ? (
                                                            <>
                                                                {BF === 0 && index === 0 ? (
                                                                    <>
                                                                        <h1>Rs {item.amount}</h1>

                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <h1> {item.isPaymentDone !== "Yes" && <span className="font-[700] text-[20px]"> + </span>}  Rs {item.amount}</h1>

                                                                    </>
                                                                )}

                                                            </>
                                                        ) : (
                                                            <>
                                                                <h1><span className="font-[700] text-[20px]"> - </span> Rs {item.amountPaid}</h1>

                                                            </>

                                                        )}
                                                </div>
                                            </div>
                                        </>

                                    ))}

                                    <hr className="text-black-100 w-full mt-2" style={{ borderWidth: '3px' }} />
                                    <div className="flex flex-row items-center justify-between -gap-4 break-inside-avoid overflow-visible">
                                        {(purchaseDataDuration[date]?.finalAmount ?? 0) < 0 ? (
                                            <>
                                                <h1 className="bg-yellow-200 rounded-xl p-2 break-inside-avoid overflow-visible">Remaining Advanced Payment</h1>
                                            </>
                                        ) : (
                                            <>
                                                <h1 className="">Balance Total Amount</h1>
                                            </>
                                        )}
                                        <h1>Rs {purchaseDataDuration[date]?.finalAmount}</h1>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button onClick={() => handleGeneratePDF()} className="w-40 h-15 bg-blue-90 text-white rounded-xl">Download PDF</Button>
                    </>
                )}
            </div>
        </>
    )
}





