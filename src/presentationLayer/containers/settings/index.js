import React, {useState, useEffect} from 'react';
import {
    Grid,
    Typography,
    TextField,
    IconButton,
    Dialog,
    DialogContent,
    DialogActions,
    DialogTitle,
    Button,
    Tooltip,
} from '@material-ui/core';
import { CloudUploadOutlined, EditOutlined, SaveOutlined, Close, BorderLeft, BorderRight, BorderTop, BorderBottom, DeleteOutlined } from '@material-ui/icons';
import DetailSection, { Row } from '#components/containers/detailpage/DetailSection';
import ChequeTemplate from '#components/chequeTemplate';
import withNotification from '#hocs/withNotification/WithNotification';
import {useDispatch, useSelector} from 'react-redux';
import ChangeOwner from "./components/ChangeOwner";
import ChangeBankRequisites from './components/ChangeBankRequisites';
import Detail from '../../components/containers/detail';
import Paper from "@material-ui/core/Paper";
import {fetchActivityTypeList, fetchBankRequisites, fetchTemplate, removeTemplate, saveTemplate} from "./actions";
import {useTranslation} from "react-i18next";
import {fetchCurrentUser} from "../dashboard/actions";

const Settings = props => {

    const [editTemplate, setEditTemplate] = useState(false);
    const [tempHeadText, setTempHeadText] = useState();
    const [tempHeadLogo, setTempHeadLogo] = useState();
    const [tempHeadLogoPos, setTempHeadLogoPos] = useState('TOP');
    const [tempFootText, setTempFootText] = useState();
    const [tempFootLogo, setTempFootLogo] = useState();
    const [tempFootLogoPos, setTempFootLogoPos] = useState('TOP');
    const [openDialog, setOpenDialog] = useState(false);
    const [brDialogOpen, setBrDialogOpen] = useState(false);
    const [removeTemplateDialog, setRemoveTemplateDialog] = useState(false);
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const currentUser = useSelector(state => state.get("dashboard").currentUser);
    const currentOwner = useSelector(state => state.get("dashboard").currentOwner);
    const activityTypeList = useSelector(state => state.get("settings").activityTypeList);
    const bankRequisites = useSelector(state => state.get('settings').bankRequisites);
    const template = useSelector(state => state.get('settings').template);

    useEffect(() => {
        dispatch(fetchTemplate())
        dispatch(fetchActivityTypeList())
        dispatch(fetchBankRequisites());
    }, []);


    const restoreTemplate = () => {
        if (template && template.headerImage) {
            setTempHeadLogo(template.headerImage)
        } else {
            setTempHeadLogo(undefined)
        }
        if (template && template.headerText) {
            setTempHeadText(template.headerText)
        } else {
            setTempHeadText(undefined)
        }
        if (template && template.headerAlignment) {
            setTempHeadLogoPos(template.headerAlignment || 'TOP')
        } else {
            setTempHeadLogoPos(undefined)
        }
        if (template && template.footerImage) {
            setTempFootLogo(template.footerImage)
        } else {
            setTempFootLogo(undefined)
        }
        if (template && template.footerText) {
            setTempFootText(template.footerText)
        } else {
            setTempFootText(undefined)
        }
        if (template && template.footerAlignment) {
            setTempFootLogoPos(template.footerAlignment || 'TOP')
        } else {
            setTempFootLogoPos(undefined)
        }
    }

    useEffect(() => {
        restoreTemplate()
    }, [template]);

    return (
        <Grid container>
            <ChangeOwner
                open={openDialog}
                onClose={update => {
                    setOpenDialog(false);
                    if (update === true) {
                        dispatch(fetchCurrentUser());
                        props.success(t("profile.changedSuccess"));
                    }
                }}
                isProfileEdit={true}
                currentEmployee={currentUser}
            />
            <ChangeBankRequisites
                onClose={() => {
                    setBrDialogOpen(false);
                }}
                open={brDialogOpen}
                bankRequisites={bankRequisites}
            />
            <Dialog
                onClose={() => {
                    setRemoveTemplateDialog(false);
                }}
                open={removeTemplateDialog}
                fullWidth
            >
                <DialogTitle> {t("settings.removeTemplate")} </DialogTitle>
                <DialogContent> {t("settings.removeTemplateMsg")} </DialogContent>
                <DialogActions>
                    <Button color="secondary" onClick={() => {
                        if (template) {
                            dispatch(removeTemplate(template.id, () => {
                                props.success("Шаблон удален! успешно");
                                dispatch(fetchTemplate())
                                setRemoveTemplateDialog(false)
                            }))
                        }
                    }}> {t("settings.yes")} </Button>
                    <Button color="primary" style={{marginLeft: 10}} onClick={() => {
                        setRemoveTemplateDialog(false);
                    }}> {t("settings.no")} </Button>
                </DialogActions>
            </Dialog>
            <Typography variant='h4' style={{color: '#555', fontSize: 18, fontWeight: 'bold', marginTop: 20}}> {t("settings.title")} </Typography>
            <Grid container direction='row' style={{marginTop: 20}}>
                <Grid item xs={12} md={6}>
                    <Paper style={{padding: 10}}>
                        <Detail
                            header={{
                                title: t("settings.companyData"),
                                buttonTitle: t("profile.change"),
                            }}
                            style={{height: '100%'}}
                            headerClick={() => { setOpenDialog(true) }}
                        >
                            <Row
                                title={t("settings.name")}
                                value={currentOwner ? currentOwner.name : t("settings.notSet")}
                                style={{marginLeft: 20}}
                            />
                            <Row
                                title={t("settings.activityType")}
                                value={
                                    currentOwner &&
                                    currentOwner.types &&
                                    (currentOwner.types || []).map(item => item.name).join(', ') || t("settings.notSelected")}
                                style={{marginLeft: 20}}
                            />
                            <Row
                                title={t("settings.fio")}
                                value={
                                    currentOwner && currentOwner.contactFullName ?
                                        `${currentOwner.contactFullName.lastName} ${currentOwner.contactFullName.firstName} ${currentOwner.contactFullName.patronymic || ''}` : t("profile.notSet")
                                }
                                style={{marginLeft: 20}}
                            />
                            <Row
                                title={t("settings.ndsPercent")}
                                value={currentOwner && currentOwner.paysNds ?
                                    isNaN(currentOwner.ndsPercent) ? t("settings.noNDS") : currentOwner.ndsPercent + '%' : t("settings.noNDS")}
                                style={{marginLeft: 20}}
                            />
                            <Row
                                title={t("settings.includeWarehouse")}
                                value={currentOwner && currentOwner.warehouseEnabled ? t("settings.on") : t("settings.off")}
                                style={{marginLeft: 20}}
                            />
                        </Detail>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6} style={{paddingLeft: 10}}>
                    <Paper style={{padding: 10, height: '100%'}}>
                        <Detail
                            header={{
                                title: t("settings.bankRequisites"),
                                buttonTitle: t("profile.change"),
                            }}
                            style={{height: '100%'}}
                            headerClick={() => {
                                setBrDialogOpen(true)
                            }}
                        >
                            <Row
                                title={t("settings.bank")}
                                value={bankRequisites ? bankRequisites.bankName : t("settings.notDefined")}
                                style={{ marginLeft: 20 }}
                            />
                            <Row
                                title={t("settings.bankAddress")}
                                value={bankRequisites ? bankRequisites.address : t("settings.notDefined")}
                                style={{ marginLeft: 20 }}
                            />
                            <Row
                                title={t("settings.mfo")}
                                value={bankRequisites ? bankRequisites.mfo : t("settings.notDefined")}
                                style={{ marginLeft: 20 }}
                            />
                            <Row
                                title={t("settings.phoneNumberOfBank")}
                                value={bankRequisites ? bankRequisites.number : t("settings.notDefined")}
                                style={{ marginLeft: 20 }}
                            />
                        </Detail>
                    </Paper>
                </Grid>
                <Grid container style={{
                    marginTop: 20,
                    marginBottom: 20,
                    display: currentUser && currentUser.authorities.indexOf('ROLE_OWNER') >= 0 ? 'flex' : 'none'
                }} alignItems='center'>
                    <Grid item xs={12}>
                        <Paper style={{padding: 10}}>
                            <DetailSection
                                header={{ title: t("settings.chequeTemplate") }}
                            >
                                <Grid container justify='center' style={{marginTop: 20}}>
                                    <Grid item xs={12} sm={8} md={6} lg={3}>
                                        <Grid container direction='column'>
                                            <Grid item style={{border: '1px solid #eee', padding: 15}} direction='column'>
                                                <Grid container direction='row' alignItems='center'>
                                                    <Grid item xs={6}>
                                                        <Typography variant='h4' style={{fontSize: 16, fontWeight: 'bold', color: '#555', marginTop: 30}}>{t("settings.header")}</Typography>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Grid container justify='flex-end' alignItems='center'>
                                                            {editTemplate ? (
                                                                <div>
                                                                    <Tooltip 
                                                                        title="Сохранить">
                                                                        <IconButton onClick={() => {
                                                                            dispatch(saveTemplate({
                                                                                headerText: tempHeadText,
                                                                                headerImage: tempHeadLogo,
                                                                                headerAlignment: tempHeadLogoPos,
                                                                                footerText: tempFootText,
                                                                                footerImage: tempFootLogo,
                                                                                footerAlignment: tempFootLogoPos
                                                                            }))
                                                                            setEditTemplate(false);
                                                                        }}>
                                                                            <SaveOutlined />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                    <Tooltip title="Закрыть">
                                                                        <IconButton onClick={() => {
                                                                            setEditTemplate(false);
                                                                            restoreTemplate()
                                                                        }}>
                                                                            <Close />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                    
                                                                    
                                                                </div>
                                                            ) : (
                                                                <div>
                                                                    <Tooltip title="Удалить">
                                                                        <IconButton onClick={() => {
                                                                            setRemoveTemplateDialog(true);
                                                                        }}>
                                                                            <DeleteOutlined />
                                                                        </IconButton>
                                                                    </Tooltip>

                                                                    <Tooltip title="Редактировать">
                                                                        <IconButton onClick={() => {
                                                                            setEditTemplate(true);
                                                                        }}>
                                                                            <EditOutlined />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                    
                                                                </div>

                                                            )}
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                                <Grid container justify='center' style={{marginTop: 10, display: editTemplate === true && tempHeadLogo ? 'flex' : 'none'}}>
                                                    <Grid item xs={8}>
                                                        <Grid container direction='row'>
                                                            <Grid item xs={3}>
                                                                <Tooltip title="Текст слева">
                                                                    <IconButton onClick={() => {
                                                                        setTempHeadLogoPos('LEFT');
                                                                    }}>
                                                                        <BorderLeft color={tempHeadLogoPos === 'LEFT' ? 'primary' : 'inherit'}/>
                                                                    </IconButton>
                                                                </Tooltip>                                                                
                                                            </Grid>
                                                            <Grid item xs={3}>
                                                                <Tooltip title="Текст сверху">
                                                                    <IconButton onClick={() => {
                                                                        setTempHeadLogoPos('TOP');
                                                                    }}>
                                                                        <BorderTop color={tempHeadLogoPos === 'TOP' ? 'primary' : 'inherit'}/>
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </Grid>
                                                            <Grid item xs={3}>
                                                                <Tooltip title="Текст справа">
                                                                    <IconButton onClick={() => {
                                                                        setTempHeadLogoPos('RIGHT');
                                                                    }}>
                                                                        <BorderRight color={tempHeadLogoPos === 'RIGHT' ? 'primary' : 'inherit'}/>
                                                                    </IconButton>
                                                                </Tooltip>
                                                                
                                                            </Grid>
                                                            <Grid item xs={3}>
                                                                <Tooltip title="Текст снизу">
                                                                    <IconButton onClick={() => {
                                                                        setTempHeadLogoPos('BOTTOM');
                                                                    }}>
                                                                        <BorderBottom color={tempHeadLogoPos === 'BOTTOM' ? 'primary' : 'inherit'}/>
                                                                    </IconButton>
                                                                </Tooltip>                                                                
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>

                                                <Grid container justify='center' style={{marginTop: 10}}>
                                                    {
                                                        editTemplate === true ?
                                                            <div style={{padding: 10, border: '1px solid #eee', borderRadius: 1000}}>

                                                                <input
                                                                    accept="image/*"
                                                                    id="upload"
                                                                    style={{display: 'none'}}
                                                                    type="file"
                                                                    onChange={event => {
                                                                        const reader = new FileReader();
                                                                        reader.readAsArrayBuffer(event.target.files[0]);
                                                                        reader.onload = () => {
                                                                            let array = new Uint8Array(reader.result)
                                                                            if (array.length < 300000) {
                                                                                setTempHeadLogo(btoa(new Uint8Array(reader.result).reduce((data, byte) => data + String.fromCharCode(byte), '')));
                                                                            } else {
                                                                                alert(t("settings.fileSizeError"))
                                                                            }
                                                                        };
                                                                    }}
                                                                />
                                                                <label htmlFor="upload">
                                                                    {
                                                                        tempHeadLogo ?  <img src={`data:image/jpg;base64,${tempHeadLogo}`} style={{
                                                                            overflow: 'hidden',
                                                                            width: 40,
                                                                            height: 40,
                                                                            objectFit: 'contain'
                                                                        }} alt=''/> : <CloudUploadOutlined color='inherit' style={{width: 40, height: 40, color: '#555'}}/>
                                                                    }
                                                                </label>
                                                            </div>
                                                            :
                                                            <div style={{padding: 10, border: '1px solid #eee', borderRadius: 1000}}>

                                                                {
                                                                    tempHeadLogo ? <img src={`data:image/jpg;base64,${tempHeadLogo}`} style={{
                                                                        overflow: 'hidden',
                                                                        width: 40,
                                                                        height: 40,
                                                                        objectFit: 'contain'
                                                                    }} alt='logo'/>  :  <CloudUploadOutlined color='inherit' style={{width: 40, height: 40, color: '#555'}}/>
                                                                }
                                                            </div>
                                                    }
                                                </Grid>
                                                <div style={{height: 20}}/>
                                                <div style={{ maxWidth: 400}}>
                                                    {
                                                        editTemplate ?
                                                            (
                                                                <TextField
                                                                    variant='outlined'
                                                                    fullWidth
                                                                    label={t("settings.headerText")}
                                                                    value={tempHeadText}
                                                                    onChange={event => {
                                                                        setTempHeadText(event.target.value)
                                                                    }}
                                                                    multiline
                                                                    rowsMax={2}
                                                                    inputProps={{
                                                                        maxLength: 90
                                                                    }}
                                                                />

                                                            )
                                                            :
                                                            (
                                                                <Typography variant='h4' style={{color: '#555', fontSize: 16, overflow: 'hidden'}}>
                                                                    { tempHeadText || t("settings.headerText") }
                                                                </Typography>
                                                            )
                                                    }
                                                </div>

                                            </Grid>
                                            <Grid item style={{border: '1px solid #eee', padding: 15, marginTop: 20}} direction='column'>
                                                <Grid container>
                                                    <Typography variant='h4' style={{fontSize: 16, fontWeight: 'bold', color: '#555', marginTop: 30}}>{t("settings.footer")}</Typography>
                                                </Grid>
                                                <Grid container justify='center' style={{marginTop: 10, display: editTemplate && tempFootLogo ? 'flex' : 'none'}}>
                                                    <Grid item xs={8}>
                                                        <Grid container direction='row'>
                                                            <Grid item xs={3}>
                                                                <IconButton onClick={() => {
                                                                    setTempFootLogoPos('LEFT')
                                                                }}>
                                                                    <BorderLeft color={tempFootLogoPos === 'LEFT' ? 'primary' : 'inherit'}/>
                                                                </IconButton>
                                                            </Grid>
                                                            <Grid item xs={3}>
                                                                <IconButton onClick={() => {
                                                                    setTempFootLogoPos('TOP');
                                                                }}>
                                                                    <BorderTop color={tempFootLogoPos === 'TOP' ? 'primary' : 'inherit'}/>
                                                                </IconButton>
                                                            </Grid>
                                                            <Grid item xs={3}>
                                                                <IconButton onClick={() => {
                                                                    setTempFootLogoPos('RIGHT');
                                                                }}>
                                                                    <BorderRight color={tempFootLogoPos === 'RIGHT' ? 'primary' : 'inherit'}/>
                                                                </IconButton>
                                                            </Grid>
                                                            <Grid item xs={3}>
                                                                <IconButton onClick={() => {
                                                                    setTempFootLogoPos('BOTTOM');
                                                                }}>
                                                                    <BorderBottom color={tempFootLogoPos === 'BOTTOM' ? 'primary' : 'inherit'}/>
                                                                </IconButton>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                                <Grid container justify='center' style={{marginTop: 10}}>
                                                    {
                                                        editTemplate ?
                                                            <div style={{padding: 10, border: '1px solid #eee', borderRadius: 1000}}>
                                                                <input
                                                                    accept="image/*"
                                                                    id="uploadFoot"
                                                                    style={{display: 'none'}}
                                                                    type="file"
                                                                    onChange={event => {
                                                                        const reader = new FileReader();
                                                                        reader.readAsArrayBuffer(event.target.files[0]);
                                                                        reader.onload = () => {
                                                                            let array = new Uint8Array(reader.result)
                                                                            if (array.length < 300000) {
                                                                                setTempFootLogo(btoa(new Uint8Array(reader.result).reduce((data, byte) => data + String.fromCharCode(byte), '')))
                                                                            } else {
                                                                                alert(t("settings.fileSizeError"))
                                                                            }
                                                                        };
                                                                    }}
                                                                />
                                                                <label htmlFor="uploadFoot">
                                                                    {
                                                                        tempFootLogo ?  <img src={`data:image/jpg;base64,${tempFootLogo}`} style={{
                                                                            overflow: 'hidden',
                                                                            width: 40,
                                                                            height: 40,
                                                                            objectFit: 'contain'
                                                                        }} alt=''/> : <CloudUploadOutlined color='inherit' style={{width: 40, height: 40, color: '#555'}}/>
                                                                    }
                                                                </label>
                                                            </div>
                                                            :
                                                            <div style={{padding: 10, border: '1px solid #eee', borderRadius: 1000}}>

                                                                {
                                                                    tempFootLogo ? <img src={`data:image/jpg;base64,${tempFootLogo}`} style={{
                                                                        overflow: 'hidden',
                                                                        width: 40,
                                                                        height: 40,
                                                                        objectFit: 'contain'
                                                                    }} alt='logo'/>  :  <CloudUploadOutlined color='inherit' style={{width: 40, height: 40, color: '#555'}}/>
                                                                }
                                                            </div>
                                                    }
                                                </Grid>
                                                <div style={{height: 20}}/>
                                                <div style={{ maxWidth: 400 }}>
                                                    {
                                                        editTemplate ?
                                                            (
                                                                <TextField
                                                                    variant='outlined'
                                                                    fullWidth
                                                                    label={t("settings.headerText")}
                                                                    value={tempFootText}
                                                                    onChange={event => {
                                                                        setTempFootText(event.target.value)
                                                                    }}
                                                                    multiline
                                                                    rowsMax={2}
                                                                    inputProps={{
                                                                        maxLength: 90
                                                                    }}
                                                                />

                                                            )
                                                            :
                                                            (
                                                                <Typography variant='h4' style={{color: '#555', fontSize: 16, overflow: 'hidden'}}>
                                                                    {tempFootText || t("settings.footerText")}
                                                                </Typography>
                                                            )
                                                    }
                                                </div>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12} sm={8} md={6} lg={3} style={{paddingLeft: 20}}>
                                        <ChequeTemplate
                                            header={{
                                                text: tempHeadText,
                                                icon: tempHeadLogo ? (<img src={`data:image/jpg;base64,${tempHeadLogo}`} style={{ maxHeight: 50, maxWidth: 80 }} alt=''/>) : undefined,
                                                type: tempHeadLogoPos
                                            }}
                                            footer={{
                                                text: tempFootText,
                                                icon: tempFootLogo ? (<img src={`data:image/jpg;base64,${tempFootLogo}`} style={{ maxHeight: 50, maxWidth: 80 }} alt=''/>) : undefined,
                                                type: tempFootLogoPos
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </DetailSection>
                        </Paper>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
};

export default withNotification(Settings);