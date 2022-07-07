import React, { useState } from 'react';
import {
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    makeStyles,
    TableSortLabel,
    CircularProgress,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import { useTranslation } from "react-i18next";

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
    emptyLabel: {
        textAlign: 'center',
        marginTop: 15,
    },
    tableCell: {
        height: 50
    }
}));

const defaultEmptyBodyContent = (text) => (
    <div>
        <img
            src={require('../../assets/img/empty_list_logo.png')}
            alt="empty_list"
            width={100}
            height={100}
            style={{
                objectFit: 'contain'
            }}
        />
        <p style={{marginTop: 15, textAlign: 'center'}}> {text} </p>
    </div>
)

const CustomTable = ({ columns = [], order, onSort, sort, data = [], page, size, isLoading, onItemClick, selectClickedRow, emptyContent, style, }) => {

    const { t } = useTranslation();
    const classes = useStyles();
    const [selectedIndex, setSelectedIndex] = useState()
    

    const body = R.ifElse(
        () => isLoading,
        () => (
            <TableRow key='10002'>
                <TableCell className={classes.loadingCell} align='center' colSpan={columns.length + (order ? 1 : 0)}>
                    <CircularProgress variant='indeterminate' />
                </TableCell>
            </TableRow>
        ),
        R.ifElse(
            () => Boolean(data.length),
            () => data.map((data, index) => {
                return (
                    <TableRow
                        key={index}
                        style={{
                            cursor: onItemClick ? 'pointer' : 'text',
                            backgroundColor: selectClickedRow && (page || 0)*(size || 0) + index === selectedIndex ? 'rgba(28, 189, 89, 0.2)' : 'white'                        
                        }}
                        onClick={() => { onItemClick && onItemClick(data); setSelectedIndex((page || 0)*(size || 0) + index) }}                            
                    >
                        {
                            order ? (
                                <TableCell size='small' align='center' style={{width: 20, paddingRight: 0}}>
                                    {(page || 0)*(size || 0) + (index+1)}
                                </TableCell>
                            ) : undefined
                        }
                        {
                            columns.map((column, index) => (
                                <TableCell className={classes.tableCell} style={{padding: 0}} align='center' key={`${index}`}>
                                    { column.render ? column.render(data) : data[column.key] }
                                </TableCell>
                            ))
                        }
                    </TableRow>
                )
            }),
            () => (
                <TableRow key='1'>
                    <TableCell className={classes.emptyCell} align='center' colSpan={columns.length + (order ? 1 : 0)}>
                        { emptyContent || defaultEmptyBodyContent(t("table.empty")) }                        
                    </TableCell>
                </TableRow>
            )
        )

    )

    return (
        <Table className={classes.table} style={style}>
            <TableHead className={classes.head}>
                <TableRow>
                    {
                        order ? (
                            <TableCell component="th" key="0" style={{width: 20, paddingRight: 0}}> № </TableCell>
                        ) : undefined
                    }
                    {
                        columns.map((column, index) => {
                            return (
                                <TableCell component="th" key={`${order ? index + 1 : index}`} align='center'>
                                    {column.sort ? (
                                        <TableSortLabel
                                            active={sort && column.key === sort.col}
                                            direction={sort && sort.order}
                                            onClick={() => {
                                                onSort && onSort({
                                                    col: column.key,
                                                    order: sort.order === 'asc' ? 'desc' : 'asc',
                                                });
                                            }}>
                                            {column.content}
                                        </TableSortLabel>
                                    ) : column.content}
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

CustomTable.propTypes = {
    data: PropTypes.array,
    columns: PropTypes.array,
    onItemClick: PropTypes.func,
    order: PropTypes.bool,
    isLoading: PropTypes.bool,
    emptyContent: PropTypes.any,
    selectClickedRow: PropTypes.bool,
    style: PropTypes.object,
};

export default CustomTable;
