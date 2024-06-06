'use client';
import * as React from "react"
import { useState, useEffect, useContext } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { LayoutList, PieChart, Wallet, BookOpenCheck, User } from "lucide-react"
import BigNumber from "bignumber.js";
import { Progress } from "@/components/ui/progress"
import { cpuSizeFormat, netSizeFormat, numberToThousands, ramSizeFormat, reformAccount, reformAmount } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast"
import { gqlReq } from "@/services";
import dayjs from "dayjs";
import { PageTable } from "@/components/page-table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input"

export default function ResourcesN() {
  const { toast } = useToast()
  const router = useRouter();
  const searchParams = useParams()
  const [account, setAccount] = useState(searchParams.account || '')
  const [accountInfo, setAccountInfo] = useState<any>()
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(5)
  const [dataList, setDataList] = useState(Array<any>)
  const [pageCount, setPageCount] = useState<number>(1)
  const [loading, setLoading] = useState(true)
  const [assetsList, setAssetsList] = useState(Array<any>)
  const [dmcLockedkAmount, setDmcLockedkAmount] = useState(0)
  const [dmcStakedAmount, setDmcStakedAmount] = useState(0)
  const [dmc_lock_pledge_amount, setDmc_lock_pledge_amount] = useState('0')
  const [dmcStakedTotal, setDmcStakedTotal] = useState('')
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    if (!searchParams.account && sessionStorage?.getItem('account')) {
      setAccount(sessionStorage?.getItem('account') || '')
    }
  }, [searchParams])

  useEffect(() => {
    setDmcStakedTotal(new BigNumber(dmcStakedAmount).plus(dmc_lock_pledge_amount).toFixed(4, 1))
  }, [dmcStakedAmount, dmc_lock_pledge_amount])

  useEffect(() => {
    if (account) {
      getAssetsData()
      getOrderData()
      fetch(`/v1/chain/get_account`, {
        next: { revalidate: 10 },
        method: "POST",
        body: JSON.stringify({
          account_name: account,
        })
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.account_name) {
            setAccountInfo(data)
          } else {
            toast({
              variant: 'destructive',
              title: "Uh oh! Something went wrong",
              description: "Please check if the account name is correct",
            })
          }
        })
    } else if (!sessionStorage?.getItem('account')) {
      setLoading(false)
      toast({
        variant: "destructive",
        title: "Please login first or input account name",
      })
    }
  }, [account, pageIndex])

  const handleEnterPress = (event: any) => {
    if (event.keyCode === 13) {
      // getMonitoringData(searchText)
    }
  }

  const getDmcPoolData = (makers: []) => {
    Promise.all(
      makers.map((maker: any) => maker.id)
        .map((miner) => {
          return Promise.all([
            fetch("/v1/chain/get_table_rows", {
              method: "POST",
              body: JSON.stringify({
                code: "dmc.token",
                table: "dmcmaker",
                scope: "dmc.token",
                json: true,
                lower_bound: `${reformAccount(miner)}`,
                upper_bound: `${reformAccount(miner)}`,
              })
            }).then((res) => res.json()),
            fetch("/v1/chain/get_table_rows", {
              method: "POST",
              body: JSON.stringify({
                code: "dmc.token",
                table: "makerpool",
                scope: `${reformAccount(miner)}`,
                json: true,
              })
            }).then((res) => res.json()),
          ]);
        })
    )
      .then((res) => {
        const tableData = res.map((item: any) => {
          const totalWeight = item[0].rows[0]?.total_weight;
          const totalQuantity =
            item[0].rows[0]?.total_staked.quantity.split(
              " "
            )[0];
          const ownerWeight = item[1].rows.filter((item: any) => {
            return item.owner === account;
          })[0]?.weight;
          const quantity = reformAmount(
            new BigNumber(ownerWeight)
              .div(totalWeight)
              .times(totalQuantity),
            4
          );
          return {
            quantity:
              item[0]?.rows[0] && ownerWeight ? quantity : "0",
          };
        });
        let totalStake: any = [];
        tableData.map((item) => {
          totalStake.push(item.quantity);
        });
        const sum = totalStake.reduce((pre: any, cur: any) => {
          return new BigNumber(pre)
            .plus(cur)
            .toFixed(4);
        }, 0);
        setDmcStakedAmount(sum)
      })
      .catch((err) => {

      });
  }

  const getAssetsData = () => {
    fetch("/v1/chain/get_table_rows", {
      method: "POST",
      body: JSON.stringify({
        code: "dmc.token",
        json: true,
        limit: 1000,
        scope: reformAccount(account!),
        table: "accounts",
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.rows) {
          setAssetsList(data?.rows)
        }
      })
      .catch((error) => {

      })

    gqlReq('account').find({
      where: {
        id: account
      },
    }, `
    {
      lp_maker {
        id
      }
    }
    `)
      .then((res) => res.json())
      .then((res: any) => {
        if (res?.data?.find_account[0]?.lp_maker?.length > 0) {
          getDmcPoolData(res?.data?.find_account[0]?.lp_maker)
        }
      })
  }

  const getOrderData = () => {
    setLoading(true)
    gqlReq('tokens_action').count({
      where: {
        and: [
          {
            or: [
              {
                account_from_id: account
              },
              {
                account_to_id: account
              }
            ]
          }
        ]
      },
      order: "-created_time"
    })
      .then((res) => res.json())
      .then((res) => {
        if (res?.data?.count_tokens_action) {
          setPageCount(Math.ceil(res?.data?.count_tokens_action / pageSize))
        }
      })
    gqlReq('tokens_action').find({
      where: {
        and: [
          {
            or: [
              {
                account_from_id: account
              },
              {
                account_to_id: account
              }
            ]
          }
        ]
      },
      skip: pageIndex * pageSize,
      limit: pageSize,
      order: "-id"
    }, `
    {
        account_from{
      id
    }
      account_to{
      id
    }
      contract_action
      action{
      rawData
    }
      token_from{
      token_name
        token_type
        token_status
    }
      token_to{
      token_name
        token_type
        token_status
    }
      id
    }
  `)
      .then((res) => res.json())
      .then((data: any) => {
        setLoading(false)
        const res = data?.data?.find_tokens_action
        if (res) {
          let reformList: any = [];
          res.map((item: any, index: number) => {
            if (item.action && item.action.rawData) {
              reformList.push({
                key: index,
                id: item.id,
                trx_id: item.action.rawData.trx_id,
                time: dayjs(item.action.rawData.block_time).format("MMM-DD-YYYY hh:mm:ss A"),
                type: item.contract_action,
                actData: item.action.rawData.act.data,
                block_num: item.action.rawData.block_num,
                data:
                  item.action.rawData.act.data.from &&
                    item.action.rawData.act.data.quantity
                    ? [
                      item.action.rawData.act.data.from,
                      item.action.rawData.act.data.to,
                      item.action.rawData.act.data.quantity.quantity
                        ? item.action.rawData.act.data.quantity.quantity
                        : item.action.rawData.act.data.quantity,
                      item.action.rawData.act.data.memo
                    ]
                    : item.action.rawData.act.data
              });
            }
            return false;
          });
          setDataList(reformList)
        }
      }).catch((error: any) => {
        setLoading(false)
      })
  }


  const renderInfo = () => {
    return (
      <Card>
        <CardHeader className="flex flex-row content-center items-center justify-start space-y-0">
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
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="items-center">
            <CardContent className="flex flex-row items-center justify-between space-y-0 pb-2 font-medium">
              Account : {accountInfo?.account_name || ''}
            </CardContent>
            
            {assetsList.map((e, index) => {
              if (e?.balance?.quantity?.split(' ')[1] === 'DMC') {
                return (
                  <CardContent className="font-medium">
                    Asserts : {numberToThousands(new BigNumber(e?.balance?.quantity?.split(' ')[0]).plus(dmcLockedkAmount).plus(dmcStakedTotal).toFixed(4, 1))}
                  </CardContent>
                )
              }
              return null
            })}
          </Card>
        </CardContent>
      </Card>
    )
  }


  const columns: any[] = [
    {
      accessorKey: "trx_id",
      header: "TrxId",
      cell: ({ row }: any) => {
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  variant="link"
                  className="pl-0"
                  onClick={() => router.push(`/trx-info/${row.getValue("trx_id")}`)}
                >
                  <div style={{ maxWidth: 120 }} className="overflow-hidden truncate ">{row.getValue("trx_id")}</div>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <div>{row.getValue("trx_id")}</div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      }
    },
    {
      accessorKey: "block_num",
      header: "Block Num",
      cell: ({ row }: any) => {
        return (
          <Button
            variant="link"
            className="pl-0"
            onClick={() => router.push(`/block-info/${row.getValue("block_num")}`)}
          >
            {row.getValue("block_num")}
          </Button>
        )
      }
    },
    {
      accessorKey: "type",
      header: "Type",
    },
    {
      accessorKey: "time",
      header: "Time",
      cell: ({ row }: any) => {
        return (
          <Label className="whitespace-nowrap">
            {row.getValue("time")}
          </Label>
        )
      }
    },
    {
      accessorKey: "data",
      header: "Data",
      cell: ({ row }: any) => {
        if (row.getValue("data").length === 4) {
          if (row.getValue("data")[0] === account) {
            return (
              <p>
                <span className="text-red-500">{row.getValue("data")[0]}</span>{" "}
                {`-> `} <span>{row.getValue("data")[1]}</span>{", "}
                amount:
                <span className="text-red-500">{row.getValue("data")[2]}</span>{", "}
                memo:
                <span className="text-red-500">{row.getValue("data")[3]}</span>
              </p>
            );
          }
          if (row.getValue("data")[1] === account) {
            return (
              <p>
                <span>{row.getValue("data")[0]}</span> {`-> `}{" "}
                <span className="text-red-500">{row.getValue("data")[1]}</span>{", "}
                amount:
                <span className="text-red-500">{row.getValue("data")[2]}</span>{", "}
                memo:
                <span className="text-red-500">{row.getValue("data")[3]}</span>
              </p>
            );
          }
        } else {
          if (typeof row.getValue("data") === "string") {
            return <p>{JSON.stringify(row.getValue("data").substr(0, 12) + "...")}</p>;
          } else {
            return <p> {JSON.stringify(row.getValue("data"), null, 4)}</p>;
          }
        }
      }
    },
    {
      accessorKey: "actData",
      header: "Details",
      cell: ({ row }: any) => {
        return (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary">Details</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Details</DialogTitle>
                <DialogDescription>
                  <div>
                    <pre>
                      <code>{JSON.stringify(row.getValue("actData"), null, 4)}</code>
                    </pre>
                  </div>
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogTrigger asChild>
                  <Button variant="secondary">Confirm</Button>
                </DialogTrigger>
              </DialogFooter>
            </DialogContent>
          </Dialog >
        )
      }
    },
  ]

  const renderTrxList = () => {
    return (
      <Card className="mt-5">
        <CardHeader className="flex flex-row content-center items-center justify-between space-y-0">
          <div className="flex flex-row items-center justify-center">
            <LayoutList className="mr-2 text-xl" />
            <CardTitle className="text-xl">
              Trx Lists
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <PageTable
            pageCount={pageCount}
            loading={loading}
            columns={columns}
            data={dataList}
            clickIndexPage={(index) => {
              setPageIndex(index)
            }}
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <section className="xs:w-screen sm:w-auto">
      {renderInfo()}
      {renderTrxList()}
    </section>
  )
}
