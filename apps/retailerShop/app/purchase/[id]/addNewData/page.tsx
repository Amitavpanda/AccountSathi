import AddNewPurchaseDetailsComponent from "../../../components/AddNewPurchaseDetailsComponent";




export default function AddNewPurchasDetails({ params }: any){
    const { id } = params;
    return(
            <>
                        <h1> the id is {id}</h1>
                        <AddNewPurchaseDetailsComponent id={id}/>

            </>
    )
}