// production.js (readable stub)
const ProductionModule = { id: 'production' };
if (typeof window !== 'undefined') { window.gameModules = window.gameModules || {}; window.gameModules.production = ProductionModule; }
export default ProductionModule;
// Auto-split from monolith.js
// Source section: data/production.js


function checkUnlockFarmingPlots(level) {
  FARMING_DATA.plots.forEach((plot) => {
    if (plot.requiredLevel === level) {
      if (
        !gameState.farming.unlockedPlots.find((p) => p.requiredLevel === level)
      ) {
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
          lastHarvest: Date.now(),
        });
        showNotification(`Unlocked ${plot.name}!`);
      }
    }
  });
}

function updatePassiveSystems() {
  updateFarmingProgress();
  updateFarmingProgressBars();
  updateAnimalCareProgress();
  updateAnimalCareProgressBars();
}

function updateFarmingProgress() {
  const currentTime = Date.now();

  gameState.farming.unlockedPlots.forEach((plot) => {
    if (!plot.plantedSeed) return;

    const timeSinceLastHarvest = currentTime - plot.lastHarvest;
    const seedTime = plot.plantedSeed.time;

    if (timeSinceLastHarvest >= seedTime) {
      const harvestCount = Math.floor(timeSinceLastHarvest / seedTime);

      plot.plantedSeed.produces.forEach((product) => {
        const totalOutput = product.quantity * harvestCount;
        addToBank(product.item, totalOutput);
      });

      addXP("farming", 15 * harvestCount);

      plot.lastHarvest = currentTime;

      showNotification(
        `${plot.name} produced crops from ${plot.plantedSeed.name}!`
      );
    }
  });
}

function updateAnimalCareProgress() {
  const currentTime = Date.now();

  gameState.animalCare.unlockedStructures.forEach((structure) => {
    if (structure.placedAnimal) {
      if (
        structure.lastByproduct &&
        currentTime - structure.lastByproduct >= 60000
      ) {
        const a = structure.placedAnimal;
        const count = a.count || 1;
        const byproductPoolByAnimal = {
          cow: ["manure", "leather"],
          dairy_cow: ["manure", "leather"],
          pig: ["manure", "leather"],
          sheep: ["manure", "wool", "hide"],
          goat: ["manure", "hide"],
          llama: ["manure", "fiber", "hide"],
          alpaca: ["manure", "fiber", "hide"],
          chicken: ["manure", "feathers"],
          rooster: ["manure", "feathers"],
          duck: ["manure", "feathers"],
          goose: ["manure", "feathers"],
          turkey: ["manure", "feathers"],
          guinea_fowl: ["manure", "feathers"],
          quail: ["manure", "feathers"],
          pigeon: ["manure", "feathers"],
          dove: ["manure", "feathers"],
          peacock: ["manure", "feathers"],
          rabbit: ["manure", "pelt"],
          guinea_pig: ["manure", "fur"],
          ferret: ["manure", "fur"],
          chinchilla: ["manure", "fur", "pelt"],
          bees: ["beeswax"],
          silkworm: ["silk_thread"],
          mealworm: ["mealworms"],
        };
        const pool = byproductPoolByAnimal[a.id] || ["manure"];
        const randomByproduct = pool[Math.floor(Math.random() * pool.length)];
        const baseQty = Math.floor(Math.random() * 3) + 1;
        const quantity = baseQty * count;

        addToBank(randomByproduct, quantity);
        addToMessageLog(
          `${a.icon} ${a.name} (x${count}) produced ${quantity}x ${getItemName(
            randomByproduct
          )}`,
          "info"
        );

        structure.lastByproduct = currentTime;
      }

      if (
        structure.lastHarvest &&
        currentTime - structure.lastHarvest >= 240000
      ) {
        harvestAnimal(structure);
      }
    }
  });
}

function harvestPlot(plot) {
  if (plot.seed && plot.seed.produces) {
    plot.seed.produces.forEach((product) => {
      const quantity =
        Math.floor(Math.random() * (product.max - product.min + 1)) +
        product.min;
      addToBank(product.item, quantity);
      addToMessageLog(
        `Harvested ${quantity}x ${getItemName(product.item)} from ${plot.name}`,
        "success"
      );
    });
  }

  addXP("farming", 10);

  plot.seed = null;
  plot.progress = 0;
  plot.harvestTime = 0;
}

function harvestAnimal(structure) {
  if (structure.placedAnimal && structure.placedAnimal.produces) {
    const a = structure.placedAnimal;
    const count = a.count || 1;
    a.produces.forEach((productId) => {
      const baseQty = Math.floor(Math.random() * 3) + 2;
      const quantity = baseQty * count;
      addToBank(productId, quantity);
      addToMessageLog(
        `Harvested ${quantity}x ${getItemName(productId)} from ${
          a.name
        } (x${count}) in ${structure.name}`,
        "success"
      );
    });
    addToMessageLog(
      `${a.icon} ${a.name} (x${count}) have been harvested and removed.`,
      "warning"
    );
    structure.placedAnimal = null;
    structure.lastByproduct = null;
    structure.lastHarvest = null;
  }

  addXP("animalcare", 15);
}

function getUnlockedPlots(playerLevel) {
  return Math.min(
    FARMING_DATA.plots.filter((plot) => playerLevel >= plot.requiredLevel)
      .length,
    FARMING_DATA.plots.length
  );
}

function getNextPlotUnlockLevel(playerLevel) {
  const nextPlot = FARMING_DATA.plots.find(
    (plot) => plot.requiredLevel > playerLevel
  );
  return nextPlot ? nextPlot.requiredLevel : null;
}

function useBirdNest() {
  const nonForagingSeeds = [
    "melon_seeds",
    "cucumber_seeds",
    "watermelon_seeds",
    "squash_seeds",
    "pumpkin_seeds",
    "zucchini_seeds",
    "turnip_seeds",
    "ramps_bulb",
    "shallot_bulb",
    "clover_seeds",
    "sumac_seeds",
    "basil_seeds",
    "chives_seeds",
    "cilantro_seeds",
    "dill_seeds",
    "marjoram_seeds",
    "oregano_seeds",
    "parsley_seeds",
    "rosemary_seeds",
    "sage_seeds",
    "savory_seeds",
    "tarragon_seeds",
    "thyme_seeds",
    "shiso_seeds",
  ];
  const seedId =
    nonForagingSeeds[Math.floor(Math.random() * nonForagingSeeds.length)];
  addToBank(seedId, 1);
  showNotification("You found a " + getItemName(seedId) + " in the bird nest!");
  removeFromBank("birds_nest", 1);
  updateUI();
}

function showSkillPassivePage(skill) {
  const skillPage = document.getElementById("skill-page");
  const skillContent = document.getElementById("skill-content");

  skillContent.innerHTML = "";

  const passiveContainer = document.createElement("div");
  passiveContainer.style.cssText = "padding: 20px;";

  const skillTitle = document.createElement("h3");
  skillTitle.textContent = skill.charAt(0).toUpperCase() + skill.slice(1);
  skillTitle.style.cssText =
    "color: var(--brand); margin-bottom: 20px; text-align: center;";
  passiveContainer.appendChild(skillTitle);

  if (skill === "farming") {
    showFarmingInterface(passiveContainer);
  } else if (skill === "animalcare") {
    showAnimalCareInterface(passiveContainer);
  }

  skillContent.appendChild(passiveContainer);
}

function showFarmingInterface(container) {
  const playerLevel = gameState.skills.farming.level;
  const unlockedPlots = getUnlockedPlots(playerLevel);
  const plotTypeNames = {
    herb: "Herb Plot",
    garden: "Garden Plot",
    tree: "Tree Plot",
    mushroom: "Mushroom Log",
  };

  const plotsSection = document.createElement("div");
  plotsSection.style.cssText = "margin-bottom: 30px;";

  const plotsTitle = document.createElement("h4");
  plotsTitle.textContent = "Farm Plots";
  plotsTitle.style.cssText = "color: var(--brand); margin-bottom: 15px;";
  plotsSection.appendChild(plotsTitle);

  const plotsGrid = document.createElement("div");
  plotsGrid.style.cssText =
    "display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;";

  FARMING_DATA.plots.forEach((plot, index) => {
    const isUnlocked = index < unlockedPlots;
    const plotCard = document.createElement("div");
    plotCard.className = "resource-card";

    const plotState = gameState.farming.unlockedPlots.find(
      (p) => p.name === plot.name
    );
    const isPlanted = plotState && plotState.plantedSeed;

    plotCard.style.cssText = `
            background: ${
              isUnlocked ? "rgba(40, 167, 69, 0.2)" : "rgba(255,255,255,0.06)"
            };
            border: 1px solid ${
              isUnlocked ? "var(--brand)" : "rgba(255,255,255,0.08)"
            };
            opacity: ${isUnlocked ? "1" : "0.6"};
            cursor: ${isUnlocked ? "pointer" : "default"};
            min-height: 220px;
          `;

    const compatibleSeeds = getCompatibleSeeds(plot.type, playerLevel);
    const hasSeeds = compatibleSeeds.length > 0;

    plotCard.innerHTML = `
            <h5 style="color: var(--brand);">${plot.name}</h5>
            <div style="color: #8b949e; margin: 5px 0;">Level ${
              plot.requiredLevel
            } required</div>
            <div style="color: #8b949e; margin: 5px 0;">Type: ${
              plotTypeNames[plot.type] || plot.type
            }</div>
            <div style="color: ${
              isUnlocked ? "#2ecc71" : "var(--brand)"
            }; font-weight: bold; margin: 5px 0;">
              ${isUnlocked ? "UNLOCKED" : "LOCKED"}
            </div>
            ${
              isPlanted
                ? `
              <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.08);">
                <div style="color: #238636; font-weight: bold; margin-bottom: 5px;">🌱 ${
                  plotState.plantedSeed.name
                }</div>
                <div style="color: #8b949e; font-size: 12px; margin-bottom: 5px;">
                  Produces: ${plotState.plantedSeed.produces
                    .map((p) => `${p.quantity}x ${getItemName(p.item)}`)
                    .join(", ")}
                </div>
                <div style="color: #1a7f37; font-size: 12px; margin-bottom: 8px;">Every ${(
                  plotState.plantedSeed.time / 1000
                ).toFixed(0)}s</div>
                
                
                <div style="margin-bottom: 8px;">
                  <div style="color: #8b949e; font-size: 11px; margin-bottom: 2px;">Next Harvest</div>
                  <div style="background: rgba(255,255,255,0.06); height: 8px; border-radius: 4px; overflow: hidden;">
                    <div id="farming-progress-${index}" style="
                      height: 100%; 
                      background: linear-gradient(90deg, var(--brand), #2ecc71); 
                      width: 0%; 
                      transition: width 0.1s;
                    "></div>
                  </div>
                </div>
                
                <button style="
                  width: 100%; 
                  padding: 6px; 
                  margin-top: 8px;
                  background: var(--brand); 
                  color: #e6edf3; 
                  border: none; 
                  border-radius: 4px; 
                  cursor: pointer;
                  font-size: 11px;
                " onclick="removePlantedSeed(${index})">
                  Remove Crop
                </button>
              </div>
            `
                : isUnlocked
                ? `
              <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.08);">
                <div style="color: var(--brand); font-size: 12px; margin-bottom: 5px;">Available Seeds: ${
                  compatibleSeeds.length
                }</div>
                <button style="
                  width: 100%; 
                  padding: 8px; 
                  background: ${hasSeeds ? "var(--brand)" : "#8b949e"}; 
                  color: #e6edf3; 
                  border: none; 
                  border-radius: 4px; 
                  cursor: ${hasSeeds ? "pointer" : "not-allowed"};
                  font-size: 12px;
                " ${
                  hasSeeds
                    ? `onclick="selectSeedForPlot('${plot.name}', '${plot.type}', ${index})"`
                    : "disabled"
                }>
                  ${hasSeeds ? "Plant Seed" : "No Seeds"}
                </button>
              </div>
            `
                : ""
            }
          `;

    plotsGrid.appendChild(plotCard);
  });

  plotsSection.appendChild(plotsGrid);
  container.appendChild(plotsSection);
}

function updateFarmingProgressBars() {
  const currentTime = Date.now();

  gameState.farming.unlockedPlots.forEach((plot, index) => {
    if (plot.plantedSeed) {
      const progressElement = document.getElementById(
        `farming-progress-${index}`
      );
      if (progressElement && plot.lastHarvest) {
        const timePassed = currentTime - plot.lastHarvest;
        const seedTime = plot.plantedSeed.time;
        const progress = Math.min(100, (timePassed / seedTime) * 100);
        progressElement.style.width = `${progress}%`;
      }
    }
  });
}

function getCompatibleSeeds(plotType, playerLevel) {
  const seeds = FARMING_DATA.seeds[plotType] || [];
  return seeds.filter((seed) => {
    const playerHas = gameState.bank[seed.id] || 0;
    return playerHas > 0 && playerLevel >= seed.level;
  });
}

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

  compatibleSeeds.forEach((seed) => {
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
            <div style="color: var(--brand); font-weight: bold;">${
              seed.name
            }</div>
            <div style="color: #8b949e; font-size: 12px;">Level ${
              seed.level
            } • Owned: ${playerHas}</div>
            <div style="color: #238636; font-size: 12px; margin-top: 5px;">
              Produces: ${seed.produces
                .map((p) => `${p.quantity}x ${getItemName(p.item)}`)
                .join(", ")}
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

  modalContent
    .querySelector("#cancel-seed-selection")
    .addEventListener("click", () => {
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
  let plotState = gameState.farming.unlockedPlots.find(
    (p) => p.name === plotData.name
  );

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
      lastHarvest: Date.now(),
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
  const plotState = gameState.farming.unlockedPlots.find(
    (p) => p.name === plotData.name
  );

  if (plotState && plotState.plantedSeed) {
    showNotification(
      `Removed ${plotState.plantedSeed.name} from ${plotData.name}.`,
      "info"
    );
    plotState.plantedSeed = null;
    plotState.lastPlanted = null;

    showSkillPage("farming");
  }
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

function purchaseAnimal(animalId, structureType, price, requiredLevel) {
  const playerLevel = gameState.skills.animalcare.level;
  const playerCoins = gameState.bank.coins || 0;

  if (playerLevel < requiredLevel) {
    showNotification(
      `Need level ${requiredLevel} Animal Care to purchase this animal.`,
      "error"
    );
    return;
  }

  if (!isFinite(price) || price <= 0) {
    showNotification(`This animal is not for sale.`, "error");
    return;
  }

  if (playerCoins < price) {
    showNotification(
      `Need ${price} coins to purchase this animal. You have ${playerCoins}.`,
      "error"
    );
    return;
  }

  gameState.bank.coins = (gameState.bank.coins || 0) - price;
  if (gameState.bank.coins <= 0) {
    delete gameState.bank.coins;
  }

  gameState.bank[animalId] = (gameState.bank[animalId] || 0) + 1;
  const animalData = ANIMAL_CARE_DATA.animals[structureType].find(
    (a) => a.id === animalId
  );
  showNotification(
    `Purchased ${animalData.name} for ${price} coins! Added to bank.`,
    "success"
  );
  renderBank();
  showShopTab("general");
}

function updateAnimalCareProgressBars() {
  const currentTime = Date.now();

  gameState.animalCare.unlockedStructures.forEach((structure, index) => {
    if (structure.placedAnimal) {
      const byproductElement = document.getElementById(
        `byproduct-progress-${index}`
      );
      if (byproductElement && structure.lastByproduct) {
        const byproductTimePassed = currentTime - structure.lastByproduct;
        const byproductProgress = Math.min(
          100,
          (byproductTimePassed / 60000) * 100
        );
        byproductElement.style.width = `${byproductProgress}%`;
      }

      const harvestElement = document.getElementById(
        `harvest-progress-${index}`
      );
      if (harvestElement && structure.lastHarvest) {
        const harvestTimePassed = currentTime - structure.lastHarvest;
        const harvestProgress = Math.min(
          100,
          (harvestTimePassed / 240000) * 100
        );
        harvestElement.style.width = `${harvestProgress}%`;
      }
    }
  });
}

function getCompatibleAnimals(structureType, playerLevel) {
  const animals = ANIMAL_CARE_DATA.animals[structureType] || [];
  return animals.filter((animal) => {
    const playerHas = gameState.bank[animal.id] || 0;
    return playerHas > 0 && playerLevel >= animal.level;
  });
}

function selectAnimalForStructure(
  structureName,
  structureType,
  structureIndex
) {
  const playerLevel = gameState.skills.animalcare.level;
  const compatibleAnimals = getCompatibleAnimals(structureType, playerLevel);

  if (compatibleAnimals.length === 0) {
    showNotification("No compatible animals available!", "error");
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
          <h3 style="color: var(--brand); margin-bottom: 15px;">Select Animal for ${structureName}</h3>
          <div style="color: #8b949e; margin-bottom: 15px;">Compatible ${structureType} animals:</div>
          <div id="animal-selection-grid" style="display: grid; grid-template-columns: 1fr; gap: 10px; margin-bottom: 15px;"></div>
          <button id="cancel-animal-selection" style="
            background: var(--brand);
            color: #e6edf3;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            width: 100%;
          ">Cancel</button>
        `;

  const animalGrid = modalContent.querySelector("#animal-selection-grid");

  compatibleAnimals.forEach((animal) => {
    const playerHas = gameState.bank[animal.id] || 0;
    const animalOption = document.createElement("div");
    animalOption.style.cssText = `
            background: rgba(142, 68, 173, 0.2);
            border: 1px solid #8e44ad;
            padding: 10px;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.2s;
          `;

    animalOption.innerHTML = `
            <div style="color: #8e44ad; font-weight: bold;">${animal.icon} ${
      animal.name
    }</div>
            <div style="color: #8b949e; font-size: 12px;">Level ${
              animal.level
            } • Owned: ${playerHas}</div>
            <div style="color: #238636; font-size: 12px; margin-top: 5px;">
              Produces: ${animal.produces
                .map((item) => getItemName(item))
                .join(", ")}
            </div>
            <div style="color: #1a7f37; font-size: 12px;">
              Byproducts every 1min • Harvest every 4min
            </div>
          `;

    animalOption.addEventListener("click", () => {
      placeAnimal(structureIndex, animal);
      document.body.removeChild(modal);
    });

    animalOption.addEventListener("mouseenter", () => {
      animalOption.style.backgroundColor = "rgba(142, 68, 173, 0.4)";
    });

    animalOption.addEventListener("mouseleave", () => {
      animalOption.style.backgroundColor = "rgba(142, 68, 173, 0.2)";
    });

    animalGrid.appendChild(animalOption);
  });

  modalContent
    .querySelector("#cancel-animal-selection")
    .addEventListener("click", () => {
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

function placeAnimal(structureIndex, animal) {
  const structureData = ANIMAL_CARE_DATA.structures[structureIndex];
  let structureState = gameState.animalCare.unlockedStructures.find(
    (s) => s.name === structureData.name
  );

  if (!structureState) {
    structureState = {
      id: `structure_${structureData.level}`,
      name: structureData.name,
      icon: structureData.icon,
      level: structureData.level,
      type: structureData.type,
      placedAnimal: null,
      lastByproduct: Date.now(),
      lastHarvest: Date.now(),
    };
    gameState.animalCare.unlockedStructures.push(structureState);
  }

  const owned = gameState.bank[animal.id] || 0;
  if (owned <= 0) {
    showNotification(`No ${animal.name} in bank.`, "error");
    return;
  }
  const cap = STRUCTURE_CAPACITY[structureData.type] || 1;
  const countToPlace = Math.min(owned, cap);

  structureState.placedAnimal = {
    id: animal.id,
    name: animal.name,
    icon: animal.icon,
    produces: animal.produces,
    level: animal.level,
    count: countToPlace,
  };
  structureState.lastByproduct = Date.now();
  structureState.lastHarvest = Date.now();

  gameState.bank[animal.id] = owned - countToPlace;
  if (gameState.bank[animal.id] <= 0) delete gameState.bank[animal.id];

  showNotification(
    `Placed ${countToPlace}x ${animal.name} in ${structureData.name}!`,
    "success"
  );
  renderBank();
  showSkillPage("animalcare");
}

// Export functions to window for global access
window.checkUnlockFarmingPlots = checkUnlockFarmingPlots;
