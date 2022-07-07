import React, {useEffect, useState} from 'react';
import {
    Grid,
    TextField,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
    FormControl,
    InputLabel,
    Select,
    OutlinedInput,
    MenuItem,
    CircularProgress,
    DialogContentText,
    Table,
    TableHead,
    TableBody,
    TableCell,
    TableRow,
    IconButton
} from '@material-ui/core';
import { DeleteOutline } from '@material-ui/icons';
import {useDispatch, useSelector} from 'react-redux';


import ConfirmDialog from './components/confirm';
import PhoneTextField from '../../components/Textfields/phone';
import SelectBox from "../../components/Select";
import {
    createBranch,
    editBranch,
    fetchActivityTypeList,
    fetchBranchList, fetchCityListForRegionId,
    fetchRegionList,
    removeBranch
} from "./actions";

const AddBranch = () => {

    const [openDialog, setOpenDialog] = useState(false);
    const [activityType, setActivityType] = useState('');
    const [activityTypeError, setActivityTypeError] = useState('');
    const [branchName, setBranchName] = useState('');
    const [branchNameError, setBranchNameError] = useState('');
    const [region, setRegion] = useState('');
    const [regionError, setRegionError] = useState(false);
    const [city, setCity] = useState('');
    const [cityError, setCityError] = useState(false);
    const [address, setAddress] = useState('');
    const [addressError, setAddressError] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [phoneNumberError, setPhoneNumberError] = useState('');
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deletingBranch, setDeletingBranch] = useState(undefined);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [deleteConfirmCode, setDeleteConfirmCode] = useState('');
    const [deleteReason, setDeleteReason] = useState('');
    const [currentBranch, setCurrentBranch] = useState(undefined);

    const dispatch = useDispatch();

    const branchList = useSelector(state => state.get('config').branchList)
    const activityTypeList = useSelector(state => state.get('config').activityType);
    const regionList = useSelector(state => state.get('config').regionList);
    const cityList = useSelector(state => state.get('config').cityList);

    useEffect(() => {
        dispatch(fetchActivityTypeList())
        dispatch(fetchRegionList())
        dispatch(fetchBranchList())
    }, [])


    const addBranch = () => {
        if (!activityType) {
            setActivityTypeError('Выберите тип!');
            return
        }

        if (!branchName) {
            setBranchNameError('Введите название филиала');
            return
        }

        if (!region) {
            setRegionError(true);
            return
        }

        if (!city) {
            setCityError(true);
            return
        }

        if (!address) {
            setAddressError('Введите адрес филиала');
            return
        }
        if (!phoneNumber) {
            setPhoneNumberError('Введите номер телефона');
            return
        }
        if (currentBranch) {
            dispatch(editBranch({
                id: currentBranch.id,
                address,
                activityTypeDTO: {
                    id: activityType
                },
                region: {
                    id: region
                },
                city: {
                    id: city
                },
                phone: phoneNumber,
                name: branchName
            }))

        } else {
            dispatch(createBranch({
                address,
                activityTypeDTO: {
                    id: activityType
                },
                region: {
                    id: region
                },
                city: {
                    id: city
                },
                phone: phoneNumber,
                name: branchName
            }))
        }

        setOpenDialog(false);
        setActivityType('');
        setActivityTypeError('');
        setBranchName('');
        setBranchNameError('');
        setRegion('');
        setRegionError('');
        setCity('');
        setCityError(false);
        setAddress('');
        setAddressError('');
        setPhoneNumber('');
        setPhoneNumberError('');
        setCurrentBranch(undefined);
    }

    return (
        <Grid container>
            <Grid container justify='flex-end'>
                <Grid item>
                    <Button
                        variant='text'
                        color='primary'
                        onClick={() => {
                            setOpenDialog(true)
                        }}>+Добавить филиал</Button>
                </Grid>
            </Grid>

            <div>
                <Table style={{width: '100%'}}>
                    <TableHead>
                        <TableCell>№</TableCell>
                        <TableCell>Наименование</TableCell>
                        <TableCell>Область</TableCell>
                        <TableCell>Город</TableCell>
                        <TableCell>Адрес</TableCell>
                        <TableCell>Операции</TableCell>
                    </TableHead>
                    <TableBody>
                        {
                            branchList && branchList.map((item, index) => {
                                return (
                                    <TableRow>
                                        <TableCell style={{width: 15}}>{index+1}</TableCell>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>{item.region ? item.region.nameRu : '-'}</TableCell>
                                        <TableCell>{item.city ? item.city.nameRu : '-'}</TableCell>
                                        <TableCell>{item.address ? item.address : '-'}</TableCell>
                                        <TableCell>
                                            <Grid container direction='row' style={{width: 100, display: item.mainBranch === true ? 'none' : ''}}>
                                                <IconButton
                                                    style={{width: 45, height: 45}}
                                                    onClick={() => {
                                                        setDeletingBranch(item);
                                                        setOpenDeleteDialog(true);
                                                    }}
                                                >
                                                    <DeleteOutline />
                                                </IconButton>
                                            </Grid>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        }
                    </TableBody>
                </Table>
            </div>
            <Grid container style={{marginTop: 20}} justify="center" alignItems="center">
                <Grid item><CircularProgress variant='indeterminate'/></Grid>
                <Grid item style={{paddingLeft: 10}}>
                    <Typography variant='overline' style={{fontSize: 16, marginRight: 12}}> Загрузка...</Typography>
                </Grid>
            </Grid>

            <ConfirmDialog
                title='Подтвердите удаления'
                open={confirmDialogOpen}
                onCodeChange={event => {
                    setDeleteConfirmCode(event.target.value)
                }}
                onReasonChange={event => {
                    setDeleteReason(event.target.value);
                }}
                confirm={() => {
                    dispatch(removeBranch({...deletingBranch,
                        confirmationCode: deleteConfirmCode,
                        reasonForDeletion: deleteReason
                    }))
                    setConfirmDialogOpen(false);
                }}
                cancel={() => {
                    setConfirmDialogOpen(false);
                    setDeletingBranch(undefined);
                }}
            />
            <Dialog fullWidth open={openDeleteDialog} onClose={() => {}}>
                <DialogTitle>Удаление</DialogTitle>
                <DialogContentText style={{padding: 20}}>Вы действительно хотите удалить филиал?</DialogContentText>
                <DialogActions>
                    <Button variant='text' color='primary' onClick={() => {
                        dispatch(removeBranch(deletingBranch))
                        setOpenDeleteDialog(false);
                        setConfirmDialogOpen(true);

                    }}>Да</Button>
                    <Button variant='text' color='primary' onClick={() => {
                        setOpenDeleteDialog(false);
                        setDeletingBranch(undefined);

                    }}>Нет</Button>
                </DialogActions>
            </Dialog>

            <Dialog fullWidth open={this.state.openDialog} onClose={() => {
                setOpenDialog(false);
                setActivityType('');
                setActivityTypeError('');
                setBranchName('');
                setBranchNameError('');
                setRegion('');
                setRegionError('');
                setCity('');
                setCityError(false);
                setAddress('');
                setAddressError('');
                setPhoneNumber('');
                setPhoneNumberError('');
                setCurrentBranch(undefined);
            }}>
                <DialogTitle>Добавить/Редактировать Филиал</DialogTitle>
                <DialogContent>
                    <Grid container justify='center' style={{marginTop: 30}}>
                        <Grid item xs={10}>
                            <SelectBox
                                data={activityTypeList}
                                itemKey='id'
                                itemValue='name'
                                error={activityTypeError !== ''}
                                helperText={activityTypeError}
                                value={activityType}
                                onChange={event => {
                                    setActivityType(event.target.value);
                                    setActivityTypeError('');
                                }}
                            />
                        </Grid>
                    </Grid>
                    <Grid container justify='center' style={{marginTop: 20}}>
                        <Grid item xs={10}>
                            <TextField
                                variant='outlined'
                                label='Название филиала'
                                fullWidth
                                value={branchName}
                                error={branchNameError !== ''}
                                helperText={branchNameError}
                                onChange={event => {
                                    setBranchName(event.target.value);
                                    setBranchNameError('');
                                }}
                            />
                        </Grid>
                    </Grid>
                    <Grid container justify='center' style={{marginTop: 30}}>
                        <Grid item xs={10}>
                            <Typography
                                variant='h4'
                                fullWidth
                                style={{fontSize: 16}}
                            > Дополнительная информация </Typography>
                        </Grid>
                    </Grid>
                    <Grid container justify='center' style={{marginTop: 20}}>
                        <Grid item xs={10}>
                            <Grid container direction='row'>
                                <Grid item xs={5}>
                                    <FormControl fullWidth variant='outlined' error={this.state.regionError}>
                                        <InputLabel> Область </InputLabel>
                                        <Select
                                            disabled={regionList.length === 0}
                                            onChange={event => {
                                                setRegion(event.target.value);
                                                setRegionError(false);
                                                dispatch(fetchCityListForRegionId(event.target.value));

                                            }}
                                            value={region}
                                            input={<OutlinedInput labelWidth={180} />}>
                                            {
                                                regionList.map((item, index) => {
                                                    return (
                                                        <MenuItem key={index} value={item.id}>
                                                            {item.nameRu}
                                                        </MenuItem>
                                                    )
                                                })
                                            }
                                        </Select>
                                    </FormControl>

                                </Grid>
                                <Grid item xs={1}/>
                                <Grid item xs={6}>
                                    <FormControl fullWidth variant='outlined' error={cityError}>
                                        <InputLabel> Город/Район </InputLabel>
                                        <Select
                                            disabled={cityList.length === 0}
                                            onChange={event => {
                                                setCity(event.target.value);
                                                setCityError(false);
                                            }}
                                            value={currentBranch ? (currentBranch.city ? currentBranch.city.id : undefined) : city}
                                            input={<OutlinedInput labelWidth={180} />}>
                                            {
                                                cityList.map((item, index) => {
                                                    return (
                                                        <MenuItem key={index} value={item.id}>
                                                            {item.nameRu}
                                                        </MenuItem>
                                                    )
                                                })
                                            }
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid container justify='center' style={{marginTop: 20}}>
                        <Grid item xs={10}>
                            <TextField
                                variant='outlined'
                                label='Адрес филиала'
                                fullWidth
                                value={address}
                                onChange={event => {
                                    setAddress(event.target.value);
                                    setAddressError('');

                                }}
                                error={addressError !== ''}
                                helperText={addressError}
                            />
                        </Grid>
                    </Grid>
                    <Grid container justify='center' style={{marginTop: 20, marginBottom: 30}}>
                        <Grid item xs={10}>
                            <PhoneTextField
                                value={phoneNumber}
                                onPhoneChange={
                                    (isValid, phoneNumber) => {
                                        setPhoneNumber(phoneNumber);
                                        setPhoneNumberError('');
                                    }
                                }
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button variant='text' color='primary' onClick={() => {
                        setOpenDialog(false);
                        setActivityType('');
                        setActivityTypeError('');
                        setBranchName('');
                        setBranchNameError('');
                        setRegion('');
                        setRegionError('');
                        setCity('');
                        setCityError(false);
                        setAddress('');
                        setAddressError('');
                        setPhoneNumber('');
                        setPhoneNumberError('');
                        setCurrentBranch(undefined);
                    }}>CANCEL</Button>
                    <Button variant='text' color='primary' onClick={addBranch}>OK</Button>
                </DialogActions>
            </Dialog>
        </Grid>
    )
}


export default AddBranch;
