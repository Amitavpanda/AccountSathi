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
            supplierPurchaseId: id,
            additionalDetails1: "",
            additionalDetails2: ""
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

        <div className="flex flex-col p-20 bg-gray-10 min-h-screen">
            <h2 className="bold-24 mb-5">Add New Data</h2>
            <div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col bg-white rounded-xl p-10 space-y-8">

                        <div className="flex flex-col gap-2 md:flex-row items-center justify-center">
                            <div className="flex-1">
                                <div className="flex flex-row items-center gap-2 justify-center">
                                    <div className="flex-1 w-50">
                                        <FormField
                                            control={form.control}
                                            name="stockName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Name of the Stock </FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Enter name of the stock" {...field} />
                                                    </FormControl>
                                                    <FormDescription>
                                                        This is your public display name.
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="flex-1 w-50">
                                        <FormField
                                            control={form.control}
                                            name="stockNameDetails"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Stock Name Details</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Enter Stock Name Details" {...field} />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Stock Name Details.
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>



                                </div>


                            </div>

                            <div className="flex-1">
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
                                            <FormDescription>
                                                Date when the stock is being
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                            </div>
                        </div>


                        <div className="flex flex-col gap-2 md:flex-row items-center justify-center">
                            <div className="flex-1">


                                <div className="flex flex-row gap-2 items-center justify-center">
                                    <div className="flex-1 w-40">
                                        <FormField
                                            control={form.control}
                                            name="quantity"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Quantity</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Enter Quantity" {...field} />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Quantity
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="w-20">
                                        <FormField
                                            control={form.control}
                                            name="quantityType"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Type</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Enter Type" {...field} />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Type
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className=" w-40">
                                        <FormField
                                            control={form.control}
                                            name="quantityDetails"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Quantity Details</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Enter Quantity Details" {...field} />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Quantity Details
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>



                            </div>

                            <div className="flex-1">


                                <div className="flex flex-row gap-2 items-center justify-center">
                                    <div className="flex-1">
                                        <FormField
                                            control={form.control}
                                            name="price"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Price</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Enter Price" {...field} />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Price
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <FormField
                                            control={form.control}
                                            name="priceDetails"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Price Details</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Enter Price Details" {...field} />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Price Details
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                </div>



                            </div>
                        </div>

                        <div className="flex flex-col gap-2 md:flex-row items-center justify-center">
                            <div className="flex-1">
                                <FormField
                                    control={form.control}
                                    name="amountPaid"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Amount Paid</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Amount Paid" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Amount Paid
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                            </div>

                            <div className="flex-1">
                                <FormField
                                    control={form.control}
                                    name="amountPaidDescription"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Amount Paid Description</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Amount Paid Description" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Amount Paid Description                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="flex-1">
                                <FormField
                                    control={form.control}
                                    name="dateDescription"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Date Description</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Date Description" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Date Description
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 md:flex-row items-center justify-center">
                            <div className="flex-1">
                                <FormField
                                    control={form.control}
                                    name="additionalDetails1"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Additional Details 1</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Additional Details 1" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Additional Details 1
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                            </div>

                            <div className="flex-1">
                                <FormField
                                    control={form.control}
                                    name="additionalDetails2"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Additional Details 2</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Additional Details 2" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Additional Details 2                                          </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                        </div>
                        <Button
                            className="w-40 h-15 rounded-md bg-blue-90 text-white rounded-xl"
                            type="submit">Submit</Button>
                    </form>
                </Form>
            </div>
        </div>
    )
} 