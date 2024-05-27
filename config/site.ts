export type SiteConfig = typeof siteConfig

export const siteConfig = {

  name: "DMC DAO",
  description:
    "Explore the decentralized world of DMC with our block explorer. Discover the latest transactions recorded on the DMC blockchain, view wallet balances, and track the history of block confirmations. Get real-time insights into the network's health and performance",
  mainNav: [
    {
      title: "DMC Info",
      href: "/",
      menus: [
        {
          title: "Fortune List",
          href: "fortuneList"
        },
        {
          title: "Release Speed",
          href: "releaseSpeed"
        },
        {
          title: "Monitoring",
          href: "monitoring"
        },
        {
          title: "PST Staking Price",
          href: "pstStakingPrice"
        },
        {
          title: "Staking RSI bonus",
          href: "bonus"
        },
        {
          title: "RSI/DMC Price",
          href: "price"
        },
      ]
    },
    {
      title: "Market Data",
      menus: [
        {
          title: "Dex Pool",
          href: "mdPool"
        },
        {
          title: "Price",
          href: "mdPrice"
        }
      ]
    },
    {
      title: "About Us",
      href: "/nodes",
    },
  ],
  links: {
    twitter: "https://twitter.com/shadcn",
    github: "https://github.com/datamallchain",
    docs: "https://ui.shadcn.com",
  },
}
