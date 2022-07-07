import React, {useState, useEffect} from 'react';
import {Grid, Button, Typography, Paper, makeStyles} from '@material-ui/core';
import {useDispatch, useSelector} from 'react-redux';
import Table from '../../../components/Table/index';
import Pagination from '../../../components/Pagination/Pagination';
import {fetchEmployeeList} from '../actions';
import EmployeeAddEditDialog from '../components/AddEditDialog';
import withNotification from '#hocs/withNotification/WithNotification';
import {getRoleName} from "../../../enums/roles";
import {formatPhoneNumber} from "../../../../utils/format";
import AddIcon from '@material-ui/icons/Add';
import Tooltip from '@material-ui/core/Tooltip';
import {useTranslation} from "react-i18next";
import {setRole, setSort} from "../actions";
import { withRouter } from 'react-router-dom';

const useStyles = makeStyles(() => ({
    container: {
        display: 'block',
        height: '100%',
        color: '#555'
    },
    title: {
        marginTop: 20,
        lineHeight: 20,
        padding: '10px 0'
    },
    filterContainer: {
        display: 'flex',
        flexFlow: 'row'
    },
    roleContainer: {
        display: 'flex',
        flexFlow: 'row',
        height: 30
    },
    tableContent: {
        height: 'calc(100vh - 380px)',
        overflow: 'auto'
    }
}))

const EmployeeList = withNotification(props => {

    const dispatch = useDispatch();
    const [dialogOpen, setDialogOpen] = useState(false);    
    const { t } = useTranslation();
    const currentBranch = useSelector(state => state.get('dashboard').currentBranch);
    const isLoading = useSelector(state => state.get("employee").isListLoading);
    const employeeList = useSelector(state => state.get("employee").list);
    const totalPages = useSelector(state => state.get("employee").total);
    const totalElements = useSelector(state => state.get("employee").totalElements);
    const role = useSelector(state => state.get("employee").role);
    const page = useSelector(state => state.get("employee").page);
    const size = useSelector(state => state.get("employee").size);
    const sort = useSelector(state => state.get("employee").sort);

    const classes = useStyles();

    useEffect(() => {
        dispatch(
            fetchEmployeeList(page, size, role, currentBranch, sort)
        )
    }, [currentBranch, role, sort]);

    return (
        <div className={classes.container}>
            <div className={classes.title}>
                <Typography variant='h4' style={{fontSize: 18, fontWeight: 'bold'}}> {t("employees.title")} </Typography>
            </div>
            <div className={classes.filterContainer} style={{marginTop: 10}}>
                <div style={{flexGrow: 2}}/>
                <div style={{paddingLeft: 10}}>
                    <Tooltip title={t("employees.add")} placement={'bottom'} arrow>
                        <Button
                            color='primary'
                            variant='outlined'
                            onClick={() => setDialogOpen(true)}
                            style={{ height: 56 }}
                        >
                            <AddIcon/>
                        </Button>
                    </Tooltip>
                </div>
            </div>
            <div style={{marginTop: 15}}>
                <div style={{color: '#555', fontWeight: 'bold'}}> {t("employees.total")}: {totalElements}</div>
            </div>
            <div className={classes.roleContainer} style={{marginTop: 10}}>
                {
                    [
                        {name: t("employees.all"), value: 'ALL'},
                        {name: t("employees.admins"), value: 'ROLE_BRANCH_ADMIN'},
                        {name: t("employees.cashiers"), value: 'ROLE_CASHIER'},
                        {name: t("employees.interns"), value: 'ROLE_INTERN'},
                        {name: t("employees.dismissed"), value: 'DISMISSED'},
                    ].map((item, index) => {
                        return (
                            <Grid item key={index}>
                                <Grid container direction='row' alignItems='center' justify='center'>
                                    <Button
                                        onClick={() => {
                                            dispatch(setRole(item.value));
                                        }}
                                        color={item.value === role ? 'primary' : 'default'}
                                        style={{fontSize: 13}}>
                                        {item.name}
                                    </Button>
                                    {index !== 3 ? <span style={{
                                        height: '10px',
                                        width: '1px',
                                        backgroundColor: '#009F3C33',
                                        margin: '0px 4px'
                                    }}/> : undefined}
                                </Grid>
                            </Grid>
                        )
                    })
                }
            </div>
            <Paper style={{width: '100%', marginTop: 10}}>
                <div className={classes.tableContent} style={{}}>
                    <Table
                        headers={[
                            {
                                content: t("employees.abbr"),
                                sort: true,
                                key: 'fullName',
                                render: (row) => `${row.fullName.lastName}  ${row.fullName.firstName} ${row.fullName.patronymic || ''}`
                            },
                            {
                                content: t("employees.branch"),
                                sort: true,
                                key: 'branchName'
                            },
                            {
                                content: t("employees.position"),
                                sort: false,
                                key: 'authorities',
                                render: (row) => row.authorities && row.authorities.map(a => getRoleName(a)).join(', ')
                            },
                            {
                                content: t("employees.phone"),
                                sort: true,
                                key: 'login',
                                render: (row) => formatPhoneNumber(row.login)
                            }
                        ]}
                        data={employeeList}
                        onItemClick={row => {
                            props.history.push(`/main/employees/${row.id}`)
                        }}
                        isLoading={isLoading}
                        order={true}
                        page={page}
                        size={size}
                        onSort={(i, t) => { dispatch(setSort({ col: i, order: t })) }}
                        sort={sort}
                    />
                </div>
            </Paper>
            <Grid container style={{marginTop: 10, marginBottom: 10, paddingLeft: 15}}>
                <Grid item>
                    <Pagination
                        disabled={isLoading}
                        onPageChange={page => {
                            dispatch(fetchEmployeeList(page, size, role, currentBranch, sort));
                        }}
                        pagesCount={totalPages}
                        current={page}
                        size={size}
                        onSizeChange={(size) => {
                            dispatch(fetchEmployeeList(page, size, role, currentBranch, sort));
                        }}
                    />
                </Grid>
            </Grid>
            <EmployeeAddEditDialog
                open={dialogOpen}
                onClose={update => {
                    setDialogOpen(false);
                    if (update === true) {
                        props.success(t("common.success_added"));
                        dispatch(fetchEmployeeList(page, size, role, currentBranch, sort));
                    }
                }}
            />
        </div>
    )
});

export default withRouter(EmployeeList);
