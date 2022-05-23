import { Paper } from "@olympusdao/component-library";
import { ChainId } from "@pancakeswap/sdk";
import { Flex, Image, Link, Radio, RowType, Text, useMatchBreakpoints } from "@pancakeswap/uikit";
import BigNumber from "bignumber.js";
import orderBy from "lodash/orderBy";
import { createContext, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import FlexLayout from "src/components/Layout/Flex";
import Loading from "src/components/Loading";
// import { NextLinkFromReactRouter } from "src/components/NextLink";
// import PageHeader from "src/components/PageHeader";
import SearchInput from "src/components/SearchInput";
import Select, { OptionProps } from "src/components/Select/Select";
// import ToggleView from "src/components/ToggleView/ToggleView";
import { useTranslation } from "src/contexts/Localization";
// import { useWeb3React } from '@web3-react/core'
import { useWeb3Context } from "src/hooks";
import useIntersectionObserver from "src/hooks/useIntersectionObserver";
import { useFarms, usePollFarmsWithUserData, usePriceCakeBusd } from "src/slices/farms/hooks";
import { DeserializedFarm } from "src/slices/types";
import { ViewMode } from "src/slices/user/actions";
import { useUserFarmStakedOnly, useUserFarmsViewMode } from "src/slices/user/hooks";
import { getFarmApr } from "src/utils/apr";
import { getBalanceNumber } from "src/utils/formatBalance";
import { latinise } from "src/utils/latinise";
import styled from "styled-components";

import FarmTabButtons from "./components/FarmTabButtons";
import Table from "./components/FarmTable/FarmTable";
import { RowProps } from "./components/FarmTable/Row";
import { DesktopColumnSchema, FarmWithStakedValue } from "./components/types";

const ControlContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  position: relative;

  // justify-content: space-between;
  flex-direction: column;
  margin-bottom: 32px;
  gap: 2rem;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    flex-wrap: wrap;
    padding: 16px 0px;
    margin-bottom: 0;
  }
`;

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;

  ${Text} {
    margin-left: 8px;
  }
`;

const LabelWrapper = styled.div`
  > ${Text} {
    font-size: 12px;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 8px 0px;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: auto;
    padding: 0;
  }
`;

const ViewControls = styled.div`
  flex-wrap: wrap;
  justify-content: space-between;
  display: flex;
  align-items: center;
  width: 100%;

  > div {
    padding: 8px 0px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    justify-content: flex-start;
    width: auto;

    > div {
      padding: 0;
    }
  }
`;

const StyledImage = styled(Image)`
  margin-left: auto;
  margin-right: auto;
  margin-top: 58px;
`;

const FinishedTextContainer = styled(Flex)`
  padding-bottom: 32px;
  flex-direction: column;
  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
  }
`;

const FinishedTextLink = styled(Link)`
  font-weight: 400;
  white-space: nowrap;
  text-decoration: underline;
`;

const NUMBER_OF_FARMS_VISIBLE = 12;

export const getDisplayApr = (cakeRewardsApr?: number, lpRewardsApr?: number) => {
  if (cakeRewardsApr && lpRewardsApr) {
    return (cakeRewardsApr + lpRewardsApr).toLocaleString("en-US", { maximumFractionDigits: 2 });
  }
  if (cakeRewardsApr) {
    return cakeRewardsApr.toLocaleString("en-US", { maximumFractionDigits: 2 });
  }
  return null;
};

const Farms: React.FC = ({ children }) => {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const { data: farmsLP, userDataLoaded, poolLength, regularCakePerBlock } = useFarms();
  const cakePrice = usePriceCakeBusd();
  const [query, setQuery] = useState("");
  const [viewMode, setViewMode] = useUserFarmsViewMode();
  const { address: account } = useWeb3Context();
  const [sortOption, setSortOption] = useState("hot");
  const { observerRef, isIntersecting } = useIntersectionObserver();
  const chosenFarmsLength = useRef(0);

  const isArchived = pathname.includes("archived");
  const isInactive = pathname.includes("history");
  const isActive = !isInactive && !isArchived;

  const [radio, setRadio] = useState("hot");

  const handleChange = (evt: any) => {
    const { value } = evt.target;
    setRadio(value);
    setSortOption(value);
  };

  usePollFarmsWithUserData();

  // Users with no wallet connected should see 0 as Earned amount
  // Connected users should see loading indicator until first userData has loaded
  const userDataReady = !account || (!!account && userDataLoaded);

  const [stakedOnly, setStakedOnly] = useUserFarmStakedOnly(isActive || true);

  const activeFarms = farmsLP.filter(
    farm => farm.pid !== 0 && farm.multiplier !== "0X" && (!poolLength || poolLength > farm.pid),
  );
  const inactiveFarms = farmsLP.filter(farm => farm.pid !== 0 && farm.multiplier === "0X");
  const archivedFarms = farmsLP;

  const stakedOnlyFarms = activeFarms.filter(
    farm => farm.userData && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0),
  );

  const stakedInactiveFarms = inactiveFarms.filter(
    farm => farm.userData && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0),
  );

  const stakedArchivedFarms = archivedFarms.filter(
    farm => farm.userData && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0),
  );

  const farmsList = useCallback(
    (farmsToDisplay: DeserializedFarm[]): FarmWithStakedValue[] => {
      let farmsToDisplayWithAPR: FarmWithStakedValue[] = farmsToDisplay.map(farm => {
        if (!farm.lpTotalInQuoteToken || !farm.quoteTokenPriceBusd) {
          return farm;
        }
        const totalLiquidity = new BigNumber(farm.lpTotalInQuoteToken).times(farm.quoteTokenPriceBusd);
        const { cakeRewardsApr, lpRewardsApr } = isActive
          ? getFarmApr(
              new BigNumber(farm.poolWeight as BigNumber),
              cakePrice,
              totalLiquidity,
              farm.lpAddresses[ChainId.MAINNET],
              regularCakePerBlock as number,
            )
          : { cakeRewardsApr: 0, lpRewardsApr: 0 };

        return { ...farm, apr: cakeRewardsApr, lpRewardsApr, liquidity: totalLiquidity };
      });

      if (query) {
        const lowercaseQuery = latinise(query.toLowerCase());
        farmsToDisplayWithAPR = farmsToDisplayWithAPR.filter((farm: FarmWithStakedValue) => {
          return latinise(farm.lpSymbol.toLowerCase()).includes(lowercaseQuery);
        });
      }
      return farmsToDisplayWithAPR;
    },
    [cakePrice, query, isActive, regularCakePerBlock],
  );

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const [numberOfFarmsVisible, setNumberOfFarmsVisible] = useState(NUMBER_OF_FARMS_VISIBLE);

  const chosenFarmsMemoized = useMemo(() => {
    let chosenFarms: any[] = [];

    const sortFarms = (farms: FarmWithStakedValue[]): FarmWithStakedValue[] => {
      switch (sortOption) {
        case "apr":
          //@ts-ignore
          return orderBy(farms, (farm: FarmWithStakedValue) => farm?.apr + farm?.lpRewardsApr, "desc");
        case "multiplier":
          return orderBy(
            farms,
            (farm: FarmWithStakedValue) => (farm.multiplier ? Number(farm.multiplier.slice(0, -1)) : 0),
            "desc",
          );
        case "earned":
          return orderBy(
            farms,
            (farm: FarmWithStakedValue) => (farm.userData ? Number(farm.userData.earnings) : 0),
            "desc",
          );
        case "liquidity":
          return orderBy(farms, (farm: FarmWithStakedValue) => Number(farm.liquidity), "desc");
        case "latest":
          return orderBy(farms, (farm: FarmWithStakedValue) => Number(farm.pid), "desc");
        default:
          return farms;
      }
    };

    if (isActive) {
      chosenFarms = stakedOnly ? farmsList(stakedOnlyFarms) : farmsList(activeFarms);
    }
    if (isInactive) {
      chosenFarms = stakedOnly ? farmsList(stakedInactiveFarms) : farmsList(inactiveFarms);
    }
    if (isArchived) {
      chosenFarms = stakedOnly ? farmsList(stakedArchivedFarms) : farmsList(archivedFarms);
    }

    return sortFarms(chosenFarms).slice(0, numberOfFarmsVisible);
  }, [
    sortOption,
    activeFarms,
    farmsList,
    inactiveFarms,
    archivedFarms,
    isActive,
    isInactive,
    isArchived,
    stakedArchivedFarms,
    stakedInactiveFarms,
    stakedOnly,
    stakedOnlyFarms,
    numberOfFarmsVisible,
  ]);

  chosenFarmsLength.current = chosenFarmsMemoized.length;

  useEffect(() => {
    if (isIntersecting) {
      setNumberOfFarmsVisible(farmsCurrentlyVisible => {
        if (farmsCurrentlyVisible <= chosenFarmsLength.current) {
          return farmsCurrentlyVisible + NUMBER_OF_FARMS_VISIBLE;
        }
        return farmsCurrentlyVisible;
      });
    }
  }, [isIntersecting]);

  const rowData = chosenFarmsMemoized.map(farm => {
    const { token, quoteToken } = farm;
    const tokenAddress = token.address;
    const quoteTokenAddress = quoteToken.address;
    const lpLabel = farm.lpSymbol && farm.lpSymbol.split(" ")[0].toUpperCase().replace("PANCAKE", "");

    const row: RowProps = {
      apr: {
        value: getDisplayApr(farm.apr, farm.lpRewardsApr) as string,
        pid: farm.pid,
        multiplier: farm.multiplier as string,
        lpLabel,
        lpSymbol: farm.lpSymbol,
        tokenAddress,
        quoteTokenAddress,
        cakePrice,
        originalValue: farm.apr as number,
      },
      farm: {
        label: lpLabel,
        pid: farm.pid,
        token: farm.token,
        quoteToken: farm.quoteToken,
      },
      earned: {
        earnings: getBalanceNumber(new BigNumber(farm?.userData?.earnings as BigNumber)),
        pid: farm.pid,
      },
      liquidity: {
        liquidity: farm.liquidity as BigNumber,
      },
      multiplier: {
        multiplier: farm.multiplier as string,
      },
      details: farm,
    };

    return row;
  });

  const renderContent = (): JSX.Element => {
    if (viewMode === ViewMode.TABLE && rowData.length) {
      const columnSchema = DesktopColumnSchema;

      const columns = columnSchema.map(column => ({
        id: column.id,
        name: column.name,
        label: column.label,
        sort: (a: RowType<RowProps>, b: RowType<RowProps>) => {
          switch (column.name) {
            case "farm":
              return b.id - a.id;
            case "apr":
              if (a.original.apr.value && b.original.apr.value) {
                return Number(a.original.apr.value) - Number(b.original.apr.value);
              }

              return 0;
            case "earned":
              return a.original.earned.earnings - b.original.earned.earnings;
            default:
              return 1;
          }
        },
        sortable: column.sortable,
      }));

      return <Table data={rowData} columns={columns} userDataReady={userDataReady} />;
    }

    return (
      <FlexLayout>
        {children}
        <div ref={observerRef} />
      </FlexLayout>
    );
  };

  const { isMobile } = useMatchBreakpoints();

  const handleSortOptionChange = (option: OptionProps): void => {
    setSortOption(option.value);
  };

  return (
    <FarmsContext.Provider value={{ chosenFarmsMemoized }}>
      {/* <NextLinkFromReactRouter to="/farms/auction" id="lottery-pot-banner">
        <Button p="0" variant="text">
          <Text color="primary" bold fontSize="16px" mr="4px">
            {t("Community Auctions")}
          </Text>
          <ArrowForwardIcon color="primary" />
        </Button>
      </NextLinkFromReactRouter> */}
      <div className="content-container">
        <Paper className="blur7" style={{ maxWidth: "100%" }}>
          <Flex flexDirection={"column"} width="100%" justifyContent="center" position="relative" pt="2rem">
            <ControlContainer>
              <ViewControls>
                {/* <ToggleWrapper>
                  <Toggle
                    id="staked-only-farms"
                    checked={stakedOnly}
                    onChange={() => setStakedOnly(!stakedOnly)}
                    scale="sm"
                  />
                  <Text> {t("Staked only")}</Text>
                </ToggleWrapper> */}
                <FarmTabButtons hasStakeInFinishedFarms={stakedInactiveFarms.length > 0} />
              </ViewControls>
              <FilterContainer>
                {isMobile && (
                  <Select
                    options={[
                      {
                        label: t("Hot"),
                        value: "hot",
                      },
                      {
                        label: t("APR"),
                        value: "apr",
                      },
                      {
                        label: t("Multiplier"),
                        value: "multiplier",
                      },
                      {
                        label: t("Earned"),
                        value: "earned",
                      },
                      {
                        label: t("Liquidity"),
                        value: "liquidity",
                      },
                      {
                        label: t("Latest"),
                        value: "latest",
                      },
                    ]}
                    onOptionChange={handleSortOptionChange}
                  />
                )}
                <LabelWrapper
                  color="black"
                  style={{ marginLeft: 24, width: "30vw", backgroundColor: "#00FCB0", borderRadius: "40px" }}
                >
                  {/* <Text textTransform="uppercase">{t("Search")}</Text> */}
                  <SearchInput onChange={handleChangeQuery} placeholder="search..." />
                </LabelWrapper>
              </FilterContainer>
            </ControlContainer>
            <Flex>
              <Flex flexDirection="column" style={{ gap: "1rem" }}>
                {!isMobile &&
                  ["hot", "apr", "multiplier", "earned", "liquidity", "latest"].map((el: string, index: number) => (
                    <Flex key={index} flexDirection="row" alignItems="center" style={{ gap: "1rem" }}>
                      <Radio
                        className="styled-radio"
                        scale="sm"
                        name="sm"
                        value={el}
                        onChange={handleChange}
                        checked={radio === el}
                      />
                      <Text color="#445FA7">{el}</Text>
                    </Flex>
                  ))}
              </Flex>
              <div>
                {isInactive && (
                  <FinishedTextContainer>
                    <Text fontSize="16px" color="failure" pr="4px">
                      {t("Don't see the farm you are staking?")}
                    </Text>
                    <Flex>
                      <FinishedTextLink href="/migration" fontSize={"16px"} color="failure">
                        {t("Go to migration page")}
                      </FinishedTextLink>
                      <Text fontSize="16px" color="failure" padding="0px 4px">
                        or
                      </Text>
                      <FinishedTextLink
                        external
                        color="failure"
                        fontSize="16px"
                        href="https://v1-farms.pancakeswap.finance/farms/history"
                      >
                        {t("check out v1 farms")}.
                      </FinishedTextLink>
                    </Flex>
                  </FinishedTextContainer>
                )}
                {renderContent()}
                {account && !userDataLoaded && stakedOnly && (
                  <Flex justifyContent="center">
                    <Loading />
                  </Flex>
                )}
              </div>
            </Flex>
          </Flex>
        </Paper>
      </div>
    </FarmsContext.Provider>
  );
};

export const FarmsContext = createContext({ chosenFarmsMemoized: [] as FarmWithStakedValue[] });

export default Farms;
