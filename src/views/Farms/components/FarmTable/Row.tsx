import { useMatchBreakpoints } from "@pancakeswap/uikit";
import { createElement, useEffect, useState } from "react";
import { useTranslation } from "src/contexts/Localization";
import useDelayedUnmount from "src/hooks/useDelayedUnmount";
import { useFarmUser } from "src/slices/farms/hooks";
import styled from "styled-components";

import { DesktopColumnSchema, FarmWithStakedValue, MobileColumnSchema } from "../types";
import ActionPanel from "./Actions/ActionPanel";
import Apr, { AprProps } from "./Apr";
import CellLayout from "./CellLayout";
import Details from "./Details";
import Earned, { EarnedProps } from "./Earned";
import Farm, { FarmProps } from "./Farm";
import Liquidity, { LiquidityProps } from "./Liquidity";
import Multiplier, { MultiplierProps } from "./Multiplier";

export interface RowProps {
  apr: AprProps;
  farm: FarmProps;
  earned: EarnedProps;
  multiplier: MultiplierProps;
  liquidity: LiquidityProps;
  details: FarmWithStakedValue;
}

interface RowPropsWithLoading extends RowProps {
  userDataReady: boolean;
}

const cells = {
  apr: Apr,
  farm: Farm,
  earned: Earned,
  details: Details,
  multiplier: Multiplier,
  liquidity: Liquidity,
};

const CellInner = styled.div`
  padding: 24px 0px;
  display: flex;
  width: 100%;
  align-items: center;
  padding-right: 8px;

  ${({ theme }) => theme.mediaQueries.xl} {
    padding-right: 32px;
  }
`;

const StyledTr = styled.tr`
  cursor: pointer;
  border-bottom: 2px solid ${({ theme }) => theme.colors.disabled};
`;

const EarnedMobileCell = styled.td`
  padding: 16px 0 24px 16px;
`;

const AprMobileCell = styled.td`
  padding-top: 16px;
  padding-bottom: 24px;
`;

const FarmMobileCell = styled.td`
  padding-top: 24px;
`;

const Row: React.FunctionComponent<RowPropsWithLoading> = props => {
  const { details, userDataReady } = props;
  const hasStakedAmount = !!useFarmUser(details.pid).stakedBalance.toNumber();
  const [actionPanelExpanded, setActionPanelExpanded] = useState(hasStakedAmount);
  const shouldRenderChild = useDelayedUnmount(actionPanelExpanded, 300);
  const { t } = useTranslation();

  const toggleActionPanel = () => {
    setActionPanelExpanded(!actionPanelExpanded);
  };

  useEffect(() => {
    setActionPanelExpanded(hasStakedAmount);
  }, [hasStakedAmount]);

  const { isDesktop, isMobile } = useMatchBreakpoints();

  const isSmallerScreen = !isDesktop;
  const tableSchema = isSmallerScreen ? MobileColumnSchema : DesktopColumnSchema;
  const columnNames = tableSchema.map(column => column.name);

  const handleRenderRow = () => {
    if (!isMobile) {
      return (
        <StyledTr onClick={toggleActionPanel}>
          {Object.keys(props).map(key => {
            const columnIndex = columnNames.indexOf(key);
            if (columnIndex === -1) {
              return null;
            }

            switch (key) {
              case "details":
                return (
                  <td key={key}>
                    <CellInner>
                      <CellLayout>
                        <Details actionPanelToggled={actionPanelExpanded} />
                      </CellLayout>
                    </CellInner>
                  </td>
                );
              case "apr":
                return (
                  <td key={key}>
                    <CellInner>
                      <CellLayout label={t("APR")}>
                        <Apr {...props.apr} hideButton={isSmallerScreen} />
                      </CellLayout>
                    </CellInner>
                  </td>
                );
              default:
                return (
                  <td key={key}>
                    <CellInner>
                      <CellLayout label={t(tableSchema[columnIndex].label)}>
                        {
                          //@ts-ignore
                          createElement(cells[key], { ...props[key], userDataReady })
                        }
                      </CellLayout>
                    </CellInner>
                  </td>
                );
            }
          })}
        </StyledTr>
      );
    }

    return (
      <StyledTr onClick={toggleActionPanel}>
        <td>
          <tr>
            <FarmMobileCell>
              <CellLayout>
                <Farm {...props.farm} />
              </CellLayout>
            </FarmMobileCell>
          </tr>
          <tr>
            <EarnedMobileCell>
              <CellLayout label={t("Earned")}>
                <Earned {...props.earned} userDataReady={userDataReady} />
              </CellLayout>
            </EarnedMobileCell>
            <AprMobileCell>
              <CellLayout label={t("APR")}>
                <Apr {...props.apr} hideButton />
              </CellLayout>
            </AprMobileCell>
          </tr>
        </td>
        <td>
          <CellInner>
            <CellLayout>
              <Details actionPanelToggled={actionPanelExpanded} />
            </CellLayout>
          </CellInner>
        </td>
      </StyledTr>
    );
  };

  return (
    <>
      {handleRenderRow()}
      {shouldRenderChild && (
        <tr>
          <td colSpan={6}>
            <ActionPanel {...props} expanded={actionPanelExpanded} />
          </td>
        </tr>
      )}
    </>
  );
};

export default Row;
