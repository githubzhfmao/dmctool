'use client'
import * as React from "react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { NavItem } from "@/types/nav"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { useRouter, usePathname } from 'next/navigation';
import BigNumber from "bignumber.js"
import logo from "../public/logo.png";
import Image from 'next/image';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { ChevronDown } from 'lucide-react';
import classNames from 'classnames';
import '@/styles/main-nav.css'


interface MainNavProps {
  items?: NavItem[]
}

export function MainNav({ items }: MainNavProps) {
  const router = useRouter()
  const [activeItem, setActiveItem] = useState('Home');
  const pathname = usePathname()

  useEffect(() => {
    const path = pathname.split('/').length > 1 ? pathname.split('/')[1] : 'home'
    setActiveItem(path || 'home')
  }, [pathname])

  const menuItem = (
    <div className="flex">
      <NavigationMenu.Item className="relative pr-10 pt-4">
        <NavigationMenu.Trigger className="flex font-bold text-base">
          DMC Info<ChevronDown className="ml-2 mt-1" size="16px" aria-hidden />
        </NavigationMenu.Trigger>
        <NavigationMenu.Content className="absolute text-sm bg-stone-800 px-5 pt-3 mt-5 pb-5 w-40 left-200">
          <ul className="pt-2 grid gap-y-3">
            <li>Fortune List</li>
            <li>Release Speed</li>
            <li>Monitoring</li>
            <li>PST Staking Price</li>
            <li>Staking RSI bonus</li>
            <li>RSI/DMC Price</li>
          </ul>
        </NavigationMenu.Content>
      </NavigationMenu.Item>
      
      <NavigationMenu.Item className="relative pr-10 pt-4">
        <NavigationMenu.Trigger className="flex font-bold text-base">
        Market Data<ChevronDown className="ml-2 mt-1" size="16px" aria-hidden />
        </NavigationMenu.Trigger>
        <NavigationMenu.Content className="absolute text-sm bg-stone-800 px-5 pt-3 mt-5 pb-5 w-40 left-200">
          <ul className="pt-2 grid gap-y-3">
            <li>Dex Pool</li>
            <li>Price</li>
          </ul>
        </NavigationMenu.Content>
      </NavigationMenu.Item>

      <NavigationMenu.Item className="relative pr-10 pt-4">
        <NavigationMenu.Link className="flex font-bold text-base">
          About Us
        </NavigationMenu.Link>
      </NavigationMenu.Item>
    </div>
  )


  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="hidden items-center space-x-2 md:flex">
        <Image src={logo} width={130} alt={""} />
      </Link>
      <NavigationMenu.Root className=" flex justify-center ">
        <NavigationMenu.List className="flex justify-center">
          {menuItem}
        </NavigationMenu.List>
      </NavigationMenu.Root>

    </div>
  )
}
