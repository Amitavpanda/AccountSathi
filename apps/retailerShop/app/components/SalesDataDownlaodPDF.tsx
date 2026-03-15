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
import { formatAmount } from "../utils/formatters"
import axios from "axios"
import { useEffect, useState, useRef } from "react"
import { SalesDetailsType, columns } from "./SalesDetailsComponent/columns";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import html2pdf from "html2pdf.js";


interface SalesDataDownloadPDFProps {
    id: string
}

export function SalesDataDownloadPDF({ id }: SalesDataDownloadPDFProps) {
    let finalAmount = 0;
    const [salesDataDuration, setSalesDataDuration] = useState<SalesDetailsType[]>([]);
    const [endDate, setEndDate] = useState<String>("");
    const [startingDate, setStartingDate] = useState<String>("");
    const [hotelName, setHotelName] = useState<String>();
    const [hotelAddress, setHotelAddress] = useState<String>();
    const [hotelPhoneNumber, setHotelPhoneNumber] = useState<string>("");
    const [hotelTotalAmountDue, setHotelTotalAmountDue] = useState<number>(0);

    const [BF, setBF] = useState<number>(0);

    const salesDataDurationRef = useRef(null);

    const form = useForm<z.infer<typeof salesDataDurationSchema>>({
        resolver: zodResolver(salesDataDurationSchema),
        defaultValues: {
            salesInfoId: id,
            startingDate: new Date(),
            endDate: new Date(),
        },
    })


    async function onSubmit(values: z.infer<typeof salesDataDurationSchema>) {

        console.log("I am getting called after");
        try {
            const baseUri = process.env.NEXT_PUBLIC_UI_BASE_URI;
            const transformedValues = {
                ...values,
                startingDate: values.startingDate ? format(values.startingDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
                endDate: values.endDate ? format(values.endDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
            };
            console.log("form data submitted", transformedValues);
            const response = await axios.post(`${baseUri}/getSalesDataDuration`, transformedValues);
            console.log("response", response.data);
            setSalesDataDuration(response.data.data);
            setEndDate(response.data.endDateResponse);
            setStartingDate(response.data.startingDateResponse);
            setHotelName(response.data.hotelName.name);
            setHotelAddress(response.data.hotelAddress.address);
            setHotelPhoneNumber(response.data.hotelPhone?.phoneNumber || "");
            setHotelTotalAmountDue(response.data.hotelTotalAmountDue ?? 0);
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
    console.log("the salesDataDuration", salesDataDuration);
    const handleGeneratePDF = async () => {
        const element = document.querySelector("#pdfDownload") as HTMLElement;
        if (!element) return;

        try {
            const MARGINS_IN = { top: 0.5, bottom: 0.5, left: 0.5, right: 0.5 };
            const A4_IN_HEIGHT = 11.69; // inches
            const A4_IN_WIDTH = 8.27; // inches

            // compute CSS px per inch accurately
            const testDiv = document.createElement('div');
            testDiv.style.width = '1in';
            testDiv.style.position = 'absolute';
            testDiv.style.left = '-9999px';
            document.body.appendChild(testDiv);
            const CSS_PX_PER_IN = testDiv.offsetWidth || 96;
            document.body.removeChild(testDiv);

            const A4_PX_HEIGHT = A4_IN_HEIGHT * CSS_PX_PER_IN;
            const A4_PX_WIDTH = A4_IN_WIDTH * CSS_PX_PER_IN;
            const marginsPx = {
                top: MARGINS_IN.top * CSS_PX_PER_IN,
                bottom: MARGINS_IN.bottom * CSS_PX_PER_IN,
                left: MARGINS_IN.left * CSS_PX_PER_IN,
                right: MARGINS_IN.right * CSS_PX_PER_IN,
            };

            // Temporarily modify styles for PDF generation; use the computed A4 width so the
            // layout is identical regardless of device viewport.  We don't need the
            // whitespace/word-wrap hacks now that width is enforced exactly.
            const originalStyles = element.style.cssText;
            element.style.cssText += `
                width: ${A4_PX_WIDTH}px !important;
                min-width: ${A4_PX_WIDTH}px !important;
                max-width: ${A4_PX_WIDTH}px !important;
            `;

            // Force layout recalculation
            element.offsetHeight;

            // Programmatic pagination with proper margins

            // Apply a 5% safety buffer so measurement rounding never clips content at the
            // bottom of a rendered page (the primary cause of hidden data on last pages).
            const PAGE_SAFETY_FACTOR = 0.95;
            const pageMaxHeightPx = A4_PX_HEIGHT * PAGE_SAFETY_FACTOR;

            const allChildren = Array.from(element.children) as HTMLElement[];
            const pageContainers: HTMLElement[] = [];

            function createPageContainer() {
                const page = document.createElement('div');
                page.style.width = A4_PX_WIDTH + 'px';
                page.style.boxSizing = 'border-box';
                page.style.paddingTop = `${marginsPx.top}px`;
                page.style.paddingBottom = `${marginsPx.bottom}px`;
                page.style.paddingLeft = `${marginsPx.left}px`;
                page.style.paddingRight = `${marginsPx.right}px`;
                page.style.background = '#ffffff';
                page.style.font = getComputedStyle(element).font || '';
                return page;
            }

            let currentPage = createPageContainer();
            let started = false;

            // MEASUREMENT FIX: During measurement the browser uses the real viewport width
            // (often <640px) so Tailwind sm:/md: breakpoints never fire.  But html2canvas
            // renders with windowWidth=A4_PX_WIDTH (793px) so sm: classes DO apply, making
            // elements taller.  The accumulated height difference causes content on the last
            // rows of a page to be clipped.
            // Solution: inject a temporary <style> that forces EVERY height-affecting
            // responsive class to apply at all viewport widths during measurement.
            const measureOverrideStyle = document.createElement('style');
            measureOverrideStyle.textContent = `
                /* layout */
                .sm\\:flex-row { flex-direction: row !important; }
                .sm\\:flex-col { flex-direction: column !important; }
                .sm\\:items-center { align-items: center !important; }
                .sm\\:items-start { align-items: flex-start !important; }
                .sm\\:gap-4 { gap: 1rem !important; }
                .sm\\:gap-2 { gap: 0.5rem !important; }
                .sm\\:gap-6 { gap: 1.5rem !important; }
                .sm\\:w-auto { width: auto !important; }
                .sm\\:w-48 { width: 12rem !important; }
                .sm\\:mr-1 { margin-right: 0.25rem !important; }
                .md\\:flex-row { flex-direction: row !important; }
                .md\\:items-center { align-items: center !important; }
                /* typography – these change line-height / element height */
                .sm\\:text-xs { font-size: 0.75rem !important; line-height: 1rem !important; }
                .sm\\:text-sm { font-size: 0.875rem !important; line-height: 1.25rem !important; }
                .sm\\:text-base { font-size: 1rem !important; line-height: 1.5rem !important; }
                .sm\\:text-lg { font-size: 1.125rem !important; line-height: 1.75rem !important; }
                .sm\\:text-xl { font-size: 1.25rem !important; line-height: 1.75rem !important; }
                .sm\\:text-2xl { font-size: 1.5rem !important; line-height: 2rem !important; }
                .sm\\:text-3xl { font-size: 1.875rem !important; line-height: 2.25rem !important; }
                .md\\:text-sm { font-size: 0.875rem !important; line-height: 1.25rem !important; }
                .md\\:text-base { font-size: 1rem !important; line-height: 1.5rem !important; }
                .md\\:text-lg { font-size: 1.125rem !important; line-height: 1.75rem !important; }
                .md\\:text-xl { font-size: 1.25rem !important; line-height: 1.75rem !important; }
                .md\\:text-2xl { font-size: 1.5rem !important; line-height: 2rem !important; }
                /* padding – affects element height */
                .sm\\:p-2 { padding: 0.5rem !important; }
                .sm\\:p-4 { padding: 1rem !important; }
                .sm\\:p-6 { padding: 1.5rem !important; }
                .sm\\:p-8 { padding: 2rem !important; }
                .sm\\:px-4 { padding-left: 1rem !important; padding-right: 1rem !important; }
                .sm\\:py-2 { padding-top: 0.5rem !important; padding-bottom: 0.5rem !important; }
                .sm\\:py-4 { padding-top: 1rem !important; padding-bottom: 1rem !important; }
                .md\\:p-4 { padding: 1rem !important; }
                .md\\:p-6 { padding: 1.5rem !important; }
                .md\\:p-8 { padding: 2rem !important; }
                /* height */
                .sm\\:h-11 { height: 2.75rem !important; }
                .sm\\:h-12 { height: 3rem !important; }
                .md\\:h-11 { height: 2.75rem !important; }
                .md\\:h-12 { height: 3rem !important; }
            `;
            document.head.appendChild(measureOverrideStyle);

            for (const child of allChildren) {
                const isGroup = child.classList && child.classList.contains('page-break-avoid');

                if (!started && !isGroup) {
                    currentPage.appendChild(child.cloneNode(true));
                    continue;
                }

                started = true;

                if (isGroup) {
                    const clone = child.cloneNode(true) as HTMLElement;
                    currentPage.appendChild(clone);

                    currentPage.style.position = 'absolute';
                    currentPage.style.left = '-9999px';
                    document.body.appendChild(currentPage);
                    const h = currentPage.scrollHeight;
                    document.body.removeChild(currentPage);

                    if (h > pageMaxHeightPx) {
                        currentPage.removeChild(clone);
                        pageContainers.push(currentPage);
                        currentPage = createPageContainer();
                        currentPage.appendChild(clone);

                        currentPage.style.position = 'absolute';
                        currentPage.style.left = '-9999px';
                        document.body.appendChild(currentPage);
                        const h2 = currentPage.scrollHeight;
                        document.body.removeChild(currentPage);
                        if (h2 > pageMaxHeightPx) {
                            pageContainers.push(currentPage);
                            currentPage = createPageContainer();
                        }
                    }
                } else {
                    currentPage.appendChild(child.cloneNode(true));
                }
            }

            if (currentPage.childElementCount > 0) pageContainers.push(currentPage);

            // Remove the measurement style override
            document.head.removeChild(measureOverrideStyle);

            const pdf = new jsPDF({ unit: 'in', format: 'a4', orientation: 'portrait' });
            const pageWidthIn = pdf.internal.pageSize.getWidth();

            for (let i = 0; i < pageContainers.length; i++) {
                const pageEl = pageContainers[i]!;
                pageEl.style.position = 'absolute';
                pageEl.style.left = '-9999px';
                document.body.appendChild(pageEl);

                const canvas = await html2canvas(pageEl, {
                    scale: 2,
                    useCORS: true,
                    allowTaint: true,
                    logging: false,
                    width: pageEl.offsetWidth,
                    height: pageEl.scrollHeight,
                    // this is the critical fix: tell html2canvas to treat the viewport
                    // as A4-wide so Tailwind sm:/md: breakpoints activate on mobile
                    windowWidth: A4_PX_WIDTH,
                    windowHeight: A4_PX_HEIGHT,
                });

                const imgData = canvas.toDataURL('image/jpeg', 0.98);
                const imgProps = pdf.getImageProperties(imgData);
                const imgWidthIn = pageWidthIn;
                const pageHeightIn = pdf.internal.pageSize.getHeight();
                // Natural height the image would occupy at full width
                const naturalImgHeightIn = (imgProps.height * imgWidthIn) / imgProps.width;
                // Never let rendered content exceed the physical page – clamp to page height.
                // This is the last safety net against residual measurement vs render differences.
                const imgHeightIn = Math.min(naturalImgHeightIn, pageHeightIn);

                pdf.addImage(imgData, 'JPEG', 0, 0, imgWidthIn, imgHeightIn);
                if (i < pageContainers.length - 1) pdf.addPage();
                document.body.removeChild(pageEl);
            }

            pdf.save(`${hotelName || 'Sales_Report'}.pdf`);

            // Restore original styles
            element.style.cssText = originalStyles;

        } catch (error) {
            console.error("Error generating PDF:", error);
        }
    }

    const handleSharePDF = async () => {
        if (!hotelPhoneNumber) {
            alert('No WhatsApp number saved for this hotel. Please add it via the Sales Overview edit dialog.');
            return;
        }

        // only send the payment text, PDF link will be added later
        const phone = hotelPhoneNumber.replace(/[^\d]/g, '');
        const message = encodeURIComponent(
            `Please make the payment. Total Due is Rs ${hotelTotalAmountDue.toLocaleString('en-IN')}.`
        );
        window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    }
    return (
        <>

            <div className="p-4 sm:p-6 lg:p-8">

                <h1 className="text-xl sm:text-2xl font-bold text-slate-800 mb-6">Download the data between a specified duration</h1>

                <Form {...form} onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="space-y-6">

                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                            <FormField
                                control={form.control}
                                name="startingDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col w-full">
                                        <FormLabel>Starting Date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full h-11 pl-3 text-left font-normal rounded-xl border-gray-300 hover:bg-gray-50",
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
                                                <Calendar className="bg-white text-gray-900 rounded-xl border"
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
                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                            <FormField
                                control={form.control}
                                name="endDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col w-full">
                                        <FormLabel>End Date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full h-11 pl-3 text-left font-normal rounded-xl border-gray-300 hover:bg-gray-50",
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
                                                <Calendar className="bg-white text-gray-900 rounded-xl border"
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
                        <div className="flex justify-center pt-4">
                            <Button type="submit" className="w-full sm:w-48 h-12 sm:h-11 md:h-12 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 mobile-button touch-target border-0">
                                Get Data
                            </Button>
                        </div>
                    </div>
                </Form>


                {salesDataDuration && (
                    <>

                        <div className="mt-8">
                            <DataTable columns={columns} data={salesDataDuration} id={id} />
                        </div>

                        <div className="mt-8">
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6 overflow-x-auto pdf-content" ref={salesDataDurationRef} id="pdfDownload">

                                <h1 className="text-xl sm:text-2xl font-bold leading-tight text-center">{hotelName}</h1>
                                <h1 className="text-sm sm:text-base font-semibold leading-tight text-center -mt-1">{hotelAddress}</h1>

                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-end gap-2 sm:mr-1 mt-4">

                                    {BF !== 0 && (
                                        <>

                                            <h1 className="text-sm font-medium">BF Total Balance</h1>
                                            <h1 className="text-lg font-bold">=</h1>
                                            <h1 className="text-lg font-bold">Rs {formatAmount(BF)}</h1>

                                        </>
                                    )}
                                </div>

                                {Object.keys(salesDataDuration).map((date: string) => (

                                    <div className="flex flex-col page-break-avoid" key={date}>
                                        {date in salesDataDuration && (salesDataDuration as any)[date]?.dateDescription !== "no" && (
                                            <div className="overflow-visible break-inside-avoid mb-2">
                                                <h1 className="underline text-base sm:text-lg font-semibold">{date}</h1>
                                            </div>
                                        )}
                                        {date in salesDataDuration && (salesDataDuration as any)[date]?.info?.map((item: any, index: number) => (

                                            <>
                                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
                                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 overflow-visible break-inside-avoid w-full sm:w-auto">


                                                        {item.extraAmount > 0 ? (

                                                            <>
                                                                <div className="bg-yellow-50 rounded-lg p-2 w-full sm:w-auto">
                                                                    <h1 className="text-sm font-medium">{item.extraAmountDescription}</h1>

                                                                </div>

                                                            </>
                                                        ) : item.cashPaid === "no" ? (
                                                            <>
                                                                <h1 className="text-sm font-medium">{item.stockName}</h1>
                                                                <div className="flex flex-row items-center justify-center gap-2">
                                                                    <h1 className="text-sm">{item.quantity} X</h1>
                                                                    <h1 className="text-sm"> Rs {formatAmount(item.price)} </h1>
                                                                </div>
                                                                {item.isPaymentDone === "Yes" && <>
                                                                    <div className="bg-green-50 rounded-lg p-2 w-full sm:w-auto">
                                                                        <h1 className="text-sm font-medium">Payment Done</h1>
                                                                    </div>
                                                                </>}

                                                            </>

                                                        ) :

                                                            (

                                                                <div className="bg-green-50 rounded-lg p-2 overflow-visible break-inside-avoid w-full sm:w-auto">
                                                                    <h1 className="text-sm font-medium">{item.amountPaidDescription}</h1>
                                                                    {/* <div className="flex flex-row item-center justify-center gap-2">
                                                                    <h1 className="font-[700]"> Rs {item.previousAmount} - </h1>
                                                                    <h1>Rs {item.amountPaid}</h1>
                                                                </div> */}

                                                                </div>
                                                            )

                                                        }


                                                    </div>
                                                    <div className="break-inside-avoid overflow-visible text-right sm:text-left">

                                                        {item.extraAmount > 0 ? (
                                                            <>
                                                                <h1 className="text-base sm:text-lg font-bold"><span className="text-lg sm:text-xl"> + </span> Rs {formatAmount(item.extraAmount)}</h1>
                                                            </>
                                                        ) :
                                                            item.cashPaid === "no" ? (
                                                                <>
                                                                    {BF === 0 && index === 0 ? (
                                                                        <>
                                                                            <h1 className="text-base sm:text-lg font-semibold">Rs {formatAmount(item.amount)}</h1>

                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <h1 className="text-base sm:text-lg font-semibold"> {item.isPaymentDone !== "Yes" && <span className="text-lg sm:text-xl"> + </span>} Rs {formatAmount(item.amount)}</h1>

                                                                        </>
                                                                    )}

                                                                </>
                                                            )

                                                                : (
                                                                    <>
                                                                        <h1 className="text-base sm:text-lg font-semibold"><span className="text-lg sm:text-xl"> - </span> Rs {formatAmount(item.amountPaid)}</h1>

                                                                    </>

                                                                )}
                                                    </div>
                                                </div>
                                            </>

                                        ))}

                                        <hr className="border-gray-300 w-full mt-3 mb-2" style={{ borderWidth: '2px' }} />
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 break-inside-avoid overflow-visible mt-2 pt-2 border-t border-gray-200">
                                            {date in salesDataDuration && ((salesDataDuration as any)[date]?.finalAmount ?? 0) < 0 ? (
                                                <>
                                                    <h1 className="bg-yellow-200 rounded-lg p-2 break-inside-avoid overflow-visible text-sm font-medium w-full sm:w-auto">Remaining Advanced Payment</h1>

                                                </>
                                            ) : (
                                                <>
                                                    <h1 className="text-sm font-medium"> Balance Total Amount </h1>

                                                </>
                                            )}
                                            <h1 className="text-base sm:text-lg font-bold">Rs {formatAmount((salesDataDuration as any)[date]?.finalAmount ?? 0)}</h1>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-center mt-6">
                            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                                <Button onClick={() => handleGeneratePDF()} className="w-full sm:w-48 h-12 sm:h-11 md:h-12 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 mobile-button touch-target border-0">
                                    📥 Download PDF
                                </Button>
                                <Button onClick={() => handleSharePDF()} className="w-full sm:w-48 h-12 sm:h-11 md:h-12 rounded-xl bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 mobile-button touch-target border-0">
                                    📤 Share PDF
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    )
}