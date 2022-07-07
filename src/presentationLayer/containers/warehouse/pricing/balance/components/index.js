import React, { useState } from "react";
import {
  List,
  ListItem,
  Collapse,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  Grid,
  Popover,
  Button,
  Typography,
  Tooltip,
} from "@material-ui/core";
import { ArrowRight, ArrowDropDown, Dialpad } from "@material-ui/icons";
import { useTranslation } from "react-i18next";

const PricingCatalogTree = (props) => {
  const [states, setStates] = useState([]);
  const [anchorEl, setAnchorEl] = useState();
  const [menuOpen, setMenuOpen] = useState(false);
  const [id, setId] = useState();
  const [selectedId, setSelectedId] = useState(-1);
  const { t } = useTranslation();

  React.useEffect(
    () => {
      if (props.value) {
        setSelectedId(props.value);
      }
    },
    [props.value]
  );

  const renderItems = (data) => {
    if (data && data.length !== 0) {
      return data.map((node) => {
        return (
          <div key={node.id} style={{ width: "100%", cursor: "pointer" }}>
            <ListItem style={{ margin: 0, padding: 0, height: 50 }}>
              {
                <ListItemAvatar>
                  {node.children && node.children.length !== 0 ? (
                    <IconButton
                      onClick={() => {
                        let t = [...states];
                        if (t.indexOf(node.id) >= 0) {
                          t.splice(t.indexOf(node.id), 1);
                        } else {
                          t.push(node.id);
                        }
                        setStates(t);
                      }}
                    >
                      {states.indexOf(node.id) >= 0 ? (
                        <ArrowDropDown />
                      ) : (
                        <ArrowRight />
                      )}
                    </IconButton>
                  ) : (
                    <div style={{ width: 20, height: 20 }} />
                  )}
                </ListItemAvatar>
              }
              <ListItemText
                onClick={() => {
                  setSelectedId(node.id);
                  props.onItemClick && props.onItemClick(node.id);
                }}
              >
                <Typography
                  variant="h4"
                  color={selectedId === node.id ? "primary" : "inherit"}
                  style={{
                    fontWeight: selectedId === node.id ? "bold" : "300",
                    fontSize: 16,
                  }}
                >
                  {node.name}
                </Typography>
              </ListItemText>
              <ListItemSecondaryAction>
                <Grid container direction="row" alignItems="center">
                  <Grid item>
                    <Typography
                      variant="h4"
                      style={{ fontSize: 14, color: "#555", marginRight: 10 }}
                    >
                      {node.productCount} {t("units.pcs")}.
                    </Typography>
                  </Grid>
                  <Grid item style={{ marginLeft: 5 }}>
                    <Tooltip title={t("common.operations")} arrow>
                      <IconButton
                        onClick={(event) => {
                          setAnchorEl(event.currentTarget);
                          setMenuOpen(true);
                          setId(node);
                        }}
                      >
                        <Dialpad />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                </Grid>
              </ListItemSecondaryAction>
            </ListItem>
            <Divider light />
            {node.children ? (
              <Collapse
                in={states.indexOf(node.id) >= 0}
                style={{ marginLeft: 20 }}
              >
                {renderItems(node.children)}
              </Collapse>
            ) : (
              false
            )}
          </div>
        );
      });
    }
  };

  return (
    <List style={{ width: "100%" }}>
      {renderItems(props.data)}
      <Popover
        id="popup"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        keepMounted
        onClose={() => {
          setMenuOpen(false);
          setAnchorEl(undefined);
          setId(undefined);
        }}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Grid
          container
          style={{
            width: 220,
            padding: "20px, 0",
            backgroundColor: "#fff",
          }}
          direction="column"
        >
          {[t("catalogTree.set_price")].map((item, index) => {
            return (
              <Grid key={index} container direction="column">
                <Grid item style={{ width: "100%" }}>
                  <Button
                    variant="text"
                    fullWidth
                    style={{ height: 45, fontSize: 14 }}
                    onClick={() => {
                      id !== -1 && props.onNewPrice && props.onNewPrice(id);
                      setAnchorEl(undefined);
                    }}
                  >
                    {item}
                  </Button>
                </Grid>
                <Divider light={true} variant="fullWidth" />
              </Grid>
            );
          })}
        </Grid>
      </Popover>
    </List>
  );
};

export default PricingCatalogTree;
