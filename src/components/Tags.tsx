import {
  AutoRenewIcon,
  RefreshIcon,
  Tag,
  TagProps,
  Text,
  TimerIcon,
  TooltipText,
  useTooltip,
  VerifiedIcon,
  VoteIcon,
} from "@pancakeswap/uikit";
import { memo } from "react";
import ClosedIcon from "src/assets/icons/closed-icon.svg";
import CommunityIcon from "src/assets/icons/community.svg";
import { useTranslation } from "src/contexts/Localization";

const CoreTag: React.FC<TagProps> = props => {
  const { t } = useTranslation();
  return <VerifiedIcon width="18px" color="secondary" />;
};

const FarmAuctionTagToolTipContent = memo(() => {
  const { t } = useTranslation();
  return <Text color="text">{t("Farm Auction Winner, add liquidity at your own risk.")}</Text>;
});

const FarmAuctionTag: React.FC<TagProps> = props => {
  const { t } = useTranslation();
  const { targetRef, tooltip, tooltipVisible } = useTooltip(<FarmAuctionTagToolTipContent />, { placement: "right" });
  return (
    <>
      {tooltipVisible && tooltip}
      <TooltipText ref={targetRef} style={{ textDecoration: "none" }}>
        <Tag variant="failure" outline {...props}>
          <img width="18px" color="failure" src={CommunityIcon} />
          {t("Farm Auction")}
        </Tag>
      </TooltipText>
    </>
  );
};

const CommunityTag: React.FC<TagProps> = props => {
  const { t } = useTranslation();
  return <img width="18px" color="failure" src={CommunityIcon} />;
};

const DualTag: React.FC<TagProps> = props => {
  const { t } = useTranslation();
  return (
    <Tag variant="textSubtle" outline {...props}>
      {t("Dual")}
    </Tag>
  );
};

const ManualPoolTag: React.FC<TagProps> = props => {
  const { t } = useTranslation();
  return (
    <Tag variant="secondary" outline startIcon={<RefreshIcon width="18px" color="secondary" mr="4px" />} {...props}>
      {t("Manual")}
    </Tag>
  );
};

const CompoundingPoolTag: React.FC<TagProps> = props => {
  const { t } = useTranslation();
  return (
    <Tag variant="success" outline startIcon={<AutoRenewIcon width="18px" color="success" mr="4px" />} {...props}>
      {t("Auto")}
    </Tag>
  );
};

const VoteNowTag: React.FC<TagProps> = props => {
  const { t } = useTranslation();
  return (
    <Tag variant="success" startIcon={<VoteIcon width="18px" color="success" mr="4px" />} {...props}>
      {t("Vote Now")}
    </Tag>
  );
};

const SoonTag: React.FC<TagProps> = props => {
  const { t } = useTranslation();
  return (
    <Tag variant="binance" startIcon={<TimerIcon width="18px" color="success" mr="4px" />} {...props}>
      {t("Soon")}
    </Tag>
  );
};

const ClosedTag: React.FC<TagProps> = props => {
  const { t } = useTranslation();
  return (
    // <Tag {...props}>
    <img src={ClosedIcon} width={18} style={{ marginRight: "0.5rem" }} />
    // </Tag>
  );
};

export {
  CoreTag,
  FarmAuctionTag,
  DualTag,
  ManualPoolTag,
  CompoundingPoolTag,
  VoteNowTag,
  SoonTag,
  ClosedTag,
  CommunityTag,
};
