import React, { useState, useEffect } from 'react';
import styles from './Switch.module.scss';
import cn from 'classnames';


/**
 * @deprecated
 * use ../button.js
 */
const Switch = (props) => {

    const [selected, setSelected] = useState(0);

    useEffect(() => {
        props.itemChanged && props.itemChanged(selected)
    }, [selected]);

    return (
        <div className={styles.wrapper}>
            {
                props.items && props.items.map((item, index) => (
                    <div
                        className={cn(styles.item, index === selected ? styles.active : undefined)}
                        onClick={() => { setSelected(index) }}
                    >
                        {item}
                    </div>
                ))
            }
        </div>
    )
};

export default Switch;
