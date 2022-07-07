import React, {useState, useEffect} from "react";
import { Grid, Popover, Checkbox, FormControlLabel } from "@material-ui/core";
import {useTranslation} from "react-i18next";

export function weekdays(t) {
    return [
        {
            value: 1,
            name: t("discount.monday"),
            abbr: t("discount.monday_abbr")
        },
        {
            value: 2,
            name: t("discount.tuesday"),
            abbr: t("discount.tuesday_abbr")
        },
        {
            value: 3,
            name: t("discount.wednesday"),
            abbr: t("discount.wednesday_abbr")
        },
        {
            value: 4,
            name: t("discount.thursday"),
            abbr: t("discount.thursday_abbr")
        },
        {
            value: 5,
            name: t("discount.friday"),
            abbr: t("discount.friday_abbr")
        },
        {
            value: 6,
            name: t("discount.saturday"),
            abbr: t("discount.saturday_abbr")
        },
        {
            value: 7,
            name: t("discount.sunday"),
            abbr: t("discount.sunday_abbr")
        }
    ]
}


const WeekdaysPopover = props => {

    const { t } = useTranslation();
    const [selected, setSelected] = useState([]);
    const w = weekdays(t);

    useEffect(() => {
        props.onDaysSelected && props.onDaysSelected(selected)

    }, [selected]);

    useEffect(() => {
        if (props.value && props.value.length) {
            setSelected(props.value)
        }
    }, [props.value]);


    return (
        <Popover
            {...props}
            id={props.open ? 'simple-popover' : undefined}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
        >
            <Grid container style={{padding: 15, width: 450}}>
                {
                    w.map(weekday => (
                        <Grid item xs={12} style={{marginTop: 8}}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        color="primary"
                                        inputProps={{ 'aria-label': 'primary checkbox' }}
                                        checked={selected.includes(weekday.value)}
                                        onChange={(e) => {
                                            let s = [...selected];
                                            if (e.target.checked) {
                                                s.push(weekday.value)
                                            } else {
                                                s.splice(s.indexOf(weekday.value), 1)
                                            }
                                            setSelected(s);
                                        }}
                                    />}
                                label={weekday.name}
                                style={{color: '#555'}}
                            />
                        </Grid>
                    ))
                }
            </Grid>
        </Popover>

    )
};

export default WeekdaysPopover;
