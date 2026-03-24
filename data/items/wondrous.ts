
import { EquipmentDetail } from '../../types';

export const WONDROUS_ITEMS: EquipmentDetail[] = [
    // Existing Items (preserved)
    { index: "bag-of-holding", name: "Bag of Holding", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 500, unit: "gp" }, weight: 15, rarity: "Uncommon", desc: ["This bag has an interior space considerably larger than its outside dimensions, roughly 2 feet in diameter at the mouth and 4 feet deep. The bag can hold up to 500 pounds, not exceeding a volume of 64 cubic feet. The bag weighs 15 pounds, regardless of its contents. Retrieving an item from the bag requires an action."] },
    { index: "boots-of-elvenkind", name: "Boots of Elvenkind", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 300, unit: "gp" }, weight: 0, rarity: "Uncommon", desc: ["While you wear these boots, your steps make no sound, regardless of the surface you are moving across. You also have advantage on Dexterity (Stealth) checks that rely on moving silently."] },
    { index: "boots-of-flying", name: "Boots of Flying", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 500, unit: "gp" }, weight: 0, rarity: "Uncommon", desc: ["While you wear these boots, you have a flying speed equal to your walking speed. You can use the boots to fly for up to 4 hours, all at once or in several shorter flights, each one using a minimum of 1 minute from the duration. If you are flying when the duration expires, you descend at a rate of 30 feet per round until you land."], requires_attunement: true },
    { index: "boots-of-speed", name: "Boots of Speed", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 4000, unit: "gp" }, weight: 0, rarity: "Rare", desc: ["While you wear these boots, you can use a bonus action and click your heels together to double your walking speed, and any creature that makes an opportunity attack against you has disadvantage on the attack roll. If you click your heels together again, you end the effect. The boots function for up to 10 minutes per long rest."], requires_attunement: true },
    { 
        index: "boots-of-striding-springing", name: "Boots of Striding and Springing", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 300, unit: "gp" }, weight: 0, rarity: "Uncommon", desc: ["While you wear these boots, your walking speed becomes 30 feet, unless your walking speed is higher, and your speed isn't reduced if you are encumbered or wearing heavy armor. In addition, you can jump three times the normal distance, though you can't jump farther than your remaining movement would allow."],
        modifiers: [{ type: 'set', target: 'speed', value: 30 }] 
    },
    { 
        index: "cloak-of-protection", name: "Cloak of Protection", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 500, unit: "gp" }, weight: 0, rarity: "Uncommon", desc: ["You gain a +1 bonus to AC and saving throws while you wear this cloak."],
        modifiers: [
            { type: 'bonus', target: 'ac', value: 1 },
            { type: 'bonus', target: 'saves', value: 1 }
        ],
        requires_attunement: true
    },
    { index: "cloak-of-displacement", name: "Cloak of Displacement", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 4000, unit: "gp" }, weight: 0, rarity: "Rare", desc: ["While you wear this cloak, it projects an illusion that makes you appear to be standing in a place near your actual location, causing any creature to have disadvantage on attack rolls against you. If you take damage, the property ceases to function until the start of your next turn. This property is suppressed while you are incapacitated, restrained, or otherwise unable to move."], requires_attunement: true },
    { index: "cloak-of-elvenkind", name: "Cloak of Elvenkind", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 400, unit: "gp" }, weight: 0, rarity: "Uncommon", desc: ["While you wear this cloak with its hood up, Wisdom (Perception) checks made to see you have disadvantage, and you have advantage on Dexterity (Stealth) checks made to hide, as the cloak's color shifts to camouflage you."], requires_attunement: true },
    { 
        index: "gauntlets-of-ogre-power", name: "Gauntlets of Ogre Power", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 500, unit: "gp" }, weight: 0, rarity: "Uncommon", desc: ["Your Strength score is 19 while you wear these gauntlets. They have no effect on you if your Strength is already 19 or higher."],
        modifiers: [{ type: 'set', target: 'str', value: 19 }],
        requires_attunement: true
    },
    { 
        index: "headband-of-intellect", name: "Headband of Intellect", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 500, unit: "gp" }, weight: 0, rarity: "Uncommon", desc: ["Your Intelligence score is 19 while you wear this headband. It has no effect on you if your Intelligence is already 19 or higher."],
        modifiers: [{ type: 'set', target: 'int', value: 19 }],
        requires_attunement: true
    },
    { 
        index: "amulet-of-health", name: "Amulet of Health", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 4000, unit: "gp" }, weight: 1, rarity: "Rare", desc: ["Your Constitution score is 19 while you wear this amulet. It has no effect on you if your Constitution is already 19 or higher."],
        modifiers: [{ type: 'set', target: 'con', value: 19 }],
        requires_attunement: true
    },
    { 
        index: "belt-giant-strength-hill", name: "Belt of Hill Giant Strength", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 4000, unit: "gp" }, weight: 1, rarity: "Rare", desc: ["Your Strength score becomes 21 while you wear this belt. It has no effect on you if your Strength is already 21 or higher."],
        modifiers: [{ type: 'set', target: 'str', value: 21 }],
        requires_attunement: true
    },
    { 
        index: "bracers-of-defense", name: "Bracers of Defense", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 5000, unit: "gp" }, weight: 0.5, rarity: "Rare", desc: ["While wearing these bracers, you gain a +2 bonus to AC if you are wearing no armor and using no shield."],
        modifiers: [{ type: 'bonus', target: 'ac', value: 2 }],
        requires_attunement: true
    },
    { 
        index: "bracers-of-archery", name: "Bracers of Archery", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 300, unit: "gp" }, weight: 0.5, rarity: "Uncommon", desc: ["While wearing these bracers, you have proficiency with the longbow and shortbow, and you gain a +2 bonus to damage rolls on ranged attacks made with such weapons."],
        modifiers: [{ type: 'bonus', target: 'damage', value: 2 }],
        requires_attunement: true
    },
    { index: "goggles-of-night", name: "Goggles of Night", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 300, unit: "gp" }, weight: 0, rarity: "Uncommon", desc: ["While wearing these dark lenses, you have darkvision out to a range of 60 feet. If you already have darkvision, wearing the goggles increases its range by 60 feet."], modifiers: [{type: 'bonus', target: 'darkvision', value: 60}] },
    { index: "winged-boots", name: "Winged Boots", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 500, unit: "gp" }, weight: 0, rarity: "Uncommon", desc: ["While wearing these boots, you have a flying speed equal to your walking speed. You can use the boots to fly for up to 4 hours, all at once or in several shorter flights. The boots regain 2 hours of flying capability for every 12 hours they aren't in use."], requires_attunement: true },
    { index: "gem-of-brightness", name: "Gem of Brightness", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 400, unit: "gp" }, weight: 0, rarity: "Uncommon", desc: ["This prism has 50 charges. While you are holding it, you can use an action to speak one of three command words to cause one of the following effects: 1 charge to shed light; 1 charge to blind one creature; 5 charges to create a blinding cone."] },
    { index: "pearl-of-power", name: "Pearl of Power", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 400, unit: "gp" }, weight: 0, rarity: "Uncommon", desc: ["While this pearl is on your person, you can use an action to speak its command word and regain one expended spell slot. If the expended slot was of 4th level or higher, the new slot is 3rd level. Once you use the pearl, it can't be used again until the next dawn."], requires_attunement: true, attunement_description: "by a spellcaster" },

    // New Additions
    { index: "amulet-of-the-planes", name: "Amulet of the Planes", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 40000, unit: "gp" }, weight: 1, rarity: "Very Rare", desc: ["While wearing this amulet, you can use an action to name a location that you are familiar with on another plane of existence. Then make a DC 15 Intelligence check. On a successful check, you cast the plane shift spell. On a failure, you and each creature and object within 15 feet of you travel to a random destination."], requires_attunement: true },
    { index: "bag-of-beans", name: "Bag of Beans", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 500, unit: "gp" }, weight: 0.5, rarity: "Rare", desc: ["Inside this heavy cloth bag are 3d4 dry beans. If you dump the bag's contents out on the ground, they explode in a 10-foot radius. If you plant a bean in dirt or sand and water it, it produces a magical effect 1 minute later (roll d100)."] },
    { index: "bag-of-tricks", name: "Bag of Tricks", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 400, unit: "gp" }, weight: 0.5, rarity: "Uncommon", desc: ["This ordinary bag comes in three color variations (Gray, Rust, or Tan). You can use an action to pull the fuzzy object from the bag and throw it up to 20 feet away. When the object lands, it transforms into a creature determined by rolling a d8 on the specific table for the bag's color."] },
    { index: "beads-of-force", name: "Beads of Force", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 3000, unit: "gp" }, weight: 0, rarity: "Rare", desc: ["This small black sphere measures 3/4 of an inch in diameter and weighs an ounce. You can use an action to throw the bead up to 60 feet. The bead explodes on impact and is destroyed. Each creature within a 10-foot radius of where the bead landed must succeed on a DC 15 Dexterity saving throw or take 5d4 force damage. A sphere of transparent force then encloses the area for 1 minute."] },
    { 
        index: "belt-giant-strength-frost", name: "Belt of Frost Giant Strength", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 35000, unit: "gp" }, weight: 1, rarity: "Very Rare", desc: ["Your Strength score is 23 while you wear this belt. It has no effect on you if your Strength is already 23 or higher."],
        modifiers: [{ type: 'set', target: 'str', value: 23 }],
        requires_attunement: true
    },
    { 
        index: "belt-giant-strength-fire", name: "Belt of Fire Giant Strength", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 45000, unit: "gp" }, weight: 1, rarity: "Very Rare", desc: ["Your Strength score is 25 while you wear this belt. It has no effect on you if your Strength is already 25 or higher."],
        modifiers: [{ type: 'set', target: 'str', value: 25 }],
        requires_attunement: true
    },
    { 
        index: "belt-giant-strength-cloud", name: "Belt of Cloud Giant Strength", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 50000, unit: "gp" }, weight: 1, rarity: "Very Rare", desc: ["Your Strength score is 27 while you wear this belt. It has no effect on you if your Strength is already 27 or higher."],
        modifiers: [{ type: 'set', target: 'str', value: 27 }],
        requires_attunement: true
    },
    { 
        index: "belt-giant-strength-storm", name: "Belt of Storm Giant Strength", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 100000, unit: "gp" }, weight: 1, rarity: "Legendary", desc: ["Your Strength score is 29 while you wear this belt. It has no effect on you if your Strength is already 29 or higher."],
        modifiers: [{ type: 'set', target: 'str', value: 29 }],
        requires_attunement: true
    },
    { index: "boots-of-levitation", name: "Boots of Levitation", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 3000, unit: "gp" }, weight: 0, rarity: "Rare", desc: ["While you wear these boots, you can use an action to cast the levitate spell on yourself at will."], requires_attunement: true },
    { index: "boots-of-winterlands", name: "Boots of the Winterlands", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 300, unit: "gp" }, weight: 0, rarity: "Uncommon", desc: ["These furred boots are snug and feel quite warm. While you wear them, you have resistance to cold damage. You ignore difficult terrain created by ice or snow. You can tolerate temperatures as low as -50 degrees Fahrenheit."], modifiers: [{type: 'resistance', target: 'resistance', filter: 'Cold', value: 1}], requires_attunement: true },
    { index: "broom-of-flying", name: "Broom of Flying", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 400, unit: "gp" }, weight: 3, rarity: "Uncommon", isSpellFocus: true, desc: ["This wooden broom can fly. You can use an action to speak its command word, causing the broom to hover. It has a flying speed of 50 feet. It can carry up to 400 pounds, but its flying speed becomes 30 feet if it carries over 200 pounds."] },
    { index: "cape-of-mountebank", name: "Cape of the Mountebank", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 4000, unit: "gp" }, weight: 0, rarity: "Rare", desc: ["This cape smells faintly of brimstone. While wearing it, you can use it to cast the dimension door spell as an action. This property of the cape can't be used again until the next dawn."] },
    { index: "carpet-of-flying", name: "Carpet of Flying", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 30000, unit: "gp" }, weight: 0, rarity: "Very Rare", desc: ["You can speak the carpet's command word as an action to make the carpet hover and fly. It moves according to your spoken directions, provided that you are within 30 feet of it."] },
    { index: "chime-of-opening", name: "Chime of Opening", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 3000, unit: "gp" }, weight: 1, rarity: "Rare", desc: ["This hollow metal tube measures about 1 foot long and weighs 1 pound. You can strike it as an action, pointing it at an object within 120 feet of you that can be opened, such as a door, lid, or lock. The chime issues a clear tone, and one lock or latch on the object opens. The chime has 10 uses."] },
    { index: "circlet-of-blasting", name: "Circlet of Blasting", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 400, unit: "gp" }, weight: 0, rarity: "Uncommon", desc: ["While wearing this circlet, you can use an action to cast the scorching ray spell with it. When you make the spell's attacks, you do so with an attack bonus of +5. The circlet can't be used this way again until the next dawn."] },
    { index: "cloak-of-arachnida", name: "Cloak of Arachnida", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 6000, unit: "gp" }, weight: 0, rarity: "Very Rare", desc: ["This fine garment is made of black silk interwoven with faint silvery threads. You gain the following benefits: Resistance to poison damage; Climbing speed equal to your walking speed; You can move up, down, and across vertical surfaces and upside down along ceilings, while leaving your hands free; You can cast the web spell (DC 13 save) twice per day."], modifiers: [{type: 'resistance', target: 'resistance', filter: 'Poison', value: 1}], requires_attunement: true },
    { index: "cloak-of-bat", name: "Cloak of the Bat", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 5000, unit: "gp" }, weight: 0, rarity: "Rare", desc: ["While wearing this cloak, you have advantage on Dexterity (Stealth) checks. In an area of dim light or darkness, you can grip the edges of the cloak with both hands and use it to fly at a speed of 40 feet. While you are in an area of dim light or darkness, you can use your action to cast polymorph on yourself, transforming into a bat."], requires_attunement: true },
    { index: "cloak-of-manta-ray", name: "Cloak of the Manta Ray", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 400, unit: "gp" }, weight: 0, rarity: "Uncommon", desc: ["While wearing this cloak with its hood up, you can breathe underwater, and you have a swimming speed of 60 feet."] },
    { index: "crystal-ball", name: "Crystal Ball", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 50000, unit: "gp" }, weight: 3, rarity: "Very Rare", desc: ["A typical crystal ball, a very rare item, is about 6 inches in diameter. While touching it, you can cast the scrying spell (save DC 17) with it."], requires_attunement: true },
    { index: "cube-of-force", name: "Cube of Force", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 4000, unit: "gp" }, weight: 0, rarity: "Rare", desc: ["This cube is about an inch across. You can use an action to press one of the cube's faces, expending a number of charges to create a barrier of invisible force (Blocks wind, non-living matter, living matter, magic, or everything)."], requires_attunement: true },
    { index: "decanter-of-endless-water", name: "Decanter of Endless Water", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 500, unit: "gp" }, weight: 2, rarity: "Uncommon", desc: ["This stoppered flask sloshes when shaken, as if it contains water. You can use an action to remove the stopper and speak one of three command words: 'Stream' (1 gallon), 'Fountain' (5 gallons), or 'Geyser' (30 gallons, knocks prone)."] },
    { index: "deck-of-many-things", name: "Deck of Many Things", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 150000, unit: "gp" }, weight: 0, rarity: "Legendary", desc: ["Usually found in a box or pouch, this deck contains a number of cards made of ivory or vellum. Each card depicts a different image. When you draw a card, its magic takes effect. Warning: This item can drastically alter your campaign."] },
    { index: "dimensional-shackles", name: "Dimensional Shackles", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 6000, unit: "gp" }, weight: 0, rarity: "Rare", desc: ["You can use an action to place these shackles on an incapacitated creature. The shackles adjust to fit a creature of Small to Large size. In addition to serving as mundane manacles, the shackles prevent a creature bound by them from using any method of extradimensional movement, including teleportation or travel to a different plane of existence."] },
    { index: "driftglobe", name: "Driftglobe", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 200, unit: "gp" }, weight: 1, rarity: "Uncommon", desc: ["This small sphere of thick glass weighs 1 pound. If you are within 60 feet of it, you can speak its command word and cause it to emanate the light or daylight spell. You can also command it to float and follow you."] },
    { index: "dust-of-dryness", name: "Dust of Dryness", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 150, unit: "gp" }, weight: 0, rarity: "Uncommon", desc: ["This small packet contains 1d6 + 4 pinches of dust. You can use an action to sprinkle a pinch of it over water. The dust turns a cube of water 15 feet on a side into a marble-sized pellet, which floats or rests near where the dust was sprinkled."] },
    { index: "dust-of-sneezing-choking", name: "Dust of Sneezing and Choking", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 100, unit: "gp" }, weight: 0, desc: ["Cursed. When you cast this dust into the air, you and each creature that needs to breathe within 30 feet of you must succeed on a DC 15 Constitution saving throw or become unable to breathe while sneezing uncontrollably."] },
    { index: "efreeti-bottle", name: "Efreeti Bottle", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 120000, unit: "gp" }, weight: 1, desc: ["This painted brass bottle weighs 1 pound. When you use an action to remove the stopper, a cloud of thick smoke flows out of the bottle. At the end of your turn, the smoke disappears, and an Efreeti appears in an unoccupied space within 30 feet of you. Roll d100 to determine if it attacks, serves, or grants wishes."] },
    { index: "elemental-gem", name: "Elemental Gem", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 200, unit: "gp" }, weight: 0, desc: ["This gem contains a mote of elemental energy. When you use an action to break the gem, an elemental is summoned as if you had cast the conjure elemental spell, and the gem is destroyed."] },
    { index: "eversmoking-bottle", name: "Eversmoking Bottle", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 300, unit: "gp" }, weight: 1, desc: ["Smoke leaks from the lead-stoppered mouth of this brass bottle. When you use an action to remove the stopper, a cloud of thick smoke pours out in a 60-foot radius from the bottle. The cloud's area is heavily obscured."] },
    { index: "eyes-of-charming", name: "Eyes of Charming", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 400, unit: "gp" }, weight: 0, desc: ["These crystal lenses fit over the eyes. While wearing them, you can use an action to cast the charm person spell (save DC 13) on a humanoid within 30 feet of you, provided that you and the target can see each other. The lenses have 3 charges."], requires_attunement: true },
    { index: "eyes-of-eagle", name: "Eyes of the Eagle", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 300, unit: "gp" }, weight: 0, desc: ["These crystal lenses fit over the eyes. While wearing them, you have advantage on Wisdom (Perception) checks that rely on sight. In conditions of clear visibility, you can make out details of even extremely distant creatures and objects as small as 2 feet across."], requires_attunement: true },
    { index: "eyes-of-minute-seeing", name: "Eyes of Minute Seeing", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 300, unit: "gp" }, weight: 0, desc: ["These crystal lenses fit over the eyes. While wearing them, you can see much better than normal out to a range of 1 foot. You have advantage on Intelligence (Investigation) checks that rely on sight while searching an area or studying an object within that range."] },
    { index: "figurine-wondrous-power", name: "Figurine of Wondrous Power", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 1000, unit: "gp" }, weight: 0, desc: ["A statuette of a beast. You can use an action to speak the command word and throw the figurine to a point on the ground within 60 feet of you. The figurine becomes a living creature (e.g. Ebony Fly, Golden Lions)."] },
    { index: "gem-of-seeing", name: "Gem of Seeing", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 5000, unit: "gp" }, weight: 0, desc: ["This gem has 3 charges. As an action, you can speak the gem's command word and spend 1 charge. For the next 10 minutes, you have truesight out to 120 feet when you peer through the gem."], requires_attunement: true },
    { index: "gloves-missile-snaring", name: "Gloves of Missile Snaring", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 300, unit: "gp" }, weight: 0, desc: ["These gloves seem to almost meld into your hands when you don them. When a ranged weapon attack hits you while you're wearing them, you can use your reaction to reduce the damage by 1d10 + your Dexterity modifier, provided that you have a free hand."], requires_attunement: true },
    { index: "gloves-swimming-climbing", name: "Gloves of Swimming and Climbing", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 400, unit: "gp" }, weight: 0, desc: ["While wearing these gloves, climbing and swimming doesn't cost you extra movement, and you gain a +5 bonus to Strength (Athletics) checks made to climb or swim."], requires_attunement: true },
    { index: "helm-of-brilliance", name: "Helm of Brilliance", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 60000, unit: "gp" }, weight: 0, desc: ["This helm is set with diamonds, rubies, fire opals, and opals. It grants resistance to fire damage, allows you to cast various light-based spells (Daylight, Fireball, Prismatic Spray, Wall of Fire), and makes your weapon glow."], modifiers: [{type: 'resistance', target: 'resistance', filter: 'Fire', value: 1}], requires_attunement: true },
    { index: "helm-comprehending-languages", name: "Helm of Comprehending Languages", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 400, unit: "gp" }, weight: 0, desc: ["While wearing this helm, you can use an action to cast the comprehend languages spell from it at will."] },
    { index: "helm-of-telepathy", name: "Helm of Telepathy", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 5000, unit: "gp" }, weight: 0, desc: ["While wearing this helm, you can use an action to cast the detect thoughts spell (save DC 13) from it. As long as you maintain concentration on the spell, you can use a bonus action to send a telepathic message to a creature you are focused on."], requires_attunement: true },
    { index: "helm-of-teleportation", name: "Helm of Teleportation", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 20000, unit: "gp" }, weight: 0, desc: ["This helm has 3 charges. While wearing it, you can use an action and expend 1 charge to cast the teleport spell from it."], requires_attunement: true },
    { index: "hewizard-handy-haversack", name: "Heward's Handy Haversack", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 3000, unit: "gp" }, weight: 5, desc: ["A backpack with extradimensional spaces. The side pouches hold 20 pounds, the main holds 80. The weight of the haversack is always 5 pounds. Retrieving an item takes an action."] },
    { index: "horn-of-blasting", name: "Horn of Blasting", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 2500, unit: "gp" }, weight: 2, desc: ["You can use an action to speak the horn's command word and then blow the horn, which emits a thunderous blast in a 30-foot cone. Each creature in the cone must make a DC 15 Constitution saving throw. On a failed save, a creature takes 5d6 thunder damage and is deafened for 1 minute."] },
    { index: "horseshoes-of-speed", name: "Horseshoes of Speed", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 5000, unit: "gp" }, weight: 0, desc: ["These iron horseshoes come in a set of four. While all four shoes are affixed to the hooves of a horse or similar creature, they increase the creature's walking speed by 30 feet."] },
    { index: "horseshoes-of-zephyr", name: "Horseshoes of a Zephyr", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 5000, unit: "gp" }, weight: 0, desc: ["These four iron horseshoes allow a horse or similar creature to float 4 inches above the ground. The creature can cross any liquid or unstable surface and ignores difficult terrain."] },
    { index: "immovable-rod", name: "Immovable Rod", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 2000, unit: "gp" }, weight: 2, desc: ["This flat iron rod has a button on one end. You can use an action to press the button, which causes the rod to become magically fixed in place. Until you or another creature uses an action to push the button again, the rod doesn't move, even if it is defying gravity. The rod can hold up to 8,000 pounds of weight."] },
    { index: "instrument-of-the-bards", name: "Instrument of the Bards", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 3000, unit: "gp" }, weight: 0, desc: ["An instrument that grants various spells (Fly, Invisibility, Levitate, etc) and imposes disadvantage on saves against your charm spells."], requires_attunement: true, attunement_description: "by a bard" },
    { index: "ioun-stone", name: "Ioun Stone", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 5000, unit: "gp" }, weight: 0, desc: ["A stone that orbits your head. Effects vary based on color (e.g. Absorption, Agility, Fortitude, Insight, Intellect, Leadership, Mastery, Protection, Regeneration, Reserve, Strength, Sustenance)."], requires_attunement: true },
    { index: "iron-bands-of-bilarro", name: "Iron Bands of Bilarro", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 4500, unit: "gp" }, weight: 1, desc: ["This rusty iron sphere measures 3 inches in diameter. You can use an action to speak the command word and throw the sphere at a creature within 60 feet. The sphere opens and attempts to restrain the creature (DC 20 Strength check to break)."] },
    { index: "iron-flask", name: "Iron Flask", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 150000, unit: "gp" }, weight: 1, desc: ["This metal bottle can hold a creature from another plane. You can use an action to release the creature, which serves you for 1 hour."] },
    { index: "lantern-of-revealing", name: "Lantern of Revealing", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 3000, unit: "gp" }, weight: 2, desc: ["While lit, this hooded lantern burns for 6 hours on 1 pint of oil, shedding bright light in a 30-foot radius. Invisible creatures and objects are visible as long as they are in the lantern's bright light."] },
    { 
        index: "mantle-of-spell-resistance", name: "Mantle of Spell Resistance", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 6000, unit: "gp" }, weight: 0, desc: ["You have advantage on saving throws against spells while you wear this cloak."],
        modifiers: [{ type: 'advantage', target: 'saves', value: 1, filter: 'Spells' }],
        requires_attunement: true
    },
    { 
        index: "manual-bodily-health", name: "Manual of Bodily Health", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 50000, unit: "gp" }, weight: 5, desc: ["This book contains health and diet tips. If you spend 48 hours over a period of 6 days or fewer studying the book's contents and practicing its guidelines, your Constitution score increases by 2, as does your maximum for that score."],
        modifiers: [{ type: 'bonus', target: 'con', value: 2 }] // Permanent effect, but can be modeled
    },
    { 
        index: "manual-gainful-exercise", name: "Manual of Gainful Exercise", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 50000, unit: "gp" }, weight: 5, desc: ["This book describes fitness exercises. If you spend 48 hours over a period of 6 days or fewer studying the book's contents and practicing its guidelines, your Strength score increases by 2, as does your maximum for that score."],
        modifiers: [{ type: 'bonus', target: 'str', value: 2 }]
    },
    { 
        index: "manual-quickness-action", name: "Manual of Quickness of Action", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 50000, unit: "gp" }, weight: 5, desc: ["This book contains coordination exercises. If you spend 48 hours over a period of 6 days or fewer studying the book's contents and practicing its guidelines, your Dexterity score increases by 2, as does your maximum for that score."],
        modifiers: [{ type: 'bonus', target: 'dex', value: 2 }]
    },
    { 
        index: "tome-clear-thought", name: "Tome of Clear Thought", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 50000, unit: "gp" }, weight: 5, desc: ["This book contains logic exercises. If you spend 48 hours over a period of 6 days or fewer studying the book's contents, your Intelligence score increases by 2, as does your maximum for that score."],
        modifiers: [{ type: 'bonus', target: 'int', value: 2 }]
    },
    { 
        index: "tome-leadership-influence", name: "Tome of Leadership and Influence", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 50000, unit: "gp" }, weight: 5, desc: ["This book contains guidelines for influencing others. If you spend 48 hours over a period of 6 days or fewer studying the book's contents, your Charisma score increases by 2, as does your maximum for that score."],
        modifiers: [{ type: 'bonus', target: 'cha', value: 2 }]
    },
    { 
        index: "tome-understanding", name: "Tome of Understanding", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 50000, unit: "gp" }, weight: 5, desc: ["This book contains intuition exercises. If you spend 48 hours over a period of 6 days or fewer studying the book's contents, your Wisdom score increases by 2, as does your maximum for that score."],
        modifiers: [{ type: 'bonus', target: 'wis', value: 2 }]
    },
    { index: "marvelous-pigments", name: "Nolzur's Marvelous Pigments", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 5000, unit: "gp" }, weight: 0, desc: ["Typically found in 1d4 pots inside a fine wooden box with a brush. Whatever you paint with these pigments becomes a real, nonmagical object."] },
    { index: "necklace-of-adaptation", name: "Necklace of Adaptation", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 400, unit: "gp" }, weight: 0, desc: ["While wearing this necklace, you can breathe normally in any environment, and you have advantage on saving throws made against harmful gases and vapors."], requires_attunement: true },
    { index: "necklace-of-fireballs", name: "Necklace of Fireballs", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 3000, unit: "gp" }, weight: 0, desc: ["This necklace has beads hanging from it. You can use an action to detach a bead and throw it up to 60 feet away. When it reaches the end of its trajectory, the bead detonates as a 3rd-level fireball spell (save DC 15)."] },
    { index: "necklace-of-prayer-beads", name: "Necklace of Prayer Beads", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 5000, unit: "gp" }, weight: 0, desc: ["This necklace has special magic beads. You can use a bonus action to cast a spell from a bead (Bless, Cure Wounds, Lesser Restoration, Greater Restoration, Branding Smite, Planar Ally, Wind Walk)."], requires_attunement: true, attunement_description: "by a cleric, druid, or paladin" },
    { index: "periapt-of-health", name: "Periapt of Health", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 300, unit: "gp" }, weight: 0, desc: ["You are immune to contracting any disease while you wear this pendant. If you are already infected with a disease, the effects of the disease are suppressed you while you wear the pendant."] },
    { index: "periapt-of-proof-poison", name: "Periapt of Proof against Poison", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 4000, unit: "gp" }, weight: 0, desc: ["This delicate silver chain has a brilliant-cut black gem pendant. While you wear it, poisons have no effect on you. You are immune to the poisoned condition and have immunity to poison damage."], modifiers: [{type: 'immunity', target: 'immunity', filter: 'Poison', value: 1}] },
    { index: "periapt-of-wound-closure", name: "Periapt of Wound Closure", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 400, unit: "gp" }, weight: 0, desc: ["While you wear this pendant, you stabilize whenever you are dying at the start of your turn. In addition, whenever you roll a Hit Die to regain hit points, double the number of hit points it restores."], requires_attunement: true },
    { index: "pipes-of-haunting", name: "Pipes of Haunting", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 3000, unit: "gp" }, weight: 2, desc: ["You can use an action to play these pipes and expend 1 charge to create an eerie, spellbinding tune. Each creature within 30 feet of you that hears you must succeed on a DC 15 Wisdom saving throw or become frightened of you for 1 minute."] },
    { index: "pipes-of-the-sewers", name: "Pipes of the Sewers", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 2000, unit: "gp" }, weight: 2, desc: ["While wearing these pipes, you have advantage on Charisma (Intimidation) checks. You can play the pipes to summon swarms of rats."], requires_attunement: true },
    { index: "portable-hole", name: "Portable Hole", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 4000, unit: "gp" }, weight: 0, desc: ["This fine black cloth, soft as silk, is folded up to the dimensions of a handkerchief. You can use an action to unfold a portable hole and place it on or against a solid surface, whereupon the portable hole creates an extradimensional hole 10 feet deep."] },
    { index: "robe-of-archmagi", name: "Robe of the Archmagi", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 75000, unit: "gp" }, weight: 0, desc: ["If you aren't wearing armor, your base Armor Class is 15 + your Dexterity modifier. You have advantage on saving throws against spells and other magical effects. Your spell save DC and spell attack bonus each increase by 2."], modifiers: [{type:'set', target: 'ac', value: 15}, {type: 'advantage', target: 'saves', value: 1, filter: 'Spells'}, {type:'bonus', target:'spell_dc', value:2}, {type:'bonus', target:'spell_attack', value:2}], requires_attunement: true, attunement_description: "by a sorcerer, warlock, or wizard" },
    { index: "robe-of-eyes", name: "Robe of Eyes", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 5000, unit: "gp" }, weight: 0, desc: ["This robe is adorned with tubelike eyes. You have advantage on Wisdom (Perception) checks, darkvision out to 120 feet, and can see invisible creatures/objects."], modifiers: [{type: 'advantage', target: 'skills', filter: 'Perception', value: 1}, {type:'bonus', target:'darkvision', value: 120}], requires_attunement: true },
    { index: "robe-of-stars", name: "Robe of Stars", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 50000, unit: "gp" }, weight: 0, desc: ["This black or dark blue robe is embroidered with small white or silver stars. You gain a +1 bonus to saving throws while you wear it. You can use an action to cast magic missile as a 5th-level spell. You can use an action to enter the Astral Plane."], modifiers: [{type:'bonus', target:'saves', value: 1}], requires_attunement: true },
    { index: "robe-of-useful-items", name: "Robe of Useful Items", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 2500, unit: "gp" }, weight: 0, desc: ["This robe has cloth patches of various shapes and colors covering it. You can use an action to detach one of the patches, causing it to become the object or creature it represents (Dagger, Lantern, Steel Mirror, Pole, Rope, Sack)."] },
    { index: "rope-of-climbing", name: "Rope of Climbing", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 200, unit: "gp" }, weight: 3, desc: ["This 60-foot length of silk rope weighs 3 pounds and can hold up to 3,000 pounds. You can command the rope to move/knot."] },
    { index: "rope-of-entanglement", name: "Rope of Entanglement", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 3000, unit: "gp" }, weight: 3, desc: ["This rope is 30 feet long and weighs 3 pounds. You can use an action to command the rope to restrain a creature within 20 feet of you (DC 15 Dexterity save)."] },
    { index: "scarab-of-protection", name: "Scarab of Protection", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 40000, unit: "gp" }, weight: 0, desc: ["If you hold this beetle-shaped medallion in your hand for 1 round, an inscription appears on its surface. While you wear it, you have advantage on saving throws against spells. It also absorbs necromantic damage/effects that would kill you."], modifiers: [{type:'advantage', target:'saves', value: 1, filter: 'Spells'}], requires_attunement: true },
    { index: "sending-stones", name: "Sending Stones", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 300, unit: "gp" }, weight: 0, desc: ["Sending stones come in pairs. While you touch one stone, you can use an action to cast the sending spell from it. The target is the bearer of the other stone. If no creature bears the other stone, you know that fact as soon as you use the stone and don't cast the spell."] },
    { index: "slippers-of-spider-climbing", name: "Slippers of Spider Climbing", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 500, unit: "gp" }, weight: 0, desc: ["While you wear these light shoes, you can move up, down, and across vertical surfaces and upside down along ceilings, while leaving your hands free. You have a climbing speed equal to your walking speed."], requires_attunement: true },
    { index: "sovereign-glue", name: "Sovereign Glue", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 50000, unit: "gp" }, weight: 0, desc: ["This viscous, milky-white substance can form a permanent adhesive bond between any two objects. It takes 1 minute to set. Once it has set, the bond can be broken only by the application of universal solvent, oil of etherealness, or a wish spell."] },
    { 
        index: "stone-of-good-luck", name: "Stone of Good Luck (Luckstone)", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 400, unit: "gp" }, weight: 0, desc: ["While this polished agate is on your person, you gain a +1 bonus to ability checks and saving throws."],
        modifiers: [
            { type: 'bonus', target: 'saves', value: 1 },
            { type: 'bonus', target: 'skills', value: 1 } // Approximating ability checks as skills
        ],
        requires_attunement: true
    },
    { index: "universal-solvent", name: "Universal Solvent", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 5000, unit: "gp" }, weight: 0, desc: ["This liquid appears to be milk or another cloudy liquid. It dissolves Sovereign Glue."] },
    { index: "well-of-many-worlds", name: "Well of Many Worlds", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 80000, unit: "gp" }, weight: 0, desc: ["This fine black cloth, soft as silk, is folded up to the dimensions of a handkerchief. You can use an action to unfold it and place it on a solid surface, creating a two-way portal to another plane of existence."] },
    { index: "wind-fan", name: "Wind Fan", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 400, unit: "gp" }, weight: 0, desc: ["While holding this fan, you can use an action to cast the gust of wind spell (save DC 13) from it."] },
    { index: "sphere-of-annihilation", name: "Sphere of Annihilation", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 100000, unit: "gp" }, weight: 0, desc: ["This 2-foot-diameter black sphere is a hole in the multiverse, hovering in space and stabilized by a magical field surrounding it. Anything that touches the sphere but isn't wholly engulfed by it takes 4d10 force damage. Anything wholly engulfed by the sphere is obliterated."] },
    
    // Rings
    { 
        index: "ring-of-protection", name: "Ring of Protection", equipment_category: { index: "ring", name: "Ring", url: "" }, cost: { quantity: 3500, unit: "gp" }, weight: 0, desc: ["You gain a +1 bonus to AC and saving throws while wearing this ring."],
        modifiers: [
            { type: 'bonus', target: 'ac', value: 1 },
            { type: 'bonus', target: 'saves', value: 1 }
        ],
        requires_attunement: true
    },
    { index: "ring-of-resistance", name: "Ring of Resistance", equipment_category: { index: "ring", name: "Ring", url: "" }, cost: { quantity: 6000, unit: "gp" }, weight: 0, desc: ["You have resistance to one damage type while wearing this ring. The gem in the ring indicates the type: Acid (Pearl), Cold (Tourmaline), Fire (Garnet), Force (Sapphire), Lightning (Citrine), Necrotic (Jet), Poison (Amethyst), Psychic (Jade), Radiant (Topaz), Thunder (Spinel)."], requires_attunement: true },
    { index: "ring-of-feather-falling", name: "Ring of Feather Falling", equipment_category: { index: "ring", name: "Ring", url: "" }, cost: { quantity: 2000, unit: "gp" }, weight: 0, desc: ["When you fall while wearing this ring, you descend 60 feet per round and take no damage from falling."], requires_attunement: true },
    { index: "ring-of-invisibility", name: "Ring of Invisibility", equipment_category: { index: "ring", name: "Ring", url: "" }, cost: { quantity: 50000, unit: "gp" }, weight: 0, desc: ["While wearing this ring, you can turn invisible as an action. Anything you are wearing or carrying is invisible with you. You remain invisible until the ring is removed, until you attack or cast a spell, or until you use a bonus action to become visible again."], requires_attunement: true },
    { index: "ring-of-spell-storing", name: "Ring of Spell Storing", equipment_category: { index: "ring", name: "Ring", url: "" }, cost: { quantity: 24000, unit: "gp" }, weight: 0, desc: ["This ring stores spells cast into it, holding them until the attuned wearer uses them. The ring can store up to 5 levels worth of spells at a time."], requires_attunement: true },
    { index: "ring-of-animal-influence", name: "Ring of Animal Influence", equipment_category: { index: "ring", name: "Ring", url: "" }, cost: { quantity: 4000, unit: "gp" }, weight: 0, desc: ["This ring has 3 charges. You can use an action to cast Animal Friendship (1 charge), Fear (on beasts, 1 charge), or Speak with Animals (1 charge)."] },
    { index: "ring-of-djinni-summoning", name: "Ring of Djinni Summoning", equipment_category: { index: "ring", name: "Ring", url: "" }, cost: { quantity: 120000, unit: "gp" }, weight: 0, desc: ["While wearing this ring, you can speak its command word as an action to summon a particular djinni from the Elemental Plane of Air. The djinni appears in an unoccupied space you choose within 120 feet of you."], requires_attunement: true },
    { index: "ring-of-elemental-command", name: "Ring of Elemental Command", equipment_category: { index: "ring", name: "Ring", url: "" }, cost: { quantity: 200000, unit: "gp" }, weight: 0, desc: ["This ring is linked to one of the four Elemental Planes (Air, Earth, Fire, or Water). It grants advantage on attacks vs that element type and disadv on their attacks vs you. If you kill an elemental while attuned, you gain more powers (resistances/spells)."], requires_attunement: true },
    { index: "ring-of-evasion", name: "Ring of Evasion", equipment_category: { index: "ring", name: "Ring", url: "" }, cost: { quantity: 5000, unit: "gp" }, weight: 0, desc: ["This ring has 3 charges. When you fail a Dexterity saving throw while wearing it, you can use your reaction to expend 1 of its charges to succeed on that saving throw instead."], requires_attunement: true },
    { index: "ring-of-free-action", name: "Ring of Free Action", equipment_category: { index: "ring", name: "Ring", url: "" }, cost: { quantity: 20000, unit: "gp" }, weight: 0, desc: ["While you wear this ring, difficult terrain doesn't cost you extra movement. In addition, magic can neither reduce your speed nor cause you to be paralyzed or restrained."], requires_attunement: true },
    { index: "ring-of-mind-shielding", name: "Ring of Mind Shielding", equipment_category: { index: "ring", name: "Ring", url: "" }, cost: { quantity: 500, unit: "gp" }, weight: 0, desc: ["While wearing this ring, you are immune to magic that allows other creatures to read your thoughts, determine whether you are lying, know your alignment, or know your creature type. Creatures can telepathically communicate with you only if you allow it. If you die, your soul enters the ring."], requires_attunement: true },
    { index: "ring-of-regeneration", name: "Ring of Regeneration", equipment_category: { index: "ring", name: "Ring", url: "" }, cost: { quantity: 50000, unit: "gp" }, weight: 0, desc: ["While wearing this ring, you regain 1d6 hit points every 10 minutes, provided that you have at least 1 hit point. If you lose a body part, the ring causes the missing part to regrow and return to full functionality after 1d6 + 1 days if you have at least 1 hit point the whole time."], requires_attunement: true },
    { index: "ring-of-shooting-stars", name: "Ring of Shooting Stars", equipment_category: { index: "ring", name: "Ring", url: "" }, cost: { quantity: 15000, unit: "gp" }, weight: 0, desc: ["While wearing this ring in dim light or darkness, you can cast Faerie Fire (1 ch), Lightning (ball of lightning, 2 ch), or Shooting Stars (4 ch)."], requires_attunement: true },
    { index: "ring-of-telekinesis", name: "Ring of Telekinesis", equipment_category: { index: "ring", name: "Ring", url: "" }, cost: { quantity: 60000, unit: "gp" }, weight: 0, desc: ["While wearing this ring, you can cast the telekinesis spell at will, but you can target only objects that aren't being worn or carried."], requires_attunement: true },
    { index: "ring-of-three-wishes", name: "Ring of Three Wishes", equipment_category: { index: "ring", name: "Ring", url: "" }, cost: { quantity: 120000, unit: "gp" }, weight: 0, desc: ["While wearing this ring, you can use an action to expend 1 of its 3 charges to cast the wish spell from it."] },
    { index: "ring-of-warmth", name: "Ring of Warmth", equipment_category: { index: "ring", name: "Ring", url: "" }, cost: { quantity: 1000, unit: "gp" }, weight: 0, desc: ["While wearing this ring, you have resistance to cold damage. In addition, you and everything you wear and carry are unharmed by temperatures as low as -50 degrees Fahrenheit."], modifiers: [{type:'resistance', target:'resistance', filter:'Cold', value: 1}], requires_attunement: true },
    { index: "ring-of-water-walking", name: "Ring of Water Walking", equipment_category: { index: "ring", name: "Ring", url: "" }, cost: { quantity: 1500, unit: "gp" }, weight: 0, desc: ["While wearing this ring, you can stand on and move across any liquid surface as if it were solid ground."] },
    { index: "ring-of-x-ray-vision", name: "Ring of X-ray Vision", equipment_category: { index: "ring", name: "Ring", url: "" }, cost: { quantity: 20000, unit: "gp" }, weight: 0, desc: ["While wearing this ring, you can use an action to speak its command word. When you do so, you can see into and through solid matter for 1 minute. You have darkvision out to a range of 30 feet."], requires_attunement: true },
    
    // Wands
    { 
        index: "wand-of-magic-missiles", name: "Wand of Magic Missiles", equipment_category: { index: "wand", name: "Wand", url: "" }, cost: { quantity: 300, unit: "gp" }, weight: 1, isSpellFocus: true,
        desc: ["This wand has 7 charges. While holding it, you can use an action to expend 1 or more of its charges to cast the magic missile spell from it. For 1 charge, you cast the 1st-level version of the spell. You can increase the spell slot level by one for each additional charge you expend."] 
    },
    { 
        index: "wand-of-web", name: "Wand of Web", equipment_category: { index: "wand", name: "Wand", url: "" }, cost: { quantity: 500, unit: "gp" }, weight: 1, isSpellFocus: true,
        desc: ["This wand has 7 charges. While holding it, you can use an action to expend 1 of its charges to cast the web spell (save DC 15) from it."],
        requires_attunement: true,
        attunement_description: "by a spellcaster"
    },
    { 
        index: "wand-of-fireballs", name: "Wand of Fireballs", equipment_category: { index: "wand", name: "Wand", url: "" }, cost: { quantity: 12000, unit: "gp" }, weight: 1, isSpellFocus: true,
        desc: ["This wand has 7 charges. While holding it, you can use an action to expend 1 or more of its charges to cast the fireball spell (save DC 15) from it. For 1 charge, you cast the 3rd-level version of the spell. You can increase the spell slot level by one for each additional charge you expend."],
        requires_attunement: true,
        attunement_description: "by a spellcaster"
    },
    { 
        index: "wand-of-lightning-bolts", name: "Wand of Lightning Bolts", equipment_category: { index: "wand", name: "Wand", url: "" }, cost: { quantity: 12000, unit: "gp" }, weight: 1, isSpellFocus: true,
        desc: ["This wand has 7 charges. While holding it, you can use an action to expend 1 or more of its charges to cast the lightning bolt spell (save DC 15) from it. For 1 charge, you cast the 3rd-level version of the spell. You can increase the spell slot level by one for each additional charge you expend."],
        requires_attunement: true,
        attunement_description: "by a spellcaster"
    },
    { 
        index: "wand-of-binding", name: "Wand of Binding", equipment_category: { index: "wand", name: "Wand", url: "" }, cost: { quantity: 20000, unit: "gp" }, weight: 1, isSpellFocus: true,
        desc: ["This wand has 7 charges. While holding it, you can use an action to cast Hold Monster (5 charges) or Hold Person (2 charges). Save DC 17."],
        requires_attunement: true,
        attunement_description: "by a spellcaster"
    },
    { 
        index: "wand-of-enemy-detection", name: "Wand of Enemy Detection", equipment_category: { index: "wand", name: "Wand", url: "" }, cost: { quantity: 2000, unit: "gp" }, weight: 1, isSpellFocus: true,
        desc: ["This wand has 7 charges. While holding it, you can use an action to cast the detect magic spell from it."],
        requires_attunement: true
    },
    { 
        index: "wand-of-fear", name: "Wand of Fear", equipment_category: { index: "wand", name: "Wand", url: "" }, cost: { quantity: 15000, unit: "gp" }, weight: 1, isSpellFocus: true,
        desc: ["This wand has 7 charges. While holding it, you can use an action to expend 1 charge to command creatures to flee or drop items (Save DC 15)."],
        requires_attunement: true
    },
    { 
        index: "wand-of-magic-detection", name: "Wand of Magic Detection", equipment_category: { index: "wand", name: "Wand", url: "" }, cost: { quantity: 400, unit: "gp" }, weight: 1, isSpellFocus: true,
        desc: ["This wand has 3 charges. While holding it, you can use an action to expend 1 of its charges to cast the detect magic spell from it."] 
    },
    { 
        index: "wand-of-paralysis", name: "Wand of Paralysis", equipment_category: { index: "wand", name: "Wand", url: "" }, cost: { quantity: 12000, unit: "gp" }, weight: 1, isSpellFocus: true,
        desc: ["This wand has 7 charges. While holding it, you can use an action to expend 1 of its charges to cause a thin blue ray to target a creature within 60 feet of you. The target must succeed on a DC 15 Constitution saving throw or be paralyzed for 1 minute."],
        requires_attunement: true,
        attunement_description: "by a spellcaster"
    },
    { 
        index: "wand-of-polymorph", name: "Wand of Polymorph", equipment_category: { index: "wand", name: "Wand", url: "" }, cost: { quantity: 50000, unit: "gp" }, weight: 1, isSpellFocus: true,
        desc: ["This wand has 7 charges. While holding it, you can use an action to expend 1 of its charges to cast the polymorph spell (save DC 15) from it."],
        requires_attunement: true,
        attunement_description: "by a spellcaster"
    },
    { 
        index: "wand-of-secrets", name: "Wand of Secrets", equipment_category: { index: "wand", name: "Wand", url: "" }, cost: { quantity: 500, unit: "gp" }, weight: 1, isSpellFocus: true,
        desc: ["This wand has 3 charges. While holding it, you can use an action to expend 1 of its charges to detect secret doors/traps within 60 feet."] 
    },
    { 
        index: "wand-of-the-war-mage-1", name: "Wand of the War Mage +1", equipment_category: { index: "wand", name: "Wand", url: "" }, cost: { quantity: 500, unit: "gp" }, weight: 1, isSpellFocus: true, desc: ["You gain a +1 bonus to spell attack rolls. In addition, you ignore half cover when making a spell attack."],
        modifiers: [{ type: 'bonus', target: 'spell_attack', value: 1 }],
        requires_attunement: true,
        attunement_description: "by a spellcaster"
    },
    { 
        index: "wand-of-the-war-mage-2", name: "Wand of the War Mage +2", equipment_category: { index: "wand", name: "Wand", url: "" }, cost: { quantity: 4000, unit: "gp" }, weight: 1, isSpellFocus: true, desc: ["You gain a +2 bonus to spell attack rolls. In addition, you ignore half cover when making a spell attack."],
        modifiers: [{ type: 'bonus', target: 'spell_attack', value: 2 }],
        requires_attunement: true,
        attunement_description: "by a spellcaster"
    },
    { 
        index: "wand-of-the-war-mage-3", name: "Wand of the War Mage +3", equipment_category: { index: "wand", name: "Wand", url: "" }, cost: { quantity: 20000, unit: "gp" }, weight: 1, isSpellFocus: true, desc: ["You gain a +3 bonus to spell attack rolls. In addition, you ignore half cover when making a spell attack."],
        modifiers: [{ type: 'bonus', target: 'spell_attack', value: 3 }],
        requires_attunement: true,
        attunement_description: "by a spellcaster"
    },
    { index: "wand-of-wonder", name: "Wand of Wonder", equipment_category: { index: "wand", name: "Wand", url: "" }, cost: { quantity: 12000, unit: "gp" }, weight: 1, isSpellFocus: true, desc: ["This wand has 7 charges. While holding it, you can use an action to expend 1 of its charges and choose a target within 120 feet of you. The target can be a creature, an object, or a point in space. Roll d100 on the Wand of Wonder table to determine the effect."],
        requires_attunement: true,
        attunement_description: "by a spellcaster"
    },
    
    // Arcane Grimoires
    { 
        index: "arcane-grimoire-1", name: "Arcane Grimoire +1", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 500, unit: "gp" }, weight: 2, rarity: "Uncommon", isSpellFocus: true,
        desc: ["While you are holding this leather-bound book, you can use it as a spellcasting focus for your wizard spells, and you gain a +1 bonus to spell attack rolls and to the saving throw DCs of your wizard spells.", "In addition, when you use your Arcane Recovery feature, you can increase the number of spell slot levels you regain by 1."],
        modifiers: [
            { type: 'bonus', target: 'spell_attack', value: 1 },
            { type: 'bonus', target: 'spell_dc', value: 1 }
        ],
        requires_attunement: true,
        attunement_description: "by a wizard"
    },
    { 
        index: "arcane-grimoire-2", name: "Arcane Grimoire +2", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 4000, unit: "gp" }, weight: 2, rarity: "Rare", isSpellFocus: true,
        desc: ["While you are holding this leather-bound book, you can use it as a spellcasting focus for your wizard spells, and you gain a +2 bonus to spell attack rolls and to the saving throw DCs of your wizard spells.", "In addition, when you use your Arcane Recovery feature, you can increase the number of spell slot levels you regain by 1."],
        modifiers: [
            { type: 'bonus', target: 'spell_attack', value: 2 },
            { type: 'bonus', target: 'spell_dc', value: 2 }
        ],
        requires_attunement: true,
        attunement_description: "by a wizard"
    },
    { 
        index: "arcane-grimoire-3", name: "Arcane Grimoire +3", equipment_category: { index: "wondrous-items", name: "Wondrous Items", url: "" }, cost: { quantity: 20000, unit: "gp" }, weight: 2, rarity: "Very Rare", isSpellFocus: true,
        desc: ["While you are holding this leather-bound book, you can use it as a spellcasting focus for your wizard spells, and you gain a +3 bonus to spell attack rolls and to the saving throw DCs of your wizard spells.", "In addition, when you use your Arcane Recovery feature, you can increase the number of spell slot levels you regain by 1."],
        modifiers: [
            { type: 'bonus', target: 'spell_attack', value: 3 },
            { type: 'bonus', target: 'spell_dc', value: 3 }
        ],
        requires_attunement: true,
        attunement_description: "by a wizard"
    }
];
