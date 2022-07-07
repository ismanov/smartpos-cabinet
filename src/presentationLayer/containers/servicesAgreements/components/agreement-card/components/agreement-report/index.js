import React, { useEffect, useRef } from "react";
import ReactToPrint from "react-to-print";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { servicesAgreementsSelector } from "./../../../../redux/reducer";
import {
  fetchDataEntryByAgreementId,
  ApproveDataEntryStatus,
} from "./../../../../redux/actions";
import { CircularProgress } from "@material-ui/core";
import Status from "../Status";
import { Button } from "@material-ui/core";
import { PrinterSvg } from "../../../../../../../assets/icons";

const Report = ({ agreementId, agreementDetails }) => {
  const componentRef = useRef(null);
  const dispatch = useDispatch();

  const $dataEntry = useSelector(servicesAgreementsSelector("dataEntry"));
  const loading = useSelector(servicesAgreementsSelector("reportLoading"));

  const firstActivatedDate = agreementDetails.firstActivatedDate
    ? moment(agreementDetails.firstActivatedDate).format("DD.MM.YYYY")
    : "-";
  const nextPeriodStart = agreementDetails.nextPeriodStart
    ? moment(agreementDetails.nextPeriodStart).format("DD.MM.YYYY")
    : "-";

  useEffect(() => {
    dispatch(fetchDataEntryByAgreementId(agreementId));
  }, []);

  const statusParse = (statusCode) => {
    switch (statusCode) {
      case "DRAFT":
        return "ОЖИДАЕТСЯ ПОДТВЕРЖДЕНИЕ КЛИЕНТА";
      case "APPROVED":
        return "ПОДТВЕРЖДЕН";
      default:
        return statusCode;
    }
  };

  const approve = () =>
    dispatch(
      ApproveDataEntryStatus(
        {
          id: checkNullScw($dataEntry, null, "status"),
        },
        () => dispatch(fetchDataEntryByAgreementId(agreementId))
      )
    );

  if (loading) return <CircularProgress />;
  else
    return (
      <div className="agreements-report">
        <div>
          <div className="agreements-report__header">
            {checkNullScw($dataEntry, false, "status") ? (
              <Status
                status={$dataEntry.status === "APPROVED" ? "SUCCESS" : ""}
                className="agreements-report__header__status"
              >
                {statusParse(checkNullScw($dataEntry, "", "status") || "")}
              </Status>
            ) : (
              <span />
            )}
            {checkNullScw($dataEntry, "", "status") !== "APPROVED" ? (
              $dataEntry && (
                <Button
                  variant="contained"
                  color="primary"
                  size="middle"
                  onClick={approve}
                >
                  Подтвердить
                </Button>
              )
            ) : (
              <span>{checkNullScw($dataEntry, null, "approvedDate")}</span>
            )}
          </div>
          <div className="flex-end">
            <ReactToPrint
              trigger={() => (
                <button className="btn-icon">
                  <PrinterSvg size={"24"} />
                </button>
              )}
              content={() => componentRef.current}
            />
          </div>
          <table ref={componentRef} style={{ border: "none" }}>
            <div className="agreements-report__info">
              <span className="agreements-report__info__title">
                Отчет об оказанных услугах
              </span>
              <div className="agreements-report__info__body">
                <span>Заказ: {agreementDetails.agreementNumber}</span>
                <span>
                  Период: {firstActivatedDate + " - " + nextPeriodStart}
                </span>
              </div>
            </div>
            <table>
              <colgroup span={4} />
              <tr>
                <th>Услуга</th>
                <th>Филиал</th>
                <th>Количество</th>
                <th>Исполнитель</th>
              </tr>
              {(checkNullScw($dataEntry, null, "items") || []).map(
                (item, index) => (
                  <tr key={item.id}>
                    <td>{item.serviceType.nameRu}</td>
                    <td>{item.branchName}</td>
                    <td>{item.count}</td>
                    <td>{item.updateName}</td>
                  </tr>
                )
              )}
            </table>
          </table>
        </div>
      </div>
    );
};

export default Report;

export const checkNullScw = (obj, onNull, ...args) => {
  return args.reduce((acc, method) => {
    if (acc) {
      return acc[method];
    } else return onNull;
  }, obj ? obj : onNull);
};
