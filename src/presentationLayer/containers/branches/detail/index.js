import React, {useState, useEffect} from 'react';
import withNotification from '../../../hocs/withNotification/WithNotification';
import {useDispatch, useSelector} from 'react-redux';
import {
    Grid, Button, Dialog,
    DialogTitle, DialogContentText,
    DialogActions, IconButton, Paper
} from '@material-ui/core';
import AddEditDialog from '../components/AddEditDialog';
import {ArrowBackOutlined} from '@material-ui/icons';
import Filter from './filter';
import SalesStates from './stats';
import TopTables from './tops';
import { withRouter } from 'react-router-dom';
import Detail from "../../../components/containers/detail";
import {Row} from "../../../components/containers/detailpage/DetailSection";
import {useTranslation} from "react-i18next";
import {fetchBranchById, removeBranch} from "../actions";
import {fetchBranchList} from "../../dashboard/actions";

const BranchDetail = withRouter(withNotification(props => {

    const dispatch = useDispatch();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const {t} = useTranslation();
    const branch = useSelector(state => state.get("branch").branch);

    useEffect(() => { updateData() }, []);

    const updateData = () => {
        const { branchId } = props.match.params;
        if (branchId !== undefined) { dispatch(fetchBranchById(branchId)) }
    };

    return(
        <Grid container justify='center'>

            <AddEditDialog
                open={dialogOpen}
                current={branch}
                onClose={() => {
                    setDialogOpen(false);
                    const { branchId } = props.match.params;
                    dispatch(fetchBranchById(branchId));
                }}
            />

            <Grid container style={{marginTop: 10, color: '#555', fontSize: 18, fontWeight: 'bold'}} direction='row'
                  alignItems='center'>
                <Grid item>
                    <IconButton color='primary' onClick={() => {
                        props.history.goBack()
                    }}>
                        <ArrowBackOutlined/>
                    </IconButton>
                </Grid>
                <Grid item> {t("branchDetail.title")} {branch ? '(' + branch.name + ')' : ''} </Grid>
            </Grid>

            <Filter
                branchId={props.match.params.branchId}
                isMain={branch ? branch.mainBranch : true}
                onDelete={() => {
                    setOpenDeleteDialog(true);
                }}
            />
            <SalesStates/>
            <Grid container style={{marginTop: 15}}>
                <Grid item xs={12}>
                    <Paper style={{padding: 10}}>
                        <Detail
                            header={{
                                title: t("branchDetail.data"),
                                buttonTitle: t("branchDetail.change"),
                            }}
                            headerClick={() => setDialogOpen(true)}>
                            <Row
                                title={t("branchDetail.id")}
                                value={branch ? branch.id : t("common.not_defined")}
                            />
                            <Row
                                title={t("branchDetail.name")}
                                value={branch ? branch.name : t("common.not_defined")}
                            />
                            <Row
                                title={t("branchDetail.address")}
                                value={branch ? branch.address : t("common.not_defined")}
                            />
                            <Row
                                title={t("branchDetail.type")}
                                value={branch && branch.activityTypeDTO ? branch.activityTypeDTO.name : t("common.not_defined")}
                            />
                            <Row
                                title={t("branchDetail.company")}
                                value={branch ? `${branch.companyId}-${branch.companyName}` : t("common.not_defined")}
                            />
                            <Row
                                title={t("branchDetail.region")}
                                value={branch && branch.region ? branch.region.nameRu : t("common.not_defined")}
                            />
                            <Row
                                title={t("branchDetail.city")}
                                value={branch && branch.city? branch.city.nameRu : t("common.not_defined")}
                            />
                        </Detail>
                    </Paper>
                </Grid>
            </Grid>
            <TopTables/>
            <Dialog fullWidth open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                <DialogTitle>{t("branchDetail.delete_title")}</DialogTitle>
                <DialogContentText style={{padding: 20}}>{t("branchDetail.delete_text")}</DialogContentText>
                <DialogActions>
                    <Button variant='text' color='primary' onClick={() => {
                        setOpenDeleteDialog(false);
                        const goBack = function () {
                            dispatch(fetchBranchList());
                            props.history.goBack()
                        };
                        dispatch(removeBranch(branch, goBack));
                    }}>{t("common.yes")}</Button>
                    <Button variant='text' color='primary' onClick={() => {
                        setOpenDeleteDialog(false);
                    }}>{t("common.no")}</Button>
                </DialogActions>
            </Dialog>
        </Grid>
    )
}));

export default BranchDetail;
