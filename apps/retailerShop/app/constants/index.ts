import { Layers , BadgeDollarSign, CreditCard, CalendarCheck, LayoutList} from "lucide-react"


export const NAV_LINKS = [
    {logo : Layers, name : "Stocks" , href :"/"},
    {logo : CreditCard, name : "Purchase", href :"/purchase" },
    {logo : BadgeDollarSign, name : "Sales", href :"/sales"},
    {logo : LayoutList, name : "Sales Overview", href : "/salesOverview"},
    {logo : CalendarCheck, name : "InfoPerDay", href : "/getInfoPerDay"}
]