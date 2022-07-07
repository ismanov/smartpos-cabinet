import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  makeStyles,
  TableSortLabel,
  CircularProgress,
} from "@material-ui/core";

import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme) => ({
  table: {
    width: "100%",
  },
  head: {
    backgroundColor: theme.palette.action.hover,
    color: theme.palette.common.black,
  },
  body: {
    fontSize: 14,
    color: theme.palette.common.black,
  },
  loadingCell: {
    height: 70,
    textAlign: "center",
  },
  emptyCell: {
    height: 120,
    textAlign: "center",
  },
  tableCell: {
    height: 50,
  },
  agreementNumber: {
    width: "10vw",
  },
}));

/**
 * @deprecated
 * use ../button.js
 */
const SmartposTable = (props) => {
  const [orderBy, setOrderBy] = React.useState();
  const [sortType, setSortType] = React.useState("asc");
  const {
    headers,
    order,
    sort,
    onSort,
    data,
    page,
    size,
    isLoading,
    onItemClick,
    align = "center",
  } = props;
  const { t } = useTranslation();
  const classes = useStyles();
  const [selectedIndex, setSelectedIndex] = useState();
  const loadingColspan = (headers || []).length + (order ? 1 : 0);

  React.useEffect(
    () => {
      if (sort) {
        setOrderBy(sort.col);
        setSortType(sort.order);
      }
    },
    [sort]
  );

  const body = () => {
    if (isLoading) {
      return (
        <TableRow key="10002">
          <TableCell
            className={classes.loadingCell}
            align={align}
            colSpan={loadingColspan}
          >
            <CircularProgress variant="indeterminate" />
          </TableCell>
        </TableRow>
      );
    } else {
      if ((data || []).length) {
        return (data || []).map((data, index) => {
          return (
            <TableRow
              key={index}
              style={{
                cursor: onItemClick ? "pointer" : "text",
                backgroundColor:
                  props.selectClickedRow &&
                  (page || 0) * (size || 0) + index === selectedIndex
                    ? "rgba(28, 189, 89, 0.2)"
                    : "white",
              }}
              onClick={() => {
                onItemClick && onItemClick(data);
                setSelectedIndex((page || 0) * (size || 0) + index);
              }}
            >
              {order ? (
                <TableCell
                  size="small"
                  align={align}
                  style={{ width: 20, paddingRight: 0 }}
                >
                  {(page || 0) * (size || 0) + (index + 1)}
                </TableCell>
              ) : (
                undefined
              )}
              {(headers || []).map((header, index) => (
                <TableCell
                  className={`${classes.tableCell} ${header.className} ${
                    classes[header.key]
                  }`}
                  align={align}
                  key={`${index}`}
                >
                  {header.render ? header.render(data) : data[header.key]}
                </TableCell>
              ))}
            </TableRow>
          );
        });
      } else {
        return (
          <TableRow key="10002">
            <TableCell
              className={classes.emptyCell}
              align={align}
              colSpan={loadingColspan}
            >
              <div>
                <img
                  src={require("../../../assets/img/empty_list_logo.png")}
                  alt="empty_list"
                  width={100}
                  height={100}
                  style={{
                    objectFit: "contain",
                  }}
                />
                <p style={{ marginTop: 15, textAlign: "center" }}>
                  {t("table.empty")}
                </p>
              </div>
            </TableCell>
          </TableRow>
        );
      }
    }
  };

  return (
    <Table className={classes.table} style={props.style}>
      <TableHead className={classes.head}>
        <TableRow>
          {order ? (
            <TableCell
              component="th"
              key="10001"
              style={{ width: 20, paddingRight: 0 }}
            >
              №
            </TableCell>
          ) : (
            undefined
          )}
          {(headers || []).map((header, index) => {
            return (
              <TableCell component="th" key={`${index}`} align={align}>
                {header.sort ? (
                  <TableSortLabel
                    active={header.key === orderBy}
                    direction={sortType}
                    onClick={() => {
                      setOrderBy(header.key);
                      let s = sortType === "asc" ? "desc" : "asc";
                      setSortType(s);
                      onSort && onSort(header.key, s);
                    }}
                  >
                    {header.content}
                  </TableSortLabel>
                ) : (
                  header.content
                )}
              </TableCell>
            );
          })}
        </TableRow>
      </TableHead>
      <TableBody className={classes.body}>{body()}</TableBody>
    </Table>
  );
};

export default withRouter(SmartposTable);
