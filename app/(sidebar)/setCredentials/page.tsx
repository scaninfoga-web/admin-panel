import { Loader } from "@/components/custom/custom-loader";
import SetCredentials from "@/components/pages/setCredentials/SetCredentials";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<Loader />}>
      <SetCredentials />
    </Suspense>
  );
}
