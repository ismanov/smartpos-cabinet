import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  OutlinedInput,
} from "@material-ui/core";

/**
 * @deprecated
 * use ../button.js
 */
const SelectBox = (props) => {
  return (
    <FormControl
      fullWidth
      variant="outlined"
      error={props.error}
      style={{ padding: 0 }}
      disabled={props.disabled}
    >
      <InputLabel>{props.label}</InputLabel>
      <Select
        {...props}
        error={props.error}
        disabled={props.disabled}
        input={
          <OutlinedInput labelWidth={props.labelWidth} label={props.label} />
        }
      >
        {!props.customItems || props.customItems === false
          ? props.data &&
            props.data.map((item, index) => {
              return (
                <MenuItem key={index} value={item[props.itemKey]}>
                  {item[props.itemValue]}
                </MenuItem>
              );
            })
          : props.children}
      </Select>
      {props.helperText && <FormHelperText>{props.helperText}</FormHelperText>}
    </FormControl>
  );
};

export default SelectBox;
