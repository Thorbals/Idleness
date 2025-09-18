// crafting.js (readable stub)
const CraftingModule = { id: "crafting" };
if (typeof window !== "undefined") {
  window.gameModules = window.gameModules || {};
  window.gameModules.crafting = CraftingModule;
}
export default CraftingModule;
// Auto-split from monolith.js
// Source section: data/crafting.js

function completeAction(action) {
  if (action.type === "crafting") {
    try {
      addXP(action.skill, action.recipe.xp);
      addToMessageLog(`+${action.recipe.xp} ${action.skill} XP`, "info");
      let resultItem = action.recipe.result.item;
      let resultQty = action.recipe.result.quantity;
      if (
        action.recipe.randomResult &&
        action.recipe.randomResult.type === "bar"
      ) {
        const playerLevel = gameState.skills.forging?.level || 1;
        const metalRecipes =
          window.crafting_skills.RECIPES_DATA.crafting_skills?.forging
            ?.recipes || [];
        const eligibleBars = metalRecipes
          .filter(
            (r) =>
              r.result &&
              typeof r.result.item === "string" &&
              r.result.item.endsWith("_bar") &&
              (r.level || 0) <= playerLevel
          )
          .map((r) => r.result.item);
        if (eligibleBars.length > 0) {
          const pick =
            eligibleBars[Math.floor(Math.random() * eligibleBars.length)];
          resultItem = pick;
        }
      }

      addToBank(resultItem, resultQty);
      const awardedName = getItemName(resultItem);
      addToMessageLog(`Crafted ${resultQty}x ${awardedName}`, "success");

      renderBank();
      updateSkillInfo();

      const recipe = action.recipe;
      const skill = action.skill;
      let canContinue = craftingContinuous;
      let missingMaterials = [];

      if (canContinue && recipe.materials) {
        recipe.materials.forEach((material) => {
          const playerAmount = gameState.bank[material.item] || 0;
          if (playerAmount < material.quantity) {
            canContinue = false;
            const itemName = getItemName(material.item);
            missingMaterials.push(itemName);
          }
        });
      }

      if (canContinue && craftingContinuous) {
        setTimeout(() => {
          startCrafting(recipe, skill);
        }, 100);
      } else {
        craftingContinuous = false;

        const craftingProgress = document.getElementById("crafting-progress");
        if (craftingProgress) {
          craftingProgress.classList.add("hidden");
        }

        const selectedRecipeDiv = document.getElementById("selected-recipe");
        if (selectedRecipeDiv) {
          if (missingMaterials.length > 0) {
            selectedRecipeDiv.innerHTML = `
                    <div style="color: var(--brand); text-align: center; padding: 40px;">
                      <h4>Crafting Stopped</h4>
                      <p>Missing materials: ${missingMaterials.join(", ")}</p>
                      <div style="margin-top: 15px; color: #8b949e;">
                        Select a recipe to begin crafting
                      </div>
                    </div>
                  `;
            addToMessageLog(
              `Crafting stopped - missing materials: ${missingMaterials.join(
                ", "
              )}`,
              "error"
            );
          } else {
            selectedRecipeDiv.innerHTML = `
                    <div style="color: #8b949e; text-align: center; padding: 40px;">
                      Select a recipe to begin crafting
                    </div>
                  `;
          }
        }
      }
    } catch (error) {
      craftingContinuous = false;
      gameState.currentAction = null;

      const craftingProgress = document.getElementById("crafting-progress");
      if (craftingProgress) {
        craftingProgress.classList.add("hidden");
      }

      addToMessageLog("Crafting error occurred - system reset", "error");
    }

    return;
  }

  if (action.consumes) {
    action.consumes.forEach((consume) => {
      const success = removeFromBank(consume.item, consume.quantity);
      if (success) {
        const itemName = getItemName(consume.item);
        addGatheringLog(`-${consume.quantity} ${itemName}`, "log-consume");
      }
    });
  }

  addXP(action.skill, action.xp);
  addGatheringLog(`+${action.xp} ${action.skill} XP`);

  if (action.drops) {
    const playerLevel = gameState.skills[action.skill]?.level || 1;
    const sourceLevel = action.resource?.level || 1;

    const hasRaritySystem = action.drops.some((drop) => drop.rarity);

    if (hasRaritySystem) {
      const rolled = rollForRarityDrops(action.drops, playerLevel, sourceLevel);
      if (rolled.length > 0) {
        const bonusChance = getGatheringBonusChance(action.skill, playerLevel);
        if (bonusChance > 0 && Math.random() < bonusChance) {
          rolled[0].quantity += 1;
        }
      }
      rolled.forEach((r) => {
        addToBank(r.item, r.quantity);
        const itemName = getItemName(r.item);
        addGatheringLog(`+${r.quantity} ${itemName}`, "log-loot");
      });
    } else {
      action.drops.forEach((drop) => {
        if (drop.chance !== undefined) {
          let actualChance = drop.chance;

          if (action.skill === "looting" && drop === action.drops[0]) {
            const playerLevel = gameState.skills.looting.level;
            const nodeLevel = action.resource.level;
            const levelDifference = Math.max(0, playerLevel - nodeLevel);
            const bonusChance = Math.floor(levelDifference / 5) * 0.01;
            actualChance = 0.05 + bonusChance;
          }

          if (Math.random() < actualChance) {
            let quantity = drop.min || 1;
            const isPrimary = drop === action.drops[0];
            const bonusChance = isPrimary
              ? getGatheringBonusChance(action.skill, playerLevel)
              : 0;
            if (bonusChance > 0 && Math.random() < bonusChance) quantity += 1;
            addToBank(drop.item, quantity);
            const itemName = getItemName(drop.item);
            addGatheringLog(`+${quantity} ${itemName}`, "log-loot");
          }
        } else {
          let quantity =
            Math.floor(Math.random() * (drop.max - drop.min + 1)) + drop.min;
          const isPrimary = drop === action.drops[0];
          const bonusChance = isPrimary
            ? getGatheringBonusChance(action.skill, playerLevel)
            : 0;
          if (bonusChance > 0 && Math.random() < bonusChance) quantity += 1;
          addToBank(drop.item, quantity);
          const itemName = getItemName(drop.item);
          addGatheringLog(`+${quantity} ${itemName}`, "log-loot");
        }
      });
    }
  }

  const resourceCard = document.querySelector(".resource-card.active");
  if (resourceCard) {
    const resourceId = resourceCard.dataset.resourceId;
    const skillType = resourceCard.dataset.skill;

    setTimeout(() => {
      startGatheringAction(resourceId, skillType);
    }, 200);
  }
}

function updateActionProgress() {
  const action = gameState.currentAction;
  if (!action) return;

  const progressPercent = (action.progress / action.duration) * 100;

  if (action.type === "crafting") {
    const craftProgressFill = document.getElementById("craft-progress-fill");
    const craftTimer = document.getElementById("craft-timer");

    if (craftProgressFill) {
      document.documentElement.style.setProperty(
        "--crafting-progress-width",
        `${Math.min(100, progressPercent)}%`
      );
    }

    if (craftTimer) {
      const remainingMs = Math.max(0, action.duration - action.progress);
      const remainingTime = remainingMs / 1000;
      if (remainingTime <= 0.1) {
        craftTimer.textContent = "Completing...";
      } else {
        craftTimer.textContent = `${remainingTime.toFixed(1)}s remaining`;
      }
    }
  } else if (action.type === "gathering") {
    const gatheringProgressFill = document.getElementById(
      "gathering-progress-fill"
    );
    if (gatheringProgressFill) {
      document.documentElement.style.setProperty(
        "--gathering-progress-width",
        `${Math.min(100, progressPercent)}%`
      );
    } else {
      console.warn("Gathering progress fill element not found");
    }
  } else {
    document.documentElement.style.setProperty(
      "--progress-fill-width",
      `${progressPercent}%`
    );
  }
}

function showSkillCraftingPage(skill) {
  const skillPage = document.getElementById("skill-page");
  const skillContent = document.getElementById("skill-content");

  skillContent.innerHTML = "";

  const craftingContainer = document.createElement("div");
  craftingContainer.style.cssText = "display: flex; gap: 20px; height: 100%;";

  const recipeList = document.createElement("div");
  recipeList.style.cssText = "flex: 1; overflow-y: auto; max-height: 500px;";

  const recipeTitle = document.createElement("h3");
  recipeTitle.textContent = "Available Recipes";
  recipeTitle.style.cssText = "margin-bottom: 15px; color: var(--brand);";
  recipeList.appendChild(recipeTitle);

  const craftingArea = document.createElement("div");
  craftingArea.style.cssText =
    "flex: 1; padding: 20px; background: #111111; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08);";
  craftingArea.innerHTML = `
          <h3 style="color: var(--brand); margin-bottom: 15px;">Crafting Station</h3>
          <div id="selected-recipe" style="color: #8b949e; text-align: center; padding: 40px;">
            Select a recipe to begin crafting
          </div>
          <div id="crafting-progress" style="display: none; margin-top: 20px;">
            <div style="margin-bottom: 10px; color: #238636;">Crafting Progress</div>
            <div class="progress-bar"><div id="craft-progress-fill" class="progress-fill" style="width: 0%"></div></div>
            <div id="craft-timer" style="text-align: center; margin-top: 5px; font-size: 12px; color: #8b949e;"></div>
          </div>
        `;

  const skillData = window.crafting_skills.RECIPES_DATA.crafting_skills[skill];
  if (!skillData || !skillData.recipes) {
    const noRecipesMsg = document.createElement("div");
    noRecipesMsg.className = "no-recipes-message";
    noRecipesMsg.textContent = `No recipes available for ${skill}.`;
    skillContent.appendChild(noRecipesMsg);
    return;
  }

  const playerLevel = gameState.skills[skill].level;

  skillData.recipes.forEach((recipe) => {
    const canCraft = playerLevel >= recipe.level;
    let hasStation = true;
    if (
      recipe.station &&
      (skill === "tailoring" ||
        skill === "firstaid" ||
        skill === "forging" ||
        skill === "gunsmithing" ||
        skill === "carpentry" ||
        skill === "tinkering")
    ) {
      const ws = (gameState.workshops && gameState.workshops[skill]) || {};
      hasStation = !!ws[recipe.station];
    }

    const card = document.createElement("div");
    card.className = "resource-card";
    card.style.cssText = `
            margin-bottom: 10px; 
            cursor: ${canCraft ? "pointer" : "not-allowed"}; 
            opacity: ${canCraft && hasStation ? 1 : 0.4};
            border-left: 4px solid ${
              canCraft && hasStation ? "var(--brand)" : "rgba(255,255,255,0.08)"
            };
            background: ${
              canCraft && hasStation
                ? "rgba(255,255,255,0.06)"
                : "rgba(127, 140, 141, 0.2)"
            };
          `;

    const resultName =
      recipe.randomResult && recipe.randomResult.type === "bar"
        ? "Random Bar"
        : getItemName(recipe.result.item);

    card.innerHTML = `
            <h4 style="color: ${canCraft ? "#fff" : "#8b949e"};">${
      recipe.name
    }</h4>
            <div style="font-size: 12px; color: ${
              canCraft && hasStation ? "#8b949e" : "#555"
            };">Level ${recipe.level} ${skill} ${canCraft ? "" : "(LOCKED)"} ${
      (skill === "tailoring" ||
        skill === "firstaid" ||
        skill === "forging" ||
        skill === "gunsmithing" ||
        skill === "carpentry" ||
        skill === "tinkering") &&
      recipe.station &&
      !hasStation
        ? `• Requires: ${getWorkshopName(recipe.station, skill)} (LOCKED)`
        : ""
    }</div>
            <div style="font-size: 12px; color: ${
              canCraft ? "#238636" : "#8b949e"
            };">Creates: ${recipe.result.quantity}x ${resultName}</div>
            <div style="font-size: 12px; color: ${
              canCraft ? "#2ecc71" : "#8b949e"
            };">${recipe.xp} XP • ${(recipe.time / 1000).toFixed(1)}s</div>
          `;

    if (canCraft && hasStation) {
      card.addEventListener("click", () => {
        selectRecipe(recipe, skill, canCraft);
      });
    } else {
      card.addEventListener("click", () => {
        if (!canCraft) {
          addToMessageLog(
            `Requires level ${recipe.level} ${skill}. Your level: ${playerLevel}`,
            "error"
          );
        } else if (
          (skill === "tailoring" ||
            skill === "firstaid" ||
            skill === "forging" ||
            skill === "gunsmithing" ||
            skill === "carpentry" ||
            skill === "tinkering") &&
          recipe.station &&
          !hasStation
        ) {
          addToMessageLog(
            `Requires ${getWorkshopName(
              recipe.station,
              skill
            )} for this recipe.`,
            "error"
          );
        }
      });
    }

    recipeList.appendChild(card);
  });

  craftingContainer.appendChild(recipeList);
  craftingContainer.appendChild(craftingArea);
  skillContent.appendChild(craftingContainer);
}

function startCrafting(recipe, skill) {
  if (gameState.currentAction) {
    addToMessageLog("Already busy with another action.", "error");
    return;
  }

  const playerLevel = gameState.skills[skill].level;

  if (playerLevel < recipe.level) {
    addToMessageLog(
      `Need level ${recipe.level} ${skill} to craft this recipe.`,
      "error"
    );
    return;
  }

  if (
    (skill === "tailoring" ||
      skill === "firstaid" ||
      skill === "forging" ||
      skill === "gunsmithing" ||
      skill === "carpentry" ||
      skill === "tinkering") &&
    recipe.station
  ) {
    const ws = (gameState.workshops && gameState.workshops[skill]) || {};
    if (!ws[recipe.station]) {
      addToMessageLog(
        `Requires ${getWorkshopName(recipe.station, skill)} to craft this.`,
        "error"
      );
      return;
    }
  }

  let hasAllMaterials = true;
  let missingMaterials = [];

  if (recipe.materials) {
    recipe.materials.forEach((material) => {
      const playerAmount = gameState.bank[material.item] || 0;
      if (playerAmount < material.quantity) {
        hasAllMaterials = false;
        const needed = material.quantity - playerAmount;
        const itemName = getItemName(material.item);
        missingMaterials.push(`${needed}x ${itemName}`);
      }
    });
  }

  if (!hasAllMaterials) {
    addToMessageLog(
      `Missing materials: ${missingMaterials.join(", ")}`,
      "error"
    );
    return;
  }

  if (recipe.materials) {
    recipe.materials.forEach((material) => {
      gameState.bank[material.item] =
        (gameState.bank[material.item] || 0) - material.quantity;
      if (gameState.bank[material.item] <= 0) {
        delete gameState.bank[material.item];
      }
    });
  }

  gameState.currentAction = {
    type: "crafting",
    skill: skill,
    recipe: recipe,
    progress: 0,
    duration: recipe.time,
  };

  craftingContinuous = true;

  const craftProgressFill = document.getElementById("craft-progress-fill");
  const craftTimer = document.getElementById("craft-timer");
  if (craftProgressFill) {
    craftProgressFill.style.width = "0%";
  }
  if (craftTimer) {
    craftTimer.textContent = `${(recipe.time / 1000).toFixed(1)}s remaining`;
  }

  const selectedRecipeDiv = document.getElementById("selected-recipe");
  const craftingProgress = document.getElementById("crafting-progress");
  const itemName =
    recipe.randomResult && recipe.randomResult.type === "bar"
      ? "Random Bar"
      : getItemName(recipe.result.item);

  selectedRecipeDiv.innerHTML = `
          <div style="text-align: center;">
            <h4 style="color: #238636;">Crafting ${recipe.name}</h4>
            <div style="color: #2ecc71; margin: 10px 0;">
              Creating ${recipe.result.quantity}x ${itemName}
            </div>
            <div style="color: #8b949e; font-size: 12px; margin: 5px 0;">
              Duration: ${(recipe.time / 1000).toFixed(1)}s
            </div>
            <button id="cancel-crafting-btn" style="
              background: var(--brand); 
              color: #e6edf3; 
              border: none; 
              padding: 8px 16px; 
              border-radius: 4px; 
              cursor: pointer; 
              font-size: 12px;
            ">Cancel</button>
          </div>
        `;

  setTimeout(() => {
    const cancelBtn = document.getElementById("cancel-crafting-btn");
    if (cancelBtn) {
      cancelBtn.onclick = function () {
        cancelCrafting();
      };
    }
  }, 50);

  craftingProgress.classList.remove("hidden");

  addToMessageLog(
    `Started crafting ${recipe.result.quantity}x ${itemName}.`,
    "info"
  );
  renderBank();
  updateSkillInfo();
}

function cancelCrafting() {
  if (gameState.currentAction && gameState.currentAction.type === "crafting") {
    craftingContinuous = false;
    gameState.currentAction = null;

    const craftingProgress = document.getElementById("crafting-progress");
    if (craftingProgress) {
      craftingProgress.style.display = "none";
    }

    const craftProgressFill = document.getElementById("craft-progress-fill");
    const craftTimer = document.getElementById("craft-timer");
    if (craftProgressFill) {
      craftProgressFill.style.width = "0%";
    }
    if (craftTimer) {
      craftTimer.textContent = "";
    }

    const selectedRecipeDiv = document.getElementById("selected-recipe");
    if (selectedRecipeDiv) {
      selectedRecipeDiv.innerHTML = `
              <div style="color: #8b949e; text-align: center; padding: 40px;">
                Select a recipe to begin crafting
              </div>
            `;
    }

    addToMessageLog("Crafting cancelled.", "info");
  }
}

let craftingContinuous = false;
