import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  Typography,
  IconButton,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions,
  Tooltip,
  Grid,
  makeStyles,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  Modal,
} from "@material-ui/core";
import { AddBoxOutlined, SearchOutlined } from "@material-ui/icons";
import TreeView from "../../catalogTree";
import Paper from "@material-ui/core/Paper";
import CategoryAddEditDialog from "../components/CategoryAddEditDialog";
import { Switch, Route } from "react-router-dom";
import ProductList from "./productList";
import Logic from "../../../../businessLayer";
import FileDownload from "js-file-download";
import withNotification from "../../../hocs/withNotification/WithNotification";
import { CloudUpload, CloudDownload, Sync } from "@material-ui/icons";
import SelectBox from "#components/Select";
import { transferCatalog } from "./actions";
import { useTranslation } from "react-i18next";
import { faPercent, faMarker } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  addCategory,
  fetchBranchList,
  fetchMyCatalog,
  removeCategory,
  setCategory,
  setProductList,
  setSelectedCategoryId,
  updateCategory,
} from "./actions";
import { boolean } from "yup";
import Branches from "../../../components/ScrollBarTableWithCheckButtton";

const useStyle = makeStyles(() => ({
  paper: {
    height: "calc(100vh - 5rem - 80px)",
    width: "100%",
    padding: 20,
    overflow: "hidden",
  },
  content: {
    height: "100%",
  },
  categories: {
    height: "100%",
    overflow: "auto",
    border: "1px solid #eee",
    borderRadius: 5,
  },
  categoriesFilters: {
    padding: 10,
  },
  products: {
    paddingLeft: 20,
    height: "100%",
  },
  productsContent: {
    height: "100%",
    overflow: "auto",
    border: "1px solid #eee",
    borderRadius: 5,
    paddingTop: 20,
  },
}));

const MyCatalog = (props) => {
  const [addGroupDialog, setAddGroupDialog] = useState(false);
  const [addGroupParent, setAddGroupParent] = useState(-1);
  const [categoryName, setCategoryName] = useState("");
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentCategory, setCurrentCategory] = useState();
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [uploadCategoryId, setUploadCategoryId] = useState();
  const [transferDialog, setTransferDialog] = useState();
  const [transferToCatalogId, setTransferToCatalogId] = useState();
  const [groupNameError, setGroupNameError] = useState();
  const [batchUpdateCategoryId, setBatchUpdateCateogryid] = useState();
  const [batchUpdateMarkCategoryId, setBatchUpdateMarkCategoryId] = useState();
  const [batchUpdateNds, setBatchUpdateNds] = useState(null);
  const [batchUpdateMark, setBatchUpdateMark] = useState("no");
  const [vatList, setVatList] = useState([]);

  // redux
  const currentBranch = useSelector(
    (state) => state.get("dashboard").currentBranch
  );
  const branchList = useSelector(
    (state) => state.get("myCatalog").syncBranchList
  );
  const node = useSelector((state) => state.get("myCatalog").node);
  const myCatalog = useSelector((state) => state.get("myCatalog").myCatalog);
  const isLoading = useSelector((state) => state.get("myCatalog").isLoading);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const classes = useStyle();

  useEffect(() => {
    Logic.resource.fetchVatList().then((response) => setVatList(response.data));
  }, []);

  useEffect(
    () => {
      props.history.push("/main/catalog/my");
      dispatch(fetchMyCatalog(currentBranch));
    },
    [currentBranch]
  );

  useEffect(
    () => {
      if (node) {
        props.history.push(`/main/catalog/my?categoryId=${node.id}`);
      }
    },
    [node]
  );

  useEffect(() => {
    dispatch(fetchBranchList());
    dispatch(setProductList([]));
    dispatch(fetchMyCatalog(currentBranch));
  }, []);

  const currentCategoryId = () => {
    let search = props.location.search;
    let id;
    if (search) {
      let splitted = search.split("=");
      if (splitted.length > 1) {
        id = splitted[1];
      }
    }
    return id;
  };

  return (
    <Grid container>
      <Dialog
        fullWidth
        open={batchUpdateMarkCategoryId}
        onClose={() => {
          setBatchUpdateMarkCategoryId(undefined);
          setBatchUpdateMark("no");
        }}
      >
        <DialogTitle> Установить Маркировку </DialogTitle>
        <DialogContent>
          <div style={{ padding: 10 }}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Маркировка</FormLabel>
              <RadioGroup
                aria-label="mark"
                name="mark"
                value={batchUpdateMark}
                onChange={(e) => {
                  setBatchUpdateMark(e.target.value);
                }}
              >
                <FormControlLabel
                  value="yes"
                  control={<Radio color="primary" />}
                  label="Да"
                />
                <FormControlLabel
                  value="no"
                  control={<Radio color="primary" />}
                  label="Нет"
                />
              </RadioGroup>
            </FormControl>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            color="secondary"
            onClick={() => {
              setBatchUpdateMarkCategoryId(undefined);
              setBatchUpdateMark("no");
            }}
          >
            Отмена
          </Button>
          <Button
            color="primary"
            onClick={() => {
              console.log("id", batchUpdateMarkCategoryId);

              Logic.product
                .setMarkBatch(
                  currentBranch,
                  batchUpdateMarkCategoryId !== -1
                    ? batchUpdateMarkCategoryId
                    : null,
                  batchUpdateMark === "yes"
                )
                .then(() => {
                  props.success("Обработано успешно!");
                  setBatchUpdateMarkCategoryId(undefined);
                  setBatchUpdateMark("no");
                })
                .catch((e) => {
                  props.error(e);
                  setBatchUpdateMarkCategoryId(undefined);
                  setBatchUpdateMark("no");
                });
            }}
          >
            Применить
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        fullWidth
        open={batchUpdateCategoryId}
        onClose={() => {
          setBatchUpdateCateogryid(undefined);
          setBatchUpdateNds(null);
        }}
      >
        <DialogTitle> Установить НДС </DialogTitle>
        <DialogContent>
          <div style={{ padding: 10 }}>
            <SelectBox
              label="НДС"
              itemKey="id"
              itemValue="name"
              // disabled={!!props.current}
              value={batchUpdateNds}
              data={[
                {
                  id: -1,
                  name: "Без НДС",
                },
                ...vatList.map((v) => ({
                  id: v.id,
                  name: `${v.name} - ${v.percent}%`,
                })),
              ]}
              onChange={(event) => {
                let vat = event.target.value === -1 ? null : event.target.value;
                setBatchUpdateNds(vat);
              }}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            color="secondary"
            onClick={() => {
              setBatchUpdateCateogryid(undefined);
              setBatchUpdateNds(null);
            }}
          >
            Отмена
          </Button>
          <Button
            color="primary"
            onClick={() => {
              let nds;
              if (batchUpdateNds) {
                nds = vatList.find((v) => v.id === batchUpdateNds).percent;
              }
              Logic.product
                .setVatBatch(
                  currentBranch,
                  batchUpdateCategoryId !== -1 ? batchUpdateCategoryId : null,
                  nds
                )
                .then(() => {
                  props.success("Обработано успешно!");
                  setBatchUpdateCateogryid(undefined);
                  setBatchUpdateNds(null);
                })
                .catch((e) => {
                  props.error(e);
                  setBatchUpdateCateogryid(undefined);
                  setBatchUpdateNds(null);
                });
            }}
          >
            Применить
          </Button>
        </DialogActions>
      </Dialog>
      <Grid container direction="row">
        <Grid item>
          <Typography
            variant="h4"
            style={{
              color: "#555",
              fontSize: 18,
              fontWeight: "bold",
              marginTop: 15,
              marginBottom: 15,
            }}
          >
            {t("myCatalog.title")}
          </Typography>
        </Grid>
        {currentBranch && (
          <Grid item>
            <Tooltip title={t("myCatalog.sync")}>
              <IconButton
                color="primary"
                onClick={() => {
                  setTransferDialog(true);
                }}
              >
                <Sync />
              </IconButton>
            </Tooltip>
            <Tooltip title={t("myCatalog.upload_template")}>
              <IconButton
                color="primary"
                style={{ marginRight: 15 }}
                onClick={() => {
                  let e = document.getElementById("file");
                  e.click();
                }}
              >
                <CloudUpload />
              </IconButton>
            </Tooltip>
            <Tooltip title={t("myCatalog.download_template")}>
              <IconButton
                color="primary"
                style={{ marginRight: 10 }}
                onClick={() => {
                  Logic.myCatalog
                    .downloadTemplate({ branchId: currentBranch })
                    .then((response) => {
                      FileDownload(response.data, "product_list_template.xlsx");
                    })
                    .catch(console.log);
                }}
              >
                <CloudDownload />
              </IconButton>
            </Tooltip>
            <Tooltip title="Установить НДС для текущего филиала">
              <IconButton
                color="primary"
                style={{ marginRight: 10, fontSize: 18 }}
                onClick={() => {
                  setBatchUpdateCateogryid(-1);
                }}
              >
                <FontAwesomeIcon icon={faPercent} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Установить Маркировку для текущего филиала">
              <IconButton
                color="primary"
                style={{ marginRight: 10, fontSize: 18 }}
                onClick={() => {
                  setBatchUpdateMarkCategoryId(-1);
                }}
              >
                <FontAwesomeIcon icon={faMarker} />
              </IconButton>
            </Tooltip>
          </Grid>
        )}
      </Grid>
      <input
        id="file"
        type="file"
        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        onChange={(e) => {
          // Logic
          //     .product
          //     .importProducts(e.target.files[0], {categoryId: uploadCategoryId, branchId: currentBranch})
          //     .then(response => {
          //         props.success('Успех!');
          //         if (currentBranch) {
          //           dispatch(fetchMyCatalog(currentBranch));
          //           if (uploadCategoryId !== undefined)
          //               props.history.push(`/main/catalog/my?categoryId=${uploadCategoryId}`)
          //         }
          //     })
          //     .catch(error => {
          //         props.error(error.toString());
          //     });
          Logic.product
            .importProductsRef(e.target.files[0], {
              categoryId: uploadCategoryId,
              branchId: currentBranch,
            })
            .then((response) => {
              props.success("Успех!");
              if (response.status === 204) {
                props.success("Успех!");
                if (currentBranch) {
                  dispatch(fetchMyCatalog(currentBranch));
                  if (uploadCategoryId !== undefined)
                    props.history.push(
                      `/main/catalog/my?categoryId=${uploadCategoryId}`
                    );
                }
                // setUploadCategoryId(undefined);
              } else if (response.status === 200) {
                props.error(
                  "Импортировать список продуктов не удалось! Так как файл содержить некорректный формат данных!"
                );
                FileDownload(response.data, "product_list_import_error.xlsx");
              }
            })
            .catch((error) => {
              props.error(error.toString());
              // setUploadCategoryId(undefined);
            });
          e.target.value = "";
        }}
        style={{ display: "none" }}
      />
      <Paper className={classes.paper}>
        <Grid container direction="row" className={classes.content}>
          <Grid item md={5} xs={12} className={classes.categories}>
            <Grid
              container
              className={classes.categoriesFilters}
              direction="row"
              alignItems="center"
            >
              <Grid item xs={6}>
                <TextField
                  placeholder={t("myCatalog.search_by_category")}
                  fullWidth
                  onChange={(event) => {
                    setSearchKeyword(event.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={1}>
                <Tooltip title={t("myCatalog.search_by_category_tooltip")}>
                  <IconButton color="primary">
                    <SearchOutlined style={{ fontSize: 35 }} />
                  </IconButton>
                </Tooltip>
              </Grid>

              <Grid item xs={1}>
                <Tooltip title={t("myCatalog.add_category")}>
                  <IconButton
                    color="primary"
                    onClick={() => {
                      setCategoryDialogOpen(true);
                    }}
                    style={{ display: currentBranch ? "block" : "none" }}
                  >
                    <AddBoxOutlined style={{ fontSize: 35 }} />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={12}>
                <TreeView
                  data={myCatalog}
                  keyword={searchKeyword}
                  itemClickable
                  onItemClicked={(node) => {
                    dispatch(setCategory(node));
                  }}
                  isLoading={isLoading}
                  showProductCount
                  selected={currentCategoryId()}
                  options={
                    currentBranch && [
                      t("myCatalog.add_group"),
                      t("myCatalog.add_product"),
                      t("common.delete"),
                      t("myCatalog.download_template"),
                      t("myCatalog.upload_template"),
                      t("myCatalog.setBatchNDS"),
                      "Установить Маркировку",
                    ]
                  }
                  onOperationClick={({ index, item }) => {
                    switch (index) {
                      case 0:
                        setAddGroupParent(item.id);
                        setAddGroupDialog(true);
                        break;
                      case 1:
                        dispatch(setSelectedCategoryId(item.id));
                        break;
                      case 2:
                        setDeleteDialog(true);
                        setDeletingCategory(item);
                        break;
                      case 3:
                        Logic.myCatalog
                          .downloadTemplate({ categoryId: item.id })
                          .then((response) => {
                            FileDownload(
                              response.data,
                              "product_list_template.xlsx"
                            );
                          })
                          .catch(console.log);
                        break;
                      case 4:
                        let e = document.getElementById("file");
                        e.click();
                        setUploadCategoryId(item.id);
                        break;
                      case 5:
                        setBatchUpdateCateogryid(item.id);
                        break;
                      case 6:
                        console.log("item", item.id);
                        setBatchUpdateMarkCategoryId(item.id);
                        break;
                      default:
                        break;
                    }
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={7} xs={12} className={classes.products}>
            <Grid container className={classes.productsContent}>
              <Grid item xs={12}>
                <Switch>
                  <Route path="/main/catalog/my" component={ProductList} />
                </Switch>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
      <Dialog
        onClose={() => {
          setTransferDialog(false);
          setTransferToCatalogId(undefined);
        }}
        fullWidth
        open={transferDialog}
      >
        <DialogTitle>{t("myCatalog.sync_catalog")}</DialogTitle>
        <DialogContentText>
          <div style={{ padding: 20 }}>
            <Typography
              variant="h4"
              style={{ padding: "20px 0", fontSize: 17, color: "#555" }}
            >
              {t("myCatalog.choose_sync_branch")}
            </Typography>
            <div style={{ marginTop: 20 }}>
              {/* <Branches
                data={branchList.filter((b) => b.id !== currentBranch)}
                onChange={(val) => {
                  setTransferToCatalogId(val);
                }}
              /> */}
              <SelectBox
                label="Филиал"
                labelWidth={70}
                itemKey="id"
                itemValue="name"
                data={branchList.filter((b) => b.id !== currentBranch) || []}
                value={
                  Array.isArray(transferToCatalogId)
                    ? transferToCatalogId[0]
                    : undefined
                }
                onChange={(event) =>
                  setTransferToCatalogId([event.target.value])
                }
              />
            </div>
          </div>
        </DialogContentText>
        <DialogActions>
          <Button
            // disabled={
            //   !(
            //     transferToCatalogId &&
            //     transferToCatalogId.length &&
            //     transferToCatalogId.length > 0
            //   )
            // }
            disabled={!transferToCatalogId}
            color="primary"
            onClick={() => {
              dispatch(
                transferCatalog(currentBranch, transferToCatalogId, props)
              );
              setTransferDialog(false);
              setTransferToCatalogId(undefined);
            }}
          >
            Синхронизировать
            {/* {t("common.yes")} */}
          </Button>
          <Button
            color="primary"
            onClick={() => {
              setTransferDialog(false);
              setTransferToCatalogId(undefined);
            }}
          >
            Отменить
            {/* {t("common.no")} */}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        onClose={() => {
          setDeleteDialog(false);
          setDeletingCategory(undefined);
        }}
        fullWidth
        open={deleteDialog}
      >
        <DialogTitle>{t("myCatalog.delete_category_title")}</DialogTitle>
        <DialogContentText>
          <Typography
            variant="h4"
            style={{ padding: 20, fontSize: 17, color: "#555" }}
          >
            {t("myCatalog.delete_category_text")}
          </Typography>
        </DialogContentText>
        <DialogActions>
          <Button
            color="primary"
            onClick={() => {
              dispatch(removeCategory(deletingCategory, currentBranch, props));
              setDeleteDialog(false);
              setDeletingCategory(undefined);
            }}
          >
            {t("common.yes")}
          </Button>
          <Button
            color="primary"
            onClick={() => {
              setDeleteDialog(false);
              setDeletingCategory(undefined);
            }}
          >
            {t("common.no")}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={addGroupDialog}
        onClose={() => {
          setAddGroupParent(-1);
          setAddGroupDialog(false);
          setCategoryName("");
        }}
        fullWidth
      >
        <DialogTitle>{t("myCatalog.add_category")}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            value={categoryName}
            error={!!groupNameError}
            helperText={groupNameError}
            onChange={(event) => {
              setCategoryName(event.target.value);
              setGroupNameError(undefined);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="text"
            color="primary"
            onClick={() => {
              setAddGroupDialog(false);
            }}
          >
            {t("common.no")}
          </Button>
          <Button
            variant="text"
            color="primary"
            onClick={() => {
              if (!categoryName) {
                setGroupNameError(t("myCatalog.enterCategoryName"));
                return;
              }

              dispatch(
                addCategory(
                  {
                    parentId: addGroupParent,
                    name: categoryName,
                    enabled: true,
                  },
                  currentBranch
                )
              );
              setAddGroupDialog(false);
              setAddGroupParent(-1);
              setCategoryName("");
            }}
          >
            {t("common.add")}
          </Button>
        </DialogActions>
      </Dialog>

      <CategoryAddEditDialog
        open={categoryDialogOpen}
        onAddCategory={(category) => {
          if (currentCategory) {
            dispatch(updateCategory(category, currentBranch));
          } else {
            dispatch(addCategory(category, currentBranch));
          }
          setCurrentCategory(undefined);
          setCategoryDialogOpen(false);
        }}
        onCancel={() => {
          setCurrentCategory(undefined);
          setCategoryDialogOpen(false);
        }}
        current={currentCategory}
      />
    </Grid>
  );
};

export default withNotification(withRouter(MyCatalog));
