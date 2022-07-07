import React from "react";
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
import "./styles.scss";

const useTableStyles = makeStyles({
  root: {
    boxShadow: "none",
    "& .MuiTableCell-root": {
      padding: "7px 12px",
    },
  },
});

const useRowStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
});

const Row = (props) => {
  const { row, headers, expandable } = props;
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
        {headers.map((header) => (
          <TableCell key={header.key}>{row[header.key]}</TableCell>
        ))}
      </TableRow>
      <TableRow>
        <TableCell
          style={{ paddingBottom: 0, paddingTop: 0 }}
          colSpan={headers.length + 1}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            {expandable.expandedRowRender(row)}
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

export const CollapsibleTable = (props) => {
  const { headers = [], data = [], expandable } = props;
  const classes = useTableStyles();

  return (
    <TableContainer component={Paper} className={classes.root}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            {headers.map((header) => (
              <TableCell key={header.key}>{header.content}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <Row
              key={row.key}
              headers={headers}
              row={row}
              expandable={expandable}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
