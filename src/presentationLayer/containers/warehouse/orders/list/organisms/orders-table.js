import React, {useState} from "react";
import { withRouter } from 'react-router-dom';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  makeStyles,
  TableSortLabel,
  CircularProgress
} from '@material-ui/core';

import {useTranslation} from "react-i18next";
import {OrdersTableRow} from "./orders-table-row";

const useStyles = makeStyles(theme => ({
  table: {
    width: '100%'
  },
  head: {
    backgroundColor: theme.palette.action.hover,
    color: theme.palette.common.black
  },
  body: {
    fontSize: 14,
    color: theme.palette.common.black
  },
  loadingCell: {
    height: 70,
    textAlign: 'center'

  },
  emptyCell: {
    height: 120,
    textAlign: 'center'
  },
  tableCell: {
    height: 50
  }
}));

const OrdersTable = props => {

  const [orderBy, setOrderBy] = React.useState();
  const [sortType, setSortType] = React.useState('asc');
  const { headers, order, sort, data, page, size, isLoading, onItemClick } = props;
  const {t} = useTranslation();
  const classes = useStyles();
  const [selectedIndex, setSelectedIndex] = useState()
  const loadingColspan = (headers || []).length + (order ? 1 : 0);

  const body = () => {

    if (isLoading) {
      return (
        <TableRow key='10002'>
          <TableCell className={classes.loadingCell} align='center' colSpan={loadingColspan}>
            <CircularProgress variant='indeterminate' />
          </TableCell>
        </TableRow>
      )
    } else {
      if ((data || []).length) {
        return (data || []).map((data, index) => {
          return (
            <OrdersTableRow
              data={data}
              index={index}
              onItemClick={onItemClick}
              selectClickedRow={props.selectClickedRow}
              selectedIndex={selectedIndex}
              setSelectedIndex={setSelectedIndex}
              page={page}
              size={size}
              order={order}
              headers={headers}
              classes={classes}
              key={data.id || index}
            />
          )
        })
      } else {
        return (
          <TableRow key='10002'>
            <TableCell className={classes.emptyCell} align='center' colSpan={loadingColspan}>
              <div>
                <img
                  src={require('../../../../../../assets/img/empty_list_logo.png')}
                  alt="empty_list"
                  width={100}
                  height={100}
                  style={{
                    objectFit: 'contain'
                  }}
                />
                <p style={{marginTop: 15, textAlign: 'center'}}> {t("table.empty")} </p>
              </div>
            </TableCell>
          </TableRow>
        )
      }
    }
  }

  return (
    <Table className={classes.table} style={props.style}>

      <TableHead className={classes.head}>
        <TableRow>
          {
            order ? (
              <TableCell component="th" key="10001" style={{width: 20, paddingRight: 0}}>
                №
              </TableCell>
            ) : undefined
          }
          {
            (headers || []).map((header, index) => {
              return (
                <TableCell component="th" key={`${index}`} align='center'>
                  {header.sort ? (
                    <TableSortLabel
                      active={header.key === orderBy}
                      direction={sortType}
                      onClick={() => {
                        setOrderBy(header.key)
                        let s = sortType === 'asc' ? 'desc' : 'asc';
                        setSortType(s);
                        sort && sort(header.key, s);
                      }}>
                      {header.content}
                    </TableSortLabel>
                  ) : header.content}
                </TableCell>
              )
            })
          }
        </TableRow>
      </TableHead>
      <TableBody className={classes.body}>
        {body()}
      </TableBody>
    </Table>
  )
};

export default withRouter(OrdersTable);