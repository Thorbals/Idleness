// gathering.js (readable stub)
const GatheringModule = { id: "gathering" };
if (typeof window !== "undefined") {
  window.gameModules = window.gameModules || {};
  window.gameModules.gathering = GatheringModule;
}
export default GatheringModule;
// Auto-split from monolith.js
// Source section: data/gathering.js

function walkAndFix(node) {
  const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null);
  const updates = [];
  while (walker.nextNode()) {
    const cur = walker.currentNode;
    const fixed = maybeFixMojibake(cur.nodeValue);
    if (fixed && fixed !== cur.nodeValue) updates.push([cur, fixed]);
  }
  updates.forEach(([n, v]) => {
    n.nodeValue = v;
  });
}

function observeAndFix(root) {
  const mo = new MutationObserver((list) => {
    for (const m of list) {
      if (m.type === "childList") {
        m.addedNodes.forEach((n) => {
          if (n.nodeType === 3) {
            const f = maybeFixMojibake(n.nodeValue);
            if (f !== n.nodeValue) n.nodeValue = f;
          } else if (n.nodeType === 1) {
            walkAndFix(n);
          }
        });
      } else if (m.type === "characterData") {
        const f = maybeFixMojibake(m.target.nodeValue);
        if (f !== m.target.nodeValue) m.target.nodeValue = f;
      }
    }
  });
  mo.observe(root, { childList: true, characterData: true, subtree: true });
}

function rollForRarityDrop(drops, playerLevel, sourceLevel) {
  const roll = Math.random();
  let cumulativeChance = 0;

  const rarityOrder = ["guaranteed", "epic", "rare", "common"];
  const sortedDrops = [...drops].sort((a, b) => {
    const aIndex = rarityOrder.indexOf(a.rarity || "common");
    const bIndex = rarityOrder.indexOf(b.rarity || "common");
    return aIndex - bIndex;
  });

  for (const drop of sortedDrops) {
    const rarityChance = calculateRarityChance(
      drop.rarity || "common",
      playerLevel,
      sourceLevel
    );
    cumulativeChance += rarityChance;

    if (roll <= cumulativeChance) {
      return drop;
    }
  }

  return sortedDrops[sortedDrops.length - 1];
}

function rollForRarityDrops(drops, playerLevel, sourceLevel) {
  const results = [];
  if (!Array.isArray(drops)) return results;

  drops.forEach((drop) => {
    const rarity = drop.rarity || "common";
    let include = false;
    if (rarity === "guaranteed") {
      include = true;
    } else {
      const chance = calculateRarityChance(rarity, playerLevel, sourceLevel);
      include = Math.random() <= chance;
    }

    if (include) {
      let quantity = 1;
      if (typeof drop.min === "number" && typeof drop.max === "number") {
        quantity =
          Math.floor(Math.random() * (drop.max - drop.min + 1)) + drop.min;
      } else if (typeof drop.min === "number") {
        quantity = drop.min;
      }
      results.push({ item: drop.item, quantity, rarity });
    }
  });

  return results;
}

function getGatheringBonusChance(skill, playerLevel) {
  if (!BONUS_GATHERING_SKILLS.has(skill)) return 0;
  const tiers = Math.floor((playerLevel || 0) / 10);
  return Math.max(0, Math.min(1, tiers * 0.1));
}

function renderGatheringResources(area) {
  const container = document.getElementById("gathering-resources");
  container.innerHTML = "";

  if (!area.gathering) {
    const noResourcesDiv = document.createElement("div");
    noResourcesDiv.style.cssText =
      "color: #8b949e; text-align: center; padding: 20px;";
    noResourcesDiv.textContent =
      "No gathering resources available in this area.";
    container.appendChild(noResourcesDiv);
    return;
  }

  Object.keys(area.gathering).forEach((skillType) => {
    const resourceIds = area.gathering[skillType];
    if (!resourceIds || !Array.isArray(resourceIds)) return;

    resourceIds.forEach((resourceId) => {
      const skill = gameData.skills.gathering_skills[skillType];
      if (!skill || !skill.nodes) {
        console.warn(`Skill not found or missing nodes: ${skillType}`);
        return;
      }

      const resource = skill.nodes.find((node) => node.id === resourceId);
      if (!resource) {
        console.warn(`Resource not found: ${resourceId} in skill ${skillType}`);
        return;
      }

      const requiredLevel = resource.level;
      const playerSkill = gameState.skills[skillType];
      if (!playerSkill) {
        console.warn(`Player skill not found: ${skillType}`);
        return;
      }
      const playerLevel = playerSkill.level;
      const canGather = playerLevel >= requiredLevel;

      const card = document.createElement("div");
      const diffClass = getNodeDifficultyClass(playerLevel, requiredLevel);
      card.className = `resource-card ${diffClass} ${
        canGather ? "" : "locked"
      }`;
      card.dataset.resourceId = resource.id;
      card.dataset.skill = skillType;

      let dropsHtml = "";
      if (showDropPercentages && resource.drops) {
        dropsHtml =
          '<div style="margin-top: 8px; border-top: 1px solid #555; padding-top: 5px;">';
        resource.drops.forEach((drop) => {
          if (drop.rarity) {
            const dropChance = calculateRarityChance(
              drop.rarity,
              playerLevel,
              resource.level
            );
            const rarityColor = getRarityColor(drop.rarity);
            const itemName = getItemName(drop.item);
            dropsHtml += `
                    <div style="display: flex; justify-content: space-between; align-items: center; margin: 2px 0; font-size: 11px;">
                      <span style="color: #bbb; cursor: help;" data-item-tooltip="${
                        drop.item
                      }">${itemName}</span>
                      <span style="color: ${rarityColor}; font-weight: bold; cursor: help;" title="${
              drop.rarity.charAt(0).toUpperCase() + drop.rarity.slice(1)
            }: ${(dropChance * 100).toFixed(1)}% chance (Level diff: ${
              playerLevel - resource.level
            })">${(dropChance * 100).toFixed(1)}%</span>
                    </div>
                  `;
          } else if (drop.chance) {
            const percentage = (drop.chance * 100).toFixed(1);
            const itemName = getItemName(drop.item);
            dropsHtml += `
                    <div style="display: flex; justify-content: space-between; align-items: center; margin: 2px 0; font-size: 11px;">
                      <span style="color: #bbb; cursor: help;" data-item-tooltip="${drop.item}">${itemName}</span>
                      <span style="color: #238636; font-weight: bold;">${percentage}%</span>
                    </div>
                  `;
          }
        });
        dropsHtml += "</div>";
      }

      card.innerHTML = `
                      <h4>${resource.name}</h4>
                      <div>Level ${requiredLevel} ${skillType}</div>
                      <div>${resource.xp} XP</div>
                      <div>${(resource.time / 1000).toFixed(
                        1
                      )}s per action</div>
                      ${dropsHtml}
            <div class="progress-bar" style="display: none;">
              <div class="progress-fill"></div>
            </div>
                  `;

      if (canGather) {
        card.addEventListener("click", () => {
          selectResource(card, resource, skillType);
        });
      }

      container.appendChild(card);
    });
  });
}

function selectResource(card, resource, skillType) {
  if (gameState.combat && gameState.combat.inCombat) {
    escapeBattle();
  }
  if (card.classList.contains("active")) {
    document
      .querySelectorAll(".resource-card")
      .forEach((c) => c.classList.remove("active"));
    hideGatheringProgress();

    gameState.currentAction = null;
    currentSkill = null;
    addGatheringLog("Gathering stopped");
    return;
  }

  document
    .querySelectorAll(".resource-card")
    .forEach((c) => c.classList.remove("active"));
  card.classList.add("active");

  currentSkill = skillType;
  createGatheringProgressBox(resource.name);
  showGatheringProgress();

  startGatheringAction(resource.id, skillType);
  addGatheringLog(`Started gathering ${resource.name}`);
}

function startGatheringAction(resourceId, skillType) {
  const area = gameState.currentArea;
  if (!area || !area.gathering[skillType]) return;

  const skill = gameData.skills.gathering_skills[skillType];
  if (!skill || !skill.nodes) return;

  const resource = skill.nodes.find((node) => node.id === resourceId);
  if (!resource) return;

  if (resource.consumes) {
    for (const consume of resource.consumes) {
      const available = gameState.bank[consume.item] || 0;
      if (available < consume.quantity) {
        const itemName = getItemName(consume.item);
        addGatheringLog(
          `Need ${consume.quantity} ${itemName} to perform this action`,
          "log-error"
        );
        showNotification(`Need ${consume.quantity} ${itemName}`);
        return;
      }
    }
  }

  gameState.currentAction = {
    type: "gathering",
    skill: skillType,
    resource: resource,
    xp: resource.xp,
    drops: resource.drops,
    consumes: resource.consumes,
    duration: resource.time,
    progress: 0,
  };
  resetGatheringProgress();
}

function resetGatheringProgress() {
  document.documentElement.style.setProperty(
    "--gathering-progress-width",
    "0%"
  );
}

function createGatheringProgressBox(resourceName) {
  removeGatheringProgressBox();

  const gatheringMain = document.querySelector(".gathering-main");
  if (!gatheringMain) return;

  const progressBox = document.createElement("div");
  progressBox.id = "dynamic-gathering-progress";
  progressBox.style.cssText = `
        margin-bottom: 15px;
        background: rgba(18, 18, 18, 0.85);
        border-radius: 8px;
        padding: 15px;
        border: 1px solid var(--border);
      `;

  progressBox.innerHTML = `
        <div style="margin-bottom: 8px; color: var(--text); font-weight: 600;">Gathering: ${resourceName}</div>
        <div class="progress-bar" id="gathering-progress">
          <div class="progress-fill" id="gathering-progress-fill"></div>
        </div>
      `;
  const gatheringGrid = document.getElementById("gathering-resources");
  gatheringMain.insertBefore(progressBox, gatheringGrid);
}

function removeGatheringProgressBox() {
  const existingBox = document.getElementById("dynamic-gathering-progress");
  if (existingBox) {
    existingBox.remove();
  }
}

function showGatheringProgress() {
  const gatheringProgress = document.getElementById("gathering-progress");
  if (gatheringProgress) {
    gatheringProgress.classList.add("visible");
  }
}

function hideGatheringProgress() {
  removeGatheringProgressBox();
}

function stopGathering(reason = "") {
  if (gameState.currentAction && gameState.currentAction.type === "gathering") {
    gameState.currentAction = null;
    currentSkill = null;
    try {
      document
        .querySelectorAll(".resource-card")
        .forEach((c) => c.classList.remove("active"));
      hideGatheringProgress();
    } catch (error) {
      console.warn("Error stopping gathering:", error);
    }
    addGatheringLog(reason || "Gathering stopped");
  }
}

function showSkillPage(skill) {
  currentSkill = skill;

  const gatheringSkills = [
    "woodcutting",
    "mining",
    "fishing",
    "foraging",
    "hunting",
    "looting",
    "scavenging",
  ];

  const craftingSkills = [
    "cooking",
    "tinkering",
    "forging",
    "tailoring",
    "gunsmithing",
    "carpentry",
    "firstaid",
    "masonry",
    "chemistry",
    "electrical",
  ];

  const passiveSkills = ["farming", "animalcare"];
  const combatSkills = [
    "fitness",
    "defense",
    "melee",
    "firearms",
    "explosives",
  ];
  if (gatheringSkills.includes(skill)) {
    if (gameState.combat && gameState.combat.inCombat) {
      escapeBattle();
    }
    showSkillGatheringPage(skill);
  } else if (craftingSkills.includes(skill)) {
    if (gameState.combat && gameState.combat.inCombat) escapeBattle();
    stopGathering();
    showSkillCraftingPage(skill);
  } else if (passiveSkills.includes(skill)) {
    if (gameState.combat && gameState.combat.inCombat) escapeBattle();
    stopGathering();
    showSkillPassivePage(skill);
  } else if (combatSkills.includes(skill)) {
    stopGathering();
    showCombatSkillPage(skill);
  }

  showPage("skill");

  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.remove("active");
  });

  const skillNavItem = document.querySelector(`[data-skill="${skill}"]`);
  if (skillNavItem) {
    skillNavItem.classList.add("active");
  }

  updateSkillInfo();
}

function addGatheringLog(message, className = "") {
  const log = document.getElementById("activity-log-content");
  if (!log) return;

  const entry = document.createElement("div");
  entry.className = `log-entry ${className}`;
  entry.textContent = message;
  log.appendChild(entry);
  log.scrollTop = log.scrollHeight;

  while (log.children.length > 50) {
    log.removeChild(log.firstChild);
  }
}

function addToMessageLog(message, type = "info") {
  showNotification(message);

  const className =
    type === "error" ? "log-error" : type === "success" ? "log-success" : "";
  addGatheringLog(message, className);
}

function showSkillGatheringPage(skill) {
  const skillPage = document.getElementById("skill-page");
  const skillContent = document.getElementById("skill-content");

  skillContent.innerHTML = "";

  const toggleContainer = document.createElement("div");
  toggleContainer.style.cssText = "margin-bottom: 15px; text-align: center;";

  const toggleButton = document.createElement("button");
  toggleButton.textContent = "Drops %";
  toggleButton.style.cssText = `
          background: ${
            showDropPercentages ? "#2ecc71" : "rgba(255,255,255,0.06)"
          };
          color: #e6edf3;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.3s;
        `;

  toggleButton.addEventListener("click", () => {
    showDropPercentages = !showDropPercentages;
    showSkillGatheringPage(skill);
  });

  toggleContainer.appendChild(toggleButton);
  skillContent.appendChild(toggleContainer);

  const nodesGrid = document.createElement("div");
  nodesGrid.className = "gathering-grid";

  gameData.areas.forEach((area) => {
    if (area.gathering && area.gathering[skill]) {
      area.gathering[skill].forEach((resourceId) => {
        const skillData = gameData.skills.gathering_skills[skill];
        if (!skillData || !skillData.nodes) {
          console.warn(`Skill not found or missing nodes: ${skill}`);
          return;
        }

        const resource = skillData.nodes.find((node) => node.id === resourceId);
        if (!resource) {
          console.warn(`Resource not found: ${resourceId} in skill ${skill}`);
          return;
        }

        const requiredLevel = resource.level;
        const playerLevel = gameState.skills[skill].level;
        const canGather = playerLevel >= requiredLevel;
        const isAreaUnlocked = gameState.player.combatLevel >= area.level;

        const card = document.createElement("div");
        const diffClass = getNodeDifficultyClass(playerLevel, requiredLevel);
        card.className = `resource-card ${diffClass} ${
          canGather && isAreaUnlocked ? "" : "locked"
        }`;

        let dropsHtml = "";
        if (showDropPercentages && resource.drops) {
          const playerLevelLocal = gameState.skills[skill].level;
          dropsHtml =
            '<div style="margin-top: 8px; border-top: 1px solid #555; padding-top: 5px;">';
          resource.drops.forEach((drop) => {
            if (drop.rarity) {
              const dropChance = calculateRarityChance(
                drop.rarity,
                playerLevelLocal,
                resource.level
              );
              const rarityColor = getRarityColor(drop.rarity);
              const itemName = getItemName(drop.item);
              const quantityText =
                drop.min && drop.max ? ` (${drop.min}-${drop.max})` : "";
              dropsHtml += `
                      <div style="display: flex; justify-content: space-between; align-items: center; margin: 2px 0; font-size: 11px;">
                        <span style="color: #bbb; cursor: help;" data-item-tooltip="${
                          drop.item
                        }">${itemName}${quantityText}</span>
                        <span style="color: ${rarityColor}; font-weight: bold; cursor: help;" title="${
                drop.rarity.charAt(0).toUpperCase() + drop.rarity.slice(1)
              }: ${(dropChance * 100).toFixed(1)}% chance (Level diff: ${
                playerLevelLocal - resource.level
              })">${(dropChance * 100).toFixed(1)}%</span>
                      </div>
                    `;
            } else if (drop.chance) {
              const percentage = (drop.chance * 100).toFixed(1);
              const itemName = getItemName(drop.item);
              const quantityText =
                drop.min && drop.max ? ` (${drop.min}-${drop.max})` : "";
              dropsHtml += `
                      <div style="display: flex; justify-content: space-between; align-items: center; margin: 2px 0; font-size: 11px;">
                        <span style="color: #bbb; cursor: help;" data-item-tooltip="${drop.item}">${itemName}${quantityText}</span>
                        <span style="color: #238636; font-weight: bold;">${percentage}%</span>
                      </div>
                    `;
            }
          });
          dropsHtml += "</div>";
        }

        card.innerHTML = `
                          <h4>${resource.name || "Unknown Resource"}</h4>
                          <div>Level ${requiredLevel} ${skill}</div>
                          <div>${resource.xp || 0} XP</div>
                          <div>${(resource.time
                            ? resource.time / 1000
                            : 0
                          ).toFixed(1)}s per action</div>
                          <div style="font-size: 12px; color: #8b949e; margin-top: 8px;">${
                            area.name
                          }</div>
                          ${dropsHtml}
                          <div style="font-size: 10px; color: var(--brand); margin-top: 5px;">${
                            canGather && isAreaUnlocked
                              ? "Click to go to area"
                              : isAreaUnlocked
                              ? "Level too low"
                              : "Area locked"
                          }</div>
                      `;

        if (canGather && isAreaUnlocked) {
          card.style.cursor = "pointer";
          card.addEventListener("click", () => {
            currentSkill = null;

            document.querySelectorAll(".page-content").forEach((page) => {
              page.style.display = "none";
            });

            document.querySelectorAll(".nav-item").forEach((item) => {
              item.classList.remove("active");
            });

            const areasNavItem = document.querySelector('[data-page="areas"]');
            if (areasNavItem) {
              areasNavItem.classList.add("active");
            }

            showAreaDetail(area.id);

            switchTab("gathering");

            setTimeout(() => {
              const resourceCard = document.querySelector(
                `[data-resource-id="${resource.id}"][data-skill="${skill}"]`
              );
              if (resourceCard && !resourceCard.classList.contains("locked")) {
                selectResource(resourceCard, resource, skill);
              }
            }, 200);
          });
        } else {
          card.style.cursor = "not-allowed";
          card.style.opacity = "0.6";
        }

        nodesGrid.appendChild(card);
      });
    }
  });

  if (nodesGrid.children.length === 0) {
    const noNodesMsg = document.createElement("div");
    noNodesMsg.className = "no-nodes-message";
    noNodesMsg.textContent = `No ${skill} nodes available yet. Explore more areas!`;
    skillContent.appendChild(noNodesMsg);
  } else {
    skillContent.appendChild(nodesGrid);
  }
}

let showDropPercentages = false;
