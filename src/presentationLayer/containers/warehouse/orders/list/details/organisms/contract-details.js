import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import * as actions from "../../actions";

import { RejectContractModal } from "./reject-contract-modal";

import { Button, CircularProgress, IconButton, Tooltip } from "@material-ui/core";
import QuestionDialog from "../../../../../../components/Dialog/question";
import { CloudUpload } from "@material-ui/icons";
import Logic from "../../../../../../../businessLayer";
import withNotification from "../../../../../../hocs/withNotification/WithNotification";
import { dateDiffernce } from "../../../../../../../utils/dateDiffernce";
import moment from "moment";

export const ContractDetails = withNotification((props) => {
  const ordersListStore = useSelector(state => state.get("ordersList"));

  const dispatch = useDispatch();

  const { contractDetails, confirmContract, expiredContract } = ordersListStore;
  const { orderId } = props;
  const contractId = contractDetails.data.id;

  const [ uploadContractloading, setUploadContractloading ] = useState(false);
  const [ confirmContractDialog, setConfirmContractDialog ] = useState(false);
  const [ addModalProps, setAddModalProps ] = useState({
    visible: false,
    shouldRender: false
  });

  let lastDaysOfContract = 0;

  useEffect(() => {
    dispatch(
      actions.getContractDetailsAction(orderId)
    );
  }, []);

  useEffect(() => {
    if (confirmContract.success) {
      props.success('Договор принят');

      dispatch(
        actions.getOrderDetailsAction(orderId)
      );

      dispatch(
        actions.resetConfirmContractAction()
      );
    }
  }, [confirmContract.success]);

  useEffect(() => {
    if (expiredContract.success) {
      props.success('Договор закрыт');

      dispatch(
        actions.resetExpiredContractAction()
      );

      dispatch(
        actions.getOrderDetailsAction(orderId)
      );
    }
  }, [expiredContract.success]);


  const onConfirmContract = () => {
    dispatch(
      actions.confirmContractAction({
        id: contractId,
        status: {
          code: "ACCEPTED"
        }
      })
    );
  };

  const onRejectContract = () => {
    setAddModalProps({ visible: true, shouldRender: true });
  };

  const onExpiredContract = () => {
    const data = {
      id: contractId,
      status: {
        code: "EXPIRED"
      }
    };

    dispatch(
      actions.expiredContractAction(data)
    )
  };

  if (contractDetails.data.expiryDate) {
    const nowDate = moment(Date.now()).format('YYYY-MM-DD');
    const exDate = moment(contractDetails.data.expiryDate).format('YYYY-MM-DD');

    lastDaysOfContract = dateDiffernce(nowDate, exDate) + 1;
  }

  return (
    <>
      {confirmContract.error &&
        <div className="contract-details__error">
          {confirmContract.error.detail}
        </div>
      }
      <div className="contract-details">
        {(contractDetails.loading || confirmContract.loading || uploadContractloading) && <div className="abs-loader">
          <CircularProgress color='primary'/>
        </div>}
        {Object.keys(contractDetails.data).length > 0 &&
         <>
           <div className="contract-details__left">
             <div className="contract-details__item">
               Статус договора: {contractDetails.data.status.nameRu}
             </div>
             <div className="contract-details__item">
               Договор №: {contractDetails.data.contractNumber}
             </div>
             <div className="contract-details__item">
               Тип договора: {contractDetails.data.contractType.nameRu}
             </div>
             <div className="contract-details__item">
               Дата начала: {contractDetails.data.startDate}
             </div>
             <div className="contract-details__item">
               Дата окончания: {contractDetails.data.expiryDate}
             </div>
             {contractDetails.data.status.code === "DOCUMENT_ATTACHED" &&
               <div className="contract-details__item__warning">
                 {lastDaysOfContract < 1 ? "Срок действия договора истек"
                   : lastDaysOfContract < 4 ? `До окончания договора ${lastDaysOfContract > 1 ? `осталось ${lastDaysOfContract} дня` : `остался ${lastDaysOfContract}  день`}`
                     : ""
                 }
               </div>
             }
             {contractDetails.data.originalDocument.id !== contractDetails.data.document.id &&
               <div className="contract-details__item">
                 <a className="contract-details__item__link" href={contractDetails.data.document.path} target="_blank">
                   Посмотреть договор
                 </a>
               </div>
             }
             <div className="contract-details__item">
               <a className="contract-details__item__link" href={contractDetails.data.originalDocument.path} target="_blank">
                 Посмотреть оригинальный договор
               </a>
             </div>
           </div>
           <div className="contract-details__right">
             {(contractDetails.data.status.code !== "EXPIRED" && contractDetails.data.status.code !== "REJECTED") &&
               <>
                 <Tooltip title="Прикрепить файл договора">
                   <IconButton
                     color="primary"
                     onClick={() => {
                       document.getElementById('file').click();
                     }}
                   >
                     <CloudUpload />
                   </IconButton>
                 </Tooltip>
                 <input
                   id="file"
                   type="file"
                   style={{display: 'none'}}
                   onChange={(e) => {
                     setUploadContractloading(true);

                     Logic
                       .ordersList
                       .uploadContract(e.target.files[0], { id: contractId })
                       .then(response => {
                         setUploadContractloading(false);
                         props.success('Файл прикреплен');
                         dispatch(
                           actions.getOrderDetailsAction(orderId)
                         );

                         dispatch(
                           actions.getContractDetailsAction(orderId)
                         );
                       })
                       .catch(error => {
                         setUploadContractloading(false);
                         props.error(error.toString());
                       });
                   }}
                 />
               </>
             }
             {(contractDetails.data.status.code === "DOCUMENT_ATTACHED" && lastDaysOfContract > 0) &&
              <>
                <div className="custom__popover">
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => setConfirmContractDialog(true)}
                  >
                    Подтвердить
                  </Button>
                  <QuestionDialog
                    open={confirmContractDialog}
                    title=''
                    message='Вы действительно хотите подтвердить договор?'
                    onPositive={() => {
                      onConfirmContract();
                      setConfirmContractDialog(false);
                    }}
                    onNegative={() => setConfirmContractDialog(false)}
                    onClose={() => setConfirmContractDialog(false)}
                  />
                </div>
                <div className="custom__popover">
                  <Button variant="outlined" color="secondary" onClick={onRejectContract}>Отклонить</Button>
                </div>
              </>
             }
           </div>
         </>
        }
      </div>
      {addModalProps.shouldRender && <RejectContractModal
        orderId={orderId}
        contractId={contractId}
        modalProps={addModalProps}
        setModalProps={setAddModalProps}
      />}
    </>
  )
});