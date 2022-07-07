import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import moment from "moment";
import {
  resetUpdateAgreementServiceDesc,
  resetUploadAgreementFile,
  updateAgreementServiceDesc,
  uploadAgreementFile,
} from "../../../../redux/actions";
import { servicesAgreementsSelector } from "../../../../redux/reducer";
import withNotification from "#hocs/withNotification/WithNotification";
import {
  Tooltip,
  Switch,
  FormControl,
  TextField,
  Button,
  CircularProgress,
} from "@material-ui/core";
import { Upload } from "#components/Upload";
import "./styles.scss";

export const ExpandedCustomAgreementService = withNotification((props) => {
  const { agreement, getAgreementDetails } = props;

  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [newDescription, setNewDescription] = useState(
    agreement.description || ""
  );
  const [descEditMode, setDescEditMode] = useState(false);
  const [uploadedDocument, setUploadedDocument] = useState(null);

  const $updateCustomAgreementServiceDesc = useSelector(
    servicesAgreementsSelector("updateAgreementServiceDesc")
  );
  const $uploadCustomAgreementFile = useSelector(
    servicesAgreementsSelector("uploadAgreementFile")
  );

  const updateCustomAgreementDescLoading =
    $updateCustomAgreementServiceDesc.loading &&
    $updateCustomAgreementServiceDesc.agreementId === agreement.id;
  const uploadCustomAgreementFileLoading =
    $uploadCustomAgreementFile.loading &&
    $uploadCustomAgreementFile.agreementId === agreement.id;

  useEffect(
    () => {
      if (
        $updateCustomAgreementServiceDesc.success &&
        $updateCustomAgreementServiceDesc.agreementId === agreement.id
      ) {
        props.success(t("Описание обновлено"));

        getAgreementDetails();
        setDescEditMode(false);
        dispatch(resetUpdateAgreementServiceDesc());
      }
    },
    [$updateCustomAgreementServiceDesc.success]
  );

  useEffect(
    () => {
      if (
        $uploadCustomAgreementFile.success &&
        $uploadCustomAgreementFile.agreementId === agreement.id
      ) {
        props.success(t("Файл прикреплен"));

        getAgreementDetails();
        setUploadedDocument(null);
        dispatch(resetUploadAgreementFile());
      }
    },
    [$uploadCustomAgreementFile.success]
  );

  const onSaveDescription = (event) => {
    event.preventDefault();

    dispatch(
      updateAgreementServiceDesc({ id: agreement.id, note: newDescription })
    );
  };

  const onUploadFileClick = () => {
    if (uploadedDocument) {
      const formData = new FormData();
      formData.append("file", uploadedDocument);
      formData.append("relatedTo", "AGREEMENT");
      formData.append("relatedToId", agreement.id);

      dispatch(uploadAgreementFile({ data: formData, id: agreement.id }));
    }
  };

  return (
    <div className="custom-agreement-service-expanded">
      <div className="custom-agreement-service-expanded__desc">
        <div className="custom-agreement-service-expanded__desc__head">
          <div className="custom-agreement-service-expanded__desc__head__inner">
            {t("servicesAgreements.agreementCard.desc")}
          </div>
          <div className="custom-agreement-service-expanded__desc__head__switcher">
            <Tooltip title={"Изменить"}>
              <Switch
                checked={descEditMode}
                onChange={(event) => setDescEditMode(event.target.checked)}
                color="primary"
                inputProps={{ "aria-label": "primary checkbox" }}
              />
            </Tooltip>
          </div>
        </div>
        {descEditMode ? (
          <form onSubmit={onSaveDescription} noValidate autoComplete="off">
            <div className="form-field">
              <FormControl fullWidth component="fieldset">
                <TextField
                  variant="outlined"
                  label={"Введите описание"}
                  value={newDescription || ""}
                  onChange={(e) => setNewDescription(e.target.value)}
                  multiline
                  rows={4}
                  fullWidth
                />
              </FormControl>
            </div>
            <div className="custom-agreement-service-expanded__desc__save">
              <Button type="submit" onClick={onSaveDescription} color="primary">
                Сохранить
              </Button>
            </div>
            {updateCustomAgreementDescLoading && (
              <div className="abs-loader">
                <CircularProgress color="primary" />
              </div>
            )}
          </form>
        ) : (
          <div>{agreement.description}</div>
        )}
      </div>
      <div className="custom-agreement-service-expanded__attachments">
        <div className="custom-agreement-service-expanded__desc__head">
          <div className="custom-agreement-service-expanded__desc__head__inner">
            {t("servicesAgreements.agreementCard.attachments")}
          </div>
        </div>
        <div className="custom-agreement-service-expanded__attachments__list">
          {agreement &&
            agreement.attachments &&
            agreement.attachments.map((item, index) => (
              <div
                key={index}
                className="custom-agreement-service-expanded__attachments__item"
              >
                <div className="custom-agreement-service-expanded__attachments__item__icon">
                  {/*<PaperClipOutlined />*/}
                </div>
                <div className="custom-agreement-service-expanded__attachments__item__date">
                  {moment(item.createdDate).format("DD-MM-YYYY")}
                </div>
                <a href={item.url} target="_blank" download>
                  {item.originalFileName}
                </a>
              </div>
            ))}
        </div>
        <div className="custom-agreement-service-expanded__attachments__buttons">
          <Upload
            className="custom-agreement-service-expanded__attachments__buttons__upload"
            afterUpload={(file) => setUploadedDocument(file)}
            fileList={uploadedDocument ? [uploadedDocument] : []}
          >
            <Button color="primary" variant="contained" component="span">
              {t("servicesAgreements.agreementCard.selectFile")}
            </Button>
          </Upload>
          <Button
            color="primary"
            onClick={onUploadFileClick}
            disabled={!uploadedDocument}
          >
            {t("servicesAgreements.agreementCard.uploadAttachment")}
          </Button>
        </div>

        {uploadCustomAgreementFileLoading && (
          <div className="abs-loader">
            <CircularProgress color="primary" />
          </div>
        )}
      </div>
    </div>
  );
});
