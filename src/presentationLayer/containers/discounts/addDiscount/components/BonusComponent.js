import React, {useState, useEffect} from "react";
import {Grid, Button, Checkbox, FormControlLabel, IconButton, Tooltip, withStyles, } from "@material-ui/core";
import QuestionIcon from './QuestionIcon';
import { Delete, Add } from "@material-ui/icons";
import SelectBox from "../../../../components/SelectBox";
import {useTranslation} from "react-i18next";
import NumberTextField from "../../../../components/Textfields/NumberTextField";

const LightTooltip = withStyles((theme) => ({
    tooltip: {
      backgroundColor: theme.palette.common.white,
      color: 'rgba(0, 0, 0, 0.87)',
      boxShadow: theme.shadows[1],
      fontSize: 11,
    },
  }))(Tooltip);

const BonusComponent = props => {

    const { t } = useTranslation();
    const { data = [] } = props;
    const [current, setCurrent] = useState({unit: 0, count: 1});

    useEffect(() => {
        if (props.type !== "add" && current.item) {
            props.onAction && props.onAction(current)
        }
    }, [current]);

    useEffect(() => {
        if (current && current.item && current.item.discountType === 0) {
            let found = (props.conditions || []).find(c => current.item && current.item.product && c.discountType === 0 && c.product.id === current.item.product.id);
            if (found) {
                if (current.count > found.from) {
                    setCurrent({...current, count: found.from});
                }
            }
        }
    }, [props.conditions]);
    useEffect(() => {
        if (current && current.item && current.item.discountType === 1) {
            if (current.discount > props.basketMaxSum) {
                setCurrent({...current, discount: props.basketMaxSum})
            }
        }
    }, [props.basketMaxSum]);

    useEffect(() => {
        if (props.current && !current.item) {
            setCurrent(props.current)
        }
    }, [props.current]);
    
    const isValid = () => {
        return current.item && (current.item.discountType === 1 || (current.item.discountType === 0 && current.count >= 0)) && current.unit >= 0 && current.discount > 0
    };

    let sorted = data.sort((a, b) => {
        return a.discountType > b.discountType ? -1 : 1
    }).map((d, i) => ({
        ...d,
        id: i,
        name: `${d.discountType === 0 ? t("discount.product") : t("discount.basket")} ${d.discountType === 0 ? '-' : ''} ${d.discountType === 0 ? `${d.product && d.product.name}, ${d.unit && d.unit.name}` : ''}`
    }));

    let index = '';
    if (current && current.item) {
        sorted.forEach((s, i) => {
            if (current.item.discountType === 0) {
                if (s.product && s.product.id === current.item.product.id && s.unit && s.unit.id === current.item.unit.id) {
                    index = i
                }
            } else {
                if (s.discountType === 1) {
                    index = i
                }
            }
        });
    }

    return (
        <Grid container style={{borderRight: '1px solid #eee'}}>
            <p style={{ fontWeight: 600, fontSize: 16, color: '#777', marginTop: 20 }}> {t("discount.bonuses")} </p>
            <Grid container style={{marginTop: 10}}>
                <Grid xs={9}>
                    <SelectBox
                        itemKey="id"
                        itemValue="name"
                        data={sorted}
                        label={t("discount.bonus_selectbox_title")}
                        disabled={props.disabled}
                        onChange={item => {
                            let f = sorted[item.target.value];
                            if (f) {
                                setCurrent({...current, item: f})
                            }
                        }}
                        value={index}
                    />
                </Grid>
            </Grid>
            {current.item && current.item.discountType === 0 ? (
                <Grid container alignItems="center">
                    <FormControlLabel
                        control={
                            <Checkbox
                                color="primary"
                                disabled={props.disabled}
                                inputProps={{ 'aria-label': 'primary checkbox' }} />}
                        label={t("discount.to_all_qty")}
                        style={{color: '#555'}}
                        checked={current.toAllQty}
                        onChange={(e) => {
                            setCurrent({...current, toAllQty: !current.toAllQty})
                        }}
                    />
                    <LightTooltip 
                        title={
                            <React.Fragment style={{
                                backgroundColor: "#f8f8f8"
                            }}>
                                <div style={{ fontSize: 14, fontWeight: "bold", fontStyle: "italic" }}> { t("discount.tooltip_title") } </div>
                                <br />
                                <div style={{ fontSize: 12, marginTop: 5 }}>
                                    { t("discount.all_count") }
                                </div>                                
                            </React.Fragment>
                        } 
                        placement="right"
                        style={{marginLeft: -15}}
                        >
                        <IconButton>
                            <QuestionIcon />
                        </IconButton>
                    </LightTooltip>
                </Grid>
            ) : undefined}

            <Grid container style={{marginTop: 20}}>
                {current.item && current.item.discountType === 0 ? (
                    <Grid item xs={3}>
                        <NumberTextField
                            fullWidth
                            variant="outlined"
                            disabled={props.disabled || current.toAllQty}
                            label={t("discount.qty")}
                            onChange={e => {
                                setCurrent({...current, count: e.target.value});
                            }}
                            value={current.toAllQty ? '' : current.count}
                            onBlur={() => {
                                if (current.item.discountType === 0) {
                                    let found = (props.conditions || []).find(c => current.item && current.item.product && c.discountType === 0 && c.product.id === current.item.product.id);
                                    if (found) {
                                        if (Number(current.count) > Number(found.from)) {
                                            setCurrent({...current, count: found.from});
                                        }
                                    }
                                }
                            }}
                        />
                    </Grid>
                ) : undefined}

                <Grid item xs={current.item && current.item.discountType === 0 ? 3 : 4} style={{paddingLeft: current.item && current.item.discountType === 0 ? 10 : 0}}>
                    <SelectBox
                        itemKey="id"
                        itemValue="name"
                        data={[
                            {
                                id: 0,
                                name: "%"
                            },
                            {
                                id: 1,
                                name: t("common.sum")
                            }
                        ]}
                        label={t("discount.type")}
                        disabled={props.disabled || !current.item}
                        onChange={e => {
                            let d = current.discount;
                            if (e.target.value === 0 && d > 100) {
                                d = 100;
                            }
                            setCurrent({...current, unit: e.target.value >= 0 ? e.target.value : 0, discount: d})
                        }}
                        value={current.unit || 0}
                    />
                </Grid>
                <Grid item xs={current.item && current.item.discountType === 0 ? 3 : 5} style={{paddingLeft: 10}}>
                    <NumberTextField
                        fullWidth
                        variant="outlined"
                        disabled={props.disabled || !current.item}
                        label={t("discount.sale")}
                        onChange={e => {
                            setCurrent({...current, discount: e.target.value < 0 ? 0 : e.target.value});
                        }}
                        value={current.discount || ''}
                        onBlur={() => {
                            if (current.unit === 0 && current.discount > 100) {
                                setCurrent({...current, discount: 100});
                            }
                            if (current.unit === 0 && current.discount < 0) {
                                setCurrent({...current, discount: 0});
                            }
                            if (current.item.discountType === 0 && current.unit === 1 && current.discount > props.productMaxSum) {
                                setCurrent({...current, discount: props.productMaxSum});
                            } else if (current.item.discountType === 1 && current.unit === 1 && current.discount > props.basketMaxSum) {
                                setCurrent({...current, discount: props.basketMaxSum});
                            }

                        }}
                    />
                </Grid>
            </Grid>
            <Grid container style={{marginTop: 10}}>
                <Grid item xs={9}>
                    <Button
                        disabled={props.disabled || props.type === 'add' && !isValid()}
                        variant="contained"
                        color={props.type === "add" ? "primary" : "secondary"}
                        fullWidth
                        onClick={() => {
                            if (props.type === "add") {
                                props.onAction && props.onAction({...current})
                            } else {
                                props.onRemove && props.onRemove(current)
                            }
                            setCurrent({count: 1, unit: 0, discount: undefined})
                        }}
                        startIcon={props.type === "add" ? <Add /> : <Delete /> }
                    >
                        { props.type === "add" ? t("incomeDetail.add") : t("discount.remove") }
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    )
};

export default BonusComponent;
