import React from "react";
import styles from "./ChequeComponent.module.scss";
import cn from "classnames";
import moment from "moment";
import { CircularProgress, IconButton } from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import QRCode from "qrcode.react";
import {DoneSvg} from "../../../assets/svg/svg-icons";

const ChequeComponent = (props) => {
  if (props.isLoading) {
    return (
      <div className={styles.main}>
        <div className={styles.content}>
          <div className={styles.circular_content}>
            <CircularProgress color="primary" />
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className={styles.main}>
        <div className={styles.content}>
          {props.cheque &&
            props.cheque.status &&
            props.cheque.status.code === "DRAFT" && (
              <div style={{ textAlign: "right" }}>
                <IconButton
                  onClick={() => {
                    props.onDelete && props.onDelete(props.cheque.id);
                  }}
                  className={styles.delete_button}
                >
                  <Delete />
                </IconButton>
              </div>
            )}
          <div className={cn(styles.company_title, styles.centered)}>
            Компания
          </div>
          <div className={cn(styles.company_header, styles.centered)}>
            {props.cheque && props.cheque.companyName}
          </div>
          <div className={cn(styles.company_header, styles.centered)}>
            {props.cheque ? props.cheque.branchName : "Филиал"}
          </div>
          <div className={cn(styles.company_header, styles.centered)}>
            {props.cheque ? props.cheque.branchAddress : "Адрес"}
          </div>
          <div>
            <div className={styles.divider} />
            <div className={styles.pair}>
              <div className={styles.left}>Кассир:</div>
              <div className={styles.right}>
                {props.cheque && props.cheque.user
                  ? `${props.cheque.user.fullName.lastName} ${
                      props.cheque.user.fullName.firstName
                    }`
                  : "ФИО Кассира"}
              </div>
            </div>
            <div className={styles.pair}>
              <div className={styles.left}>
                Смена №
                {props.cheque && props.cheque.shiftNo
                  ? props.cheque.shiftNo
                  : "🚫"}
              </div>
              <div className={styles.right}>
                {props.cheque && props.cheque.receiptDateTime
                  ? moment(props.cheque.receiptDateTime).format(
                      "YYYY-MM-DD HH:mm:ss"
                    )
                  : "-"}
              </div>
            </div>
            <div className={styles.pair}>
              <div className={styles.left}>ККМ №</div>
              <div className={styles.right}>
                {props.cheque && props.cheque.terminalSN
                  ? props.cheque.terminalSN
                  : "-"}
              </div>
            </div>
            <div className={styles.divider} />
            {props.cheque && Array.isArray(props.cheque.receiptDetails) ? (
              [...props.cheque.receiptDetails]
                .sort((a, b) => (a.productName > b.productName ? 1 : -1))
                .map((item, index) => (
                  <div className={styles.pair}>
                    <div className={styles.left}>
                      {index + 1}. {item.productName || "Не известно"}
                      <div style={{ marginLeft: 10 }}>
                        {item.qty.toLocaleString()} x
                        {(item.price || 0).toLocaleString()} сум
                      </div>
                      <div style={{ marginLeft: 10 }}>
                        в т.ч. НДС - {(item.ndsPercent || 0).toLocaleString()}%
                      </div>
                      {item.excise !== undefined && item.excise !== null ? (
                        <div style={{ marginLeft: 10 }}>
                          Акциз - {item.exciseRate || 0}
                        </div>
                      ) : (
                        undefined
                      )}
                      {item.discountAmountForPromotion ? (
                        <div style={{ marginLeft: 10 }}>
                          Акция
                          {item.discountByPromotionPercent
                            ? `${item.discountByPromotionPercent} %`
                            : ""}
                        </div>
                      ) : (
                        undefined
                      )}
                    </div>
                    <div className={styles.right}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      >
                        ={item.amount.toLocaleString()}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      >
                        {(item.nds || 0).toLocaleString()}
                      </div>
                      {item.excise !== undefined && item.excise !== null ? (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          ={item.excise || 0}
                        </div>
                      ) : (
                        undefined
                      )}
                      {item.discountAmountForPromotion ? (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          ={item.discountAmountForPromotion || 0}
                        </div>
                      ) : (
                        undefined
                      )}
                    </div>
                  </div>
                ))
            ) : (
              <div style={{ padding: 20, textAlign: "center" }}>
                СПИСОК ТОВАРОВ ПУСТ
              </div>
            )}
            <div className={styles.divider} />
            <div className={styles.pair}>
              <div className={cn(styles.left, styles.bold)}>ПОЗИЦИЙ</div>
              <div className={cn(styles.right, styles.bold)}>
                {props.cheque && props.cheque.receiptDetails
                  ? props.cheque.receiptDetails.length
                  : 0}
              </div>
            </div>
            <div className={styles.pair}>
              <div className={cn(styles.left, styles.bold)}>ИТОГО</div>
              <div className={cn(styles.right, styles.bold)}>
                {props.cheque ? props.cheque.totalCost.toLocaleString() : 0}
              </div>
            </div>
            <div className={styles.pair}>
              <div className={cn(styles.left, styles.bold)}>СКИДКА</div>
              <div className={cn(styles.right, styles.bold)}>
                {props.cheque
                  ? (props.cheque.totalDiscount || 0).toLocaleString()
                  : 0}
              </div>
            </div>
            <div
              className={styles.pair}
              style={{ marginTop: 6, marginBottom: 6, fontSize: 16 }}
            >
              <div className={cn(styles.left, styles.bold)}>К ОПЛАТЕ</div>
              <div className={cn(styles.right, styles.bold)}>
                {props.cheque
                  ? (
                      props.cheque.totalCost - (props.cheque.totalDiscount || 0)
                    ).toLocaleString()
                  : 0}
              </div>
            </div>
            <div className={styles.pair}>
              <div className={cn(styles.left, styles.bold)}>
                ОПЛАЧЕНО
                {props.cheque &&
                props.cheque.payments &&
                props.cheque.payments.CASH ? (
                  <div
                    style={{
                      marginLeft: 10,
                      fontWeight: 200,
                    }}
                  >
                    Наличными:
                  </div>
                ) : (
                  undefined
                )}
                {props.cheque &&
                props.cheque.payments &&
                props.cheque.payments.CARD ? (
                  <div
                    style={{
                      marginLeft: 10,
                      fontWeight: 200,
                    }}
                  >
                    Карта:
                  </div>
                ) : (
                  undefined
                )}
                {props.cheque &&
                props.cheque.payments &&
                props.cheque.payments.UZCARD ? (
                  <div
                    style={{
                      marginLeft: 10,
                      fontWeight: 200,
                    }}
                  >
                    UZCARD:
                  </div>
                ) : (
                  undefined
                )}
                {props.cheque &&
                props.cheque.payments &&
                props.cheque.payments.HUMO ? (
                  <div
                    style={{
                      marginLeft: 10,
                      fontWeight: 200,
                    }}
                  >
                    HUMO:
                  </div>
                ) : (
                  undefined
                )}
                {props.cheque &&
                props.cheque.payments &&
                props.cheque.payments.LOYALTY_CARD ? (
                  <div
                    style={{
                      marginLeft: 10,
                      fontWeight: 200,
                    }}
                  >
                    Карта лояльности:
                  </div>
                ) : (
                  undefined
                )}
              </div>
              <div className={cn(styles.right, styles.bold)}>
                {props.cheque
                  ? (props.cheque.totalPaid || 0).toLocaleString()
                  : 0}
                {props.cheque &&
                props.cheque.payments &&
                props.cheque.payments.CASH ? (
                  <div
                    style={{
                      marginLeft: 10,
                      fontWeight: 200,
                    }}
                  >
                    {props.cheque
                      ? props.cheque.payments.CASH.toLocaleString()
                      : 0}
                  </div>
                ) : (
                  undefined
                )}
                {props.cheque &&
                props.cheque.payments &&
                props.cheque.payments.CARD ? (
                  <div
                    style={{
                      marginLeft: 10,
                      fontWeight: 200,
                    }}
                  >
                    {props.cheque
                      ? props.cheque.payments.CARD.toLocaleString()
                      : 0}
                  </div>
                ) : (
                  undefined
                )}
                {props.cheque &&
                props.cheque.payments &&
                props.cheque.payments.UZCARD ? (
                  <div
                    style={{
                      marginLeft: 10,
                      fontWeight: 200,
                    }}
                  >
                    {props.cheque
                      ? props.cheque.payments.UZCARD.toLocaleString()
                      : 0}
                  </div>
                ) : (
                  undefined
                )}
                {props.cheque &&
                props.cheque.payments &&
                props.cheque.payments.HUMO ? (
                  <div
                    style={{
                      marginLeft: 10,
                      fontWeight: 200,
                    }}
                  >
                    {props.cheque
                      ? props.cheque.payments.HUMO.toLocaleString()
                      : 0}
                  </div>
                ) : (
                  undefined
                )}
                {props.cheque &&
                props.cheque.payments &&
                props.cheque.payments.LOYALTY_CARD ? (
                  <div
                    style={{
                      marginLeft: 10,
                      fontWeight: 200,
                    }}
                  >
                    {props.cheque
                      ? props.cheque.payments.LOYALTY_CARD.toLocaleString()
                      : 0}
                  </div>
                ) : (
                  undefined
                )}
              </div>
            </div>

            <div className={styles.pair}>
              <div className={cn(styles.left, styles.bold)}>
                Итого сумма НДС
              </div>
              <div className={cn(styles.right, styles.bold)}>
                {props.cheque
                  ? (props.cheque.totalNds || 0).toLocaleString()
                  : 0}
              </div>
            </div>
            {props.cheque && props.cheque.totalPromotionBonus ? (
              <div className={styles.pair}>
                <div className={cn(styles.left, styles.bold)}>
                  Акции
                  {props.cheque && props.cheque.totalBasketPromotionBonuses ? (
                    <div
                      style={{
                        marginLeft: 10,
                        fontWeight: 200,
                      }}
                    >
                      Корзина
                      {props.cheque.discountAmountForPromotion
                        ? `${props.cheque.discountAmountForPromotion} %`
                        : ""}
                      :
                    </div>
                  ) : (
                    undefined
                  )}
                  {props.cheque && props.cheque.totalProductPromotionBonuses ? (
                    <div
                      style={{
                        marginLeft: 10,
                        fontWeight: 200,
                      }}
                    >
                      Товары:
                    </div>
                  ) : (
                    undefined
                  )}
                </div>
                <div className={cn(styles.right, styles.bold)}>
                  {props.cheque
                    ? (props.cheque.totalPromotionBonus || 0).toLocaleString()
                    : 0}
                  {props.cheque && props.cheque.totalBasketPromotionBonuses ? (
                    <div
                      style={{
                        marginLeft: 10,
                        fontWeight: 200,
                      }}
                    >
                      {props.cheque
                        ? props.cheque.totalBasketPromotionBonuses.toLocaleString()
                        : 0}
                    </div>
                  ) : (
                    undefined
                  )}
                  {props.cheque && props.cheque.totalProductPromotionBonuses ? (
                    <div
                      style={{
                        marginLeft: 10,
                        fontWeight: 200,
                      }}
                    >
                      {props.cheque
                        ? props.cheque.totalProductPromotionBonuses.toLocaleString()
                        : 0}
                    </div>
                  ) : (
                    undefined
                  )}
                </div>
              </div>
            ) : (
              undefined
            )}

            <div
              className={styles.pair}
              style={{
                marginBottom: 6,
                marginTop: 6,
                fontSize: 16,
              }}
            >
              <div className={cn(styles.left, styles.bold)}>СДАЧА</div>
              <div className={cn(styles.right, styles.bold)}>
                {props.cheque && props.cheque.totalPaid
                  ? (
                      (props.cheque.totalPaid || 0) -
                      (props.cheque.totalCost || 0) +
                      (props.cheque.totalDiscount || 0)
                    ).toLocaleString()
                  : 0}
              </div>
            </div>
            <div className={styles.divider} />
          </div>
          <div className={styles.pair}>
            <div className={styles.left}>Номер чека</div>
            <div className={styles.right}>
              {props.cheque ? props.cheque.uid : 0}
            </div>
          </div>
          <div className={styles.pair}>
            <div className={styles.left}>ФП</div>
            <div className={styles.right}>
              {props.cheque && props.cheque.fiscalSign
                ? <DoneSvg />
                : "Не фискальный"}
            </div>
          </div>
          <div className={styles.qrcode_container}>
            {/*{props.cheque && props.cheque.fiscalUrl ? (*/}
            {/*  <a href={props.cheque.fiscalUrl} target="_blank">*/}
            {/*    <QRCode value={props.cheque.fiscalUrl} />*/}
            {/*  </a>*/}
            {/*) : (*/}
            {/*  undefined*/}
            {/*)}*/}
          </div>
        </div>
      </div>
    );
  }
};

export default ChequeComponent;
