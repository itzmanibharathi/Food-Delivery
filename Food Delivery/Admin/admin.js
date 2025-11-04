// admin.js
import { db } from "../firebase.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

document.addEventListener("DOMContentLoaded", () => {
  const tbody = document.querySelector("#ordersTable tbody");
  const totalOrdersEl = document.getElementById("totalOrders");
  const deliveredOrdersEl = document.getElementById("deliveredOrders");
  const pendingOrdersEl = document.getElementById("pendingOrders");
  const totalRevenueEl = document.getElementById("totalRevenue");

  const timerIntervals = new Map();

  function clearAllTimers() {
    for (const iv of timerIntervals.values()) clearInterval(iv);
    timerIntervals.clear();
  }

  function cancelWindowMinutes(paymentMethod) {
    return paymentMethod === "cash" ? 2 : 10;
  }

  function startTimer(key, order, el) {
    if (!el) return;

    if (timerIntervals.has(key)) {
      clearInterval(timerIntervals.get(key));
      timerIntervals.delete(key);
    }

    const createdAt = order.createdAt || Date.now();
    const windowMin = cancelWindowMinutes(order.paymentMethod || "online");

    const tick = () => {
      if (order.status === "Delivered") {
        el.textContent = "";
        return;
      }
      const diffMin = (Date.now() - createdAt) / (1000 * 60);
      const remaining = windowMin - diffMin;

      if (remaining <= 0) {
        el.textContent = "Ended";
        clearInterval(timerIntervals.get(key));
        timerIntervals.delete(key);
      } else {
        el.textContent = `${remaining.toFixed(1)} min left`;
      }
    };

    tick();
    const iv = setInterval(tick, 1000);
    timerIntervals.set(key, iv);
  }

  function renderRow(key, order) {
    const itemsText = Array.isArray(order.items)
      ? order.items.map(i => i.name).join(", ")
      : (order.items ?? "");

    const totalVal = Number(order.total ?? 0);
    const totalText = `$${totalVal.toFixed(2)}`;

    const restaurantName =
      (Array.isArray(order.items) && order.items[0]?.hotelName) ||
      order.hotelName ||
      "";

    const status = order.status ?? "Created";
    const rating = order.rating ? `${order.rating} ⭐` : "";
    const feedback = order.feedback ?? "";

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escapeHtml(order.customerName || "")}</td>
      <td>${escapeHtml(itemsText)}</td>
      <td>${escapeHtml(totalText)}</td>
      <td>${escapeHtml(restaurantName)}</td>
      <td>${escapeHtml(status)}</td>
      <td id="timer-${key}"></td>
      <td>${escapeHtml(rating)}</td>
      <td>${escapeHtml(feedback)}</td>
    `;

    const timerEl = tr.querySelector(`#timer-${key}`);
    startTimer(key, order, timerEl);

    return tr;
  }

  function escapeHtml(s) {
    if (s == null) return "";
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  onValue(ref(db, "orders"), snapshot => {
    clearAllTimers();
    tbody.innerHTML = "";

    let total = 0,
      delivered = 0,
      pending = 0,
      revenue = 0;

    const rows = [];
    snapshot.forEach(child => {
      const key = child.key;
      const order = child.val() || {};
      total++;

      if (order.status === "Delivered") {
        delivered++;
        revenue += Number(order.total || 0);
      } else {
        pending++;
      }

      rows.push(renderRow(key, order));
    });

    if (rows.length === 0) {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td colspan="8" class="center muted">No orders found</td>`;
      tbody.appendChild(tr);
    } else {
      rows.forEach(r => tbody.appendChild(r));
    }

    totalOrdersEl.textContent = total;
    deliveredOrdersEl.textContent = delivered;
    pendingOrdersEl.textContent = pending;
    totalRevenueEl.textContent = `$${revenue.toFixed(2)}`;
  });
});
