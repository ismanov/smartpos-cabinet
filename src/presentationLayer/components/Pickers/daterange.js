import React, {useState, useEffect} from 'react';
import {Popover, IconButton} from '@material-ui/core';
import TextButton from "#components/Buttons/text";
import {Close} from "@material-ui/icons";
import {makeStyles} from "@material-ui/core";
import {DateRange} from 'react-date-range';
import locale from 'date-fns/locale/ru';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import Tooltip from '@material-ui/core/Tooltip';
import {useTranslation} from "react-i18next";


const useStyles = makeStyles(theme => ({
    filterBtn: {
        padding: '10px',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderRadius: 6,
        color: theme.palette.primary.main,
        borderColor: theme.palette.primary.main,
        marginRight: '10px'

    },
    selectedBtn: {
        padding: '10px',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderRadius: 6,
        backgroundColor: theme.palette.primary.main,
        borderColor: 'transparent',
        color: "#fff",
        marginRight: '10px',
        "&:hover,&:focus": {
            backgroundColor: theme.palette.primary.main,
        }
    }
}));

const moment = require('moment');


/**
 * @deprecated
 * use ../button.js
 */
const RangePicker = (props) => {
    const classes = useStyles();
    const [range, setRange] = useState({
        startDate: moment().startOf('month').toDate(),
        endDate: moment().endOf('month').toDate(),
        key: 'selection'
    });

    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState();
    const {t} = useTranslation();


    useEffect(() => {
        if (props.value) {
            setRange(props.value);
        }
    }, [props.value]);

    const formatRange = (range) => {
        let start = moment(range.startDate);
        let end = moment(range.endDate);
        if (start.year() === end.year() && start.month() === end.month() && start.date() === end.date()) {
            return `${start.locale('ru').format('DD MMM YYYY')}`
        } else {
            return `${start.locale('ru').format('DD MMM YYYY')} - ${end.locale('ru').format('DD MMM YYYY')}`
        }
    };

    const checkPeriod = (startDate, endDate) => {
        const formatString = 'YYYY-MM-DDTHH:mm:ss';
        if (
            moment(startDate).format(formatString) === moment().startOf('day').format(formatString) &&
            moment(endDate).format(formatString) === moment().endOf('day').format(formatString)
        ) {
            return 0
        } else if (
            moment().subtract(1, 'days').startOf('day').format(formatString) === moment(startDate).format(formatString) &&
            moment().subtract(1, 'days').endOf('day').format(formatString) === moment(endDate).format(formatString)
        ) {
            return 1
        } else if (
            moment().startOf('isoWeek').format(formatString) === moment(startDate).format(formatString) &&
            moment().endOf('isoWeek').format(formatString) === moment(endDate).format(formatString)
        ) {
            return 2
        } else if (
            moment().startOf('month').format(formatString) === moment(startDate).format(formatString) &&
            moment().endOf('month').format(formatString) === moment(endDate).format(formatString)
        ) {
            return 3
        } else {
            return -1
        }
    };
    return (
        <div>
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={() => setOpen(false)}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                style={{
                    padding: 20
                }}
            >
                <DateRange
                    ranges={[{
                        startDate: new Date(range.startDate),
                        endDate: new Date(range.endDate),
                    }]}
                    locale={locale}
                    rangeColors={['#009f3c']}
                    showSelectionPreview={true}
                    moveRangeOnFirstSelection={false}
                    direction={'horizontal'}
                    onChange={(pickerRange) => {
                        let range = pickerRange.range1;
                        let {startDate} = range;
                        let {endDate} = range;
                        if (
                            startDate.getFullYear() === endDate.getFullYear() &&
                            startDate.getMonth() === endDate.getMonth() &&
                            startDate.getDate() === endDate.getDate() &&
                            startDate.getHours() === endDate.getHours() &&
                            startDate.getMinutes() === endDate.getMinutes()
                        ) {
                            startDate.setHours(0);
                            startDate.setMinutes(0);
                            startDate.setSeconds(0);
                            startDate.setMilliseconds(0);

                            endDate.setHours(23);
                            endDate.setMinutes(59);
                            endDate.setSeconds(59);
                            endDate.setMilliseconds(59)
                        }
                        setRange(range);
                        props.onChange && props.onChange(range);
                    }}
                />
            </Popover>
            <div style={{
                color: '#555',
                fontSize: 15,
                display: 'flex',
                justifyContent: props.position ? props.position : 'center',
                alignItems: 'center'
            }}>
                {
                    props.hideQuickPanel ? undefined : (
                        <span>
                            <span> <TextButton
                                title={t("rangePicker.today")}
                                // color={0 === checkPeriod(range.startDate, range.endDate) ? 'primary' : 'inherit'}
                                className={0 === checkPeriod(range.startDate, range.endDate) ? classes.selectedBtn : classes.filterBtn}
                                onClick={() => {
                                    const r = {
                                        startDate: moment().startOf('day').toDate(),
                                        endDate: moment().endOf('day').toDate()
                                    };
                                    setRange(r);
                                    props.onChange && props.onChange(r);
                                }}
                            /> </span>
                            <span> <TextButton
                                title={t("rangePicker.yesterday")}
                                // color={1 === checkPeriod(range.startDate, range.endDate) ? 'primary' : 'inherit'}
                                className={1 === checkPeriod(range.startDate, range.endDate) ? classes.selectedBtn : classes.filterBtn}
                                onClick={() => {
                                    const r = {
                                        startDate: moment().subtract(1, 'days').startOf('day').toDate(),
                                        endDate: moment().subtract(1, 'days').endOf('day').toDate()
                                    };
                                    setRange(r);
                                    props.onChange && props.onChange(r);
                                }}
                            /> </span>
                            <span> <TextButton
                                title={t("rangePicker.week")}
                                // color={2 === checkPeriod(range.startDate, range.endDate) ? 'primary' : 'inherit'}
                                className={2 === checkPeriod(range.startDate, range.endDate) ? classes.selectedBtn : classes.filterBtn}
                                onClick={() => {
                                    const r = {
                                        startDate: moment().startOf('isoWeek').toDate(),
                                        endDate: moment().endOf('isoWeek').toDate()
                                    };
                                    setRange(r);
                                    props.onChange && props.onChange(r);
                                }}
                            /> </span>
                            <span> <TextButton
                                title={t("rangePicker.month")}
                                className={3 === checkPeriod(range.startDate, range.endDate) ? classes.selectedBtn : classes.filterBtn}
                                onClick={() => {
                                    const r = {
                                        startDate: moment().startOf('month').toDate(),
                                        endDate: moment().endOf('month').toDate()
                                    };
                                    setRange(r);
                                    props.onChange && props.onChange(r);
                                }}
                            /> </span>
                        </span>
                    )
                }
                <span style={{
                    padding: '2px 8px 3px 20px',
                    cursor: 'pointer',
                    backgroundColor: 'white',
                    border: '1px solid #aaa',
                    borderRadius: 6,
                    minWidth: props.hideQuickPanel ? undefined : '292px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: props.hideQuickPanel ? "100%" : undefined,
                    marginLeft: 10
                }}
                      onClick={event => {
                          setAnchorEl(event.currentTarget);
                          setOpen(true);
                      }}
                >
                    {
                        formatRange(range)
                    }
                    <Tooltip arrow title={'Сбросить'}>
                    <IconButton onClick={(event) => {
                        event.stopPropagation();
                        const range = {
                            startDate: moment().startOf('month').toDate(),
                            endDate: moment().endOf('month').toDate()
                        };
                        setRange(range);
                        props.onChange && props.onChange(range, true);
                    }}>
                        <Close/>
                    </IconButton>
                        </Tooltip>
                </span>
            </div>


        </div>

    )
};

export default RangePicker;