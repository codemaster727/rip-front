import { Box, ButtonMenuItem, Flex, Input, Text } from "@pancakeswap/uikit";
import { useState } from "react";
import { StyledButtonMenu } from "src/components/SearchModal/Manage";

import { useTranslation } from "../../../contexts/Localization";
import { useUserSlippageTolerance, useUserTransactionTTL } from "../../../slices/user/hooks";
import { escapeRegExp } from "../../../utils";
import QuestionHelper from "../../QuestionHelper";

enum SlippageError {
  InvalidInput = "InvalidInput",
  RiskyLow = "RiskyLow",
  RiskyHigh = "RiskyHigh",
}

enum DeadlineError {
  InvalidInput = "InvalidInput",
}

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`); // match escaped "." characters via in a non-capturing group

const SlippageTabs = () => {
  const [userSlippageTolerance, setUserSlippageTolerance] = useUserSlippageTolerance();
  const [ttl, setTtl] = useUserTransactionTTL();
  const [slippageInput, setSlippageInput] = useState("");
  const [deadlineInput, setDeadlineInput] = useState("");

  const { t } = useTranslation();

  const slippageInputIsValid =
    slippageInput === "" || (userSlippageTolerance / 100).toFixed(2) === Number.parseFloat(slippageInput).toFixed(2);
  const deadlineInputIsValid = deadlineInput === "" || (ttl / 60).toString() === deadlineInput;

  let slippageError: SlippageError | undefined;
  if (slippageInput !== "" && !slippageInputIsValid) {
    slippageError = SlippageError.InvalidInput;
  } else if (slippageInputIsValid && userSlippageTolerance < 50) {
    slippageError = SlippageError.RiskyLow;
  } else if (slippageInputIsValid && userSlippageTolerance > 500) {
    slippageError = SlippageError.RiskyHigh;
  } else {
    slippageError = undefined;
  }

  let deadlineError: DeadlineError | undefined;
  if (deadlineInput !== "" && !deadlineInputIsValid) {
    deadlineError = DeadlineError.InvalidInput;
  } else {
    deadlineError = undefined;
  }

  const parseCustomSlippage = (value: string) => {
    if (value === "" || inputRegex.test(escapeRegExp(value))) {
      setSlippageInput(value);

      try {
        const valueAsIntFromRoundedFloat = Number.parseInt((Number.parseFloat(value) * 100).toString());
        if (!Number.isNaN(valueAsIntFromRoundedFloat) && valueAsIntFromRoundedFloat < 5000) {
          setUserSlippageTolerance(valueAsIntFromRoundedFloat);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const parseCustomDeadline = (value: string) => {
    setDeadlineInput(value);

    try {
      const valueAsInt: number = Number.parseInt(value) * 60;
      if (!Number.isNaN(valueAsInt) && valueAsInt > 0) {
        setTtl(valueAsInt);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Flex flexDirection="column">
      <Flex flexDirection="column" mb="24px">
        <Flex mb="12px">
          <Text color="white">{t("Slippage Tolerance")}</Text>
          <QuestionHelper
            text={t(
              "Setting a high slippage tolerance can help transactions succeed, but you may not get such a good price. Use with caution.",
            )}
            placement="top-start"
            ml="4px"
          />
        </Flex>
        <Flex flexDirection="row" flexWrap="nowrap">
          <StyledButtonMenu
            activeIndex={userSlippageTolerance === 10 ? 0 : userSlippageTolerance === 50 ? 1 : 2}
            onItemClick={index => {
              setSlippageInput("");
              setUserSlippageTolerance(index === 0 ? 10 : index === 1 ? 50 : 100);
            }}
            scale="sm"
            variant="subtle"
          >
            <ButtonMenuItem
              style={{
                backgroundColor: userSlippageTolerance === 10 ? "#00FCB0" : "transparent",
                color: userSlippageTolerance === 10 ? "black" : "#09FDB5",
              }}
              width="20%"
            >
              {t("0.1")}
            </ButtonMenuItem>
            <ButtonMenuItem
              style={{
                backgroundColor: userSlippageTolerance === 50 ? "#00FCB0" : "transparent",
                color: userSlippageTolerance === 50 ? "black" : "#09FDB5",
              }}
              width="20%"
            >
              {t("0.5")}
            </ButtonMenuItem>
            <ButtonMenuItem
              style={{
                backgroundColor: userSlippageTolerance === 100 ? "#00FCB0" : "transparent",
                color: userSlippageTolerance === 100 ? "black" : "#09FDB5",
                marginRight: "-0.5px",
              }}
              width="20%"
            >
              {t("1")}
            </ButtonMenuItem>
          </StyledButtonMenu>
          <Flex alignItems="center">
            <Box width="70px" ml={2}>
              <Input
                scale="sm"
                inputMode="decimal"
                pattern="^[0-9]*[.,]?[0-9]{0,2}$"
                placeholder={"...%"}
                value={slippageInput}
                onBlur={() => {
                  parseCustomSlippage((userSlippageTolerance / 100).toFixed(2));
                }}
                onChange={event => {
                  if (event.currentTarget.validity.valid) {
                    parseCustomSlippage(event.target.value.replace(/,/g, "."));
                  }
                }}
                isWarning={!slippageInputIsValid}
                isSuccess={![10, 50, 100].includes(userSlippageTolerance)}
              />
            </Box>
          </Flex>
        </Flex>
        {!!slippageError && (
          <Text fontSize="14px" color={slippageError === SlippageError.InvalidInput ? "red" : "#F3841E"} mt="8px">
            {slippageError === SlippageError.InvalidInput
              ? t("Enter a valid slippage percentage")
              : slippageError === SlippageError.RiskyLow
              ? t("Your transaction may fail")
              : t("Your transaction may be frontrun")}
          </Text>
        )}
      </Flex>
      <Flex justifyContent="space-between" alignItems="center" mb="24px">
        <Flex alignItems="center">
          <Text color="white">{t("Tx deadline (mins)")}</Text>
          <QuestionHelper
            text={t("Your transaction will revert if it is left confirming for longer than this time.")}
            placement="top-start"
            ml="4px"
          />
        </Flex>
        <Flex>
          <Box width="70px" mt="4px">
            <Input
              scale="sm"
              inputMode="numeric"
              pattern="^[0-9]+$"
              color={deadlineError ? "red" : undefined}
              onBlur={() => {
                parseCustomDeadline((ttl / 60).toString());
              }}
              placeholder={"mins"}
              value={deadlineInput}
              onChange={event => {
                if (event.currentTarget.validity.valid) {
                  parseCustomDeadline(event.target.value);
                }
              }}
            />
          </Box>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default SlippageTabs;
