import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import { withRouter }  from 'react-router-dom';
import  { TextField, Button, IconButton, Paper } from '@material-ui/core';
import { ArrowBackIos } from '@material-ui/icons'
import SelectBox from "../../../../components/Select";
import DatePicker from "../../../../components/Pickers/datepicker";
import moment from "moment";
import { createTransfer } from "../actions";
import ProductAddTable from "../component/productAddTable";
import withNotification from "../../../../hocs/withNotification/WithNotification";
import * as styles from './transferdetail.module.scss';
import {useTranslation} from "react-i18next";
import {fetchBranchList} from "../../../branches/actions";


const TransferDetail = props => {

    const [fromBranch, setFromBranch] = useState();
    const [toBranch, setToBranch] = useState();
    const [fromBranchError, setFromBranchError] = useState(false);
    const [toBranchError, setToBranchError] = useState(false);
    const [orderDate, setOrderDate] = useState(moment().format('DD MMM, YYYY'));
    const [createdDate, setCreatedDate] = useState(moment().format('DD MMM, YYYY'));
    const [productList, setProductList] = useState([]);
    const [comment, setComment] = useState();
    const { t } = useTranslation();

    const branchList = useSelector(state => state.get("branch").list);
    const dispatch = useDispatch();
    
    useEffect(() => {
        dispatch(fetchBranchList({page: 0, size: 100000}));        
    }, []);

    return (
        <div className={styles.wrapper}>
            <div className={styles.title}>
                <IconButton
                    color='primary'
                    onClick={props.history.goBack}
                >
                    <ArrowBackIos />
                </IconButton>
                <span style={{marginLeft: 8, fontWeight: 'bold', fontSize: 17}}>{t("transferAddEdit.title")}</span>
            </div>
            <div className={styles.dropdown_container}>
                <div className={styles.item}>
                    <SelectBox
                        labelWidth={90}
                        itemKey='id'
                        itemValue='name'
                        label={t("transferAddEdit.from")}
                        data={branchList}
                        value={fromBranch}                        
                        onChange={event => {
                            setFromBranch(event.target.value);
                            setToBranch(undefined);
                        }}
                    />
                </div>
                <div className={styles.item}>
                    <SelectBox
                        labelWidth={90}
                        itemKey='id'
                        itemValue='name'
                        label={t("transferAddEdit.to")}
                        data={branchList.filter(b => b.id !== fromBranch)}
                        value={toBranch}
                        onChange={event => {
                            setToBranch(event.target.value);                            
                        }}
                    />
                </div>
                <div className={styles.item}>
                    <DatePicker
                        label={t("transferAddEdit.order_date")}
                        onChange={date => {
                            setCreatedDate(moment(date).format('DD MMM, YYYY'))
                        }}
                        value={createdDate}
                    />
                </div>
                <div className={styles.item}>
                    <DatePicker
                        label={t("transferAddEdit.order_date")}
                        onChange={date => {
                            setOrderDate(moment(date).format('DD MMM, YYYY'));
                        }}
                        value={orderDate}
                    />
                </div>
            </div>
            <Paper className={styles.content} style={{marginTop: 20}}>
                { fromBranch >= 0 ? (
                    <>
                        <ProductAddTable
                            style={{width: '100%', marginTop: 20}}
                            isAdding={true}
                            onProductListChanged={list => {
                                setProductList(list.map(p => ({...p, unitId: p.unit.id, unitName: p.unit.name})));
                            }}
                            branchId={fromBranch}
                        />
                        <div style={{marginTop: 100}}>
                            <TextField
                                fullWidth
                                variant='outlined'
                                label={t("transferAddEdit.comment")}
                                onChange={event => {
                                    setComment(event.target.value)
                                }}
                                value={comment}
                                multiline={true}
                                rows={6}
                            />
                        </div>
                    </>
                    ) : (
                        <div style={{padding: 10, textAlign: 'center', fontSize: 15, fontWeight: 'bold'}}>
                            Выберите "С Филиала"
                        </div>
                    )
                }
            </Paper>
            <div className={styles.footer}>
                <Button
                    variant='text'
                    color='primary'
                    // disabled={props.isLoading}
                    onClick={() => {
                        if (fromBranch === undefined) {
                            props.error(t("transferAddEdit.select_branch"));
                            setFromBranchError(true);
                            return
                        }
                        if (toBranch === undefined) {
                            props.error(t("transferAddEdit.select_branch"));
                            setToBranchError(true);
                            return
                        }
                        if (productList.length === 0) {
                            props.error(t("transferAddEdit.select_product"));
                            return
                        }
                        dispatch(createTransfer({
                            fromBranchId:  fromBranch || 0,
                            toBranchId: toBranch || 0,
                            transferDate: moment(orderDate).format('YYYY-MM-DD'),
                            transferDetails: productList.map(pr => ({
                                product: pr.product,
                                realQty: pr.qty,
                                unitId: pr.unitId,
                                unitName: pr.unitName
                            })),
                            status: {code: 'SENT'}
                        }, props))
                    }}>
                    {t("common.save")}
                </Button>
            </div>
        </div>
    )
};



export default withRouter(withNotification(TransferDetail));
