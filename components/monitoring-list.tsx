'use client';
import * as React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input"
import { Search } from 'lucide-react';


export default function MonitoringList() {
  const router = useRouter();
  const [dataList, setDataList] = useState(Array<any>)
  const [loading, setLoading] = useState(true)
  const [pageIndex, setPageIndex] = useState(0)
  const [searchText, setSearchText] = useState('');

  // 查询数据
  const getMonitoringData = (searchTextLocal: string,) => {
    setLoading(true)
    setLoading(false)
    const res = [{address:'datamall', id: 1},{address:'datamall', id: 2}]
    if (res && res.length > 0) {
      setDataList(res)
    } else {
      setDataList([])
    }
  }

  // 回车
  const handleEnterPress = (event: any) => {
    if (event.keyCode === 13) {
      getMonitoringData(searchText)
    }
  }

  useEffect(() => {
    getMonitoringData(searchText)
  }, [pageIndex])

  // 搜索框
  const searchBox = 
    <div className="relative flex item-center justify-center w-[780px] ml-auto mr-auto color-[#868686]">
      <Search className="absolute left-[44px] top-[11px] w-[20px] h-[20px]"  color="#868686"/>
      <Input
        type="search"
        value={searchText}
        placeholder="Search for an account"
        className="pl-[82px] h-[40px] w-full rounded-full color-[#868686] bg-[#2A2A2A]"
        onKeyDown={handleEnterPress}
        onChange={(e) => {
          setSearchText(e?.target?.value?.trim())
        }}
      />
    </div>;
  const monitoringList = dataList.map((p) => (
    <div className="w-[362px] h-[48px] ml-auto mr-auto mt-[36px] bg-[#2A2A2A] rounded-3xl text-[#F7B34E] pl-[106px] text-sm font-bold pt-[16px]" 
      onClick={() => router.push(`/resources/${p.address}`)}>
      Monitoring： {p.address}
    </div>
  ));

  return (
    <section className="xs:w-screen sm:w-auto">
      {searchBox}
      {monitoringList}
    </section >
  )
}
