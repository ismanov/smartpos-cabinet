import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import withNotification from "../../../../../hocs/withNotification/WithNotification";
import {
  createSubscribeAgreement,
  getBranchesCount,
  resetCreateSubscribeAgreement,
} from "../../../redux/actions";
import { servicesAgreementsSelector } from "../../../redux/reducer";
import { ServicePrice } from "../../service-price";
import { getTariffPrice, getTariffRecurring } from "../../../helper";
import Table from "../../../../../components/Table/index";

import {
  Button,
  CircularProgress,
  IconButton,
  Popover,
} from "@material-ui/core";
import { MoreVert } from "@material-ui/icons";
import Confirm from "../../../../../components/Confirm";

export default withNotification((props) => {
  const {
    services,
    servicesLoading,
    showPublicOfferModal,
    tin,
    backUrl,
    history,
  } = props;

  const { t } = useTranslation();
  const dispatch = useDispatch();

  const $customerPublicOffer = useSelector(
    servicesAgreementsSelector("customerPublicOffer")
  );
  const $createAgreement = useSelector(
    servicesAgreementsSelector("createSubscribeAgreement")
  );
  const branchesCount = useSelector(
    servicesAgreementsSelector("branchesCount")
  );

  const [activatePopoverEl, setActivatePopoverEl] = useState(null);

  useEffect(() => {
    dispatch(getBranchesCount({ tin }));
  }, []);

  useEffect(
    () => {
      if ($createAgreement.success) {
        props.success(t("servicesAgreements.addAgreement.success"));
        dispatch(resetCreateSubscribeAgreement());

        history.push(backUrl);
      }
    },
    [$createAgreement.success]
  );

  const onSubscribeAgreementSubmit = (tariffId, serviceType) => {
    dispatch(
      createSubscribeAgreement({
        customer: {
          inn: tin,
        },
        serviceType: serviceType.code,
        xizmat: {
          id: tariffId,
        },
      })
    );
  };

  // const activateService = (tariffId, serviceType) => {
  //   setCreateAgreementLoading(tariffId);
  //
  //   agreementsEffector.effects.fetchCustomerPublicOffer(tin).then(() => {
  //     onSubscribeAgreementSubmit(tariffId, serviceType);
  //   }, (error) => {
  //     if (error.response.status === 404) {
  //       showPublicOfferModal(() => {
  //         onSubscribeAgreementSubmit(tariffId, serviceType);
  //       });
  //     }
  //   });
  // };

  const activateService = (tariffId, serviceType) => {
    if ($customerPublicOffer.data) {
      onSubscribeAgreementSubmit(tariffId, serviceType);
    } else if (
      $customerPublicOffer.error &&
      $customerPublicOffer.error.status === 404
    ) {
      showPublicOfferModal(() => {
        onSubscribeAgreementSubmit(tariffId, serviceType);
      });
    }
  };

  const onPopoverMenuClick = (event, item, serviceType) => {
    setActivatePopoverEl({ anchorEl: event.currentTarget, item, serviceType });
  };

  const onPopoverMenuClose = () => {
    setActivatePopoverEl(null);
  };

  const renderPopoverContent = (item, serviceType) => {
    return (
      <div className="custom__popover">
        <Confirm
          title="Вы действительно хотите активировать услугу?"
          onPositive={() => {
            activateService(item.id, serviceType);
            onPopoverMenuClose();
          }}
        >
          <Button
            color="primary"
            loading={
              $createAgreement.loading && $createAgreement.tariffId === item.id
            }
            disabled={!$customerPublicOffer.loaded}
          >
            {t("servicesAgreements.addAgreement.submit")}
          </Button>
        </Confirm>
      </div>
    );
  };

  const subscribeHeaders = [
    {
      key: "title",
      content: t("servicesAgreements.addAgreement.subscribeCols.title"),
    },
    {
      key: "recurring",
      content: t("servicesAgreements.addAgreement.subscribeCols.recurring"),
    },
    {
      key: "pricingModel",
      content: t("servicesAgreements.addAgreement.subscribeCols.pricingModel"),
    },
    {
      key: "price",
      content: t("servicesAgreements.addAgreement.subscribeCols.price"),
    },
    {
      key: "totalSum",
      content: t("servicesAgreements.addAgreement.subscribeCols.totalSum"),
    },
    {
      key: "actions",
      content: "",
    },
  ];

  const mapTariffs = (tariffs, serviceType) => {
    return tariffs.map((item) => {
      const price = getTariffPrice(item);
      let totalSum;

      if (item.calculatePer) {
        if (branchesCount) {
          totalSum = (
            <div>
              <strong>{((price || 0) * branchesCount).toLocaleString()}</strong>{" "}
              сум за {branchesCount} филиалов
            </div>
          );
        }
      } else {
        totalSum = (
          <div>
            <strong>{(price || 0).toLocaleString()}</strong> сум
          </div>
        );
      }

      return {
        title: item.title,
        recurring: getTariffRecurring(item),
        pricingModel: item.pricingModel && item.pricingModel.nameRu,
        price: <ServicePrice tariff={item} />,
        totalSum: totalSum,
        actions: (
          <div>
            <IconButton
              onClick={(event) => onPopoverMenuClick(event, item, serviceType)}
            >
              <MoreVert />
            </IconButton>
          </div>
        ),
      };
    });
  };

  return (
    <div className="add-agreement__services add-agreement__block">
      <div className="add-agreement__block__head">
        <div className="add-agreement__block__head__left">
          {t("servicesAgreements.addAgreement.subscribeHead")}
        </div>
      </div>
      {!!Object.keys(services).length && (
        <div>
          {Object.keys(services)
            .filter((sc) => !!sc && sc !== "DATA_ENTRY")
            .map((serviceCode) => {
              const serviceType = services[serviceCode].serviceType;
              const tariffs = services[serviceCode].tariffs;

              return (
                <Accordion key={serviceCode}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography>
                      {serviceType ? serviceType.nameRu : ""}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography className="add-agreement__services__table-wr">
                      <Table
                        order={true}
                        openPathWithId={false}
                        headers={subscribeHeaders}
                        data={mapTariffs(tariffs, serviceType)}
                        align="left"
                      />
                      <Popover
                        open={Boolean(activatePopoverEl)}
                        anchorEl={
                          activatePopoverEl ? activatePopoverEl.anchorEl : null
                        }
                        onClose={onPopoverMenuClose}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "center",
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "center",
                        }}
                      >
                        {activatePopoverEl
                          ? renderPopoverContent(
                              activatePopoverEl.item,
                              activatePopoverEl.serviceType
                            )
                          : null}
                      </Popover>
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              );
            })}
        </div>
      )}
      {servicesLoading && (
        <div className="abs-loader">
          <CircularProgress color="primary" />
        </div>
      )}
    </div>
  );
});
