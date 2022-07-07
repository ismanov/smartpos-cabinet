import React from "react";
import ListAltIcon from "@material-ui/icons/ListAlt";
import ImportContactsIcon from "@material-ui/icons/ImportContacts";
import PieChartIcon from "@material-ui/icons/PieChart";
import {
  Store,
  CardGiftcard,
  Loyalty,
  Style,
  DvrSharp,
} from "@material-ui/icons";
// import StyleIcon from '@material-ui/icons/Style';
import { SupplierSvg } from "../../../../assets/svg/svg-icons";

const MenuList = (t) => {
  let menuList = [
    {
      id: 0,
      categoryName: t("leftMenu.commonInfo"),
      icon: ListAltIcon,
      menus: [
        {
          name: t("leftMenu.home"),
          to: "/main/dashboard",
        },
        {
          name: t("leftMenu.branches"),
          to: "/main/branches",
        },
        {
          name: t("leftMenu.employees"),
          to: "/main/employees",
        },
      ],
    },
    {
      id: 1,
      categoryName: t("leftMenu.catalog"),
      icon: ImportContactsIcon,
      menus: [
        {
          name: t("leftMenu.myCatalog"),
          to: "/main/catalog/my",
        },
        {
          name: t("leftMenu.singleCatalog"),
          to: "/main/catalog/single",
        },
      ],
    },
    {
      id: 2,
      categoryName: t("leftMenu.warehouse"),
      icon: Store,
      menus: [
        {
          name: t("leftMenu.balance"),
          to: "/main/warehouse/all",
        },
        {
          name: t("leftMenu.balanceByDay"),
          to: "/main/warehouse/balanceByDay",
        },
        {
          name: t("leftMenu.incomes"),
          to: "/main/warehouse/incomes",
        },
        {
          name: t("leftMenu.pricing"),
          to: "/main/warehouse/pricing/all",
        },
        {
          name: t("leftMenu.orders"),
          to: "/main/warehouse/orders",
        },
        {
          name: t("leftMenu.adjustment"),
          to: "/main/warehouse/adjustment",
        },
        {
          name: t("leftMenu.transfers"),
          to: "/main/warehouse/transfers",
        },
        {
          name: t("leftMenu.suppliers"),
          to: "/main/warehouse/suppliers",
        },
      ],
    },
    {
      id: 3,
      categoryName: t("leftMenu.reports"),
      icon: PieChartIcon,
      menus: [
        {
          name: t("leftMenu.cheques"),
          to: "/main/report/cheques",
        },
        // {
        //     "name": t("leftMenu.chequesByDiscount"),
        //     "to": "/main/report/chequeByDiscount"
        // },
        {
          name: t("leftMenu.cashTransactions"),
          to: "/main/report/cashTransactions",
        },
        {
          name: t("leftMenu.zReport"),
          to: "/main/report/z-report",
        },
        {
          name: t("leftMenu.byProducts"),
          to: "/main/report/products",
        },
        {
          name: t("leftMenu.byOneProduct"),
          to: "/main/report/byOneProduct",
        },
        {
          name: t("leftMenu.byCategory"),
          to: "/main/report/byCategory",
        },
        {
          name: t("leftMenu.byCashiers"),
          to: "/main/report/byCashiers",
        },
      ],
    },
  ];

  const { NODE_ENV } = process.env;
  if (NODE_ENV === "development") {
    menuList.push({
      id: 4,
      categoryName: t("leftMenu.discount"),
      icon: CardGiftcard,
      menus: [
        {
          name: t("leftMenu.discount_all"),
          to: "/main/discounts/all",
        },
      ],
    });
    menuList.push({
      id: 5,
      categoryName: t("leftMenu.loyaltySystem"),
      icon: Loyalty,
      menus: [
        {
          name: t("leftMenu.loyaltyCards"),
          to: "/main/loyalty/cards",
        },
        {
          name: t("leftMenu.loyaltySystems"),
          to: "/main/loyalty/systems",
        },
        {
          name: t("leftMenu.loyaltyClients"),
          to: "/main/loyalty/clients",
        },
      ],
    });
    menuList.push({
      id: 6,
      categoryName: "Поставщики",
      icon: SupplierSvg,
      menus: [
        {
          name: t("leftMenu.orders"),
          to: "/main/warehouse/orders/list",
        },
        {
          name: t("leftMenu.catalog"),
          to: "/main/catalog/supplier",
        },
        {
          name: "Приход",
          to: "/main/warehouse/arrival",
        },
      ],
    });
  }
  menuList.push({
    id: 7,
    categoryName: t("leftMenu.services"),
    icon: Style,
    menus: [
      {
        name: t("leftMenu.servicesAgreements"),
        to: "/main/services-agreements",
      },
      {
        name: t("leftMenu.payment"),
        to: "/main/payment",
      },
    ],
  });

  // if (NODE_ENV === "development") {
  //   menuList.push({
  //     id: 8,
  //     categoryName: "cashScreen",
  //     icon: DvrSharp,
  //     menus: [
  //       {
  //         name: "dashboard",
  //         to: "/main/cashS-screen",
  //       },
  //     ],
  //   });
  // }

  return menuList;
};

export default MenuList;
