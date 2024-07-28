import { PurchaseDataDownloadPDF } from "../../../components/PurchaseDataDownloadPDF";




export default function PurchaseDataDownloadPDFMain({ params }: any){
    const { id } = params;
    return(
            <>
                        <h1> the id is {id}</h1>
                        <PurchaseDataDownloadPDF id={id}/>
            </>
    )
}