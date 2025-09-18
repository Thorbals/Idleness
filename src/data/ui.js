// Auto-split from monolith.js
// Source section: data/ui.js

function injectFactionCSS() {
  const styleId = "dynamic-faction-styles";
  let existingStyle = document.getElementById(styleId);

  if (existingStyle) {
    existingStyle.remove();
  }

  const style = document.createElement("style");
  style.id = styleId;
  style.textContent = generateFactionCSS();
  document.head.appendChild(style);
}

function showHeldGhost(itemId) {
  const ghost = getOrCreateHeldGhost();
  const item = gameData.items[itemId];
  const icon = item?.icon || "??";
  const qty = gameState.bank[itemId] || 0;
  ghost.innerHTML = `<span style="font-size:16px; margin-right:6px;">${icon}</span><span>${
    item?.name || itemId
  } (${qty})</span>`;
  ghost.classList.add("visible");
}

function positionGhost() {
  if (!ghostEl || hoverCell.x == null) return;
  const { w, h } = footprintSize();
  const x = Math.min(hoverCell.x, state.cols - w);
  const y = Math.min(hoverCell.y, state.rows - h);
  const cellSize = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue("--cell")
  );
  const left = x * (cellSize + 3);
  const top = y * (cellSize + 3);
  ghostEl.style.width = `calc(${w} * var(--cell) + ${(w - 1) * 3}px)`;
  ghostEl.style.height = `calc(${h} * var(--cell) + ${(h - 1) * 3}px)`;
  ghostEl.style.left = left + "px";
  ghostEl.style.top = top + "px";

  const validity = validatePlacement(x, y, w, h);
  ghostEl.classList.toggle("valid", validity.ok);
  ghostEl.classList.toggle("invalid", !validity.ok);
  if (ghostTip) {
    if (validity.ok) {
      ghostTip.style.display = "none";
    } else {
      ghostTip.style.display = "block";
      ghostTip.textContent = validity.reason;
    }
  }
  showProjectedDeltas(validity);
}

function doPlace(x, y, w, h) {
  const b = state.selection;

  // Check if player can afford the building
  if (!canAfford(b)) {
    toast(
      `Not enough resources! Need ${b.cost.wood} wood and ${b.cost.stone} stone`,
      "warn"
    );
    return;
  }

  tickResources(-b.cost.wood, -b.cost.stone);

  const cover = document.createElement("div");
  cover.className = "placed";
  cover.dataset.cat = b.cat;
  cover.dataset.w = w;
  cover.dataset.h = h;
  cover.dataset.roof = b.roofType;
  cover.style.position = "absolute";
  cover.style.left = `calc(${x} * var(--cell))`;
  cover.style.top = `calc(${y} * var(--cell))`;
  cover.style.width = `calc(${w} * var(--cell))`;
  cover.style.height = `calc(${h} * var(--cell))`;
  const label = document.createElement("div");
  label.className = "name";
  label.textContent = b.name;
  cover.appendChild(label);
  mapEl.appendChild(cover);
  cover.animate(
    [
      { transform: "scale(.96)", opacity: 0.0 },
      { transform: "scale(1)", opacity: 1 },
    ],
    { duration: 220, easing: "ease-out" }
  );

  const cells = [];
  for (let yy = y; yy < y + h; yy++) {
    for (let xx = x; xx < x + w; xx++) {
      const key = xx + "," + yy;
      state.occupied.set(key, { id: b.id, name: b.name });
      cells.push(key);
    }
  }
  state.lastPlaced = { b, x, y, w, h, el: cover, cells };
  undoBtn.disabled = false;
  toast(`Placed ${b.name}`, "info", true);
}
