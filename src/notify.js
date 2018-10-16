const Notification = window.Notification;
if (Notification) {
  if (Notification.permission === "default")
    Notification.requestPermission(permission => {
      if (!("permission" in Notification)) {
        Notification.permission = permission;
      }
    });
}

export default Notification;
