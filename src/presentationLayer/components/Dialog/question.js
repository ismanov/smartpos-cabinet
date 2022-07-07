import React from 'react';
import {
    Dialog, 
    DialogTitle,
    DialogContentText,
    DialogActions,
    Button
} from '@material-ui/core';
import {useTranslation} from "react-i18next";

const QuestionDialog = (props) => {

    const { t } = useTranslation();

    return (
        <Dialog
        fullWidth
        {...props}
        >
            <DialogTitle>{props.title}</DialogTitle>
            {props.message && <DialogContentText>
                <div style={{margin: 20, color: '#555'}}>
                    { props.message }
                </div>
            </DialogContentText>}
            <DialogActions>
                <Button onClick={props.onNegative}> {t("common.no")} </Button>
                <Button color='primary' onClick={props.onPositive}> {t("common.yes")} </Button>
            </DialogActions>
        </Dialog>
    )
};

export default QuestionDialog;