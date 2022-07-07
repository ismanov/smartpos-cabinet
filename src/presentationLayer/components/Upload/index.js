import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  input: {
    display: "none",
  },
  label: {
    margin: 0,
    display: "inline-block",
  },
  filesList: {
    margin: "10px 0 0",
  },
}));

export const Upload = (props) => {
  const { fileList, afterUpload, className } = props;

  const classes = useStyles();

  return (
    <div className={className}>
      <input
        accept={props.accept || "image/*"}
        className={classes.input}
        id="contained-button-file"
        type="file"
        onChange={(event) => {
          afterUpload(event.target.files[0]);
          // const reader = new FileReader();
          // reader.readAsArrayBuffer(event.target.files[0]);
          // reader.onload = () => {
          //   let array = new Uint8Array(reader.result)
          //   if (array.length < 3000000) {
          //     setTempFootLogo(btoa(new Uint8Array(reader.result).reduce((data, byte) => data + String.fromCharCode(byte), '')))
          //   }
          // };
        }}
      />
      <label className={classes.label} htmlFor="contained-button-file">
        {props.children}
      </label>
      <div className={classes.filesList}>
        {fileList.map((file) => (
          <div>{file.name}</div>
        ))}
      </div>
    </div>
  );
};
