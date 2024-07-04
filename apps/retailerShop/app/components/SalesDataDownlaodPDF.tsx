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


interface SalesDataDownloadPDFProps {
    id: string
}

export  function SalesDataDownloadPDF({ id }: SalesDataDownloadPDFProps) {


    const form = useForm<z.infer<typeof salesDataDurationSchema>>({
        resolver: zodResolver(salesDataDurationSchema),
        defaultValues: {
            salesInfoId: id,
        },
    })


     async function onSubmit(values: z.infer<typeof salesDataDurationSchema>) {
        
        try{
            console.log("form data submitted", values);
            const response = await axios.post("http://0.0.0.0:1337/getSalesDataDuration", values);
            console.log("response", response);

            if(response.status = 200){
                console.log('Successfully got the data from the backend.');

                await new Promise(resolve => setTimeout(resolve, 1000));
                form.reset();
            }
            else{
                console.error("does not got the data from the backend");
            }

        }

        catch(err){
            console.error("Error Getting response: ", err);
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
            </div>
        </>
    )
}