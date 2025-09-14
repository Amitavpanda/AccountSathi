"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"


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


import { BadgePlus } from "lucide-react"

import { addSupplierPurchaseSchema } from "../utils/validator"

import { useEffect, useState } from "react"

import { error, info } from "@repo/logs/logs"
import axios, { AxiosResponse } from "axios"



export default function AddNewPurchaseComponent() {

    const form = useForm<z.infer<typeof addSupplierPurchaseSchema>>({
        resolver: zodResolver(addSupplierPurchaseSchema),
        defaultValues: {
            nameOfTheSupplier: "",
            phoneNumber: "",
            address: "",
            totalAmountDue: "",
            listOfItems: "",
            accountDetails : "",
            additionalDetails : ""
        },
    })
    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof addSupplierPurchaseSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.

        const transformedValues = {
            ...values,
            totalAmountDue: Number(values.totalAmountDue), // Convert to number
            listOfItems: values.listOfItems.split(",") // Split string into array
          };
        try {
            const baseUri = process.env.NEXT_PUBLIC_UI_BASE_URI;
            console.log("Form data submitted: ", transformedValues);
            const response = await axios.post(`${baseUri}/addSupplierPurchase`, transformedValues);
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

        <div className="flex flex-col p-3 sm:p-4 md:p-6 lg:p-8 xl:p-20 min-h-screen">
            {/* Header Section */}
            <div className="mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 leading-tight mb-2">
                    Add New Supplier
                </h2>
                <p className="text-sm sm:text-base text-slate-600">
                    Fill in the details to add a new supplier to your purchase records
                </p>
            </div>

            {/* Form Container */}
            <div className="max-w-4xl mx-auto">
                <Form {...form} onSubmit={form.handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-lg border border-slate-200 p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">

                        <div className="flex flex-col gap-2 md:flex-row items-center justify-center">
                            <div className="flex-1">
                                <FormField
                                    control={form.control}
                                    name="nameOfTheSupplier"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name of the Supplier</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter name of the Supplier"
                                                    {...field}
                                                    className="h-12 rounded-lg border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 text-base"
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                This is your public display name.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                            </div>

                            <div className="flex-1">
                                <FormField
                                    control={form.control}
                                    name="phoneNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Phone Number</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="tel"
                                                    placeholder="Enter Phone Number"
                                                    {...field}
                                                    className="h-12 rounded-lg border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 text-base"
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Enter Phone Number
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
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Address</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter Address"
                                                    {...field}
                                                    className="h-12 rounded-lg border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 text-base"
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Address
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                            </div>

                            <div className="flex-1">
                                <FormField
                                    control={form.control}
                                    name="totalAmountDue"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Total Amount Due</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="Enter Total Amount Due"
                                                    {...field}
                                                    className="h-12 rounded-lg border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 text-base"
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Enter Total Amount Due
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
                                    name="accountDetails"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Account Details</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter Account Details" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Account Details
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                            </div>

                            <div className="flex-1">
                                <FormField
                                    control={form.control}
                                    name="additionalDetails"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Additional Details</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter Additional Details" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Enter Additional Details
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        
                        <div className="flex-1">
                                <FormField
                                    control={form.control}
                                    name="listOfItems"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>List Of Items</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="List Of Items (comma separated)"
                                                    {...field}
                                                    className="h-12 rounded-lg border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 text-base"
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                List Of Items
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        <Button
                            type="submit"
                            className="w-full sm:w-48 h-12 sm:h-11 md:h-12 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 mobile-button touch-target border-0"
                        >
                            <BadgePlus className="h-4 w-4 sm:h-4 sm:w-4" />
                            <span>Add Supplier</span>
                        </Button>
                </Form>
            </div>
        </div>
    )
} 