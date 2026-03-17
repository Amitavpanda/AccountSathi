import { Layers , BadgeDollarSign, CreditCard, CalendarCheck, LayoutList, CheckCircle} from "lucide-react"


export const NAV_LINKS = [
    {logo : Layers, name : "Stocks" , href :"/"},
    {logo : CreditCard, name : "Purchase", href :"/purchase" },
    {logo : BadgeDollarSign, name : "Sales", href :"/sales"},
    {logo : LayoutList, name : "Sales Overview", href : "/salesOverview"},
    {logo : CheckCircle, name : "Active Sales", href : "/activeSales"},
    {logo : CalendarCheck, name : "InfoPerDay", href : "/getInfoPerDay"}
]