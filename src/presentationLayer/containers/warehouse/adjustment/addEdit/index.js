import React from "react";
import SelectBox from "../../../../components/Select";
import {Grid, TextField, Typography, Button, IconButton} from "@material-ui/core";
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import ProductAdd from "../components/ProductAdd";
import Paper from "@material-ui/core/Paper";
import { ArrowBackIos } from "@material-ui/icons";
import BranchSelect from '../../../components/branchList';
import {withTranslation} from "react-i18next";
import {createAdjustment} from "../actions";

let reasons = (t) => Object.freeze({
    lost: {
        code: 'LOST',
        nameRu: t("adjustment.lost")
    },
    damaged: {
        code: 'DAMAGED',
        nameRu: t("adjustment.damaged")
    },
    expired: {
        code: 'EXPIRED',
        nameRu: t("adjustment.expired")
    }
});

class AddEditAdjustment extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            productList: [],
            reason: undefined,
            description: undefined,
            reasonError: undefined,
            productListError: false,
            branchId: undefined,
            branchError: false
        }
    }

    render() {

        const { t } = this.props;
        const r = [
            reasons(t).lost,
            reasons(t).damaged,
            reasons(t).expired
        ];
        return (
            <Grid container>
                <Grid container>
                    <Grid container style={{marginTop: 20}} direction="row" alignItems="center">
                        <IconButton onClick={() => { this.props.history.goBack() }} style={{ color: "#009f3c"}}>
                            <ArrowBackIos />
                        </IconButton>
                        <Typography variant='h4' style={{fontSize: 17, fontWeight: 'bold', marginLeft: 10, color: '#555'}}> {t("adjustment.title")} </Typography>
                    </Grid>

                    <Grid container>
                        <Grid item xs={7}>
                            <Paper style={{padding: 15, marginTop: 20}}>
                                <Grid container style={{marginTop: 15}}>
                                    <Grid item xs={6}>
                                        <BranchSelect
                                            skipAllBranch={true}
                                            value={this.state.branchId}
                                            error={this.state.branchError}
                                            onChange={branchId => {
                                                if (branchId !== undefined) {
                                                    this.setState({branchId, branchError: false})
                                                }
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={6} style={{ paddingLeft: 10 }}>
                                        <SelectBox
                                            label={t("adjustment.reason")}
                                            data={r}
                                            error={this.state.reasonError && this.state.reasonError !== ''}
                                            itemKey='code'
                                            itemValue='nameRu'
                                            value={this.state.reason}
                                            onChange={event => {
                                                this.setState({
                                                    reason: r.find(s => s.code === event.target.value)
                                                })
                                            }}
                                        />
                                    </Grid>
                                </Grid>

                                {this.state.branchId >= 0 ? (
                                    <Grid item style={{marginTop: 20}}>
                                        <ProductAdd
                                            style={{width: '100%', height: '100%'}}
                                            branchId={this.state.branchId}
                                            onProductListChanged={list => {
                                                this.setState({
                                                    productList: [...list].map(p => ({...p, unitId: p.unit.id, unitName: p.unit.name})),
                                                    productListError: false
                                                })
                                            }}
                                        />
                                    </Grid>
                                ) : undefined}
                                {this.state.productListError ? (
                                    <div style={{padding: 20, textAlign: 'center', color: 'red' }}> Выберите список продуктов</div>
                                ) : undefined}

                                <Grid item style={{ marginTop: 20 }}>
                                    <TextField
                                        fullWidth
                                        label={t("adjustment.comment")}
                                        variant='outlined'
                                        multiline
                                        rows={5}
                                        value={this.state.description}
                                        onChange={event => {
                                            this.setState({
                                                description: event.target.value
                                            })
                                        }}
                                    />
                                </Grid>
                                <Grid item style={{marginTop: 20}}>
                                    <Button
                                        variant='text'
                                        color='primary'
                                        disabled={this.props.isLoading}
                                        onClick={() => {
                                            if (!this.state.branchId) {
                                                this.setState({
                                                    branchError: true
                                                });
                                                return
                                            }
                                            if (!this.state.reason) {
                                                this.setState({
                                                    reasonError: t("adjustment.select_reason")
                                                });
                                                return
                                            }

                                            if (!this.state.productList || this.state.productList.length === 0) {
                                                this.setState({
                                                    productListError: true
                                                });
                                                return
                                            }

                                            this.props.createAdjustment({
                                                branch: { id: this.state.branchId },
                                                reason: {code: this.state.reason.code},
                                                stockAdjustmentItems: this.state.productList
                                            })
                                        }}
                                    > {t("adjustment.add")} </Button>
                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        )
    }

}

const mapDispatchToProps = (dispatch, props) => {
    return {
        createAdjustment: (adjustment) => dispatch(createAdjustment(adjustment, props))
    }
};

export default connect(state => {
    isLoading: state.get("adjustment").isLoading
}, mapDispatchToProps)(withRouter(withTranslation()(AddEditAdjustment)))

