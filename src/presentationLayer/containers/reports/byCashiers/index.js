import React from 'react';
import {connect, useDispatch, useSelector} from 'react-redux';
import styles from './ByCashiers.module.scss'
import RangePicker from "#components/Pickers/daterange";
import cn from 'classnames';

import moment from "moment";
import Pagination from "../../../components/Pagination/Pagination";
import Table from '../../../components/Table/index';
import {byCashiers, setSort,} from "./actions";
import {useTranslation} from "react-i18next";

const ByCashiers = () => {

    const [range, setRange] = React.useState({
            startDate: moment().startOf("month").startOf('day').format('YYYY-MM-DDTHH:mm:ss'),
            endDate: moment().endOf('month').endOf('day').format('YYYY-MM-DDTHH:mm:ss')
    });
    // const [sort, setSort] = React.useState();

    const currentBranch = useSelector(state => state.get("dashboard").currentBranch);
    const dispatch = useDispatch();

    const list = useSelector(state => state.get("reportByCashiers").list);
    const page = useSelector(state => state.get("reportByCashiers").page);
    const size = useSelector(state => state.get("reportByCashiers").size);
    const total = useSelector(state => state.get("reportByCashiers").total);
    const sort = useSelector(state => state.get("reportByCashiers").sort);

    const { t } = useTranslation();

    React.useEffect(() => {
        updateList()
    }, [currentBranch, range, page, sort]);


    const updateList = () => {
        dispatch(byCashiers({branchId: currentBranch, from: range.startDate, to: range.endDate, page, size, sort}))

    }

    return (
        <div className={styles.container}>
            <div className={styles.title}>
                {t("reportByCashiers.title")}
            </div>

            <div className={styles.filter}>
                <div className={cn(styles.item, styles.ml_20)}>
                    <RangePicker
                        onChange={range => {
                            setRange({
                                startDate: moment(range.startDate).startOf('day').format('YYYY-MM-DDTHH:mm:ss'),
                                endDate: moment(range.endDate).endOf('day').format('YYYY-MM-DDTHH:mm:ss')
                            })
                        }}
                        position={'flex-start'}
                        value={{
                            startDate: moment(range.startDate).toDate(),
                            endDate: moment(range.endDate).toDate()
                        }}
                    />
                </div>
            </div>
            <div className={styles.content}>
                <Table
                    headers={
                        [
                            {
                                content: t("reportByCashiers.cashier"),
                                key: 'name',
                                sort: true
                            },
                            {
                                content: t("reportByCashiers.totalSale"),
                                key: 'salesTotal',
                                sort: true
                            },
                            {
                                content: t("reportByCashiers.cheques"),
                                key: 'salesCount',
                                sort: true
                            },
                            {
                                content: t("reportByCashiers.averageCheque"),
                                key: 'averageReceiptCost',
                                sort: true
                            },
                            {
                                content: t("reportByCashiers.branch"),
                                key: 'branchName',
                                sort: true
                            }
                        ]
                    }
                    data={list.map((item) => ({
                        id: item.id,
                        name: item.name || t("common.not_defined"),
                        salesTotal: Number(item.salesTotal || 0).format(2),
                        salesCount: Number(item.salesCount || 0).format(2),
                        averageReceiptCost: Number(item.averageReceiptCost || 0).format(2),
                        shiftCount: 0,
                        branchName: item.branchName || t("common.not_defined"),
                    })) }
                    page={page}
                    size={size}
                    order={true}
                    onSort={(i, t) => {
                        dispatch(setSort({
                            col: i,
                            order: t
                        }))
                    }}
                    sort={sort}
                />
            </div>
            <div>
                <Pagination
                    onPageChange={page => {
                        dispatch(byCashiers({branchId: currentBranch, from: range.startDate, to: range.endDate, page, size, sort}))
                    }}
                    onSizeChange = {size => {
                        dispatch(byCashiers({branchId: currentBranch, from: range.startDate, to: range.endDate, page, size, sort}))
                    }}
                    pagesCount={total}
                    current={page}
                    size={size}
                />
            </div>
        </div>
    )
};


export default ByCashiers;
