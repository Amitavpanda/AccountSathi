import { Layers , BadgeDollarSign, CreditCard, CalendarCheck} from "lucide-react"


export const NAV_LINKS = [
    {logo : Layers, name : "Stocks" , href :"/"},
    {logo : CreditCard, name : "Purchase", href :"/purchase" },
    {logo : BadgeDollarSign, name : "Sales", href :"/sales"},
    {logo : CalendarCheck, name : "InfoPerDay", href : "/getInfoPerDay"}
]