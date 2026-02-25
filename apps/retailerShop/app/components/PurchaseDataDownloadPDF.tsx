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
import { formatAmount } from "../utils/formatters"
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
    const [supplierPhoneNumber, setSupplierPhoneNumber] = useState<string>("");
    const [supplierTotalAmountDue, setSupplierTotalAmountDue] = useState<number>(0);

    const [BF, setBF] = useState<number>(0);

    const purchaseDataDurationRef = useRef(null);

    const form = useForm<z.infer<typeof purchaseDataDurationSchema>>({
        resolver: zodResolver(purchaseDataDurationSchema),
        defaultValues: {
            purchaseInfoId: id,
            startingDate: new Date(),
            endDate: new Date(),
        },
    })


    async function onSubmit(values: z.infer<typeof purchaseDataDurationSchema>) {


        try {
            const baseUri = process.env.NEXT_PUBLIC_UI_BASE_URI;
            const transformedValues = {
                ...values,
                startingDate: values.startingDate ? format(values.startingDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
                endDate: values.endDate ? format(values.endDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
            };
            console.log("form data submitted", transformedValues);
            const response = await axios.post(`${baseUri}/getPurchasesDataDuration`, transformedValues);
            console.log("response", response.data);
            setPurchaseDataDuration(response.data.data);
            setEndDate(response.data.endDateResponse);
            setStartingDate(response.data.startingDateResponse);
            setSupplierName(response.data.supplierName.nameOfTheSupplier);
            setSupplierAddress(response.data.supplierAddress.address);
            setSupplierPhoneNumber(response.data.supplierPhone?.phoneNumber || "");
            setSupplierTotalAmountDue(response.data.supplierTotalAmountDue ?? 0);
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

            // Temporarily modify styles for PDF generation using computed width
            const originalStyles = element.style.cssText;
            element.style.cssText += `
                width: ${A4_PX_WIDTH}px !important;
                min-width: ${A4_PX_WIDTH}px !important;
                max-width: ${A4_PX_WIDTH}px !important;
            `;

            // Force layout recalculation
            element.offsetHeight;

            // Use html2pdf (which wraps html2canvas + jsPDF) with pagebreak support
            // Programmatic pagination with proper margins: create page clones that include
            // left/right/top/bottom padding (margins) so each rendered canvas already contains
            // the visual margins and pages align consistently.


            const pageMaxHeightPx = A4_PX_HEIGHT;

            // select top-level groups to paginate
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

            // MEASUREMENT FIX: force sm:/md: responsive classes to apply unconditionally
            // during DOM scrollHeight measurement so it matches html2canvas render at A4 width.
            const measureOverrideStyle = document.createElement('style');
            measureOverrideStyle.textContent = `
                .sm\\:flex-row { flex-direction: row !important; }
                .sm\\:flex-col { flex-direction: column !important; }
                .sm\\:items-center { align-items: center !important; }
                .sm\\:items-start { align-items: flex-start !important; }
                .sm\\:gap-4 { gap: 1rem !important; }
                .sm\\:gap-2 { gap: 0.5rem !important; }
                .sm\\:w-auto { width: auto !important; }
                .sm\\:mr-1 { margin-right: 0.25rem !important; }
                .md\\:flex-row { flex-direction: row !important; }
                .md\\:items-center { align-items: center !important; }
            `;
            document.head.appendChild(measureOverrideStyle);

            for (const child of allChildren) {
                // treat elements with 'page-break-avoid' as atomic groups
                const isGroup = child.classList && child.classList.contains('page-break-avoid');

                if (!started && !isGroup) {
                    // header before first group: include in first page
                    currentPage.appendChild(child.cloneNode(true));
                    continue;
                }

                started = true;

                if (isGroup) {
                    const clone = child.cloneNode(true) as HTMLElement;
                    currentPage.appendChild(clone);

                    // measure
                    currentPage.style.position = 'absolute';
                    currentPage.style.left = '-9999px';
                    document.body.appendChild(currentPage);
                    const h = currentPage.scrollHeight;
                    document.body.removeChild(currentPage);

                    if (h > pageMaxHeightPx) {
                        // remove the clone and finalize the page
                        currentPage.removeChild(clone);
                        pageContainers.push(currentPage);
                        // start new page and add the clone
                        currentPage = createPageContainer();
                        currentPage.appendChild(clone);

                        // if clone alone still too big, push it as its own page
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
                    // if non-group after start, just append (rare)
                    currentPage.appendChild(child.cloneNode(true));
                }
            }

            if (currentPage.childElementCount > 0) pageContainers.push(currentPage);

            // Remove the measurement style override
            document.head.removeChild(measureOverrideStyle);

            // Render pages and add to PDF
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
                const imgHeightIn = (imgProps.height * imgWidthIn) / imgProps.width;

                pdf.addImage(imgData, 'JPEG', 0, 0, imgWidthIn, imgHeightIn);
                if (i < pageContainers.length - 1) pdf.addPage();
                document.body.removeChild(pageEl);
            }

            pdf.save(`${supplierName || 'Purchase_Report'}.pdf`);

            // Restore original styles
            element.style.cssText = originalStyles;

        } catch (error) {
            console.error("Error generating PDF:", error);
        }
    }

    const handleSharePDF = async () => {
        if (!supplierPhoneNumber) {
            alert('No WhatsApp number saved for this supplier. Please add it via the Purchase edit dialog.');
            return;
        }

        // only send the payment text for now
        const phone = supplierPhoneNumber.replace(/[^\d]/g, '');
        const message = encodeURIComponent(
            `Please make the payment. Total Due is Rs ${supplierTotalAmountDue.toLocaleString('en-IN')}.`
        );
        window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    }
    return (
        <div className="p-4 sm:p-6 md:p-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 leading-tight mb-2">
                        Download Purchase Data PDF
                    </h1>
                    <p className="text-sm sm:text-base text-slate-600">
                        Select a date range to generate and download your purchase data PDF report
                    </p>
                </div>

                <Form {...form} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
                    {/* Date Selection Section */}
                    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 md:p-8 shadow-sm">
                        <h2 className="text-lg sm:text-xl font-semibold text-slate-800 mb-4 sm:mb-6">
                            Select Date Range
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                            <FormField
                                control={form.control}
                                name="startingDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel className="text-sm font-medium text-slate-700">Starting Date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "h-11 pl-3 text-left font-normal rounded-lg border-gray-300 hover:border-emerald-500 transition-colors bg-white",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(field.value, "PPP")
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0 bg-white border border-gray-200 rounded-lg shadow-lg" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) =>
                                                        date > new Date() || date < new Date("1900-01-01")
                                                    }
                                                    initialFocus
                                                    className="rounded-lg border border-gray-200 bg-white"
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormDescription className="text-xs text-slate-500">
                                            Select the start date for the report
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="endDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel className="text-sm font-medium text-slate-700">End Date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "h-11 pl-3 text-left font-normal rounded-lg border-gray-300 hover:border-emerald-500 transition-colors bg-white",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(field.value, "PPP")
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0 bg-white border border-gray-200 rounded-lg shadow-lg" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) =>
                                                        date > new Date() || date < new Date("1900-01-01")
                                                    }
                                                    initialFocus
                                                    className="rounded-lg border border-gray-200 bg-white"
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormDescription className="text-xs text-slate-500">
                                            Select the end date for the report
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex justify-center mt-6">
                            <Button
                                type="submit"
                                className="w-full sm:w-48 h-12 sm:h-11 md:h-12 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 mobile-button touch-target border-0"
                            >
                                Generate Report
                            </Button>
                        </div>
                    </div>
                </Form>


                {purchaseDataDuration && (
                    <>
                        {/* Data Table Section */}
                        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 md:p-8 shadow-sm">
                            <h2 className="text-lg sm:text-xl font-semibold text-slate-800 mb-4 sm:mb-6">
                                Purchase Data Preview
                            </h2>
                            <div className="overflow-x-auto">
                                <DataTable columns={columns} data={Object.values(purchaseDataDuration).flatMap(item => item.info)} />
                            </div>
                        </div>

                        {/* PDF Preview Section */}
                        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 md:p-8 shadow-sm">
                            <h2 className="text-lg sm:text-xl font-semibold text-slate-800 mb-4 sm:mb-6">
                                PDF Preview
                            </h2>

                            <div className="overflow-x-auto">
                                <div className="min-w-[35rem] p-5 bg-white border rounded-xl pdf-content" ref={purchaseDataDurationRef} id="pdfDownload">
                                    <h1 className="text-[24px] font-[700] leading-[120%] text-center">{supplierName}</h1>
                                    <h1 className="text-[16px] font-[700] leading-[120%] text-center -mt-2">{supplierAddress}</h1>

                                    <div className="flex flex-row items-center justify-end gap-2 mr-1">
                                        {BF !== 0 && (
                                            <>
                                                <h1>BF Total Balance</h1>
                                                <h1>=</h1>
                                                <h1>Rs {formatAmount(BF)}</h1>
                                            </>
                                        )}
                                    </div>

                                    {Object.keys(purchaseDataDuration).map((date: string) => (
                                        <div className="flex flex-col page-break-avoid" key={date}>
                                            {purchaseDataDuration[date]?.dateDescription !== "no" && (
                                                <div className="break-inside-avoid overflow-visible">
                                                    <h1 className="underline">{date}</h1>
                                                </div>
                                            )}
                                            {purchaseDataDuration[date]?.info?.map((item: any, index: number) => (
                                                <div key={index} className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center justify-center gap-4 overflow-visible break-inside-avoid">
                                                        {item.extraAmount > 0 ? (
                                                            <div className="bg-yellow-50 rounded-xl p-2">
                                                                <h1>{item.extraAmountDescription}</h1>
                                                            </div>
                                                        ) : item.cashPaid === "no" ? (
                                                            <>
                                                                <h1>{item.stockName}</h1>
                                                                <div className="flex flex-row items-center justify-center gap-2">
                                                                    <h1>{item.quantity} X</h1>
                                                                    <h1>Rs {formatAmount(item.price)}</h1>
                                                                </div>
                                                                {item.isPaymentDone === "Yes" && (
                                                                    <div className="bg-green-50 rounded-xl p-2">
                                                                        <h1>Payment Done</h1>
                                                                    </div>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <div className="bg-green-50 rounded-xl p-2 break-inside-avoid overflow-visible">
                                                                <h1>{item.amountPaidDescription}</h1>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="break-inside-avoid overflow-visible">
                                                        {item.extraAmount > 0 ? (
                                                            <h1><span className="font-[700] text-[20px]"> + </span> Rs {formatAmount(item.extraAmount)}</h1>
                                                        ) : item.cashPaid === "no" ? (
                                                            <>
                                                                {BF === 0 && index === 0 ? (
                                                                    <h1>Rs {formatAmount(item.amount)}</h1>
                                                                ) : (
                                                                    <h1>{item.isPaymentDone !== "Yes" && <span className="font-[700] text-[20px]"> + </span>} Rs {formatAmount(item.amount)}</h1>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <h1><span className="font-[700] text-[20px]"> - </span> Rs {formatAmount(item.amountPaid)}</h1>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}

                                            <hr className="text-black-100 w-full mt-2" style={{ borderWidth: '3px' }} />
                                            <div className="flex flex-row items-center justify-between -gap-4 break-inside-avoid overflow-visible">
                                                {(purchaseDataDuration[date]?.finalAmount ?? 0) < 0 ? (
                                                    <h1 className="bg-yellow-200 rounded-xl p-2 break-inside-avoid overflow-visible">Remaining Advanced Payment</h1>
                                                ) : (
                                                    <h1 className="">Balance Total Amount</h1>
                                                )}
                                                <h1>Rs {formatAmount(purchaseDataDuration[date]?.finalAmount)}</h1>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center mt-6">
                            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                                <Button
                                    onClick={() => handleGeneratePDF()}
                                    className="w-full sm:w-48 h-12 sm:h-11 md:h-12 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 mobile-button touch-target border-0"
                                >
                                    📥 Download PDF
                                </Button>
                                <Button
                                    onClick={() => handleSharePDF()}
                                    className="w-full sm:w-48 h-12 sm:h-11 md:h-12 rounded-xl bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 mobile-button touch-target border-0"
                                >
                                    📤 Share PDF
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}





