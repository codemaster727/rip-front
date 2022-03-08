import React from "react";
import { useAppSelector } from "src/hooks";

export const formatCurrency = (c: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(c);
};

export function useMigrationData() {
  const [view, setView] = React.useState(0);
  const changeView: any = (_event: React.ChangeEvent<any>, newView: number) => {
    setView(newView);
  };

  // const indexV1 = useAppSelector(state => Number(state.app.currentIndexV1!));
  const currentIndex = useAppSelector(state => Number(state.app.currentIndex));

  const currentRipBalance = useAppSelector(state => state.account.balances.ripV1);
  const currentSRipBalance = useAppSelector(state => state.account.balances.sripV1);
  const currentWSRipBalance = useAppSelector(state => state.account.balances.wsrip);
  const wsRipPrice = useAppSelector(state => state.app.marketPrice! * Number(state.app.currentIndex!));
  const gRIPPrice = wsRipPrice;

  const approvedRipBalance = useAppSelector(state => Number(state.account.migration.rip));
  const approvedSRipBalance = useAppSelector(state => Number(state.account.migration.srip));
  const approvedWSRipBalance = useAppSelector(state => Number(state.account.migration.wsrip));
  const ripFullApproval = approvedRipBalance >= +currentRipBalance;
  const sRipFullApproval = approvedSRipBalance >= +currentSRipBalance;
  const wsRipFullApproval = approvedWSRipBalance >= +currentWSRipBalance;

  // const ripAsgRIP = +currentRipBalance / indexV1;
  // const sRIPAsgRIP = +currentSRipBalance / indexV1;

  // const ripInUSD = formatCurrency(gRIPPrice! * ripAsgRIP);
  // const sRipInUSD = formatCurrency(gRIPPrice! * sRIPAsgRIP);
  const wsRipInUSD = formatCurrency(wsRipPrice * +currentWSRipBalance);

  const isGRIP = view === 1;
  const targetAsset = React.useMemo(() => (isGRIP ? "gRIP" : "sRIP (v2)"), [view]);
  const targetMultiplier = React.useMemo(() => (isGRIP ? 1 : currentIndex), [currentIndex, view]);

  const isAllApproved = ripFullApproval && sRipFullApproval && wsRipFullApproval;

  const oldAssetsDetected = useAppSelector(state => {
    return (
      state.account.balances &&
      (Number(state.account.balances.sripV1) ||
      Number(state.account.balances.ripV1) ||
      Number(state.account.balances.wsrip)
        ? true
        : false)
    );
  });

  const pendingTransactions = useAppSelector(state => {
    return state.pendingTransactions;
  });

  return {
    view,
    setView,
    changeView,
    // indexV1,
    currentIndex,
    currentRipBalance,
    currentSRipBalance,
    currentWSRipBalance,
    wsRipPrice,
    gRIPPrice,
    approvedRipBalance,
    approvedSRipBalance,
    approvedWSRipBalance,
    ripFullApproval,
    sRipFullApproval,
    wsRipFullApproval,
    // ripAsgRIP,
    // sRIPAsgRIP,
    // ripInUSD,
    // sRipInUSD,
    wsRipInUSD,
    isGRIP,
    targetAsset,
    targetMultiplier,
    oldAssetsDetected,
    pendingTransactions,
    isAllApproved,
  };
}
