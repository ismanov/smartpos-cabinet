import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import SelectBox from "#components/Select";
import {withTranslation} from "react-i18next";
import {fetchBranchList} from "../../dashboard/actions";


const mapStateToProps = state => {
    return {
        branchList: state.get("dashboard").commonBranchList
    }
};

export default connect(mapStateToProps) (withTranslation() ((props) => {

    const [branch, setBranch] = useState();

    useEffect(() => {
        if (!props.branchList || !props.branchList.length) {
            props.dispatch(fetchBranchList())
        }
    }, []);

    useEffect(() => {         
        if (props.value) {
            setBranch(props.value) 
        }
    }, [props.value]);

    let data;
    if (props.skipAllBranch) {
        data = [...(props.branchList.filter(b => b.id !== undefined))]
    } else {
        data = [...props.branchList]
    }
    return (
        <SelectBox
            {...props}
            label={props.t("common.branch")}
            labelWidth={70}
            itemKey='id'
            itemValue='name'
            data={data}
            value={branch || ''}
            onChange={event => {
                if (!props.value) {
                    setBranch(event.target.value)
                }
                props.onChange && props.onChange(event.target.value);
            }}
        />)
}));


