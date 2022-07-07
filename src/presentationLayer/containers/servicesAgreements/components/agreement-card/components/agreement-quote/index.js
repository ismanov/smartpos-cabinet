/* eslint-disable jsx-a11y/iframe-has-title */
import React, { useEffect, useState } from "react";
import Status from "../Status";
import { Button, CircularProgress, Modal, IconButton } from "@material-ui/core";
import { useSelector } from "react-redux";
import { servicesAgreementsSelector } from "./../../../../redux/reducer";
import { useDispatch } from "react-redux";
import {
  changeQuoteStatus,
  fetchGeneratedQuote,
  fetchQuoteDetails,
  uploadQuoteFile,
} from "../../../../redux/actions";
import {
  PrinterSvg,
  UploadSvg,
  DownloadSvg,
} from "../../../../../../../assets/icons";
import { getQuoteStatusColor } from "../../helper";
import ReactToPrint from "react-to-print";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import {
  GENERATED_DOCUMENT,
  quoteStatuses,
  UPLOADED_DOCUMENT,
} from "../../constants";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack";

const useStyles = makeStyles((theme) =>
  createStyles({
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    paper: {
      width: 450,
      borderRadius: 5,
      minHeight: 250,
      background: "white",
      marginTop: -350,
    },
    header: {
      padding: 15,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      height: "20%",
      borderBottom: "solid 1px grey",
    },
    headerTitle: {
      fontWeight: 600,
      fontSize: "1.1em",
    },
    closeBtn: {
      fontWeight: 600,
      fontSize: "1.2em",
      cursor: "pointer",
    },
    body: {
      width: "100%",
      height: "50%",
      padding: "30px 15px",
    },
    root: {
      "& > *": {
        margin: theme.spacing(1),
      },
    },
    input: {
      display: "none",
    },
    fileInfo: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
    },
    footer: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 15,
      width: "100%",
      height: "30%",
    },
    button: {
      width: "47%",
      height: "55%",
    },
  })
);

export const AgreementQuote = (props) => {
  const { quoteId, getAgreementDetails } = props;
  const classes = useStyles();
  const dispatch = useDispatch();

  const $quoteDetails = useSelector(servicesAgreementsSelector("quoteDetails"));
  const loading = useSelector(servicesAgreementsSelector("quoteLoading"));

  const $generatedQuote = useSelector(
    servicesAgreementsSelector("generatedQuote")
  );

  const { loading: quoteLoading, data: quoteDetails } = $quoteDetails;

  const [activeDocument, setActiveDocument] = useState("GENERATED_DOCUMENT");
  const [file, setFile] = useState(null);
  const [pdfNumPages, setPdfNumPages] = useState(0);

  const [uploadModalProps, setUploadModalProps] = useState({
    visible: false,
    shouldRender: false,
  });

  useEffect(() => {
    dispatch(fetchQuoteDetails(quoteId));
  }, []);

  useEffect(
    () => {
      if (quoteDetails) {
        if (quoteDetails.fileName && isPdfOrImage(quoteDetails.fileName)) {
          setActiveDocument(UPLOADED_DOCUMENT);
        } else {
          setActiveDocument(GENERATED_DOCUMENT);
          dispatch(fetchGeneratedQuote(quoteDetails.id));
        }
      }
    },
    [quoteDetails]
  );

  const onAcceptClick = () => {
    dispatch(
      changeQuoteStatus(
        {
          id: quoteId,
          contractStatus: "ACCEPTED",
        },
        getAgreementDetails
      )
    );
  };

  const onGenerateDocumentClick = () => {
    setActiveDocument("GENERATED_DOCUMENT");

    if (!$generatedQuote.data) {
      dispatch(fetchGeneratedQuote(quoteId));
    }
  };
  const onPrintDocumentClick = (id) => {
    if (activeDocument === "GENERATED_DOCUMENT") {
      printIframe(id);
    }
  };

  const showUploadedDocument = () => {
    setActiveDocument("UPLOADED_DOCUMENT");
  };

  const onUploadClick = () => {
    setUploadModalProps({ visible: true, shouldRender: true });
  };

  const onUploadSubmit = (formData) => {
    dispatch(
      uploadQuoteFile(
        {
          id: quoteDetails.id,
          file: formData,
        },
        () => {
          setUploadModalProps((prev) => ({ ...prev, visible: false }));
          dispatch(fetchQuoteDetails(quoteId));
          setFile(null);
        },
        (error) => {
          alert(error.message);
        }
      )
    );
  };

  const generatedDocRender = () => {
    if ($generatedQuote.loading) {
      return (
        <div className="custom-loader">
          <CircularProgress />
        </div>
      );
    } else {
      if ($generatedQuote.data) {
        return (
          <div>
            <div className="current-order__document-btns">
              <button
                onClick={() => onPrintDocumentClick("divToPrint")}
                className="btn-icon"
              >
                <PrinterSvg size={35} />
              </button>
            </div>
            <iframe
              id="divToPrint"
              width="100%"
              height="1000px"
              srcDoc={$generatedQuote.data}
            />
          </div>
        );
      }
    }

    return null;
  };

  if (!quoteDetails && quoteLoading) {
    return (
      <div className="custom-loader current-order-loader">
        <CircularProgress size="large" />
      </div>
    );
  } else if (!quoteDetails) {
    return null;
  }

  let uploadedDocumentRef;

  return (
    <div className="current-order">
      <div className="current-order__top">
        <div className="current-order__top-left">
          <Status
            color={getQuoteStatusColor(quoteDetails.status.code)}
            size="large"
          >
            {quoteDetails.status.nameRu}
          </Status>
        </div>
        <div className="current-order__top-right">
          <div className="current-order__btns">
            {quoteDetails.fileName && (
              <>
                <Button
                  variant={
                    activeDocument === GENERATED_DOCUMENT ? "outlined" : "text"
                  }
                  color={"default"}
                  onClick={onGenerateDocumentClick}
                  disabled={$generatedQuote.loading}
                >
                  Оригинал
                </Button>
                <div className="current-order__uploaded-file">
                  {isPdfOrImage(quoteDetails.fileName) ? (
                    <Button
                      variant={
                        activeDocument !== GENERATED_DOCUMENT
                          ? "outlined"
                          : "text"
                      }
                      onClick={showUploadedDocument}
                    >
                      Загруженный
                    </Button>
                  ) : (
                    <a
                      href={quoteDetails.fileUri}
                      target="blank"
                      download
                      className="ant-btn file-download"
                    >
                      {quoteDetails.fileName}
                    </a>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="current-order__upload">
            <button className="btn-icon" onClick={onUploadClick}>
              <UploadSvg />
            </button>
          </div>

          {quoteDetails.status.code !== quoteStatuses.ACCEPTED && (
            <div className="current-order__accept">
              <Button
                type="primary"
                //loading={$changeQuoteStatus.loading}
                onClick={onAcceptClick}
              >
                Подтвердить
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="current-order__document">
        {activeDocument === GENERATED_DOCUMENT ? (
          generatedDocRender()
        ) : (
          <div>
            <div className="current-order__document-btns">
              <ReactToPrint
                trigger={() => <Button startIcon={<PrinterSvg />} />}
                content={() => uploadedDocumentRef}
              />
              <a
                href={quoteDetails.fileUri}
                target="blank"
                download
                className="ant-btn ant-btn-primary file-download"
                style={{ width: 25, height: 25 }}
              >
                <DownloadSvg />
              </a>
            </div>
            <div
              className="current-order__document-content"
              ref={(el) => (uploadedDocumentRef = el)}
            >
              {isImage(quoteDetails.fileName) ? (
                <div className="current-order__document-img">
                  <img src={quoteDetails.fileUri} alt="" />
                </div>
              ) : (
                <Document
                  file={quoteDetails.fileUri}
                  onLoadSuccess={({ numPages }) => setPdfNumPages(numPages)}
                  className="doc"
                >
                  {Array(pdfNumPages)
                    .fill(null)
                    .map((_, index) => (
                      <Page key={index} pageNumber={index + 1} width={1200} />
                    ))}
                </Document>
              )}
            </div>
          </div>
        )}
      </div>

      {uploadModalProps.shouldRender && (
        <Modal
          open={uploadModalProps.visible}
          className={classes.modal}
          onClose={() =>
            setUploadModalProps((prev) => ({ ...prev, visible: false }))
          }
        >
          <div className={classes.paper}>
            <div className={classes.header}>
              <span className={classes.headerTitle}>Загрузить документ</span>
              <span
                onClick={() =>
                  setUploadModalProps((prev) => ({ ...prev, visible: false }))
                }
                className={classes.closeBtn}
              >
                ✖
              </span>
            </div>
            <div className={classes.body}>
              <div className={classes.root}>
                <input
                  className={classes.input}
                  id="contained-button-file"
                  onChange={(e) => {
                    setFile(e.target.files[0]);
                  }}
                  type="file"
                />
                <label htmlFor="contained-button-file">
                  <span>Документ</span>
                  <br />
                  <br />
                  <Button
                    variant="outlined"
                    size="small"
                    color="default"
                    component="span"
                  >
                    Upload
                  </Button>
                </label>
              </div>
              <div className={classes.fileInfo}>
                <span>{file && file.name}</span>
                {file && (
                  <IconButton
                    aria-label="delete"
                    className={classes.margin}
                    onClick={() => setFile(null)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )}
              </div>
            </div>
            <div className={classes.footer}>
              <Button
                className={classes.button}
                variant="outlined"
                disabled={loading}
                onClick={() => {
                  file && setFile(null);
                  setUploadModalProps((prev) => ({ ...prev, visible: false }));
                }}
              >
                Отмена
              </Button>
              <Button
                className={classes.button}
                variant="contained"
                color="primary"
                disabled={!file || loading}
                onClick={() => {
                  const files = new FormData();
                  files.append("file", file);
                  onUploadSubmit(files);
                }}
              >
                {loading ? (
                  <CircularProgress size={16} style={{ color: "green" }} />
                ) : (
                  "Отправить"
                )}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// utils , helpers  >>>

const validImageExtensions = ["jpg", "jpeg", "bmp", "gif", "png"];
export const isImage = (filename) => {
  const extension = filename.substr(filename.lastIndexOf(".") + 1);
  return validImageExtensions.indexOf(extension) !== -1;
};

export const isPdf = (filename) => {
  const extension = filename.substr(filename.lastIndexOf(".") + 1);
  return extension === "pdf";
};

export const isPdfOrImage = (filename) => isPdf(filename) || isImage(filename);

export const printIframe = (id) => {
  const iframe = document.hasOwnProperty("frames")
    ? document.frames[id]
    : document.getElementById(id);
  const iframeWindow = iframe.contentWindow || iframe;

  iframe.focus();
  iframeWindow.print();

  return false;
};
