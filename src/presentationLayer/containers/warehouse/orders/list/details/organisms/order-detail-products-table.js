import React from "react";
import { useSelector } from "react-redux";

import Table from '../../../../../../components/Table/index';
import { formatPriceProduct } from "../../../../../../../utils/format";

export const OrderDetailProductsTable = () => {
  const ordersListStore = useSelector(state => state.get("ordersList"));

  const { orderDetails } = ordersListStore;

  const headers = [
    {
      content: "Название товара",
      key: 'name'
    },
    {
      content: "Единица измерения",
      key: 'unit'
    },
    {
      content: "НДС",
      key: 'vat'
    },
    {
      content: "Количество",
      key: 'qty'
    },
    {
      content: "Цена за 1 единицу",
      key: 'unitPrice'
    },
    {
      content: "Сумма",
      key: 'costPrice'
    }
  ];

  const data = orderDetails.data.orderItems.map((item) => {
    return {
      name: item.product.name,
      unit: item.unit.description,
      vat: item.vatRate ? `${item.vatRate} %` : "Без НДС",
      qty: item.qty,
      unitPrice: `${formatPriceProduct(item.price)} сум`,
      costPrice: item.costPrice ? `${formatPriceProduct(item.costPrice)} сум` : "",
    }
  });

  return (
    <div className="order-table-details">
      <Table
        order={true}
        headers={headers}
        data={data}
        isLoading={orderDetails ? orderDetails.loading : false}
      />
    </div>
  )
};