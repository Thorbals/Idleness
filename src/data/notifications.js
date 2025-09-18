// notifications.js (readable stub)
const NotificationsModule = { id: "notifications" };
if (typeof window !== "undefined") {
  window.gameModules = window.gameModules || {};
  window.gameModules.notifications = NotificationsModule;
}
export default NotificationsModule;
// Auto-split from monolith.js
// Source section: data/notifications.js

function showEquipmentTooltip(event, slot) {
  const equippedItem = gameState.equipment[slot];
  if (!equippedItem || !gameData.items[equippedItem]) return;

  hideEquipmentTooltip(); // Clean up any existing tooltip

  const item = gameData.items[equippedItem];
  const tooltip = createEquipmentTooltip(item);

  if (!tooltip) return;

  document.body.appendChild(tooltip);
  tooltip.classList.add("tooltip-positioned");

  const rect = event.target.getBoundingClientRect();

  const tooltipRect = tooltip.getBoundingClientRect();
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  let topPosition = rect.top + window.scrollY;
  const wouldOverflowBottom = rect.top + tooltipRect.height > windowHeight;

  if (wouldOverflowBottom) {
    topPosition = rect.bottom + window.scrollY - tooltipRect.height;
    topPosition = Math.max(window.scrollY, topPosition);
  }

  const wouldOverflowRight = rect.right + 10 + tooltipRect.width > windowWidth;
  if (wouldOverflowRight) {
    tooltip.style.transform = `translate(${
      rect.left - tooltipRect.width - 10
    }px, ${topPosition}px)`;
    tooltip.classList.add("tooltip-left");
  } else {
    tooltip.style.transform = `translate(${
      rect.right + 10
    }px, ${topPosition}px)`;
    tooltip.classList.remove("tooltip-left");
  }

  requestAnimationFrame(() => {
    tooltip.classList.add("show");
  });

  equipmentTooltip = tooltip;
}

function showItemTooltip(event, itemId) {
  hideItemTooltip();

  const item = gameData.items[itemId];
  if (!item) {
    console.warn(`Item not found: ${itemId}`);
    return;
  }

  const tooltip = createItemTooltip(item);
  if (!tooltip) return;

  document.body.appendChild(tooltip);

  const rect = event.target.getBoundingClientRect();
  const tooltipRect = tooltip.getBoundingClientRect();
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  let topPosition = rect.top + window.scrollY;
  const wouldOverflowBottom = rect.top + tooltipRect.height > windowHeight;

  if (wouldOverflowBottom) {
    topPosition = rect.bottom + window.scrollY - tooltipRect.height;
    topPosition = Math.max(window.scrollY, topPosition);
  }

  const showOnLeft = rect.right + 10 + tooltipRect.width > windowWidth;
  if (showOnLeft) {
    tooltip.style.transform = `translate(${
      rect.left - tooltipRect.width - 10
    }px, ${topPosition}px)`;
    tooltip.classList.add("tooltip-left");
  } else {
    tooltip.style.transform = `translate(${
      rect.right + 10
    }px, ${topPosition}px)`;
    tooltip.classList.remove("tooltip-left");
  }

  setTimeout(() => {
    tooltip.classList.add("show");
  }, 10);

  itemTooltip = tooltip;
}

function hideItemTooltip() {
  if (itemTooltip) {
    itemTooltip.remove();
    itemTooltip = null;
  }
}

function showNotification(message, type = "info", duration = 3000) {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  notification.classList.remove(
    "notification-success",
    "notification-error",
    "notification-warning",
    "notification-info"
  );
  switch (type) {
    case "error":
      notification.classList.add("notification-error");
      break;
    case "success":
      notification.classList.add("notification-success");
      break;
    case "warning":
      notification.classList.add("notification-warning");
      break;
    default:
      notification.classList.add("notification-info");
  }

  notification.classList.add("show");

  setTimeout(() => {
    notification.classList.remove("show");
  }, duration);
}

function hideAllTooltips() {
  hideEquipmentTooltip();
  hideItemTooltip();
}

function toast(msg, type = "info", withUndo = false) {
  const t = document.createElement("div");
  t.className = "toast";
  t.style.borderLeftColor =
    type === "warn"
      ? "var(--warn)"
      : type === "error"
      ? "var(--danger)"
      : "var(--accent)";
  t.textContent = msg;
  if (withUndo) {
    const a = document.createElement("span");
    a.className = "link";
    a.textContent = "Undo";
    a.onclick = undo;
    t.appendChild(a);
  }
  toasts.appendChild(t);
  setTimeout(() => {
    t.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 350 });
    setTimeout(() => t.remove(), 360);
  }, 2200);
}

// Expose functions globally
if (typeof window !== "undefined") {
  window.showNotification = showNotification;
  window.hideAllTooltips = hideAllTooltips;
  window.toast = toast;
}
