import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
    Grid,
    Dialog,
    DialogContent,
    DialogActions,
    DialogTitle,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    OutlinedInput,
    MenuItem
} from '@material-ui/core';
import {Formik, Form, Field} from 'formik';
import {useTranslation} from "react-i18next";
import * as Yup from "yup";
import {
    clearCityList,
    createBranch,
    fetchActivityTypes,
    fetchCityList,
    fetchRegionList,
    updateBranch
} from "../actions";
import {fetchBranchList} from "../../dashboard/actions";
import withNotification from "../../../hocs/withNotification/WithNotification";

const BranchAddEditDialog = props => {

    const dispatch = useDispatch();
    const {t} = useTranslation();
    const activityTypeList = useSelector(state => state.get("branch").activityType);
    const regionList = useSelector(state => state.get("branch").regionList);
    const cityList = useSelector(state => state.get("branch").cityList);
    const isLoading = useSelector(state => state.get("branch").isLoading);
    const formRef = React.useRef();


    function onClose() {
        console.log(formRef.current)
        formRef.current && formRef.current.resetForm();
        props.onClose && props.onClose(true)
    }

    React.useEffect(() => {
        if (props.open && !activityTypeList.length) {
            dispatch(fetchActivityTypes())
        }
        if (props.open && !regionList.length) {
            dispatch(fetchRegionList())
        }
        if (props.current) {
            props.current.region && dispatch(fetchCityList(props.current.region.id));
        }
    }, [props.open]);

    return  (
        <Formik
            innerRef={formRef}
            enableReinitialize={true}
            initialValues={props.current ? {
                name: props.current.name || '',
                activityType: props.current.activityTypeDTO ? props.current.activityTypeDTO.id : undefined,
                region: props.current.region ? props.current.region.id : undefined,
                city: props.current.city ? props.current.city.id : undefined,
                address: props.current.address
            } : {
                activityType: undefined,
                name: ''
            }}
            validationSchema={() => Yup.object().shape({
                activityType: Yup.number().required(),
                name: Yup.string().min(3).required(),
                region:  Yup.number().required(),
                city: Yup.number().required(),
                address: Yup.string().min(2).required()
            })}
            onSubmit={values => {
                let branch = {
                    name: values.name || '',
                    activityTypeDTO: values.activityType ? {id: values.activityType} : undefined,
                    region: values.region ? {id: values.region} : undefined,
                    city: values.city ? {id: values.city} : undefined,
                    address: values.address
                };
                
                if (props.current) {
                    dispatch(updateBranch({...branch, id: props.current.id}, () => {
                        dispatch(fetchBranchList());
                        props.success(t("branchAddEditDialog.editSuccess"));
                        onClose();
                    }))

                } else {
                    dispatch(createBranch(branch, () => {
                        dispatch(fetchBranchList());
                        props.success(t("branchAddEditDialog.addSuccess"));
                        onClose();
                    }))
                }
            }}>
            {({isValid, dirty, handleSubmit}) => (
                <Form>
                    <Dialog
                        {...props}
                        fullWidth
                        onClose={onClose}>
                        <DialogTitle>{props.current ? t("common.edit") : t("common.add")}</DialogTitle>
                        <DialogContent>
                            <Field name="activityType">
                                {({field: {value}, form: {setFieldValue}}) => (
                                    <FormControl fullWidth variant='outlined'>
                                        <InputLabel> {t("branchAddEditDialog.activityType")} </InputLabel>
                                        <Select
                                            fullWidth
                                            disabled={(activityTypeList || []).length === 0}
                                            onChange={event => {
                                                setFieldValue('activityType', event.target.value)
                                            }}
                                            value={value}
                                            input={<OutlinedInput labelWidth={180} />}>
                                            {
                                                activityTypeList && activityTypeList.map((item, index) => {
                                                    return (
                                                        <MenuItem key={index} value={item.id}>
                                                            {item.name}
                                                        </MenuItem>
                                                    )
                                                })
                                            }
                                        </Select>
                                    </FormControl>
                                )}
                            </Field>
                            <Field name="name">
                                {({field: {value}, form: {setFieldValue, errors}}) =>  (
                                    <TextField
                                        variant='outlined'
                                        label={t("branchAddEditDialog.branchName")}
                                        fullWidth
                                        error={errors.name}
                                        helperText={errors.name && t("branchAddEditDialog.nameError")}
                                        value={value}
                                        onChange={event => {
                                            setFieldValue("name", event.target.value)
                                        }}
                                        style={{marginTop: 20}}
                                    />
                                )}
                            </Field>

                            <Grid container justify='center' style={{marginTop: 20}} direction='row'>
                                <Grid item xs={6}>
                                    <Field name="region">
                                        {({field: {value}, form: {setFieldValue, errors}}) => (
                                            <FormControl fullWidth variant='outlined'>
                                                <InputLabel> {t("branchAddEditDialog.region")} </InputLabel>
                                                <Select
                                                    fullWidth
                                                    disabled={regionList && regionList.length === 0}
                                                    onChange={event => {
                                                        setFieldValue("region", event.target.value);
                                                        setFieldValue("city", undefined);
                                                        dispatch(clearCityList());

                                                        dispatch(fetchCityList(event.target.value));
                                                    }}
                                                    error={errors.region}
                                                    value={value}
                                                    input={<OutlinedInput labelWidth={180} />}>
                                                    {
                                                        regionList && regionList.map((item, index) => {
                                                            return (
                                                                <MenuItem key={index} value={item.id}>
                                                                    {item.nameRu}
                                                                </MenuItem>
                                                            )
                                                        })
                                                    }
                                                </Select>
                                            </FormControl>
                                        )}
                                    </Field>

                                </Grid>
                                <Grid item xs={6} style={{paddingLeft: 10}}>
                                    <Field name="city">
                                        {({field: {value}, form: {setFieldValue, errors}}) => (
                                            <FormControl fullWidth variant='outlined'>
                                                <InputLabel> {t("branchAddEditDialog.city")} </InputLabel>
                                                <Select
                                                    fullWidth
                                                    onChange={event => {
                                                        setFieldValue("city", event.target.value)
                                                    }}
                                                    error={errors.city}
                                                    value={value}
                                                    input={<OutlinedInput labelWidth={180} />}>
                                                    {
                                                        cityList && cityList.map((item, index) => {
                                                            return (
                                                                <MenuItem key={index} value={item.id}>
                                                                    {item.nameRu}
                                                                </MenuItem>
                                                            )
                                                        })
                                                    }
                                                </Select>
                                            </FormControl>
                                        )}
                                    </Field>
                                </Grid>
                            </Grid>
                            <Field name="address">
                                {({field: {value}, form: {setFieldValue, errors}})  => (
                                    <TextField
                                        variant='outlined'
                                        fullWidth
                                        label={t("branchAddEditDialog.address")}
                                        value={value}
                                        error={errors.address}
                                        onChange={event => {
                                            setFieldValue('address', event.target.value)
                                        }}
                                        style={{marginTop: 20}}
                                    />
                                )}
                            </Field>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                variant='text'
                                type="submit"
                                color='primary'
                                disabled={isLoading}
                                onClick={() => {
                                    onClose();
                                }}
                            >{t("common.cancel")}</Button>
                            <Button
                                variant='text'
                                type="submit"
                                color='primary'
                                disabled={!(isValid && dirty && !isLoading)}
                                onClick={handleSubmit}
                                >{props.current ? t("common.update") : t("common.save")}</Button>
                        </DialogActions>
                    </Dialog>
                </Form>
            )}
        </Formik>
    )

};

export default withNotification(BranchAddEditDialog);

