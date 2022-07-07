import React, {useState} from 'react';
import {
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button
} from '@material-ui/core';
import PasswordTextField from '../../../components/Textfields/password';
import { containsLowerCaseLetter, containsUpperCaseLetter } from "../../../../utils/format";
import {useTranslation} from "react-i18next";

const ChangePassword = (props) => {

    const [currentPassword, setCurrentPassword] = useState();
    const [newPassword, setNewPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const {t} = useTranslation();

    const isValid = () => {
        const currPassValid = currentPassword && currentPassword.length > 8 && containsUpperCaseLetter(currentPassword) && containsLowerCaseLetter(currentPassword);
        const newPassValid = newPassword && newPassword.length > 8 && containsUpperCaseLetter(newPassword) && containsLowerCaseLetter(newPassword);
        const confirmPassValid = confirmPassword && confirmPassword.length > 8 && containsUpperCaseLetter(confirmPassword) && containsLowerCaseLetter(confirmPassword);
        const equalsPass = confirmPassword === newPassword;
        return currPassValid && newPassValid && confirmPassValid && equalsPass;
    };

    const onClose = () => {
        setNewPassword(undefined);
        setConfirmPassword(undefined);
        setCurrentPassword(undefined);
        props.onClose && props.onClose()
    };

    return (
        <Dialog
            {...props}
            >
            <DialogTitle>{t("changePasswordDialog.changePass")}</DialogTitle>
            <DialogContent>
                <Grid container style={{padding: 15}}>
                    <Grid container style={{marginTop: 10, color: isValid() ? '#009f3c' : 'red'}}>
                        {t("changePasswordDialog.message")}
                    </Grid>
                    <Grid container style={{marginTop: 20}}>
                        <PasswordTextField
                            value={currentPassword}
                            label={t("changePasswordDialog.currentPass")}
                            fullWidth
                            onChange={event => setCurrentPassword(event.target.value)}
                            />
                    </Grid>
                    <Grid container style={{marginTop: 20}}>
                        <PasswordTextField
                            value={newPassword}
                            onChange={event => setNewPassword(event.target.value)}
                            label={t("changePasswordDialog.newPass")}
                            fullWidth/>
                    </Grid>
                    <Grid container style={{marginTop: 20}}>
                        <PasswordTextField
                            value={confirmPassword}
                            onChange={event => setConfirmPassword(event.target.value)}
                            label={t("changePasswordDialog.confirm")}
                            fullWidth
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button variant='text' color='primary' onClick={onClose}>Отмена</Button>
                <Button variant='text' color='primary' disabled={!isValid()}
                        onClick={() => {
                            props.onValue && props.onValue(currentPassword, newPassword);
                            onClose()
                        }}
                >{t("changePasswordDialog.change")}</Button>
            </DialogActions>
        </Dialog>
    )
};

export default ChangePassword;
