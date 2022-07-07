import { store } from "react-notifications-component";

function NotificationCenter(store) {
  this.store = store;
  this.duration = 3000;
}

NotificationCenter.prototype.success = function(message) {
  this.store.addNotification({
    title: "Успешно",
    message: message,
    type: "success",
    insert: "top",
    container: "top-right",
    animationIn: ["animated", "fadeIn"],
    animationOut: ["animated", "fadeOut"],
    dismiss: { duration: this.duration },
    dismissable: { click: true },
  });
};

NotificationCenter.prototype.error = function(message) {
  this.store.addNotification({
    title: "Ошибка",
    message: message,
    type: "danger",
    insert: "top",
    container: "top-right",
    animationIn: ["animated", "fadeIn"],
    animationOut: ["animated", "fadeOut"],
    dismiss: { duration: this.duration },
    dismissable: { click: true },
  });
};

NotificationCenter.prototype.warning = function(message) {
  this.store.addNotification({
    title: "Угроза",
    message: message,
    type: "warning",
    insert: "top",
    container: "top-right",
    animationIn: ["animated", "fadeIn"],
    animationOut: ["animated", "fadeOut"],
    dismiss: { duration: this.duration },
    dismissable: { click: true },
  });
};

export default new NotificationCenter(store);
