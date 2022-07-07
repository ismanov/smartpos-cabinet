import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { Grid, TextField, Dialog, DialogContent, DialogActions, Button, DialogTitle, Typography } from '@material-ui/core';
import SelectBox from '../../../components/Select';
import PhoneTextField from '../../../components/Textfields/phone';
import Logic from '#businessLayer';
import { updateSupplier, createSupplier } from '../actions';

const AddEditDialog = props => {


    const [name, setName] = useState();
    const [nameError, setNameError] = useState();
    const [contactPerson, setContactPerson] = useState();
    const [regionId, setRegionId] = useState();
    const [cityId, setCityId] = useState();
    const [address, setAddress] = useState();
    const [phone, setPhone] = useState();
    const [phoneError, setPhoneError] = useState();
    const [current, setCurrent] = useState();

    const [regionList, setRegionList] = useState([]);
    const [cityList, setCityList] = useState([]);

    const isLoading = useSelector(state => state.get("supplier").isLoading);
    const dispatch = useDispatch();

    useEffect(() => {
        Logic
            .resource
            .fetchRegions()
            .then(response => {
                setRegionList(response.data)
            })
            .catch(console.log)
    }, [])
    
    useEffect(() => {
        if (!props.open) {
            setName(undefined); 
            setNameError(undefined);
            setContactPerson(undefined);
            setRegionId(undefined);
            setCityId(undefined);
            setAddress(undefined);
            setPhone(undefined);
            setPhoneError(undefined);            
            setCurrent(undefined);
        }
    }, [props.open])

    useEffect(() => {
        if (regionId >= 0) {
            Logic
                .resource
                .fetchCityForRegionId(regionId)
                .then(response => {
                    setCityList(response.data)
                })
                .catch(console.log)
        }        
    }, [regionId])

    useEffect(() => {
        if (props.current && !current) {
            setCurrent(props.current)            
            if (props.current.region) {
                Logic
                    .resource
                    .fetchCityForRegionId(props.current.region.id)
                    .then(response => {
                        setCityList(response.data)
                    })
                    .catch(console.log)
            }            
        }        
    }, [props.current])    


    const onClose = () => {
        setName(undefined); 
        setNameError(undefined);
        setContactPerson(undefined);
        setRegionId(undefined);
        setCityId(undefined);
        setAddress(undefined);
        setPhone(undefined);
        setPhoneError(undefined);
        setCurrent(undefined);
        props.onDialogClose && props.onDialogClose(false)
    }

    const verify = () => {
        if (current) {
            if (!current.name) {
                setNameError('Введите название')                
                return
            }
            if (current.phone && current.phone.indexOf('*') >= 0) {
                setPhoneError('Неверный формат')                
                return
            }
            dispatch(updateSupplier({...current}, props));            
        } else {
            if (!name) {
                setNameError('Введите название')                
                return
            }
            if (phone && phone.indexOf('*') >= 0) {
                setPhoneError('Неверный формат')                
                return
            }
            dispatch(createSupplier({
                name, contactPerson,
                region: regionId >= 0 ? { id: regionId }: undefined,
                city: cityId >= 0 ? { id: cityId }: undefined,
                address, phone: phone && phone === '998' ? '' : phone
            }, props))            
        }
        setName(undefined); 
        setNameError(undefined);
        setContactPerson(undefined);
        setRegionId(undefined);
        setCityId(undefined);
        setAddress(undefined);
        setPhone(undefined);
        setPhoneError(undefined);
        setCurrent(undefined);
    }

    return (
        <Dialog
            fullWidth
            onClose={onClose}
            {...props}>
                <DialogTitle>{ current ? 'Редактировать поставщика' : 'Новый поставщик' }</DialogTitle>
                <DialogContent>
                    <Grid container style={{padding: 10}}>
                        <Grid container>
                            <TextField
                                fullWidth
                                variant='outlined'
                                label='Наименование'
                                error={!!nameError}
                                helperText={nameError}
                                value={current ? current.name : name}
                                onChange={event => {
                                    if (current) {
                                        setCurrent({...current, name: event.target.value})                                        
                                    } else {
                                        setName(event.target.value)                                    
                                    }
                                }}
                            />
                        </Grid>
                        <Grid container style={{marginTop: 15}}>
                            <TextField
                                fullWidth
                                variant='outlined'
                                label='Контактное лицо'
                                value={current ? current.contactPerson : contactPerson}
                                onChange={event => {
                                    if (current) {
                                        setCurrent({...current, contactPerson: event.target.value})                                                                                
                                    } else {
                                        setContactPerson(event.target.value)                                        
                                    }

                                }}
                            />
                        </Grid>
                        <Grid container style={{marginTop: 10}}>
                            <Typography variant='h4' style={{color: '#555', fontSize: 15}}>Адрес поставщика</Typography>
                        </Grid>
                        <Grid container style={{marginTop: 10}} direction='row'>
                            <Grid item xs={6}>
                                <SelectBox
                                    itemKey='id'
                                    itemValue='nameRu'
                                    data={regionList}
                                    label='Регион'
                                    value={current && current.region ? current.region.id : regionId }
                                    disabled={!regionList || regionList.length === 0}
                                    onChange={event => {
                                        setCityList([])
                                        if (current) {
                                            setCurrent({...current, region: { id: event.target.value }, city: undefined})                                            
                                        } else {
                                            setCityId(undefined);                                            
                                            setRegionId(event.target.value)        
                                        }   
                                        Logic
                                            .resource
                                            .fetchCityForRegionId(event.target.value)
                                            .then(response => {
                                                setCityList(response.data)
                                            })
                                            .catch(console.log)
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6} style={{paddingLeft: 10}}>
                                <SelectBox
                                    itemKey='id'
                                    itemValue='nameRu'
                                    data={cityList}
                                    label='Город'
                                    value={current && current.city ? current.city.id : cityId }
                                    disabled={!cityList || cityList.length === 0}
                                    onChange={event => {
                                        if (current) {
                                            setCurrent({...current, city: { id: event.target.value }})                                                                                        
                                        } else {
                                            setCityId(event.target.value);                                            
                                        }
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container style={{marginTop: 10}}>
                            <TextField
                                fullWidth
                                label='Адрес'
                                variant='outlined'
                                value={current ? current.address : address}
                                onChange={event => {
                                    if (current) {
                                        setCurrent({...current, address: event.target.value})                                        
                                    } else {
                                        setAddress(event.target.value);                                        
                                    }
                                }}
                            />
                        </Grid>
                        <Grid container style={{marginTop: 10}}>
                            <Typography variant='h4' style={{color: '#555', fontSize: 15}}>Контакты</Typography>
                        </Grid>
                        <Grid container style={{marginTop: 4}}>
                            <PhoneTextField
                                error={!!phoneError}
                                helperText={phoneError}
                                value={current ? current.phone : phone}
                                onPhoneChange={(valid, phone) => {
                                    if (current) {
                                        setCurrent({...current, phone})                                        
                                    } else {
                                        setPhone(phone);                                        
                                    }
                                }}
                            />
                        </Grid>                        
                    </Grid>

                </DialogContent>
                <DialogActions>
                    <Button color='primary' disabled={isLoading} onClick={onClose}>Отменить</Button>
                    <Button color='primary' disabled={isLoading} onClick={verify}>Сохранить</Button>
                </DialogActions>
            </Dialog>
        )


}


export default AddEditDialog;
