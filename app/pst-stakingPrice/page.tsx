"use client"
import Link from "next/link"

import { siteConfig } from "@/config/site"
import Resources from "@/components/resources"
import LineChart from "@/components/line-chart"
import * as Tabs from '@radix-ui/react-tabs';
import { useState, useEffect } from "react"
import { AlignJustify } from 'lucide-react';
import { Globe2, FileJson2 } from "lucide-react"
import dayjs from "dayjs";
import {
  div,
  divContent,
  divHeader,
  divTitle,
} from "@/components/ui/div"
import { Skeleton } from "@/components/ui/skeleton"
import BigNumber from "bignumber.js"
import { Button } from "@/components/ui/button";
import { gqlReq } from "@/services";
import { useRouter } from 'next/navigation';
import { numberToThousands } from "@/lib/utils";

interface ChainInfo {
  head_block_num: number,
  head_block_time: string,
  head_block_producer: string,
  last_irreversible_block_num: number,
  last_irreversible_block_time: string,
}
import { Calculator } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

export default function IndexPage() {

  const [title,setTitle] = useState("PST Staking Price");
  const [tab, setTab] = useState(1);
  const [time, setTime] = useState(1);
  const [space, setSpace] = useState('')
  const { toast } = useToast()
  const [pledgeRate, setPledgeRate] = useState('')
  const [calculateNeedPledgeDmc, setCalculateNeedPledgeDmc] = useState('')
  const [calculateRewardDmc, setCalculateRewardDmc] = useState('')
  const [benchmarkPrice, setBenchmarkPrice] = useState('')
  const [transactionComputingAvg, setTransactionComputingAvg] = useState<any>(0)
  const [oneDayMinerReward, setOneDayMinerReward] = useState<any>(undefined)
  const [underGoingPst, setUnderGoingPst] = useState<any>(0)
  const [underGoingDmc, setUnderGoingDmc] = useState<any>(0)
  const [dmcProduction, setDmcProduction] = useState<any>(undefined)
  const [avgStakeRate, setAvgStakeRate] = useState<any>(undefined)
  const [orderLockedPstTotal, setOrderLockedPstTotal] = useState<any>(undefined)
  const getOverView = () => {
    fetch(`/innerUniswapTrade`, {
      next: { revalidate: 10 },
      method: "POST",
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mode: 'quiet'
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.DMCTotal) {
          setDmcProduction(data?.DMCTotal.split(' ')[0])
        }
      })
    fetch(`/checkAvgStakeRate`, {
      next: { revalidate: 10 },
      method: "POST",
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        states: 'underGoing'
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.avgStakeRate) {
          setAvgStakeRate(data?.avgStakeRate / 100)
        }
      })
  }
  useEffect(() => {
    if (dmcProduction && avgStakeRate && orderLockedPstTotal) {
      const allRate = new BigNumber(2).plus(avgStakeRate)
      const userRate = new BigNumber(1).plus(avgStakeRate)
      setOneDayMinerReward(new BigNumber(dmcProduction).div(allRate).div(orderLockedPstTotal).times(userRate).toFixed(4, 1))
    }
  }, [dmcProduction, avgStakeRate, orderLockedPstTotal])
  useEffect(() => {
    const fetchData = async () => {
      try {
        fetch('/data')
          .then((res) => res.json())
          .then((cacheData: any) => {
            console.log('order-data: ', cacheData)
            if (cacheData && cacheData.CacheTimestamp) {
              const { OrderLockedPstTotal, FinishedPST, UnderGoingPst, UnderGoingDmc } = cacheData
              setOrderLockedPstTotal(OrderLockedPstTotal)
              setUnderGoingPst(UnderGoingPst)
              setUnderGoingDmc(UnderGoingDmc)
            } else {
            }
          })
      } catch (error) {
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    if (underGoingDmc && underGoingPst) {
      setTransactionComputingAvg(new BigNumber(underGoingDmc).div(underGoingPst).times(1024).toFixed(4, 1))
    }
  }, [underGoingDmc, underGoingPst])
  useEffect(() => {
    getBenchMarkPrice()
    getOverView()
  }, [])
  const getBenchMarkPrice = () => {
    fetch("/v1/chain/get_table_rows", {
      method: "POST",
      body: JSON.stringify({
        code: "dmc.token",
        json: true,
        scope: "dmc.token",
        table: "bcprice",
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.rows.length > 0) {
          setBenchmarkPrice(data?.rows[0]?.benchmark_price)
        } else {
          toast({
            variant: 'destructive',
            title: "Failed to retrieve average transaction price, please refresh the page and try again.",
          })
        }
      })
      .catch((error) => {
        toast({
          variant: 'destructive',
          title: "Failed to retrieve average transaction price, please refresh the page and try again.",
        })
      })
  }
  useEffect(() => {
    if (!space || !pledgeRate) {
      setCalculateNeedPledgeDmc('')
      setCalculateRewardDmc('')
    } else if (!benchmarkPrice || !transactionComputingAvg || !oneDayMinerReward) {
      toast({
        variant: 'default',
        title: "Requesting relevant parameters, please wait or refresh the page and try again.",
      })
    } else if (transactionComputingAvg && oneDayMinerReward) {
      setCalculateNeedPledgeDmc(new BigNumber(space).times(1000).times(pledgeRate).times(benchmarkPrice).toFixed(4, 1) || '')
      const avage = new BigNumber(pledgeRate).div(transactionComputingAvg).times(benchmarkPrice).times(1000)
      setCalculateRewardDmc(new BigNumber(space).times(avage).times(oneDayMinerReward).toFixed(4, 1) || '')
    }
  }, [space, pledgeRate, benchmarkPrice, transactionComputingAvg, oneDayMinerReward])
  const changeTabs = (tab :any,title:any) => {
    setTab(tab);
    setTitle(title)
    // todo 查询数据方法
  }
  const changeTimes = (time:any) => {
    setTime(time);
  }
  const renderCalculate = () => {
    return (
      <Dialog  className="w-[600px] h-[462px]">
        <DialogTrigger asChild>
          <Calculator style={{ marginTop:"4px", marginLeft:"5px" }} className="cursor-pointer" />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mining Profit Calculator</DialogTitle>
            <DialogDescription>
              <div className="mt-5 flex flex-row items-center justify-around py-2">
                <div className="ml-2 flex w-28 flex-row items-center justify-between">
                  <Label>Mining Rig Space</Label>
                  <Label>:</Label>
                </div>
                <Input
                  maxLength={9}
                  className="ml-2 h-9 xs:w-[200px] md:w-[300px] lg:w-[300px]"
                  value={space}
                  type="search"
                  placeholder="Mining Space"
                  onChange={(e) => {
                    if (e?.target?.value?.trim() && !new BigNumber(e?.target?.value?.trim()).isGreaterThan(0)) {
                      toast({
                        variant: 'destructive',
                        title: "Please enter a valid mining rig capacity.",
                      })
                    } else {
                      setSpace(e?.target?.value?.trim())
                    }
                  }}
                />
                <Label className="mx-2 w-8">TB</Label>
              </div>
              <div className="mt-2 flex flex-row items-center justify-around py-2">
                <div className="ml-2 flex w-28 flex-row items-center justify-between">
                  <Label>Pledge Rate</Label>
                  <Label>:</Label>
                </div>
                <Input
                  maxLength={9}
                  className="ml-2 h-9 xs:w-[200px] md:w-[300px] lg:w-[300px]"
                  value={pledgeRate}
                  type="search"
                  placeholder="Benchmark Stake Rate m=4"
                  onChange={(e) => {
                    if (e?.target?.value?.trim() && !new BigNumber(e?.target?.value?.trim()).isGreaterThan(0)) {
                      toast({
                        variant: 'destructive',
                        title: "Please enter a valid collateralization rate.",
                      })
                    } else {
                      setPledgeRate(e?.target?.value?.trim())
                    }
                  }}
                />
                <Label className="mx-2 w-8 opacity-0">PH</Label>
              </div>
              <div className="mt-2 flex h-12 flex-row items-center justify-around py-2">
                <div className="ml-2 flex w-28 flex-row items-center justify-between">
                  <Label>Required Staking DMC</Label>
                  <Label>:</Label>
                </div>
                <Label className="text-center xs:w-[200px] md:w-[300px] lg:w-[300px]">{calculateNeedPledgeDmc && numberToThousands(calculateNeedPledgeDmc) || '--'}</Label>
                <Label className="mx-2 w-8">DMC</Label>
              </div>
              <div className="mt-2 flex h-12 flex-row items-center justify-around py-2">
                <div className="ml-2 flex w-28 flex-row items-center justify-between">
                  <Label>Daily Estimated Earnings</Label>
                  <Label>:</Label>
                </div>
                <Label className="text-center xs:w-[200px] md:w-[300px] lg:w-[300px]">{calculateRewardDmc && numberToThousands(calculateRewardDmc) || '--'}</Label>
                <Label className="mx-2 w-8">DMC</Label>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog >
    )
  }
  return (
    <section className="grid grid-cols-11 sm:container font-bold " style={{ height: `calc(100vh - 64px)` }}>
      <div className=" pl-[24px] text-sm text-[#A0A0A0] bg-[#1e1e1e] h-full col-span-2" >
        <div className="mt-[44px] " style={tab==1 ? { color: "white" } : {}} onClick={()=> changeTabs(1,"PST Staking Price")}>PST Staking Price</div>
        <div className="mt-[44px] " style={tab==2 ? { color: "white" } : {}} onClick={()=> changeTabs(2,"质押率清算曲线")}>质押率清算曲线</div>
        <div className="mt-[44px] " style={tab==3 ? { color: "white" } : {}} onClick={()=> changeTabs(3,"提供者矿工奖励曲线")}>提供者矿工奖励曲线</div>
        <div className="mt-[44px] " style={tab==4 ? { color: "white" } : {}} onClick={()=> changeTabs(4,"消费者矿工奖励曲线")}>消费者矿工奖励曲线</div>
        <div className="mt-[44px] " style={tab==5 ? { color: "white" } : {}} onClick={()=> changeTabs(5,"RSI/DMC价格曲线")}>RSI/DMC价格曲线</div>
      </div>
      <div className="col-span-9 mt-[76px]">
        <div className="text-[22px] flex justify-center aligin-center ">{title}</div>
        <div className="flex justify-end mt-[26px] ">
          <div className="flex w-[335px] h-[30px] rounded-lg border-[0.5px] border-[#5A5A5A] text-xs">
            <div className="leading-[29px] flex justify-center w-[67px] h-[29px] rounded-lg" style={time==1 ? { backgroundColor: "#2e2e2e" } : {}} onClick={()=> changeTimes(1)}>15min</div>
            <div className="leading-[29px] flex justify-center w-[67px] h-[29px] rounded-lg" style={time==2 ? { backgroundColor: "#2e2e2e" } : {}} onClick={()=> changeTimes(2)}>1h</div>
            <div className="leading-[29px] flex justify-center w-[67px] h-[29px] rounded-lg" style={time==3 ? { backgroundColor: "#2e2e2e" } : {}} onClick={()=> changeTimes(3)}>1day</div>
            <div className="leading-[29px] flex justify-center w-[67px] h-[29px] rounded-lg" style={time==4 ? { backgroundColor: "#2e2e2e" } : {}} onClick={()=> changeTimes(4)}>1week</div>
            <div className="leading-[29px] flex justify-center w-[67px] h-[29px] rounded-lg" style={time==5 ? { backgroundColor: "#2e2e2e" } : {}} onClick={()=> changeTimes(5)}>1month</div>
          </div>
          <div className="leading-[29px] p-[3]  rounded-lg">{renderCalculate()}</div>
        </div>
        
        <div className="flex justify-center mt-[76px]"><LineChart /></div>
      </div>
    </section>
  )
}
