import { Flex, IconButton, useModal } from "@pancakeswap/uikit";
import CogIcon from "src/assets/icons/cog.svg";
import GreenCogIcon from "src/assets/icons/green_cog.svg";

import SettingsModal from "./SettingsModal";

type Props = {
  color?: string;
  mr?: string;
  icon?: string;
};

const GlobalSettings = ({ color, mr = "8px", icon = "" }: Props) => {
  const [onPresentSettingsModal] = useModal(<SettingsModal />);

  return (
    <Flex>
      <IconButton onClick={onPresentSettingsModal} variant="text" scale="sm" id="open-settings-dialog-button">
        <img src={icon === "" ? CogIcon : GreenCogIcon} width={20} />
      </IconButton>
    </Flex>
  );
};

export default GlobalSettings;
