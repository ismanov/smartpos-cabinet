import React, {useState} from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    FormControl,
    InputLabel,
    Select,
    OutlinedInput,
    MenuItem
 } from '@material-ui/core';
import { KeyboardArrowRightOutlined } from '@material-ui/icons';
import {connect, useDispatch, useSelector} from 'react-redux';
import { KeyboardDatePicker } from '@material-ui/pickers';
import moment from 'moment'
import {fetchBranchList} from "../../branches/actions";
import {fetchPositionList, updateEmployee} from "../actions";

const EmployeeChangeDialog = (props) => {

    const [reason, setReason] = useState(undefined)
    const [branchId, setBranchId] = useState(undefined)
    const [position, setPosition] = useState([])
    const [salary, setSalary] = useState(undefined)
    const [probation, setProbation] = useState(undefined)
    const [dismissalDate, setDismissalDate] = useState(undefined)

    const positionList = useSelector(state => state.get('employee').positionList);
    const isLoading = useSelector(state => state.get('employee').isLoading);
    const branchList = useSelector(state => state.get("dashboard").commonBranchList);

    const dispatch = useDispatch();

    React.useEffect(() => {
        if (branchList && branchList.length === 0) {
            dispatch(fetchBranchList({page: 0, size: 100000}))
        }
    }, [])

    if (!props.type) return false;

    let content = undefined;
    let title = undefined;
    const onClose = () => {
        setReason(undefined);
        setBranchId(undefined);
        props.onClose()
    };

    switch(props.type) {
        case employeeDialogTypes.branch:
            if (!branchId && props.employee) {
                setBranchId(props.employee.branchId)
            }
            title = 'Смена филиала'

            content = (
                <Grid container direction='row'>
                    <Grid item xs={5}>
                        <TextField
                            disabled={true}
                            variant='outlined'
                            value={props.employee && props.employee.fullName ? `${props.employee.fullName.lastName} ${props.employee.fullName.firstName}` : "-"}
                            label='Сотрудник'
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={1}>
                        <Grid container justify='center' alignItems='center'>
                            <Grid item style={{paddingTop: 15}}>
                                <KeyboardArrowRightOutlined
                                    style={{color: '#009f3c'}}
                                />
                            </Grid>

                        </Grid>
                    </Grid>
                    <Grid item xs={6} style={{paddingLeft: 10}}>
                        <FormControl fullWidth variant='outlined'>
                            <InputLabel> Новый Филиал </InputLabel>
                                <Select
                                    onChange={event => setBranchId(event.target.value)}
                                    value={branchId}
                                    disabled={branchList.length === 0}
                                    input={<OutlinedInput labelWidth={90} />}>
                                        {branchList && branchList.filter(b => b.id !== -1).map((item, index) => {
                                            return (
                                                <MenuItem key={index} value={item.id}>
                                                    {item.name}
                                                </MenuItem>
                                            )
                                        })}
                                </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            )
            break
        case employeeDialogTypes.position:
            if (positionList &&  positionList.length === 0) {
                dispatch(fetchPositionList())
            }
            if (!position || position.length === 0) {
                setPosition(props.employee ? props.employee.authorities : [])
            }
            title = 'Смена должности';
            content = (
                <Grid container direction='row'>
                    <Grid item xs={5}>
                        <TextField
                            disabled={true}
                            variant='outlined'
                            value={`${props.employee.fullName.lastName} ${props.employee.fullName.firstName}`}
                            label='Сотрудник'
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={1}>
                        <Grid container justify='center' alignItems='center'>
                            <Grid item style={{paddingTop: 15}}>
                                <KeyboardArrowRightOutlined
                                    style={{color: '#009f3c'}}
                                />
                            </Grid>

                        </Grid>
                    </Grid>
                    <Grid item xs={6} style={{paddingLeft: 10}}>
                        <FormControl fullWidth variant='outlined'>
                            <InputLabel> Новая должность </InputLabel>
                                <Select
                                    onChange={event => {
                                        setPosition([event.target.value])
                                    }}
                                    value={position && position.length > 0 ? position[0] : undefined }
                                    disabled={positionList.length === 0}
                                    input={<OutlinedInput labelWidth={90} />}>
                                        {positionList.map((item, index) => {
                                            return (
                                                <MenuItem key={index} value={item.roleCode}>
                                                    {item.nameRu}
                                                </MenuItem>
                                            )
                                        })}
                                </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            )
            break
        case employeeDialogTypes.motivation:
            content = false
            break
        case employeeDialogTypes.probation:
            if (!probation && props.employee.probationEnd) {
                setProbation(props.employee.probationEnd)
            }
            title = 'Продление испытательного срока'
            content = (
                <Grid container direction='row'>
                    <Grid item xs={5}>
                        <TextField
                            disabled={true}
                            variant='outlined'
                            value={`${props.employee.fullName.lastName} ${props.employee.fullName.firstName}`}
                            label='Сотрудник'
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={1}>
                        <Grid container justify='center' alignItems='center'>
                            <Grid item style={{paddingTop: 15}}>
                                <KeyboardArrowRightOutlined
                                    style={{color: '#009f3c'}}
                                />
                            </Grid>

                        </Grid>
                    </Grid>

                    <Grid item xs={6} style={{paddingLeft: 10}}>
                        <KeyboardDatePicker
                            variant='dialog'
                            fullWidth
                            value={probation}
                            onChange={(date, value) => setProbation(moment(date).format('YYYY-MM-DD'))}
                            TextFieldComponent={props =>
                                <TextField
                                    {...props}
                                    fullWidth
                                    variant='outlined'
                                    label='Новый испытательный срок до'
                                />
                            }
                        />
                    </Grid>
                </Grid>

            );
            break;
        case employeeDialogTypes.dismiss:
            title = 'Уволить сотрудника';
            content = (
                <Grid container direction='row'>
                    <Grid item xs={12}>
                        <KeyboardDatePicker
                            variant='dialog'
                            fullWidth
                            value={dismissalDate}
                            onChange={(date, value) => setDismissalDate(moment(date).format('YYYY-MM-DD'))}
                            TextFieldComponent={props =>
                                <TextField
                                    {...props}
                                    fullWidth
                                    variant='outlined'
                                    label='Дата увольнения'
                                />
                            }
                        />
                    </Grid>
                </Grid>
            )
            break
        case employeeDialogTypes.salary:
            if (!salary) {
                props.employee && props.employee.salary ? setSalary(String(props.employee.salary)) : setSalary('0')
            }

            title = 'Установить З/П'
            content = (
                <Grid container direction='row'>
                    <Grid item xs={5}>
                        <TextField
                            disabled={true}
                            variant='outlined'
                            value={`${props.employee.fullName.lastName} ${props.employee.fullName.firstName}`}
                            label='Сотрудник'
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={1}>
                        <Grid container justify='center' alignItems='center'>
                            <Grid item style={{paddingTop: 15}}>
                                <KeyboardArrowRightOutlined
                                    style={{color: '#009f3c'}}
                                />
                            </Grid>

                        </Grid>
                    </Grid>

                    <Grid item xs={6} style={{paddingLeft: 10}}>
                        <TextField
                            variant='outlined'
                            value={salary}
                            label='З/П, сум'
                            fullWidth
                            type='number'
                            onChange={event => {
                                let value = String(event.target.value)
                                if (value.length > 1 && value.startsWith('0') && !value.startsWith('0.') && !value.startsWith('0,')) {
                                    setSalary(value.substring(1))
                                } else {
                                    setSalary(value)
                                }
                            }}
                        />
                    </Grid>
                </Grid>
            )
            break
        default:
            break
    }
    return (
        <Dialog
            onClose={onClose}
            fullWidth
            {...props}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <Grid container justify='center'>
                    {content}
                </Grid>
                <Grid container justify='center' style={{marginTop: 20}}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            variant='outlined'
                            label='Укажите причину'
                            multiline={true}
                            rows={6}
                            onChange={event => setReason(event.target.value)}
                            />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button variant='text' onClick={onClose} disabled={isLoading === true} color='primary'>Отмена</Button>
                <Button variant='text' color={props.type === employeeDialogTypes.dismiss ? 'secondary' : 'primary'} disabled={isLoading === true} onClick={() => {
                    const temp = {...props.employee};
                    switch(props.type) {
                        case employeeDialogTypes.branch:
                            temp.branchId = branchId;
                            break;
                        case employeeDialogTypes.position:
                            temp.authorities = position;
                            break;
                        case employeeDialogTypes.salary:
                            temp.salary = salary;
                            break;
                        case employeeDialogTypes.probation:
                            if (probation) {
                                temp.fullTime = false;
                                temp.probationEnd = probation
                            } else {
                                props.onClose();
                                return
                            }
                            break;
                        case employeeDialogTypes.dismiss:
                            temp.dismissalDate = dismissalDate || moment().format('YYYY-MM-DD');
                            temp.dismissalReason = reason;
                            temp.dismissed = true;
                            break;
                        default:
                            break
                    }
                    dispatch(updateEmployee(temp, props));

                }}>{props.type === employeeDialogTypes.dismiss ? 'Уволить' : 'Сохранить'}</Button>
            </DialogActions>
        </Dialog>
    )
};

const employeeDialogTypes = Object.freeze({
    branch: 'branch',
    position: 'position',
    motivation: 'motivation',
    probation: 'probation',
    dismiss: 'dismiss',
    salary: 'salary'
});

export default EmployeeChangeDialog;
