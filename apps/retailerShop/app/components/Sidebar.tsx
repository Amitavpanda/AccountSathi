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
            {/* Universal: Professional horizontal header */}
            <div className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-200 shadow-sm">
                <div className="flex items-center justify-between gap-4 p-4 max-w-7xl mx-auto">
                    {/* Logo Section */}
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-xl">A</span>
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="text-2xl font-bold text-slate-800 leading-tight">AccountSathi</h1>
                            <p className="text-sm text-slate-500 font-medium">Admin Dashboard</p>
                        </div>
                    </div>

                    {/* Navigation Section */}
                    <div className="flex items-center gap-2 md:gap-4">
                        {NAV_LINKS.map((link) => (
                            <Link key={link.name} href={link.href}>
                                <Button className="h-12 w-12 md:h-14 md:w-auto md:px-6 rounded-xl bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-200 transition-all duration-300 flex items-center justify-center gap-2 text-sm font-medium shadow-sm hover:shadow-md group touch-target mobile-button">
                                    <div className="w-6 h-6 md:w-8 md:h-8 bg-slate-100 group-hover:bg-blue-100 rounded-lg flex items-center justify-center transition-colors duration-300">
                                        <link.logo className="h-3 w-3 md:h-4 md:w-4 text-slate-600 group-hover:text-blue-600" />
                                    </div>
                                    <span className="hidden md:inline truncate">{link.name}</span>
                                </Button>
                            </Link>
                        ))}
                    </div>

                    {/* User Section (Optional) */}
                    <div className="hidden md:flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                            <span className="text-slate-600 font-medium text-sm">A</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}





