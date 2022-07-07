import React, { useState } from "react";
import {IconButton, TableCell, TableRow} from "@material-ui/core";
import {ArrowRightOutlined} from "@material-ui/icons";
import {OrderTableDetails} from "../details/organisms/order-detail-products-table";

export const OrdersTableRow = (props) => {
  const [ showDetails, setShowDetails ] = useState(false);

  const {
    data,
    index,
    onItemClick,
    selectClickedRow,
    selectedIndex,
    setSelectedIndex,
    page,
    size,
    order,
    headers,
    classes
  } = props;

  return (
    <>
      <TableRow
        style={{
          cursor: onItemClick ? 'pointer' : 'text',
          backgroundColor: selectClickedRow && (page || 0)*(size || 0) + index === selectedIndex ? 'rgba(28, 189, 89, 0.2)' : 'white'

        }}
        onClick={() => { onItemClick && onItemClick(data); setSelectedIndex((page || 0)*(size || 0) + index) }}
      >
        {
          order ? (
            <TableCell size='small' align='center' style={{width: 20, paddingRight: 0}}>
              <div className="accordion-row">
                <div className="table-row-number">{(page || 0)*(size || 0) + (index+1)}</div>
                <div className={`accordion-row-arr ${showDetails ? "accordion-row-arr-opened" : ""}`}>
                  <IconButton onClick={() => setShowDetails(!showDetails)}>
                    <ArrowRightOutlined />
                  </IconButton>
                </div>
              </div>
            </TableCell>
          ) : undefined
        }
        {
          (headers || []).map((header, index) => (
            <TableCell className={classes.tableCell} style={{padding: 0}} align='center' key={`${index}`}>
              { header.render ? header.render(data) : data[header.key] }
            </TableCell>
          ))
        }
      </TableRow>
      {showDetails && <TableRow>
        <TableCell className={classes.tableCell} colSpan={10} style={{padding: 0}} align='center'>
          <OrderTableDetails id={data.id} />
        </TableCell>
      </TableRow>
      }
    </>
  )
};