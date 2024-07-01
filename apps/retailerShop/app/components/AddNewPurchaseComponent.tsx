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

        <div className="flex flex-col p-20 bg-gray-10 min-h-screen">
            <h2 className="bold-24 mb-5">Add New Supplier</h2>
            <div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col bg-white rounded-xl p-10 space-y-8">

                        <div className="flex flex-col gap-2 md:flex-row items-center justify-center">
                            <div className="flex-1">
                                <FormField
                                    control={form.control}
                                    name="nameOfTheSupplier"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name of the Supplier</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter name of the Supplier" {...field} />
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
                                                <Input placeholder="Enter Phone Number" {...field} />
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
                                                <Input placeholder="Enter Address" {...field} />
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
                                                <Input placeholder="Enter Total Amount Due" {...field} />
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
                        
                        <div className="flex-1">
                                <FormField
                                    control={form.control}
                                    name="listOfItems"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>List Of Items</FormLabel>
                                            <FormControl>
                                                <Input placeholder="List Of Items" {...field} />
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
                            className="w-40 h-15 rounded-md bg-blue-90 text-white rounded-xl"
                            type="submit">Submit</Button>
                    </form>
                </Form>
            </div>
        </div>
    )
} 