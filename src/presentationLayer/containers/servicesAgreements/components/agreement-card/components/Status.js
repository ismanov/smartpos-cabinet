import React from "react";

export default (props) => {
  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: 5,
      background: getColor(props.status).bgColor,
      border: `solid 1px ${getColor(props.status).borderColor} `,
      borderRadius: 5,
    },
    title: {
      fontSize: "1em",
      textAlign: "center",
      color: getColor(props.status).color,
    },
  };

  return (
    <div style={styles.container}>
      <span style={styles.title}>{props.children}</span>
    </div>
  );
};

const getColor = (status) => {
  switch (status) {
    case "SUCCESS":
      return {
        bgColor: "#f6ffed",
        color: "#347912",
        borderColor: "#b7eb8f",
      };
    case "ERROR":
      return {
        bgColor: "#fff1f0",
        color: "#f5222d",
        borderColor: "#ffa39e",
      };
    default:
      return {
        bgColor: "#e6f7ff",
        color: "#1890ff",
        borderColor: "#91d5ff",
      };
  }
};
