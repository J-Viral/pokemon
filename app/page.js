import Home from "./home/page";
import { Suspense } from "react";

export default function main() {
  return (
    <>
      <Suspense>
        <Home />
      </Suspense>
    </>
  )
}