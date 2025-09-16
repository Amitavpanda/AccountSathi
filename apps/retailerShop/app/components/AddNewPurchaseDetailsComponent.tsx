"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Calendar } from "@repo/ui/calendar"


import { Button } from "@repo/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@repo/ui/form"
import { Input } from "@repo/ui/input"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@repo/ui/select"


import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@repo/ui/popover"


import { format } from "date-fns"


import { BadgePlus, CalendarIcon } from "lucide-react"

import { addSupplierPurchaseDetailsSchema, addSupplierPurchaseSchema } from "../utils/validator"

import { useEffect, useState } from "react"

import { error, info } from "@repo/logs/logs"
import axios, { AxiosResponse } from "axios"
import { cn } from "../../../../packages/ui/@/lib/utils"



interface AddNewPurchaseDetailsProps {
    id: any;
}

const isPaymentDoneOptions = [
    "Yes",
    "No"
]

export default function AddNewPurchaseDetailsComponent({ id }: AddNewPurchaseDetailsProps) {

    const form = useForm<z.infer<typeof addSupplierPurchaseDetailsSchema>>({
        resolver: zodResolver(addSupplierPurchaseDetailsSchema),
        defaultValues: {
            stockName: "",
            stockNameDetails: "",
            quantity: "",
            quantityType: "",
            quantityDetails: "",
            price: "",
            priceDetails: "",
            amountPaid: "",
            amountPaidDescription: "",
            extraAmount : "",
            extraAmountDescription : "",
            supplierPurchaseId: id,
            additionalDetails1: "",
            additionalDetails2: "",
            isPaymentDone: ""
        },
    })
    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof addSupplierPurchaseDetailsSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.

        const transformedValues = {
            ...values,
            quantity: Number(values.quantity),
            price: Number(values.price),
            amountPaid: Number(values.amountPaid),
            extraAmount : Number(values.extraAmount)

        };
        try {
            const baseUri = process.env.NEXT_PUBLIC_UI_BASE_URI;
            console.log("Form data submitted: ", transformedValues);
            const response = await axios.post(`${baseUri}/addSupplierPurchaseDetails`, transformedValues);
            console.log("response", response);
            if (response.status === 200) {
                console.log('Form data successfully stored in the backend.');

                await new Promise(resolve => setTimeout(resolve, 1000));
                form.reset();
            }
            else {
                console.error("Form data not successfully stored");
            }

        }
        catch (error) {
            console.error("Error submitting form: ", error);
        }
    }



    return (
        <div className="p-4 sm:p-6 md:p-8 lg:p-10">
            <div className="max-w-6xl mx-auto">
                <div className="mb-6 sm:mb-8">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 leading-tight mb-2">
                        Add New Purchase Data
                    </h2>
                    <p className="text-sm sm:text-base text-slate-600">
                        Fill in the details below to add a new purchase transaction
                    </p>
                </div>

                <Form {...form} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">

                    {/* Stock Information Section */}
                    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 md:p-8 shadow-sm">
                        <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mb-4 sm:mb-6">
                            Stock Information
                        </h3>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="stockName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium text-slate-700">Name of the Stock</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter name of the stock"
                                                    {...field}
                                                    className="h-11 rounded-lg border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                                                />
                                            </FormControl>
                                            <FormDescription className="text-xs text-slate-500">
                                                Enter the name of the stock item
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="stockNameDetails"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium text-slate-700">Stock Name Details</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter Stock Name Details"
                                                    {...field}
                                                    className="h-11 rounded-lg border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                                                />
                                            </FormControl>
                                            <FormDescription className="text-xs text-slate-500">
                                                Additional details about the stock
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="date"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel className="text-sm font-medium text-slate-700">Date</FormLabel>
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
                                                <PopoverContent className="w-auto p-0 bg-white border border-gray-200 rounded-lg shadow-lg">
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
                                                Date when the stock is being purchased
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </div>


                    {/* Quantity and Price Section */}
                    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 md:p-8 shadow-sm">
                        <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mb-4 sm:mb-6">
                            Quantity & Price Details
                        </h3>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                            <div className="space-y-4">
                                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                                    <FormField
                                        control={form.control}
                                        name="quantity"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium text-slate-700">Quantity</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Qty"
                                                        {...field}
                                                        className="h-11 rounded-lg border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="quantityType"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium text-slate-700">Type</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="kg/ltr"
                                                        {...field}
                                                        className="h-11 rounded-lg border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="quantityDetails"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium text-slate-700">Details</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Details"
                                                        {...field}
                                                        className="h-11 rounded-lg border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <FormField
                                        control={form.control}
                                        name="price"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium text-slate-700">Price</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Price"
                                                        {...field}
                                                        className="h-11 rounded-lg border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="priceDetails"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium text-slate-700">Price Details</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Details"
                                                        {...field}
                                                        className="h-11 rounded-lg border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Information Section */}
                    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 md:p-8 shadow-sm">
                        <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mb-4 sm:mb-6">
                            Payment Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            <FormField
                                control={form.control}
                                name="amountPaid"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-slate-700">Amount Paid</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Amount Paid"
                                                {...field}
                                                className="h-11 rounded-lg border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                                            />
                                        </FormControl>
                                        <FormDescription className="text-xs text-slate-500">
                                            Amount already paid
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="amountPaidDescription"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-slate-700">Payment Description</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Payment Description"
                                                {...field}
                                                className="h-11 rounded-lg border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                                            />
                                        </FormControl>
                                        <FormDescription className="text-xs text-slate-500">
                                            Description of payment
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="extraAmount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-slate-700">Extra Amount</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Extra Amount"
                                                {...field}
                                                className="h-11 rounded-lg border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                                            />
                                        </FormControl>
                                        <FormDescription className="text-xs text-slate-500">
                                            Any additional charges
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="extraAmountDescription"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-slate-700">Extra Amount Description</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Extra Amount Description"
                                                {...field}
                                                className="h-11 rounded-lg border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                                            />
                                        </FormControl>
                                        <FormDescription className="text-xs text-slate-500">
                                            Description of extra amount
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="dateDescription"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-slate-700">Date Description</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Date Description"
                                                {...field}
                                                className="h-11 rounded-lg border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                                            />
                                        </FormControl>
                                        <FormDescription className="text-xs text-slate-500">
                                            Additional date information
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="isPaymentDone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-slate-700">Payment Status</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="h-11 rounded-lg border-gray-300 focus:border-emerald-500 focus:ring-emerald-500">
                                                    <SelectValue placeholder="Select payment status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="rounded-lg border border-gray-200">
                                                {isPaymentDoneOptions.map((option) => (
                                                    <SelectItem
                                                        key={option}
                                                        value={option}
                                                        className="rounded-md focus:bg-emerald-50 focus:text-emerald-900"
                                                    >
                                                        {option}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormDescription className="text-xs text-slate-500">
                                            Is the payment completed?
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    {/* Additional Details Section */}
                    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 md:p-8 shadow-sm">
                        <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mb-4 sm:mb-6">
                            Additional Details
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                            <FormField
                                control={form.control}
                                name="additionalDetails1"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-slate-700">Additional Details 1</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Additional Details 1"
                                                {...field}
                                                className="h-11 rounded-lg border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                                            />
                                        </FormControl>
                                        <FormDescription className="text-xs text-slate-500">
                                            Any additional information
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="additionalDetails2"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-slate-700">Additional Details 2</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Additional Details 2"
                                                {...field}
                                                className="h-11 rounded-lg border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                                            />
                                        </FormControl>
                                        <FormDescription className="text-xs text-slate-500">
                                            More additional information
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center pt-4">
                        <Button
                            type="submit"
                            className="w-full sm:w-48 h-12 sm:h-11 md:h-12 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 mobile-button touch-target border-0"
                        >
                            <BadgePlus className="h-4 w-4" />
                            <span>Add Purchase Data</span>
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    )
} 