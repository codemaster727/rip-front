import { menuStatus } from "@pancakeswap/uikit";
import { useMemo } from "react";

import { useTranslation } from "../../../contexts/Localization";
import config, { ConfigMenuItemsType } from "../config/config";
import { useMenuItemsStatus } from "./useMenuItemsStatus";

export const useMenuItems = (): ConfigMenuItemsType[] => {
  const {
    t,
    currentLanguage: { code: languageCode },
  } = useTranslation();
  const menuItemsStatus = useMenuItemsStatus();

  const menuItems = useMemo(() => {
    return config(t, languageCode);
  }, [t, languageCode]);

  return useMemo(() => {
    if (menuItemsStatus && Object.keys(menuItemsStatus).length) {
      return menuItems.map(item => {
        const innerItems = item.items?.map(innerItem => {
          const itemStatus = menuItemsStatus[innerItem.href as keyof typeof menuItemsStatus];
          if (itemStatus) {
            let itemMenuStatus;
            if (itemStatus === "soon") {
              itemMenuStatus = menuStatus.SOON;
            } else if (itemStatus === "live") {
              itemMenuStatus = menuStatus.LIVE;
            } else {
              itemMenuStatus = menuStatus.NEW;
            }
            return { ...innerItem, status: itemMenuStatus };
          }
          return innerItem;
        });
        return { ...item, items: innerItems };
      });
    }
    return menuItems;
  }, [menuItems, menuItemsStatus]);
};
