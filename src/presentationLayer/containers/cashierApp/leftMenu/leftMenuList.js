import React from "react";
import { MultilineChart } from "@material-ui/icons";

const MenuList = (t) => {
  return [
    {
      id: 0,
      categoryName: t("leftMenu.sale"),
      icon: MultilineChart,
      menus: [
        {
          name: t("leftMenu.cheques"),
          to: "/cashier/cheques",
        },
        {
          name: t("leftMenu.zReport"),
          to: "/cashier/z-report",
        },
        {
          name: "Продажа",
          to: "/cashier/sale",
        },
      ],
    },
  ];
};

export default MenuList;
