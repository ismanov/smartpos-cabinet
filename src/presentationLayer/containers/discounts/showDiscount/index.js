import React, {useState, useEffect} from "react";
import { withRouter } from 'react-router-dom';
import {
    Button,
    Checkbox,
    FormControlLabel,
    Grid,
    IconButton,
    Paper,
    TextField
} from '@material-ui/core';
import {ArrowBackIos} from '@material-ui/icons';
import {useTranslation} from "react-i18next";
import DatePicker from "../../../components/Pickers/datepicker";
import SelectBox from "../../../components/SelectBox";
import DaysPopover from "../addDiscount/components/daysPopover";
import WeekdaysPopover, { weekdays } from "../addDiscount/components/weekdaysPopover";
import {useDispatch, useSelector} from "react-redux";
import ConditionsComponent from "../addDiscount/components/ConditionsComponent";
import BonusComponent from "../addDiscount/components/BonusComponent";
import withNotification from "../../../hocs/withNotification/WithNotification";
import {changeStatus, fetchDiscountById, setDiscountInfo, updateDiscount} from "./actions";
import QuestionDialog from "../../../components/Dialog/question";
import moment from "moment";

const InfoDiscount = props => {

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const currentBranch = useSelector(state => state.get("dashboard").currentBranch);

    const [dayMode, setDayMode] = useState(0);
    const [daysAnchorElement, setDaysAnchorElement] = useState(null);
    const [weekdaysAnchorElement, setWeekdaysAnchorElement] = useState(null);
    const [selected, setSelected] = useState([]);
    const [weekdaysSelected, setWeekdaysSelected] = useState([]);
    const [daysTitle, setDaysTitle] = useState();
    const [conditionList, setConditionList] = useState([]);
    const [bonusList, setBonusList] = useState([]);
    const [discountName, setDiscountName] = useState();
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(null);
    const [nds, setNds] = useState(false);
    const [repeatCount, setRepeatCount] = useState(false);
    const [operation, setOperation] = useState();

    const [editMode, setEditMode] = useState(false);

    const daysOpen = Boolean(daysAnchorElement);
    const weekDaysOpen = Boolean(weekdaysAnchorElement);

    const discount = useSelector(state => state.get("discountInfo").discount);

    useEffect(() => {
        if (props.match && props.match.params) {
            let id = props.match.params["discountId"];
            if (id >= 0) {
                dispatch(fetchDiscountById(id))
            } else {
                props.history.goBack()
            }
        } else {
            props.history.goBack()
        }
        return () => {
            dispatch(setDiscountInfo(undefined))
        }
    }, []);

    useEffect(() => {
        if (discount && !conditionList.length) {
            setRepeatCount(discount.countRepetitions);
            setNds(discount.includeVAT);
            setDiscountName(discount.name);

            let d;

            switch (discount.repeatType) {
                case "DAILY":
                    d = 0;
                    break;
                case "WEEKDAYS":
                    d = 1;
                    setWeekdaysSelected(discount.repeats);
                    break;
                case "MONTH_DAYS":
                    d = 2;
                    setSelected(discount.repeats);
                    break;
                default:
                    break
            }

            setDayMode(d);

            setStartDate(moment(discount.dateFrom).toDate());
            if (discount.dateTo) {
                setEndDate(moment(discount.dateTo).toDate());
            }

            setBonusList((discount.bonuses || []).map(b => ({
                discount: b.bonusAmount,
                item: {
                    discountType: b.bonusOn === "PRODUCT" ? 0 : 1,
                    product: {
                        id: b.bonusProductId,
                        name: b.bonusProductName,

                    },
                    unit: {
                        id: b.unitId,
                        name: b.productUnitName
                    }
                },
                unit: b.bonusType === 'PERCENTAGE' ? 0 : 1,
                count: b.productCount,
                toAllQty: b.allProducts
            })));            

            setConditionList(discount.conditions.map(c => ({
                discountType: c.promotionOn === "PRODUCT" ? 0 : 1,
                from: c.amount,
                to: c.amountTo,
                product: {
                    id: c.promotedProductId,
                    name: c.promotedProductName
                },
                unit: {
                    id: c.unitId,
                    name: c.unitName,
                    price: c.salesPrice
                }                
            })));
        }
    }, [discount]);

    useEffect(() => {
        if (dayMode === 2) {
            let title = selected.length === 31 ? t("discount.every_day") : '';
            if (!title) {
                setDaysTitle(`${t("discount.selected_days")}: ${selected.length}`)
            } else {
                setDaysTitle(title)
            }
        } else if (dayMode === 1) {
            let title = weekdaysSelected && weekdaysSelected.length === 7 ? t("discount.every_day") : '';
            if (!title) {
                title = weekdaysSelected && weekdaysSelected.map(s => {
                    let f = weekdays(t).find(w => w.value === s);
                    if (f) {
                        return f.abbr
                    } else {
                        return ""
                    }
                }).join(', ');
            }
            setDaysTitle(title)
        }
    }, [selected, weekdaysSelected]);

    // conditions
    let filteredConditionList = conditionList.filter(f => {
        let found = bonusList.find(b => b.item.product && f.product && f.unit && b.item.unit && b.item.product.id === f.product.id && f.unit.id === b.item.unit.id);
        return !found
    });

    if (bonusList.length && bonusList.filter(d => d.item.discountType === 0).length > 0) {
        filteredConditionList = filteredConditionList.filter(f => f.discountType !== 1);
    }

    const isValid = () => {
        if (!discountName) return false;
        if (dayMode === 1 && !weekdaysSelected.length) return false;
        if (dayMode === 2 && !selected.length) return false;
        return !(endDate && moment(startDate).isAfter(moment(endDate).format("YYYY-MM-DDTHH:mm")));
    };

    return (
        <Grid container>
            <QuestionDialog
                title={t("common.warning")}
                message={operation && operation.message}
                open={!!operation}
                onNegative={() => {
                    setOperation(undefined);
                }}
                onPositive={() => {
                    dispatch(operation.action)
                    setOperation(undefined);
                }}
            />
            <DaysPopover
                open={daysOpen}
                anchorEl={daysAnchorElement}
                onClose={() => {
                    setDaysAnchorElement(null);
                }}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                onDaysSelected={selected => {
                    setSelected(selected)
                }}
                value={selected}
            />

            <WeekdaysPopover
                open={weekDaysOpen}
                anchorEl={weekdaysAnchorElement}
                onClose={() => {
                    setWeekdaysAnchorElement(null);
                }}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                onDaysSelected={selected => {
                    setWeekdaysSelected(selected)
                }}
                value={weekdaysSelected}
            />

            <Grid container alignItems="center" style={{marginTop: 10}}>
                <Grid item>
                    <IconButton
                        color="primary"
                        onClick={() => {
                            props.history.goBack()
                        }}
                    >
                        <ArrowBackIos />
                    </IconButton>
                </Grid>
                <Grid item style={{fontWeight: 'bold'}}>
                    { t("discount.detail") }
                </Grid>
            </Grid>
            <Grid container style={{marginTop: 15}}>
                <Paper style={{ width: '100%', padding: 20 }}>
                    <p style={{ fontSize: 15, fontWeight: 600, color: '#777' }}>
                        {t("discount.common_info")}
                    </p>

                    <Grid container style={{marginTop: 20}}>
                        <Grid item xs={3}>
                            <TextField
                                variant="outlined"
                                label={t("discount.discount_name")}
                                fullWidth
                                disabled={!editMode}
                                onChange={e => {
                                    setDiscountName(e.target.value)
                                }}
                                value={discountName || ''}
                            />
                        </Grid>
                    </Grid>

                    <Grid container style={{marginTop: 20}}>
                        <Grid item xs={3}>
                            <DatePicker
                                label={t("discount.start")}
                                onChange={date => {
                                    setStartDate(date);
                                    if (endDate) {
                                        let s = moment(date);
                                        let e = moment(endDate);
                                        if (e.isBefore(s)) {
                                            setEndDate(date)
                                        }
                                    }
                                }}
                                disabled={!editMode}
                                value={startDate}
                            />
                        </Grid>
                        <Grid item xs={3} style={{paddingLeft: 10}}>
                            <DatePicker
                                label={t("discount.end")}
                                onChange={date => {
                                    let s = moment(startDate);
                                    let e = moment(date);
                                    if (e.isBefore(s)) {
                                        setEndDate(startDate)
                                    } else {
                                        setEndDate(date)
                                    }
                                }}
                                value={endDate}
                                disabled={!editMode}
                                onClear={() => {
                                    setEndDate(null)
                                }}
                            />
                        </Grid>
                    </Grid>
                    <Grid container style={{marginTop: 20}}>
                        <Grid item xs={3}>
                            <SelectBox
                                itemKey="id"
                                itemValue="name"
                                data={
                                    [
                                        {
                                            id: 0,
                                            name: t("discount.every_day")
                                        },
                                        {
                                            id: 1,
                                            name: t("discount.week_day")
                                        },
                                        {
                                            id: 2,
                                            name: t("discount.days")
                                        }
                                    ]
                                }
                                disabled={!editMode}
                                onChange={e => {
                                    setDaysTitle('');
                                    setDayMode(e.target.value || 0)
                                }}
                                value={dayMode}
                            />
                        </Grid>
                        {
                            dayMode === 1 ? (<Grid item xs={3} style={{paddingLeft: 10}}>
                                <TextField
                                    InputProps={{ readOnly: true }}
                                    fullWidth
                                    variant="outlined"
                                    label={t("discount.week_day")}
                                    onClick={(e) => {
                                        if (editMode) {
                                            setWeekdaysAnchorElement(e.currentTarget);
                                        }
                                    }}
                                    disabled={!editMode}
                                    value={daysTitle}
                                />
                            </Grid>) : undefined
                        }
                        {
                            dayMode === 2 ? (<Grid item xs={3} style={{paddingLeft: 10}}>
                                <TextField
                                    InputProps={{ readOnly: true }}
                                    fullWidth
                                    variant="outlined"
                                    label={t("discount.days")}
                                    onClick={(e) => {
                                        if (editMode) {
                                            setDaysAnchorElement(e.currentTarget);
                                        }
                                    }}
                                    disabled={!editMode}
                                    value={daysTitle}
                                />
                            </Grid>) : undefined
                        }
                    </Grid>

                    <hr style={{marginTop: 20}} />
                    <Grid container style={{marginTop: 20}}>
                        <Grid item md={6} xs={12}>
                            { conditionList && conditionList.map((c, i) => {                                
                                return (
                                    <Grid container style={{marginTop: 20}}>
                                        <ConditionsComponent
                                            current={c}
                                            branchId={currentBranch}
                                            disabled={true}
                                            onAction={(item) => {
                                                let c = [...conditionList];
                                                c[i] = {...item};
                                                setConditionList(c);
                                            }}
                                            onRemove={_ => {
                                                let c = [...conditionList];
                                                c.splice(i, 1);
                                                setConditionList(c)
                                            }}
                                        />
                                    </Grid>
                                )
                            })}
                        </Grid>
                        <Grid item md={6} xs={12} style={{paddingLeft: 20}}>
                            { bonusList && bonusList.map((c, i) => {
                                let f = conditionList.find(t => {
                                    if (c.item.discountType === 0) {
                                        return t.product && t.product.id === c.item.product.id && t.unit && t.unit.id === c.item.unit.id
                                    } else {
                                        return t.discountType === c.item.discountType
                                    }
                                });
                                return (
                                    <Grid container style={{marginTop: 20}}>
                                        <BonusComponent
                                            data={[...filteredConditionList, f].filter(f => !!f)}
                                            current={c}
                                            branchId={currentBranch}
                                            disabled={true}
                                            onAction={(item) => {
                                                let b = [...bonusList];
                                                b[i] = {...item};
                                                setBonusList(b)
                                            }}
                                            onRemove={_ => {
                                                let b = [...bonusList];
                                                b.splice(i, 1);
                                                setBonusList(b);
                                            }}
                                        />
                                    </Grid>
                                )
                            })}
                        </Grid>
                    </Grid>
                    <Grid container style={{marginTop: 20}}>
                        <FormControlLabel
                                    control={
                                        <Checkbox
                                            color="primary"
                                            inputProps={{ 'aria-label': 'primary checkbox' }}
                                        />}
                                    label={t("discount.nds_desc")}
                                    style={{color: '#555'}}
                                    checked={nds}
                                    disabled={true}
                                    onChange={_ => {
                                        setNds(!nds)
                                    }}
                                />
                    </Grid>
                    <Grid container style={{marginTop: 10}}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    color="primary"
                                    inputProps={{ 'aria-label': 'primary checkbox' }} />}
                                    label={t("discount.repeat_desc")}
                                    style={{color: '#555'}}
                                    checked={repeatCount}
                                    disabled={true}
                                />
                    </Grid>
                </Paper>
                {editMode ? (
                    <Grid container style={{marginTop: 20, marginBottom: 20}} justify="flex-end">

                        <Grid item xs={2}>
                            <Button
                                variant="contained"
                                color="secondary"
                                fullWidth
                                onClick={() => {
                                    setEditMode(false)
                                }}
                            > {t("common.cancel")} </Button>
                        </Grid>
                        <Grid item xs={2} style={{paddingLeft: 10}}>
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                disabled={!isValid()}
                                onClick={() => {
                                    let repeatType, s;
                                    switch (dayMode) {
                                        case 0:
                                            repeatType = "DAILY";
                                            s = undefined;
                                            break;
                                        case 1:
                                            repeatType = "WEEKDAYS";
                                            s = weekdaysSelected;
                                            break;
                                        case 2:
                                            repeatType = "MONTH_DAYS";
                                            s = selected;
                                            break;
                                        default:
                                            break
                                    }
                                    dispatch(updateDiscount({
                                        ...discount,
                                        name: discountName,
                                        includeVAT: nds,
                                        repeatType: repeatType,
                                        repeats: s,
                                        countRepetitions: repeatCount,
                                        dateFrom: startDate ? moment(startDate).format("YYYY-MM-DDTHH:mm") : undefined,
                                        dateTo: endDate ? moment(endDate).format("YYYY-MM-DDTHH:mm") : undefined
                                    }, () => { setEditMode(false) }));
                                }}
                            > {t("common.save")} </Button>
                        </Grid>
                    </Grid>
                ) : undefined}
                {!editMode && discount && discount.promotionStatus && discount.promotionStatus !== "CANCELLED" && discount.promotionStatus !== "ENDED" ? (
                    <Grid container style={{marginTop: 20, marginBottom: 20}} justify="flex-end">
                        {discount && discount.promotionStatus && (discount.promotionStatus === "PAUSED" || discount.promotionStatus === "PLANNED") ? (
                            <Grid item xs={2}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    onClick={() => {
                                        setOperation({
                                            message: t("discount.activeDiscountTitle"),
                                            action: changeStatus(discount.id, "ACTIVE")
                                        })
                                    }}
                                > {t("discount.active_action")} </Button>
                            </Grid>
                        ) : (
                            <Grid item xs={2}>
                                <Button
                                    variant="contained"
                                    color="inherit"
                                    style={{backgroundColor: 'orange', color: 'white'}}
                                    fullWidth
                                    onClick={() => {
                                        setOperation({
                                            message: t("discount.stopDiscountTitle"),
                                            action: changeStatus(discount.id, "PAUSED")
                                        })
                                    }}
                                > {t("discount.stop")} </Button>
                            </Grid>
                        )}
                        <Grid item xs={2} style={{paddingLeft: 10}}>
                            <Button
                                variant="contained"
                                color="secondary"
                                fullWidth
                                onClick={() => {
                                    setOperation({
                                        message: t("discount.cancelDiscountTitle"),
                                        action: changeStatus(discount.id, "CANCELLED")
                                    })
                                }}
                            > {t("discount.dismiss")} </Button>
                        </Grid>
                        <Grid item xs={2} style={{paddingLeft: 10}}>
                            <Button
                                variant="contained"
                                color="inherit"
                                style={{backgroundColor: 'blue', color: 'white'}}
                                fullWidth
                                onClick={() => {
                                    setEditMode(true)
                                }}
                            > {t("discount.edit")} </Button>
                        </Grid>
                    </Grid>) : undefined}
            </Grid>
        </Grid>
    )
};

export default withRouter(withNotification(InfoDiscount));