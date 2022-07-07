import React from "react";
import styles from './formheader.module.scss';
import PropTypes from 'prop-types';
import cn from 'classnames';


/**
 * @deprecated
 * use ../button.js
 */
const FormHeader = (props) => {

    return (
        <div {...props} className={cn(styles.content, props.className, props.mounted ? styles.active : undefined)} style={props.style}>
            <img className={cn(styles.icon, props.mounted ? styles.active : undefined)} src={props.icon} alt='icon'/>
            <div className={cn(styles.title, props.mounted ? styles.active : undefined)}>{props.title}</div>
        </div>
    )
};

FormHeader.propTypes = {
    icon: PropTypes.object,
    title: PropTypes.string,
    mounted: PropTypes.bool
};

export default FormHeader;
