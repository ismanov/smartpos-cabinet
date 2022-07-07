import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import moment from "moment";
import FileDownload from "js-file-download";

import * as actions from "./actions";

import Table from '../../../../components/Table/index';
import Pagination from "../../../../components/Pagination/Pagination";
import { formatPriceProduct } from "../../../../../utils/format";
import { Button } from "@material-ui/core";
import { Description } from "@material-ui/icons";
import { OrdersListFilter } from "./organisms/orders-list-filter";
import withNotification from "../../../../hocs/withNotification/WithNotification";

import "./order-list.scss";

const OrderListNew = withNotification((props) => {
  const ordersListStore = useSelector(state => state.get("ordersList"));
  const dispatch = useDispatch();

  const { ordersList, ordersListFilterProps, downloadXls, syncInvoices } = ordersListStore;

  const getOrdersList = () => {
    dispatch(
      actions.getOrdersListAction({
        ...ordersListFilterProps,
        supplier: undefined,
      })
    )
  };

  useEffect(() => {
    getOrdersList()
  }, [ordersListFilterProps]);

  useEffect(() => {
    if (syncInvoices.success) {
      props.success('Заказы синхронизированы');

      getOrdersList();

      dispatch(
        actions.resetSyncInvoicesAction()
      )
    }
  }, [syncInvoices.success]);

  useEffect(() => {
    if (downloadXls.data) {
      FileDownload(downloadXls.data, `${downloadXls.filename.replace("attachment; filename=", "")}`);

      dispatch(
        actions.resetDownloadXlsAction()
      )
    }
  }, [downloadXls.data]);

  const onSyncInvoices = () => {
    dispatch(
      actions.syncInvoicesAction()
    )
  };

  const onDownLoadXls = () => {
    dispatch(
      actions.downloadXlsAction({
        ...ordersListFilterProps,
        supplier: undefined
      })
    )
  };

  const onFilterChange = (fields) => {
    dispatch(
      actions.updateOrdersListAction({ page: 0, ...fields })
    );
  };

  const onChangePagination = (page) => {
    onFilterChange({ page });
  };

  const onChangeSize = (size) => {
    onFilterChange({ size });
  };

  const headers = [
    {
      content: "Номер заказа",
      key: 'number'
    },
    {
      content: "Кол-во",
      key: 'qty'
    },
    {
      content: "Дата заказа",
      key: 'orderDate',
    },
    {
      content: "Поставщик",
      key: "supplier"
    },
    {
      content: "Сумма",
      key: "total"
    },
    {
      content: "Статус",
      key: "status"
    }
  ];

  const data = ordersList.data.content.map((order) => {
    return {
      id: order.id,
      number: <Link to={`/main/warehouse/orders/list/${order.id}`}>{order.number}</Link>,
      qty: order.qty,
      orderDate: order.orderDate ? moment(order.orderDate).format('YYYY-MM-DD') : "",
      supplier: order.supplier.name,
      total: order.total ? `${formatPriceProduct(order.total)} сум` : "",
      status: order.status.nameRu
    }
  });

  return (
    <div className="orderlist">
      <div className="orderlist__head">
        <h1 className="section-h1">Заказы</h1>
        <div>
          <Button
            disabled={syncInvoices.loading}
            variant="outlined"
            color='primary'
            onClick={onSyncInvoices}
          >
            Синхронизация с X-File
          </Button>
          <Button
            disabled={downloadXls.loading}
            color="primary"
            variant="contained"
            startIcon={<Description />}
            onClick={onDownLoadXls}
          >
            Скачать в Excel файл
          </Button>
          <Button variant="outlined" color='primary' onClick={() => props.history.push('/main/warehouse/orders/ordering')}>
            Заказать
          </Button>
        </div>
      </div>
      <div className="orderlist__content">
        <OrdersListFilter onFilterChange={onFilterChange} />
        <Table
          order={true}
          headers={headers}
          data={data}
          page={ordersList.data.number}
          size={ordersList.data.size}
          isLoading={ordersList.loading}
        />
      </div>
      <div className="custom-content__pagination">
        <Pagination
          onPageChange={onChangePagination}
          onSizeChange={onChangeSize}
          disabled={ordersList.loading}
          size={ordersList.data.size}
          pagesCount={ordersList.data.totalPages}
          current={ordersList.data.number}
        />
      </div>
    </div>
  )
});

export default OrderListNew;