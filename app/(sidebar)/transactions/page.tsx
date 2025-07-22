import { Loader } from "@/components/custom/custom-loader";
import Transaction from "@/components/pages/transactions/Transactions";
import { Suspense } from "react";

export default function Page(){
    return (
        <Suspense fallback={<Loader />} >
            <Transaction />
        </Suspense>
    )
}