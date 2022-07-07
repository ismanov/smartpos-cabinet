import React, {useState, useEffect} from "react";
import { Grid, Popover, Checkbox, FormControlLabel } from "@material-ui/core";
import {useTranslation} from "react-i18next";

let days = [];
for (var i = 1; i <= 31; i++) {
    days.push(i)
}

const DaysPopover = props => {

    const { t } = useTranslation();

    const [selected, setSelected] = useState([]);
    const [even, setEven] = useState(false);
    const [odd, setOdd] = useState(false);
    const [all, setAll] = useState(false);

    useEffect(() => {
        if (selected.filter(i => i%2 === 0).length === 15) {
            setEven(true);
        } else {
            setEven(false)
        }

        if (selected.filter(i => i%2 !== 0).length === 16) {
            setOdd(true);
        } else {
            setOdd(false);
        }
        if (selected.length === 31) {
            setAll(true);
        } else {
            setAll(false);
        }
        props.onDaysSelected && props.onDaysSelected(selected);
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
                <Grid container>
                    <Grid item xs={4}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    color="primary"
                                    inputProps={{ 'aria-label': 'primary checkbox' }}
                                    checked={all}
                                    onChange={(e) => {
                                        let s = [...selected];
                                        if (e.target.checked) {
                                            days.forEach(i => {
                                                if (!s.includes(i)) {
                                                    s.push(i)
                                                }
                                            })
                                        } else {
                                            s = [];
                                        }
                                        setSelected(s);
                                    }}
                                />}
                            label={t("discount.all_title")}
                            style={{color: '#555'}}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    color="primary"
                                    inputProps={{ 'aria-label': 'primary checkbox' }} />}
                                    label={t("discount.even")}
                                    style={{color: '#555'}}
                                    checked={even}
                                    onChange={(e) => {
                                        let s = [...selected];
                                        if (e.target.checked) {
                                            days.forEach(i => {
                                                if (i % 2 === 0 && !s.includes(i)) {
                                                    s.push(i)
                                                }
                                            })

                                        } else {
                                            s = s.filter(i => i%2 !== 0);
                                        }
                                        setSelected(s);
                                    }}
                                />
                    </Grid>
                    <Grid item xs={4}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    color="primary"
                                    inputProps={{ 'aria-label': 'primary checkbox' }} />}
                                    label={t("discount.odd")}
                                    style={{color: '#555'}}
                                    checked={odd}
                                    onChange={(e) => {
                                        let s = [...selected];
                                        if (e.target.checked) {
                                            days.forEach(i => {
                                                if (i % 2 !== 0 && !s.includes(i)) {
                                                    s.push(i)
                                                }
                                            })

                                        } else {
                                            s = s.filter(i => i%2 === 0);
                                        }
                                        setSelected(s);
                                    }}
                                />
                    </Grid>
                </Grid>
                <Grid container style={{marginTop: 15}}>
                    {
                        days.map(d => (
                            <Grid item xs={3}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            color="primary"
                                            inputProps={{ 'aria-label': 'primary checkbox' }}
                                            checked={selected.includes(d)}
                                            onChange={e => {
                                                let s = [...selected];
                                                if (e.target.checked) {
                                                    s.push(d);
                                                } else {
                                                    s.splice(s.indexOf(d), 1);
                                                }
                                                setSelected(s);
                                            }}
                                        />}
                                    label={`${d}`}
                                    style={{color: '#555'}}
                                />
                            </Grid>
                        ))
                    }
                </Grid>
            </Grid>
        </Popover>

    )
};

export default DaysPopover;
