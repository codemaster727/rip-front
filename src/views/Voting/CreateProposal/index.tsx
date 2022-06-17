import { Paper } from "@olympusdao/component-library";
import {
  AutoRenewIcon,
  Box,
  // Breadcrumbs,
  Button,
  // Card,
  // CardBody,
  // CardHeader,
  Flex,
  Heading,
  // Input,
  Text,
  useMatchBreakpoints,
  useModal,
} from "@pancakeswap/uikit";
import isEmpty from "lodash/isEmpty";
import times from "lodash/times";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import BackBlackIcon from "src/assets/icons/back-black.svg";
import ConnectButton from "src/components/ConnectButton/ConnectButton";
import EasyMde from "src/components/EasyMde";
import Container from "src/components/Layout/Container";
import { PageMeta } from "src/components/Layout/Page";
import ReactMarkdown from "src/components/ReactMarkdown";
import { StyledInput } from "src/components/SearchModal/CurrencySearch";
import StyledButton from "src/components/StyledButton";
import { useTranslation } from "src/contexts/Localization";
import { useWeb3Context } from "src/hooks";
import useToast from "src/hooks/useToast";
import { useInitialBlock } from "src/slices/block/hooks";
import { SnapshotCommand } from "src/slices/types";
import { getBscScanLink } from "src/utils";
import { signMessage } from "src/utils/web3React";
import { DatePicker, DatePickerPortal, TimePicker } from "src/views/Voting/components/DatePicker";

import Layout from "../components/Layout";
import VoteDetailsModal from "../components/VoteDetailsModal";
import { ADMINS } from "../config";
import { generateMetaData, generatePayloadData, Message, sendSnapshotData } from "../helpers";
import Choices, { Choice, makeChoice, MINIMUM_CHOICES } from "./Choices";
import { combineDateAndTime, getFormErrors } from "./helpers";
import { FormErrors, Label } from "./styles";
import { FormState } from "./types";

const CreateProposal = () => {
  const [state, setState] = useState<FormState>({
    name: "",
    body: "",
    choices: times(MINIMUM_CHOICES).map(makeChoice),
    //@ts-ignore
    startDate: null,
    //@ts-ignore
    startTime: null,
    //@ts-ignore
    endDate: null,
    //@ts-ignore
    endTime: null,
    snapshot: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [fieldsState, setFieldsState] = useState<{ [key: string]: boolean }>({});
  const { t } = useTranslation();
  const { account, provider: library } = useWeb3Context();
  const initialBlock = useInitialBlock();
  const { history } = useHistory();
  const { toastSuccess, toastError } = useToast();
  const [onPresentVoteDetailsModal] = useModal(<VoteDetailsModal block={state.snapshot} />);
  const { name, body, choices, startDate, startTime, endDate, endTime, snapshot } = state;
  const formErrors = getFormErrors(state, t);

  const { isMobile } = useMatchBreakpoints();

  const handleSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    try {
      setIsLoading(true);
      const proposal = JSON.stringify({
        ...generatePayloadData(),
        type: SnapshotCommand.PROPOSAL,
        payload: {
          name,
          body,
          snapshot,
          start: combineDateAndTime(startDate, startTime),
          end: combineDateAndTime(endDate, endTime),
          choices: choices
            .filter(choice => choice.value)
            .map(choice => {
              return choice.value;
            }),
          metadata: generateMetaData(),
          type: "single-choice",
        },
      });

      const sig = await signMessage(/*connector,*/ library, account as string, proposal);

      if (sig) {
        const msg: Message = { address: account as string, msg: proposal, sig };

        // Save proposal to snapshot
        const data = await sendSnapshotData(msg);

        // Redirect user to newly created proposal page
        history.push(`/voting/proposal/${data.ipfsHash}`);

        toastSuccess(t("Proposal created!"));
      } else {
        toastError(t("Error"), t("Unable to sign payload"));
      }
    } catch (error) {
      toastError(t("Error"), (error as Error)?.message);
      console.error(error);
      setIsLoading(false);
    }
  };

  const updateValue = (key: string, value: string | Choice[] | Date) => {
    setState(prevState => ({
      ...prevState,
      [key]: value,
    }));

    // Keep track of what fields the user has attempted to edit
    setFieldsState(prevFieldsState => ({
      ...prevFieldsState,
      [key]: true,
    }));
  };

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { name: inputName, value } = evt.currentTarget;
    updateValue(inputName, value);
  };

  const handleEasyMdeChange = (value: string) => {
    updateValue("body", value);
  };

  const handleChoiceChange = (newChoices: Choice[]) => {
    updateValue("choices", newChoices);
  };

  const handleDateChange = (key: string) => (value: Date) => {
    updateValue(key, value);
  };

  const options = useMemo(() => {
    return {
      hideIcons:
        account && ADMINS.includes(account.toLowerCase())
          ? []
          : ["guide", "fullscreen", "preview", "side-by-side", "image"],
    };
  }, [account]);

  const CardAction = () => (
    <div>
      <Label color="black" style={{ textAlign: "center" }}>
        {t("start")}
      </Label>
      <Box mb="24px">
        <DatePicker
          name="startDate"
          onChange={handleDateChange("startDate")}
          selected={startDate}
          placeholderText="YYYY/MM/DD"
        />
        {formErrors.startDate && fieldsState.startDate && <FormErrors errors={formErrors.startDate} />}
      </Box>
      <Box mb="24px">
        <TimePicker
          name="startTime"
          onChange={handleDateChange("startTime")}
          selected={startTime}
          placeholderText="00:00"
        />
        {formErrors.startTime && fieldsState.startTime && <FormErrors errors={formErrors.startTime} />}
      </Box>
      <Label color="black" style={{ textAlign: "center" }}>
        {t("end")}
      </Label>
      <Box mb="24px">
        <DatePicker
          name="endDate"
          onChange={handleDateChange("endDate")}
          selected={endDate}
          placeholderText="YYYY/MM/DD"
        />
        {formErrors.endDate && fieldsState.endDate && <FormErrors errors={formErrors.endDate} />}
      </Box>
      <Box mb="24px">
        <TimePicker name="endTime" onChange={handleDateChange("endTime")} selected={endTime} placeholderText="00:00" />
        {formErrors.endTime && fieldsState.endTime && <FormErrors errors={formErrors.endTime} />}
      </Box>
      <Flex alignItems="center" justifyContent="center" mb="16px">
        <Text color="blueish_gray" mr="16px">
          {t("Snapshot")}
        </Text>
        <Link to={getBscScanLink(snapshot, "block")} target="_blank">
          <Text color="blueish_gray">{snapshot}</Text>
        </Link>
      </Flex>
      {account ? (
        <>
          <StyledButton
            type="submit"
            width="100%"
            isLoading={isLoading}
            endIcon={isLoading ? <AutoRenewIcon spin color="currentColor" /> : null}
            disabled={!isEmpty(formErrors)}
            mb="16px"
          >
            {t("Publish")}
          </StyledButton>
          {/* <Text color="failure" as="p" mb="4px">
            {t("You need at least %count% voting power to publish a proposal.", {
              count: VOTE_THRESHOLD,
            })}{" "}
          </Text> */}
          {/* <Button scale="sm" type="button" variant="text" onClick={onPresentVoteDetailsModal} p={0}>
            {t("Check voting power")}
          </Button> */}
        </>
      ) : (
        <ConnectButton />
      )}
    </div>
  );

  useEffect(() => {
    if (initialBlock > 0) {
      setState(prevState => ({
        ...prevState,
        snapshot: initialBlock,
      }));
    }
  }, [initialBlock, setState]);

  return (
    <div className="content-container">
      <Paper className="blur7" style={{ maxWidth: "100%" }}>
        <Flex flexDirection={"column"} width="100%" justifyContent="center" position="relative" pt="1rem">
          <Container py="0px" maxWidth="100%" mx="0">
            <PageMeta />
            <Box mb="32px">
              <Flex alignItems="center" mb="8px" justifyContent="center">
                <Link to="/voting">
                  <Button as="a" variant="text" px="0">
                    <img src={BackBlackIcon} width={36} />
                  </Button>
                </Link>
                <Heading
                  as="h2"
                  scale="md"
                  id="voting-proposals"
                  textAlign="center"
                  mt="0"
                  color="black"
                  maxWidth="80%"
                  marginBottom={0}
                  marginLeft="8px"
                >
                  make a proposal
                </Heading>
              </Flex>
            </Box>
            <form onSubmit={handleSubmit}>
              <Layout>
                {CardAction()}
                <Box>
                  <Box mb="24px" width="70%">
                    <Label>{t("title")}</Label>
                    <StyledInput
                      id="name"
                      name="name"
                      value={name}
                      scale="lg"
                      onChange={handleChange}
                      required
                      style={{ backgroundColor: "#00FCB0", border: "1px solid black", color: "black" }}
                    />
                    {formErrors.name && fieldsState.name && <FormErrors errors={formErrors.name} />}
                  </Box>
                  <Box mb="24px">
                    <Label htmlFor="body">{t("content")}</Label>
                    <Text color="blueish_gray" mb="8px">
                      {t("tip: write in Markdown!")}
                    </Text>
                    <EasyMde
                      id="body"
                      name="body"
                      onTextChange={handleEasyMdeChange}
                      value={body}
                      options={options}
                      required
                    />
                    {formErrors.body && fieldsState.body && <FormErrors errors={formErrors.body} />}
                  </Box>
                  {body && (
                    <Box mb="24px">
                      <Heading as="h3" scale="md" color="black">
                        {t("preview")}
                      </Heading>
                      <ReactMarkdown>{body}</ReactMarkdown>
                    </Box>
                  )}
                  <Choices choices={choices} onChange={handleChoiceChange} />
                  {formErrors.choices && fieldsState.choices && <FormErrors errors={formErrors.choices} />}
                </Box>
                {isMobile && <Box>{CardAction()}</Box>}
              </Layout>
            </form>
            <DatePickerPortal />
          </Container>
        </Flex>
      </Paper>
    </div>
  );
};

export default CreateProposal;
