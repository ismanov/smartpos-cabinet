import React, {useEffect, useRef, useState} from 'react';
import { Typography,
    TextField, FormControl, InputLabel, Select,
    MenuItem, OutlinedInput, CircularProgress,
    Grid
} from '@material-ui/core';
import {useDispatch, useSelector} from 'react-redux';
import PhoneTextField from '#components/Textfields/phone';
import SelectBox from "#components/Select";
import SphereChoose from './sphere';
import QuestionDialog from "#components/Dialog/question";
import {createCompany, fetchActivityTypeList, fetchBusinessTypes, fetchRegionList, fetchVatList, fetchCityListForRegionId} from "../actions";



const AddCompany = () => {

    const [clearDialog, setClearDialog] = useState(false);
    const [bt, setBt] = useState('');
    const [btError, setBtError] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [companyNameError, setCompanyNameError] = useState('');
    const [region, setRegion] = useState('');
    const [regionError, setRegionError] = useState('');
    const [city, setCity] = useState('');
    const [cityError, setCityError] = useState('');
    const [address, setAddress] = useState('');
    const [addressError, setAddressError] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [phoneNumberError, setPhoneNumberError] = useState('');
    const [firstName, setFirstName] = useState('');
    const [firstNameError, setFirstNameError] = useState('');
    const [lastName, setLastName] = useState('');
    const [lastNameError, setLastNameError] = useState('');
    const [patronymic, setPatronymic] = useState('');
    const [dialog, setDialog] = useState(false);
    const [activityType, setActivityType] = useState([]);
    const [activityTypeError, setActivityTypeError] = useState(false);
    const [nds, setNds] = useState(-1);
    const [ndsPercent, setNdsPercent] = useState(0);

    const businessType = useSelector(state => state.get("config").businessType)
    const regionList = useSelector(state => state.get("config").regionList)
    const cityList = useSelector(state => state.get("config").cityList)
    const vatList = useSelector(state => state.get("config").vatList)
    const isLoading = useSelector(state => state.get("config").isLoading)
    const dispatch = useDispatch();

    const formRef = useRef();

    const clearForm = () => {
        setClearDialog(true);
    }

    useEffect(() => {
        dispatch(fetchBusinessTypes());
        dispatch(fetchRegionList());
        dispatch(fetchActivityTypeList());
        dispatch(fetchVatList());
    }, [])



    const verify = () => {
        if (activityType.length === 0) {
            setActivityTypeError(true);

            return;
        }
        if (firstName === '') {
            setFirstNameError('Введите Имя владельца')
            return
        }
        if (lastName === '') {
            setLastNameError('Введите Фамилию владельца');
            return
        }
        if (bt === '') {
            setBtError('Выберите тип!');
            return
        }
        if (companyName === '') {
            setCompanyNameError('Введите название компании')
            return
        }
        if (region === '') {
            setRegionError(true);
            return
        }
        if (city === '') {
            setCityError(true);
            return
        }
        if (address === '') {
            setAddressError('Введите адрес');
            return
        }

        if (phoneNumber === '') {
            setPhoneNumberError('Введите телефонный номер')
            return
        }
        dispatch(createCompany({
            contactFullName: {
                firstName,
                lastName,
                patronymic
            },
            address,
            businessType: {code: bt},
            city: {id: city},
            companyPhone: phoneNumber,
            name: companyName,
            region: { id: region },
            types: activityType,
            paysNds: ndsPercent !== null,
            ndsPercent: ndsPercent
        }))

    }

    return (
        <Grid container>
            <QuestionDialog
                open={clearDialog}
                title='Предупреждение!'
                message='Вы действительно хотите очистить форму?'
                onPositive={() => {
                    setBt('');
                    setBtError('');
                    setCompanyName('');
                    setCompanyNameError('');
                    setRegion('');
                    setRegionError('');
                    setCity('');
                    setCityError('');
                    setAddress('');
                    setAddressError('');
                    setPhoneNumber('');
                    setPhoneNumberError('');
                    setFirstName('');
                    setFirstNameError('');
                    setLastName('');
                    setLastNameError('');
                    setPatronymic('');
                    setDialog(false);
                    setActivityType([]);
                    setClearDialog(false)

                    formRef.current && formRef.current.clear()
                }}
                onNegative={() => {
                    setClearDialog(false);
                }}
            />
            <Grid item xs={12} style={{marginTop: 20}}>
                <Grid containers justify="center">
                    <Grid item> <Typography variant='h4' align='center' style={{fontSize: 16}}> Информация о компании </Typography> </Grid>
                </Grid>
            </Grid>
            <Grid container justify="center" direction="row" style={{marginTop: 20}}>
                <Grid item xs={12}>
                    <SphereChoose
                        ref={formRef}
                        onActivityTypeSelected={activityType => { setActivityType(activityType); setActivityTypeError(false); }}
                    />
                </Grid>
            </Grid>
            <Grid container style={{marginTop: 10, display: activityTypeError ? 'flex' : 'none', color: 'red', justifyContent: 'center'}}>
                <Grid item>Не выбрали сферу деятельности!</Grid>
            </Grid>
            <Grid container direction="row">
                <Grid item xs={3}>
                    <TextField
                        error={firstNameError !== ''}
                        helperText={firstNameError}
                        label='Имя владельца'
                        variant='outlined'
                        value={firstName}
                        fullWidth
                        onChange={event=> {
                            setFirstNameError('');
                            setFirstName(event.target.value);
                        }}
                    />
                </Grid>
                <Grid item xs={9} style={{paddingLeft: 8}}>
                    <TextField
                        error={lastNameError !== ''}
                        helperText={lastNameError}
                        label='Фамилия владельца'
                        variant='outlined'
                        value={lastName}
                        fullWidth
                        onChange={event=> {
                            setLastName(event.target.value);
                            setLastNameError('');
                        }}
                    />
                </Grid>
            </Grid>
            <Grid container style={{marginTop: 20}}>
                <Grid item xs={12}>
                    <TextField
                        label='Отчество владельца'
                        variant='outlined'
                        value={patronymic}
                        fullWidth
                        onChange={event=> {
                            setPatronymic(event.target.value)
                        }}
                    />
                </Grid>
            </Grid>
            <Grid container direction="row" style={{marginTop: 20}}>
                <Grid item xs={3}>
                    <SelectBox
                        data={businessType}
                        itemKey='code'
                        itemValue='nameRu'
                        label='Тип компании'
                        error={btError !== ''}
                        helperText={btError}
                        value={bt}
                        onChange={event => {
                            setBt(event.target.value);
                            setBtError('');
                        }}
                    />
                </Grid>
                <Grid item xs={9} style={{paddingLeft: 8}}>
                    <TextField
                        onChange={event => {
                            setCompanyName(event.target.value);
                            setCompanyNameError('');
                        }}
                        label='Название компании'
                        variant='outlined'
                        value={companyName}
                        error={companyNameError !== ''}
                        helperText={companyNameError}
                        fullWidth />
                </Grid>
            </Grid>
            <Grid container style={{marginTop: 20}} direction="row">
                <Grid item xs={3}>
                    <FormControl fullWidth variant='outlined' error={regionError}>
                        <InputLabel> Регион </InputLabel>
                        <Select
                            onChange={event => {
                                setRegion(event.target.value);
                                setRegionError(false);
                                setCity('');
                                dispatch(fetchCityListForRegionId(event.target.value));
                            }}
                            value={region}
                            disabled={regionList.size === 0}
                            input={<OutlinedInput labelWidth={90} />}>
                            {regionList.map((item, index) => {
                                return (
                                    <MenuItem key={index} value={item.id}>
                                        {item.nameRu}
                                    </MenuItem>
                                )
                            })}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={9} style={{paddingLeft: 10}}>
                    <FormControl fullWidth variant='outlined' error={cityError}>
                        <InputLabel> Город/Район </InputLabel>
                        <Select
                            onChange={event => {
                                setCity(event.target.value);
                                setCityError(false);
                            }}
                            value={city}
                            disabled={cityList.size === 0}
                            input={<OutlinedInput labelWidth={60} />}>
                            {cityList.map((item, index) => {
                                return (
                                    <MenuItem key={index} value={item.id}>
                                        {item.nameRu}
                                    </MenuItem>
                                )
                            })}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            <Grid container style={{marginTop: 20}}>
                <Grid item xs={12}>
                    <TextField
                        error={addressError !== ''}
                        helperText={addressError}
                        label='Адрес'
                        variant='outlined'
                        value={address}
                        fullWidth
                        onChange={event=> {
                            setAddress(event.target.value);
                            setAddressError('');
                        }}
                    />
                </Grid>
            </Grid>
            <Grid container style={{marginTop: 20}}>
                <Grid item xs={12}>
                    <PhoneTextField
                        value={phoneNumber}
                        onPhoneChange={(isValid, phoneNumber) => {
                            setPhoneNumber(phoneNumber);
                            setPhoneNumberError('');
                        }}
                    />
                </Grid>
            </Grid>
            <Grid container style={{ marginTop: 15, fontWeight: 'bold'}}>Являетесь ли вы налогоплательщиком?</Grid>
            <Grid container style={{marginTop: 4}}>
                <Grid item xs={12}>
                    <SelectBox
                        data={vatList && [null, ...vatList].map(vat => ({
                            key: vat === null ? -1 : vat.id,
                            value: vat === null ? 'Нет' : `${vat.name} - ${vat.percent}`
                        }))}
                        itemKey='key'
                        itemValue='value'
                        label='Процент НДС'
                        labelWidth={100}
                        value={nds}
                        onChange={event => {
                            let found = vatList.find(vat => vat.id === event.target.value);
                            if (found) {
                                setNdsPercent(found.percent);
                                setNds(event.target.value);

                            } else {
                                setNdsPercent(0);
                                setNds(-1);
                            }
                        }}
                    />
                </Grid>
            </Grid>
            <Grid container justify="center" direction="row" alignItems="center" style={{
                display: isLoading ? 'flex' : 'none'
            }}>
                <Grid item>
                    <CircularProgress variant='indeterminate'/>
                </Grid>
                <Grid item>
                    <Typography variant='overline' style={{fontSize: 16, marginRight: 12}}> Загрузка...</Typography>
                </Grid>
            </Grid>

        </Grid>

    )
}


export default AddCompany;
