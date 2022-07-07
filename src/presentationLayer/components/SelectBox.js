import React from 'react';
import { Select, InputLabel, FormControl, MenuItem, FormHelperText, makeStyles, CircularProgress, OutlinedInput, Input, useTheme, } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import * as R from "ramda";
import PropTypes from 'prop-types';

const pickColor = R.cond([
    [R.anyPass([R.equals("primary"), R.isNil]), (_, theme) => theme.palette.primary.main],
    [(color) => R.equals("secondary", color), (_, theme) => theme.palette.secondary.main],
    [R.T, (color) => color],
]);

const useStyles = color => makeStyles(({
    root: {
        "& $notchedOutline": {
            borderColor: color,
        },
        "&:hover $notchedOutline": {
            borderColor: color,
        },
        "&$focused $notchedOutline": {
            borderColor: color,
        },
    },
    focused: {},
    notchedOutline: {},
}))()

const SelectBox = props => {

    return R.pipe(
        props => R.mergeDeepLeft({ 
            translator: R.prop("t", useTranslation()), 
            classes: useStyles(pickColor(props.color, useTheme())), 
            value: Boolean(props.selectAll) && R.isNil(props.value) ? "all" : props.value,
        }, props),               
        (props) => R.mergeDeepLeft({ 
            items: [
                props.selectAll ? (<MenuItem value="all">
                    <em>{ props.translator("components.not_selected") }</em>
                </MenuItem>) : undefined, 
                ...props.data.map((row, index) => (<MenuItem key={`${props.itemKey}${index}`} value={row[props.itemKey]}>{row[props.itemValue]}</MenuItem>))
                ].filter(Boolean),
        }, props),
        (props) => R.mergeDeepLeft({ 
            input: R.ifElse(
                R.propEq("variant", "outlined"),
                (props) => <OutlinedInput id="common-selectbox" label={props.label} labelWidth={props.labelWidth} classes={props.classes} />,
                (props) => <Input id="common-selectbox" classes={props.classes} />
                )(props)
        }, props),
        R.pick(["translator", "variant", "color", "label", "value", "isLoading", "onChange", "selectAll", "data", "itemKey", "itemValue", "error", "helperText", "items", "input", ]),        
        ({ variant, onChange, selectAll, label, value,  isLoading, error, helperText, items, input, ...others }) =>  (
            <FormControl variant={variant} fullWidth error={error}>
                <InputLabel htmlFor="common-selectbox">{label}</InputLabel>
                <Select
                    {...others}
                    fullWidth
                    value={value}
                    IconComponent={isLoading ? <CircularProgress variant="indeterminate" color="primary" /> : undefined}
                    input={input}
                    onChange={
                        R.ifElse(
                            () => Boolean(selectAll),
                            () => onChange && onChange({target: { value: undefined }}),
                            (e) => onChange && onChange(e)
                        ) 
                    }
                >
                    { items }
                </Select>
                <FormHelperText color="secondary">{helperText}</FormHelperText>
            </FormControl>            
        )
        
    )(props)
};

SelectBox.defaultProps = {
    variant: "outlined",
    color: "primary",
};

SelectBox.propTypes = {
    itemKey: PropTypes.string.isRequired,
    itemValue: PropTypes.string.isRequired,
    data: PropTypes.array.isRequired,
    style: PropTypes.object,
    className: PropTypes.string,
    error: PropTypes.string,
    variant: PropTypes.oneOf(["outlined", "standart"]),
    color: PropTypes.string,
    value: PropTypes.any,
    onChange: PropTypes.func,
    label: PropTypes.string,
    selectAll: PropTypes.bool,
};


export default SelectBox;
