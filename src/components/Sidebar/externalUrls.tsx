import { Trans } from "@lingui/macro";
import { ReactElement } from "react";

export interface ExternalUrl {
  title: ReactElement;
  url: string;
  icon: string;
}

const externalUrls: ExternalUrl[] = [
  {
    title: <Trans>Forum</Trans>,
    url: "https://forum.r.rip.finance/",
    icon: "forum",
  },
  {
    title: <Trans>Governance</Trans>,
    url: "https://vote.r.rip.finance/",
    icon: "governance",
  },
  {
    title: <Trans>Docs</Trans>,
    url: "https://docs.r.rip.finance/",
    icon: "docs",
  },
  {
    title: <Trans>Bug Bounty</Trans>,
    url: "https://immunefi.com/bounty/rip/",
    icon: "bug-report",
  },
];

export default externalUrls;
