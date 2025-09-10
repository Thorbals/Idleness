// survivors.js - Gacha system for random survivors

// Precompute rarity cumulative probabilities for performance
const RARITY_CUM_RATES = [
  { key: 'COMMON', value: 0.6 },
  { key: 'RARE', value: 0.85 },  // 0.6 + 0.25
  { key: 'EPIC', value: 0.97 },  // 0.85 + 0.12
  { key: 'LEGENDARY', value: 1.0 }  // 0.97 + 0.03
];

// Rarity definitions with base stats and scaling multipliers
const RARITIES = {
  COMMON: {
    name: 'Common',
    baseStats: {
      attack: { min: 8, max: 12 },
      defense: { min: 8, max: 12 },
      hp: { min: 90, max: 110 },
      luck: { min: 3, max: 7 }
    },
    levelUpMultiplier: 1.0,
    dropRate: 0.6  // 60% chance
  },
  RARE: {
    name: 'Rare',
    baseStats: {
      attack: { min: 15, max: 25 },
      defense: { min: 15, max: 25 },
      hp: { min: 130, max: 170 },
      luck: { min: 8, max: 12 }
    },
    levelUpMultiplier: 1.2,
    dropRate: 0.25  // 25% chance
  },
  EPIC: {
    name: 'Epic',
    baseStats: {
      attack: { min: 28, max: 42 },
      defense: { min: 28, max: 42 },
      hp: { min: 180, max: 220 },
      luck: { min: 13, max: 17 }
    },
    levelUpMultiplier: 1.5,
    dropRate: 0.12  // 12% chance
  },
  LEGENDARY: {
    name: 'Legendary',
    baseStats: {
      attack: { min: 42, max: 58 },
      defense: { min: 42, max: 58 },
      hp: { min: 270, max: 330 },
      luck: { min: 20, max: 30 }
    },
    levelUpMultiplier: 2.0,
    dropRate: 0.03  // 3% chance
  }
};

// Name generators
const FIRST_NAMES = [
  'Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Avery', 'Blake',
  'Cameron', 'Drew', 'Ellis', 'Finley', 'Gray', 'Hunter', 'Jamie', 'Kendall',
  'Logan', 'Madison', 'Noah', 'Parker', 'Quinn', 'Reese', 'Sage', 'Tristan',
  'Val', 'Willow', 'Xander', 'Yara', 'Zane', 'Bailey', 'Charlie', 'Dakota',
  'Emerson', 'Frankie', 'Gabe', 'Harper', 'Ivy', 'Jesse', 'Kai', 'Luna',
  'Mason', 'Nova', 'Owen', 'Piper', 'Quinn', 'River', 'Sky', 'Tanner',
  'Uma', 'Violet', 'Wyatt', 'Xena', 'Yuri', 'Zara'
];

const LAST_NAMES = [
  'Anderson', 'Brown', 'Carter', 'Davis', 'Evans', 'Foster', 'Garcia', 'Harris',
  'Irwin', 'Johnson', 'King', 'Lewis', 'Miller', 'Nelson', 'Owens', 'Parker',
  'Quinn', 'Roberts', 'Smith', 'Thompson', 'Underwood', 'Valdez', 'Williams',
  'Xavier', 'Young', 'Zimmerman', 'AdAMS', 'Baker', 'Clark', 'Dixon', 'Ellis',
  'Fisher', 'Graham', 'Hill', 'Ingram', 'Jenkins', 'Knight', 'Lane', 'Murphy',
  'Nichols', 'Oliver', 'Phillips', 'Reed', 'Stewart', 'Turner', 'Upton', 'Vargas',
  'Wallace', 'Xanders', 'York', 'Ziegler'
];

// Survivor class
class Survivor {
  constructor(rarity, level = 1) {
    this.rarity = rarity;
    this.level = level;
    this.name = this.generateName();
    this.stats = this.calculateStats();
  }

  generateName() {
    const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    return `${firstName} ${lastName}`;
  }

  calculateStats() {
    const baseStats = RARITIES[this.rarity].baseStats;
    const multiplier = RARITIES[this.rarity].levelUpMultiplier;
    const levelBonus = (this.level - 1) * multiplier;
    
    // Helper function for random number generation (faster than Math.random() * range)
    const getRandomInt = (min, max) => {
      return min + ((max - min + 1) * Math.random()) | 0;
    };

    // Generate random base stats within the rarity's range (optimized)
    const randomBaseStats = {
      attack: getRandomInt(baseStats.attack.min, baseStats.attack.max),
      defense: getRandomInt(baseStats.defense.min, baseStats.defense.max),
      hp: getRandomInt(baseStats.hp.min, baseStats.hp.max),
      luck: getRandomInt(baseStats.luck.min, baseStats.luck.max)
    };

    // Apply level scaling
    return {
      attack: Math.floor(randomBaseStats.attack + (randomBaseStats.attack * levelBonus * 0.1)),
      defense: Math.floor(randomBaseStats.defense + (randomBaseStats.defense * levelBonus * 0.1)),
      hp: Math.floor(randomBaseStats.hp + (randomBaseStats.hp * levelBonus * 0.1)),
      luck: Math.floor(randomBaseStats.luck + (randomBaseStats.luck * levelBonus * 0.05))
    };
  }

  levelUp() {
    this.level++;
    this.stats = this.calculateStats();
  }

  getInfo() {
    return {
      name: this.name,
      rarity: RARITIES[this.rarity].name,
      level: this.level,
      stats: this.stats,
      statRanges: RARITIES[this.rarity].baseStats
    };
  }
}

// Optimized gacha system functions
function getRandomRarity() {
  const rand = Math.random();
  
  // Use precomputed cumulative rates for better performance
  for (let i = 0; i < RARITY_CUM_RATES.length; i++) {
    if (rand <= RARITY_CUM_RATES[i].value) {
      return RARITY_CUM_RATES[i].key;
    }
  }

  return 'COMMON'; // Fallback
}

function pullSurvivor() {
  const rarity = getRandomRarity();
  return new Survivor(rarity);
}

function pullMultipleSurvivors(count) {
  const survivors = [];
  for (let i = 0; i < count; i++) {
    survivors.push(pullSurvivor());
  }
  return survivors;
}

// Utility functions
function getRarityStats(rarity) {
  return RARITIES[rarity];
}

function getAverageStatsForRarity(rarity) {
  const baseStats = RARITIES[rarity].baseStats;
  return {
    attack: Math.floor((baseStats.attack.min + baseStats.attack.max) / 2),
    defense: Math.floor((baseStats.defense.min + baseStats.defense.max) / 2),
    hp: Math.floor((baseStats.hp.min + baseStats.hp.max) / 2),
    luck: Math.floor((baseStats.luck.min + baseStats.luck.max) / 2)
  };
}

function getStatRangesForRarity(rarity) {
  return RARITIES[rarity].baseStats;
}

function getAllRarities() {
  return Object.keys(RARITIES);
}

// Perks system for survivors - buffs tied to specific skills
const PERKS_DATA = {
  // Combat Skills Perks
  fitness: {
    name: "Fitness",
    perks: [
      {
        id: "endurance_boost",
        name: "Endurance Boost",
        description: "Increases HP regeneration rate by 15%",
        buff: { type: "hp_regen", value: 0.15 }
      },
      {
        id: "stamina_master",
        name: "Stamina Master",
        description: "Reduces stamina consumption by 20%",
        buff: { type: "stamina_cost", value: -0.20 }
      },
      {
        id: "vitality_surge",
        name: "Vitality Surge",
        description: "Increases maximum HP by 10%",
        buff: { type: "max_hp", value: 0.10 }
      }
    ]
  },
  defense: {
    name: "Defense",
    perks: [
      {
        id: "armor_expertise",
        name: "Armor Expertise",
        description: "Reduces damage taken by 12%",
        buff: { type: "damage_reduction", value: 0.12 }
      },
      {
        id: "shield_wall",
        name: "Shield Wall",
        description: "Increases defense skill effectiveness by 18%",
        buff: { type: "defense_skill", value: 0.18 }
      },
      {
        id: "resilience",
        name: "Resilience",
        description: "Reduces knockback and stun duration by 25%",
        buff: { type: "stun_reduction", value: 0.25 }
      }
    ]
  },
  melee: {
    name: "Melee",
    perks: [
      {
        id: "blade_mastery",
        name: "Blade Mastery",
        description: "Increases melee attack damage by 15%",
        buff: { type: "melee_damage", value: 0.15 }
      },
      {
        id: "combat_precision",
        name: "Combat Precision",
        description: "Increases critical hit chance by 10%",
        buff: { type: "crit_chance", value: 0.10 }
      },
      {
        id: "close_quarters_specialist",
        name: "Close Quarters Specialist",
        description: "Reduces enemy defense when attacking by 8%",
        buff: { type: "armor_penetration", value: 0.08 }
      }
    ]
  },
  firearms: {
    name: "Firearms",
    perks: [
      {
        id: "marksman",
        name: "Marksman",
        description: "Increases ranged accuracy by 20%",
        buff: { type: "accuracy", value: 0.20 }
      },
      {
        id: "rapid_fire",
        name: "Rapid Fire",
        description: "Reduces reload time by 15%",
        buff: { type: "reload_speed", value: -0.15 }
      },
      {
        id: "bullet_storm",
        name: "Bullet Storm",
        description: "Increases firearm damage by 12%",
        buff: { type: "ranged_damage", value: 0.12 }
      }
    ]
  },
  explosives: {
    name: "Explosives",
    perks: [
      {
        id: "blast_radius",
        name: "Blast Radius",
        description: "Increases explosive area damage by 18%",
        buff: { type: "explosion_radius", value: 0.18 }
      },
      {
        id: "demolition_expert",
        name: "Demolition Expert",
        description: "Reduces explosive crafting time by 20%",
        buff: { type: "crafting_speed", value: -0.20 }
      },
      {
        id: "controlled_detonation",
        name: "Controlled Detonation",
        description: "Increases explosive damage by 15%",
        buff: { type: "explosive_damage", value: 0.15 }
      }
    ]
  },

  // Gathering Skills Perks
  woodcutting: {
    name: "Woodcutting",
    perks: [
      {
        id: "lumberjack",
        name: "Lumberjack",
        description: "Increases wood yield by 20%",
        buff: { type: "resource_yield", value: 0.20 }
      },
      {
        id: "axe_sharpness",
        name: "Axe Sharpness",
        description: "Reduces woodcutting time by 15%",
        buff: { type: "gathering_speed", value: -0.15 }
      },
      {
        id: "tree_feller",
        name: "Tree Feller",
        description: "Increases chance of rare wood drops by 25%",
        buff: { type: "rare_drop_chance", value: 0.25 }
      }
    ]
  },
  mining: {
    name: "Mining",
    perks: [
      {
        id: "ore_finder",
        name: "Ore Finder",
        description: "Increases ore discovery chance by 18%",
        buff: { type: "discovery_chance", value: 0.18 }
      },
      {
        id: "pickaxe_mastery",
        name: "Pickaxe Mastery",
        description: "Reduces mining time by 20%",
        buff: { type: "gathering_speed", value: -0.20 }
      },
      {
        id: "vein_specialist",
        name: "Vein Specialist",
        description: "Increases ore yield from veins by 15%",
        buff: { type: "resource_yield", value: 0.15 }
      }
    ]
  },
  fishing: {
    name: "Fishing",
    perks: [
      {
        id: "angler",
        name: "Angler",
        description: "Increases fish catch rate by 22%",
        buff: { type: "catch_rate", value: 0.22 }
      },
      {
        id: "reel_master",
        name: "Reel Master",
        description: "Reduces fishing time by 18%",
        buff: { type: "gathering_speed", value: -0.18 }
      },
      {
        id: "rare_fish_hunter",
        name: "Rare Fish Hunter",
        description: "Increases chance of catching rare fish by 20%",
        buff: { type: "rare_drop_chance", value: 0.20 }
      }
    ]
  },
  foraging: {
    name: "Foraging",
    perks: [
      {
        id: "nature_scout",
        name: "Nature Scout",
        description: "Increases foraging discovery range by 25%",
        buff: { type: "discovery_range", value: 0.25 }
      },
      {
        id: "herbalist",
        name: "Herbalist",
        description: "Increases herb yield by 18%",
        buff: { type: "resource_yield", value: 0.18 }
      },
      {
        id: "seasoned_forager",
        name: "Seasoned Forager",
        description: "Reduces foraging time by 15%",
        buff: { type: "gathering_speed", value: -0.15 }
      }
    ]
  },
  hunting: {
    name: "Hunting",
    perks: [
      {
        id: "tracker",
        name: "Tracker",
        description: "Increases animal detection range by 20%",
        buff: { type: "detection_range", value: 0.20 }
      },
      {
        id: "marksman_hunter",
        name: "Marksman Hunter",
        description: "Increases hunting accuracy by 18%",
        buff: { type: "accuracy", value: 0.18 }
      },
      {
        id: "big_game_hunter",
        name: "Big Game Hunter",
        description: "Increases chance of rare animal drops by 22%",
        buff: { type: "rare_drop_chance", value: 0.22 }
      }
    ]
  },
  scavenging: {
    name: "Scavenging",
    perks: [
      {
        id: "scavenger",
        name: "Scavenger",
        description: "Increases junk item discovery by 25%",
        buff: { type: "discovery_chance", value: 0.25 }
      },
      {
        id: "rubble_rummager",
        name: "Rubble Rummager",
        description: "Reduces scavenging time by 20%",
        buff: { type: "gathering_speed", value: -0.20 }
      },
      {
        id: "treasure_hunter",
        name: "Treasure Hunter",
        description: "Increases chance of finding valuable items by 15%",
        buff: { type: "valuable_drop_chance", value: 0.15 }
      }
    ]
  },
  looting: {
    name: "Looting",
    perks: [
      {
        id: "burglar",
        name: "Burglar",
        description: "Increases lockpicking success rate by 20%",
        buff: { type: "lockpick_success", value: 0.20 }
      },
      {
        id: "safe_cracker",
        name: "Safe Cracker",
        description: "Reduces time to loot containers by 18%",
        buff: { type: "gathering_speed", value: -0.18 }
      },
      {
        id: "loot_magnet",
        name: "Loot Magnet",
        description: "Increases loot quality from containers by 15%",
        buff: { type: "loot_quality", value: 0.15 }
      }
    ]
  },
  herbalism: {
    name: "Herbalism",
    perks: [
      {
        id: "herb_identification",
        name: "Herb Identification",
        description: "Increases herb identification accuracy by 25%",
        buff: { type: "identification_accuracy", value: 0.25 }
      },
      {
        id: "green_thumb",
        name: "Green Thumb",
        description: "Increases medicinal herb yield by 18%",
        buff: { type: "resource_yield", value: 0.18 }
      },
      {
        id: "apothecary",
        name: "Apothecary",
        description: "Reduces herb processing time by 20%",
        buff: { type: "processing_speed", value: -0.20 }
      }
    ]
  },
  fruit_gathering: {
    name: "Fruit Gathering",
    perks: [
      {
        id: "fruit_picker",
        name: "Fruit Picker",
        description: "Increases fruit harvest yield by 22%",
        buff: { type: "resource_yield", value: 0.22 }
      },
      {
        id: "orchard_expert",
        name: "Orchard Expert",
        description: "Reduces fruit gathering time by 18%",
        buff: { type: "gathering_speed", value: -0.18 }
      },
      {
        id: "seasonal_harvest",
        name: "Seasonal Harvest",
        description: "Increases chance of rare fruit drops by 20%",
        buff: { type: "rare_drop_chance", value: 0.20 }
      }
    ]
  },
  mushroom_hunting: {
    name: "Mushroom Hunting",
    perks: [
      {
        id: "mycologist",
        name: "Mycologist",
        description: "Increases mushroom identification by 25%",
        buff: { type: "identification_accuracy", value: 0.25 }
      },
      {
        id: "fungi_finder",
        name: "Fungi Finder",
        description: "Increases mushroom discovery range by 20%",
        buff: { type: "discovery_range", value: 0.20 }
      },
      {
        id: "spore_specialist",
        name: "Spore Specialist",
        description: "Increases rare mushroom yield by 18%",
        buff: { type: "resource_yield", value: 0.18 }
      }
    ]
  },
  insect_hunting: {
    name: "Insect Hunting",
    perks: [
      {
        id: "bug_catcher",
        name: "Bug Catcher",
        description: "Increases insect catch rate by 22%",
        buff: { type: "catch_rate", value: 0.22 }
      },
      {
        id: "entomologist",
        name: "Entomologist",
        description: "Increases rare insect discovery by 20%",
        buff: { type: "rare_drop_chance", value: 0.20 }
      },
      {
        id: "hive_master",
        name: "Hive Master",
        description: "Reduces insect hunting time by 18%",
        buff: { type: "gathering_speed", value: -0.18 }
      }
    ]
  },

  // Crafting Skills Perks
  cooking: {
    name: "Cooking",
    perks: [
      {
        id: "culinary_master",
        name: "Culinary Master",
        description: "Increases food quality and effects by 18%",
        buff: { type: "craft_quality", value: 0.18 }
      },
      {
        id: "speed_chef",
        name: "Speed Chef",
        description: "Reduces cooking time by 20%",
        buff: { type: "crafting_speed", value: -0.20 }
      },
      {
        id: "flavor_expert",
        name: "Flavor Expert",
        description: "Increases chance of perfect cooking results by 15%",
        buff: { type: "success_chance", value: 0.15 }
      }
    ]
  },
  tinkering: {
    name: "Tinkering",
    perks: [
      {
        id: "gadgeteer",
        name: "Gadgeteer",
        description: "Increases tinker item durability by 20%",
        buff: { type: "durability", value: 0.20 }
      },
      {
        id: "precision_engineer",
        name: "Precision Engineer",
        description: "Reduces tinkering failure rate by 18%",
        buff: { type: "failure_reduction", value: 0.18 }
      },
      {
        id: "innovation_boost",
        name: "Innovation Boost",
        description: "Increases chance of creating superior items by 15%",
        buff: { type: "quality_boost", value: 0.15 }
      }
    ]
  },
  tailoring: {
    name: "Tailoring",
    perks: [
      {
        id: "seamstress",
        name: "Seamstress",
        description: "Increases armor durability from tailoring by 18%",
        buff: { type: "durability", value: 0.18 }
      },
      {
        id: "fabric_specialist",
        name: "Fabric Specialist",
        description: "Reduces tailoring crafting time by 20%",
        buff: { type: "crafting_speed", value: -0.20 }
      },
      {
        id: "style_master",
        name: "Style Master",
        description: "Increases armor stats from tailoring by 15%",
        buff: { type: "stat_boost", value: 0.15 }
      }
    ]
  },
  carpentry: {
    name: "Carpentry",
    perks: [
      {
        id: "wood_worker",
        name: "Wood Worker",
        description: "Increases wooden item durability by 20%",
        buff: { type: "durability", value: 0.20 }
      },
      {
        id: "joinery_expert",
        name: "Joinery Expert",
        description: "Reduces carpentry crafting time by 18%",
        buff: { type: "crafting_speed", value: -0.18 }
      },
      {
        id: "fine_craftsmanship",
        name: "Fine Craftsmanship",
        description: "Increases chance of masterwork wooden items by 15%",
        buff: { type: "masterwork_chance", value: 0.15 }
      }
    ]
  },
  firstaid: {
    name: "First Aid",
    perks: [
      {
        id: "field_medic",
        name: "Field Medic",
        description: "Increases healing effectiveness by 20%",
        buff: { type: "healing_power", value: 0.20 }
      },
      {
        id: "emergency_response",
        name: "Emergency Response",
        description: "Reduces first aid application time by 18%",
        buff: { type: "application_speed", value: -0.18 }
      },
      {
        id: "wound_specialist",
        name: "Wound Specialist",
        description: "Increases chance of preventing infection by 22%",
        buff: { type: "infection_prevention", value: 0.22 }
      }
    ]
  },
  masonry: {
    name: "Masonry",
    perks: [
      {
        id: "stone_mason",
        name: "Stone Mason",
        description: "Increases stone structure durability by 18%",
        buff: { type: "durability", value: 0.18 }
      },
      {
        id: "architect",
        name: "Architect",
        description: "Reduces masonry building time by 20%",
        buff: { type: "crafting_speed", value: -0.20 }
      },
      {
        id: "fortification_expert",
        name: "Fortification Expert",
        description: "Increases defensive bonus of stone structures by 15%",
        buff: { type: "defensive_bonus", value: 0.15 }
      }
    ]
  },
  chemistry: {
    name: "Chemistry",
    perks: [
      {
        id: "alchemist",
        name: "Alchemist",
        description: "Increases potion effectiveness by 18%",
        buff: { type: "effectiveness", value: 0.18 }
      },
      {
        id: "lab_technician",
        name: "Lab Technician",
        description: "Reduces chemical reaction time by 20%",
        buff: { type: "reaction_speed", value: -0.20 }
      },
      {
        id: "compound_specialist",
        name: "Compound Specialist",
        description: "Increases chance of creating superior compounds by 15%",
        buff: { type: "quality_boost", value: 0.15 }
      }
    ]
  },
  electrical: {
    name: "Electrical",
    perks: [
      {
        id: "circuit_specialist",
        name: "Circuit Specialist",
        description: "Increases electrical device efficiency by 18%",
        buff: { type: "efficiency", value: 0.18 }
      },
      {
        id: "wire_technician",
        name: "Wire Technician",
        description: "Reduces electrical repair time by 20%",
        buff: { type: "repair_speed", value: -0.20 }
      },
      {
        id: "power_engineer",
        name: "Power Engineer",
        description: "Increases electrical device durability by 15%",
        buff: { type: "durability", value: 0.15 }
      }
    ]
  },
  gunsmithing: {
    name: "Gunsmithing",
    perks: [
      {
        id: "armorer",
        name: "Armorer",
        description: "Increases firearm durability by 18%",
        buff: { type: "durability", value: 0.18 }
      },
      {
        id: "ballistics_expert",
        name: "Ballistics Expert",
        description: "Increases firearm accuracy by 15%",
        buff: { type: "accuracy", value: 0.15 }
      },
      {
        id: "weaponsmith",
        name: "Weaponsmith",
        description: "Reduces gunsmithing crafting time by 20%",
        buff: { type: "crafting_speed", value: -0.20 }
      }
    ]
  },
  forging: {
    name: "Forging",
    perks: [
      {
        id: "blacksmith",
        name: "Blacksmith",
        description: "Increases metal item durability by 20%",
        buff: { type: "durability", value: 0.20 }
      },
      {
        id: "metal_worker",
        name: "Metal Worker",
        description: "Reduces forging time by 18%",
        buff: { type: "crafting_speed", value: -0.18 }
      },
      {
        id: "tempering_master",
        name: "Tempering Master",
        description: "Increases metal item quality by 15%",
        buff: { type: "quality_boost", value: 0.15 }
      }
    ]
  },

  // Production Skills Perks
  animalcare: {
    name: "Animal Care",
    perks: [
      {
        id: "animal_whisperer",
        name: "Animal Whisperer",
        description: "Increases animal happiness and productivity by 20%",
        buff: { type: "productivity", value: 0.20 }
      },
      {
        id: "veterinarian",
        name: "Veterinarian",
        description: "Reduces animal illness chance by 18%",
        buff: { type: "illness_reduction", value: 0.18 }
      },
      {
        id: "breeding_expert",
        name: "Breeding Expert",
        description: "Increases offspring quality by 15%",
        buff: { type: "breeding_quality", value: 0.15 }
      }
    ]
  },
  farming: {
    name: "Farming",
    perks: [
      {
        id: "green_thumb_farmer",
        name: "Green Thumb Farmer",
        description: "Increases crop yield by 22%",
        buff: { type: "crop_yield", value: 0.22 }
      },
      {
        id: "seasonal_farmer",
        name: "Seasonal Farmer",
        description: "Reduces crop growth time by 18%",
        buff: { type: "growth_speed", value: -0.18 }
      },
      {
        id: "pest_control",
        name: "Pest Control",
        description: "Reduces crop failure chance by 20%",
        buff: { type: "failure_reduction", value: 0.20 }
      }
    ]
  }
};

// Utility functions for perks
function getSkillPerks(skillId) {
  return PERKS_DATA[skillId] ? PERKS_DATA[skillId].perks : [];
}

function getAllSkillsWithPerks() {
  return Object.keys(PERKS_DATA);
}

function getRandomPerkForSkill(skillId) {
  const perks = getSkillPerks(skillId);
  if (perks.length === 0) return null;
  return perks[Math.floor(Math.random() * perks.length)];
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    Survivor,
    RARITIES,
    PERKS_DATA,
    pullSurvivor,
    pullMultipleSurvivors,
    getRarityStats,
    getAverageStatsForRarity,
    getStatRangesForRarity,
    getAllRarities,
    getSkillPerks,
    getAllSkillsWithPerks,
    getRandomPerkForSkill
  };
}

// Make functions globally available for the game
window.pullSurvivor = pullSurvivor;
window.pullMultipleSurvivors = pullMultipleSurvivors;
window.getRarityStats = getRarityStats;
window.getAverageStatsForRarity = getAverageStatsForRarity;
window.getStatRangesForRarity = getStatRangesForRarity;
window.getAllRarities = getAllRarities;
window.getSkillPerks = getSkillPerks;
window.getAllSkillsWithPerks = getAllSkillsWithPerks;
window.getRandomPerkForSkill = getRandomPerkForSkill;
window.RARITIES = RARITIES;
window.PERKS_DATA = PERKS_DATA;

// ======= SURVIVOR RECRUITMENT UI SYSTEM =======
(function initSurvivorRecruitment() {
  // Create a debounce function to prevent multiple rapid clicks
  const debounce = (fn, delay) => {
    let timer;
    return function(...args) {
      if (timer) return;
      timer = setTimeout(() => {
        fn.apply(this, args);
        timer = null;
      }, delay);
    };
  };

  // Define the findSurvivor function first
  function findSurvivorHandler() {
    // Check if survivors system is loaded
    if (!window.pullSurvivor) {
      if (window.showNotification) {
        window.showNotification('Survivor system not loaded yet. Please try again.');
      }
      return;
    }

    // Roll a survivor
    const survivor = window.pullSurvivor();

    // Select a random perk (optimized)
    let randomPerk = null;
    if (window.PERKS_DATA) {
      const allSkills = Object.keys(window.PERKS_DATA);
      const randomSkill = allSkills[(Math.random() * allSkills.length) | 0];
      const perks = window.PERKS_DATA[randomSkill]?.perks;
      if (perks && perks.length) {
        randomPerk = perks[(Math.random() * perks.length) | 0];
      }
    }

    // Show survivor popup
    showSurvivorPopup(survivor, randomPerk);
  }

  // Create debounced version
  const findSurvivor = debounce(findSurvivorHandler, 300);

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    const btnEl = document.querySelector('#homebase-page #findSurvivorBtn');
    if (!btnEl) return;

    btnEl.addEventListener('click', findSurvivor);
  }

  function showSurvivorPopup(survivor, perk) {
    // Create popup overlay
    const overlay = document.createElement('div');
    overlay.className = 'survivor-popup-overlay';

    // Create popup content
    const popup = document.createElement('div');
    popup.className = 'survivor-popup';

    // Rarity color mapping
    const rarityColors = {
      'Common': 'rarity-common',
      'Rare': 'rarity-rare',
      'Epic': 'rarity-epic',
      'Legendary': 'rarity-legendary'
    };

    const rarityClass = rarityColors[survivor.rarity] || 'rarity-common';

    // Use DOM APIs instead of innerHTML for better performance
    const createPopupDOM = () => {
      // Header section
      const header = document.createElement('div');
      header.style.textAlign = 'center';
      header.style.marginBottom = '20px';
      
      const name = document.createElement('h2');
      name.className = rarityClass;
      name.textContent = survivor.name;
      
      const rarityEl = document.createElement('div');
      rarityEl.className = rarityClass;
      rarityEl.style.fontWeight = 'bold';
      rarityEl.style.fontSize = '18px';
      rarityEl.textContent = survivor.rarity;
      
      header.appendChild(name);
      header.appendChild(rarityEl);
      
      // Stats grid
      const statsGrid = document.createElement('div');
      statsGrid.className = 'stats-grid';
      
      const statsData = [
        {icon: '⚔️', label: 'Attack:', value: survivor.stats.attack, className: 'stat-attack'},
        {icon: '🛡️', label: 'Defense:', value: survivor.stats.defense, className: 'stat-defense'},
        {icon: '❤️', label: 'HP:', value: survivor.stats.hp, className: 'stat-hp'},
        {icon: '🍀', label: 'Luck:', value: survivor.stats.luck, className: 'stat-luck'}
      ];
      
      statsData.forEach(stat => {
        const statItem = document.createElement('div');
        statItem.className = `stat-item ${stat.className}`;
        
        const iconSpan = document.createElement('span');
        iconSpan.className = 'stat-icon';
        iconSpan.textContent = stat.icon;
        
        const valueSpan = document.createElement('span');
        valueSpan.textContent = `${stat.label} ${stat.value}`;
        
        statItem.appendChild(iconSpan);
        statItem.appendChild(valueSpan);
        statsGrid.appendChild(statItem);
      });
      
      // Buttons
      const actionButtons = document.createElement('div');
      actionButtons.className = 'action-buttons';
      
      const recruitBtn = document.createElement('button');
      recruitBtn.id = 'recruitBtn';
      recruitBtn.className = 'btn-recruit';
      recruitBtn.textContent = 'Recruit';
      
      const dismissBtn = document.createElement('button');
      dismissBtn.id = 'dismissBtn';
      dismissBtn.className = 'btn-dismiss';
      dismissBtn.textContent = 'Dismiss';
      
      actionButtons.appendChild(recruitBtn);
      actionButtons.appendChild(dismissBtn);
      
      // Build popup
      popup.appendChild(header);
      popup.appendChild(statsGrid);
      
      // Add perk if available
      if (perk) {
        const perkSection = document.createElement('div');
        perkSection.className = 'perk-section';
        
        const perkTitle = document.createElement('h3');
        perkTitle.textContent = 'Perk';
        
        const perkCard = document.createElement('div');
        perkCard.className = 'perk-card';
        
        const perkName = document.createElement('div');
        perkName.className = 'perk-name';
        perkName.textContent = perk.name;
        
        const perkDesc = document.createElement('div');
        perkDesc.className = 'perk-description';
        perkDesc.textContent = perk.description;
        
        perkCard.appendChild(perkName);
        perkCard.appendChild(perkDesc);
        perkSection.appendChild(perkTitle);
        perkSection.appendChild(perkCard);
        
        popup.appendChild(perkSection);
      }
      
      popup.appendChild(actionButtons);
      
      return { recruitBtn, dismissBtn };
    };
    
    // Create DOM elements and get buttons
    createPopupDOM();

    // Add popup to document
    overlay.appendChild(popup);
    document.body.appendChild(overlay);

    // Get button references
    const recruitBtn = document.getElementById('recruitBtn');
    const dismissBtn = document.getElementById('dismissBtn');

    // Use a single event handler for performance
    const handleButtonClick = (action) => {
      return function() {
        if (window.showNotification) {
          window.showNotification(
            action === 'recruit' 
              ? `Recruited ${survivor.name}!` 
              : `Dismissed ${survivor.name}`
          );
        }
        document.body.removeChild(overlay);
      };
    };
    
    recruitBtn.addEventListener('click', handleButtonClick('recruit'));
    dismissBtn.addEventListener('click', handleButtonClick('dismiss'));

    // Close on overlay click (with passive option for better performance)
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        document.body.removeChild(overlay);
      }
    }, { passive: true });
  }

  // Expose the popup function globally for external use
  window.showSurvivorPopup = showSurvivorPopup;
})();
