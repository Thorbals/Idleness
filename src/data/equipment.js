// Auto-extracted data module
export const MELEE_WEAPONS = {
      rusty_kitchen_knife: { id: "rusty_kitchen_knife", name: "Rusty Kitchen Knife", type: "weapon", subtype: "melee", icon: "🔪", attack: 8, accuracy: 5, criticalPct: 1 },
      crowbar: { id: "crowbar", name: "Crowbar", type: "weapon", subtype: "melee", icon: "🛠️", attack: 15, defense: 2, armorPen: 5, attackSpeed: -10 },
      police_baton: { id: "police_baton", name: "Police Baton", type: "weapon", subtype: "melee", icon: "🔨", attack: 12, accuracy: 8, attackSpeed: 15, criticalPct: 3 },
      military_combat_knife: { id: "military_combat_knife", name: "Military Combat Knife", type: "weapon", subtype: "melee", icon: "🗡️", attack: 22, accuracy: 12, criticalPct: 8, armorPen: 10 },
    };

export const RANGED_WEAPONS = {
      assault_rifle: { id: "assault_rifle", name: "Assault Rifle", type: "weapon", subtype: "ranged", icon: "🔫", attack: 35, accuracy: 20, criticalPct: 5, attackSpeed: 25, armorPen: 15 },
    };

export const EXPLOSIVE_WEAPONS = {
      molotov_cocktail: { id: "molotov_cocktail", name: "Molotov Cocktail", type: "weapon", subtype: "explosive", icon: "🔥", attack: 18, elementalStatus: 15, attackSpeed: -20, accuracy: -5 },
      pipe_bomb: { id: "pipe_bomb", name: "Pipe Bomb", type: "weapon", subtype: "explosive", icon: "🧨", attack: 25, armorPen: 12, elementalStatus: 10, attackSpeed: -30 },
      grenade_launcher: { id: "grenade_launcher", name: "Grenade Launcher", type: "weapon", subtype: "explosive", icon: "💥", attack: 40, accuracy: 10, elementalStatus: 20, attackSpeed: -25 },
      c4_explosive: { id: "c4_explosive", name: "C4 Explosive", type: "weapon", subtype: "explosive", icon: "🧱", attack: 55, armorPen: 25, elementalStatus: 25, attackSpeed: -40 },
      rocket_launcher: { id: "rocket_launcher", name: "Rocket Launcher", type: "weapon", subtype: "explosive", icon: "🚀", attack: 70, armorPen: 30, elementalStatus: 30, attackSpeed: -50, criticalPct: 10 },
    };

export const HELMETS = {
      baseball_cap: { id: "baseball_cap", name: "Baseball Cap", type: "helmet", icon: "🧢", accuracy: 3 },
      hard_hat: { id: "hard_hat", name: "Hard Hat", type: "helmet", icon: "🥽", defense: 5, hp: 10 },
      motorcycle_helmet: { id: "motorcycle_helmet", name: "Motorcycle Helmet", type: "helmet", icon: "🏍️", defense: 8, hp: 15, accuracy: -3 },
      riot_helmet: { id: "riot_helmet", name: "Riot Helmet", type: "helmet", icon: "🪖", defense: 12, hp: 20, critResistance: 10 },
      combat_helmet: { id: "combat_helmet", name: "Combat Helmet", type: "helmet", icon: "🪖", defense: 16, hp: 25, accuracy: 8, criticalPct: 5 },
    };

export const BODY_ARMOR = {
      torn_jacket: { id: "torn_jacket", name: "Torn Jacket", type: "armor", icon: "🧥", defense: 3 },
      leather_jacket: { id: "leather_jacket", name: "Leather Jacket", type: "armor", icon: "🥋", defense: 8, attackSpeed: 5 },
      construction_vest: { id: "construction_vest", name: "Construction Vest", type: "armor", icon: "🦺", defense: 12, accuracy: 5 },
      police_vest: { id: "police_vest", name: "Police Vest", type: "armor", icon: "🛡️", defense: 18, hp: 25 },
      military_body_armor: { id: "military_body_armor", name: "Military Body Armor", type: "armor", icon: "🛡️", defense: 28, hp: 40, armorPenResistance: 15 },
    };

export const GLOVES = {
      work_gloves: { id: "work_gloves", name: "Work Gloves", type: "gloves", icon: "🧤", attack: 2, accuracy: 3 },
      rubber_gloves: { id: "rubber_gloves", name: "Rubber Gloves", type: "gloves", icon: "🧤", defense: 2, statusResistance: 10 },
      fingerless_gloves: { id: "fingerless_gloves", name: "Fingerless Gloves", type: "gloves", icon: "🧤", attack: 4, criticalPct: 3, attackSpeed: 5 },
      tactical_gloves: { id: "tactical_gloves", name: "Tactical Gloves", type: "gloves", icon: "🧤", attack: 6, accuracy: 6, criticalPct: 5 },
      power_gauntlets: { id: "power_gauntlets", name: "Power Gauntlets", type: "gloves", icon: "🧤", attack: 12, defense: 8, armorPen: 10, attackSpeed: -5 },
    };

export const BOOTS = {
      worn_sneakers: { id: "worn_sneakers", name: "Worn Sneakers", type: "boots", icon: "👟", attackSpeed: 3 },
      work_boots: { id: "work_boots", name: "Work Boots", type: "boots", icon: "🥾", defense: 4, attack: 3 },
      hiking_boots: { id: "hiking_boots", name: "Hiking Boots", type: "boots", icon: "🥾", defense: 6, attackSpeed: 8, hp: 10 },
      combat_boots: { id: "combat_boots", name: "Combat Boots", type: "boots", icon: "🥾", defense: 8, attack: 5, hp: 15 },
      powered_boots: { id: "powered_boots", name: "Powered Boots", type: "boots", icon: "🤖", defense: 10, attackSpeed: 12, hp: 20, criticalPct: 3 },
    };

export const ACCESSORIES = {
      wristwatch: { id: "wristwatch", name: "Wristwatch", type: "accessory", icon: "⌚", accuracy: 5 },
      dog_tags: { id: "dog_tags", name: "Dog Tags", type: "accessory", icon: "🏷️", hp: 15, criticalPct: 2 },
      gas_mask: { id: "gas_mask", name: "Gas Mask", type: "accessory", icon: "😷", statusResistance: 25, accuracy: -5 },
      night_vision_goggles: { id: "night_vision_goggles", name: "Night Vision Goggles", type: "accessory", icon: "🕶️", accuracy: 15, criticalPct: 8, defense: -3 },
      combat_stimulant_injector: { id: "combat_stimulant_injector", name: "Combat Stimulant Injector", type: "accessory", icon: "💉", attack: 10, attackSpeed: 20, hp: -10 },
    };

export const EQUIPMENT_DATA = {
      ...MELEE_WEAPONS,
      ...RANGED_WEAPONS,
      ...EXPLOSIVE_WEAPONS,
      ...HELMETS,
      ...BODY_ARMOR,
      ...GLOVES,
      ...BOOTS,
      ...ACCESSORIES,
    };

export const STARTER_EQUIPMENT = [
      "rusty_kitchen_knife",
      "torn_jacket",
      "baseball_cap",
      "work_gloves",
      "worn_sneakers",
      "wristwatch"
    ];

export default { MELEE_WEAPONS, RANGED_WEAPONS, EXPLOSIVE_WEAPONS, HELMETS, BODY_ARMOR, GLOVES, BOOTS, ACCESSORIES, EQUIPMENT_DATA, STARTER_EQUIPMENT };
