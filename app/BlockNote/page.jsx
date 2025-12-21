import { Suspense } from "react";
import PageClient from "./[category]/write/PageClient.jsx";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <PageClient />
    </Suspense>
  );
}
