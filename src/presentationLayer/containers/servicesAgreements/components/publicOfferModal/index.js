import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { FormControlLabel, Checkbox, Button } from "@material-ui/core";

import CustomDialog from "../../../../components/material-components/components/CustomDialog";
import {
  getLastPublicOffer,
  resetAcceptPublicOffer,
  acceptPublicOffer,
} from "../../redux/actions";
import withNotification from "../../../../hocs/withNotification/WithNotification";
import { servicesAgreementsSelector } from "../../redux/reducer";
import "./styles.scss";

export const PublicOfferModal = withNotification((props) => {
  const { modalProps, setModalProps } = props;
  const { tin, callBack } = modalProps;

  const { t } = useTranslation();
  const dispatch = useDispatch();

  const $lastPublicOffer = useSelector(
    servicesAgreementsSelector("lastPublicOffer")
  );
  const $acceptPublicOffer = useSelector(
    servicesAgreementsSelector("acceptPublicOffer")
  );

  const {
    loading: lastPublicOfferLoading,
    data: lastPublicOffer,
    error: lastPublicOfferError,
  } = $lastPublicOffer;

  const [accept, setAccept] = useState(false);

  useEffect(() => {
    dispatch(getLastPublicOffer());
  }, []);

  useEffect(
    () => {
      if ($acceptPublicOffer.success) {
        props.success(t("servicesAgreements.acceptPublicOffer.success"));
        callBack && callBack();
        closeModal();
      }
    },
    [$acceptPublicOffer.success]
  );

  const closeModal = () => {
    setModalProps({ ...modalProps, visible: false });
  };

  const afterClose = () => {
    dispatch(resetAcceptPublicOffer());
    setModalProps({ ...modalProps, shouldRender: false, cardId: null });
  };

  const onSubmit = (event) => {
    event.preventDefault();

    if (accept && lastPublicOffer) {
      dispatch(
        acceptPublicOffer({
          tin,
          publicOfferId: lastPublicOffer.id,
        })
      );
    }
  };

  return (
    <CustomDialog
      className="service-agreements__public-offer-modal"
      open={modalProps.visible}
      onClose={closeModal}
      onExited={afterClose}
      fullWidth={true}
      maxWidth={"sm"}
      title={t("servicesAgreements.acceptPublicOffer.title")}
      loading={$acceptPublicOffer.loading || lastPublicOfferLoading}
      error={$acceptPublicOffer.error || lastPublicOfferError}
    >
      <form onSubmit={onSubmit} noValidate autoComplete="off">
        <div>
          {lastPublicOffer && (
            <>
              <iframe
                id="divToPrint"
                title="offer"
                width="100%"
                height="800px"
                srcDoc={lastPublicOffer.content}
              />
              <div>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={accept}
                      color="primary"
                      onChange={(_, checked) => setAccept(checked)}
                    />
                  }
                  label={t("servicesAgreements.acceptPublicOffer.iAccept")}
                />
              </div>
            </>
          )}
        </div>
        <div className="custom-modal__buttons-row">
          <Button
            type="submit"
            onClick={onSubmit}
            color="primary"
            disabled={!accept}
          >
            {t("servicesAgreements.acceptPublicOffer.save")}
          </Button>
        </div>
      </form>
    </CustomDialog>
  );
});
