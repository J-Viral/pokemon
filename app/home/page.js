import HomeContent from "./pageContent";
import { Suspense } from "react";

export default function Home() {
  return (
    <>
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
    </>
  )
}