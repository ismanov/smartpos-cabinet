import React, {useEffect, useState} from 'react';
import cn from 'classnames';
import styles from './ByCategory.module.scss';
import RangePicker from "../../../components/Pickers/daterange";
import {useDispatch, useSelector} from 'react-redux';
import moment from "moment";

import {Table, TableHead, TableBody, TableCell, TableRow, IconButton} from '@material-ui/core';
import {FolderOpenOutlined, CloudDownloadOutlined} from '@material-ui/icons';
import dashStyles
    from "../../../components/material-components/assets/jss/material-dashboard-react/views/dashboardStyle.js";
import Card from '../../../components/material-components/components/Card/Card';
import CardHeader from '../../../components/material-components/components/Card/CardHeader';
import CardIcon from '../../../components/material-components/components/Card/CardIcon';
import Money from '@material-ui/icons/AttachMoney';
import Tooltip from '@material-ui/core/Tooltip';
import numeral from 'numeral';
import {makeStyles} from "@material-ui/core/styles";
import {byCategory, byCategoryExcel, byCategoryStats} from "./actions";

const useStyles = makeStyles(dashStyles);

const ByCategory = () => {

    const [range, setRange] = useState({
        startDate: moment().startOf('month').format('YYYY-MM-DDTHH:mm:ss'),
        endDate: moment().endOf('month').endOf('month').format('YYYY-MM-DDTHH:mm:ss')
    });
    
    const [history, setHistory] = useState([]);
    
    const categoryList = useSelector(state => state.get("reportByCategory").list);
    const categoryStats = useSelector(state => state.get("reportByCategory").stats);
    const currentBranch = useSelector(state => state.get('dashboard').currentBranch);
    const dispatch = useDispatch()

    const classes = useStyles();

    useEffect(() => {
        dispatch(byCategory({
            from: range.startDate,
            to: range.endDate,
            branchId: currentBranch
        }))
        dispatch(byCategoryStats({
            from: range.startDate,
            to: range.endDate,
            branchId: currentBranch
        }))
    }, [range, currentBranch]);

    const renderItems = () => {
        if (history.length > 0) {
            let result = [
                <TableRow style={{cursor: 'pointer'}} onClick={() => {
                    let list = [...history];
                    list.splice(history.length - 1, 1);
                    setHistory(list);
                }}>
                    <TableCell style={{width: 0}}/>
                    <TableCell>
                        ..
                    </TableCell>
                    <TableCell/>
                    <TableCell/>
                    <TableCell/>
                    <TableCell/>
                    <TableCell/>
                </TableRow>
            ];
            history[history.length - 1].children.forEach((item, index) => {
                result.push(
                    <TableRow style={{cursor: 'pointer'}} onClick={() => {
                        if (item.children.length !== 0) {
                            setHistory([...history, item])
                        }

                    }}>
                        <TableCell style={{width: 0}}>
                            {index + 1}
                        </TableCell>
                        <TableCell>
                            <div className={styles.row_first}>
                                <FolderOpenOutlined
                                    style={{marginRight: 10, color: item.children.length !== 0 ? '#009f3c' : '#888'}}/>
                                {item.name}
                            </div>
                        </TableCell>
                        <TableCell>
                            {item.salesStats.salesCount || 0}
                        </TableCell>
                        <TableCell>
                            {item.salesStats.salesTotal || 0}
                        </TableCell>
                        <TableCell>
                            {item.salesStats.nds || 0}
                        </TableCell>
                        <TableCell>
                            {item.salesStats.discount || 0}
                        </TableCell>
                        <TableCell>
                            {item.salesStats.receiptCount || 0}
                        </TableCell>
                    </TableRow>
                )
            });
            return result
        } else {
            return categoryList.map((item, index) =>
                <TableRow style={{cursor: 'pointer'}} onClick={() => {
                    if (item.children.length !== 0) {
                        setHistory([...history, item])
                    }
                }}>
                    <TableCell style={{width: 0}}>
                        {index + 1}
                    </TableCell>
                    <TableCell>
                        <div className={styles.row_first}>
                            <FolderOpenOutlined
                                style={{marginRight: 10, color: item.children.length !== 0 ? '#009f3c' : '#888'}}/>
                            {item.name}
                        </div>
                    </TableCell>
                    <TableCell>
                        {item.salesStats.salesCount || 0}
                    </TableCell>
                    <TableCell>
                        {item.salesStats.salesTotal || 0}
                    </TableCell>
                    <TableCell>
                        {item.salesStats.nds || 0}
                    </TableCell>
                    <TableCell>
                        {item.salesStats.discount || 0}
                    </TableCell>
                    <TableCell>
                        {item.salesStats.receiptCount || 0}
                    </TableCell>
                </TableRow>
            )
        }
    }

    return (
        <div className={cn(styles.container)}>
            <div className={styles.title}> По категориям </div>
            <div className={styles.info}>
                <div className={styles.item}>
                    <Card>
                        <CardHeader color="primary" stats icon>
                            <CardIcon color="primary">
                                <Money/>
                            </CardIcon>
                            <p className={classes.cardCategory}>Общая сумма:</p>
                            <h3 className={classes.cardTitle}>
                                {categoryStats ? numeral(categoryStats.salesTotal || 0).format("0,0") : 0} сум
                            </h3>
                        </CardHeader>
                    </Card>
                </div>
                <div className={styles.item}>
                    <Card>
                        <CardHeader color="primary" stats icon>
                            <CardIcon color="primary">
                                <Money/>
                            </CardIcon>
                            <p className={classes.cardCategory}>Общий НДС:</p>
                            <h3 className={classes.cardTitle}>
                                {categoryStats ? numeral(categoryStats.nds || 0).format("0,0") : 0} сум
                            </h3>
                        </CardHeader>
                    </Card>
                </div>
                <div className={styles.item}>
                    <Card>
                        <CardHeader color="primary" stats icon>
                            <CardIcon color="primary">
                                <Money/>
                            </CardIcon>
                            <p className={classes.cardCategory}>Скидки:</p>
                            <h3 className={classes.cardTitle}>
                                {categoryStats ? numeral(categoryStats.discount || 0).format("0,0") : 0} сум
                            </h3>
                        </CardHeader>
                    </Card>
                </div>
                <div className={styles.item}>
                    <Card>
                        <CardHeader color="primary" stats icon>
                            <CardIcon color="primary">
                                <Money/>
                            </CardIcon>
                            <p className={classes.cardCategory}>Чеки:</p>
                            <h3 className={classes.cardTitle}>
                                {categoryStats ? categoryStats.receiptCount : 0}
                            </h3>
                        </CardHeader>
                    </Card>
                </div>
            </div>
            <div className={styles.filter}>
                <div className={cn(styles.ml_20)}>
                    <RangePicker
                        onChange={range => {
                            setRange({
                                startDate: moment(range.startDate).startOf('day').format('YYYY-MM-DDTHH:mm:ss'),
                                endDate: moment(range.endDate).endOf('day').format('YYYY-MM-DDTHH:mm:ss')
                            })
                        }}
                        value={{
                            startDate: moment(range.startDate).toDate(),
                            endDate: moment(range.endDate).toDate()
                        }}
                    />
                </div>
                <div className={styles.excel}>
                    <Tooltip arrow title={'Скачать отчёт'} placement={'bottom'}>
                        <IconButton
                            color='primary'
                            onClick={() => {
                                dispatch(byCategoryExcel({
                                    branchId: currentBranch,
                                    from: range.startDate,
                                    to: range.endDate
                                }))

                            }}
                        >
                            <CloudDownloadOutlined style={{fontSize: 30}}/>
                        </IconButton>
                    </Tooltip>
                </div>
            </div>
            <div className={styles.table_content}>
                <div className={styles.header}>
                    <div> Все категории</div>
                    <div style={{
                        fontWeight: 400,
                        color: '#009f3c',
                        marginLeft: 20,
                        fontSize: 14
                    }}> {history.map(item => item.name).join(' -> ')} </div>
                </div>
                <Table style={{width: '100%'}}>
                    <TableHead>
                        <TableCell style={{width: 0}}>
                            №
                        </TableCell>
                        <TableCell>
                            Наименование
                        </TableCell>
                        <TableCell>
                            Кол-во
                        </TableCell>
                        <TableCell>
                            Сумма
                        </TableCell>
                        <TableCell>
                            НДС
                        </TableCell>
                        <TableCell>
                            Скидка
                        </TableCell>
                        <TableCell>
                            Кол-во чеков
                        </TableCell>
                    </TableHead>
                    <TableBody>
                        {renderItems()}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default ByCategory;
