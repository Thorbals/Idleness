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
