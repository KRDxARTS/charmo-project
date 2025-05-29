export function requestNotificationPermission() {
  if ("Notification" in window) {
    return Notification.requestPermission();
  }
  return Promise.reject('Notifications not supported');
}

export function showNotification(title, options) {
  if (Notification.permission === "granted") {
    new Notification(title, options);
  }
}

export function setupClassReminders(checkInterval = 5 * 60 * 1000) {
  return setInterval(() => {
    const now = new Date();
    document.querySelectorAll("#classList li").forEach(cls => {
      const timeText = cls.textContent.split(" - ")[1];
      const classTime = new Date(timeText);
      if (classTime - now <= 30 * 60 * 1000) {
        showNotification("Class Soon", { body: cls.textContent });
      }
    });
  }, checkInterval);
}