import { Loader } from "@/components/custom/custom-loader";
import UserActivityList from "@/components/pages/user-activity-list/UserActivityList";
import { Suspense } from "react";

export default function Page(){
    return (
        <Suspense fallback={<Loader />} >
            <UserActivityList />
        </Suspense>
    )
}