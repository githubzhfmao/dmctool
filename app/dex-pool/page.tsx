"use client"

import { useState, useEffect } from "react"
import ColumeChartInfo from "@/components/colume-chart"

export default function IndexPage() {

  return (
    <section className="grid grid-cols-1 items-center gap-20 pb-8 pt-6 sm:container md:py-10">
      <div className="w-[50rem] ml-auto mr-auto">
        <ColumeChartInfo />
      </div>
    </section>
  )
}
