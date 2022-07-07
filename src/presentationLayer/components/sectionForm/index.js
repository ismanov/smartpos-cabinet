import React, { useState, useEffect } from "react";
import styles from "./SectionForm.module.scss";
import FormHeader from "./formHeader";
import PropTypes from "prop-types";
import Paper from "@material-ui/core/Paper";
import cn from "classnames";
import { checkNull } from "../../../utils/helpers";

/**
 * @deprecated
 * use ../button.js
 */
const SectionForm = (props) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setInterval(() => {
      setMounted(true);
    }, 500);
  }, []);

  return (
    <div
      className={cn(
        checkNull(styles, "wrapper"),
        checkNull(props, "className")
      )}
    >
      <FormHeader
        className={cn(styles.header)}
        title={props.title}
        icon={props.icon}
        mounted={mounted}
      />
      <Paper
        className={cn(styles.content)}
        style={{
          height: props.contentHeight || "inherit",
        }}
      >
        {props.children}
      </Paper>
    </div>
  );
};

SectionForm.propTypes = {
  title: PropTypes.string,
  icon: PropTypes.object,
};

export default SectionForm;
