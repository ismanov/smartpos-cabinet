import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import moment from "moment";
import {Grid} from "@material-ui/core";
import RangePicker from "#components/Pickers/daterange";
import AddEditDialog from '../../components/AddEditDialog';
import {defineGranularity} from "#utils/format";
import AddIcon from '@material-ui/icons/Add';
import {useTranslation} from "react-i18next";
import {fetchSalesDynamics, fetchSalesStats, setBranchListDate, } from "../../actions";
import { IconButton } from '../../../../components/button';

export default (props) => {

    const { t } = useTranslation();
    const [dialogOpen, setDialogOpen] = useState(false);
    const currentBranch  = useSelector(state => state.get('dashboard').currentBranch);
    const date = useSelector(state => state.get('branch').listDate);
    const dispatch = useDispatch();    

    useEffect(() => { updateAnalytics() }, [currentBranch, date]);

    const updateAnalytics = () => {
        dispatch(fetchSalesDynamics({
            granularity: defineGranularity({
                from: moment(date.startDate).startOf('day').toDate(),
                to: moment(date.endDate).endOf('day').toDate()
            }),
            from: date.startDate,
            to: date.endDate,
            branchId: currentBranch
        }));
        dispatch(fetchSalesStats({
            from: date.startDate,
            to: date.endDate,
            branchId: currentBranch
        }))
    };

    return (
        <Grid container style={{marginTop: 10}} alignItems='center' justify='flex-end' direction='row'>
            <AddEditDialog
                open={dialogOpen}
                onClose={success => {                    
                    setDialogOpen(false);
                    props.onUpdate && props.onUpdate()
                    if (success === true) {
                        props.success(t("branchAddEditDialog.addSuccess"));
                    }
                }}
            />
            <Grid item xs={10}>
                <Grid container justify='flex-end' direction='row' alignItems="center">
                    <Grid item>
                        <RangePicker
                            onChange={range => {
                                const s = moment(range.startDate).format('YYYY-MM-DDTHH:mm:ss');
                                const e = moment(range.endDate).format('YYYY-MM-DDTHH:mm:ss');
                                dispatch(setBranchListDate({
                                    startDate: s,
                                    endDate: e
                                }))                                
                            }}
                            value={date}
                        />
                    </Grid>
                    <Grid item style={{marginLeft: 10}}>
                        <IconButton                            
                            tooltip={t('branches.add')}
                            variant="outlined"
                            onClick={() => { setDialogOpen(true) }}     
                            icon={ <AddIcon/> }
                        />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}
