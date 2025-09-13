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
            <div style={{
                backgroundColor: 'white',
                padding: '2.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
            }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    {NAV_LINKS.map((link) => (
                        <Link key={link.name} href={link.href}>
                            <Button style={{
                                width: '10rem',
                                height: '3.75rem',
                                borderRadius: '0.375rem',
                                backgroundColor: 'white',
                                color: 'black',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <link.logo style={{ marginRight: '0.25rem', height: '1rem', width: '1.25rem' }} />  {link.name}
                            </Button>
                        </Link>
                    ))}
                </div>
            </div>
        </>
    )
}





