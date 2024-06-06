'use client';
import * as React from "react"
import { useState, useEffect } from "react"
import { LayoutList } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { gqlReq } from '@/services/index';
import BigNumber from "bignumber.js";
import dayjs from "dayjs";
import { SampleTable } from "@/components/sample-table";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { numberToThousands } from "@/lib/utils";

interface RowTypes {
  row: {
    index: number
    location: number
    owner: string
    total_votes: string
    unpaid_blocks: number
    getValue: { (value: string): (any) }
  }
}

export default function MonitoringList() {
  const router = useRouter();
  const { toast } = useToast()
  const [dataList, setDataList] = useState(Array<any>)
  const [loading, setLoading] = useState(true)
  const [pageIndex, setPageIndex] = useState(0)
  const [searchText, setSearchText] = useState('');

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

  const handleEnterPress = (event: any) => {
    if (event.keyCode === 13) {
      getMonitoringData(searchText)
    }
  }

  useEffect(() => {
    getMonitoringData(searchText)
  }, [pageIndex])

  const renderOrderState = (state: any) => {
    if (state === 0) {
      return (
        <div style={{ color: "#EB4C48" }}>
          Failed to reach a consensus
        </div>
      )
    }
    if (!state) {
      return '--'
    }
    if (state !== 4 && state !== 5) {
      return (
        <div style={{ color: "#FF9B3D" }}>
          In progress
        </div>
      )
    }
    return (
      <div>OVER</div>
    )
  }

  const columns: any[] = [
    {
      accessorKey: "address",
      header: "Monitoring wallet",
      cell: ({ row }: RowTypes) => {
        return (
          <Button
            variant="link"
            className="pl-0"
            onClick={() => router.push(`/resources/${row.getValue("address")}`)}
          >
            {row.getValue("address")}
          </Button>
        )
      }
    }
  ]
  return (
    <section className="xs:w-screen sm:w-auto">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <Input
            className="h-9 xs:w-[200px] md:w-[300px] lg:w-[300px]"
            value={searchText}
            type="search"
            placeholder="Search For An Account"
            onKeyDown={handleEnterPress}
            onChange={(e) => {
              setSearchText(e?.target?.value?.trim())
            }}
          />
        </CardHeader>
        <CardContent>
          <SampleTable
            loading={loading}
            columns={columns}
            data={dataList}
          />
        </CardContent>
      </Card>
    </section >
  )
}
