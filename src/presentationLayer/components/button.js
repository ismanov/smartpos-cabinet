import React from "react";
import * as R from "ramda";
import PropTypes from "prop-types";
import {
  Button as MuiButton,
  IconButton as MuiIconButton,
  useTheme,
  Tooltip,
  CircularProgress,
  makeStyles,
} from "@material-ui/core";
import {} from "@material-ui/core/styles";
import cn from "classnames";

const pickColor = R.cond([
  [
    (color) => R.equals("primary", color),
    (_, theme) => theme.palette.primary.main,
  ],
  [
    (color) => R.equals("secondary", color),
    (_, theme) => theme.palette.secondary.main,
  ],
  [(color) => R.not(R.isNil(color)), (color) => color],
  [R.T, (_, theme) => theme.palette.primary.main],
]);

const checkPropToValue = (prop, value) => (props) =>
  R.equals(value, R.prop(prop, props));

const useStyles = makeStyles((theme) => ({
  round: {
    borderRadius: (props) => (props.rounded ? 1000 : 4),
  },
  raised: {
    backgroundColor: (props) => pickColor(props.color, theme),
    color: "white",
    boxShadow: "0px 0px 6px -1px rgba(0,0,0,0.75)",
    "&:hover, &:focus": {
      backgroundColor: (props) => pickColor(props.color, theme),
    },
  },
  outlined: {
    color: (props) => pickColor(props.color, theme),
    backgroundColor: "transparent",
    borderWidth: 1,
    borderStyle: "solid",
  },
  text: {
    color: (props) => pickColor(props.color, theme),
    backgroundColor: "transparent",
  },
  disabled: {
    backgroundColor: "lightGray",
  },
  buttonHeight: {
    [theme.breakpoints.down("sm")]: {
      height: (props) =>
        props.style && props.style.height ? props.style.height : 35,
    },
    [theme.breakpoints.between("sm", "md")]: {
      height: (props) =>
        props.style && props.style.height ? props.style.height : 40,
    },
    [theme.breakpoints.up("md")]: {
      height: (props) =>
        props.style && props.style.height ? props.style.height : 45,
    },
  },
  circular: {
    [theme.breakpoints.down("sm")]: {
      height: 25,
      width: 25,
    },
    [theme.breakpoints.up("md")]: {
      height: 30,
      width: 30,
    },
    [theme.breakpoints.up("lg")]: {
      height: 35,
      width: 35,
    },
  },
}));

export const Button = (props) => {
  return R.pipe(
    R.mergeDeepLeft(R.assoc("classes", useStyles(props), {})),
    (props) =>
      R.mergeDeepLeft(
        R.assoc(
          "className",
          cn(
            props.classes.round,
            props.classes.buttonHeight,
            props.disabled && props.classes.disabled,
            R.equals("raised", R.prop("variant", props)) &&
              props.classes.raised,
            R.equals("outlined", R.prop("variant", props)) &&
              props.classes.outlined,
            R.equals("text", R.prop("variant", props)) && props.classes.text,
            props.className
          ),
          {}
        ),
        props
      ),
    R.cond([
      [
        checkPropToValue("variant", "raised"),
        R.mergeDeepLeft(R.assoc("variant", "contained", {})),
      ],
      [
        checkPropToValue("variant", "outlined"),
        R.mergeDeepLeft(R.assoc("variant", "outlined", {})),
      ],
      [
        checkPropToValue("variant", "text"),
        R.mergeDeepLeft(R.assoc("variant", "text", {})),
      ],
      [R.T, R.mergeDeepLeft(R.assoc("variant", "text", {}))],
    ]),
    R.pick([
      "variant",
      "leftIcon",
      "rightIcon",
      "style",
      "disabled",
      "isLoading",
      "title",
      "classes",
      "className",
      "onClick",
      "type",
    ]),
    (props) =>
      !props.isLoading && props.tooltip ? (
        <Tooltip
          title={props.tooltip}
          placement={"bottom"}
          arrow
          style={props.style}
        >
          <MuiButton
            {...props}
            fullWidth
            color="inherit"
            variant={props.variant}
            startIcon={props.leftIcon}
            endIcon={props.rightIcon}
            style={props.style}
            disabled={props.disabled || props.isLoading}
          >
            {" "}
            {props.isLoading ? (
              <CircularProgress
                variant="indeterminate"
                className={props.classes.circular}
              />
            ) : (
              props.title
            )}{" "}
          </MuiButton>
        </Tooltip>
      ) : (
        <MuiButton
          {...props}
          fullWidth
          color="inherit"
          variant={props.variant}
          startIcon={props.leftIcon}
          endIcon={props.rightIcon}
          style={props.style}
        >
          {" "}
          {props.isLoading ? (
            <CircularProgress
              variant="indeterminate"
              className={props.classes.circular}
            />
          ) : (
            props.title
          )}{" "}
        </MuiButton>
      )
  )(props);
};

Button.propTypes = {
  title: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(["raised", "text", "outlined"]),
  onClick: PropTypes.func,
  leftIcon: PropTypes.element,
  rightIcon: PropTypes.element,
  rounded: PropTypes.bool,
  tooltip: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  type: PropTypes.string,
};

export const IconButton = (props) => {
  return R.pipe(
    R.mergeDeepLeft(R.assoc("classes", useStyles(props), {})),
    (props) =>
      R.mergeDeepLeft(
        R.assoc(
          "className",
          cn(
            props.classes.round,
            props.classes.buttonHeight,
            props.disabled && props.classes.disabled,
            R.equals("raised", R.prop("variant", props)) &&
              props.classes.raised,
            R.equals("outlined", R.prop("variant", props)) &&
              props.classes.outlined,
            R.equals("text", R.prop("variant", props)) && props.classes.text,
            props.className
          ),
          {}
        ),
        props
      ),
    R.pick([
      "icon",
      "style",
      "disabled",
      "isLoading",
      "classes",
      "className",
      "onClick",
      "type",
    ]),
    (props) =>
      props.tooltip ? (
        <Tooltip
          title={props.tooltip}
          placement={"bottom"}
          arrow
          style={props.style}
        >
          <MuiIconButton {...props} className={props.className}>
            {" "}
            {props.isLoading ? (
              <CircularProgress
                variant="indeterminate"
                className={props.classes.circular}
              />
            ) : (
              props.icon
            )}{" "}
          </MuiIconButton>
        </Tooltip>
      ) : (
        <MuiIconButton {...props} className={props.className}>
          {" "}
          {props.isLoading ? (
            <CircularProgress
              variant="indeterminate"
              className={props.classes.circular}
            />
          ) : (
            props.icon
          )}{" "}
        </MuiIconButton>
      )
  )(props);
};

IconButton.propTypes = {
  color: PropTypes.func,
  variant: PropTypes.oneOf(["raised", "text", "outlined"]),
  onClick: PropTypes.func,
  icon: PropTypes.element.isRequired,
  tooltip: PropTypes.string,
  rounded: PropTypes.bool,
  size: PropTypes.number,
};
