import Link from "next/link"

import { siteConfig } from "@/config/site"
import Resources from "@/components/resources"
import OrderList from "@/components/order-list"

export default function IndexPage() {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <OrderList />
    </section>
  )
}
