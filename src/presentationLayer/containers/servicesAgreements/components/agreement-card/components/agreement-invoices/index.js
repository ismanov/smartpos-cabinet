import React, { useEffect, useState } from "react";
import moment from "moment";

// ;;;;;;;;;
import { makeStyles } from "@material-ui/core/styles";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import RemoveIcon from "@material-ui/icons/Remove";
import AddIcon from "@material-ui/icons/Add";
import { servicesAgreementsSelector } from "../../../../redux/reducer";
import { useDispatch, useSelector } from "react-redux";
import { fetchAgreementInvoices } from "../../../../redux/actions";
import Status from "../Status";
import { checkNullScw } from "../agreement-report";
import { ExpandedAgreementInvoice } from "./expanded-agreement-invoice";

export const AgreementInvoices = (props) => {
  const { quoteId } = props;
  const dispatch = useDispatch();

  const invoicesLoading = useSelector(
    servicesAgreementsSelector("agreementInvoicesLoading")
  );
  const invoicesData = useSelector(
    servicesAgreementsSelector("agreementInvoicesData")
  );

  const [filterProps, setFilterProps] = useState({});
  console.log(
    "invoicesData",
    checkNullScw(invoicesData, {
      content: null,
      page: null,
      size: null,
    })
  );
  const {
    content: invoices,
    page: invoicesPage,
    size: invoicesSize,
    totalElements: invoicesTotal,
  } = checkNullScw(invoicesData, {
    content: null,
    page: null,
    size: null,
  });

  useEffect(
    () => {
      dispatch(
        fetchAgreementInvoices({
          quoteId,
          params: Object.keys(filterProps).reduce((acc, key) => {
            return acc + `${acc ? "&" : ""}${key}=${filterProps[key]}`;
          }, ""),
        })
      );
    },
    [quoteId, filterProps]
  );

  const onFilterChange = (fields) => {
    setFilterProps({ ...filterProps, page: 0, ...fields });
  };

  const onChangePagination = (page, size) => {
    onFilterChange({ ...filterProps, page: page - 1, size });
  };

  const data = checkNullScw(invoices, []).map((item, index) => ({
    id: item.id,
    key: item.id,
    num: <div className="w-s-n">{invoicesSize * invoicesPage + index + 1}</div>,
    documentNumber: item.documentNumber,
    publicOffer: item.customerPublicOfferNumber,
    totalPriceWithVat: (
      <>
        <strong>
          {checkNullScw(item, {}, "totalPriceWithVat").toLocaleString("ru")}
        </strong>{" "}
        сум
      </>
    ),
    invoiceDate: moment(item.invoiceDate)
      .locale("ru")
      .format("DD.MM.YYYY"),
    status: item.status,
    xfileStatus: item.xfileStatus ? "" : "-",
  }));
  if (!invoicesData) return null;
  return (
    <div>
      <TableCustom
        data={data}
        // expandable={{
        //   expandedRowRender: (invoice) => (
        //     <ExpandedAgreementInvoice invoiceId={invoice.id} />
        //   ),
        // }}
        // dataSource={data}
        // columns={columns}
        // loading={invoicesLoading}
        // pagination={{
        //   total: invoicesTotal,
        //   pageSize: invoicesSize,
        //   current: invoicesPage + 1,
        //   hideOnSinglePage: true,
        //   showSizeChanger: true,
        //   pageSizeOptions,
        //   onChange: onChangePagination,
        // }}
      />

      {/* <TablePaginationActions
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={invoices.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      /> */}
    </div>
  );
};

const useRowStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
});

function Row(props) {
  const { row, index } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <RemoveIcon /> : <AddIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="center" component="th" scope="row">
          {row.num}
        </TableCell>
        <TableCell align="center">{row.documentNumber}</TableCell>
        <TableCell align="center">{row.publicOffer}</TableCell>
        <TableCell align="center">{row.totalPriceWithVat}</TableCell>
        <TableCell align="center">{row.invoiceDate}</TableCell>
        <TableCell align="center">
          {row.status && (
            <Status status={row.status.code === "ACCEPTED" ? "SUCCESS" : ""}>
              {row.status.nameRu}
            </Status>
          )}
        </TableCell>
        <TableCell align="center">{row.xfileStatus}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <ExpandedAgreementInvoice invoiceId={row.id} />
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

const TableCustom = ({ data }) => {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell />
            <TableCell align="center">Номер</TableCell>
            <TableCell align="center">Публичная оферта </TableCell>
            <TableCell align="center">Сумма</TableCell>
            <TableCell align="center">Дата счет-фактуры</TableCell>
            <TableCell align="center">Статус</TableCell>
            <TableCell align="center">Статус x-file</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <Row key={row.name} row={row} index={index} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
