import React, {useState} from 'react';
import {
    Dialog, DialogTitle, DialogContent,
    DialogActions, Grid, Button, TextField
} from '@material-ui/core';
import {useDispatch} from 'react-redux';
import PhoneTextField from "../../../components/Textfields/phone";
import {useTranslation} from "react-i18next";
import {createBankRequisites, updateBankRequisites} from "../actions";

const ChangeBankRequisites = props => {

    const [bankRequisites, setBankRequisites] = useState();
    const {t} = useTranslation();
    const dispatch = useDispatch();

    React.useEffect(() => {
        if (props.bankRequisites && props.open && !bankRequisites) {
            setBankRequisites({...props.bankRequisites});
        }
        if (!props.open) {
            setBankRequisites(undefined);
        }
    }, [props.bankRequisites, props.open]);

    return (
        <Dialog
            {...props}
            fullWidth
        >
            <DialogTitle>{t("settings.owner")}</DialogTitle>
            <DialogContent>
                <Grid container style={{padding: 15}}>
                    <TextField
                        label={t("settings.bank")}
                        fullWidth
                        variant='outlined'
                        style={{marginTop: 15}}
                        value={bankRequisites ? bankRequisites.bankName : ''}
                        onChange={event => {
                            setBankRequisites({...bankRequisites, bankName: event.target.value});
                        }}
                    />
                    <TextField
                        label={t("branchDetail.address")}
                        fullWidth
                        variant='outlined'
                        style={{marginTop: 15}}
                        value={bankRequisites ? bankRequisites.address : ''}
                        onChange={event => {
                            setBankRequisites({...bankRequisites, address: event.target.value});
                        }}
                    />
                    <TextField
                        label={t("settings.mfo")}
                        fullWidth
                        variant='outlined'
                        style={{marginTop: 15}}
                        value={bankRequisites ? bankRequisites.mfo : ''}
                        onChange={event => {
                            setBankRequisites({...bankRequisites, mfo: event.target.value});
                        }}
                    />
                    <PhoneTextField
                        value={bankRequisites ? isNaN(Number(bankRequisites.number)) ? '998' : bankRequisites.number : '998'}
                        onPhoneChange={(isValid, phoneNumber) => {
                            setBankRequisites({...bankRequisites, number: phoneNumber});
                        }}
                        style={{marginTop: 15}}
                    />
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button color='primary' onClick={() => {
                    if (props.bankRequisites) {
                        dispatch(updateBankRequisites({...bankRequisites}));
                    } else {
                        dispatch(createBankRequisites({...bankRequisites}));
                    }
                    setBankRequisites(undefined);
                    props.onClose && props.onClose()
                }}> {t("common.save")} </Button>
                <Button color='primary' onClick={() => {
                    setBankRequisites(undefined);
                    props.onClose && props.onClose()
                }}> {t("common.cancel")}</Button>
            </DialogActions>
        </Dialog>
    )
};

export default ChangeBankRequisites;
