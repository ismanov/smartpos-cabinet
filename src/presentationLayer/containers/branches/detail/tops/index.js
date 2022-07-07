import React from 'react';
import {useSelector} from 'react-redux';
import {Grid, Table, TableBody, TableCell, TableHead, TableRow, Paper, makeStyles} from "@material-ui/core";
import Detail from '#components/containers/detail';
import {useTranslation} from "react-i18next";

const useStyles = makeStyles(() => ({
    container: {
        border: '1px #f7f7f7 solid',
        padding: 10,
        borderRadius: 6,
        display: 'flex',
        flexGrow: 1,
        alignItems: "flex-start",
        flexFlow: 'column'
    },
    title: {
        color: '#555',
        font: '1.2rem'
    },
    table: {
        marginTop: 5,
        width: '100%',
        flex: 1,
        overflow: 'auto'
    },
    listHead: {
        color: '#8f8f8f',
        fontSize: '0.8rem'
    },
    listRow: {
        color: '#555',
        fontSize: '1.2rem'
    }
}))

export default () => {

    const topProducts =  useSelector(state => state.get('main').topProducts);
    const topEmployees = useSelector(state => state.get('main').topEmployees);
    const classes = useStyles();
    const {t} = useTranslation();

    return (
        <Grid container justify='center' direction='row' style={{marginTop: 20}}>
            <Grid item xs={6} style={{paddingRight: 8, height: 320}}>
                <Paper style={{width: '100%'}}>
                    <Detail header={{ title: t("home.topCashiers") }}
                    >
                        <Table>
                            <TableHead className={classes.listHead}>
                                <TableCell>№</TableCell>
                                <TableCell style={{width: '70%'}}>{t("employees.abbr")}</TableCell>
                                <TableCell>{t("home.cash")}</TableCell>
                            </TableHead>
                            <TableBody className={classes.listRow}>
                                {topEmployees && topEmployees.map((item, index) => (
                                    <TableRow>
                                        <TableCell>{index+1}</TableCell>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>{item.salesTotal}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Detail>
                </Paper>
            </Grid>
            <Grid item xs={6} style={{paddingLeft: 8, height: 320}}>
                <Paper style={{width: '100%'}}>
                    <Detail
                        header={{ title: t("home.topSales") }}>
                        <Table>
                            <TableHead className={classes.listHead}>
                                <TableCell>№</TableCell>
                                <TableCell style={{width: '70%'}}>{t("productAddEdit.product_name")}</TableCell>
                                <TableCell>{t("home.cash")}</TableCell>
                            </TableHead>
                            <TableBody className={classes.listRow}>
                                {topProducts && topProducts.map((item, index) => (
                                    <TableRow>
                                        <TableCell>{index+1}</TableCell>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>{item.salesTotal}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Detail>
                </Paper>
            </Grid>
        </Grid>
    )
};
