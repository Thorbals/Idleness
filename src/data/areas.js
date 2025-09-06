// Auto-extracted data module
export const AREAS_DATA = {
      areas: [

        {
          id: "sunken_meadow",
          name: "Sunken Meadow",
          level: 1,
          factions: ["Zombies", "Scavengers"],
          description: "War zone: Zombies & Scavengers.",
          gathering: {
            woodcutting: ["wood_poplar_tree"],
            mining: ["mining_coal_deposit"],
            fishing: ["fish_bluegill"],
            foraging: ["forage_wild_cotton_bush"],
            hunting: ["hunt_gray_squirrel"],
            looting: ["loot_central_high_gymnasium"],
            scavenging: ["scav_dollar_depot"]
          },
          dungeons: [
            {
              id: "warfront_sunken_meadow",
              name: "Warfront",
              level: 1,
              enemies: [
                { factionId: "zombies", enemyId: "shambler", level: 1 },
                { factionId: "zombies", enemyId: "groaner", level: 2 },
                { factionId: "scavengers", enemyId: "the_scrounger", level: 1 },
                { factionId: "scavengers", enemyId: "ash_sifter", level: 2 },
                { factionId: "scavengers", enemyId: "the_junk_king", level: 2, boss: true }
              ]
            }
          ]
        },
        {
          id: "hollow_creek",
          name: "Hollow Creek",
          level: 4,
          factions: ["Cannibals", "Bandits", "Zombies"],
          description: "War zone: Cannibals, Bandits & Zombies.",
          gathering: {
            woodcutting: [],
            mining: ["mining_sulfur_deposit"],
            fishing: ["fish_sunfish"],
            foraging: ["forage_wild_yarrow_patch"],
            hunting: ["hunt_cottontail_rabbit"],
            looting: ["loot_tiger_claw_dojo"],
            scavenging: []
          },
          dungeons: [
            {
              id: "warfront_hollow_creek",
              name: "Warfront",
              level: 4,
              enemies: [
                { factionId: "cannibals", enemyId: "the_gorge", level: 4 },
                { factionId: "cannibals", enemyId: "marrow_eater", level: 5 },
                { factionId: "bandits", enemyId: "the_marauder", level: 4 },
                { factionId: "bandits", enemyId: "road_reaver", level: 5 },
                { factionId: "zombies", enemyId: "shambler", level: 5 },
                { factionId: "zombies", enemyId: "groaner", level: 6 },
                { factionId: "zombies", enemyId: "the_unending", level: 6, boss: true }
              ]
            }
          ]
        },
        {
          id: "saltmarsh",
          name: "Saltmarsh",
          level: 7,
          factions: ["Bandits", "Scavengers"],
          description: "War zone: Bandits & Scavengers.",
          gathering: {
            woodcutting: ["wood_willow_tree"],
            mining: [],
            fishing: ["fish_crappie"],
            foraging: ["forage_wild_onion_bed"],
            hunting: ["hunt_snowshoe_hare"],
            looting: [],
            scavenging: ["scav_community_recycling_dropoff"]
          },
          dungeons: [
            {
              id: "warfront_saltmarsh",
              name: "Warfront",
              level: 7,
              enemies: [
                { factionId: "bandits", enemyId: "the_marauder", level: 7 },
                { factionId: "bandits", enemyId: "road_reaver", level: 8 },
                { factionId: "scavengers", enemyId: "the_scrounger", level: 7 },
                { factionId: "scavengers", enemyId: "ash_sifter", level: 8 },
                { factionId: "bandits", enemyId: "the_road_king", level: 8, boss: true }
              ]
            }
          ]
        },
        {
          id: "the_boneyard",
          name: "The Boneyard",
          level: 10,
          factions: ["Cannibals", "Scavengers", "Zombies"],
          description: "War zone: Cannibals, Scavengers & Zombies.",
          gathering: {
            woodcutting: [],
            mining: ["mining_saltpeter_deposit"],
            fishing: ["fish_largemouth_bass"],
            foraging: ["forage_wild_flax_bed"],
            hunting: ["hunt_woodchuck"],
            looting: ["loot_thriftymart"],
            scavenging: []
          },
          dungeons: [
            {
              id: "warfront_boneyard",
              name: "Warfront",
              level: 10,
              enemies: [
                { factionId: "cannibals", enemyId: "the_gorge", level: 10 },
                { factionId: "cannibals", enemyId: "marrow_eater", level: 11 },
                { factionId: "scavengers", enemyId: "the_scrounger", level: 10 },
                { factionId: "scavengers", enemyId: "ash_sifter", level: 11 },
                { factionId: "zombies", enemyId: "shambler", level: 11 },
                { factionId: "zombies", enemyId: "sporebearer", level: 12, boss: true }
              ]
            }
          ]
        },
        {
          id: "grimsby",
          name: "Grimsby",
          level: 13,
          factions: ["Mutants", "Scavengers"],
          description: "War zone: Mutants & Scavengers.",
          gathering: {
            woodcutting: ["wood_cedar_tree"],
            mining: [],
            fishing: ["fish_channel_catfish"],
            foraging: ["forage_wild_turmeric_bed"],
            hunting: ["hunt_opossum"],
            looting: [],
            scavenging: ["scav_craft_hobby_shop"]
          },
          dungeons: [
            {
              id: "warfront_grimsby",
              name: "Warfront",
              level: 13,
              enemies: [
                { factionId: "mutants", enemyId: "bonebreaker", level: 13 },
                { factionId: "mutants", enemyId: "the_hulking", level: 14 },
                { factionId: "scavengers", enemyId: "the_scrounger", level: 13 },
                { factionId: "scavengers", enemyId: "ash_sifter", level: 14 },
                { factionId: "mutants", enemyId: "the_behemoth", level: 14, boss: true }
              ]
            }
          ]
        },
        {
          id: "ember_creek",
          name: "Ember Creek",
          level: 16,
          factions: ["Bandits", "Cultists", "Zombies"],
          description: "War zone: Bandits, Cultists & Zombies.",
          gathering: {
            woodcutting: ["wood_spruce_tree"],
            mining: ["mining_silver_vein"],
            fishing: [],
            foraging: ["forage_wild_chamomile_patch"],
            hunting: ["hunt_ruffed_grouse"],
            looting: ["loot_eagle_rotc_annex"],
            scavenging: []
          },
          dungeons: [
            {
              id: "warfront_ember_creek",
              name: "Warfront",
              level: 16,
              enemies: [
                { factionId: "bandits", enemyId: "the_marauder", level: 16 },
                { factionId: "bandits", enemyId: "road_reaver", level: 17 },
                { factionId: "cultists", enemyId: "the_zealot", level: 16 },
                { factionId: "cultists", enemyId: "the_acolyte", level: 17 },
                { factionId: "zombies", enemyId: "groaner", level: 17 },
                { factionId: "cultists", enemyId: "the_prophet", level: 18, boss: true }
              ]
            }
          ]
        },
        {
          id: "ironwood",
          name: "Ironwood",
          level: 19,
          factions: ["Cannibals", "Soldiers"],
          description: "War zone: Cannibals & Soldiers.",
          gathering: {
            woodcutting: ["wood_pine_tree"],
            mining: ["mining_copper_vein"],
            fishing: ["fish_flounder"],
            foraging: ["forage_wild_jute_bed"],
            hunting: ["hunt_ringnecked_pheasant"],
            looting: [],
            scavenging: []
          },
          dungeons: [
            {
              id: "warfront_ironwood",
              name: "Warfront",
              level: 19,
              enemies: [
                { factionId: "cannibals", enemyId: "the_gorge", level: 19 },
                { factionId: "cannibals", enemyId: "marrow_eater", level: 20 },
                { factionId: "soldiers", enemyId: "trooper", level: 19 },
                { factionId: "soldiers", enemyId: "sergeant", level: 20 },
                { factionId: "soldiers", enemyId: "the_major", level: 20, boss: true }
              ]
            }
          ]
        },
        {
          id: "spine_ridge",
          name: "Spine Ridge",
          level: 22,
          factions: ["Bandits", "Mutants", "Zombies"],
          description: "War zone: Bandits, Mutants & Zombies.",
          gathering: {
            woodcutting: ["wood_cherry_tree"],
            mining: ["mining_lead_deposit"],
            fishing: [],
            foraging: ["forage_wild_chanterelle_log"],
            hunting: ["hunt_mallard_duck"],
            looting: ["loot_trailquest_outfitters"],
            scavenging: []
          },
          dungeons: [
            {
              id: "warfront_spine_ridge",
              name: "Warfront",
              level: 22,
              enemies: [
                { factionId: "bandits", enemyId: "the_marauder", level: 22 },
                { factionId: "bandits", enemyId: "road_reaver", level: 23 },
                { factionId: "mutants", enemyId: "bonebreaker", level: 22 },
                { factionId: "mutants", enemyId: "the_hulking", level: 23 },
                { factionId: "zombies", enemyId: "wretch", level: 23 },
                { factionId: "mutants", enemyId: "the_behemoth", level: 24, boss: true }
              ]
            }
          ]
        },
        {
          id: "blightmoor",
          name: "Blightmoor",
          level: 25,
          factions: ["Cultists", "Mutants"],
          description: "War zone: Cultists & Mutants.",
          gathering: {
            woodcutting: ["wood_ash_tree"],
            mining: ["mining_zinc_deposit"],
            fishing: ["fish_sheepshead"],
            foraging: ["forage_wild_aloe_clump"],
            hunting: ["hunt_wild_turkey"],
            looting: [],
            scavenging: []
          },
          dungeons: [
            {
              id: "warfront_blightmoor",
              name: "Warfront",
              level: 25,
              enemies: [
                { factionId: "cultists", enemyId: "the_zealot", level: 25 },
                { factionId: "cultists", enemyId: "the_acolyte", level: 26 },
                { factionId: "mutants", enemyId: "bonebreaker", level: 25 },
                { factionId: "mutants", enemyId: "the_hulking", level: 26 },
                { factionId: "cultists", enemyId: "the_prophet", level: 26, boss: true }
              ]
            }
          ]
        },
        {
          id: "the_sanctum",
          name: "The Sanctum",
          level: 28,
          factions: ["Cultists", "Scavengers", "Zombies"],
          description: "War zone: Cultists, Scavengers & Zombies.",
          gathering: {
            woodcutting: ["wood_maple_tree"],
            mining: ["mining_tin_vein"],
            fishing: [],
            foraging: ["forage_wild_ramie_patch"],
            hunting: ["hunt_canada_goose"],
            looting: [],
            scavenging: ["scav_homefix_warehouse"]
          },
          dungeons: [
            {
              id: "warfront_the_sanctum",
              name: "Warfront",
              level: 28,
              enemies: [
                { factionId: "cultists", enemyId: "the_zealot", level: 28 },
                { factionId: "cultists", enemyId: "the_acolyte", level: 29 },
                { factionId: "scavengers", enemyId: "the_scrounger", level: 28 },
                { factionId: "scavengers", enemyId: "ash_sifter", level: 29 },
                { factionId: "zombies", enemyId: "runner", level: 29 },
                { factionId: "cultists", enemyId: "the_prophet", level: 30, boss: true }
              ]
            }
          ]
        },
        {
          id: "saint_judes_rest",
          name: "Saint Jude’s Rest",
          level: 31,
          factions: ["Soldiers", "Cultists"],
          description: "War zone: Soldiers & Cultists.",
          gathering: {
            woodcutting: ["wood_oak_tree"],
            mining: ["mining_iron_deposit"],
            fishing: ["fish_coho_salmon"],
            foraging: ["forage_wild_ginger_bed"],
            hunting: [],
            looting: ["loot_crown_chain_reenactment_hall"],
            scavenging: []
          },
          dungeons: [
            {
              id: "warfront_saint_judes_rest",
              name: "Warfront",
              level: 31,
              enemies: [
                { factionId: "soldiers", enemyId: "trooper", level: 31 },
                { factionId: "soldiers", enemyId: "sergeant", level: 32 },
                { factionId: "cultists", enemyId: "the_zealot", level: 31 },
                { factionId: "cultists", enemyId: "the_acolyte", level: 32 },
                { factionId: "soldiers", enemyId: "the_major", level: 32, boss: true }
              ]
            }
          ]
        },
        {
          id: "the_great_exchange",
          name: "The Great Exchange",
          level: 34,
          factions: ["Soldiers", "Scavengers", "Zombies"],
          description: "War zone: Soldiers, Scavengers & Zombies.",
          gathering: {
            woodcutting: ["wood_walnut_tree"],
            mining: ["mining_gold_vein"],
            fishing: [],
            foraging: ["forage_wild_stinging_nettle_patch"],
            hunting: ["hunt_pronghorn"],
            looting: [],
            scavenging: ["scav_byteback_ewaste_center"]
          },
          dungeons: [
            {
              id: "warfront_great_exchange",
              name: "Warfront",
              level: 34,
              enemies: [
                { factionId: "soldiers", enemyId: "trooper", level: 34 },
                { factionId: "soldiers", enemyId: "sergeant", level: 35 },
                { factionId: "scavengers", enemyId: "the_scrounger", level: 34 },
                { factionId: "scavengers", enemyId: "ash_sifter", level: 35 },
                { factionId: "zombies", enemyId: "runner", level: 35 },
                { factionId: "soldiers", enemyId: "the_major", level: 36, boss: true }
              ]
            }
          ]
        },
        {
          id: "shroud_valley",
          name: "Shroud Valley",
          level: 37,
          factions: ["Cannibals", "Cultists"],
          description: "War zone: Cannibals & Cultists.",
          gathering: {
            woodcutting: ["wood_hickory_tree"],
            mining: ["mining_titanium_deposit"],
            fishing: ["fish_striped_bass"],
            foraging: [],
            hunting: ["hunt_american_beaver"],
            looting: ["loot_central_fire_station"],
            scavenging: []
          },
          dungeons: [
            {
              id: "warfront_shroud_valley",
              name: "Warfront",
              level: 37,
              enemies: [
                { factionId: "cannibals", enemyId: "the_gorge", level: 37 },
                { factionId: "cannibals", enemyId: "marrow_eater", level: 38 },
                { factionId: "cultists", enemyId: "the_zealot", level: 37 },
                { factionId: "cultists", enemyId: "the_acolyte", level: 38 },
                { factionId: "cultists", enemyId: "the_prophet", level: 38, boss: true }
              ]
            }
          ]
        },
        {
          id: "highwall_pass",
          name: "Highwall Pass",
          level: 40,
          factions: ["Bandits", "Soldiers", "Zombies"],
          description: "War zone: Bandits, Soldiers & Zombies.",
          gathering: {
            woodcutting: ["wood_redwood_tree"],
            mining: ["mining_tungsten_vein"],
            fishing: ["fish_king_mackerel"],
            foraging: ["forage_wild_st_johns_wort_patch"],
            hunting: [],
            looting: [],
            scavenging: ["scav_rolling_wrench_salvage_lot"]
          },
          dungeons: [
            {
              id: "warfront_highwall_pass",
              name: "Warfront",
              level: 40,
              enemies: [
                { factionId: "bandits", enemyId: "the_marauder", level: 40 },
                { factionId: "bandits", enemyId: "road_reaver", level: 41 },
                { factionId: "soldiers", enemyId: "trooper", level: 40 },
                { factionId: "soldiers", enemyId: "sergeant", level: 41 },
                { factionId: "zombies", enemyId: "ripper", level: 41 },
                { factionId: "bandits", enemyId: "the_road_king", level: 42, boss: true }
              ]
            }
          ]
        },
        {
          id: "fort_defiance",
          name: "Fort Defiance",
          level: 43,
          factions: ["Soldiers", "Mutants"],
          description: "War zone: Soldiers & Mutants.",
          gathering: {
            woodcutting: ["wood_mahogany_tree"],
            mining: ["mining_palladium_node"],
            fishing: ["fish_flathead_catfish"],
            foraging: [],
            hunting: ["hunt_bighorn_sheep"],
            looting: ["loot_central_precinct_police_station"],
            scavenging: []
          },
          dungeons: [
            {
              id: "warfront_fort_defiance",
              name: "Warfront",
              level: 43,
              enemies: [
                { factionId: "soldiers", enemyId: "trooper", level: 43 },
                { factionId: "soldiers", enemyId: "sergeant", level: 44 },
                { factionId: "mutants", enemyId: "bonebreaker", level: 43 },
                { factionId: "mutants", enemyId: "the_hulking", level: 44 },
                { factionId: "soldiers", enemyId: "the_major", level: 44, boss: true }
              ]
            }
          ]
        },
        {
          id: "blackwater_point",
          name: "Blackwater Point",
          level: 46,
          factions: ["Bandits", "The Directorate", "Zombies"],
          description: "War zone: Bandits, The Directorate & Zombies.",
          gathering: {
            woodcutting: ["wood_yew_tree"],
            mining: ["mining_iridium_node"],
            fishing: ["fish_alligator_gar"],
            foraging: ["forage_wild_dogbane_patch"],
            hunting: [],
            looting: [],
            scavenging: ["scav_precision_machine_shop"]
          },
          dungeons: [
            {
              id: "warfront_blackwater_point",
              name: "Warfront",
              level: 46,
              enemies: [
                { factionId: "bandits", enemyId: "the_marauder", level: 46 },
                { factionId: "bandits", enemyId: "road_reaver", level: 47 },
                { factionId: "the_directorate", enemyId: "enforcer", level: 46 },
                { factionId: "the_directorate", enemyId: "regulator", level: 47 },
                { factionId: "zombies", enemyId: "sprinter", level: 47 },
                { factionId: "the_directorate", enemyId: "the_don", level: 48, boss: true }
              ]
            }
          ]
        },
        {
          id: "cinderfall",
          name: "Cinderfall",
          level: 49,
          factions: ["Mutants", "The Directorate"],
          description: "War zone: Mutants & The Directorate.",
          gathering: {
            woodcutting: ["wood_teak_tree"],
            mining: ["mining_meteorite_deposit"],
            fishing: [],
            foraging: ["forage_wild_echinacea_patch"],
            hunting: ["hunt_elk"],
            looting: [],
            scavenging: ["scav_metro_fab_lab"]
          },
          dungeons: [
            {
              id: "warfront_cinderfall",
              name: "Warfront",
              level: 49,
              enemies: [
                { factionId: "mutants", enemyId: "bonebreaker", level: 49 },
                { factionId: "mutants", enemyId: "the_hulking", level: 50 },
                { factionId: "the_directorate", enemyId: "enforcer", level: 49 },
                { factionId: "the_directorate", enemyId: "regulator", level: 50 },
                { factionId: "the_directorate", enemyId: "the_don", level: 50, boss: true }
              ]
            }
          ]
        },
        {
          id: "port_scoria",
          name: "Port Scoria",
          level: 52,
          factions: ["Cannibals", "The Directorate", "Zombies"],
          description: "War zone: Cannibals, The Directorate & Zombies.",
          gathering: {
            woodcutting: [],
            mining: [],
            fishing: ["fish_muskie"],
            foraging: ["forage_wild_carrot_bed"],
            hunting: ["hunt_american_alligator"],
            looting: ["loot_atlas_armored_courier_hub"],
            scavenging: ["scav_telecom_service_depot"]
          },
          dungeons: [
            {
              id: "warfront_port_scoria",
              name: "Warfront",
              level: 52,
              enemies: [
                { factionId: "cannibals", enemyId: "the_gorge", level: 52 },
                { factionId: "cannibals", enemyId: "marrow_eater", level: 53 },
                { factionId: "the_directorate", enemyId: "enforcer", level: 52 },
                { factionId: "the_directorate", enemyId: "regulator", level: 53 },
                { factionId: "zombies", enemyId: "smasher", level: 53 },
                { factionId: "the_directorate", enemyId: "the_don", level: 54, boss: true }
              ]
            }
          ]
        },
        {
          id: "command_post_7",
          name: "Command Post 7",
          level: 55,
          factions: ["Soldiers", "The Directorate"],
          description: "War zone: Soldiers & The Directorate.",
          gathering: {
            woodcutting: [],
            mining: [],
            fishing: ["fish_yellowfin_tuna"],
            foraging: ["forage_wild_strawberry_patch"],
            hunting: ["hunt_black_bear"],
            looting: ["loot_customs_seizure_vault"],
            scavenging: ["scav_utility_maintenance_yard"]
          },
          dungeons: [
            {
              id: "warfront_command_post_7",
              name: "Warfront",
              level: 55,
              enemies: [
                { factionId: "soldiers", enemyId: "trooper", level: 55 },
                { factionId: "soldiers", enemyId: "sergeant", level: 56 },
                { factionId: "the_directorate", enemyId: "enforcer", level: 55 },
                { factionId: "the_directorate", enemyId: "regulator", level: 56 },
                { factionId: "soldiers", enemyId: "the_major", level: 56, boss: true }
              ]
            }
          ]
        },
        {
          id: "the_mercantile",
          name: "The Mercantile",
          level: 58,
          factions: ["Scavengers", "The Directorate"],
          description: "War zone: Scavengers & The Directorate.",
          gathering: {
            woodcutting: [],
            mining: [],
            fishing: ["fish_goliath_grouper"],
            foraging: ["forage_wild_morel_log"],
            hunting: ["hunt_mountain_lion"],
            looting: ["loot_national_guard_checkpoint"],
            scavenging: ["scav_airport_maintenance_hangar"]
          },
          dungeons: [
            {
              id: "warfront_the_mercantile",
              name: "Warfront",
              level: 58,
              enemies: [
                { factionId: "scavengers", enemyId: "the_scrounger", level: 58 },
                { factionId: "scavengers", enemyId: "ash_sifter", level: 59 },
                { factionId: "the_directorate", enemyId: "enforcer", level: 58 },
                { factionId: "the_directorate", enemyId: "regulator", level: 59 },
                { factionId: "scavengers", enemyId: "the_junk_king", level: 60, boss: true }
              ]
            }
          ]
        },

        {
          id: "old_ashfield",
          name: "Old Ashfield",
          level: 61,
          factions: ["Zombies"],
          description: "Infested Stronghold: Zombies.",
          gathering: {
            woodcutting: [],
            mining: [],
            fishing: ["fish_swordfish"],
            foraging: ["forage_wild_milk_thistle_patch"],
            hunting: ["hunt_moose"],
            looting: ["loot_national_guard_armory"],
            scavenging: ["scav_shipyard_repair_stores"]
          },
          dungeons: [
            {
              id: "infested_stronghold_old_ashfield",
              name: "Infested Stronghold",
              level: 61,
              enemies: [
                { factionId: "zombies", enemyId: "shambler", level: 61 },
                { factionId: "zombies", enemyId: "runner", level: 62 },
                { factionId: "zombies", enemyId: "the_unending", level: 62, boss: true }
              ]
            }
          ]
        },
        {
          id: "redfall_point",
          name: "Redfall Point",
          level: 65,
          factions: ["Mutants"],
          description: "Stronghold: Mutants.",
          gathering: {
            woodcutting: [],
            mining: [],
            fishing: ["fish_blue_marlin"],
            foraging: ["forage_wild_oyster_mushroom_log"],
            hunting: ["hunt_american_bison"],
            looting: ["loot_strategic_response_command_armory"],
            scavenging: ["scav_defense_contractor_surplus_warehouse"]
          },
          dungeons: [
            {
              id: "stronghold_redfall_point",
              name: "Stronghold",
              level: 65,
              enemies: [
                { factionId: "mutants", enemyId: "bonebreaker", level: 65 },
                { factionId: "mutants", enemyId: "the_hulking", level: 66 },
                { factionId: "mutants", enemyId: "the_behemoth", level: 66, boss: true }
              ]
            }
          ]
        },
        {
          id: "rustford",
          name: "Rustford",
          level: 68,
          factions: ["Scavengers"],
          description: "Stronghold: Scavengers.",
          gathering: {
            woodcutting: ["wood_yew_tree"],
            mining: [],
            fishing: ["fish_blue_marlin"],
            foraging: ["forage_wild_oyster_mushroom_log"],
            hunting: ["hunt_american_bison"],
            looting: [],
            scavenging: []
          },
          dungeons: [
            {
              id: "stronghold_rustford",
              name: "Stronghold",
              level: 68,
              enemies: [
                { factionId: "scavengers", enemyId: "the_scrounger", level: 68 },
                { factionId: "scavengers", enemyId: "ash_sifter", level: 69 },
                { factionId: "scavengers", enemyId: "the_junk_king", level: 69, boss: true }
              ]
            }
          ]
        },
        {
          id: "crimson_mills",
          name: "Crimson Mills",
          level: 70,
          factions: ["Cannibals"],
          description: "Stronghold: Cannibals.",
          gathering: {
            woodcutting: [],
            mining: ["mining_iridium_node"],
            fishing: ["fish_goliath_grouper"],
            foraging: ["forage_wild_milk_thistle_patch"],
            hunting: [],
            looting: ["loot_strategic_response_command_armory"],
            scavenging: ["scav_defense_contractor_surplus_warehouse"]
          },
          dungeons: [
            {
              id: "stronghold_crimson_mills",
              name: "Stronghold",
              level: 70,
              enemies: [
                { factionId: "cannibals", enemyId: "the_gorge", level: 70 },
                { factionId: "cannibals", enemyId: "marrow_eater", level: 71 },
                { factionId: "cannibals", enemyId: "the_unhinged", level: 71, boss: true }
              ]
            }
          ]
        },
        {
          id: "blackwood_crossing",
          name: "Blackwood Crossing",
          level: 72,
          factions: ["Bandits"],
          description: "Stronghold: Bandits.",
          gathering: {
            woodcutting: ["wood_teak_tree"],
            mining: ["mining_meteorite_deposit"],
            fishing: [],
            foraging: [],
            hunting: [],
            looting: ["loot_national_guard_armory"],
            scavenging: ["scav_shipyard_repair_stores"]
          },
          dungeons: [
            {
              id: "stronghold_blackwood_crossing",
              name: "Stronghold",
              level: 72,
              enemies: [
                { factionId: "bandits", enemyId: "the_marauder", level: 72 },
                { factionId: "bandits", enemyId: "road_reaver", level: 73 },
                { factionId: "bandits", enemyId: "the_road_king", level: 73, boss: true }
              ]
            }
          ]
        },
        {
          id: "fort_haven",
          name: "Fort Haven",
          level: 74,
          factions: ["Soldiers"],
          description: "Stronghold: Soldiers.",
          gathering: {
            woodcutting: [],
            mining: [],
            fishing: ["fish_swordfish"],
            foraging: ["forage_wild_milk_thistle_patch"],
            hunting: ["hunt_moose"],
            looting: ["loot_national_guard_checkpoint"],
            scavenging: ["scav_airport_maintenance_hangar"]
          },
          dungeons: [
            {
              id: "stronghold_fort_haven",
              name: "Stronghold",
              level: 74,
              enemies: [
                { factionId: "soldiers", enemyId: "trooper", level: 74 },
                { factionId: "soldiers", enemyId: "sergeant", level: 75 },
                { factionId: "soldiers", enemyId: "the_major", level: 75, boss: true }
              ]
            }
          ]
        },
        {
          id: "penance_heights",
          name: "Penance Heights",
          level: 76,
          factions: ["Cultists"],
          description: "Stronghold: Cultists.",
          gathering: {
            woodcutting: ["wood_teak_tree"],
            mining: ["mining_meteorite_deposit"],
            fishing: [],
            foraging: ["forage_wild_oyster_mushroom_log"],
            hunting: ["hunt_american_bison"],
            looting: ["loot_strategic_response_command_armory"],
            scavenging: []
          },
          dungeons: [
            {
              id: "stronghold_penance_heights",
              name: "Stronghold",
              level: 76,
              enemies: [
                { factionId: "cultists", enemyId: "the_zealot", level: 76 },
                { factionId: "cultists", enemyId: "the_acolyte", level: 77 },
                { factionId: "cultists", enemyId: "the_prophet", level: 77, boss: true }
              ]
            }
          ]
        },
        {
          id: "sterling_city",
          name: "Sterling City",
          level: 78,
          factions: ["The Directorate"],
          description: "Stronghold: The Directorate.",
          gathering: {
            woodcutting: ["wood_teak_tree"],
            mining: ["mining_meteorite_deposit"],
            fishing: ["fish_blue_marlin"],
            foraging: ["forage_wild_oyster_mushroom_log"],
            hunting: ["hunt_american_bison"],
            looting: [],
            scavenging: []
          },
          dungeons: [
            {
              id: "stronghold_sterling_city",
              name: "Stronghold",
              level: 78,
              enemies: [
                { factionId: "the_directorate", enemyId: "enforcer", level: 78 },
                { factionId: "the_directorate", enemyId: "regulator", level: 79 },
                { factionId: "the_directorate", enemyId: "the_don", level: 79, boss: true }
              ]
            }
          ]
        }
      ],
    };

export const AREA_REVAMP_CONFIG = {
      sunken_meadow: {
        areaType: "warzone",
        dungeons: [
          { id: "ironclad_mall", name: "Ironclad Mall", type: "dungeon", primary: "zombies" },
          { id: "union_freight_depot", name: "Union Freight Depot", type: "dungeon", primary: "scavengers" }
        ],
        enemies: ["Shambler", "Groaner", "Biter", "Bloat", "Leaper", "The Scrounger", "Ash-Sifter", "The Opportunist", "The Ruin-Runner", "The Creep"]
      },
      hollow_creek: {
        areaType: "warzone",
        dungeons: [
          { id: "pine_hollow_arena", name: "Pine Hollow Arena", type: "dungeon", primary: "cannibals" },
          { id: "railmans_yard", name: "Railman’s Yard", type: "dungeon", primary: "bandits" },
          { id: "ashgate_cemetery_grounds", name: "Ashgate Cemetery Grounds", type: "dungeon", primary: "zombies" }
        ],
        enemies: ["The Gorge", "Marrow-Eater", "The Bloated", "Viscera-Cutter", "Road-Lurcher", "The Marauder", "Road-Reaver", "The Ambusher", "Shank-Digger", "The Flayer", "Runner", "Prowler", "Lurcher", "Wretch", "Rotter"]
      },
      saltmarsh: {
        areaType: "warzone",
        dungeons: [
          { id: "blackwater_coliseum", name: "Blackwater Coliseum", type: "dungeon", primary: "bandits" },
          { id: "crosswind_distribution_hub", name: "Crosswind Distribution Hub", type: "dungeon", primary: "scavengers" }
        ],
        enemies: ["Bone-Breaker", "The Wretched", "The Thrasher", "Bludgeon", "The Iron-Jaw", "The Whispering", "The Sorter", "The Hoarder", "The Junk-Taker", "The Dust-Walker"]
      },
      the_boneyard: {
        areaType: "warzone",
        dungeons: [
          { id: "mercy_general_hospital", name: "Mercy General Hospital", type: "dungeon", primary: "zombies" },
          { id: "iron_wharf_yards", name: "Iron Wharf Yards", type: "dungeon", primary: "scavengers" },
          { id: "granite_plaza", name: "Granite Plaza", type: "dungeon", primary: "cannibals" }
        ],
        enemies: ["The Wretched", "Shank-Digger", "Iron-Jaw", "The Withered", "Gutter-Hook", "The Digger", "The Tinker", "The Finder", "The Shadow-Stalk", "The Grubber", "Wailer", "Gnawer", "Clinger", "Ripper", "Smasher"]
      },
      grimsby: {
        areaType: "warzone",
        dungeons: [
          { id: "hollowline_subway", name: "Hollowline Subway", type: "dungeon", primary: "mutants" },
          { id: "eastgate_warehousing", name: "Eastgate Warehousing", type: "dungeon", primary: "scavengers" }
        ],
        enemies: ["Bonebreaker", "The Hulking", "Marrow-Mangler", "The Brute", "The Smasher", "The Lookout", "The Looter", "The Collector", "The Forager", "The Cache-Finder"]
      },
      ember_creek: {
        areaType: "warzone",
        dungeons: [
          { id: "redhaven_mall", name: "Redhaven Mall", type: "dungeon", primary: "bandits" },
          { id: "lighthouse_power_plant", name: "Lighthouse Power Plant", type: "dungeon", primary: "cultists" },
          { id: "rockvale_arena", name: "Rockvale Arena", type: "dungeon", primary: "zombies" }
        ],
        enemies: ["The Ripper", "The Sun-Stalker", "Gut-Hook", "The Blight-Eye", "The Wreck-Hound", "The Zealot", "The Acolyte", "The Penitent", "The Pyre-Guard", "The Fanatic", "Crawler", "Stunner", "Sprinter", "Screamer", "Husk"]
      },
      ironwood: {
        areaType: "warzone",
        dungeons: [
          { id: "timberline_slaughterhouse", name: "Timberline Slaughterhouse", type: "dungeon", primary: "cannibals" },
          { id: "ironwood_barracks", name: "Ironwood Barracks", type: "dungeon", primary: "soldiers" }
        ],
        enemies: ["Ambusher", "The Manic", "Cleaver-Hand", "The Starved", "Bone-Picker", "Trooper", "Sergeant", "Grunt", "Marksman", "Grenadier"]
      },
      spine_ridge: {
        areaType: "warzone",
        dungeons: [
          { id: "cliffwatch_camp", name: "Cliffwatch Camp", type: "dungeon", primary: "bandits" },
          { id: "deepfall_caverns", name: "Deepfall Caverns", type: "dungeon", primary: "mutants" },
          { id: "hollowstone_catacombs", name: "Hollowstone Catacombs", type: "dungeon", primary: "zombies" }
        ],
        enemies: ["The Dust-Cutter", "The Unstable", "The Raker", "The Bruiser", "The Viper-Tongue", "The Crushing", "Hardhide", "Ironclad", "Plated", "Ossifier", "Shambler", "Groaner", "Biter", "Bloat", "Leaper"]
      },
      blightmoor: {
        areaType: "warzone",
        dungeons: [
          { id: "midnight_chapel", name: "Midnight Chapel", type: "dungeon", primary: "cultists" },
          { id: "mireborne_sewers", name: "Mireborne Sewers", type: "dungeon", primary: "mutants" }
        ],
        enemies: ["The Ash-Worshiper", "The Sacrificer", "The Mourner", "The Unclean", "The Seeker", "Flesh-Warp", "The Wretch", "Tendon-Snapper", "The Withered", "Spiked-Shoulder"]
      },
      the_sanctum: {
        areaType: "warzone",
        dungeons: [
          { id: "sanctum_monastery", name: "Sanctum Monastery", type: "dungeon", primary: "cultists" },
          { id: "redgate_warehouse", name: "Redgate Warehouse", type: "dungeon", primary: "scavengers" },
          { id: "westfield_memorial_grounds", name: "Westfield Memorial Grounds", type: "dungeon", primary: "zombies" }
        ],
        enemies: ["The Incinerator", "The Listener", "The Whispering", "The Bone-Binder", "The Forlorn", "The Digger", "The Tinker", "The Finder", "The Shadow-Stalk", "The Grubber", "Rotter", "Wailer", "Gnawer", "Clinger", "Ripper"]
      },
      saint_judes_rest: {
        areaType: "warzone",
        dungeons: [
          { id: "saint_judes_outpost", name: "Saint Jude’s Outpost", type: "dungeon", primary: "soldiers" },
          { id: "the_scarlet_temple", name: "The Scarlet Temple", type: "dungeon", primary: "cultists" }
        ],
        enemies: ["Vanguard", "The Enforcer", "The Sentinel", "Bruiser", "The Hardliner", "The Vowed", "The Cinder-Born", "The Incendiary", "The Initiate", "The Flame-Wist"]
      },
      the_great_exchange: {
        areaType: "warzone",
        dungeons: [
          { id: "the_armory_barracks", name: "The Armory Barracks", type: "dungeon", primary: "soldiers" },
          { id: "merchants_market_hall", name: "Merchant’s Market Hall", type: "dungeon", primary: "scavengers" },
          { id: "old_catacombs", name: "Old Catacombs", type: "dungeon", primary: "zombies" }
        ],
        enemies: ["The Grinder", "Breacher", "The Regulator", "The Butcher", "Rifleman", "The Forager", "The Cache-Finder", "The Scrounger", "Ash-Sifter", "The Opportunist", "Smasher", "Crawler", "Stunner", "Sprinter", "Screamer"]
      },
      shroud_valley: {
        areaType: "warzone",
        dungeons: [
          { id: "butchers_hall", name: "Butcher’s Hall", type: "dungeon", primary: "cannibals" },
          { id: "whispering_shrine", name: "Whispering Shrine", type: "dungeon", primary: "cultists" }
        ],
        enemies: ["The Craver", "The Scalper", "Skin-Walker", "Dust-Lurker", "The Unfed", "The Cinder-Born", "The Incendiary", "The Initiate", "The Flame-Wist", "The Zealot"]
      },
      highwall_pass: {
        areaType: "warzone",
        dungeons: [
          { id: "blackcliff_hideout", name: "Blackcliff Hideout", type: "dungeon", primary: "bandits" },
          { id: "sentinel_barracks", name: "Sentinel Barracks", type: "dungeon", primary: "soldiers" },
          { id: "stonegate_crypt", name: "Stonegate Crypt", type: "dungeon", primary: "zombies" }
        ],
        enemies: ["The Unstable", "The Raker", "The Bruiser", "The Viper-Tongue", "The Marauder", "The Cold-Eye", "The Drifter", "Veteran", "The Warden", "The Tracker", "Husk", "Shambler", "Groaner", "Biter", "Bloat"]
      },
      fort_defiance: {
        areaType: "warzone",
        dungeons: [
          { id: "fort_command_bunker", name: "Fort Command Bunker", type: "dungeon", primary: "soldiers" },
          { id: "defiance_research_labs", name: "Defiance Research Labs", type: "dungeon", primary: "mutants" }
        ],
        enemies: ["Marksman", "Grenadier", "Vanguard", "The Enforcer", "The Sentinel", "The Grotesque", "Carapace", "The Feral", "The Unmade", "The Maw"]
      },
      blackwater_point: {
        areaType: "warzone",
        dungeons: [
          { id: "smugglers_wharf", name: "Smuggler’s Wharf", type: "dungeon", primary: "bandits" },
          { id: "directorate_dockhouse", name: "Directorate Dockhouse", type: "dungeon", primary: "the_directorate" },
          { id: "blackwater_morgue", name: "Blackwater Morgue", type: "dungeon", primary: "zombies" }
        ],
        enemies: ["Road-Reaver", "The Ambusher", "Shank-Digger", "The Flayer", "Bone-Breaker", "Enforcer", "Regulator", "Bruiser", "Fixer", "Cleaner", "Runner", "Prowler", "Lurcher", "Wretch", "Rotter"]
      },
      cinderfall: {
        areaType: "warzone",
        dungeons: [
          { id: "ashen_mines", name: "Ashen Mines", type: "dungeon", primary: "mutants" },
          { id: "directorate_armory", name: "Directorate Armory", type: "dungeon", primary: "the_directorate" }
        ],
        enemies: ["Hardhide", "Ironclad", "Plated", "Ossifier", "Flesh-Warp", "Auditor", "Warden", "Taxman", "Slasher", "Headhunter"]
      },
      port_scoria: {
        areaType: "warzone",
        dungeons: [
          { id: "scoria_meatworks", name: "Scoria Meatworks", type: "dungeon", primary: "cannibals" },
          { id: "harbor_customs_office", name: "Harbor Customs Office", type: "dungeon", primary: "the_directorate" },
          { id: "dockside_tombs", name: "Dockside Tombs", type: "dungeon", primary: "zombies" }
        ],
        enemies: ["Ambusher", "The Manic", "Cleaver-Hand", "The Starved", "Bone-Picker", "Knuckleduster", "Sentinel", "Muscle", "Thug", "Wiseguy", "Clinger", "Ripper", "Smasher", "Crawler", "Stunner"]
      },
      command_post_7: {
        areaType: "warzone",
        dungeons: [
          { id: "command_bunker", name: "Command Bunker", type: "dungeon", primary: "soldiers" },
          { id: "directorate_safehouse", name: "Directorate Safehouse", type: "dungeon", primary: "the_directorate" }
        ],
        enemies: ["The Regulator", "The Butcher", "Rifleman", "The Cold-Eye", "The Drifter", "Scribe", "Operative", "Handler", "Collector", "Ledger-Man"]
      },
      the_mercantile: {
        areaType: "warzone",
        dungeons: [
          { id: "grand_market_hall", name: "Grand Market Hall", type: "dungeon", primary: "scavengers" },
          { id: "sterling_office_tower", name: "Sterling Office Tower", type: "dungeon", primary: "the_directorate" }
        ],
        enemies: ["The Hoarder", "The Junk-Taker", "The Dust-Walker", "The Digger", "The Tinker", "Enforcer", "Regulator", "Bruiser", "Fixer", "Cleaner"]
      },
      old_ashfield: {
        areaType: "stronghold",
        dungeons: [
          { id: "ashfield_shopping_center", name: "Ashfield Shopping Center", type: "dungeon", primary: "zombies" },
          { id: "ashfield_arena", name: "Ashfield Arena", type: "raid", primary: "zombies" }
        ],
        enemies: ["Gnawer", "Wailer", "Sprinter", "Screamer", "Husk"]
      },
      redfall_point: {
        areaType: "stronghold",
        dungeons: [
          { id: "redfall_mine_entrance", name: "Redfall Mine Entrance", type: "dungeon", primary: "mutants" },
          { id: "redfall_cavern_complex", name: "Redfall Cavern Complex", type: "raid", primary: "mutants" }
        ],
        enemies: ["The Withered", "Spiked-Shoulder", "The Grotesque", "Carapace", "The Feral"]
      },
      rustford: {
        areaType: "stronghold",
        dungeons: [
          { id: "rustford_salvage_yard", name: "Rustford Salvage Yard", type: "dungeon", primary: "scavengers" },
          { id: "rustford_mega_mall", name: "Rustford Mega Mall", type: "raid", primary: "scavengers" }
        ],
        enemies: ["The Finder", "The Shadow-Stalk", "The Grubber", "The Lookout", "The Looter"]
      },
      crimson_mills: {
        areaType: "stronghold",
        dungeons: [
          { id: "crimson_mills_meatpacking_plant", name: "Crimson Mills Meatpacking Plant", type: "dungeon", primary: "cannibals" },
          { id: "crimson_mills_stockyards", name: "Crimson Mills Stockyards", type: "raid", primary: "cannibals" }
        ],
        enemies: ["The Craver", "The Scalper", "Skin-Walker", "Dust-Lurker", "The Unfed"]
      },
      blackwood_crossing: {
        areaType: "stronghold",
        dungeons: [
          { id: "blackwood_train_station", name: "Blackwood Train Station", type: "dungeon", primary: "bandits" },
          { id: "blackwood_fortress", name: "Blackwood Fortress", type: "raid", primary: "bandits" }
        ],
        enemies: ["The Thrasher", "Bludgeon", "The Iron-Jaw", "The Ripper", "The Sun-Stalker"]
      },
      fort_haven: {
        areaType: "stronghold",
        dungeons: [
          { id: "haven_barracks", name: "Haven Barracks", type: "dungeon", primary: "soldiers" },
          { id: "haven_stronghold", name: "Haven Stronghold", type: "raid", primary: "soldiers" }
        ],
        enemies: ["Veteran", "The Warden", "The Tracker", "The Grinder", "Breacher"]
      },
      penance_heights: {
        areaType: "stronghold",
        dungeons: [
          { id: "heights_chapel", name: "Heights Chapel", type: "dungeon", primary: "cultists" },
          { id: "cathedral_of_penance", name: "Cathedral of Penance", type: "raid", primary: "cultists" }
        ],
        enemies: ["The Seeker", "The Incinerator", "The Listener", "The Whispering", "The Bone-Binder"]
      },
      sterling_city: {
        areaType: "stronghold",
        dungeons: [
          { id: "sterling_city_tower", name: "Sterling City Tower", type: "dungeon", primary: "the_directorate" },
          { id: "the_directorate_spire", name: "The Directorate Spire", type: "raid", primary: "the_directorate" }
        ],
        enemies: ["Thug", "Wiseguy", "Scribe", "Operative", "Handler"]
      }
    };

export default { AREAS_DATA, AREA_REVAMP_CONFIG };
