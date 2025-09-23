// Utility functions

let currentSkill = null;

function getItemName(itemId) {
  if (!itemId) return '';
  const map = (typeof gameData !== 'undefined' && gameData.items) ? gameData.items : null;
  const named = map && map[itemId] && map[itemId].name;
  if (named) return named;
  return String(itemId)
    .replace(/[_-]+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .trim()
    .replace(/\b\w/g, c => c.toUpperCase());
}

function showNotification(message, type = "info", duration = 3000) {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  notification.classList.remove("notification-success", "notification-error", "notification-warning", "notification-info");
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

function updateUI() {
  document.getElementById("scrap-amount").textContent =
    gameState.player.scrap.toLocaleString();
  document.getElementById("combat-level").textContent =
    gameState.player.combatLevel;

  Object.keys(gameState.skills).forEach((skill) => {
    const element = document.getElementById(`${skill}-level`);
    if (element) {
      element.textContent = gameState.skills[skill].level;
    }
  });

  const bankItems = Object.keys(gameState.bank).length;
  const bankCountEl = document.getElementById("bank-count");
  if (bankCountEl) bankCountEl.textContent = `${bankItems}/${BANK_CAPACITY_SLOTS}`;
  const bankCapacityEl = document.getElementById("bank-capacity");
  if (bankCapacityEl) {
    bankCapacityEl.textContent = `${bankItems}/${BANK_CAPACITY_SLOTS}`;
  }

  document.getElementById(
    "player-hp"
  ).textContent = `${gameState.player.hp}/${gameState.player.maxHp}`;
  document.getElementById("player-attack").textContent =
    gameState.player.attack;
  document.getElementById("player-defense").textContent =
    gameState.player.defense;
  document.getElementById("player-combat-level").textContent =
    gameState.player.combatLevel;

  const hpPercent = (gameState.player.hp / gameState.player.maxHp) * 100;
  document.getElementById("player-hp-bar").style.width = `${hpPercent}%`;

  if (gameState.combat.currentEnemy) {
    const enemyHpPercent =
      (gameState.combat.enemyHp / gameState.combat.enemyMaxHp) * 100;
    document.getElementById(
      "enemy-hp-bar"
    ).style.width = `${enemyHpPercent}%`;
    document.getElementById(
      "enemy-hp-text"
    ).textContent = `${gameState.combat.enemyHp}/${gameState.combat.enemyMaxHp}`;
  }

  updateSkillInfo();
  renderEquipmentSlots();
  populateBandageDropdown();
  populateFoodDropdown();
}

function getXPForLevel(level) {
  let totalXp = 0;
  for (let i = 2; i <= level; i++) {
    totalXp += i * 100;
  }
  return totalXp;
}

function getXPForNextLevel(currentLevel) {
  return (currentLevel + 1) * 100;
}

function addXP(skill, amount) {
  const skillData = gameState.skills[skill];
  if (!skillData) return;

  skillData.xp += amount;

  const newLevel = calculateLevel(skillData.xp);
  if (newLevel > skillData.level) {
    skillData.level = newLevel;
    showNotification(
      `${skill.charAt(0).toUpperCase() + skill.slice(1)
      } level up! Now level ${newLevel}`
    );

    if (
      ["fitness", "defense", "melee", "firearms", "explosives"].includes(
        skill
      )
    ) {
      updateCombatLevel();
      updatePlayerStats();
    }

    if (skill === "farming") {
      checkUnlockFarmingPlots(newLevel);
    }

    if (skill === "animalcare") {
      checkUnlockAnimalStructures(newLevel);
    }
  }
}

function calculateLevel(xp) {
  let totalXpNeeded = 0;
  let level = 1;

  while (totalXpNeeded <= xp) {
    level++;
    totalXpNeeded += level * 100;
  }

  return level - 1;
}

function updateCombatLevel() {
  const combatSkills = [
    "fitness",
    "defense",
    "melee",
    "firearms",
    "explosives",
  ];
  let totalLevels = 0;

  combatSkills.forEach((skill) => {
    totalLevels += gameState.skills[skill].level;
  });

  gameState.player.combatLevel = Math.floor(
    totalLevels / combatSkills.length
  );
}

function updateSkillInfo() {
  if (!currentSkill) {
    const skillName = document.getElementById("skill-name");
    const skillXpInfo = document.getElementById("skill-xp-info");
    const skillPageTitle = document.getElementById("skill-page-title");

    if (skillName) skillName.textContent = "";
    if (skillXpInfo) skillXpInfo.textContent = "";
    if (skillPageTitle) skillPageTitle.textContent = "";

    return;
  }

  const skillData = gameState.skills[currentSkill];
  if (!skillData) return;

  const currentLevelXp = getXPForLevel(skillData.level);
  const nextLevelXp = getXPForNextLevel(skillData.level);
  const progressXp = skillData.xp - currentLevelXp;
  const progressPercent = (progressXp / nextLevelXp) * 100;

  let displayName = currentSkill;
  switch (currentSkill) {
    case "animalcare":
      displayName = "Animal Care";
      break;
    case "firstaid":
      displayName = "First Aid";
      break;
    case "tinkering":
      displayName = "Tinkering";
      break;
    default:
      displayName =
        currentSkill.charAt(0).toUpperCase() + currentSkill.slice(1);
  }

  const skillName = document.getElementById("skill-name");
  const skillXpInfo = document.getElementById("skill-xp-info");
  const skillXpBar = document.getElementById("skill-xp-bar");

  if (skillName) {
    skillName.textContent = displayName;
  }
  if (skillXpInfo) {
    skillXpInfo.textContent = `Level ${skillData.level} (${progressXp}/${nextLevelXp} XP)`;
  }
  if (skillXpBar) {
    skillXpBar.style.width = `${progressPercent}%`;
  }

  const skillPageTitle = document.getElementById("skill-page-title");
  if (skillPageTitle) {
    skillPageTitle.textContent = displayName;
    document.getElementById("skill-level-display").textContent =
      skillData.level;
    document.getElementById("skill-xp-display").textContent = `${skillData.xp
      }/${getXPForLevel(skillData.level + 1)}`;
    document.getElementById(
      "skill-page-xp-bar"
    ).style.width = `${progressPercent}%`;
  }
}

// Export functions to window for global access
window.getItemName = getItemName;
window.showNotification = showNotification;
window.updateUI = updateUI;
window.getXPForLevel = getXPForLevel;
window.getXPForNextLevel = getXPForNextLevel;
window.addXP = addXP;
window.calculateLevel = calculateLevel;
window.updateCombatLevel = updateCombatLevel;
window.updateSkillInfo = updateSkillInfo;