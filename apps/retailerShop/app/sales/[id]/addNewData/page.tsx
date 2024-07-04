import AddNewPurchaseDetailsComponent from "../../../components/AddNewPurchaseDetailsComponent";
import AddNewSalesDetailsComponent from "../../../components/AddNewSalesDetailsComponent";




export default function AddNewSalesDetails({ params }: any){
    const { id } = params;
    return(
            <>
                        <h1> the id is {id}</h1>
                        <AddNewSalesDetailsComponent id={id}/>

            </>
    )
}