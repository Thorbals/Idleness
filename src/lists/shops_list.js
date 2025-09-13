// shops.js — Shop data and functionality
import * as production_skills from './production_list.js';

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

// Tool and workshop upgrades for all skills
export const TOOL_UPGRADES = {
  // Gathering Skills
  mining: {
    tools: [
      { id: "mining_pickaxe_stone", name: "Stone Pickaxe", requiredLevel: 1, scrapCost: 10 },
      { id: "mining_pickaxe_copper", name: "Copper Pickaxe", requiredLevel: 5, scrapCost: 50 },
      { id: "mining_pickaxe_iron", name: "Iron Pickaxe", requiredLevel: 15, scrapCost: 200 },
      { id: "mining_pickaxe_bronze", name: "Bronze Pickaxe", requiredLevel: 25, scrapCost: 500 },
      { id: "mining_pickaxe_tungsten", name: "Tungsten Pickaxe", requiredLevel: 35, scrapCost: 1500 },
      { id: "mining_pickaxe_titanium", name: "Titanium Pickaxe", requiredLevel: 50, scrapCost: 5000 }
    ],
    workshops: [
      { id: "mining_workshop_basic", name: "Basic Mining Workshop", requiredLevel: 10, scrapCost: 1000 },
      { id: "mining_workshop_advanced", name: "Advanced Mining Workshop", requiredLevel: 30, scrapCost: 5000 },
      { id: "mining_workshop_industrial", name: "Industrial Mining Facility", requiredLevel: 60, scrapCost: 25000 }
    ]
  },
  woodcutting: {
    tools: [
      { id: "woodcutting_axe_stone", name: "Stone Axe", requiredLevel: 1, scrapCost: 10 },
      { id: "woodcutting_axe_copper", name: "Copper Axe", requiredLevel: 5, scrapCost: 50 },
      { id: "woodcutting_axe_iron", name: "Iron Axe", requiredLevel: 15, scrapCost: 200 },
      { id: "woodcutting_axe_bronze", name: "Bronze Axe", requiredLevel: 25, scrapCost: 500 },
      { id: "woodcutting_axe_tungsten", name: "Tungsten Axe", requiredLevel: 35, scrapCost: 1500 },
      { id: "woodcutting_axe_titanium", name: "Titanium Axe", requiredLevel: 50, scrapCost: 5000 }
    ],
    workshops: [
      { id: "woodcutting_workshop_basic", name: "Basic Woodworking Shop", requiredLevel: 10, scrapCost: 1000 },
      { id: "woodcutting_workshop_advanced", name: "Advanced Woodworking Shop", requiredLevel: 30, scrapCost: 5000 },
      { id: "woodcutting_workshop_industrial", name: "Industrial Sawmill", requiredLevel: 60, scrapCost: 25000 }
    ]
  },
  foraging: {
    tools: [
      { id: "foraging_basket_basic", name: "Basic Foraging Basket", requiredLevel: 1, scrapCost: 25 },
      { id: "foraging_basket_reinforced", name: "Reinforced Foraging Basket", requiredLevel: 10, scrapCost: 100 },
      { id: "foraging_tools_basic", name: "Basic Foraging Tools", requiredLevel: 20, scrapCost: 300 },
      { id: "foraging_tools_advanced", name: "Advanced Foraging Tools", requiredLevel: 40, scrapCost: 1500 }
    ],
    workshops: [
      { id: "foraging_workshop_basic", name: "Basic Herbology Lab", requiredLevel: 15, scrapCost: 2000 },
      { id: "foraging_workshop_advanced", name: "Advanced Herbology Lab", requiredLevel: 45, scrapCost: 10000 }
    ]
  },
  hunting: {
    tools: [
      { id: "hunting_knife_basic", name: "Basic Hunting Knife", requiredLevel: 1, scrapCost: 30 },
      { id: "hunting_knife_steel", name: "Steel Hunting Knife", requiredLevel: 10, scrapCost: 150 },
      { id: "hunting_bow_basic", name: "Basic Hunting Bow", requiredLevel: 15, scrapCost: 200 },
      { id: "hunting_bow_compound", name: "Compound Hunting Bow", requiredLevel: 35, scrapCost: 1000 },
      { id: "hunting_rifle_basic", name: "Basic Hunting Rifle", requiredLevel: 50, scrapCost: 3000 }
    ],
    workshops: [
      { id: "hunting_workshop_basic", name: "Basic Hunting Lodge", requiredLevel: 20, scrapCost: 3000 },
      { id: "hunting_workshop_advanced", name: "Advanced Hunting Lodge", requiredLevel: 50, scrapCost: 15000 }
    ]
  },
  fishing: {
    tools: [
      { id: "fishing_rod_basic", name: "Basic Fishing Rod", requiredLevel: 1, scrapCost: 20 },
      { id: "fishing_rod_reinforced", name: "Reinforced Fishing Rod", requiredLevel: 10, scrapCost: 100 },
      { id: "fishing_net_basic", name: "Basic Fishing Net", requiredLevel: 15, scrapCost: 150 },
      { id: "fishing_net_advanced", name: "Advanced Fishing Net", requiredLevel: 30, scrapCost: 800 },
      { id: "fishing_boat_basic", name: "Basic Fishing Boat", requiredLevel: 45, scrapCost: 2500 }
    ],
    workshops: [
      { id: "fishing_workshop_basic", name: "Basic Fish Processing Plant", requiredLevel: 25, scrapCost: 4000 },
      { id: "fishing_workshop_advanced", name: "Advanced Fish Processing Plant", requiredLevel: 55, scrapCost: 20000 }
    ]
  },
  scavenging: {
    tools: [
      { id: "scavenging_tools_basic", name: "Basic Scavenging Tools", requiredLevel: 1, scrapCost: 15 },
      { id: "scavenging_tools_advanced", name: "Advanced Scavenging Tools", requiredLevel: 20, scrapCost: 300 },
      { id: "scavenging_detector_basic", name: "Basic Metal Detector", requiredLevel: 35, scrapCost: 1200 },
      { id: "scavenging_detector_advanced", name: "Advanced Metal Detector", requiredLevel: 55, scrapCost: 4000 }
    ],
    workshops: [
      { id: "scavenging_workshop_basic", name: "Basic Salvage Workshop", requiredLevel: 15, scrapCost: 2000 },
      { id: "scavenging_workshop_advanced", name: "Advanced Salvage Workshop", requiredLevel: 45, scrapCost: 12000 }
    ]
  },
  looting: {
    tools: [
      { id: "looting_tools_basic", name: "Basic Lockpicking Set", requiredLevel: 1, scrapCost: 25 },
      { id: "looting_tools_advanced", name: "Advanced Lockpicking Set", requiredLevel: 25, scrapCost: 600 },
      { id: "looting_crowbar_basic", name: "Basic Crowbar", requiredLevel: 10, scrapCost: 80 },
      { id: "looting_crowbar_reinforced", name: "Reinforced Crowbar", requiredLevel: 30, scrapCost: 400 }
    ],
    workshops: [
      { id: "looting_workshop_basic", name: "Basic Locksmith Shop", requiredLevel: 20, scrapCost: 3000 },
      { id: "looting_workshop_advanced", name: "Advanced Locksmith Shop", requiredLevel: 50, scrapCost: 15000 }
    ]
  },

  // Crafting Skills
  cooking: {
    tools: [
      { id: "cooking_knife_basic", name: "Basic Kitchen Knife", requiredLevel: 1, scrapCost: 20 },
      { id: "cooking_knife_chef", name: "Chef's Knife", requiredLevel: 15, scrapCost: 150 },
      { id: "cooking_pan_basic", name: "Basic Cooking Pan", requiredLevel: 5, scrapCost: 40 },
      { id: "cooking_pan_advanced", name: "Advanced Cooking Pan", requiredLevel: 25, scrapCost: 300 },
      { id: "cooking_stove_basic", name: "Basic Cooking Stove", requiredLevel: 35, scrapCost: 800 }
    ],
    workshops: [
      { id: "cooking_workshop_basic", name: "Basic Kitchen", requiredLevel: 10, scrapCost: 1000 },
      { id: "cooking_workshop_advanced", name: "Advanced Kitchen", requiredLevel: 30, scrapCost: 5000 },
      { id: "cooking_workshop_restaurant", name: "Restaurant Kitchen", requiredLevel: 60, scrapCost: 25000 }
    ]
  },
  tailoring: {
    tools: [
      { id: "tailoring_needle_basic", name: "Basic Sewing Needle", requiredLevel: 1, scrapCost: 10 },
      { id: "tailoring_needle_advanced", name: "Advanced Sewing Needle", requiredLevel: 20, scrapCost: 100 },
      { id: "tailoring_machine_basic", name: "Basic Sewing Machine", requiredLevel: 30, scrapCost: 600 },
      { id: "tailoring_machine_industrial", name: "Industrial Sewing Machine", requiredLevel: 50, scrapCost: 2500 }
    ],
    workshops: [
      { id: "tailoring_workshop_basic", name: "Basic Tailor Shop", requiredLevel: 15, scrapCost: 2000 },
      { id: "tailoring_workshop_advanced", name: "Advanced Tailor Shop", requiredLevel: 40, scrapCost: 10000 },
      { id: "tailoring_workshop_factory", name: "Textile Factory", requiredLevel: 70, scrapCost: 50000 }
    ]
  },
  firstaid: {
    tools: [
      { id: "firstaid_kit_basic", name: "Basic First Aid Kit", requiredLevel: 1, scrapCost: 30 },
      { id: "firstaid_kit_advanced", name: "Advanced First Aid Kit", requiredLevel: 20, scrapCost: 200 },
      { id: "firstaid_surgical_tools", name: "Surgical Tools", requiredLevel: 40, scrapCost: 1000 },
      { id: "firstaid_defibrillator", name: "Defibrillator", requiredLevel: 60, scrapCost: 3000 }
    ],
    workshops: [
      { id: "firstaid_workshop_basic", name: "Basic Medical Clinic", requiredLevel: 25, scrapCost: 4000 },
      { id: "firstaid_workshop_advanced", name: "Advanced Medical Clinic", requiredLevel: 55, scrapCost: 20000 },
      { id: "firstaid_workshop_hospital", name: "Field Hospital", requiredLevel: 80, scrapCost: 100000 }
    ]
  },
  forging: {
    tools: [
      { id: "forging_hammer_basic", name: "Basic Forging Hammer", requiredLevel: 1, scrapCost: 25 },
      { id: "forging_hammer_advanced", name: "Advanced Forging Hammer", requiredLevel: 20, scrapCost: 150 },
      { id: "forging_anvil_basic", name: "Basic Anvil", requiredLevel: 10, scrapCost: 200 },
      { id: "forging_anvil_advanced", name: "Advanced Anvil", requiredLevel: 35, scrapCost: 1000 },
      { id: "forging_furnace_basic", name: "Basic Forge Furnace", requiredLevel: 25, scrapCost: 500 }
    ],
    workshops: [
      { id: "forging_workshop_basic", name: "Basic Blacksmith Shop", requiredLevel: 15, scrapCost: 2000 },
      { id: "forging_workshop_advanced", name: "Advanced Blacksmith Shop", requiredLevel: 45, scrapCost: 12000 },
      { id: "forging_workshop_factory", name: "Metalworking Factory", requiredLevel: 75, scrapCost: 60000 }
    ]
  },
  gunsmithing: {
    tools: [
      { id: "gunsmithing_tools_basic", name: "Basic Gunsmithing Tools", requiredLevel: 1, scrapCost: 40 },
      { id: "gunsmithing_tools_advanced", name: "Advanced Gunsmithing Tools", requiredLevel: 25, scrapCost: 300 },
      { id: "gunsmithing_press_basic", name: "Basic Reloading Press", requiredLevel: 15, scrapCost: 150 },
      { id: "gunsmithing_press_advanced", name: "Advanced Reloading Press", requiredLevel: 40, scrapCost: 1200 },
      { id: "gunsmithing_lathe", name: "Precision Lathe", requiredLevel: 55, scrapCost: 4000 }
    ],
    workshops: [
      { id: "gunsmithing_workshop_basic", name: "Basic Gunsmith Shop", requiredLevel: 20, scrapCost: 3000 },
      { id: "gunsmithing_workshop_advanced", name: "Advanced Gunsmith Shop", requiredLevel: 50, scrapCost: 15000 },
      { id: "gunsmithing_workshop_factory", name: "Arms Manufacturing Plant", requiredLevel: 80, scrapCost: 75000 }
    ]
  },
  carpentry: {
    tools: [
      { id: "carpentry_tools_basic", name: "Basic Carpentry Tools", requiredLevel: 1, scrapCost: 20 },
      { id: "carpentry_tools_advanced", name: "Advanced Carpentry Tools", requiredLevel: 20, scrapCost: 150 },
      { id: "carpentry_saw_basic", name: "Basic Carpentry Saw", requiredLevel: 10, scrapCost: 80 },
      { id: "carpentry_saw_power", name: "Power Saw", requiredLevel: 35, scrapCost: 800 },
      { id: "carpentry_workbench", name: "Carpentry Workbench", requiredLevel: 25, scrapCost: 400 }
    ],
    workshops: [
      { id: "carpentry_workshop_basic", name: "Basic Carpentry Shop", requiredLevel: 15, scrapCost: 2000 },
      { id: "carpentry_workshop_advanced", name: "Advanced Carpentry Shop", requiredLevel: 45, scrapCost: 12000 },
      { id: "carpentry_workshop_factory", name: "Furniture Factory", requiredLevel: 70, scrapCost: 50000 }
    ]
  },
  tinkering: {
    tools: [
      { id: "tinkering_tools_basic", name: "Basic Tinkering Tools", requiredLevel: 1, scrapCost: 15 },
      { id: "tinkering_tools_advanced", name: "Advanced Tinkering Tools", requiredLevel: 20, scrapCost: 120 },
      { id: "tinkering_soldering_iron", name: "Soldering Iron", requiredLevel: 15, scrapCost: 100 },
      { id: "tinkering_multimeter", name: "Multimeter", requiredLevel: 30, scrapCost: 300 },
      { id: "tinkering_oscilloscope", name: "Oscilloscope", requiredLevel: 50, scrapCost: 2000 }
    ],
    workshops: [
      { id: "tinkering_workshop_basic", name: "Basic Electronics Lab", requiredLevel: 25, scrapCost: 4000 },
      { id: "tinkering_workshop_advanced", name: "Advanced Electronics Lab", requiredLevel: 55, scrapCost: 20000 },
      { id: "tinkering_workshop_factory", name: "Electronics Factory", requiredLevel: 80, scrapCost: 100000 }
    ]
  },
  masonry: {
    tools: [
      { id: "masonry_tools_basic", name: "Basic Masonry Tools", requiredLevel: 1, scrapCost: 25 },
      { id: "masonry_tools_advanced", name: "Advanced Masonry Tools", requiredLevel: 20, scrapCost: 150 },
      { id: "masonry_mixer_basic", name: "Basic Cement Mixer", requiredLevel: 15, scrapCost: 200 },
      { id: "masonry_mixer_advanced", name: "Advanced Cement Mixer", requiredLevel: 40, scrapCost: 1200 },
      { id: "masonry_crane", name: "Construction Crane", requiredLevel: 60, scrapCost: 5000 }
    ],
    workshops: [
      { id: "masonry_workshop_basic", name: "Basic Construction Site", requiredLevel: 20, scrapCost: 3000 },
      { id: "masonry_workshop_advanced", name: "Advanced Construction Site", requiredLevel: 50, scrapCost: 15000 },
      { id: "masonry_workshop_factory", name: "Concrete Plant", requiredLevel: 75, scrapCost: 75000 }
    ]
  },
  chemistry: {
    tools: [
      { id: "chemistry_tools_basic", name: "Basic Chemistry Set", requiredLevel: 1, scrapCost: 30 },
      { id: "chemistry_tools_advanced", name: "Advanced Chemistry Set", requiredLevel: 25, scrapCost: 200 },
      { id: "chemistry_beaker_set", name: "Precision Beaker Set", requiredLevel: 15, scrapCost: 150 },
      { id: "chemistry_distiller", name: "Distillation Apparatus", requiredLevel: 35, scrapCost: 800 },
      { id: "chemistry_spectrometer", name: "Spectrometer", requiredLevel: 55, scrapCost: 3000 }
    ],
    workshops: [
      { id: "chemistry_workshop_basic", name: "Basic Chemistry Lab", requiredLevel: 20, scrapCost: 3000 },
      { id: "chemistry_workshop_advanced", name: "Advanced Chemistry Lab", requiredLevel: 50, scrapCost: 15000 },
      { id: "chemistry_workshop_factory", name: "Chemical Processing Plant", requiredLevel: 80, scrapCost: 75000 }
    ]
  },
  electrical: {
    tools: [
      { id: "electrical_tools_basic", name: "Basic Electrical Tools", requiredLevel: 1, scrapCost: 20 },
      { id: "electrical_tools_advanced", name: "Advanced Electrical Tools", requiredLevel: 20, scrapCost: 150 },
      { id: "electrical_wire_stripper", name: "Wire Stripper Set", requiredLevel: 10, scrapCost: 80 },
      { id: "electrical_multimeter", name: "Digital Multimeter", requiredLevel: 30, scrapCost: 300 },
      { id: "electrical_generator", name: "Portable Generator", requiredLevel: 50, scrapCost: 2000 }
    ],
    workshops: [
      { id: "electrical_workshop_basic", name: "Basic Electrical Shop", requiredLevel: 25, scrapCost: 4000 },
      { id: "electrical_workshop_advanced", name: "Advanced Electrical Shop", requiredLevel: 55, scrapCost: 20000 },
      { id: "electrical_workshop_factory", name: "Power Generation Facility", requiredLevel: 85, scrapCost: 100000 }
    ]
  },

  // Production Skills
  farming: {
    tools: [
      { id: "farming_tools_basic", name: "Basic Farming Tools", requiredLevel: 1, scrapCost: 15 },
      { id: "farming_tools_advanced", name: "Advanced Farming Tools", requiredLevel: 20, scrapCost: 120 },
      { id: "farming_tractor_basic", name: "Basic Tractor", requiredLevel: 35, scrapCost: 1000 },
      { id: "farming_irrigation", name: "Irrigation System", requiredLevel: 25, scrapCost: 400 }
    ],
    workshops: [
      { id: "farming_workshop_basic", name: "Basic Farm", requiredLevel: 10, scrapCost: 1500 },
      { id: "farming_workshop_advanced", name: "Advanced Farm", requiredLevel: 40, scrapCost: 8000 },
      { id: "farming_workshop_factory", name: "Agricultural Complex", requiredLevel: 70, scrapCost: 40000 }
    ]
  },
  animalcare: {
    tools: [
      { id: "animalcare_tools_basic", name: "Basic Animal Care Tools", requiredLevel: 1, scrapCost: 20 },
      { id: "animalcare_tools_advanced", name: "Advanced Animal Care Tools", requiredLevel: 20, scrapCost: 150 },
      { id: "animalcare_veterinary_kit", name: "Veterinary Kit", requiredLevel: 30, scrapCost: 400 },
      { id: "animalcare_feed_mixer", name: "Animal Feed Mixer", requiredLevel: 40, scrapCost: 800 }
    ],
    workshops: [
      { id: "animalcare_workshop_basic", name: "Basic Animal Shelter", requiredLevel: 15, scrapCost: 2000 },
      { id: "animalcare_workshop_advanced", name: "Advanced Animal Shelter", requiredLevel: 45, scrapCost: 10000 },
      { id: "animalcare_workshop_factory", name: "Livestock Processing Plant", requiredLevel: 75, scrapCost: 50000 }
    ]
  }
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

// Expose functions globally for game integration
window.showShopTab = showShopTab;
window.showMaterialsShopItems = showMaterialsShopItems;
window.showEquipmentShopItems = showEquipmentShopItems;
window.showUpgradesShopItems = showUpgradesShopItems;
window.showAnimalShopItems = showAnimalShopItems;
