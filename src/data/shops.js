// shops.js — Shop data and functionality
import * as items from './items.js';
import * as equipment from './equipment.js';
import * as production_skills from './production_skills.js';

// Shop tabs configuration
export const SHOP_TABS = {
  MATERIALS: 'materials',
  UPGRADES: 'upgrades',
  EQUIPMENT: 'equipment'
};

// Shop data structure
export const SHOP_DATA = {
  materials: {
    name: 'Materials',
    description: 'Animals and basic supplies',
    categories: ['animals']
  },
  upgrades: {
    name: 'Upgrades',
    description: 'Tools and workshops',
    categories: ['tools', 'workshops']
  },
  equipment: {
    name: 'Equipment',
    description: 'Gear and weapons',
    categories: ['weapons', 'armor', 'accessories']
  }
};

// Import animal data from production_skills
export const ANIMAL_DATA = production_skills.ANIMAL_CARE_DATA;

// Move all tool and workshop upgrades from items.js
export const TOOL_UPGRADES = {
  cooking: items.UPGRADES_DATA?.cooking || {},
  tailoring: items.UPGRADES_DATA?.tailoring || {},
  firstaid: items.UPGRADES_DATA?.firstaid || {},
  forging: items.UPGRADES_DATA?.forging || {},
  gunsmithing: items.UPGRADES_DATA?.gunsmithing || {},
  scavenging: items.UPGRADES_DATA?.scavenging || {},
  looting: items.UPGRADES_DATA?.looting || {},
  carpentry: items.UPGRADES_DATA?.carpentry || {},
  tinkering: items.UPGRADES_DATA?.tinkering || {},
  masonry: items.UPGRADES_DATA?.masonry || {},
  chemistry: items.UPGRADES_DATA?.chemistry || {},
  electrical: items.UPGRADES_DATA?.electrical || {}
};

// Editable shop configuration
export const SHOP_CONFIG = {
  // Materials tab
  materials: {
    animals: {
      enabled: true,
      displayName: 'Animals',
      description: 'Purchase animals for your farm',
      items: ANIMAL_DATA
    }
  },

  // Upgrades tab
  upgrades: {
    tools: {
      enabled: true,
      displayName: 'Tools',
      description: 'Upgrade your tools for better efficiency',
      skills: TOOL_UPGRADES
    },
    workshops: {
      enabled: true,
      displayName: 'Workshops',
      description: 'Build workshops to unlock new crafting options',
      skills: TOOL_UPGRADES
    }
  },

  // Equipment tab
  equipment: {
    weapons: {
      enabled: true,
      displayName: 'Weapons',
      description: 'Combat gear and weapons',
      items: {}
    },
    armor: {
      enabled: true,
      displayName: 'Armor',
      description: 'Protective gear and clothing',
      items: {}
    },
    accessories: {
      enabled: true,
      displayName: 'Accessories',
      description: 'Rings, amulets, and other accessories',
      items: {}
    }
  }
};

// Shop functions
export function initializeShop() {
  setupShopTabs();
  showShopTab(SHOP_TABS.MATERIALS);
}

export function setupShopTabs() {
  document.querySelectorAll('.tab[data-tab]').forEach(tab => {
    tab.addEventListener('click', () => {
      const tabName = tab.dataset.tab;
      showShopTab(tabName);
    });
  });
}

export function showShopTab(tabName) {
  document.querySelectorAll('.tab').forEach(tab => {
    tab.classList.remove('active');
    if (tab.dataset.tab === tabName) {
      tab.classList.add('active');
    }
  });

  const shopItems = document.getElementById('shop-items');
  shopItems.innerHTML = '';

  switch (tabName) {
    case SHOP_TABS.MATERIALS:
      showMaterialsShopItems(shopItems);
      break;
    case SHOP_TABS.UPGRADES:
      showUpgradesShopItems(shopItems);
      break;
    case SHOP_TABS.EQUIPMENT:
      showEquipmentShopItems(shopItems);
      break;
  }
}

export function showMaterialsShopItems(container) {
  const config = SHOP_CONFIG.materials;

  if (config.animals.enabled) {
    showAnimalShopItems(container, config.animals);
  }
}

export function showAnimalShopItems(container, config) {
  const animalsSection = document.createElement("div");
  animalsSection.style.cssText =
    "margin-bottom: 40px; grid-column: 1 / -1; width: 100%;";
  const animalsTitle = document.createElement("h3");
  animalsTitle.textContent = config.displayName;
  animalsTitle.style.cssText =
    "color: var(--brand); margin-bottom: 20px; text-align: center;";
  animalsSection.appendChild(animalsTitle);

  const animalsGrid = document.createElement("div");
  animalsGrid.className = "shop-animals-grid";

  const structureTypes = {
    pen: { name: "Pen Animals", icon: "🐄", color: "var(--brand)" },
    coop: { name: "Coop Animals", icon: "🐔", color: "#238636" },
    hutch: { name: "Hutch Animals", icon: "🐰", color: "#9b59b6" },
    insect: { name: "Insect House", icon: "🐝", color: "#f1c40f" }
  };

  Object.entries(structureTypes).forEach(([structureType, typeInfo]) => {
    const animals = ANIMAL_DATA.animals[structureType];
    if (!animals || animals.length === 0) return;

    animals.forEach(animal => {
      const animalCard = document.createElement('div');
      animalCard.className = 'resource-card shop-animal-card';
      animalCard.style.cssText = `border: 1px solid ${typeInfo.color};`;

      const playerLevel = gameState?.skills?.animalcare?.level || 1;
      const price = typeof animal.price === 'number' ? animal.price : 1000; // Default price
      const timeMs = typeof animal.time === 'number' ? animal.time : 4 * 60 * 60 * 1000;
      const icon = animal.icon || typeInfo.icon;
      const canPurchase = playerLevel >= animal.level && (gameState?.bank?.coins || 0) >= price;

      const producesChips = animal.produces.map(item => {
        const itemName = getItemName ? getItemName(item) : item;
        return `<span class="chip">${itemName}</span>`;
      }).join('');

      animalCard.innerHTML = `
          <div class="animal-card-header">
            <div class="animal-icon">${icon}</div>
            <h4 class="animal-name" style="color: ${typeInfo.color};">${animal.name}</h4>
          </div>

          <div class="animal-meta">
            <div><span class="meta-label">Lvl</span> ${animal.level}</div>
            <div><span class="meta-label">Cost</span> 💰 ${price}</div>
            <div><span class="meta-label">Prod</span> ${(timeMs / 3600000).toFixed(1)}h</div>
          </div>

          <div class="animal-produces">
            <div class="label">Produces</div>
            <div class="chips">${producesChips}</div>
          </div>

          <div class="animal-actions">
            <button class="action-button shop-buy" onclick="window.purchaseAnimal('${animal.id}', '${structureType}', ${price}, ${animal.level})" ${!canPurchase ? 'disabled' : ''}>
              ${canPurchase ? 'Purchase' : (playerLevel < animal.level ? 'Level Too Low' : 'Not Enough Coins')}
            </button>
            <div class="requires">Requires: ${structureType.charAt(0).toUpperCase() + structureType.slice(1)}</div>
          </div>
        `;

      animalCard.addEventListener('mouseenter', () => {
        if (canPurchase) {
          animalCard.style.transform = 'translateY(-2px)';
          animalCard.style.boxShadow = `0 4px 8px rgba(0, 0, 0, 0.3)`;
        }
      });

      animalCard.addEventListener('mouseleave', () => {
        animalCard.style.transform = 'translateY(0)';
        animalCard.style.boxShadow = 'none';
      });

      animalsGrid.appendChild(animalCard);
    });
  });

  animalsSection.appendChild(animalsGrid);
  container.appendChild(animalsSection);
}

export function showUpgradesShopItems(container) {
  container.innerHTML = '';

  // Display tool and workshop upgrades for each skill
  Object.entries(TOOL_UPGRADES).forEach(([skillName, skillData]) => {
    if (skillData.tools && skillData.tools.length > 0) {
      const toolsHeader = document.createElement('div');
      toolsHeader.style.cssText = 'grid-column: 1 / -1; width: 100%; margin-bottom: 10px; text-align: center;';
      toolsHeader.innerHTML = `<h3 style="color: var(--brand);">${skillName.charAt(0).toUpperCase() + skillName.slice(1)}</h3><div class="muted" style="margin-top: -6px;">Tools</div>`;
      container.appendChild(toolsHeader);

      skillData.tools.forEach(tool => {
        const card = document.createElement('div');
        card.className = 'shop-item';
        card.innerHTML = `
          <div class="item-icon">🔧</div>
          <div class="item-name">${tool.name}</div>
          <div class="item-meta">Requires ${skillName.charAt(0).toUpperCase() + skillName.slice(1)} Lv ${tool.requiredLevel}</div>
          <button class="action-button shop-buy">Purchase</button>
        `;
        container.appendChild(card);
      });
    }

    if (skillData.workshops && skillData.workshops.length > 0) {
      const workshopsHeader = document.createElement('div');
      workshopsHeader.style.cssText = 'grid-column: 1 / -1; width: 100%; margin: 20px 0 10px; text-align: center;';
      workshopsHeader.innerHTML = `<h3 style="color: var(--brand);">${skillName.charAt(0).toUpperCase() + skillName.slice(1)}</h3><div class="muted" style="margin-top: -6px;">Workshops</div>`;
      container.appendChild(workshopsHeader);

      skillData.workshops.forEach(workshop => {
        const card = document.createElement('div');
        card.className = 'shop-item';
        card.innerHTML = `
          <div class="item-icon">🏭</div>
          <div class="item-name">${workshop.name}</div>
          <div class="item-meta">Requires ${skillName.charAt(0).toUpperCase() + skillName.slice(1)} Lv ${workshop.requiredLevel}</div>
          <div class="item-cost">Cost: ${workshop.scrapCost} scrap</div>
          <button class="action-button shop-buy">Purchase</button>
        `;
        container.appendChild(card);
      });
    }
  });
}

export function showEquipmentShopItems(container) {
  container.innerHTML = `
    <div style="text-align: center; color: #8b949e; padding: 40px;">
      Equipment shop coming soon...
    </div>
  `;
}

// Utility functions for shop management
export function addShopItem(tab, category, item) {
  if (!SHOP_CONFIG[tab] || !SHOP_CONFIG[tab][category]) {
    console.warn(`Invalid tab or category: ${tab}.${category}`);
    return;
  }

  if (!SHOP_CONFIG[tab][category].items) {
    SHOP_CONFIG[tab][category].items = {};
  }

  SHOP_CONFIG[tab][category].items[item.id] = item;
}

export function removeShopItem(tab, category, itemId) {
  if (!SHOP_CONFIG[tab] || !SHOP_CONFIG[tab][category] || !SHOP_CONFIG[tab][category].items) {
    return;
  }

  delete SHOP_CONFIG[tab][category].items[itemId];
}

export function updateShopItem(tab, category, itemId, updates) {
  if (!SHOP_CONFIG[tab] || !SHOP_CONFIG[tab][category] || !SHOP_CONFIG[tab][category].items[itemId]) {
    return;
  }

  Object.assign(SHOP_CONFIG[tab][category].items[itemId], updates);
}

export function toggleShopCategory(tab, category, enabled) {
  if (!SHOP_CONFIG[tab] || !SHOP_CONFIG[tab][category]) {
    return;
  }

  SHOP_CONFIG[tab][category].enabled = enabled;
}

export default {
  SHOP_TABS,
  SHOP_DATA,
  SHOP_CONFIG,
  ANIMAL_DATA,
  TOOL_UPGRADES,
  initializeShop,
  setupShopTabs,
  showShopTab,
  showMaterialsShopItems,
  showUpgradesShopItems,
  showEquipmentShopItems,
  showAnimalShopItems,
  addShopItem,
  removeShopItem,
  updateShopItem,
  toggleShopCategory
};
