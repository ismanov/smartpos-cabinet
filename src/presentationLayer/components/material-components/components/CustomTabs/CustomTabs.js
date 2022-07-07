import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// nodejs library to set properties for components
import PropTypes from "prop-types";

// material-ui components
import {makeStyles} from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
// core components
import Card from "../../components/Card/Card.js";
import CardBody from "../../components/Card/CardBody.js";
import CardHeader from "../../components/Card/CardHeader.js";

import styles from "../../assets/jss/material-dashboard-react/components/customTabsStyle.js";

const useStyles = makeStyles(styles);

export default function CustomTabs(props) {

    React.useEffect(() => {
        if (props.value) {
            setValue(props.value)
        }
    }, [props.value]);

    const [value, setValue] = React.useState(0);
    const handleChange = (event, value) => {
        props.onChange(value);
        setValue(value);
    };
    const classes = useStyles();
    const {headerColor, plainTabs, tabs, title, rtlActive} = props;
    const cardTitle = classNames({
        [classes.cardTitle]: true,
        [classes.cardTitleRTL]: rtlActive
    });
    return (
        <Card plain={plainTabs} style={{marginBottom:'5px'}}>
            <CardHeader color={headerColor} plain={plainTabs}>
                {title !== undefined ? <div className={cardTitle}>{title}</div> : null}
                <Tabs
                    value={value}
                    onChange={handleChange}
                    classes={{
                        root: classes.tabsRoot,
                        indicator: classes.displayNone,
                        scrollButtons: classes.displayNone
                    }}
                    variant="fullWidth"
                    scrollButtons="auto"
                >
                        {tabs.map((prop, key) => {
                            var icon = {};
                            if (prop.tabIcon) {
                                icon = {
                                    icon: <prop.tabIcon/>
                                };
                            }
                            return (
                                <Tab
                                    classes={{
                                        root: classes.tabRootButton,
                                        selected: classes.tabSelected,
                                        wrapper: classes.tabWrapper
                                    }}
                                    key={key}
                                    label={prop.tabName}
                                    {...icon}
                                />
                            );
                        })}
                </Tabs>
            </CardHeader>
            <CardBody style={{padding:0}}>
                {tabs.map((prop, key) => {
                    if (key === value) {
                        return <div key={key}>{prop.tabContent}</div>;
                    }
                    return null;
                })}
            </CardBody>
        </Card>
    );
}

CustomTabs.propTypes = {
    headerColor: PropTypes.oneOf([
        "warning",
        "success",
        "danger",
        "info",
        "primary",
        "rose"
    ]),
    title: PropTypes.string,
    tabs: PropTypes.arrayOf(
        PropTypes.shape({
            tabIcon: PropTypes.object,
            tabContent: PropTypes.node
        })
    ),
    rtlActive: PropTypes.bool,
    plainTabs: PropTypes.bool
};
