import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  createCustomAgreement,
  getBranchesCount,
  getBranchesItems,
  getServiceAgreementsList,
  resetCreateCustomAgreement,
} from "../../../redux/actions";
import { servicesAgreementsSelector } from "../../../redux/reducer";
import { PriceWrapper } from "#components/PriceWrapper";
import { ServicePrice } from "../../service-price";
import { getTariffPrice } from "../../../helper";
import Table from "../../../../../components/Table/index";
import {
  Button,
  CircularProgress,
  IconButton,
  TextField,
  Popover,
} from "@material-ui/core";
import { checkNull } from "../../../../../../utils/helpers";
import SelectBox from "../../../../../components/Select";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import { DATA_ENTRY } from "../../../redux/constants";
import withNotification from "#hocs/withNotification/WithNotification";
import { Upload } from "./../../../../../components/Upload/index";

export default withNotification(
  React.memo((props) => {
    const {
      services,
      showPublicOfferModal,
      tin,
      backUrl,
      history,
      tariffsDataEntry,
    } = props;

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const $customerPublicOffer = useSelector(
      servicesAgreementsSelector("customerPublicOffer")
    );
    const { data } = useSelector(
      servicesAgreementsSelector("servicesAgreementsList")
    );

    const $branchItems = useSelector(
      servicesAgreementsSelector("branchesItems")
    );
    const $createCustomAgreement = useSelector(
      servicesAgreementsSelector("createCustomAgreement")
    );

    const $agreementsListFilter = useSelector(
      servicesAgreementsSelector("servicesAgreementsListFilter")
    );

    const customServices = Object.keys(services).map((code) => ({
      service: services[code].serviceType,
      description: "",
      documents: [],
    }));
    const [customItems, setCustomItems] = useState([]);

    const [xizmatId, setXizmatId] = useState(null);

    const [customItemErrors, setCustomItemErrors] = useState({});

    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    useEffect(
      () => {
        if (customServices.length !== customItems.length)
          setCustomItems(customServices);
      },
      [customServices]
    );

    useEffect(() => {
      dispatch(getBranchesItems());
      dispatch(getServiceAgreementsList($agreementsListFilter));
    }, []);

    const agreementsServicesIds = useMemo(
      () => {
        return !data
          ? null
          : data.find(
              (item) =>
                item &&
                item.xizmat &&
                item.xizmat.id === xizmatId &&
                item.status.code === "ACTIVE"
            );
      },
      [xizmatId, data]
    );

    useEffect(
      () => {
        if ($createCustomAgreement.successData) {
          props.success(t("servicesAgreements.addAgreement.success"));
          dispatch(resetCreateCustomAgreement());

          // @ts-ignore
          history.push(`${backUrl}/${$createCustomAgreement.successData.id}`);
        }
      },
      [$createCustomAgreement.successData]
    );

    const onCustomTariffChange = (event) => {
      setXizmatId(event.target.value);
    };

    const onCustomAgreementSubmit = () => {
      const data = {
        agreements: customItems.map((item) => {
          return {
            serviceType: item.service.code,
            description: item.description,
            instances: 1,
          };
        }),
        companyInn: 204935838,
        xizmatId: xizmatId,
        serviceType: DATA_ENTRY,
      };
      dispatch(createCustomAgreement(data));
    };

    const activateService = () => {
      if ($customerPublicOffer.data) {
        onCustomAgreementSubmit();
      } else if (
        $customerPublicOffer.error &&
        $customerPublicOffer.error.status === 404
      ) {
        showPublicOfferModal(() => {
          onCustomAgreementSubmit();
        });
      }
    };
    const change = (method, value, index) => {
      setCustomItems((prev) => {
        const newObj = prev.slice();
        newObj[index][method] = value;
        return newObj;
      });
    };

    const customHeaders = [
      {
        key: "num",
        content: "",
      },
      {
        key: "service",
        content: t("servicesAgreements.addAgreement.customCols.service"),
        className: "add-agreement__custom-services__service",
        width: "25%",
      },
      {
        key: "description",
        content: t("servicesAgreements.addAgreement.customCols.description"),
        className: "add-agreement__custom-services__desc",
        width: "40%",
      },
      // {
      //   key: "uploadFile",
      //   content: "Загрузить файл",
      //   className: "add-agreement__custom-services__desc",
      //   width: "20",
      // },
    ];

    const customItemsDataSource = customItems.map((item, index) => ({
      num: index + 1,
      service: checkNull(item, "service", "nameRu"),
      description: (
        <div className="add-agreement__custom-services__col">
          <TextField
            variant="outlined"
            label={t("servicesAgreements.addAgreement.customForm.description")}
            value={item.description}
            onChange={(e) => change("description", e.target.value, index)}
            multiline
            rows={1}
            fullWidth
          />
        </div>
      ),
      // uploadFile: (
      //   <div className="custom-agreement-service-expanded__attachments__buttons">
      //     <Upload
      //       className="custom-agreement-service-expanded__attachments__buttons__upload"
      //       accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
      //       afterUpload={(file) => {
      //         change("documents", [...item.documents, file], index);
      //       }}
      //       fileList={item.documents}
      //     >
      //       <Button color="primary" variant="contained" component="span">
      //         {t("servicesAgreements.agreementCard.selectFile")}
      //       </Button>
      //     </Upload>
      //   </div>
      // ),
    }));

    return (
      <div className="add-agreement__custom-services add-agreement__block">
        <div className="add-agreement__block__head">
          <div className="add-agreement__block__head__left">
            <span>Аутсорсовые</span>
            <SelectBox
              itemKey="id"
              itemValue="name"
              label={t("servicesAgreements.addAgreement.customForm.tariff")}
              defaultValue=""
              data={(tariffsDataEntry.tariffs || []).map((tariff) => {
                return {
                  id: tariff.id,
                  name: `${tariff.title} - (${getTariffPrice(
                    tariff
                  ).toLocaleString("ru")}  сум)`,
                };
              })}
              onChange={onCustomTariffChange}
              error={!!customItemErrors.tariff}
            />
          </div>
        </div>
        <Table
          order={false}
          openPathWithId={false}
          headers={customHeaders}
          data={customItemsDataSource}
          align="left"
        />
        <div className="add-agreement__custom-services__submit">
          <div>
            <Button
              variant="contained"
              loading={$createCustomAgreement.loading}
              disabled={!xizmatId}
              color="primary"
              aria-describedby={id}
              onClick={(e) => {
                if (!!agreementsServicesIds) handleClick(e);
                else activateService();
              }}
            >
              {t("servicesAgreements.addAgreement.submit")}
            </Button>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "bottom",
                horizontal: "center ",
              }}
            >
              <div className="popover-ctn">
                <div className="text-align-center">
                  <span className="warning">🛈</span>У Вас уже есть активная
                  подписка на Аутсорс услуги за текущий период.
                  <br /> Перейти к существующей подписке?
                </div>
                <div className="f-end">
                  <div className="left-btn" onClick={handleClose}>
                    <span>отмена</span>
                  </div>
                  <div
                    className="right-btn"
                    onClick={() => {
                      history.push(`${backUrl}/${agreementsServicesIds.id}`);
                    }}
                  >
                    <span>Да</span>
                  </div>
                </div>
              </div>
            </Popover>
          </div>
        </div>
        {$createCustomAgreement.loading && (
          <div className="modal-loader">
            <CircularProgress color="primary" />
          </div>
        )}
      </div>
    );
  })
);
