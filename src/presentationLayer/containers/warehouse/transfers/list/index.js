import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {Paper, Button} from '@material-ui/core';
import Table from '../../../../components/Table/index';
import { fetchTransferList } from '../actions';
import moment from "moment";
import * as styles from './trasferlist.module.scss';
import TransferWithinAStationIcon from '@material-ui/icons/TransferWithinAStation';
import AssignmentIcon from '@material-ui/icons/Assignment';
import Tooltip from '@material-ui/core/Tooltip';
import Pagination from "../../../../components/Pagination/Pagination";
import {useTranslation} from "react-i18next";

const WarehouseTransfers = (props) => {

    const [sort, setSort] = React.useState();
    const currentBranch = useSelector(state => state.get("dashboard").currentBranch);
    const dispatch = useDispatch()
    const list = useSelector(state => state.get("transfer").list);
    const page = useSelector(state => state.get("transfer").page);
    const size = useSelector(state => state.get("transfer").size);
    const total = useSelector(state => state.get("transfer").total);
    const isLoading = useSelector(state => state.get("transfer").isLoading);

    const { t } = useTranslation();

    React.useEffect(() => {
        dispatch(fetchTransferList(page, size, currentBranch, sort))
        
    }, [currentBranch, sort])

    return (
        <div className={styles.wrapper}>
            <div className={styles.title}>
                <div className={styles.title_text}>
                    {t("transferList.title")}
                </div>
                <div className={styles.title_buttons}>
                    <Tooltip title={t("transferList.transfer")} arrow>
                        <Button
                            color='primary'
                            variant={'outlined'}
                            onClick={() => {
                                props.history.push('/main/warehouse/transfers/single/add')
                            }}
                            style={{
                                marginRight: 10
                            }}
                        ><TransferWithinAStationIcon/></Button>
                    </Tooltip>
                    <Tooltip title={t("transferList.order_to_transfer")} arrow>
                        <Button
                            color='primary'
                            variant={'outlined'}
                            onClick={() => {
                                props.history.push('/main/warehouse/transfers/order/single/add')
                            }}
                            style={{marginRight: 10}}
                        ><AssignmentIcon/></Button>
                    </Tooltip>
                </div>
            </div>
            <Paper className={styles.content}>
                <Table
                    order={true}
                    onItemClick={row => {
                        props.history.push(`/main/warehouse/transfers/order/card/${row.id}`)
                    }}
                    isLoading={isLoading}
                    headers={
                        [
                            {
                                content: t("transferList.order_no"),
                                key: 'id',
                                sort: true,
                                render: row => row.id
                            },
                            {
                                content: t("transferList.date"),
                                key: 'createdDate',
                                sort: true,
                                render: row => row.createdDate ? moment(row.createdDate).format('DD MMM, YYYY') : t("common.not_defined")
                            },
                            {
                                content: t("transferList.from"),
                                key: 'fromBranch',
                                sort: true,
                                render: row => row.fromBranchName || t("common.not_defined")
                            },
                            {
                                content: t("transferList.to"),
                                key: 'toBranch',
                                sort: true,
                                render: row => row.toBranchName || t("common.not_defined")
                            },
                            {
                                content: t("transferList.delivery_date"),
                                key: 'transferDate',
                                sort: true,
                                render: row => row.transferDate ? moment(row.transferDate).format('DD MMM, YYYY') : t("common.not_defined"),
                            },
                            {
                                content: t("transferList.status"),
                                key: 'status',
                                sort: true,
                                render: row => row.status.nameRu
                            }
                        ]
                    }
                    page={page}
                    size={size}
                    data={list}
                    sort={(index, order) => {
                        setSort({ col: index, order });
                    }}

                />
            </Paper>
            <div className={styles.footer} style={{marginTop: 15}}>
                <Pagination
                    disabled={isLoading}
                    onPageChange={page => {
                        dispatch(fetchTransferList(page, size, currentBranch, sort))
                    }}
                    onSizeChange={size => {
                        dispatch(fetchTransferList(page, size, currentBranch, sort))
                    }}
                    size={size}
                    pagesCount={total}
                    current={page}
                />
            </div>
        </div>
    )
};

export default withRouter(WarehouseTransfers);
