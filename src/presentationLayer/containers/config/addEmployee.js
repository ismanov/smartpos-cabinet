import React, {useEffect, useState} from 'react';
import {
    Grid,
    TextField,
    Typography,
    FormControl,
    InputLabel,
    Select,
    OutlinedInput,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    List,
    Button,
    Divider
} from '@material-ui/core';
import {useDispatch, useSelector} from 'react-redux';
import EditableListItem from './components/EditableListItem';
import PhoneTextField from '../../components/Textfields/phone';
import ErrorText from '../../components/sptext/error';

import {getRoleName} from "../../enums/roles";
import {createEmployee, fetchBranchList, fetchPositionList, fetchUserList, updateEmployee} from "./actions";

const AddEmployee = () => {

    const [position, setPosition] = useState('');
    const [positionError, setPositionError] = useState('');
    const [firstName, setFirstName] = useState('');
    const [firstNameError, setFirstNameError] = useState('');
    const [lastName, setLastName] = useState('');
    const [lastNameError, setLastNameError] = useState('');
    const [patronymicName, setPatronymicName] = useState('');
    const [patronymicNameError, setPatronymicNameError] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [phoneNumberError, setPhoneNumberError] = useState('');
    const [mainDialogOpen, setMainDialogOpen] = useState(false);
    const [currentEmployee, setCurrentEmployee] = useState();
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
    const [deletingEmployee, setDeletingEmployee] = useState();
    const [branchId, setBranchId] = useState();
    const [branchIdError, setBranchIdError] = useState(false);

    const userList = useSelector(state => state.get('config').employeeList);
    const isLoading = useSelector(state => state.get('config').isLoading);
    const errorText = useSelector(state => state.get('config').errorText);
    const branchList = useSelector(state => state.get('config').branchList);
    const positionList = useSelector(state => state.get('config').positionList);

    const dispatch = useDispatch();

    const verify = () => {
        if (!lastName) {
            setLastNameError('Введите Фамилию')
            return
        }

        if (!firstName) {
            setFirstNameError('Введите Имя')
            return
        }

        if (!branchId) {
            setBranchIdError(true)
            return
        }

        if (!position) {
            setPositionError(true);
            return
        }
        if (!phoneNumber || phoneNumber.indexOf('*') >= 0) {
            setPhoneNumberError('Неправильный номер телефона!');
            return
        }

        let pn

        if (phoneNumber.indexOf('+') >= 0)
            pn = `${u.substring(2, 5)}${u.substring(7, 9)}${u.substring(10, 13)}${u.substring(14, 16)}${u.substring(17, 20)}`
        else
            pn = phoneNumber

        if (currentEmployee) {

            dispatch(updateEmployee({
                id: currentEmployee.id,
                branchId,
                fullName: {
                    firstName,
                    lastName,
                    patronymic: patronymicName
                },
                authorities: position,
                login: pn,
                fullTime: true
            }))
        } else  {
            dispatch(createEmployee({
                branchId,
                fullName: {
                    firstName,
                    lastName,
                    patronymic: patronymicName
                },
                authorities: position,
                login: pn,
                fullTime: true
            }))
        }
        setMainDialogOpen(false);
        setCurrentEmployee(undefined);
        setPosition('');
        setPositionError(false);
        setFirstName('');
        setFirstNameError('');
        setLastName('');
        setLastNameError('');
        setPatronymicName('');
        setPatronymicNameError('');
        setPhoneNumber('');
        setPhoneNumberError('');
        setBranchId(undefined);
        setBranchIdError(false);
        setRemoveDialogOpen(false);

    }

    useEffect(() => {
        dispatch(fetchPositionList());
        dispatch(fetchUserList());
        dispatch(fetchBranchList());
    }, [])



    return (
        <Grid container>
            <Grid container style={{marginTop: 20}}>
                <Grid item>
                    <Typography
                        variant='h1'
                        align='center'
                        style={{fontSize: 18}}>Информация о сотруднике</Typography>
                </Grid>
            </Grid>
            <Grid container style={{marginTop: 20}} justify="flex-end">
                <Grid item>
                    <Button variant='text' color='primary' onClick={() => {
                        setMainDialogOpen(true);
                        setCurrentEmployee(undefined);
                    }}> +Добавить сотрудника </Button>
                </Grid>
            </Grid>
            <Grid container>
                <Grid xs={12}>
                    <List style={{width: '100%'}}>
                        {
                            userList.map((item, index) => {
                                return (
                                    <div key={index}>
                                        <EditableListItem
                                            value={1}
                                            disableRemove={item.authorities  && item.authorities.indexOf('ROLE_OWNER') >= 0}
                                            disableEdit={item.authorities  && item.authorities.indexOf('ROLE_OWNER') >= 0}
                                            onRemove={() => {
                                                setRemoveDialogOpen(true);
                                                setDeletingEmployee(item);
                                            }}
                                            style={{color: '#555'}}
                                            onEdit={() => {
                                                setFirstName(item.fullName.firstName);
                                                setLastName(item.fullName.lastName);
                                                setPatronymicName(item.fullName.patronymic);
                                                setCurrentEmployee(item);
                                                setPosition(item.authorities);
                                                setPhoneNumber(item.phone);
                                                setBranchId(item.branchId);
                                                setMainDialogOpen(true);
                                            }}>{`${item.fullName.lastName || ''} ${item.fullName.firstName || ''} ${item.fullName.patronymic || ''}`}</EditableListItem>
                                        <Divider light style={{marginTop: 4}}/>
                                    </div>
                                )
                            })
                        }
                    </List>
                </Grid>
            </Grid>            
            <div>

            </div>
            <Dialog fullWidth open={removeDialogOpen} onClose={() => {
                setPosition('');
                setPositionError(false);
                setFirstName('');
                setFirstNameError('');
                setLastName('');
                setLastNameError('');
                setPatronymicName('');
                setPatronymicNameError('');
                setPhoneNumber('');
                setPhoneNumberError('');
                setCurrentEmployee(undefined);
                setBranchId(undefined);
                setBranchIdError(false);
                setRemoveDialogOpen(false);
            }}>
                <DialogTitle>Удалить сотрудника</DialogTitle>
                <DialogContentText style={{padding: 15}}>Вы действительно хотите удалить сотрудника?</DialogContentText>
                <DialogActions>
                    <Button variant='text' color='primary' onClick={() => {
                        dispatch(updateEmployee(
                            {...deletingEmployee, dismissed: true, authorities: deletingEmployee.authorities}
                        ))
                        setRemoveDialogOpen(false);
                        setDeletingEmployee(undefined);

                    }}>Да</Button>
                    <Button  variant='text' color='primary' onClick={() => {
                        setRemoveDialogOpen(false);
                        setDeletingEmployee(undefined);

                    }}>Нет</Button>
                </DialogActions>
            </Dialog>
            <Dialog fullWidth open={mainDialogOpen} onClose={() => {
                setPosition('');
                setPositionError(false);
                setFirstName('');
                setFirstNameError('');
                setLastName('');
                setLastNameError('');
                setPatronymicName('');
                setPatronymicNameError('');
                setPhoneNumber('');
                setPhoneNumberError('');
                setCurrentEmployee(undefined);
                setBranchId(undefined);
                setBranchIdError(false);
                setRemoveDialogOpen(false);
            }}>
                <DialogTitle>Добавить/Редактировать сотрудника</DialogTitle>
                <DialogContent style={{padding: 15}}>
                    <Grid container justify='center' style={{marginTop: 30}}>
                        <Grid item xs={10}>
                            <ErrorText
                                text={errorText}
                            />
                        </Grid>
                    </Grid>
                    <Grid container justify='center' style={{marginTop: 20}}>
                        <Grid item xs={10}>
                            <TextField
                                variant='outlined'
                                fullWidth
                                label='Фамилия'
                                error={lastNameError !== ''}
                                value={lastName}
                                helperText={lastNameError}
                                onChange={event => {
                                    setLastName(event.target.value);
                                    setLastNameError('')
                                }}
                            />
                        </Grid>
                    </Grid>
                    <Grid container justify='center' style={{marginTop: 20}}>
                        <Grid item xs={10}>
                            <TextField
                                variant='outlined'
                                fullWidth
                                label='Имя'
                                value={firstName}
                                error={firstNameError !== ''}
                                helperText={firstNameError}
                                onChange={event =>  {
                                    setFirstName(event.target.value);
                                    setFirstNameError('');
                                }}
                            />
                        </Grid>
                    </Grid>
                    <Grid container justify='center' style={{marginTop: 20}}>
                        <Grid item xs={10}>
                            <TextField
                                variant='outlined'
                                fullWidth
                                label='Отчество'
                                value={patronymicName}
                                error={patronymicNameError !== ''}
                                helperText={patronymicNameError}
                                onChange={event => {
                                    setPatronymicName(event.target.value);
                                    setPatronymicNameError('');
                                }}
                            />
                        </Grid>
                    </Grid>
                    <Grid container justify='center' style={{marginTop: 20}}>
                        <Grid item xs={10}>
                            <FormControl fullWidth variant='outlined' error={positionError}>
                                <InputLabel> Филиал </InputLabel>
                                <Select
                                    onChange={event => {
                                        setBranchId(event.target.value);
                                        setBranchIdError(false);

                                    }}
                                    error={branchIdError}
                                    value={branchId}
                                    disabled={branchList.size === 0}
                                    input={<OutlinedInput labelWidth={90} />}>
                                    {branchList.map((item, index) => {
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
                    <Grid container justify='center' style={{marginTop: 20}}>
                        <Grid item xs={10}>
                            <FormControl fullWidth variant='outlined' error={positionError}>
                                <InputLabel> Должность </InputLabel>
                                <Select
                                    onChange={event => {
                                        setPosition([event.target.value])
                                        setPositionError('');
                                    }}
                                    value={position && position.length > 0 ? position[0] : undefined}
                                    disabled={positionList.size === 0}
                                    input={<OutlinedInput labelWidth={90} />}>
                                    {positionList.map((item, index) => {
                                        return (
                                            <MenuItem key={index} value={item}>
                                                {getRoleName(item)}
                                            </MenuItem>
                                        )
                                    })}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container justify='center' style={{marginTop: 20}}>
                        <Grid item xs={10}>
                            <PhoneTextField
                                value={phoneNumber}
                                onPhoneChange={(isValid, phoneNumber) =>
                                {
                                    setPhoneNumber(phoneNumber);
                                    setPhoneNumberError('');

                                }}
                            />
                        </Grid>
                    </Grid>                    

                </DialogContent>
                <DialogActions>
                    <Button color='primary' variant='text' onClick={verify}>OK</Button>
                    <Button color='primary' variant='text' onClick={() => {
                        setPosition('');
                        setPositionError(false);
                        setFirstName('');
                        setFirstNameError('');
                        setLastName('');
                        setLastNameError('');
                        setPatronymicName('');
                        setPatronymicNameError('');
                        setPhoneNumber('');
                        setPhoneNumberError('');
                        setCurrentEmployee(undefined);
                        setBranchId(undefined);
                        setBranchIdError(false);
                        setRemoveDialogOpen(false);

                    }}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </Grid>

    )
}

export default AddEmployee;
