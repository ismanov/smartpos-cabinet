import React, {useState, useEffect} from 'react';
import {
    Dialog, DialogTitle, DialogContent,
    DialogActions, Grid, Button,
    TextField, Checkbox, Typography
} from '@material-ui/core';
import {useDispatch, useSelector} from 'react-redux';
import { updateOwner } from '../actions';
import SphereChoose from '#containers/config/company/sphere';
import SelectBox from "#components/Select";
import InputMask from "react-input-mask";
import Logic from '#businessLayer';

const ChangeOwner = props => {


    const [currentOwner, setCurrentOwner] = useState();
    const [cityError, setCityError] = useState('');
    const [isPhoneValid, setIsPhoneValid] = useState(false);
    const [phoneError, setPhoneError] = useState('');
    const [isInnValid, setIsInnValid] = useState(false);

    const [regionList, setRegionList] = useState([]);
    const [cityList, setCityList] = useState([]);

    const cOwner = useSelector(state => state.get("dashboard").currentOwner);

    const dispatch = useDispatch();

    useEffect(() => {
        Logic
            .resource
            .fetchRegions()
            .then(response => {
                setRegionList(response.data)
            })
    }, []);

    useEffect(() => {
        if (props.open) {
            setCurrentOwner({...cOwner});
            if (cOwner.region) {
                Logic
                    .resource
                    .fetchCityForRegionId(cOwner.region.id)
                    .then(response => {
                        setCityList(response.data)
                    })
                    .catch(console.log)
            }
        } else {
            setCurrentOwner(undefined);
            setCityError('');
            setIsPhoneValid(false);
            setPhoneError('');
            setIsInnValid(false);
        }
    }, [props.open])



    return (
        <Dialog
            {...props}
            fullWidth
        >
            <DialogTitle> Владелец </DialogTitle>
            <DialogContent>
                <Grid container style={{padding: 15}}>
                    <Grid item>
                        <SphereChoose
                            activityList={currentOwner ? currentOwner.types : []}
                            onActivityTypeSelected={list => {
                                setCurrentOwner({...currentOwner, types: [...list]})                                
                            }}
                        />
                    </Grid>
                    <TextField
                        label='Название'
                        fullWidth
                        variant='outlined'
                        style={{marginTop: 15}}
                        value={currentOwner ? currentOwner.name : ''}
                        onChange={event => {
                            setCurrentOwner({...currentOwner, name: event.target.value})
                        }}
                    />
                    <Grid container direction='row' style={{marginTop: 15}}>
                        <Grid item xs={4}>
                            <TextField
                                variant='outlined'
                                label='Имя'
                                value={currentOwner && currentOwner.contactFullName ? currentOwner.contactFullName.firstName : ''}
                                onChange={event => {
                                    let contactFullName = currentOwner && currentOwner.contactFullName
                                        ? {...currentOwner.contactFullName}
                                        : {};
                                    setCurrentOwner({...currentOwner, contactFullName: {...contactFullName, firstName: event.target.value}})                                    
                                }}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={4} style={{paddingLeft: 10}}>
                            <TextField
                                label='Фамилия'
                                fullWidth
                                variant='outlined'

                                value={currentOwner && currentOwner.contactFullName ? currentOwner.contactFullName.lastName : ''}
                                onChange={event => {
                                    let contactFullName = currentOwner && currentOwner.contactFullName
                                        ? {...currentOwner.contactFullName}
                                        : {};
                                    setCurrentOwner({...currentOwner, contactFullName: {...contactFullName, lastName: event.target.value}})
                                    
                                }}
                            />
                        </Grid>
                        <Grid item xs={4} style={{paddingLeft: 10}}>
                            <TextField
                                label='Отчество'
                                fullWidth
                                variant='outlined'
                                value={currentOwner && currentOwner.contactFullName ? currentOwner.contactFullName.patronymic : ''}
                                onChange={event => {
                                    let contactFullName = currentOwner && currentOwner.contactFullName
                                        ? {...currentOwner.contactFullName}
                                        : {};
                                    setCurrentOwner({...currentOwner, contactFullName: {...contactFullName, patronymic: event.target.value}})                                    
                                }}
                            />
                        </Grid>
                    </Grid>

                    <Grid container style={{marginTop: 15}}>
                        <Grid container direction='row'>
                            <Grid item xs={6}>
                                <SelectBox
                                    data={regionList}
                                    itemKey='id'
                                    itemValue='nameRu'
                                    label='Регион'
                                    onChange={event => {
                                        setCurrentOwner({...currentOwner, region: {id: event.target.value}, city: undefined})
                                        setCityError('');
                                        Logic
                                            .resource
                                            .fetchCityForRegionId(event.target.value)
                                            .then(response => {
                                                setCityList(response.data)
                                            })
                                            .catch(console.log)                                                                                
                                    }}
                                    value={currentOwner && currentOwner.region ? currentOwner.region.id : undefined}
                                />
                            </Grid>
                            <Grid item xs={6} style={{paddingLeft: 10}}>
                                <SelectBox
                                    label='Город'
                                    itemKey='id'
                                    itemValue='nameRu'
                                    data={cityList}
                                    onChange={event => {
                                        setCurrentOwner({...currentOwner, city: {id: event.target.value}})
                                        setCityError('');                                        
                                    }}
                                    error={!!cityError}
                                    helperText={cityError}
                                    value={currentOwner && currentOwner.city ? currentOwner.city.id : undefined}
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid container style={{marginTop:  10}}>
                        <TextField
                            label='Адрес'
                            fullWidth
                            variant='outlined'
                            value={currentOwner && currentOwner.address}
                            onChange={event => {
                                setCurrentOwner({...currentOwner, address: event.target.value})                                
                            }}
                        />
                    </Grid>

                    <Grid container direction='row' style={{marginTop: 15}}>
                        {/*<Grid item xs={6}>*/}
                        {/*    <PhoneTextField*/}
                        {/*        value={this.state.currentOwner ? this.state.currentOwner.companyPhone : ''}*/}
                        {/*        onPhoneChange={(isValid, phone) => {*/}

                        {/*            this.setState({*/}
                        {/*                currentOwner: {...this.state.currentOwner, companyPhone: phone},*/}
                        {/*                isPhoneValid: isValid,*/}
                        {/*                phoneError: ''*/}
                        {/*            })*/}
                        {/*        }}*/}
                        {/*        error={this.state.phoneError !== ''}*/}
                        {/*        helperText={this.state.phoneError}*/}
                        {/*    />*/}
                        {/*</Grid>*/}
                        <Grid item xs={12}>
                            <InputMask
                                mask={'999 999 999'}
                                // onChange={event => {
                                //     let s = event.target.value || '';
                                //     let numb = s.match(/\d/g) || [];
                                //     numb = numb.join("");
                                //     this.setState({
                                //         currentOwner: {...this.state.currentOwner, inn: numb}
                                //     })
                                // }}
                                disabled={true}
                                value={currentOwner && currentOwner.inn}

                            >
                                { (inputProps) => (
                                    <TextField
                                        {...inputProps}
                                        fullWidth
                                        variant='outlined'
                                        label='ИНН'
                                        disabled={true}
                                    />
                                )}
                            </InputMask>
                        </Grid>
                    </Grid>

                    <Grid container direction='row' alignItems='center' style={{marginTop: 20}}>
                        <Grid item xs={6} style={{paddingLeft: 10}}>
                            <Grid container direction='row' alignItems='center'>
                                <Grid item>
                                    <Checkbox
                                        color='primary'
                                        checked={currentOwner && currentOwner.warehouseEnabled}
                                        onChange={event => {
                                            setCurrentOwner({...currentOwner, warehouseEnabled: !currentOwner.warehouseEnabled})                                            
                                        }}
                                    />
                                </Grid>
                                <Grid item>
                                    <Typography variant='h4' color='inherit' style={{
                                        fontSize: 18,
                                        fontWeight: 'bold',
                                        marginLeft: 10,
                                        color: currentOwner && currentOwner.warehouseEnabled === true ? '#555' : '#aaa'
                                    }}> Подключить склад </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>


                </Grid>
            </DialogContent>
            <DialogActions>
                <Button color='primary' onClick={() => {
                    if (currentOwner.region && !currentOwner.city) {
                        setCityError('Выберите город')                        
                        return
                    }
                    dispatch(updateOwner({...currentOwner}))
                    setCurrentOwner(undefined);                    
                    props.onClose && props.onClose();
                }}> Сохранить </Button>
                <Button color='primary' onClick={() => {
                    setCurrentOwner(undefined);
                    setCityError('');
                    setIsPhoneValid(false);
                    setPhoneError('');
                    setIsInnValid(false);                    
                    props.onClose && props.onClose();
                }}> Отменить </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ChangeOwner;
