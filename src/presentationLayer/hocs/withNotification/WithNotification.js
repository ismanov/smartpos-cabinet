import React from "react";
import ReactNotification from "react-notifications-component";

const duration = 3000;

const withNotification = (Component) => {
  return class WithNotificationComponent extends React.Component {
    constructor(props) {
      super(props);
      this.notificationDOMRef = React.createRef();
      this.success = this.success.bind(this);
      this.error = this.error.bind(this);
      this.warning = this.warning.bind(this);
    }

    success(message) {
      this.notificationDOMRef.current &&
        this.notificationDOMRef.current.addNotification({
          title: "Успешно",
          message: message,
          type: "success",
          insert: "top",
          container: "top-right",
          animationIn: ["animated", "fadeIn"],
          animationOut: ["animated", "fadeOut"],
          dismiss: { duration: duration },
          dismissable: { click: true },
        });
    }

    error(message) {
      this.notificationDOMRef.current &&
        this.notificationDOMRef.current.addNotification({
          title: "Ошибка",
          message: message,
          type: "danger",
          insert: "top",
          container: "top-right",
          animationIn: ["animated", "fadeIn"],
          animationOut: ["animated", "fadeOut"],
          dismiss: { duration: duration },
          dismissable: { click: true },
        });
    }

    warning(message) {
      this.notificationDOMRef.current &&
        this.notificationDOMRef.current.addNotification({
          title: "Угроза",
          message: message,
          type: "warning",
          insert: "top",
          container: "top-right",
          animationIn: ["animated", "fadeIn"],
          animationOut: ["animated", "fadeOut"],
          dismiss: { duration: duration },
          dismissable: { click: true },
        });
    }

    render() {
      return (
        <div style={{ width: "100%" }}>
          <ReactNotification ref={this.notificationDOMRef} />
          <Component
            {...this.props}
            success={this.success}
            error={this.error}
            warning={this.warning}
          />
        </div>
      );
    }
  };
};

export default withNotification;
