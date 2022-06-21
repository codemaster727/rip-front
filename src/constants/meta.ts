import { ContextApi } from "../contexts/Localization/types";
import { PageMeta } from "./types";

export const DEFAULT_META: PageMeta = {
  title: "rip dao",
  description:
    "The most popular AMM on BSC by user count! Earn R.rip through yield farming or win it in the Lottery, then stake it in Syrup Pools to earn more tokens! Initial Farm Offerings (new token launch model pioneered by RipSwap), NFTs, and more, on a platform you can trust.",
  image: "https://R.rip/logo192.png",
};

export const getCustomMeta = (path: string, t: ContextApi["t"]): PageMeta => {
  let basePath;
  if (path.startsWith("/swap")) {
    basePath = "/swap";
  } else if (path.startsWith("/add")) {
    basePath = "/add";
  } else if (path.startsWith("/remove")) {
    basePath = "/remove";
  } else if (path.startsWith("/teams")) {
    basePath = "/teams";
  } else if (path.startsWith("/voting/proposal") && path !== "/voting/proposal/create") {
    basePath = "/voting/proposal";
  } else if (path.startsWith("/nfts/collections")) {
    basePath = "/nfts/collections";
  } else if (path.startsWith("/nfts/profile")) {
    basePath = "/nfts/profile";
  } else if (path.startsWith("/pancake-squad")) {
    basePath = "/pancake-squad";
  } else {
    basePath = path;
  }

  switch (basePath) {
    case "/":
      return {
        title: `${t("Home")} | ${t("RipSwap")}`,
      };
    case "/swap":
      return {
        title: `${t("Exchange")} | ${t("RipSwap")}`,
      };
    case "/add":
      return {
        title: `${t("Add Liquidity")} | ${t("RipSwap")}`,
      };
    case "/remove":
      return {
        title: `${t("Remove Liquidity")} | ${t("RipSwap")}`,
      };
    case "/liquidity":
      return {
        title: `${t("Liquidity")} | ${t("RipSwap")}`,
      };
    case "/find":
      return {
        title: `${t("Import Pool")} | ${t("RipSwap")}`,
      };
    case "/competition":
      return {
        title: `${t("Trading Battle")} | ${t("RipSwap")}`,
      };
    case "/prediction":
      return {
        title: `${t("Prediction")} | ${t("RipSwap")}`,
      };
    case "/prediction/leaderboard":
      return {
        title: `${t("Leaderboard")} | ${t("RipSwap")}`,
      };
    case "/farms":
      return {
        title: `${t("Farms")} | ${t("RipSwap")}`,
      };
    case "/farms/auction":
      return {
        title: `${t("Farm Auctions")} | ${t("RipSwap")}`,
      };
    case "/pools":
      return {
        title: `${t("Pools")} | ${t("RipSwap")}`,
      };
    case "/lottery":
      return {
        title: `${t("Lottery")} | ${t("RipSwap")}`,
      };
    case "/ifo":
      return {
        title: `${t("Initial Farm Offering")} | ${t("RipSwap")}`,
      };
    case "/teams":
      return {
        title: `${t("Leaderboard")} | ${t("RipSwap")}`,
      };
    case "/voting":
      return {
        title: `${t("Voting")} | ${t("RipSwap")}`,
      };
    case "/voting/proposal":
      return {
        title: `${t("Proposals")} | ${t("RipSwap")}`,
      };
    case "/voting/proposal/create":
      return {
        title: `${t("Make a Proposal")} | ${t("RipSwap")}`,
      };
    case "/info":
      return {
        title: `${t("Overview")} | ${t("RipSwap Info & Analytics")}`,
        description: "View statistics for Ripswap exchanges.",
      };
    case "/info/pools":
      return {
        title: `${t("Pools")} | ${t("RipSwap Info & Analytics")}`,
        description: "View statistics for Ripswap exchanges.",
      };
    case "/info/tokens":
      return {
        title: `${t("Tokens")} | ${t("RipSwap Info & Analytics")}`,
        description: "View statistics for Ripswap exchanges.",
      };
    case "/nfts":
      return {
        title: `${t("Overview")} | ${t("RipSwap")}`,
      };
    case "/nfts/collections":
      return {
        title: `${t("Collections")} | ${t("RipSwap")}`,
      };
    case "/nfts/activity":
      return {
        title: `${t("Activity")} | ${t("RipSwap")}`,
      };
    case "/nfts/profile":
      return {
        title: `${t("Profile")} | ${t("RipSwap")}`,
      };
    case "/pancake-squad":
      return {
        title: `${t("Rip Squad")} | ${t("RipSwap")}`,
      };
    default:
      return {
        title: "none",
      };
  }
};
