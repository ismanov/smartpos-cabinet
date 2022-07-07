import React from 'react';
import styles from './ZReportChequeComponent.module.scss';
import cn from 'classnames';
import moment from "moment";


/**
 * @deprecated
 * use ../button.js
 */
const ZReportChequeComponent = (props) => {

    return (
        <div className={styles.main}>
            <div className={styles.content}>
                <div className={cn(styles.company_title, styles.centered)}>
                    Компания
                </div>
                <div className={cn(styles.company_header, styles.centered)}>
                    {props.cheque && props.cheque.owner ? `${props.cheque.owner.businessType ? props.cheque.owner.businessType.nameRu : ''} "${props.cheque.owner.name}"` : "Название компании"}
                </div>
                <div className={cn(styles.company_header, styles.centered)}>
                    {
                        props.cheque ? props.cheque.branchName : 'Филиал'
                    }
                </div>
                <div className={cn(styles.company_header, styles.centered)}>{
                    props.cheque ? props.cheque.branchAddress : 'Адрес'
                }</div>
                <div>
                    <div className={styles.divider}/>
                    <div className={styles.pair}>
                        <div className={styles.left}>
                            Дата рег.:
                        </div>
                        <div className={styles.right}>
                            {
                                props.cheque && props.cheque.companyDateTime ?  moment(props.cheque.companyDateTime).format('YYYY-MM-DD') : 'YYYY-MM-DD'
                            }
                        </div>
                    </div>
                    <div className={styles.pair}>
                        <div className={styles.left}>
                            ИНН
                        </div>
                        <div className={styles.right}>

                            {props.cheque && props.cheque.companyINN ? props.cheque.companyINN : "-"}
                        </div>
                    </div>
                    <div className={styles.divider}/>
                    <div className={styles.pair}>
                        <div className={styles.left}>
                            Дата
                        </div>
                        <div className={styles.right}>
                            {props.cheque && props.cheque.endDateTime ?  moment(props.cheque.endDateTime).format('YYYY-MM-DD HH:mm:ss') : 'YYYY-MM-DD HH:mm:ss'}
                        </div>
                    </div>
                    <div className={styles.pair}>
                        <div className={styles.left}>
                            Смена
                        </div>
                        <div className={styles.right}>
                            {props.cheque ?  props.cheque.fiscalNumber : '0'}
                        </div>
                    </div>
                    <div style={{
                        marginTop: 20,
                        marginBottom: 20,
                        display: 'flex',
                        aligItems: 'center',
                        justifyContent: 'center',
                        color: '#555',
                        fontSize: 16

                    }}>
                        ОТЧЕТ СОСТОЯНИЕ СЧЕТЧИКОВ <br />
                        ККМ С ГАШЕНИЕМ <br />
                    </div>

                    <div className={styles.pair}>
                        <div className={cn(styles.left, styles.bold)}>
                            ПРИХОД
                            <div style={{
                                marginLeft: 10,
                                fontWeight: 200
                            }}>
                                Наличными:
                            </div>
                            <div style={{
                                marginLeft: 10,
                                fontWeight: 200
                            }}>
                                Банковская карта:
                            </div>
                        </div>
                        <div className={cn(styles.right, styles.bold)}>
                            {props.cheque ? (parseFloat(props.cheque.totalCash || 0) + parseFloat(props.cheque.totalCard || 0)).toLocaleString() : 0}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                fontWeight: 200
                            }}>
                                {props.cheque ? props.cheque.totalCash.toLocaleString() : 0}
                            </div>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                fontWeight: 200
                            }}>
                                {props.cheque ? props.cheque.totalCard.toLocaleString() : 0}
                            </div>
                        </div>

                    </div>

                    <div className={styles.pair}>
                        <div className={cn(styles.left, styles.bold)}>
                            Возвраты
                            <div style={{
                                marginLeft: 10,
                                fontWeight: 200
                            }}>
                                Наличными:
                            </div>
                            <div style={{
                                marginLeft: 10,
                                fontWeight: 200
                            }}>
                                Банковская карта:
                            </div>
                        </div>
                        <div className={cn(styles.right, styles.bold)}>
                            {props.cheque ? (parseFloat(props.cheque.totalCashReturned || 0) + parseFloat(props.cheque.totalCardReturned || 0)).toLocaleString() : 0}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                fontWeight: 200
                            }}>
                                {props.cheque ? (props.cheque.totalCashReturned || 0).toLocaleString() : 0}
                            </div>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                fontWeight: 200
                            }}>
                                {props.cheque ? (props.cheque.totalCardReturned || 0).toLocaleString() : 0}
                            </div>
                        </div>

                    </div>

                    <div className={styles.divider}/>
                    <div className={styles.pair}>
                        <div className={cn(styles.left, styles.bold)}>
                            Количество чеков
                            <div style={{
                                marginLeft: 10,
                                fontWeight: 200
                            }}>
                                Приход:
                            </div>
                            <div style={{
                                marginLeft: 10,
                                fontWeight: 200
                            }}>
                                Возврат:
                            </div>
                            <div style={{
                                marginLeft: 10,
                                fontWeight: 200
                            }}>
                                Сумма НДС:
                            </div>
                        </div>
                        <div className={cn(styles.right, styles.bold)}>

                            <div style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                fontWeight: 200
                            }}>
                                {props.cheque ? (props.cheque.receipts || 0).toLocaleString() : 0}
                            </div>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                fontWeight: 200
                            }}>
                                {props.cheque ? (props.cheque.receiptsReturned || 0).toLocaleString() : 0}
                            </div>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                fontWeight: 200
                            }}>
                                {props.cheque ? (props.cheque.nds || 0).toLocaleString() : 0}
                            </div>
                        </div>
                    </div>
                    <div className={styles.divider}/>
                </div>
            </div>
        </div>
    )
};

export default ZReportChequeComponent;
