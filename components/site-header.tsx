'use client';
import Link from "next/link"
import React from "react";
import { useState, useContext, createContext, useEffect } from "react"
import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { MainNav } from "@/components/main-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { loginIronman, logoutIronman } from "@/lib/ironman";
import { Button } from "@/components/ui/button"
import { chainConfig } from "@/config/chain"
import { AppProvider } from "@/components/login-account-provider"
import { useToast } from "@/components/ui/use-toast"
import { isMobile } from "@/lib/utils";
import dmc from "../public/dmc.png"
import wallet from "../public/wallet.png"
import Image from 'next/image';
import logined from "../public/logined.png"

export function SiteHeader() {
  const { toast } = useToast()
  const [account, setAccount] = useState('')
  useEffect(() => {
    if (sessionStorage.getItem('account')) {
      setAccount(sessionStorage.getItem('account') || '')
    }
  }, [])
  const handleLoginIronman = () => {
    loginIronman(
      (data) => {
        if (data?.identity?.accounts[0]?.name) {
          setAccount(data?.identity?.accounts[0]?.name)
          sessionStorage.setItem('account', data?.identity?.accounts[0]?.name)
          if (window.location.pathname === '/resources' || window.location.pathname === '/tools') {
            setTimeout(() => {
              window.location.reload()
            }, 300);
          }
        } else {
          // login failed
        }
      },
      () => {
        // login failed
        toast({
          variant: 'destructive',
          title: "Uh oh! Something went wrong",
          description: "Please confirm whether the wallet plugin is installed",
        })
      },
      chainConfig
    );
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <AppProvider value={account}>
          <MainNav />
          <div className="flex flex-1 items-center justify-end space-x-4">
          <Image src={dmc} width={100} alt={""} />

            <nav className="flex items-center space-x-1">
              {/* <Link
                href={siteConfig.links.github}
                target="_blank"
                rel="noreferrer"
              >
                <div
                  className={buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })}
                >
                  <Icons.gitHub className="h-5 w-5" />
                  <span className="sr-only">GitHub</span>
                </div>
              </Link> */}
              <ThemeToggle />
              {account ? (
                <div className="flex items-center justify-start space-x-2 h-8 w-44 bg-[#f7b34e] rounded-full text-base pl-3 pr-3 text-black">
                  <div className="flex items-center justify-center bg-white rounded-full h-6 w-6"><Image src={logined} width={14} alt={""} /></div>
                  <span>{account}</span>
                </div>
              ) : 
              <div onClick={() => handleLoginIronman()} className="flex items-center justify-center space-x-2 h-8 w-44 bg-[#2e2e2e] rounded-full text-base">
                <Image src={wallet} width={22} alt={""} />
                <span>Connect Wallet</span>
              </div>}

              
            </nav>
          </div>
        </AppProvider>
      </div>
    </header >
  )
}
