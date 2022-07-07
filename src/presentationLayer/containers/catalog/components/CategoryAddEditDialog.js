import React, {useEffect, useState} from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField
} from "@material-ui/core";
import TextButton from "../../../components/Buttons/text";
import {useTranslation} from "react-i18next";

const CategoryAddEditDialog = props => {

    const [current, setCurrent] = useState({name: '', enabled: true});
    const [error, setError] = useState();

    const {t} = useTranslation();

    useEffect(() => {
        setCurrent(props.current)
    }, [props.current]);

    useEffect(() => {
        if (!props.open) {
            setCurrent({name: '', enabled: true});
            setError(undefined);
        }
    }, [props.open]);



    return (
        <Dialog {...props} fullWidth>
            <DialogTitle> {props.current ? t("common.edit") : t("common.add")} </DialogTitle>
            <DialogContent style={{padding: 20}}>
                <TextField
                    placeholder={t("myCatalog.categoryName")}
                    value={current ? current.name : ''}
                    onChange={e => {
                        setCurrent({...current, name: e.target.value})
                    }}
                    error={!!error}
                    helperText={error}
                    fullWidth
                />
            </DialogContent>
            <DialogActions>
                <TextButton
                    title='Отмена'
                    onClick={props.onCancel}
                />
                <TextButton
                    title="Сохранить"
                    style={{marginLeft: 20}}
                    onClick={() => {
                        if (current && !current.name) {
                            setError(t("myCatalog.enterCategoryName"));
                            return
                        }
                        props.onAddCategory && props.onAddCategory(current)
                    }}
                />
            </DialogActions>
        </Dialog>
    )

};

export default CategoryAddEditDialog;

