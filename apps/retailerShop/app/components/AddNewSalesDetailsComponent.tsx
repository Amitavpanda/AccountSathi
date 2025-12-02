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


import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@repo/ui/select"
//   import { toast } from "@repo/ui"



import { format } from "date-fns"


import { BadgePlus, CalendarIcon } from "lucide-react"

import { addSalesDetailsSchema, addSupplierPurchaseDetailsSchema, addSupplierPurchaseSchema } from "../utils/validator"

import { useEffect, useState } from "react"

import { error, info } from "@repo/logs/logs"
import axios, { AxiosResponse } from "axios"
import { cn } from "../../../../packages/ui/@/lib/utils"
import Link from "next/link"



interface AddNewSalesDetailsProps {
    id: any;
}

interface SupplierType {
    id: string,
    nameOfTheSupplier: string
}


const isPaymentDoneOptions = [
    "Yes",
    "No"
]

export default function AddNewSalesDetailsComponent({ id }: AddNewSalesDetailsProps) {
    const [suppliers, setSuppliers] = useState<SupplierType[]>([]);
    const form = useForm<z.infer<typeof addSalesDetailsSchema>>({
        resolver: zodResolver(addSalesDetailsSchema),
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
            salesInfoId: id,
            additionalDetails1: "",
            additionalDetails2: "",
            supplierName: "",
            isPaymentDone: ""
        },
    })

    useEffect(() => {

        const fetchSuppliers = async () => {
            const baseUri = process.env.NEXT_PUBLIC_UI_BASE_URI;
            const getSuppliersResponse = await axios.get(`${baseUri}/getAllSuppliers`);

            if (getSuppliersResponse.status === 200) {
                setSuppliers(getSuppliersResponse.data.data);
            }
        }

        fetchSuppliers();

    }, [])
    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof addSalesDetailsSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.

        const transformedValues = {
            ...values,
            quantity: Number(values.quantity),
            price: Number(values.price),
            amountPaid: Number(values.amountPaid),
            extraAmount: Number(values.extraAmount)

        };
        try {
            const baseUri = process.env.NEXT_PUBLIC_UI_BASE_URI;
            console.log("Form data submitted: ", transformedValues);
            const response = await axios.post(`${baseUri}/addSalesDetails`, transformedValues);

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

        <div className="p-4 sm:p-6 lg:p-8">
            <div>
                <Form {...form} onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col bg-white rounded-xl p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">

                        <div className="flex flex-col gap-4 sm:gap-6 md:flex-row items-start md:items-center justify-center">
                            <div className="flex-1 w-full">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-center">
                                    <div className="flex-1 w-full">
                                        <FormField
                                            control={form.control}
                                            name="stockName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Name of the Stock </FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Enter name of the stock" {...field} className="h-11 rounded-xl" />
                                                    </FormControl>
                                                    <FormDescription>
                                                        This is your public display name.
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="flex-1 w-full">
                                        <FormField
                                            control={form.control}
                                            name="stockNameDetails"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Stock Name Details</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Enter Stock Name Details" {...field} className="h-11 rounded-xl" />
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

                            <div className="flex-1 w-full">
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
                                            <FormDescription>
                                                Date when the stock is being
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                            </div>
                        </div>


                        <div className="flex flex-col gap-4 sm:gap-6 md:flex-row items-start md:items-center justify-center">
                            <div className="flex-1 w-full">


                                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-center">
                                    <div className="flex-1 w-full">
                                        <FormField
                                            control={form.control}
                                            name="quantity"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Quantity</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Enter Quantity" {...field} className="h-11 rounded-xl" />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Quantity
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="flex-1 w-full">
                                        <FormField
                                            control={form.control}
                                            name="quantityType"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Type</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Enter Type" {...field} className="h-11 rounded-xl" />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Type
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="flex-1 w-full">
                                        <FormField
                                            control={form.control}
                                            name="quantityDetails"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Quantity Details</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Enter Quantity Details" {...field} className="h-11 rounded-xl" />
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

                            <div className="flex-1 w-full">


                                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-center">
                                    <div className="flex-1 w-full">
                                        <FormField
                                            control={form.control}
                                            name="price"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Price</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Enter Price" {...field} className="h-11 rounded-xl" />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Price
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="flex-1 w-full">
                                        <FormField
                                            control={form.control}
                                            name="priceDetails"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Price Details</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Enter Price Details" {...field} className="h-11 rounded-xl" />
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

                        <div className="flex flex-col gap-4 sm:gap-6 md:flex-row items-start md:items-center justify-center">
                            <div className="flex-1 w-full">
                                <FormField
                                    control={form.control}
                                    name="amountPaid"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Amount Paid</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Amount Paid" {...field} className="h-11 rounded-xl" />
                                            </FormControl>
                                            <FormDescription>
                                                Amount Paid
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                            </div>

                            <div className="flex-1 w-full">
                                <FormField
                                    control={form.control}
                                    name="amountPaidDescription"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Amount Paid Description</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Amount Paid Description" {...field} className="h-11 rounded-xl" />
                                            </FormControl>
                                            <FormDescription>
                                                Amount Paid Description                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="flex-1 w-full">
                                <FormField
                                    control={form.control}
                                    name="dateDescription"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Date Description</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Date Description" {...field} className="h-11 rounded-xl" />
                                            </FormControl>
                                            <FormDescription>
                                                Date Description                                        </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-4 sm:gap-6 md:flex-row items-start md:items-center justify-center">
                            <div className="flex-1 w-full">
                                <FormField
                                    control={form.control}
                                    name="additionalDetails1"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Additional Details 1</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Additional Details 1" {...field} className="h-11 rounded-xl" />
                                            </FormControl>
                                            <FormDescription>
                                                Additional Details 1
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                            </div>

                            <div className="flex-1 w-full">
                                <FormField
                                    control={form.control}
                                    name="additionalDetails2"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Additional Details 2</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Additional Details 2" {...field} className="h-11 rounded-xl" />
                                            </FormControl>
                                            <FormDescription>
                                                Additional Details 2                                          </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                        </div>


                        <div className="flex flex-col gap-4 sm:gap-6 md:flex-row items-start md:items-center justify-center">
                            <div className="flex-1 w-full">
                                <FormField
                                    control={form.control}
                                    name="supplierName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Supplier</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="h-11 rounded-xl">
                                                        <SelectValue placeholder="Select a Supplier" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="bg-white rounded-xl border">
                                                    {suppliers.map((supplier: SupplierType) => (
                                                        <>
                                                            <SelectItem className="text-gray-900 focus:bg-blue-50 focus:rounded-lg" value={supplier.nameOfTheSupplier}>{supplier.nameOfTheSupplier}</SelectItem>
                                                        </>
                                                    ))}

                                                </SelectContent>
                                            </Select>
                                            <FormDescription>
                                                Select the supplier
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                            </div>

                            <div className="flex-1 w-full">
                                <FormField
                                    control={form.control}
                                    name="isPaymentDone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Payment Done</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="h-11 rounded-xl">
                                                        <SelectValue placeholder="Select if Payment is Done or not" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="bg-white rounded-xl border">
                                                    {isPaymentDoneOptions.map((isPaymentDoneOption) => (
                                                        <SelectItem key={isPaymentDoneOption} className="text-gray-900 focus:bg-blue-50 focus:rounded-lg" value={isPaymentDoneOption}>{isPaymentDoneOption}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>

                                            <FormDescription>
                                                Payment Done or not                                        </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 sm:gap-6 md:flex-row items-start md:items-center justify-center">
                        <div className="flex-1 w-full">
                                <FormField
                                    control={form.control}
                                    name="extraAmount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Extra Amount</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Extra Amount" {...field} className="h-11 rounded-xl" />
                                            </FormControl>
                                            <FormDescription>
                                                Extra Amount
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="flex-1 w-full">
                                <FormField
                                    control={form.control}
                                    name="extraAmountDescription"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Extra Amount Description</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Extra Amount Description" {...field} className="h-11 rounded-xl" />
                                            </FormControl>
                                            <FormDescription>
                                                Extra Amount Description
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                        </div>


                        <div className="flex justify-center pt-4">
                        <Button
                            className="w-full sm:w-48 h-12 sm:h-11 md:h-12 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 mobile-button touch-target border-0"
                            type="submit">
                            <BadgePlus className="h-4 w-4" />
                            <span>Add Data</span>
                        </Button>
                        </div>
                </Form>
            </div>
        </div>
    )
} 