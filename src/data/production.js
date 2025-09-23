export const PRODUCTION_SKILLS_DATA = {
  animalcare: {
    name: "Animal Care",
    icon: "🐄",
    description: "Raise animals.",
    category: "production",
    creates: [],
    bonuses: {},
  },
  farming: {
    name: "Farming",
    icon: "🌾",
    description: "Grow crops.",
    category: "production",
    creates: [],
    bonuses: {},
  },
};

export const FARMING_DATA = {
  plots: [
    { requiredLevel: 1, name: "Herb Plot #1", type: "herb", icon: "�" },
    { requiredLevel: 6, name: "Garden Plot #1", type: "garden", icon: "�" },
    { requiredLevel: 11, name: "Tree Plot #1", type: "tree", icon: "�" },
    { requiredLevel: 16, name: "Herb Plot #2", type: "herb", icon: "�" },
    { requiredLevel: 21, name: "Mushroom Log #1", type: "mushroom", icon: "�" },
    { requiredLevel: 26, name: "Tree Plot #2", type: "tree", icon: "�" },
    { requiredLevel: 31, name: "Herb Plot #3", type: "herb", icon: "�" },
    { requiredLevel: 36, name: "Garden Plot #2", type: "garden", icon: "�" },
    { requiredLevel: 41, name: "Tree Plot #3", type: "tree", icon: "�" },
    { requiredLevel: 46, name: "Garden Plot #3", type: "garden", icon: "�" },
    { requiredLevel: 50, name: "Mushroom Log #2", type: "mushroom", icon: "�" },
  ],
  seeds: {
    herb: [
      {
        id: "yarrow_seeds",
        name: "Yarrow Patch",
        level: 4,
        time: 60000,
        produces: [
          { item: "yarrow", quantity: 1 },
          { item: "yarrow_seeds", quantity: 1 },
        ],
      },
      {
        id: "turmeric_seeds",
        name: "Turmeric Bed",
        level: 14,
        time: 60000,
        produces: [
          { item: "turmeric", quantity: 1 },
          { item: "turmeric_seeds", quantity: 1 },
        ],
      },
      {
        id: "chamomile_seeds",
        name: "Chamomile Patch",
        level: 17,
        time: 60000,
        produces: [
          { item: "chamomile", quantity: 1 },
          { item: "chamomile_seeds", quantity: 1 },
        ],
      },
      {
        id: "st_johns_wort_seeds",
        name: "St. John's Wort Patch",
        level: 44,
        time: 60000,
        produces: [
          { item: "st_johns_wort", quantity: 1 },
          { item: "st_johns_wort_seeds", quantity: 1 },
        ],
      },
      {
        id: "mint_seeds",
        name: "Mint Patch",
        level: 47,
        time: 60000,
        produces: [
          { item: "mint", quantity: 1 },
          { item: "mint_seeds", quantity: 1 },
        ],
      },
      {
        id: "echinacea_seeds",
        name: "Echinacea Patch",
        level: 54,
        time: 60000,
        produces: [
          { item: "echinacea", quantity: 1 },
          { item: "echinacea_seeds", quantity: 1 },
        ],
      },
    ],
    garden: [
      {
        id: "cotton_seeds",
        name: "Cotton Bush",
        level: 1,
        time: 60000,
        produces: [
          { item: "cotton", quantity: 1 },
          { item: "cotton_seeds", quantity: 1 },
        ],
      },
      {
        id: "onion_seeds",
        name: "Onion Bed",
        level: 7,
        time: 60000,
        produces: [
          { item: "onion", quantity: 1 },
          { item: "onion_seeds", quantity: 1 },
        ],
      },
      {
        id: "flax_seeds",
        name: "Flax Bed",
        level: 10,
        time: 60000,
        produces: [
          { item: "flax", quantity: 1 },
          { item: "flax_seeds", quantity: 1 },
        ],
      },
      {
        id: "jute_seeds",
        name: "Jute Bed",
        level: 20,
        time: 60000,
        produces: [
          { item: "jute", quantity: 1 },
          { item: "jute_seeds", quantity: 1 },
        ],
      },
      {
        id: "aloe_shoots",
        name: "Aloe Clump",
        level: 27,
        time: 60000,
        produces: [
          { item: "aloe", quantity: 1 },
          { item: "aloe_shoots", quantity: 1 },
        ],
      },
      {
        id: "ramie_seeds",
        name: "Ramie Patch",
        level: 30,
        time: 60000,
        produces: [
          { item: "ramie", quantity: 1 },
          { item: "ramie_seeds", quantity: 1 },
        ],
      },
      {
        id: "ginger_shoots",
        name: "Ginger Bed",
        level: 34,
        time: 60000,
        produces: [
          { item: "ginger", quantity: 1 },
          { item: "ginger_shoots", quantity: 1 },
        ],
      },
      {
        id: "stinging_nettle_seeds",
        name: "Stinging Nettle Patch",
        level: 37,
        time: 60000,
        produces: [
          { item: "stinging_nettle", quantity: 1 },
          { item: "stinging_nettle_seeds", quantity: 1 },
        ],
      },
      {
        id: "milkweed_seeds",
        name: "Milkweed Patch",
        level: 40,
        time: 60000,
        produces: [
          { item: "milkweed", quantity: 1 },
          { item: "milkweed_seeds", quantity: 1 },
        ],
      },
      {
        id: "dogbane_seeds",
        name: "Dogbane Patch",
        level: 50,
        time: 60000,
        produces: [
          { item: "dogbane", quantity: 1 },
          { item: "dogbane_seeds", quantity: 1 },
        ],
      },
      {
        id: "carrot_seeds",
        name: "Carrot Bed",
        level: 57,
        time: 60000,
        produces: [
          { item: "carrot", quantity: 1 },
          { item: "carrot_seeds", quantity: 1 },
        ],
      },
      {
        id: "strawberry_seeds",
        name: "Strawberry Patch",
        level: 60,
        time: 60000,
        produces: [
          { item: "strawberry", quantity: 1 },
          { item: "strawberry_seeds", quantity: 1 },
        ],
      },
      {
        id: "milk_thistle_seeds",
        name: "Milk Thistle Patch",
        level: 67,
        time: 60000,
        produces: [
          { item: "milk_thistle", quantity: 1 },
          { item: "milk_thistle_seeds", quantity: 1 },
        ],
      },
    ],
    tree: [
      {
        id: "apple_tree_seed",
        name: "Apple Tree",
        level: 15,
        time: 60000,
        produces: [
          { item: "apple", quantity: 1 },
          { item: "apple_tree_seed", quantity: 1 },
        ],
      },
      {
        id: "peach_tree_seed",
        name: "Peach Tree",
        level: 18,
        time: 60000,
        produces: [
          { item: "peach", quantity: 1 },
          { item: "peach_tree_seed", quantity: 1 },
        ],
      },
      {
        id: "pear_tree_seed",
        name: "Pear Tree",
        level: 20,
        time: 60000,
        produces: [
          { item: "pear", quantity: 1 },
          { item: "pear_tree_seed", quantity: 1 },
        ],
      },
      {
        id: "fig_tree_seed",
        name: "Fig Tree",
        level: 22,
        time: 60000,
        produces: [
          { item: "fig", quantity: 1 },
          { item: "fig_tree_seed", quantity: 1 },
        ],
      },
      {
        id: "lemon_tree_seed",
        name: "Lemon Tree",
        level: 24,
        time: 60000,
        produces: [
          { item: "lemon", quantity: 1 },
          { item: "lemon_tree_seed", quantity: 1 },
        ],
      },
      {
        id: "cherry_tree_seed",
        name: "Cherry Tree",
        level: 25,
        time: 60000,
        produces: [
          { item: "cherry", quantity: 1 },
          { item: "cherry_tree_seed", quantity: 1 },
        ],
      },
      {
        id: "apricot_tree_seed",
        name: "Apricot Tree",
        level: 28,
        time: 60000,
        produces: [
          { item: "apricot", quantity: 1 },
          { item: "apricot_tree_seed", quantity: 1 },
        ],
      },
      {
        id: "mango_tree_seed",
        name: "Mango Tree",
        level: 32,
        time: 60000,
        produces: [
          { item: "mango", quantity: 1 },
          { item: "mango_tree_seed", quantity: 1 },
        ],
      },
      {
        id: "loquat_tree_seed",
        name: "Loquat Tree",
        level: 35,
        time: 60000,
        produces: [
          { item: "loquat", quantity: 1 },
          { item: "loquat_tree_seed", quantity: 1 },
        ],
      },
      {
        id: "plum_tree_seed",
        name: "Plum Tree",
        level: 38,
        time: 60000,
        produces: [
          { item: "plum", quantity: 1 },
          { item: "plum_tree_seed", quantity: 1 },
        ],
      },
      {
        id: "avocado_tree_seed",
        name: "Avocado Tree",
        level: 42,
        time: 60000,
        produces: [
          { item: "avocado", quantity: 1 },
          { item: "avocado_tree_seed", quantity: 1 },
        ],
      },
      {
        id: "olive_tree_seed",
        name: "Olive Tree",
        level: 45,
        time: 60000,
        produces: [
          { item: "olive", quantity: 1 },
          { item: "olive_tree_seed", quantity: 1 },
        ],
      },
      {
        id: "coffee_plant_seed",
        name: "Coffee Plant",
        level: 48,
        time: 60000,
        produces: [
          { item: "coffee_beans", quantity: 1 },
          { item: "coffee_plant_seed", quantity: 1 },
        ],
      },
    ],
    mushroom: [
      {
        id: "chanterelle_spores",
        name: "Chanterelle Mushroom Log",
        level: 24,
        time: 60000,
        produces: [
          { item: "chanterelle_mushroom", quantity: 1 },
          { item: "chanterelle_spores", quantity: 1 },
        ],
      },
      {
        id: "morel_spores",
        name: "Morel Mushroom Log",
        level: 64,
        time: 60000,
        produces: [
          { item: "morel_mushroom", quantity: 1 },
          { item: "morel_spores", quantity: 1 },
        ],
      },
      {
        id: "oyster_mushroom_spores",
        name: "Oyster Mushroom Log",
        level: 70,
        time: 60000,
        produces: [
          { item: "oyster_mushroom", quantity: 1 },
          { item: "oyster_mushroom_spores", quantity: 1 },
        ],
      },
      {
        id: "oyster_spores",
        name: "Oyster Mushroom Log",
        level: 70,
        time: 60000,
        produces: [
          { item: "oyster_mushroom", quantity: 1 },
          { item: "oyster_spores", quantity: 1 },
        ],
      },
      {
        id: "portobello_spores",
        name: "Portobello Mushroom Log",
        level: 62,
        time: 60000,
        produces: [
          { item: "portobello_mushroom", quantity: 1 },
          { item: "portobello_spores", quantity: 1 },
        ],
      },
    ],
  },
};

export const ANIMAL_CARE_DATA = {
  structures: [
    { level: 1, name: "Hutch #1", type: "hutch", icon: "�" },
    { level: 6, name: "Coop #1", type: "coop", icon: "�" },
    { level: 11, name: "Pen #1", type: "pen", icon: "�" },
    { level: 16, name: "Hutch #2", type: "hutch", icon: "�" },
    { level: 21, name: "Coop #2", type: "coop", icon: "�" },
    { level: 26, name: "Pen #2", type: "pen", icon: "�" },
    { level: 31, name: "Insect House #1", type: "insect", icon: "�" },
    { level: 36, name: "Hutch #3", type: "hutch", icon: "�" },
    { level: 41, name: "Coop #3", type: "coop", icon: "�" },
    { level: 46, name: "Pen #3", type: "pen", icon: "�" },
    { level: 50, name: "Insect House #2", type: "insect", icon: "�" },
  ],
  animals: {
    pen: [
      {
        id: "goat",
        name: "Goat",
        level: 34,
        produces: ["mutton", "medium_hide", "bones", "goat"],
      },
      {
        id: "sheep",
        name: "Sheep",
        level: 37,
        produces: ["mutton", "medium_hide", "wool", "bones", "sheep"],
      },
      {
        id: "pig",
        name: "Pig",
        level: 40,
        produces: ["pork", "medium_hide", "bones", "animal_fat", "pig"],
      },
      {
        id: "alligator",
        name: "Alligator",
        level: 44,
        produces: [
          "large_game_meat",
          "large_hide",
          "bones",
          "animal_fat",
          "claws",
          "alligator",
        ],
      },
      {
        id: "bison",
        name: "Bison",
        level: 47,
        produces: ["beef", "large_hide", "bones", "animal_fat", "bison"],
      },
      {
        id: "cow",
        name: "Cow",
        level: 50,
        produces: ["beef", "large_hide", "bones", "animal_fat", "cow"],
      },
      {
        id: "alpaca",
        name: "Alpaca",
        level: 57,
        produces: ["medium_game_meat", "medium_hide", "bones", "alpaca"],
      },
      {
        id: "llama",
        name: "Llama",
        level: 60,
        produces: ["medium_game_meat", "medium_hide", "bones", "llama"],
      },
      {
        id: "ostrich",
        name: "Ostrich",
        level: 64,
        produces: ["poultry", "feathers", "bones", "animal_fat", "ostrich"],
      },
    ],
    coop: [
      {
        id: "grouse",
        name: "Grouse",
        level: 17,
        produces: ["poultry", "feathers", "bones", "grouse"],
      },
      {
        id: "pheasant",
        name: "Pheasant",
        level: 20,
        produces: ["poultry", "feathers", "bones", "pheasant"],
      },
      {
        id: "duck",
        name: "Duck",
        level: 24,
        produces: ["poultry", "feathers", "bones", "animal_fat", "duck"],
      },
      {
        id: "turkey",
        name: "Turkey",
        level: 27,
        produces: ["poultry", "feathers", "bones", "turkey"],
      },
      {
        id: "goose",
        name: "Goose",
        level: 30,
        produces: ["poultry", "feathers", "bones", "animal_fat", "goose"],
      },
      {
        id: "chicken",
        name: "Chicken",
        level: 54,
        produces: ["poultry", "feathers", "bones", "chicken"],
      },
    ],
    hutch: [
      {
        id: "squirrel",
        name: "Squirrel",
        level: 1,
        produces: ["small_game_meat", "small_hide", "bones", "squirrel"],
      },
      {
        id: "rabbit",
        name: "Rabbit",
        level: 4,
        produces: ["small_game_meat", "small_hide", "bones", "rabbit"],
      },
      {
        id: "hare",
        name: "Hare",
        level: 7,
        produces: ["small_game_meat", "small_hide", "bones", "hare"],
      },
      {
        id: "groundhog",
        name: "Groundhog",
        level: 10,
        produces: ["small_game_meat", "small_hide", "bones", "groundhog"],
      },
      {
        id: "opossum",
        name: "Opossum",
        level: 14,
        produces: ["small_game_meat", "small_hide", "bones", "opossum"],
      },
    ],
    insect: [
      {
        id: "bees",
        name: "Bees",
        level: 67,
        produces: ["beeswax", "royal_jelly", "bees"],
      },
      {
        id: "silkworms",
        name: "Silkworms",
        level: 70,
        produces: ["raw_silk", "silkworms"],
      },
    ],
  },
};

export default { PRODUCTION_SKILLS_DATA, FARMING_DATA, ANIMAL_CARE_DATA };

// Production functions
function selectSeedForPlot(plotName, plotType, plotIndex) {
  const playerLevel = gameState.skills.farming.level;
  const compatibleSeeds = getCompatibleSeeds(plotType, playerLevel);

  if (compatibleSeeds.length === 0) {
    showNotification("No compatible seeds available!", "error");
    return;
  }

  const modal = document.createElement("div");
  modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    `;

  const modalContent = document.createElement("div");
  modalContent.style.cssText = `
      background: #111111;
      padding: 20px;
      border-radius: 8px;
      border: 1px solid rgba(255,255,255,0.08);
      max-width: 500px;
      max-height: 80vh;
      overflow-y: auto;
    `;

  modalContent.innerHTML = `
      <h3 style="color: var(--brand); margin-bottom: 15px;">Select Seed for ${plotName}</h3>
      <div style="color: #8b949e; margin-bottom: 15px;">Compatible ${plotType} seeds:</div>
      <div id="seed-selection-grid" style="display: grid; grid-template-columns: 1fr; gap: 10px; margin-bottom: 15px;"></div>
      <button id="cancel-seed-selection" style="
        background: var(--brand);
        color: #e6edf3;
        border: none;
        padding: 10px 20px;
        border-radius: 4px;
        cursor: pointer;
        width: 100%;
      ">Cancel</button>
    `;

  const seedGrid = modalContent.querySelector("#seed-selection-grid");

  compatibleSeeds.forEach(seed => {
    const playerHas = gameState.bank[seed.id] || 0;
    const seedOption = document.createElement("div");
    seedOption.style.cssText = `
        background: rgba(40, 167, 69, 0.2);
        border: 1px solid var(--brand);
        padding: 10px;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.2s;
      `;

    seedOption.innerHTML = `
        <div style="color: var(--brand); font-weight: bold;">${seed.name}</div>
        <div style="color: #8b949e; font-size: 12px;">Level ${seed.level} • Owned: ${playerHas}</div>
        <div style="color: #238636; font-size: 12px; margin-top: 5px;">
          Produces: ${seed.produces.map(p => `${p.quantity}x ${getItemName(p.item)}`).join(', ')}
        </div>
        <div style="color: #1a7f37; font-size: 12px;">
          Time: ${(seed.time / 1000).toFixed(0)}s
        </div>
      `;

    seedOption.addEventListener("click", () => {
      plantSeed(plotIndex, seed);
      document.body.removeChild(modal);
    });

    seedOption.addEventListener("mouseenter", () => {
      seedOption.style.backgroundColor = "rgba(40, 167, 69, 0.4)";
    });

    seedOption.addEventListener("mouseleave", () => {
      seedOption.style.backgroundColor = "rgba(40, 167, 69, 0.2)";
    });

    seedGrid.appendChild(seedOption);
  });

  modalContent.querySelector("#cancel-seed-selection").addEventListener("click", () => {
    document.body.removeChild(modal);
  });

  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });
}

function plantSeed(plotIndex, seed) {
  if (gameState.bank[seed.id] > 0) {
    gameState.bank[seed.id]--;
    if (gameState.bank[seed.id] === 0) {
      delete gameState.bank[seed.id];
    }
  }

  const plotData = FARMING_DATA.plots[plotIndex];
  let plotState = gameState.farming.unlockedPlots.find(p => p.name === plotData.name);

  if (!plotState) {
    plotState = {
      id: `plot_${plotData.requiredLevel}`,
      name: plotData.name,
      icon: plotData.icon,
      requiredLevel: plotData.requiredLevel,
      type: plotData.type,
      interval: plotData.interval,
      output: plotData.output,
      seed: null,
      progress: 0,
      lastHarvest: Date.now()
    };
    gameState.farming.unlockedPlots.push(plotState);
  }

  plotState.plantedSeed = seed;
  plotState.lastPlanted = Date.now();

  showNotification(`Planted ${seed.name} in ${plotData.name}!`, "success");
  renderBank();

  showSkillPage("farming");
}

function removePlantedSeed(plotIndex) {
  const plotData = FARMING_DATA.plots[plotIndex];
  const plotState = gameState.farming.unlockedPlots.find(p => p.name === plotData.name);

  if (plotState && plotState.plantedSeed) {
    showNotification(`Removed ${plotState.plantedSeed.name} from ${plotData.name}.`, "info");
    plotState.plantedSeed = null;
    plotState.lastPlanted = null;

    showSkillPage("farming");
  }
}

function purchaseAnimal(animalId, structureType, price, requiredLevel) {
  const playerLevel = gameState.skills.animalcare.level;
  const playerCoins = gameState.bank.coins || 0;

  if (playerLevel < requiredLevel) {
    showNotification(`Need level ${requiredLevel} Animal Care to purchase this animal.`, "error");
    return;
  }

  if (!isFinite(price) || price <= 0) {
    showNotification(`This animal is not for sale.`, "error");
    return;
  }

  if (playerCoins < price) {
    showNotification(`Need ${price} coins to purchase this animal. You have ${playerCoins}.`, "error");
    return;
  }

  gameState.bank.coins = (gameState.bank.coins || 0) - price;
  if (gameState.bank.coins <= 0) {
    delete gameState.bank.coins;
  }

  gameState.bank[animalId] = (gameState.bank[animalId] || 0) + 1;
  const animalData = ANIMAL_CARE_DATA.animals[structureType].find(a => a.id === animalId);
  showNotification(`Purchased ${animalData.name} for ${price} coins! Added to bank.`, "success");
  renderBank();
  showShopTab('general');
}

function getCompatibleSeeds(plotType, playerLevel) {
  const seeds = FARMING_DATA.seeds[plotType] || [];
  return seeds.filter(seed => {
    const playerHas = gameState.bank[seed.id] || 0;
    return playerHas > 0 && playerLevel >= seed.level;
  });
}

function checkUnlockFarmingPlots(level) {
  FARMING_DATA.plots.forEach(plot => {
    if (plot.requiredLevel === level) {
      if (!gameState.farming.unlockedPlots.find(p => p.requiredLevel === level)) {
        gameState.farming.unlockedPlots.push({
          id: `plot_${plot.requiredLevel}`,
          name: plot.name,
          icon: plot.icon,
          requiredLevel: plot.requiredLevel,
          type: plot.type,
          interval: plot.interval,
          output: plot.output,
          seed: null,
          progress: 0,
          lastHarvest: Date.now()
        });
        showNotification(`Unlocked ${plot.name}!`);
      }
    }
  });
}

function checkUnlockAnimalStructures(level) {
  ANIMAL_CARE_DATA.structures.forEach(structure => {
    if (structure.level === level) {
      if (!gameState.animalCare.unlockedStructures.find(s => s.level === level)) {
        gameState.animalCare.unlockedStructures.push({
          id: `structure_${structure.level}`,
          name: structure.name,
          icon: structure.icon,
          level: structure.level,
          type: structure.type,
          animal: null,
          progress: 0,
          harvestTime: 0
        });
        showNotification(`Unlocked ${structure.name}!`);
      }
    }
  });
}

// Export to window
window.selectSeedForPlot = selectSeedForPlot;
window.removePlantedSeed = removePlantedSeed;
window.purchaseAnimal = purchaseAnimal;
window.getCompatibleSeeds = getCompatibleSeeds;
window.checkUnlockFarmingPlots = checkUnlockFarmingPlots;
window.checkUnlockAnimalStructures = checkUnlockAnimalStructures;
