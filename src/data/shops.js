// shops.js (readable stub)
const ShopsModule = { id: 'shops' };
if (typeof window !== 'undefined') { window.gameModules = window.gameModules || {}; window.gameModules.shops = ShopsModule; }
export default ShopsModule;
// Auto-split from monolith.js
// Source section: data/shops.js


function getWorkshopName(id, forSkill = "tailoring") {
  const list =
    (gameData.upgrades &&
      gameData.upgrades[forSkill] &&
      gameData.upgrades[forSkill].workshops) ||
    [];
  const f = list.find((w) => w.id === id);
  return f ? f.name : id;
}

function initializeShop() {
  setupShopTabs();
  showShopTab("general");
}

function setupShopTabs() {
  document.querySelectorAll(".tab[data-tab]").forEach((tab) => {
    tab.addEventListener("click", () => {
      const tabName = tab.dataset.tab;
      showShopTab(tabName);
    });
  });
}

function showShopTab(tabName) {
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.remove("active");
    if (tab.dataset.tab === tabName) {
      tab.classList.add("active");
    }
  });

  const shopItems = document.getElementById("shop-items");
  shopItems.innerHTML = "";

  switch (tabName) {
    case "general":
      showGeneralShopItems(shopItems);
      break;
    case "equipment":
      showEquipmentShopItems(shopItems);
      break;
    case "upgrades":
      showUpgradesShopItems(shopItems);
      break;
  }
}

function showUpgradesShopItems(container) {
  container.innerHTML = "";

  const miningHeader = document.createElement("div");
  miningHeader.style.cssText =
    "grid-column: 1 / -1; width: 100%; margin-bottom: 10px; text-align: center;";
  miningHeader.innerHTML =
    '<h3 style="color: var(--brand);">Mining</h3><div class="muted" style="margin-top: -6px;">Tools</div>';
  container.appendChild(miningHeader);

  const miningTools =
    gameData.upgrades &&
    gameData.upgrades.mining &&
    gameData.upgrades.mining.tools
      ? gameData.upgrades.mining.tools
      : [];
  const miningLevel =
    gameState.skills && gameState.skills.mining && gameState.skills.mining.level
      ? gameState.skills.mining.level
      : 1;

  if (miningTools.length === 0) {
    const empty = document.createElement("div");
    empty.style.cssText =
      "grid-column: 1 / -1; color: #8b949e; padding: 20px; text-align: center;";
    empty.textContent = "No mining upgrades available.";
    container.appendChild(empty);
  } else {
    miningTools.forEach((tool) => {
      const purchased = !!(
        gameState.upgrades &&
        gameState.upgrades.mining &&
        gameState.upgrades.mining.purchased[tool.id]
      );
      const meetsLevel = miningLevel >= tool.requiredLevel;
      const canUnlock = !purchased && meetsLevel;

      const card = document.createElement("div");
      card.className = "shop-item";
      card.innerHTML = `
            <div class="item-icon">⛏️</div>
            <div class="item-name">${tool.name}</div>
            <div class="item-meta">Requires Mining Lv ${
              tool.requiredLevel
            }</div>
            <button class="action-button shop-buy" ${
              canUnlock ? "" : "disabled"
            }>${
        purchased ? "Purchased" : meetsLevel ? "Unlock" : "Level Too Low"
      }</button>
          `;

      const btn = card.querySelector("button");
      btn.addEventListener("click", () => {
        if (!canUnlock) return;
        gameState.upgrades.mining.purchased[tool.id] = true;
        showNotification(`${tool.name} unlocked`);
        saveGame();
        showUpgradesShopItems(container);
      });

      container.appendChild(card);
    });
  }

  const forestryHeader = document.createElement("div");
  forestryHeader.style.cssText =
    "grid-column: 1 / -1; width: 100%; margin: 20px 0 10px; text-align: center;";
  forestryHeader.innerHTML =
    '<h3 style="color: var(--brand);">Forestry</h3><div class="muted" style="margin-top: -6px;">Tools</div>';
  container.appendChild(forestryHeader);

  const forestryTools =
    gameData.upgrades &&
    gameData.upgrades.forestry &&
    gameData.upgrades.forestry.tools
      ? gameData.upgrades.forestry.tools
      : [];
  const forestryLevel =
    gameState.skills &&
    gameState.skills.woodcutting &&
    gameState.skills.woodcutting.level
      ? gameState.skills.woodcutting.level
      : 1;

  if (forestryTools.length === 0) {
    const emptyF = document.createElement("div");
    emptyF.style.cssText =
      "grid-column: 1 / -1; color: #8b949e; padding: 20px; text-align: center;";
    emptyF.textContent = "No forestry upgrades available.";
    container.appendChild(emptyF);
  } else {
    forestryTools.forEach((tool) => {
      const purchased = !!(
        gameState.upgrades &&
        gameState.upgrades.forestry &&
        gameState.upgrades.forestry.purchased[tool.id]
      );
      const meetsLevel = forestryLevel >= tool.requiredLevel;
      const canUnlock = !purchased && meetsLevel;

      const card = document.createElement("div");
      card.className = "shop-item";
      card.innerHTML = `
            <div class="item-icon">🪓</div>
            <div class="item-name">${tool.name}</div>
            <div class="item-meta">Requires Woodcutting Lv ${
              tool.requiredLevel
            }</div>
            <button class="action-button shop-buy" ${
              canUnlock ? "" : "disabled"
            }>${
        purchased ? "Purchased" : meetsLevel ? "Unlock" : "Level Too Low"
      }</button>
          `;

      const btn = card.querySelector("button");
      btn.addEventListener("click", () => {
        if (!canUnlock) return;
        gameState.upgrades.forestry.purchased[tool.id] = true;
        showNotification(`${tool.name} unlocked`);
        saveGame();
        showUpgradesShopItems(container);
      });

      container.appendChild(card);
    });
  }

  const foragingHeader = document.createElement("div");
  foragingHeader.style.cssText =
    "grid-column: 1 / -1; width: 100%; margin: 20px 0 10px; text-align: center;";
  foragingHeader.innerHTML =
    '<h3 style="color: var(--brand);">Foraging</h3><div class="muted" style="margin-top: -6px;">Tools</div>';
  container.appendChild(foragingHeader);

  const foragingTools =
    gameData.upgrades &&
    gameData.upgrades.foraging &&
    gameData.upgrades.foraging.tools
      ? gameData.upgrades.foraging.tools
      : [];
  const foragingLevel =
    gameState.skills &&
    gameState.skills.foraging &&
    gameState.skills.foraging.level
      ? gameState.skills.foraging.level
      : 1;

  if (foragingTools.length === 0) {
    const emptyFo = document.createElement("div");
    emptyFo.style.cssText =
      "grid-column: 1 / -1; color: #8b949e; padding: 20px; text-align: center;";
    emptyFo.textContent = "No foraging upgrades available.";
    container.appendChild(emptyFo);
  } else {
    foragingTools.forEach((tool) => {
      const purchased = !!(
        gameState.upgrades &&
        gameState.upgrades.foraging &&
        gameState.upgrades.foraging.purchased[tool.id]
      );
      const meetsLevel = foragingLevel >= tool.requiredLevel;
      const canUnlock = !purchased && meetsLevel;

      const card = document.createElement("div");
      card.className = "shop-item";
      card.innerHTML = `
              <div class="item-icon">🌾</div>
              <div class="item-name">${tool.name}</div>
              <div class="item-meta">Requires Foraging Lv ${
                tool.requiredLevel
              }</div>
              <button class="action-button shop-buy" ${
                canUnlock ? "" : "disabled"
              }>${
        purchased ? "Purchased" : meetsLevel ? "Unlock" : "Level Too Low"
      }</button>
            `;

      const btn = card.querySelector("button");
      btn.addEventListener("click", () => {
        if (!canUnlock) return;
        gameState.upgrades.foraging.purchased[tool.id] = true;
        showNotification(`${tool.name} unlocked`);
        saveGame();
        showUpgradesShopItems(container);
      });

      container.appendChild(card);
    });
  }

  const huntingHeader = document.createElement("div");
  huntingHeader.style.cssText =
    "grid-column: 1 / -1; width: 100%; margin: 20px 0 10px; text-align: center;";
  huntingHeader.innerHTML =
    '<h3 style="color: var(--brand);">Hunting</h3><div class="muted" style="margin-top: -6px;">Tools</div>';
  container.appendChild(huntingHeader);

  const huntingTools =
    gameData.upgrades &&
    gameData.upgrades.hunting &&
    gameData.upgrades.hunting.tools
      ? gameData.upgrades.hunting.tools
      : [];
  const huntingLevel =
    gameState.skills &&
    gameState.skills.hunting &&
    gameState.skills.hunting.level
      ? gameState.skills.hunting.level
      : 1;

  if (huntingTools.length === 0) {
    const emptyH = document.createElement("div");
    emptyH.style.cssText =
      "grid-column: 1 / -1; color: #8b949e; padding: 20px; text-align: center;";
    emptyH.textContent = "No hunting upgrades available.";
    container.appendChild(emptyH);
  } else {
    huntingTools.forEach((tool) => {
      const purchased = !!(
        gameState.upgrades &&
        gameState.upgrades.hunting &&
        gameState.upgrades.hunting.purchased[tool.id]
      );
      const meetsLevel = huntingLevel >= tool.requiredLevel;
      const canUnlock = !purchased && meetsLevel;

      const card = document.createElement("div");
      card.className = "shop-item";
      card.innerHTML = `
              <div class="item-icon">🪤</div>
              <div class="item-name">${tool.name}</div>
              <div class="item-meta">Requires Hunting Lv ${
                tool.requiredLevel
              }</div>
              <button class="action-button shop-buy" ${
                canUnlock ? "" : "disabled"
              }>${
        purchased ? "Purchased" : meetsLevel ? "Unlock" : "Level Too Low"
      }</button>
            `;

      const btn = card.querySelector("button");
      btn.addEventListener("click", () => {
        if (!canUnlock) return;
        gameState.upgrades.hunting.purchased[tool.id] = true;
        showNotification(`${tool.name} unlocked`);
        saveGame();
        showUpgradesShopItems(container);
      });

      container.appendChild(card);
    });
  }

  const fishingHeader = document.createElement("div");
  fishingHeader.style.cssText =
    "grid-column: 1 / -1; width: 100%; margin: 20px 0 10px; text-align: center;";
  fishingHeader.innerHTML =
    '<h3 style="color: var(--brand);">Fishing</h3><div class="muted" style="margin-top: -6px;">Tools</div>';
  container.appendChild(fishingHeader);

  const fishingTools =
    gameData.upgrades &&
    gameData.upgrades.fishing &&
    gameData.upgrades.fishing.tools
      ? gameData.upgrades.fishing.tools
      : [];
  const fishingLevel =
    gameState.skills &&
    gameState.skills.fishing &&
    gameState.skills.fishing.level
      ? gameState.skills.fishing.level
      : 1;

  if (fishingTools.length === 0) {
    const emptyFi = document.createElement("div");
    emptyFi.style.cssText =
      "grid-column: 1 / -1; color: #8b949e; padding: 20px; text-align: center;";
    emptyFi.textContent = "No fishing upgrades available.";
    container.appendChild(emptyFi);
  } else {
    fishingTools.forEach((tool) => {
      const purchased = !!(
        gameState.upgrades &&
        gameState.upgrades.fishing &&
        gameState.upgrades.fishing.purchased[tool.id]
      );
      const meetsLevel = fishingLevel >= tool.requiredLevel;
      const canUnlock = !purchased && meetsLevel;

      const card = document.createElement("div");
      card.className = "shop-item";
      card.innerHTML = `
                <div class="item-icon">🎣</div>
                <div class="item-name">${tool.name}</div>
                <div class="item-meta">Requires Fishing Lv ${
                  tool.requiredLevel
                }</div>
                <button class="action-button shop-buy" ${
                  canUnlock ? "" : "disabled"
                }>${
        purchased ? "Purchased" : meetsLevel ? "Unlock" : "Level Too Low"
      }</button>
              `;

      const btn = card.querySelector("button");
      btn.addEventListener("click", () => {
        if (!canUnlock) return;
        gameState.upgrades.fishing.purchased[tool.id] = true;
        showNotification(`${tool.name} unlocked`);
        saveGame();
        showUpgradesShopItems(container);
      });

      container.appendChild(card);
    });
  }
  const lootHeader = document.createElement("div");
  lootHeader.style.cssText =
    "grid-column: 1 / -1; width: 100%; margin: 20px 0 10px; text-align: center;";
  lootHeader.innerHTML =
    '<h3 style="color: var(--brand);">Looting</h3><div class="muted" style="margin-top: -6px;">Tools</div>';
  container.appendChild(lootHeader);

  const lootTools =
    gameData.upgrades &&
    gameData.upgrades.looting &&
    gameData.upgrades.looting.tools
      ? gameData.upgrades.looting.tools
      : [];
  const lootLevel =
    gameState.skills &&
    gameState.skills.looting &&
    gameState.skills.looting.level
      ? gameState.skills.looting.level
      : 1;

  if (lootTools.length === 0) {
    const emptyLo = document.createElement("div");
    emptyLo.style.cssText =
      "grid-column: 1 / -1; color: #8b949e; padding: 20px; text-align: center;";
    emptyLo.textContent = "No looting upgrades available.";
    container.appendChild(emptyLo);
  } else {
    lootTools.forEach((tool) => {
      const purchased = !!(
        gameState.upgrades &&
        gameState.upgrades.looting &&
        gameState.upgrades.looting.purchased &&
        gameState.upgrades.looting.purchased[tool.id]
      );
      const meetsLevel = lootLevel >= tool.requiredLevel;
      const canUnlock = !purchased && meetsLevel;

      const card = document.createElement("div");
      card.className = "shop-item";
      card.innerHTML = `
                <div class="item-icon">🗝️</div>
                <div class="item-name">${tool.name}</div>
                <div class="item-meta">Requires Looting Lv ${
                  tool.requiredLevel
                }</div>
                <button class="action-button shop-buy" ${
                  canUnlock ? "" : "disabled"
                }>${
        purchased ? "Purchased" : meetsLevel ? "Unlock" : "Level Too Low"
      }</button>
              `;

      const btn = card.querySelector("button");
      btn.addEventListener("click", () => {
        if (!canUnlock) return;
        if (!gameState.upgrades.looting)
          gameState.upgrades.looting = { purchased: {} };
        if (!gameState.upgrades.looting.purchased)
          gameState.upgrades.looting.purchased = {};
        gameState.upgrades.looting.purchased[tool.id] = true;
        showNotification(`${tool.name} unlocked`);
        saveGame();
        showUpgradesShopItems(container);
      });

      container.appendChild(card);
    });
  }

  const scavHeader = document.createElement("div");
  scavHeader.style.cssText =
    "grid-column: 1 / -1; width: 100%; margin: 20px 0 10px; text-align: center;";
  scavHeader.innerHTML =
    '<h3 style="color: var(--brand);">Scavenging</h3><div class="muted" style="margin-top: -6px;">Tools</div>';
  container.appendChild(scavHeader);

  const scavTools =
    gameData.upgrades &&
    gameData.upgrades.scavenging &&
    gameData.upgrades.scavenging.tools
      ? gameData.upgrades.scavenging.tools
      : [];
  const scavLevel =
    gameState.skills &&
    gameState.skills.scavenging &&
    gameState.skills.scavenging.level
      ? gameState.skills.scavenging.level
      : 1;

  if (scavTools.length === 0) {
    const emptySc = document.createElement("div");
    emptySc.style.cssText =
      "grid-column: 1 / -1; color: #8b949e; padding: 20px; text-align: center;";
    emptySc.textContent = "No scavenging upgrades available.";
    container.appendChild(emptySc);
  } else {
    scavTools.forEach((tool) => {
      const purchased = !!(
        gameState.upgrades &&
        gameState.upgrades.scavenging &&
        gameState.upgrades.scavenging.purchased &&
        gameState.upgrades.scavenging.purchased[tool.id]
      );
      const meetsLevel = scavLevel >= tool.requiredLevel;
      const canUnlock = !purchased && meetsLevel;

      const card = document.createElement("div");
      card.className = "shop-item";
      card.innerHTML = `
                <div class="item-icon">🔧</div>
                <div class="item-name">${tool.name}</div>
                <div class="item-meta">Requires Scavenging Lv ${
                  tool.requiredLevel
                }</div>
                <button class="action-button shop-buy" ${
                  canUnlock ? "" : "disabled"
                }>${
        purchased ? "Purchased" : meetsLevel ? "Unlock" : "Level Too Low"
      }</button>
              `;

      const btn = card.querySelector("button");
      btn.addEventListener("click", () => {
        if (!canUnlock) return;
        if (!gameState.upgrades.scavenging)
          gameState.upgrades.scavenging = { purchased: {} };
        if (!gameState.upgrades.scavenging.purchased)
          gameState.upgrades.scavenging.purchased = {};
        gameState.upgrades.scavenging.purchased[tool.id] = true;
        showNotification(`${tool.name} unlocked`);
        saveGame();
        showUpgradesShopItems(container);
      });

      container.appendChild(card);
    });
  }

  const tailoringHeader = document.createElement("div");
  tailoringHeader.style.cssText =
    "grid-column: 1 / -1; width: 100%; margin: 20px 0 10px; text-align: center;";
  tailoringHeader.innerHTML =
    '<h3 style="color: var(--brand);">Tailoring</h3><div class="muted" style="margin-top: -6px;">Tools</div>';
  container.appendChild(tailoringHeader);

  const tailoringTools =
    gameData.upgrades &&
    gameData.upgrades.tailoring &&
    gameData.upgrades.tailoring.tools
      ? gameData.upgrades.tailoring.tools
      : [];
  const tailoringLevel =
    gameState.skills &&
    gameState.skills.tailoring &&
    gameState.skills.tailoring.level
      ? gameState.skills.tailoring.level
      : 1;

  if (tailoringTools.length === 0) {
    const emptyT = document.createElement("div");
    emptyT.style.cssText =
      "grid-column: 1 / -1; color: #8b949e; padding: 20px; text-align: center;";
    emptyT.textContent = "No tailoring upgrades available.";
    container.appendChild(emptyT);
  } else {
    tailoringTools.forEach((tool) => {
      const purchased = !!(
        gameState.upgrades &&
        gameState.upgrades.tailoring &&
        gameState.upgrades.tailoring.purchased[tool.id]
      );
      const meetsLevel = tailoringLevel >= tool.requiredLevel;
      const canUnlock = !purchased && meetsLevel;

      const card = document.createElement("div");
      card.className = "shop-item";
      card.innerHTML = `
            <div class="item-icon">🧵</div>
            <div class="item-name">${tool.name}</div>
            <div class="item-meta">Requires Tailoring Lv ${
              tool.requiredLevel
            }</div>
            <button class="action-button shop-buy" ${
              canUnlock ? "" : "disabled"
            }>${
        purchased ? "Purchased" : meetsLevel ? "Unlock" : "Level Too Low"
      }</button>
          `;

      const btn = card.querySelector("button");
      btn.addEventListener("click", () => {
        if (!canUnlock) return;
        if (!gameState.upgrades.tailoring)
          gameState.upgrades.tailoring = { purchased: {} };
        if (!gameState.upgrades.tailoring.purchased)
          gameState.upgrades.tailoring.purchased = {};
        gameState.upgrades.tailoring.purchased[tool.id] = true;
        showNotification(`${tool.name} unlocked`);
        saveGame();
        showUpgradesShopItems(container);
      });

      container.appendChild(card);
    });
  }

  const wsHeader = document.createElement("div");
  wsHeader.style.cssText =
    "grid-column: 1 / -1; width: 100%; margin: 10px 0; text-align: center;";
  wsHeader.innerHTML =
    '<div class="muted" style="margin-top: -6px;">Workshops</div>';
  container.appendChild(wsHeader);

  const workshops =
    gameData.upgrades &&
    gameData.upgrades.tailoring &&
    gameData.upgrades.tailoring.workshops
      ? gameData.upgrades.tailoring.workshops
      : [];
  workshops.forEach((ws) => {
    const meetsLevel = tailoringLevel >= (ws.requiredLevel || 1);
    const owned = !!(
      gameState.workshops &&
      gameState.workshops.tailoring &&
      gameState.workshops.tailoring[ws.id]
    );
    const hasScrap = (gameState.player.scrap || 0) >= (ws.scrapCost || 0);
    const canBuy = !owned && meetsLevel && hasScrap;

    const card = document.createElement("div");
    card.className = "shop-item";
    card.innerHTML = `
          <div class="item-icon">🏭</div>
          <div class="item-name">${ws.name}</div>
          <div class="item-meta">Lv ${ws.requiredLevel || 1} • Cost: ${
      ws.scrapCost || 0
    } Scrap</div>
          <button class="action-button shop-buy" ${canBuy ? "" : "disabled"}>${
      owned
        ? "Owned"
        : meetsLevel
        ? hasScrap
          ? "Buy"
          : "Need Scrap"
        : "Level Too Low"
    }</button>
        `;

    const btn = card.querySelector("button");
    btn.addEventListener("click", () => {
      if (!canBuy) return;
      gameState.player.scrap -= ws.scrapCost || 0;
      if (!gameState.workshops)
        gameState.workshops = {
          tailoring: {},
          firstaid: {},
          forging: {},
          gunsmithing: {},
          carpentry: {},
          tinkering: {},
          cooking: {},
          masonry: {},
          chemistry: {},
          electrical: {},
        };
      if (!gameState.workshops.tailoring) gameState.workshops.tailoring = {};
      gameState.workshops.tailoring[ws.id] = true;
      showNotification(`${ws.name} purchased`);
      saveGame();
      updatePlayerStats();
      showUpgradesShopItems(container);
    });

    container.appendChild(card);
  });

  const faHeader = document.createElement("div");
  faHeader.style.cssText =
    "grid-column: 1 / -1; width: 100%; margin: 20px 0 10px; text-align: center;";
  faHeader.innerHTML =
    '<h3 style="color: var(--brand);">First Aid</h3><div class="muted" style="margin-top: -6px;">Tools</div>';
  container.appendChild(faHeader);

  const faTools =
    gameData.upgrades &&
    gameData.upgrades.firstaid &&
    gameData.upgrades.firstaid.tools
      ? gameData.upgrades.firstaid.tools
      : [];
  const faLevel =
    gameState.skills &&
    gameState.skills.firstaid &&
    gameState.skills.firstaid.level
      ? gameState.skills.firstaid.level
      : 1;

  if (faTools.length === 0) {
    const emptyFA = document.createElement("div");
    emptyFA.style.cssText =
      "grid-column: 1 / -1; color: #8b949e; padding: 20px; text-align: center;";
    emptyFA.textContent = "No first aid upgrades available.";
    container.appendChild(emptyFA);
  } else {
    faTools.forEach((tool) => {
      const purchased = !!(
        gameState.upgrades &&
        gameState.upgrades.firstaid &&
        gameState.upgrades.firstaid.purchased[tool.id]
      );
      const meetsLevel = faLevel >= tool.requiredLevel;
      const canUnlock = !purchased && meetsLevel;

      const card = document.createElement("div");
      card.className = "shop-item";
      card.innerHTML = `
            <div class="item-icon">🪡</div>
            <div class="item-name">${tool.name}</div>
            <div class="item-meta">Requires First Aid Lv ${
              tool.requiredLevel
            }</div>
            <button class="action-button shop-buy" ${
              canUnlock ? "" : "disabled"
            }>${
        purchased ? "Purchased" : meetsLevel ? "Unlock" : "Level Too Low"
      }</button>
          `;

      const btn = card.querySelector("button");
      btn.addEventListener("click", () => {
        if (!canUnlock) return;
        if (!gameState.upgrades.firstaid)
          gameState.upgrades.firstaid = { purchased: {} };
        if (!gameState.upgrades.firstaid.purchased)
          gameState.upgrades.firstaid.purchased = {};
        gameState.upgrades.firstaid.purchased[tool.id] = true;
        showNotification(`${tool.name} unlocked`);
        saveGame();
        showUpgradesShopItems(container);
      });

      container.appendChild(card);
    });
  }

  const faWsHeader = document.createElement("div");
  faWsHeader.style.cssText =
    "grid-column: 1 / -1; width: 100%; margin: 10px 0; text-align: center;";
  faWsHeader.innerHTML =
    '<div class="muted" style="margin-top: -6px;">Workshops</div>';
  container.appendChild(faWsHeader);

  const faWorkshops =
    gameData.upgrades &&
    gameData.upgrades.firstaid &&
    gameData.upgrades.firstaid.workshops
      ? gameData.upgrades.firstaid.workshops
      : [];
  faWorkshops.forEach((ws) => {
    const meetsLevel = faLevel >= (ws.requiredLevel || 1);
    const owned = !!(
      gameState.workshops &&
      gameState.workshops.firstaid &&
      gameState.workshops.firstaid[ws.id]
    );
    const hasScrap = (gameState.player.scrap || 0) >= (ws.scrapCost || 0);
    const canBuy = !owned && meetsLevel && hasScrap;

    const card = document.createElement("div");
    card.className = "shop-item";
    card.innerHTML = `
          <div class="item-icon">🏥</div>
          <div class="item-name">${ws.name}</div>
          <div class="item-meta">Lv ${ws.requiredLevel || 1} • Cost: ${
      ws.scrapCost || 0
    } Scrap</div>
          <button class="action-button shop-buy" ${canBuy ? "" : "disabled"}>${
      owned
        ? "Owned"
        : meetsLevel
        ? hasScrap
          ? "Buy"
          : "Need Scrap"
        : "Level Too Low"
    }</button>
        `;

    const btn = card.querySelector("button");
    btn.addEventListener("click", () => {
      if (!canBuy) return;
      gameState.player.scrap -= ws.scrapCost || 0;
      if (!gameState.workshops)
        gameState.workshops = {
          tailoring: {},
          firstaid: {},
          forging: {},
          gunsmithing: {},
          carpentry: {},
          tinkering: {},
          cooking: {},
          masonry: {},
          chemistry: {},
          electrical: {},
        };
      if (!gameState.workshops.firstaid) gameState.workshops.firstaid = {};
      gameState.workshops.firstaid[ws.id] = true;
      showNotification(`${ws.name} purchased`);
      saveGame();
      updatePlayerStats();
      showUpgradesShopItems(container);
    });

    container.appendChild(card);
  });

  const forgingHeader = document.createElement("div");
  forgingHeader.style.cssText =
    "grid-column: 1 / -1; width: 100%; margin: 20px 0 10px; text-align: center;";
  forgingHeader.innerHTML =
    '<h3 style="color: var(--brand);">Forging</h3><div class="muted" style="margin-top: -6px;">Tools</div>';
  container.appendChild(forgingHeader);

  const forgingTools =
    gameData.upgrades &&
    gameData.upgrades.forging &&
    gameData.upgrades.forging.tools
      ? gameData.upgrades.forging.tools
      : [];
  const forgingLevel =
    gameState.skills &&
    gameState.skills.forging &&
    gameState.skills.forging.level
      ? gameState.skills.forging.level
      : 1;

  if (forgingTools.length === 0) {
    const emptyFG = document.createElement("div");
    emptyFG.style.cssText =
      "grid-column: 1 / -1; color: #8b949e; padding: 20px; text-align: center;";
    emptyFG.textContent = "No forging upgrades available.";
    container.appendChild(emptyFG);
  } else {
    forgingTools.forEach((tool) => {
      const purchased = !!(
        gameState.upgrades &&
        gameState.upgrades.forging &&
        gameState.upgrades.forging.purchased[tool.id]
      );
      const meetsLevel = forgingLevel >= tool.requiredLevel;
      const canUnlock = !purchased && meetsLevel;

      const card = document.createElement("div");
      card.className = "shop-item";
      card.innerHTML = `
            <div class="item-icon">⚒️</div>
            <div class="item-name">${tool.name}</div>
            <div class="item-meta">Requires Forging Lv ${
              tool.requiredLevel
            }</div>
            <button class="action-button shop-buy" ${
              canUnlock ? "" : "disabled"
            }>${
        purchased ? "Purchased" : meetsLevel ? "Unlock" : "Level Too Low"
      }</button>
          `;

      const btn = card.querySelector("button");
      btn.addEventListener("click", () => {
        if (!canUnlock) return;
        if (!gameState.upgrades.forging)
          gameState.upgrades.forging = { purchased: {} };
        if (!gameState.upgrades.forging.purchased)
          gameState.upgrades.forging.purchased = {};
        gameState.upgrades.forging.purchased[tool.id] = true;
        showNotification(`${tool.name} unlocked`);
        saveGame();
        showUpgradesShopItems(container);
      });

      container.appendChild(card);
    });
  }

  const fgWsHeader = document.createElement("div");
  fgWsHeader.style.cssText =
    "grid-column: 1 / -1; width: 100%; margin: 10px 0; text-align: center;";
  fgWsHeader.innerHTML =
    '<div class="muted" style="margin-top: -6px;">Workshops</div>';
  container.appendChild(fgWsHeader);

  const forgingWorkshops =
    gameData.upgrades &&
    gameData.upgrades.forging &&
    gameData.upgrades.forging.workshops
      ? gameData.upgrades.forging.workshops
      : [];
  forgingWorkshops.forEach((ws) => {
    const meetsLevel = forgingLevel >= (ws.requiredLevel || 1);
    const owned = !!(
      gameState.workshops &&
      gameState.workshops.forging &&
      gameState.workshops.forging[ws.id]
    );
    const canBuy = !owned && meetsLevel;

    const card = document.createElement("div");
    card.className = "shop-item";
    card.innerHTML = `
          <div class="item-icon">🏭</div>
          <div class="item-name">${ws.name}</div>
          <div class="item-meta">Lv ${ws.requiredLevel || 1}</div>
          <button class="action-button shop-buy" ${canBuy ? "" : "disabled"}>${
      owned ? "Owned" : meetsLevel ? "Unlock" : "Level Too Low"
    }</button>
        `;

    const btn = card.querySelector("button");
    btn.addEventListener("click", () => {
      if (!canBuy) return;
      if (!gameState.workshops)
        gameState.workshops = {
          tailoring: {},
          firstaid: {},
          forging: {},
          gunsmithing: {},
          carpentry: {},
          tinkering: {},
          cooking: {},
          masonry: {},
          chemistry: {},
          electrical: {},
        };
      if (!gameState.workshops.forging) gameState.workshops.forging = {};
      gameState.workshops.forging[ws.id] = true;
      showNotification(`${ws.name} unlocked`);
      saveGame();
      updatePlayerStats();
      showUpgradesShopItems(container);
    });

    container.appendChild(card);
  });

  const gunsHeader = document.createElement("div");
  gunsHeader.style.cssText =
    "grid-column: 1 / -1; width: 100%; margin: 20px 0 10px; text-align: center;";
  gunsHeader.innerHTML =
    '<h3 style="color: var(--brand);">Gunsmithing</h3><div class="muted" style="margin-top: -6px;">Tools</div>';
  container.appendChild(gunsHeader);

  const gunsTools =
    gameData.upgrades &&
    gameData.upgrades.gunsmithing &&
    gameData.upgrades.gunsmithing.tools
      ? gameData.upgrades.gunsmithing.tools
      : [];
  const gunsLevel =
    gameState.skills &&
    gameState.skills.gunsmithing &&
    gameState.skills.gunsmithing.level
      ? gameState.skills.gunsmithing.level
      : 1;

  if (gunsTools.length === 0) {
    const emptyGS = document.createElement("div");
    emptyGS.style.cssText =
      "grid-column: 1 / -1; color: #8b949e; padding: 20px; text-align: center;";
    emptyGS.textContent = "No gunsmithing upgrades available.";
    container.appendChild(emptyGS);
  } else {
    gunsTools.forEach((tool) => {
      const purchased = !!(
        gameState.upgrades &&
        gameState.upgrades.gunsmithing &&
        gameState.upgrades.gunsmithing.purchased[tool.id]
      );
      const meetsLevel = gunsLevel >= tool.requiredLevel;
      const canUnlock = !purchased && meetsLevel;

      const card = document.createElement("div");
      card.className = "shop-item";
      card.innerHTML = `
            <div class="item-icon">🪛</div>
            <div class="item-name">${tool.name}</div>
            <div class="item-meta">Requires Gunsmithing Lv ${
              tool.requiredLevel
            }</div>
            <button class="action-button shop-buy" ${
              canUnlock ? "" : "disabled"
            }>${
        purchased ? "Purchased" : meetsLevel ? "Unlock" : "Level Too Low"
      }</button>
          `;

      const btn = card.querySelector("button");
      btn.addEventListener("click", () => {
        if (!canUnlock) return;
        if (!gameState.upgrades.gunsmithing)
          gameState.upgrades.gunsmithing = { purchased: {} };
        if (!gameState.upgrades.gunsmithing.purchased)
          gameState.upgrades.gunsmithing.purchased = {};
        gameState.upgrades.gunsmithing.purchased[tool.id] = true;
        showNotification(`${tool.name} unlocked`);
        saveGame();
        showUpgradesShopItems(container);
      });

      container.appendChild(card);
    });
  }

  const gsWsHeader = document.createElement("div");
  gsWsHeader.style.cssText =
    "grid-column: 1 / -1; width: 100%; margin: 10px 0; text-align: center;";
  gsWsHeader.innerHTML =
    '<div class="muted" style="margin-top: -6px;">Workshops</div>';
  container.appendChild(gsWsHeader);

  const gsWorkshops =
    gameData.upgrades &&
    gameData.upgrades.gunsmithing &&
    gameData.upgrades.gunsmithing.workshops
      ? gameData.upgrades.gunsmithing.workshops
      : [];
  gsWorkshops.forEach((ws) => {
    const meetsLevel = gunsLevel >= (ws.requiredLevel || 1);
    const owned = !!(
      gameState.workshops &&
      gameState.workshops.gunsmithing &&
      gameState.workshops.gunsmithing[ws.id]
    );
    const hasScrap = (gameState.player.scrap || 0) >= (ws.scrapCost || 0);
    const canBuy = !owned && meetsLevel && hasScrap;

    const card = document.createElement("div");
    card.className = "shop-item";
    card.innerHTML = `
          <div class="item-icon">🏗️</div>
          <div class="item-name">${ws.name}</div>
          <div class="item-meta">Lv ${ws.requiredLevel || 1} • Cost: ${
      ws.scrapCost || 0
    } Scrap</div>
          <button class="action-button shop-buy" ${canBuy ? "" : "disabled"}>${
      owned
        ? "Owned"
        : meetsLevel
        ? hasScrap
          ? "Buy"
          : "Need Scrap"
        : "Level Too Low"
    }</button>
        `;

    const btn = card.querySelector("button");
    btn.addEventListener("click", () => {
      if (!canBuy) return;
      gameState.player.scrap -= ws.scrapCost || 0;
      if (!gameState.workshops)
        gameState.workshops = {
          tailoring: {},
          firstaid: {},
          forging: {},
          gunsmithing: {},
          carpentry: {},
          tinkering: {},
          cooking: {},
          masonry: {},
          chemistry: {},
          electrical: {},
        };
      if (!gameState.workshops.gunsmithing)
        gameState.workshops.gunsmithing = {};
      gameState.workshops.gunsmithing[ws.id] = true;
      showNotification(`${ws.name} purchased`);
      saveGame();
      updatePlayerStats();
      showUpgradesShopItems(container);
    });

    container.appendChild(card);
  });

  const carpHeader = document.createElement("div");
  carpHeader.style.cssText =
    "grid-column: 1 / -1; width: 100%; margin: 20px 0 10px; text-align: center;";
  carpHeader.innerHTML =
    '<h3 style="color: var(--brand);">Carpentry</h3><div class="muted" style="margin-top: -6px;">Tools</div>';
  container.appendChild(carpHeader);

  const carpTools =
    gameData.upgrades &&
    gameData.upgrades.carpentry &&
    gameData.upgrades.carpentry.tools
      ? gameData.upgrades.carpentry.tools
      : [];
  const carpLevel =
    gameState.skills &&
    gameState.skills.carpentry &&
    gameState.skills.carpentry.level
      ? gameState.skills.carpentry.level
      : 1;

  if (carpTools.length === 0) {
    const emptyCP = document.createElement("div");
    emptyCP.style.cssText =
      "grid-column: 1 / -1; color: #8b949e; padding: 20px; text-align: center;";
    emptyCP.textContent = "No carpentry upgrades available.";
    container.appendChild(emptyCP);
  } else {
    carpTools.forEach((tool) => {
      const purchased = !!(
        gameState.upgrades &&
        gameState.upgrades.carpentry &&
        gameState.upgrades.carpentry.purchased &&
        gameState.upgrades.carpentry.purchased[tool.id]
      );
      const meetsLevel = carpLevel >= tool.requiredLevel;
      const canUnlock = !purchased && meetsLevel;

      const card = document.createElement("div");
      card.className = "shop-item";
      card.innerHTML = `
            <div class="item-icon">🪚</div>
            <div class="item-name">${tool.name}</div>
            <div class="item-meta">Requires Carpentry Lv ${
              tool.requiredLevel
            }</div>
            <button class="action-button shop-buy" ${
              canUnlock ? "" : "disabled"
            }>${
        purchased ? "Purchased" : meetsLevel ? "Unlock" : "Level Too Low"
      }</button>
          `;

      const btn = card.querySelector("button");
      btn.addEventListener("click", () => {
        if (!canUnlock) return;
        if (!gameState.upgrades.carpentry)
          gameState.upgrades.carpentry = { purchased: {} };
        if (!gameState.upgrades.carpentry.purchased)
          gameState.upgrades.carpentry.purchased = {};
        gameState.upgrades.carpentry.purchased[tool.id] = true;
        showNotification(`${tool.name} unlocked`);
        saveGame();
        showUpgradesShopItems(container);
      });

      container.appendChild(card);
    });
  }

  const carpWsHeader = document.createElement("div");
  carpWsHeader.style.cssText =
    "grid-column: 1 / -1; width: 100%; margin: 10px 0; text-align: center;";
  carpWsHeader.innerHTML =
    '<div class="muted" style="margin-top: -6px;">Workshops</div>';
  container.appendChild(carpWsHeader);

  const carpWorkshops =
    gameData.upgrades &&
    gameData.upgrades.carpentry &&
    gameData.upgrades.carpentry.workshops
      ? gameData.upgrades.carpentry.workshops
      : [];
  carpWorkshops.forEach((ws) => {
    const meetsLevel = carpLevel >= (ws.requiredLevel || 1);
    const owned = !!(
      gameState.workshops &&
      gameState.workshops.carpentry &&
      gameState.workshops.carpentry[ws.id]
    );
    const hasScrap = (gameState.player.scrap || 0) >= (ws.scrapCost || 0);
    const canBuy = !owned && meetsLevel && hasScrap;

    const card = document.createElement("div");
    card.className = "shop-item";
    card.innerHTML = `
          <div class="item-icon">🏭</div>
          <div class="item-name">${ws.name}</div>
          <div class="item-meta">Lv ${ws.requiredLevel || 1} • Cost: ${
      ws.scrapCost || 0
    } Scrap</div>
          <button class="action-button shop-buy" ${canBuy ? "" : "disabled"}>${
      owned
        ? "Owned"
        : meetsLevel
        ? hasScrap
          ? "Buy"
          : "Need Scrap"
        : "Level Too Low"
    }</button>
        `;

    const btn = card.querySelector("button");
    btn.addEventListener("click", () => {
      if (!canBuy) return;
      gameState.player.scrap -= ws.scrapCost || 0;
      if (!gameState.workshops)
        gameState.workshops = {
          tailoring: {},
          firstaid: {},
          forging: {},
          gunsmithing: {},
          carpentry: {},
          tinkering: {},
          cooking: {},
          masonry: {},
          chemistry: {},
          electrical: {},
        };
      if (!gameState.workshops.carpentry) gameState.workshops.carpentry = {};
      gameState.workshops.carpentry[ws.id] = true;
      showNotification(`${ws.name} purchased`);
      saveGame();
      updatePlayerStats();
      showUpgradesShopItems(container);
    });

    container.appendChild(card);
  });
  const tinkHeader = document.createElement("div");
  tinkHeader.style.cssText =
    "grid-column: 1 / -1; width: 100%; margin: 20px 0 10px; text-align: center;";
  tinkHeader.innerHTML =
    '<h3 style="color: var(--brand);">Tinkering</h3><div class="muted" style="margin-top: -6px;">Tools</div>';
  container.appendChild(tinkHeader);

  const tinkTools =
    gameData.upgrades &&
    gameData.upgrades.tinkering &&
    gameData.upgrades.tinkering.tools
      ? gameData.upgrades.tinkering.tools
      : [];
  const tinkLevel =
    gameState.skills &&
    gameState.skills.tinkering &&
    gameState.skills.tinkering.level
      ? gameState.skills.tinkering.level
      : 1;

  if (tinkTools.length === 0) {
    const emptyTK = document.createElement("div");
    emptyTK.style.cssText =
      "grid-column: 1 / -1; color: #8b949e; padding: 20px; text-align: center;";
    emptyTK.textContent = "No tinkering upgrades available.";
    container.appendChild(emptyTK);
  } else {
    tinkTools.forEach((tool) => {
      const purchased = !!(
        gameState.upgrades &&
        gameState.upgrades.tinkering &&
        gameState.upgrades.tinkering.purchased &&
        gameState.upgrades.tinkering.purchased[tool.id]
      );
      const meetsLevel = tinkLevel >= tool.requiredLevel;
      const canUnlock = !purchased && meetsLevel;

      const card = document.createElement("div");
      card.className = "shop-item";
      card.innerHTML = `
            <div class="item-icon">🛠️</div>
            <div class="item-name">${tool.name}</div>
            <div class="item-meta">Requires Tinkering Lv ${
              tool.requiredLevel
            }</div>
            <button class="action-button shop-buy" ${
              canUnlock ? "" : "disabled"
            }>${
        purchased ? "Purchased" : meetsLevel ? "Unlock" : "Level Too Low"
      }</button>
          `;

      const btn = card.querySelector("button");
      btn.addEventListener("click", () => {
        if (!canUnlock) return;
        if (!gameState.upgrades.tinkering)
          gameState.upgrades.tinkering = { purchased: {} };
        if (!gameState.upgrades.tinkering.purchased)
          gameState.upgrades.tinkering.purchased = {};
        gameState.upgrades.tinkering.purchased[tool.id] = true;
        showNotification(`${tool.name} unlocked`);
        saveGame();
        showUpgradesShopItems(container);
      });

      container.appendChild(card);
    });
  }

  const tinkWsHeader = document.createElement("div");
  tinkWsHeader.style.cssText =
    "grid-column: 1 / -1; width: 100%; margin: 10px 0; text-align: center;";
  tinkWsHeader.innerHTML =
    '<div class="muted" style="margin-top: -6px;">Workshops</div>';
  container.appendChild(tinkWsHeader);

  const tinkWorkshops =
    gameData.upgrades &&
    gameData.upgrades.tinkering &&
    gameData.upgrades.tinkering.workshops
      ? gameData.upgrades.tinkering.workshops
      : [];
  tinkWorkshops.forEach((ws) => {
    const meetsLevel = tinkLevel >= (ws.requiredLevel || 1);
    const owned = !!(
      gameState.workshops &&
      gameState.workshops.tinkering &&
      gameState.workshops.tinkering[ws.id]
    );
    const hasScrap = (gameState.player.scrap || 0) >= (ws.scrapCost || 0);
    const canBuy = !owned && meetsLevel && hasScrap;

    const card = document.createElement("div");
    card.className = "shop-item";
    card.innerHTML = `
          <div class="item-icon">🏭</div>
          <div class="item-name">${ws.name}</div>
          <div class="item-meta">Lv ${ws.requiredLevel || 1} • Cost: ${
      ws.scrapCost || 0
    } Scrap</div>
          <button class="action-button shop-buy" ${canBuy ? "" : "disabled"}>${
      owned
        ? "Owned"
        : meetsLevel
        ? hasScrap
          ? "Buy"
          : "Need Scrap"
        : "Level Too Low"
    }</button>
        `;

    const btn = card.querySelector("button");
    btn.addEventListener("click", () => {
      if (!canBuy) return;
      gameState.player.scrap -= ws.scrapCost || 0;
      if (!gameState.workshops)
        gameState.workshops = {
          tailoring: {},
          firstaid: {},
          forging: {},
          gunsmithing: {},
          carpentry: {},
          tinkering: {},
          cooking: {},
          masonry: {},
          chemistry: {},
          electrical: {},
        };
      if (!gameState.workshops.tinkering) gameState.workshops.tinkering = {};
      gameState.workshops.tinkering[ws.id] = true;
      showNotification(`${ws.name} purchased`);
      saveGame();
      updatePlayerStats();
      showUpgradesShopItems(container);
    });

    container.appendChild(card);
  });
}

function showGeneralShopItems(container) {
  const animalsSection = document.createElement("div");
  animalsSection.style.cssText =
    "margin-bottom: 40px; grid-column: 1 / -1; width: 100%;";

  const animalsTitle = document.createElement("h3");
  animalsTitle.textContent = "Animals";
  animalsTitle.style.cssText =
    "color: var(--brand); margin-bottom: 20px; text-align: center;";
  animalsSection.appendChild(animalsTitle);

  const animalsGrid = document.createElement("div");
  animalsGrid.className = "shop-animals-grid";

  const structureTypes = {
    pen: { name: "Pen Animals", icon: "🐄", color: "var(--brand)" },
    coop: { name: "Coop Animals", icon: "🐔", color: "#238636" },
    hutch: { name: "Hutch Animals", icon: "🐰", color: "#9b59b6" },
    insect: { name: "Insect House", icon: "🐝", color: "#f1c40f" },
  };

  Object.entries(structureTypes).forEach(([structureType, typeInfo]) => {
    const animals = ANIMAL_CARE_DATA.animals[structureType];
    if (!animals || animals.length === 0) return;

    animals.forEach((animal) => {
      const animalCard = document.createElement("div");
      animalCard.className = "resource-card shop-animal-card";
      animalCard.style.cssText = `border: 1px solid ${typeInfo.color};`;

      const playerLevel = gameState.skills.animalcare.level;
      const price = typeof animal.price === "number" ? animal.price : Infinity; // if price absent, block purchase
      const timeMs =
        typeof animal.time === "number" ? animal.time : 4 * 60 * 60 * 1000; // default 4h
      const icon = animal.icon || "🐾";
      const canPurchase =
        playerLevel >= animal.level &&
        (gameState.bank.coins || 0) >= price &&
        isFinite(price);

      const producesChips = animal.produces
        .map((item) => {
          const itemName = getItemName(item);
          return `<span class="chip">${itemName}</span>`;
        })
        .join("");

      animalCard.innerHTML = `
              <div class="animal-card-header">
                <div class="animal-icon">${icon}</div>
                <h4 class="animal-name" style="color: ${typeInfo.color};">${
        animal.name
      }</h4>
              </div>

              <div class="animal-meta">
                <div><span class="meta-label">Lvl</span> ${animal.level}</div>
                <div><span class="meta-label">Cost</span> 💰 ${
                  isFinite(price) ? price : "N/A"
                }</div>
                <div><span class="meta-label">Prod</span> ${(
                  timeMs / 3600000
                ).toFixed(1)}h</div>
              </div>

              <div class="animal-produces">
                <div class="label">Produces</div>
                <div class="chips">${producesChips}</div>
              </div>

              <div class="animal-actions">
                <button class="action-button shop-buy" onclick="purchaseAnimal('${
                  animal.id
                }', '${structureType}', ${isFinite(price) ? price : 0}, ${
        animal.level
      })" ${!canPurchase ? "disabled" : ""}>
                  ${
                    canPurchase
                      ? "Purchase"
                      : playerLevel < animal.level
                      ? "Level Too Low"
                      : "Not Enough Coins"
                  }
                </button>
                <div class="requires">Requires: ${
                  structureType.charAt(0).toUpperCase() + structureType.slice(1)
                }</div>
              </div>
            `;

      animalCard.addEventListener("mouseenter", () => {
        if (canPurchase) {
          animalCard.style.transform = "translateY(-2px)";
          animalCard.style.boxShadow = `0 4px 8px rgba(0, 0, 0, 0.3)`;
        }
      });

      animalCard.addEventListener("mouseleave", () => {
        animalCard.style.transform = "translateY(0)";
        animalCard.style.boxShadow = "none";
      });

      animalsGrid.appendChild(animalCard);
    });
  });

  animalsSection.appendChild(animalsGrid);
  container.appendChild(animalsSection);
}

function showEquipmentShopItems(container) {
  container.innerHTML = `
          <div style="text-align: center; color: #8b949e; padding: 40px;">
            Equipment shop coming soon...
          </div>
        `;
}

// Expose functions globally
if (typeof window !== "undefined") {
  window.initializeShop = initializeShop;
}
