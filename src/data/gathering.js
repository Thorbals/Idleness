export const SKILLS_DATA = {
  gathering_skills: {
    woodcutting: {
      name: "Woodcutting",
      icon: "🪓",
      description: "Cut down trees for wood.",
      category: "gathering",
      nodes: [
        {
          id: "woodcutting_poplar",
          name: "Poplar Tree",
          level: 1,
          xp: 5,
          time: 1000,
          drops: [
            { item: "poplar_log", quantity: 1, chance: 100 },
            { item: "stick", quantity: 1, chance: 50 },
            { item: "poplar_sapling", quantity: 1, chance: 10 },
          ],
        },
        {
          id: "woodcutting_willow",
          name: "Willow Tree",
          level: 5,
          xp: 6,
          time: 1200,
          drops: [
            { item: "willow_log", quantity: 1, chance: 100 },
            { item: "stick", quantity: 1, chance: 50 },
            { item: "willow_sapling", quantity: 1, chance: 10 },
          ],
        },
        {
          id: "woodcutting_cedar",
          name: "Cedar Tree",
          level: 10,
          xp: 7,
          time: 1400,
          drops: [
            { item: "cedar_log", quantity: 1, chance: 100 },
            { item: "stick", quantity: 1, chance: 50 },
            { item: "cedar_sapling", quantity: 1, chance: 10 },
          ],
        },
        {
          id: "woodcutting_spruce",
          name: "Spruce Tree",
          level: 15,
          xp: 8,
          time: 1600,
          drops: [
            { item: "spruce_log", quantity: 1, chance: 100 },
            { item: "stick", quantity: 1, chance: 50 },
            { item: "spruce_sapling", quantity: 1, chance: 10 },
          ],
        },
        {
          id: "woodcutting_pine",
          name: "Pine Tree",
          level: 20,
          xp: 9,
          time: 1800,
          drops: [
            { item: "pine_log", quantity: 1, chance: 100 },
            { item: "stick", quantity: 1, chance: 50 },
            { item: "pine_sapling", quantity: 1, chance: 10 },
          ],
        },
        {
          id: "woodcutting_cherry",
          name: "Cherry Tree",
          level: 25,
          xp: 10,
          time: 2000,
          drops: [
            { item: "cherry_log", quantity: 1, chance: 100 },
            { item: "stick", quantity: 1, chance: 50 },
            { item: "cherry_sapling", quantity: 1, chance: 10 },
          ],
        },
        {
          id: "woodcutting_ash",
          name: "Ash Tree",
          level: 30,
          xp: 12,
          time: 2200,
          drops: [
            { item: "ash_log", quantity: 1, chance: 100 },
            { item: "stick", quantity: 1, chance: 50 },
            { item: "ash_sapling", quantity: 1, chance: 10 },
          ],
        },
        {
          id: "woodcutting_maple",
          name: "Maple Tree",
          level: 35,
          xp: 12,
          time: 2200,
          drops: [
            { item: "maple_log", quantity: 1, chance: 100 },
            { item: "stick", quantity: 1, chance: 50 },
            { item: "maple_sapling", quantity: 1, chance: 10 },
          ],
        },
        {
          id: "woodcutting_oak",
          name: "Oak Tree",
          level: 40,
          xp: 14,
          time: 2400,
          drops: [
            { item: "oak_log", quantity: 1, chance: 100 },
            { item: "stick", quantity: 1, chance: 50 },
            { item: "oak_sapling", quantity: 1, chance: 10 },
          ],
        },
        {
          id: "woodcutting_walnut",
          name: "Walnut Tree",
          level: 45,
          xp: 16,
          time: 2600,
          drops: [
            { item: "walnut_log", quantity: 1, chance: 100 },
            { item: "stick", quantity: 1, chance: 50 },
            { item: "walnut_sapling", quantity: 1, chance: 10 },
          ],
        },
        {
          id: "woodcutting_hickory",
          name: "Hickory Tree",
          level: 50,
          xp: 18,
          time: 2800,
          drops: [
            { item: "hickory_log", quantity: 1, chance: 100 },
            { item: "stick", quantity: 1, chance: 50 },
            { item: "hickory_sapling", quantity: 1, chance: 10 },
          ],
        },
        {
          id: "woodcutting_redwood",
          name: "Redwood Tree",
          level: 55,
          xp: 20,
          time: 3000,
          drops: [
            { item: "redwood_log", quantity: 1, chance: 100 },
            { item: "stick", quantity: 1, chance: 50 },
            { item: "redwood_sapling", quantity: 1, chance: 10 },
          ],
        },
        {
          id: "woodcutting_mahogany",
          name: "Mahogany Tree",
          level: 60,
          xp: 22,
          time: 3200,
          drops: [
            { item: "mahogany_log", quantity: 1, chance: 100 },
            { item: "stick", quantity: 1, chance: 50 },
            { item: "mahogany_sapling", quantity: 1, chance: 10 },
          ],
        },
        {
          id: "woodcutting_yew",
          name: "Yew Tree",
          level: 65,
          xp: 24,
          time: 3400,
          drops: [
            { item: "yew_log", quantity: 1, chance: 100 },
            { item: "stick", quantity: 1, chance: 50 },
            { item: "yew_sapling", quantity: 1, chance: 10 },
          ],
        },
        {
          id: "woodcutting_teak",
          name: "Teak Tree",
          level: 70,
          xp: 26,
          time: 3600,
          drops: [
            { item: "teak_log", quantity: 1, chance: 100 },
            { item: "stick", quantity: 1, chance: 50 },
            { item: "teak_sapling", quantity: 1, chance: 10 },
          ],
        },
      ],
    },
    mining: {
      name: "Mining",
      icon: "⛏️",
      description: "Mine ore from rocks.",
      category: "gathering",
      nodes: [
        {
          id: "mining_copper",
          name: "Copper Vein",
          level: 1,
          xp: 5,
          time: 1000,
          drops: [
            { item: "copper_ore", quantity: 1, chance: 100 },
            { item: "stone", quantity: 1, chance: 50 },
          ],
        },
        {
          id: "mining_lead",
          name: "Lead Vein",
          level: 6,
          xp: 6,
          time: 1200,
          drops: [
            { item: "lead_ore", quantity: 1, chance: 100 },
            { item: "stone", quantity: 1, chance: 50 },
          ],
        },
        {
          id: "mining_zinc",
          name: "Zinc Vein",
          level: 10,
          xp: 7,
          time: 1400,
          drops: [
            { item: "zinc_ore", quantity: 1, chance: 100 },
            { item: "stone", quantity: 1, chance: 50 },
          ],
        },
        {
          id: "mining_silver",
          name: "Silver Vein",
          level: 15,
          xp: 8,
          time: 1600,
          drops: [
            { item: "silver_ore", quantity: 1, chance: 100 },
            { item: "stone", quantity: 1, chance: 50 },
          ],
        },
        {
          id: "mining_tin",
          name: "Tin Vein",
          level: 20,
          xp: 9,
          time: 1800,
          drops: [
            { item: "tin_ore", quantity: 1, chance: 100 },
            { item: "stone", quantity: 1, chance: 50 },
          ],
        },
        {
          id: "mining_iron",
          name: "Iron Vein",
          level: 30,
          xp: 12,
          time: 2200,
          drops: [
            { item: "iron_ore", quantity: 1, chance: 100 },
            { item: "stone", quantity: 1, chance: 50 },
          ],
        },
        {
          id: "mining_gold",
          name: "Gold Vein",
          level: 40,
          xp: 16,
          time: 2600,
          drops: [
            { item: "gold_ore", quantity: 1, chance: 100 },
            { item: "stone", quantity: 1, chance: 50 },
          ],
        },
        {
          id: "mining_tungsten",
          name: "Tungsten Vein",
          level: 55,
          xp: 20,
          time: 3000,
          drops: [
            { item: "tungsten_ore", quantity: 1, chance: 100 },
            { item: "stone", quantity: 1, chance: 50 },
          ],
        },
        {
          id: "mining_palladium",
          name: "Palladium Vein",
          level: 60,
          xp: 22,
          time: 3200,
          drops: [
            { item: "palladium_ore", quantity: 1, chance: 100 },
            { item: "stone", quantity: 1, chance: 50 },
          ],
        },
        {
          id: "mining_titanium",
          name: "Titanium Vein",
          level: 65,
          xp: 24,
          time: 3400,
          drops: [
            { item: "titanium_ore", quantity: 1, chance: 100 },
            { item: "stone", quantity: 1, chance: 50 },
          ],
        },
        {
          id: "mining_iridium",
          name: "Iridium Vein",
          level: 70,
          xp: 26,
          time: 3600,
          drops: [
            { item: "iridium_ore", quantity: 1, chance: 100 },
            { item: "stone", quantity: 1, chance: 50 },
          ],
        },
        {
          id: "mining_meteorite",
          name: "Meteorite Vein",
          level: 75,
          xp: 28,
          time: 3800,
          drops: [
            { item: "meteorite_ore", quantity: 1, chance: 100 },
            { item: "stone", quantity: 1, chance: 50 },
          ],
        },
      ],
    },
    fishing: {
      name: "Fishing",
      icon: "🎣",
      description: "Catch fish from water.",
      category: "gathering",
      nodes: [
        {
          id: "fishing_small_fish",
          name: "Small Fish",
          level: 1,
          xp: 5,
          time: 1000,
          drops: [
            { item: "small_fillet", quantity: 1, chance: 100 },
            { item: "fish_oil", quantity: 1, chance: 20 },
          ],
        },
        {
          id: "fishing_medium_fish",
          name: "Medium Fish",
          level: 10,
          xp: 8,
          time: 1600,
          drops: [
            { item: "medium_fillet", quantity: 1, chance: 100 },
            { item: "fish_oil", quantity: 1, chance: 30 },
          ],
        },
        {
          id: "fishing_large_fish",
          name: "Large Fish",
          level: 20,
          xp: 12,
          time: 2200,
          drops: [
            { item: "large_fillet", quantity: 1, chance: 100 },
            { item: "fish_oil", quantity: 1, chance: 40 },
          ],
        },
        {
          id: "fishing_tropical_fish",
          name: "Tropical Fish",
          level: 30,
          xp: 16,
          time: 2800,
          drops: [
            { item: "tropical_fillet", quantity: 1, chance: 100 },
            { item: "fish_oil", quantity: 1, chance: 50 },
          ],
        },
        {
          id: "fishing_exotic_fish",
          name: "Exotic Fish",
          level: 40,
          xp: 20,
          time: 3400,
          drops: [
            { item: "exotic_fillet", quantity: 1, chance: 100 },
            { item: "fish_oil", quantity: 1, chance: 60 },
          ],
        },
        {
          id: "fishing_legendary_fish",
          name: "Legendary Fish",
          level: 50,
          xp: 24,
          time: 4000,
          drops: [
            { item: "legendary_fillet", quantity: 1, chance: 100 },
            { item: "fish_oil", quantity: 1, chance: 70 },
          ],
        },
      ],
    },
    foraging: {
      name: "Foraging",
      icon: "🌿",
      description: "Gather plants and herbs.",
      category: "gathering",
      nodes: [
        {
          id: "foraging_cotton",
          name: "Cotton Plant",
          level: 1,
          xp: 5,
          time: 1000,
          drops: [
            { item: "cotton", quantity: 1, chance: 100 },
            { item: "cotton_seed", quantity: 1, chance: 20 },
          ],
        },
        {
          id: "foraging_jute",
          name: "Jute Plant",
          level: 9,
          xp: 5,
          time: 1000,
          drops: [
            { item: "jute", quantity: 1, chance: 100 },
            { item: "jute_seed", quantity: 1, chance: 20 },
          ],
        },
        {
          id: "foraging_flax",
          name: "Flax Plant",
          level: 32,
          xp: 14,
          time: 2400,
          drops: [
            { item: "flax", quantity: 1, chance: 100 },
            { item: "flax_seed", quantity: 1, chance: 20 },
          ],
        },
        {
          id: "foraging_ramie",
          name: "Ramie Plant",
          level: 40,
          xp: 16,
          time: 2800,
          drops: [
            { item: "ramie", quantity: 1, chance: 100 },
            { item: "ramie_seed", quantity: 1, chance: 20 },
          ],
        },
        {
          id: "foraging_wool",
          name: "Wool Plant",
          level: 50,
          xp: 18,
          time: 3200,
          drops: [
            { item: "wool", quantity: 1, chance: 100 },
            { item: "wool_seed", quantity: 1, chance: 20 },
          ],
        },
        {
          id: "foraging_raw_silk",
          name: "Silk Worm Cocoon",
          level: 64,
          xp: 26,
          time: 4000,
          drops: [
            { item: "raw_silk", quantity: 1, chance: 100 },
            { item: "silk_worm", quantity: 1, chance: 20 },
          ],
        },
      ],
    },
    hunting: {
      name: "Hunting",
      icon: "🏹",
      description: "Hunt animals for meat and hides.",
      category: "gathering",
      nodes: [
        {
          id: "hunting_small_game",
          name: "Small Game",
          level: 1,
          xp: 5,
          time: 1000,
          drops: [
            { item: "small_game_meat", quantity: 1, chance: 100 },
            { item: "small_hide", quantity: 1, chance: 80 },
            { item: "feathers", quantity: 1, chance: 50 },
          ],
        },
        {
          id: "hunting_medium_game",
          name: "Medium Game",
          level: 15,
          xp: 10,
          time: 1800,
          drops: [
            { item: "medium_game_meat", quantity: 1, chance: 100 },
            { item: "medium_hide", quantity: 1, chance: 80 },
            { item: "feathers", quantity: 1, chance: 50 },
          ],
        },
        {
          id: "hunting_large_game",
          name: "Large Game",
          level: 30,
          xp: 15,
          time: 2600,
          drops: [
            { item: "large_game_meat", quantity: 1, chance: 100 },
            { item: "large_hide", quantity: 1, chance: 80 },
            { item: "feathers", quantity: 1, chance: 50 },
          ],
        },
        {
          id: "hunting_poultry",
          name: "Poultry",
          level: 5,
          xp: 6,
          time: 1200,
          drops: [
            { item: "poultry", quantity: 1, chance: 100 },
            { item: "feathers", quantity: 1, chance: 60 },
          ],
        },
        {
          id: "hunting_mutton",
          name: "Sheep",
          level: 25,
          xp: 12,
          time: 2200,
          drops: [
            { item: "mutton", quantity: 1, chance: 100 },
            { item: "wool", quantity: 1, chance: 70 },
          ],
        },
        {
          id: "hunting_beef",
          name: "Cow",
          level: 35,
          xp: 16,
          time: 2800,
          drops: [
            { item: "beef", quantity: 1, chance: 100 },
            { item: "leather", quantity: 1, chance: 80 },
          ],
        },
        {
          id: "hunting_pork",
          name: "Pig",
          level: 45,
          xp: 18,
          time: 3200,
          drops: [
            { item: "pork", quantity: 1, chance: 100 },
            { item: "leather", quantity: 1, chance: 80 },
          ],
        },
      ],
    },
    scavenging: {
      name: "Scavenging",
      icon: "🔍",
      description: "Search for useful junk.",
      category: "gathering",
      nodes: [
        {
          id: "scavenging_junk_pile",
          name: "Junk Pile",
          level: 1,
          xp: 4,
          time: 800,
          drops: [
            { item: "scrap_metal", quantity: 1, chance: 30 },
            { item: "scrap_plastic", quantity: 1, chance: 30 },
            { item: "scrap_wood", quantity: 1, chance: 30 },
            { item: "scrap_cloth", quantity: 1, chance: 30 },
          ],
        },
        {
          id: "scavenging_abandoned_vehicle",
          name: "Abandoned Vehicle",
          level: 10,
          xp: 8,
          time: 1600,
          drops: [
            { item: "scrap_metal", quantity: 2, chance: 50 },
            { item: "scrap_plastic", quantity: 1, chance: 40 },
            { item: "scrap_wood", quantity: 1, chance: 30 },
            { item: "scrap_cloth", quantity: 1, chance: 30 },
          ],
        },
        {
          id: "scavenging_ruins",
          name: "Ruins",
          level: 20,
          xp: 12,
          time: 2400,
          drops: [
            { item: "scrap_metal", quantity: 3, chance: 60 },
            { item: "scrap_plastic", quantity: 2, chance: 50 },
            { item: "scrap_wood", quantity: 2, chance: 40 },
            { item: "scrap_cloth", quantity: 2, chance: 40 },
          ],
        },
        {
          id: "scavenging_military_debris",
          name: "Military Debris",
          level: 30,
          xp: 16,
          time: 3200,
          drops: [
            { item: "scrap_metal", quantity: 4, chance: 70 },
            { item: "scrap_plastic", quantity: 3, chance: 60 },
            { item: "scrap_wood", quantity: 3, chance: 50 },
            { item: "scrap_cloth", quantity: 3, chance: 50 },
          ],
        },
        {
          id: "scavenging_high_tech_wreckage",
          name: "High-Tech Wreckage",
          level: 40,
          xp: 20,
          time: 4000,
          drops: [
            { item: "scrap_metal", quantity: 5, chance: 80 },
            { item: "scrap_plastic", quantity: 4, chance: 70 },
            { item: "scrap_wood", quantity: 4, chance: 60 },
            { item: "scrap_cloth", quantity: 4, chance: 60 },
          ],
        },
      ],
    },
    looting: {
      name: "Looting",
      icon: "💰",
      description: "Search containers for valuables.",
      category: "gathering",
      nodes: [
        {
          id: "looting_trash_can",
          name: "Trash Can",
          level: 1,
          xp: 4,
          time: 800,
          drops: [
            { item: "scrap_metal", quantity: 1, chance: 20 },
            { item: "scrap_plastic", quantity: 1, chance: 20 },
            { item: "scrap_wood", quantity: 1, chance: 20 },
            { item: "scrap_cloth", quantity: 1, chance: 20 },
          ],
        },
        {
          id: "looting_abandoned_house",
          name: "Abandoned House",
          level: 10,
          xp: 8,
          time: 1600,
          drops: [
            { item: "scrap_metal", quantity: 2, chance: 30 },
            { item: "scrap_plastic", quantity: 1, chance: 25 },
            { item: "scrap_wood", quantity: 1, chance: 25 },
            { item: "scrap_cloth", quantity: 1, chance: 25 },
          ],
        },
        {
          id: "looting_office_building",
          name: "Office Building",
          level: 20,
          xp: 12,
          time: 2400,
          drops: [
            { item: "scrap_metal", quantity: 3, chance: 40 },
            { item: "scrap_plastic", quantity: 2, chance: 35 },
            { item: "scrap_wood", quantity: 2, chance: 35 },
            { item: "scrap_cloth", quantity: 2, chance: 35 },
          ],
        },
        {
          id: "looting_military_base",
          name: "Military Base",
          level: 30,
          xp: 16,
          time: 3200,
          drops: [
            { item: "scrap_metal", quantity: 4, chance: 50 },
            { item: "scrap_plastic", quantity: 3, chance: 45 },
            { item: "scrap_wood", quantity: 3, chance: 45 },
            { item: "scrap_cloth", quantity: 3, chance: 45 },
          ],
        },
        {
          id: "looting_high_security_facility",
          name: "High-Security Facility",
          level: 40,
          xp: 20,
          time: 4000,
          drops: [
            { item: "scrap_metal", quantity: 5, chance: 60 },
            { item: "scrap_plastic", quantity: 4, chance: 55 },
            { item: "scrap_wood", quantity: 4, chance: 55 },
            { item: "scrap_cloth", quantity: 4, chance: 55 },
          ],
        },
      ],
    },
  },
  BONUS_GATHERING_SKILLS: {
    herbalism: {
      name: "Herbalism",
      icon: "🌱",
      description: "Gather medicinal herbs.",
      category: "gathering",
      nodes: [
        {
          id: "herbalism_mint",
          name: "Mint Plant",
          level: 4,
          xp: 6,
          time: 1200,
          drops: [
            { item: "mint", quantity: 1, chance: 100 },
            { item: "mint_seed", quantity: 1, chance: 20 },
          ],
        },
        {
          id: "herbalism_chamomile",
          name: "Chamomile Plant",
          level: 5,
          xp: 6,
          time: 1200,
          drops: [
            { item: "chamomile", quantity: 1, chance: 100 },
            { item: "chamomile_seed", quantity: 1, chance: 20 },
          ],
        },
        {
          id: "herbalism_yarrow",
          name: "Yarrow Plant",
          level: 17,
          xp: 10,
          time: 2000,
          drops: [
            { item: "yarrow", quantity: 1, chance: 100 },
            { item: "yarrow_seed", quantity: 1, chance: 20 },
          ],
        },
        {
          id: "herbalism_aloe",
          name: "Aloe Plant",
          level: 26,
          xp: 13,
          time: 2400,
          drops: [
            { item: "aloe", quantity: 1, chance: 100 },
            { item: "aloe_seed", quantity: 1, chance: 20 },
          ],
        },
        {
          id: "herbalism_stinging_nettle",
          name: "Stinging Nettle",
          level: 29,
          xp: 14,
          time: 2600,
          drops: [
            { item: "stinging_nettle", quantity: 1, chance: 100 },
            { item: "nettle_seed", quantity: 1, chance: 20 },
          ],
        },
        {
          id: "herbalism_echinacea",
          name: "Echinacea Plant",
          level: 41,
          xp: 18,
          time: 3200,
          drops: [
            { item: "echinacea", quantity: 1, chance: 100 },
            { item: "echinacea_seed", quantity: 1, chance: 20 },
          ],
        },
        {
          id: "herbalism_st_johns_wort",
          name: "St. John's Wort",
          level: 46,
          xp: 19,
          time: 3400,
          drops: [
            { item: "st_johns_wort", quantity: 1, chance: 100 },
            { item: "st_johns_wort_seed", quantity: 1, chance: 20 },
          ],
        },
        {
          id: "herbalism_ginger",
          name: "Ginger Plant",
          level: 19,
          xp: 11,
          time: 2000,
          drops: [
            { item: "ginger", quantity: 1, chance: 100 },
            { item: "ginger_root", quantity: 1, chance: 20 },
          ],
        },
        {
          id: "herbalism_turmeric",
          name: "Turmeric Plant",
          level: 31,
          xp: 15,
          time: 2800,
          drops: [
            { item: "turmeric", quantity: 1, chance: 100 },
            { item: "turmeric_root", quantity: 1, chance: 20 },
          ],
        },
        {
          id: "herbalism_beeswax",
          name: "Beehive",
          level: 23,
          xp: 12,
          time: 2200,
          drops: [
            { item: "beeswax", quantity: 1, chance: 100 },
            { item: "honey", quantity: 1, chance: 30 },
          ],
        },
        {
          id: "herbalism_royal_jelly",
          name: "Royal Beehive",
          level: 47,
          xp: 20,
          time: 3600,
          drops: [
            { item: "royal_jelly", quantity: 1, chance: 100 },
            { item: "honey", quantity: 1, chance: 40 },
          ],
        },
      ],
    },
    fruit_gathering: {
      name: "Fruit Gathering",
      icon: "🍎",
      description: "Pick fruits from trees and plants.",
      category: "gathering",
      nodes: [
        {
          id: "fruit_gathering_apple",
          name: "Apple Tree",
          level: 6,
          xp: 6,
          time: 1200,
          drops: [
            { item: "apple", quantity: 1, chance: 100 },
            { item: "apple_seed", quantity: 1, chance: 20 },
          ],
        },
        {
          id: "fruit_gathering_pear",
          name: "Pear Tree",
          level: 11,
          xp: 7,
          time: 1400,
          drops: [
            { item: "pear", quantity: 1, chance: 100 },
            { item: "pear_seed", quantity: 1, chance: 20 },
          ],
        },
        {
          id: "fruit_gathering_strawberry",
          name: "Strawberry Bush",
          level: 14,
          xp: 8,
          time: 1600,
          drops: [
            { item: "strawberry", quantity: 1, chance: 100 },
            { item: "strawberry_seed", quantity: 1, chance: 20 },
          ],
        },
        {
          id: "fruit_gathering_cherry",
          name: "Cherry Tree",
          level: 16,
          xp: 9,
          time: 1800,
          drops: [
            { item: "cherry", quantity: 1, chance: 100 },
            { item: "cherry_seed", quantity: 1, chance: 20 },
          ],
        },
        {
          id: "fruit_gathering_peach",
          name: "Peach Tree",
          level: 21,
          xp: 11,
          time: 2200,
          drops: [
            { item: "peach", quantity: 1, chance: 100 },
            { item: "peach_seed", quantity: 1, chance: 20 },
          ],
        },
        {
          id: "fruit_gathering_plum",
          name: "Plum Tree",
          level: 24,
          xp: 12,
          time: 2400,
          drops: [
            { item: "plum", quantity: 1, chance: 100 },
            { item: "plum_seed", quantity: 1, chance: 20 },
          ],
        },
        {
          id: "fruit_gathering_fig",
          name: "Fig Tree",
          level: 27,
          xp: 13,
          time: 2600,
          drops: [
            { item: "fig", quantity: 1, chance: 100 },
            { item: "fig_seed", quantity: 1, chance: 20 },
          ],
        },
        {
          id: "fruit_gathering_apricot",
          name: "Apricot Tree",
          level: 33,
          xp: 15,
          time: 3000,
          drops: [
            { item: "apricot", quantity: 1, chance: 100 },
            { item: "apricot_seed", quantity: 1, chance: 20 },
          ],
        },
        {
          id: "fruit_gathering_mango",
          name: "Mango Tree",
          level: 36,
          xp: 16,
          time: 3200,
          drops: [
            { item: "mango", quantity: 1, chance: 100 },
            { item: "mango_seed", quantity: 1, chance: 20 },
          ],
        },
        {
          id: "fruit_gathering_loquat",
          name: "Loquat Tree",
          level: 39,
          xp: 17,
          time: 3400,
          drops: [
            { item: "loquat", quantity: 1, chance: 100 },
            { item: "loquat_seed", quantity: 1, chance: 20 },
          ],
        },
        {
          id: "fruit_gathering_lemon",
          name: "Lemon Tree",
          level: 42,
          xp: 18,
          time: 3600,
          drops: [
            { item: "lemon", quantity: 1, chance: 100 },
            { item: "lemon_seed", quantity: 1, chance: 20 },
          ],
        },
        {
          id: "fruit_gathering_olive",
          name: "Olive Tree",
          level: 44,
          xp: 18,
          time: 3600,
          drops: [
            { item: "olive", quantity: 1, chance: 100 },
            { item: "olive_seed", quantity: 1, chance: 20 },
          ],
        },
        {
          id: "fruit_gathering_coffee_beans",
          name: "Coffee Plant",
          level: 28,
          xp: 14,
          time: 2800,
          drops: [
            { item: "coffee_beans", quantity: 1, chance: 100 },
            { item: "coffee_seed", quantity: 1, chance: 20 },
          ],
        },
      ],
    },
    mushroom_hunting: {
      name: "Mushroom Hunting",
      icon: "🍄",
      description: "Find edible mushrooms.",
      category: "gathering",
      nodes: [
        {
          id: "mushroom_hunting_chanterelle",
          name: "Chanterelle Mushrooms",
          level: 7,
          xp: 7,
          time: 1400,
          drops: [
            { item: "chanterelle_mushroom", quantity: 1, chance: 100 },
            { item: "chanterelle_spore", quantity: 1, chance: 20 },
          ],
        },
        {
          id: "mushroom_hunting_morel",
          name: "Morel Mushrooms",
          level: 8,
          xp: 7,
          time: 1400,
          drops: [
            { item: "morel_mushroom", quantity: 1, chance: 100 },
            { item: "morel_spore", quantity: 1, chance: 20 },
          ],
        },
        {
          id: "mushroom_hunting_oyster",
          name: "Oyster Mushrooms",
          level: 9,
          xp: 7,
          time: 1400,
          drops: [
            { item: "oyster_mushroom", quantity: 1, chance: 100 },
            { item: "oyster_spore", quantity: 1, chance: 20 },
          ],
        },
        {
          id: "mushroom_hunting_portobello",
          name: "Portobello Mushrooms",
          level: 10,
          xp: 8,
          time: 1600,
          drops: [
            { item: "portobello_mushroom", quantity: 1, chance: 100 },
            { item: "portobello_spore", quantity: 1, chance: 20 },
          ],
        },
      ],
    },
    insect_hunting: {
      name: "Insect Hunting",
      icon: "🐛",
      description: "Catch insects for various uses.",
      category: "gathering",
      nodes: [
        {
          id: "insect_hunting_bees",
          name: "Bee Swarm",
          level: 22,
          xp: 12,
          time: 2200,
          drops: [
            { item: "beeswax", quantity: 1, chance: 100 },
            { item: "honey", quantity: 1, chance: 30 },
          ],
        },
        {
          id: "insect_hunting_silk_worms",
          name: "Silk Worm Colony",
          level: 63,
          xp: 25,
          time: 3800,
          drops: [
            { item: "raw_silk", quantity: 1, chance: 100 },
            { item: "silk_worm", quantity: 1, chance: 20 },
          ],
        },
      ],
    },
  },
};

export default { SKILLS_DATA };

// Gathering functions from monolith script #3
function renderGatheringResources(area) {
  const container = document.getElementById("gathering-resources");
  container.innerHTML = "";

  if (!area.gathering) {
    const noResourcesDiv = document.createElement("div");
    noResourcesDiv.style.cssText = "color: #8b949e; text-align: center; padding: 20px;";
    noResourcesDiv.textContent = "No gathering resources available in this area.";
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

      const resource = skill.nodes.find(node => node.id === resourceId);
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
      card.className = `resource-card ${diffClass} ${canGather ? "" : "locked"}`;
      card.dataset.resourceId = resource.id;
      card.dataset.skill = skillType;

      let dropsHtml = '';
      if (showDropPercentages && resource.drops) {
        dropsHtml = '<div style="margin-top: 8px; border-top: 1px solid #555; padding-top: 5px;">';
        resource.drops.forEach(drop => {
          if (drop.rarity) {
            const dropChance = calculateRarityChance(drop.rarity, playerLevel, resource.level);
            const rarityColor = getRarityColor(drop.rarity);
            const itemName = getItemName(drop.item);
            dropsHtml += `
                <div style="display: flex; justify-content: space-between; align-items: center; margin: 2px 0; font-size: 11px;">
                  <span style="color: #bbb; cursor: help;" data-item-tooltip="${drop.item}">${itemName}</span>
                  <span style="color: ${rarityColor}; font-weight: bold; cursor: help;" title="${drop.rarity.charAt(0).toUpperCase() + drop.rarity.slice(1)}: ${(dropChance * 100).toFixed(1)}% chance (Level diff: ${playerLevel - resource.level})">${(dropChance * 100).toFixed(1)}%</span>
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
        dropsHtml += '</div>';
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
  startGatheringAction(resource.id, skillType);
}

function startGatheringAction(resourceId, skillType) {
  const area = gameState.currentArea;
  if (!area || !area.gathering[skillType]) return;

  const skill = gameData.skills.gathering_skills[skillType];
  if (!skill || !skill.nodes) return;

  const resource = skill.nodes.find(node => node.id === resourceId);
  if (!resource) return;

  if (resource.consumes) {
    for (const consume of resource.consumes) {
      const available = gameState.bank[consume.item] || 0;
      if (available < consume.quantity) {
        const itemName = getItemName(consume.item);
        addGatheringLog(`Need ${consume.quantity} ${itemName} to perform this action`, "log-error");
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
  const gatheringProgressFill = document.getElementById("gathering-progress-fill");
  if (gatheringProgressFill) {
    gatheringProgressFill.style.width = "0%";
  }
}

function createGatheringProgressBox(resourceName) {
  const progressContainer = document.getElementById("gathering-progress-container");
  if (!progressContainer) return;

  progressContainer.innerHTML = `
    <div id="gathering-progress-box">
      <div>Gathering ${resourceName}</div>
      <div class="progress-bar">
        <div id="gathering-progress-fill" class="progress-fill" style="width: 0%;"></div>
      </div>
      <button id="stop-gathering-btn">Stop</button>
    </div>
  `;

  document.getElementById("stop-gathering-btn").addEventListener("click", () => {
    stopGathering("Stopped by user");
  });

  showGatheringProgress();
}

function removeGatheringProgressBox() {
  const progressContainer = document.getElementById("gathering-progress-container");
  if (progressContainer) {
    progressContainer.innerHTML = "";
  }
}

function showGatheringProgress() {
  const progressBox = document.getElementById("gathering-progress-box");
  if (progressBox) {
    progressBox.style.display = "block";
  }
}

function hideGatheringProgress() {
  const progressBox = document.getElementById("gathering-progress-box");
  if (progressBox) {
    progressBox.style.display = "none";
  }
}

function stopGathering(reason = "") {
  if (gameState.currentAction && gameState.currentAction.type === "gathering") {
    gameState.currentAction = null;
    currentSkill = null;
    resetGatheringProgress();
    hideGatheringProgress();
    removeGatheringProgressBox();
    document
      .querySelectorAll(".resource-card")
      .forEach((c) => c.classList.remove("active"));
    addGatheringLog(`Gathering stopped${reason ? ": " + reason : ""}`);
  }
}

function addGatheringLog(message, className = "") {
  const logContainer = document.getElementById("gathering-log");
  if (!logContainer) return;

  const logEntry = document.createElement("div");
  logEntry.className = `log-entry ${className}`;
  logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;

  logContainer.appendChild(logEntry);
  logContainer.scrollTop = logContainer.scrollHeight;

  // Limit log entries
  while (logContainer.children.length > 100) {
    logContainer.removeChild(logContainer.firstChild);
  }
}

function showSkillGatheringPage(skill) {
  const gatheringResources = document.getElementById("gathering-resources");
  gatheringResources.innerHTML = "";

  if (!skill.nodes) {
    gatheringResources.innerHTML = "<div style='text-align: center; color: #8b949e; padding: 20px;'>No resources available for this skill.</div>";
    return;
  }

  skill.nodes.forEach((resource) => {
    const requiredLevel = resource.level;
    const playerSkill = gameState.skills[skill.id];
    const playerLevel = playerSkill ? playerSkill.level : 0;
    const canGather = playerLevel >= requiredLevel;

    const card = document.createElement("div");
    const diffClass = getNodeDifficultyClass(playerLevel, requiredLevel);
    card.className = `resource-card ${diffClass} ${canGather ? "" : "locked"}`;

    let dropsHtml = '';
    if (showDropPercentages && resource.drops) {
      dropsHtml = '<div style="margin-top: 8px; border-top: 1px solid #555; padding-top: 5px;">';
      resource.drops.forEach(drop => {
        if (drop.rarity) {
          const dropChance = calculateRarityChance(drop.rarity, playerLevel, resource.level);
          const rarityColor = getRarityColor(drop.rarity);
          const itemName = getItemName(drop.item);
          dropsHtml += `
              <div style="display: flex; justify-content: space-between; align-items: center; margin: 2px 0; font-size: 11px;">
                <span style="color: #bbb; cursor: help;" data-item-tooltip="${drop.item}">${itemName}</span>
                <span style="color: ${rarityColor}; font-weight: bold; cursor: help;" title="${drop.rarity.charAt(0).toUpperCase() + drop.rarity.slice(1)}: ${(dropChance * 100).toFixed(1)}% chance (Level diff: ${playerLevel - resource.level})">${(dropChance * 100).toFixed(1)}%</span>
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
      dropsHtml += '</div>';
    }

    card.innerHTML = `
              <h4>${resource.name}</h4>
              <div>Level ${requiredLevel} ${skill.name}</div>
              <div>${resource.xp} XP</div>
              <div>${(resource.time / 1000).toFixed(1)}s per action</div>
              ${dropsHtml}
    `;

    gatheringResources.appendChild(card);
  });
}

function getGatheringBonusChance(skill, playerLevel) {
  const baseChance = 0.01; // 1% base chance
  const levelBonus = Math.min(playerLevel * 0.005, 0.1); // Up to 10% from level
  const skillBonus = skill.level * 0.002; // 0.2% per skill level
  return baseChance + levelBonus + skillBonus;
}

// Expose to window for legacy compatibility
window.renderGatheringResources = renderGatheringResources;
window.selectResource = selectResource;
window.startGatheringAction = startGatheringAction;
window.resetGatheringProgress = resetGatheringProgress;
window.createGatheringProgressBox = createGatheringProgressBox;
window.removeGatheringProgressBox = removeGatheringProgressBox;
window.showGatheringProgress = showGatheringProgress;
window.hideGatheringProgress = hideGatheringProgress;
window.stopGathering = stopGathering;
window.addGatheringLog = addGatheringLog;
window.showSkillGatheringPage = showSkillGatheringPage;
window.getGatheringBonusChance = getGatheringBonusChance;
