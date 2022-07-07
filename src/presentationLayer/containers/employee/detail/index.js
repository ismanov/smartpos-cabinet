import React from 'react';
import {
    Grid,
    Button,
    IconButton,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@material-ui/core';

import {ArrowBackIos} from '@material-ui/icons';
import {Row, PairRow} from '../../../components/containers/detailpage/DetailSection';
import EmployeeAddEditDialog from '../components/AddEditDialog'
import {useDispatch, useSelector} from 'react-redux';
import {dismissEmployee, fetchEmployeeById, fetchEmployeeStats} from '../actions';
import withNotification from '../../../hocs/withNotification/WithNotification';
import ChangeDialog from '../components/ChangeDialog';
import numeral from 'numeral';
import Detail from '../../../components/containers/detail';
import {withRouter} from 'react-router-dom';
import {getRoleName} from "../../../enums/roles";
import Card from '../../../components/material-components/components/Card/Card';
import CardHeader from '../../../components/material-components/components/Card/CardHeader';
import CardIcon from '../../../components/material-components/components/Card/CardIcon';
import {withStyles} from "@material-ui/core/styles";
import Balance from '@material-ui/icons/AccountBalance';
import Check from '@material-ui/icons/Ballot';
import Sales from '@material-ui/icons/AddShoppingCart';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import materialStyles
    from "../../../components/material-components/assets/jss/material-dashboard-react/views/dashboardStyle.js";
import RemoveIcon from '@material-ui/icons/Delete';
import Tooltip from '@material-ui/core/Tooltip';
import {useTranslation} from "react-i18next";
import moment from 'moment';

const EmployeeDetail = props => {

    const dispatch = useDispatch();
    const { t } = useTranslation();
    const employee = useSelector(state => state.get("employee").employee);
    const employeeStats = useSelector(state => state.get("employee").stats);

    const [dismissDialog, setDismissDialog] = React.useState(false);
    const [changeDialogOpen, setChangeDialogOpen] = React.useState(false);
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [type, setType] = React.useState('');

    const { classes } = props;

    React.useEffect(() => {
        const {employeeId} = props.match.params;
        dispatch(fetchEmployeeById(employeeId))
    }, [props.match]);

    return (
        <Grid container justify='center'>
            <Dialog open={dismissDialog}>
                <DialogTitle> {t("employeeDetail.delete_title")} </DialogTitle>
                <DialogContent> {t("employeeDetail.delete_text")} </DialogContent>
                <DialogActions>
                    <Button color='primary' onClick={() => {
                        setDismissDialog(false);
                    }}> {t("common.no")} </Button>
                    <Button color="secondary" onClick={() => {
                        const {employeeId} = props.match.params;
                        dispatch(dismissEmployee(employeeId, props));
                    }}> {t("employeeDetail.dismiss")} </Button>
                </DialogActions>
            </Dialog>
            <ChangeDialog
                type={type}
                open={changeDialogOpen}
                branchId={employee ? employee.branchId : null}
                onClose={success => {

                    if (success === true) {
                        const {employeeId} = props.match.params;
                        dispatch(fetchEmployeeById(employeeId));
                        dispatch(fetchEmployeeStats(employeeId));
                        props.success(t("common.success_changed"));

                    }
                    setChangeDialogOpen(false);

                }}
                employee={employee}
            />
            <EmployeeAddEditDialog
                open={dialogOpen}
                onClose={() => {
                    setDialogOpen(false);
                    const {employeeId} = props.match.params;
                    dispatch(fetchEmployeeById(employeeId));
                    dispatch(fetchEmployeeStats(employeeId));
                }}
                currentEmployee={employee}
            />
            <div style={{
                fontSize: 22,
                fontWeight: 'bold',
                marginTop: 20,
                display: 'flex',
                justifyContent: 'flex-start',
                flexFlow: 'row',
                width: '100%',
                alignItems: 'center'
            }}>
                <div>
                    <IconButton
                        color='primary'
                        style={{textAlign: 'center'}}
                        onClick={props.history.goBack}
                    >
                        <ArrowBackIos/>
                    </IconButton>
                </div>
                <div style={{flexGrow: 1}}>
                    {t("employeeDetail.title")}
                </div>
                <Tooltip title={t("employeeDetail.dismiss")} arrow placement={'bottom'}>
                    <Button
                        color='secondary'
                        variant="outlined"
                        disabled={
                            employee && employee.dismissed === true ||
                            employee && employee.authorities.indexOf('ROLE_OWNER') >= 0
                        }
                        onClick={() => { setDismissDialog(true) }}
                        style={{marginRight: 15}}
                    ><RemoveIcon/></Button>
                </Tooltip>
            </div>
            <Grid container style={{padding: 15, marginTop: 10}}>
                <Grid container direction='row' spacing={3}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardHeader color="primary" stats icon>
                                <CardIcon color="primary">
                                    <HourglassEmptyIcon/>
                                </CardIcon>
                                <p className={classes.cardCategory}>{t("employeeDetail.duration")}</p>
                                <h3 className={classes.cardTitle}>
                                    {employeeStats && employeeStats.firstDayAtWork ? moment(employeeStats.firstDayAtWork).format("DD MMM, YYYY") : t("common.not_defined")}
                                </h3>
                            </CardHeader>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardHeader color="primary" stats icon>
                                <CardIcon color="primary">
                                    <Sales/>
                                </CardIcon>
                                <p className={classes.cardCategory}>{t("employeeDetail.salesCount")}</p>
                                <h3 className={classes.cardTitle}>
                                    {employeeStats && numeral(employeeStats.salesCount || 0).format('0,0')}
                                </h3>
                            </CardHeader>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardHeader color="primary" stats icon>
                                <CardIcon color="primary">
                                    <Check/>
                                </CardIcon>
                                <p className={classes.cardCategory}>{t("employeeDetail.averageCheques")}</p>
                                <h3 className={classes.cardTitle}>
                                    {employeeStats && numeral(employeeStats.averageReceiptCost || 0).format('0,0')}
                                </h3>
                            </CardHeader>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardHeader color="primary" stats icon>
                                <CardIcon color="primary">
                                    <Balance/>
                                </CardIcon>
                                <p className={classes.cardCategory}>{t("employeeDetail.salesTotal")}</p>
                                <h3 className={classes.cardTitle}>
                                    {employeeStats && numeral(employeeStats.salesTotal || 0).format('0,0')}
                                </h3>
                            </CardHeader>
                        </Card>
                    </Grid>
                </Grid>
            </Grid>

            <Grid container style={{marginTop: 15}}>
                <Grid item xs={12} md={6}>
                    <Paper style={{padding: 10}}>
                        <Detail
                            header={{
                                title: t("employeeDetail.data"),
                                buttonTitle: t("employeeDetail.change")
                            }}
                            headerClick={() => { setDialogOpen(true) }}>
                            <Row
                                title={t("employeeDetail.lastName")}
                                value={employee ? employee.fullName.lastName : t("common.not_defined")}
                            />
                            <Row
                                title={t("employeeDetail.firstName")}
                                value={employee ? employee.fullName.firstName : t("common.not_defined")}
                            />
                            <Row
                                title={t("employeeDetail.middleName")}
                                value={employee && employee.fullName.patronymic ? employee.fullName.patronymic: t("common.not_defined")}
                            />
                            <Row
                                title={t("employeeDetail.phone")}
                                value={employee && employee.login ? employee.login : t("common.not_defined")}
                            />
                            {
                                employee && employee.authorities.indexOf('ROLE_OWNER') >= 0 ? (
                                    <Row
                                        title={t("employeeDetail.branch")}
                                        value={employee ? employee.branchName : t("common.not_defined")}
                                    />
                                ) : (
                                    <PairRow
                                        title={t("employeeDetail.branch")}
                                        value={employee ? employee.branchName : t("common.not_defined")}
                                        actionTitle={t("employeeDetail.change_branch")}
                                        rowAction={() => {
                                            setType('branch');
                                            setChangeDialogOpen(true);
                                        }}
                                    />
                                )
                            }
                            {
                                employee && employee.authorities.indexOf('ROLE_OWNER') >= 0 ? (
                                    <Row
                                        title={t("employeeDetail.position")}
                                        value={employee && (employee.authorities || []).length ? getRoleName(employee.authorities[0]) : t("common.not_defined")}
                                    />
                                ) : (
                                    <PairRow
                                        title={t("employeeDetail.position")}
                                        value={employee && employee.authorities && employee.authorities.length > 0 ? getRoleName(employee.authorities[0]) : t("common.not_defined")}
                                        actionTitle={t("employeeDetail.change_pos")}
                                        rowAction={() => {
                                            setType('position');
                                            setChangeDialogOpen(true);
                                        }}
                                    />
                                )
                            }

                        </Detail>
                    </Paper>
                </Grid>

            </Grid>
        </Grid>
    )
};

export default withStyles(materialStyles)((withRouter(withNotification(EmployeeDetail))));
