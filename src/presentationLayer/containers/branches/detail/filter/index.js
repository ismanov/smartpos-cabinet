import React, {useEffect} from 'react';
import {useDispatch, useSelector, } from 'react-redux';
import moment from "moment";
import {Grid, Button} from "@material-ui/core";
import RangePicker from "#components/Pickers/daterange";
import Tooltip from '@material-ui/core/Tooltip';
import RemoveIcon from '@material-ui/icons/Delete';
import {useTranslation} from "react-i18next";
import {fetchSalesStatsForBranchId, setBranchDetailDate, } from "../../actions";
import {fetchTopEmployees, fetchTopProducts} from "../../../main/action";

export default (props) => {

    const dispatch = useDispatch();

    const date = useSelector(state => state.get("branch").detailDate);

    useEffect(() => { updateStats() }, [date]);

    const { t } = useTranslation();

    const updateStats = () => {
        dispatch(fetchSalesStatsForBranchId({
            branchId: props.branchId,
            from: date.startDate,
            to: date.endDate
        }));
        dispatch(fetchTopProducts({
            branchId: props.branchId,
            from: date.startDate,
            to: date.endDate
        }));
        dispatch(fetchTopEmployees({
            branchId: props.branchId,
            from: date.startDate,
            to: date.endDate
        }));
    };

    return (
        <Grid container style={{marginTop: 20}} alignItems='center' justify='flex-end' direction='row'>
            <RangePicker
                value={date}
                onChange={range => {
                    const s = moment(range.startDate).startOf('day').format('YYYY-MM-DDTHH:mm:ss');
                    const e = moment(range.endDate).endOf('day').format('YYYY-MM-DDTHH:mm:ss');
                    dispatch(setBranchDetailDate({ startDate: s,  endDate: e }));                    
                }}
            />
            <Tooltip title={t("branchDetail.delete_button")} arrow placement={'bottom'}>
                <Button
                    variant='outlined'
                    color='secondary'
                    disabled={props.isMain}
                    style={{fontSize: 16, marginLeft: 15, height: 50}}
                    onClick={() => {
                        props.onDelete && props.onDelete()
                    }}
                ><RemoveIcon/></Button>
            </Tooltip>
        </Grid>
    )
};