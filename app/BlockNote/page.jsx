import { Suspense } from "react";
import PageClient from "./PageClient.jsx";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <PageClient />
    </Suspense>
  );
}
