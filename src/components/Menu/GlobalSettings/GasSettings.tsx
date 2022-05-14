import { ButtonMenuItem, Flex, Text } from "@pancakeswap/uikit";
import { StyledButtonMenu } from "src/components/SearchModal/Manage";

import QuestionHelper from "../../../components/QuestionHelper";
import { useTranslation } from "../../../contexts/Localization";
import { /*GAS_PRICE,*/ GAS_PRICE_GWEI } from "../../../slices/types";
import { useGasPriceManager } from "../../../slices/user/hooks";
const GasSettings = () => {
  const { t } = useTranslation();
  const [gasPrice, setGasPrice] = useGasPriceManager();

  return (
    <Flex flexDirection="column">
      <Flex mb="12px" alignItems="center">
        <Text color="white">{t("Default Transaction Speed (GWEI)")}</Text>
        <QuestionHelper
          text={t(
            "Adjusts the gas price (transaction fee) for your transaction. Higher GWEI = higher speed = higher fees",
          )}
          placement="top-start"
          ml="4px"
        />
      </Flex>
      <Flex justifyContent={"space-between"}>
        {/* <Button
          style={{ fontSize: ".8rem" }}
          mt="4px"
          mr="4px"
          scale="sm"
          onClick={() => {
            setGasPrice(GAS_PRICE_GWEI.default);
          }}
          variant={gasPrice === GAS_PRICE_GWEI.default ? "primary" : "tertiary"}
        >
          {t("Standard (%gasPrice%)", { gasPrice: GAS_PRICE.default })}
        </Button>
        <Button
          style={{ fontSize: ".8rem" }}
          mt="4px"
          mr="4px"
          scale="sm"
          onClick={() => {
            setGasPrice(GAS_PRICE_GWEI.fast);
          }}
          variant={gasPrice === GAS_PRICE_GWEI.fast ? "primary" : "tertiary"}
        >
          {t("Fast (%gasPrice%)", { gasPrice: GAS_PRICE.fast })}
        </Button>
        <Button
          style={{ fontSize: ".8rem" }}
          mr="4px"
          mt="4px"
          scale="sm"
          onClick={() => {
            setGasPrice(GAS_PRICE_GWEI.instant);
          }}
          variant={gasPrice === GAS_PRICE_GWEI.instant ? "primary" : "tertiary"}
        >
          {t("Instant (%gasPrice%)", { gasPrice: GAS_PRICE.instant })}
        </Button> */}
        <StyledButtonMenu
          activeIndex={gasPrice === GAS_PRICE_GWEI.default ? 0 : gasPrice === GAS_PRICE_GWEI.fast ? 1 : 2}
          onItemClick={index =>
            setGasPrice(
              index === 0 ? GAS_PRICE_GWEI.default : index === 1 ? GAS_PRICE_GWEI.fast : GAS_PRICE_GWEI.instant,
            )
          }
          scale="sm"
          variant="subtle"
        >
          <ButtonMenuItem
            style={{
              backgroundColor: gasPrice === GAS_PRICE_GWEI.default ? "#00FCB0" : "transparent",
              color: gasPrice === GAS_PRICE_GWEI.default ? "black" : "#09FDB5",
            }}
            width="33.3%"
          >
            {/* {t("standard (%gasPrice%)", { gasPrice: GAS_PRICE.default })} */}
            {t("standard")}
          </ButtonMenuItem>
          <ButtonMenuItem
            style={{
              backgroundColor: gasPrice === GAS_PRICE_GWEI.fast ? "#00FCB0" : "transparent",
              color: gasPrice === GAS_PRICE_GWEI.fast ? "black" : "#09FDB5",
            }}
            width="33.3%"
          >
            {/* {t("fast (%gasPrice%)", { gasPrice: GAS_PRICE.fast })} */}
            {t("fast")}
          </ButtonMenuItem>
          <ButtonMenuItem
            style={{
              backgroundColor: gasPrice === GAS_PRICE_GWEI.instant ? "#00FCB0" : "transparent",
              color: gasPrice === GAS_PRICE_GWEI.instant ? "black" : "#09FDB5",
              marginRight: "-0.5px",
            }}
            width="33.3%"
          >
            {/* {t("instant (%gasPrice%)", { gasPrice: GAS_PRICE.instant })} */}
            {t("instant")}
          </ButtonMenuItem>
        </StyledButtonMenu>
      </Flex>
    </Flex>
  );
};

export default GasSettings;
