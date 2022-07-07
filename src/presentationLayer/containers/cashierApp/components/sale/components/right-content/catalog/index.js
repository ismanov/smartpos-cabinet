import React from "react";
import { makeStyles } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import TreeView from "@material-ui/lab/TreeView";
import FolderOutlinedIcon from "@material-ui/icons/FolderOutlined";
import TreeItem from "@material-ui/lab/TreeItem";

const useStyles = makeStyles(() => ({
  container: {
    width: "100%",
    height: "100%",
    padding: 15,
  },
  header: {
    width: "100%",
    height: 21,
    marginBottom: 23,
    fontSize: 18,
    fontWeight: 600,
  },
  searchBar: {
    width: "100%",
    height: 35,
    borderRadius: 5,
    border: "1px solid #B0B0B0",
    display: "flex",
    padding: "0 13px",
    alignItems: "center",
  },
  inputStyle: {
    marginLeft: 13,
    border: "none",
    outline: "none",
    flexGrow: 1,
    fontSize: 16,
    backgroundColor: "transparent",
  },
  treeRoot: {
    marginTop: 16,
  },
  treeItem: {
    boxShadow: "inset 0px -1px 0px #E5E5E5",
    padding: "10px 2px",
  },
}));

const Catalog = () => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <span>Товары</span>
      </div>
      <div className={classes.searchBar}>
        <SearchIcon style={{ color: "#009f3c" }} />
        <input type="text" className={classes.inputStyle} placeholder="Поиск" />
      </div>
      <TreeView
        className={classes.treeRoot}
        defaultCollapseIcon={
          <FolderOutlinedIcon
            style={{ fontSize: "1.7em", fontWeight: 900, color: "#009f3c" }}
          />
        }
        defaultExpandIcon={
          <FolderOutlinedIcon style={{ fontSize: "1.7em", color: "#009f3c" }} />
        }
        defaultEndIcon={
          <FolderOutlinedIcon style={{ fontSize: "1.7em", color: "#009f3c" }} />
        }
      >
        <TreeItem nodeId="1" label="Название" className={classes.treeItem} />
        <TreeItem
          nodeId="ds1"
          label="Молочные продукты"
          className={classes.treeItem}
        >
          <TreeItem nodeId="2s" label="Молоко" className={classes.treeItem} />
          <TreeItem nodeId="3" label="Кефир" className={classes.treeItem} />
          <TreeItem nodeId="4" label="Сметана" className={classes.treeItem} />
          <TreeItem nodeId="4" label="Ряженка" className={classes.treeItem} />
          <TreeItem nodeId="4" label="Творог" className={classes.treeItem} />
          <TreeItem nodeId="4" label="Йогурт" className={classes.treeItem} />
        </TreeItem>
        <TreeItem
          nodeId="1ds"
          label="Название категории товаров"
          className={classes.treeItem}
        />
        <TreeItem
          nodeId="1ds"
          label="Название категории товаров"
          className={classes.treeItem}
        />
        <TreeItem
          nodeId="1ds"
          label="Название категории товаров"
          className={classes.treeItem}
        />
        <TreeItem
          nodeId="1ds"
          label="Название категории товаров"
          className={classes.treeItem}
        />
      </TreeView>
    </div>
  );
};
export default Catalog;
