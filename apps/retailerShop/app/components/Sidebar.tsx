"use client"

import { Button } from "@repo/ui/button";
import { BadgePlus, DiamondPlusIcon, LayoutDashboard, Mail } from "lucide-react"




import axios, { AxiosResponse } from "axios";

import { NAV_LINKS } from "../constants";
import { useEffect, useState } from "react";

import { error, info } from "@repo/logs/logs";
import Link from "next/link";
import validate from "api/src/middleware/validateResource";

export interface Category {
    id: number;
    name: string;
    pic: string
}

export default function Sidebar() {



    return (
        <>
            <div className="bg-white p-10 flex flex-col gap-y-4">
                <div className="flex flex-col items-center gap-y-2">
                    {NAV_LINKS.map((link) => (
                        <Link key={link.name} href={link.href}>
                            <Button className="w-40 h-15 rounded-md bg-white text-black items-center">
                                <link.logo className="mr-1 h-4 w-5 " />  {link.name}
                            </Button>
                        </Link>
                    ))}
                </div>
            </div>
        </>
    )
}





