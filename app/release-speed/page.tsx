"use client"

import PieChartInfo from "@/components/pie-chart"
import { useState, useEffect } from "react"
import * as Progress from '@radix-ui/react-progress';

export default function IndexPage() {
  const [progress, setProgress] = useState(13)
  useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500);
    return () => clearTimeout(timer);
  }, [])
  return (
    <section className="grid grid-cols-2 items-center gap-20 pb-8 pt-6 sm:container md:py-10">
      <PieChartInfo />
      <div className="grid grid-cols-4 gap-y-12">
        <span className="col-span-3 flex ">
          <div className="w-5 h-5 bg-[#fcb24f] rounded-md"></div>
          <div className="ml-6 text-sm">
            <div>60%    Mining </div>
            <div className="text-xs">includes all types mining</div>
          </div>
        </span>
        <span className="text-xs flex items-center justify-end">600,000,000 DMC</span>

        <span className="col-span-3 flex ">
          <div className="w-5 h-5 bg-[#fcb24f] rounded-md"></div>
          <div className="ml-6 text-sm">
            <div>60%    Mining </div>
            <div className="text-xs">includes all types mining</div>
          </div>
        </span>
        <span className="text-xs flex items-center justify-end">600,000,000 DMC</span>

        <span className="col-span-3 flex ">
          <div className="w-5 h-5 bg-[#fcb24f] rounded-md"></div>
          <div className="ml-6 text-sm">
            <div>60%    Mining </div>
            <div className="text-xs">includes all types mining</div>
          </div>
        </span>
        <span className="text-xs flex items-center justify-end">600,000,000 DMC</span>

        <span className="col-span-3 flex ">
          <div className="w-5 h-5 bg-[#fcb24f] rounded-md"></div>
          <div className="ml-6 text-sm">
            <div>60%    Mining </div>
            <div className="text-xs">includes all types mining</div>
          </div>
        </span>
        <span className="text-xs flex items-center justify-end">600,000,000 DMC</span>

      </div>

      <div className="w-full h-20 bg-[#232323] flex rounded-md">
        <div className="basis-1/6 text-xs  flex items-center justify-center">Total</div>
        <div className="basis-5/6 text-[#F7B34E] font-blod text-2xl flex items-center justify-center">1,000,000,000 DMC</div>
      </div>

      <div className="w-full h-20 bg-[#232323] flex rounded-md">
        <div className="basis-2/12 text-xs flex items-center justify-center" >Release</div>
        <div className="basis-8/12 text-[#F7B34E] font-blod text-2xl flex items-center justify-center">1,000,000,000 DMC</div>
        <div className="basis-2/12 text-[#F7B34E]  text-2xl flex items-center justify-center">10%</div>
      </div>

      <div className="col-span-2 relative">
        <div>Mining</div>
        <div className="absolute opacity-100 z-10 top-7 right-5 text-[#f7b34e]">100,000,000 DMC</div>
        <Progress.Root className="z-0 relative overflow-hidden h-8 bg-[#3a3a3a] w-full rounded-full" value={progress}>
          <Progress.Indicator
            className="bg-[#fcb24f] w-full h-full transition-transfor"
            style={{ transform: `translateX(-${100 - progress}%)` }}
          />
        </Progress.Root>
        <div>600,000,000 DMC</div>
      </div>

    </section>
  )
}
