import { SalesDataDownloadPDF } from "../../../components/SalesDataDownlaodPDF";




export default function SalesDataDownloadPDFMain({ params }: any){
    const { id } = params;
    return(
            <>
                        <h1> the id is {id}</h1>
                        <SalesDataDownloadPDF id={id}/>
            </>
    )
}