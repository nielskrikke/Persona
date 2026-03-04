
import { BackgroundDetail } from '../types';

export const BACKGROUNDS: BackgroundDetail[] = [
    {
        index: "acolyte",
        name: "Acolyte",
        source: "Player's Handbook",
        skill_proficiencies: ["Insight", "Religion"],
        languages: 2,
        equipment: ["Holy Symbol", "Prayer book", "5 sticks of incense", "Vestments", "Common clothes"],
        currency: { cp: 0, sp: 0, ep: 0, gp: 15, pp: 0 },
        feature: {
            name: "Shelter of the Faithful",
            desc: ["You command the respect of those who share your faith, and you can perform religious ceremonies. You and your companions can receive free healing at a temple of your faith."]
        }
    },
    {
        index: "anthropologist",
        name: "Anthropologist",
        source: "Tomb of Annihilation",
        skill_proficiencies: ["Insight", "Religion"],
        languages: 2,
        equipment: ["Leather-bound diary", "Ink pen", "Bottle of ink", "Traveler's clothes", "Trinket of a culture you studied"],
        currency: { cp: 0, sp: 0, ep: 0, gp: 10, pp: 0 },
        feature: {
            name: "Adept Linguist",
            desc: ["You can communicate with any humanoid that has a language by spending 1 day observing them, allowing you to convey simple ideas."]
        }
    },
    {
        index: "archaeologist",
        name: "Archaeologist",
        source: "Tomb of Annihilation",
        skill_proficiencies: ["History", "Survival"],
        tool_proficiencies: ["Cartographer's tools"],
        languages: 1,
        equipment: ["Wooden case with ink and pens", "Map of a ruin", "Bullseye lantern", "Miner's pick", "Traveler's clothes"],
        currency: { cp: 0, sp: 0, ep: 0, gp: 25, pp: 0 },
        feature: {
            name: "Historical Knowledge",
            desc: ["When you enter a ruin or dungeon, you can ascertain its original purpose and determine its creators."]
        }
    },
    {
        index: "charlatan",
        name: "Charlatan",
        source: "Player's Handbook",
        skill_proficiencies: ["Deception", "Sleight of Hand"],
        tool_proficiencies: ["Disguise Kit", "Forgery Kit"],
        equipment: ["Fine clothes", "Disguise kit", "Tools of a con"],
        currency: { cp: 0, sp: 0, ep: 0, gp: 15, pp: 0 },
        feature: {
            name: "False Identity",
            desc: ["You have created a second identity that includes documentation and established acquaintances."]
        }
    },
    {
        index: "criminal",
        name: "Criminal",
        source: "Player's Handbook",
        skill_proficiencies: ["Deception", "Stealth"],
        tool_proficiencies: ["Thieves' tools"],
        proficiency_choices: [{
            choose: 1,
            type: "proficiencies",
            from: { options: makeOptions(["Dice set", "Playing card set"]) }
        }],
        equipment: ["Crowbar", "Dark clothes with a hood"],
        currency: { cp: 0, sp: 0, ep: 0, gp: 15, pp: 0 },
        feature: {
            name: "Criminal Contact",
            desc: ["You have a reliable contact who acts as your liaison to a network of other criminals."]
        }
    },
    {
        index: "entertainer",
        name: "Entertainer",
        source: "Player's Handbook",
        skill_proficiencies: ["Acrobatics", "Performance"],
        tool_proficiencies: ["Disguise Kit"],
        proficiency_choices: [{
            choose: 1,
            type: "proficiencies",
            from: { options: makeOptions(["Lute", "Drum", "Flute", "Lyre", "Viol"]) }
        }],
        equipment: ["Musical instrument", "Costume"],
        currency: { cp: 0, sp: 0, ep: 0, gp: 15, pp: 0 },
        feature: {
            name: "By Popular Demand",
            desc: ["You can always find a place to perform and receive free lodging/food in return."]
        }
    },
    {
        index: "far-traveler",
        name: "Far Traveler",
        source: "Sword Coast Adventurer's Guide",
        skill_proficiencies: ["Insight", "Perception"],
        languages: 1,
        proficiency_choices: [{
            choose: 1,
            type: "proficiencies",
            from: { options: makeOptions(["Lute", "Chess set", "Dice set"]) }
        }],
        equipment: ["Traveler's clothes", "Any instrument or gaming set", "Poorly drawn maps"],
        currency: { cp: 0, sp: 0, ep: 0, gp: 5, pp: 0 },
        feature: {
            name: "All Eyes on You",
            desc: ["Your accent and manners mark you as foreign. People are curious and often go out of their way to help or talk to you."]
        }
    },
    {
        index: "folk-hero",
        name: "Folk Hero",
        source: "Player's Handbook",
        skill_proficiencies: ["Animal Handling", "Survival"],
        tool_proficiencies: ["Land vehicles"],
        proficiency_choices: [{
            choose: 1,
            type: "proficiencies",
            from: { options: makeOptions(["Carpenter's tools", "Smith's tools", "Tinker's tools", "Weaver's tools"]) }
        }],
        equipment: ["Artisan's tools", "Shovel", "Iron pot", "Common clothes"],
        currency: { cp: 0, sp: 0, ep: 0, gp: 10, pp: 0 },
        feature: {
            name: "Rustic Hospitality",
            desc: ["Common folk fit in with you. You can find a place to hide or rest among commoners."]
        }
    },
    {
        index: "gladiator",
        name: "Gladiator (Entertainer Variant)",
        source: "Player's Handbook",
        skill_proficiencies: ["Acrobatics", "Performance"],
        tool_proficiencies: ["Disguise Kit"],
        proficiency_choices: [{
            choose: 1,
            type: "proficiencies",
            from: { options: makeOptions(["Net", "Trident", "Shortsword"]) }
        }],
        equipment: ["Inexpensive weapon", "Costume"],
        currency: { cp: 0, sp: 0, ep: 0, gp: 15, pp: 0 },
        feature: {
            name: "By Popular Demand",
            desc: ["You can always find a place to fight or perform for the crowd."]
        }
    },
    {
        index: "guild-artisan",
        name: "Guild Artisan",
        source: "Player's Handbook",
        skill_proficiencies: ["Insight", "Persuasion"],
        languages: 1,
        proficiency_choices: [{
            choose: 1,
            type: "proficiencies",
            from: { options: makeOptions(["Alchemist's supplies", "Brewer's supplies", "Jeweler's tools", "Leatherworker's tools", "Mason's tools", "Painter's supplies", "Potter's tools", "Smith's tools", "Tinker's tools", "Woodcarver's tools"]) }
        }],
        equipment: ["Artisan's tools", "Letter of introduction", "Traveler's clothes"],
        currency: { cp: 0, sp: 0, ep: 0, gp: 15, pp: 0 },
        feature: {
            name: "Guild Membership",
            desc: ["You have access to guild halls and can receive support from your guild and fellow artisans."]
        }
    },
    {
        index: "haunted-one",
        name: "Haunted One",
        source: "Curse of Strahd",
        skill_proficiencies: [],
        proficiency_choices: [{
            choose: 2,
            type: "proficiencies",
            from: { options: makeOptions(["Arcana", "Investigation", "Religion", "Survival"], "Skill: ") }
        }],
        languages: 1,
        equipment: ["Monster hunter's pack", "Common clothes"],
        currency: { cp: 0, sp: 1, ep: 0, gp: 0, pp: 0 },
        feature: {
            name: "Heart of Darkness",
            desc: ["Those who look into your eyes see you have faced horror. Commoners will help you if you are not a threat."]
        }
    },
    {
        index: "hermit",
        name: "Hermit",
        source: "Player's Handbook",
        skill_proficiencies: ["Medicine", "Religion"],
        tool_proficiencies: ["Herbalism Kit"],
        languages: 1,
        equipment: ["Notes from your seclusion", "Winter blanket", "Common clothes", "Herbalism kit"],
        currency: { cp: 0, sp: 0, ep: 0, gp: 5, pp: 0 },
        feature: {
            name: "Discovery",
            desc: ["You made a unique and powerful discovery during your seclusion."]
        }
    },
    {
        index: "knight",
        name: "Knight (Noble Variant)",
        source: "Player's Handbook",
        skill_proficiencies: ["History", "Persuasion"],
        languages: 1,
        proficiency_choices: [{
            choose: 1,
            type: "proficiencies",
            from: { options: makeOptions(["Dice set", "Dragonchess set"]) }
        }],
        equipment: ["Fine clothes", "Signet ring", "Banner"],
        currency: { cp: 0, sp: 0, ep: 0, gp: 25, pp: 0 },
        feature: {
            name: "Retainers",
            desc: ["You have the service of three retainers loyal to your family."]
        }
    },
    {
        index: "noble",
        name: "Noble",
        source: "Player's Handbook",
        skill_proficiencies: ["History", "Persuasion"],
        languages: 1,
        proficiency_choices: [{
            choose: 1,
            type: "proficiencies",
            from: { options: makeOptions(["Dice set", "Dragonchess set"]) }
        }],
        equipment: ["Fine clothes", "Signet ring", "Scroll of pedigree"],
        currency: { cp: 0, sp: 0, ep: 0, gp: 25, pp: 0 },
        feature: {
            name: "Position of Privilege",
            desc: ["You are welcome in high society and people incline to think the best of you."]
        }
    },
    {
        index: "outlander",
        name: "Outlander",
        source: "Player's Handbook",
        skill_proficiencies: ["Athletics", "Survival"],
        languages: 1,
        proficiency_choices: [{
            choose: 1,
            type: "proficiencies",
            from: { options: makeOptions(["Flute", "Horn", "Drum"]) }
        }],
        equipment: ["Staff", "Hunting trap", "Animal trophy", "Traveler's clothes"],
        currency: { cp: 0, sp: 0, ep: 0, gp: 10, pp: 0 },
        feature: {
            name: "Wanderer",
            desc: ["You have an excellent memory for maps and geography, allowing you to always recall the general layout of terrain."]
        }
    },
    {
        index: "pirate",
        name: "Pirate (Sailor Variant)",
        source: "Player's Handbook",
        skill_proficiencies: ["Athletics", "Perception"],
        tool_proficiencies: ["Navigator's tools", "Water vehicles"],
        equipment: ["Belaying pin (club)", "50 feet of silk rope", "Lucky charm", "Common clothes"],
        currency: { cp: 0, sp: 0, ep: 0, gp: 10, pp: 0 },
        feature: {
            name: "Bad Reputation",
            desc: ["People are afraid of you. You can get away with minor misdeeds in civilizations because people are too scared to report you."]
        }
    },
    {
        index: "sage",
        name: "Sage",
        source: "Player's Handbook",
        skill_proficiencies: ["Arcana", "History"],
        languages: 2,
        equipment: ["Bottle of ink", "Quill", "Small knife", "Letter from a dead colleague", "Common clothes"],
        currency: { cp: 0, sp: 0, ep: 0, gp: 10, pp: 0 },
        feature: {
            name: "Researcher",
            desc: ["When you attempt to recall lore, you know where and from whom you can obtain it if you don't know it already."]
        }
    },
    {
        index: "sailor",
        name: "Sailor",
        source: "Player's Handbook",
        skill_proficiencies: ["Athletics", "Perception"],
        tool_proficiencies: ["Navigator's tools", "Water vehicles"],
        equipment: ["Belaying pin (club)", "50 feet of silk rope", "Lucky charm", "Common clothes"],
        currency: { cp: 0, sp: 0, ep: 0, gp: 10, pp: 0 },
        feature: {
            name: "Ship's Passage",
            desc: ["You can secure free passage on a sailing ship for yourself and your companions."]
        }
    },
    {
        index: "soldier",
        name: "Soldier",
        source: "Player's Handbook",
        skill_proficiencies: ["Athletics", "Intimidation"],
        tool_proficiencies: ["Land vehicles"],
        proficiency_choices: [{
            choose: 1,
            type: "proficiencies",
            from: { options: makeOptions(["Dice set", "Dragonchess set", "Playing card set"]) }
        }],
        equipment: ["Insignia of rank", "Trophy from fallen enemy", "Common clothes"],
        currency: { cp: 0, sp: 0, ep: 0, gp: 10, pp: 0 },
        feature: {
            name: "Military Rank",
            desc: ["Soldiers loyal to your former organization still recognize your authority."]
        }
    },
    {
        index: "spy",
        name: "Spy (Criminal Variant)",
        source: "Player's Handbook",
        skill_proficiencies: ["Deception", "Stealth"],
        tool_proficiencies: ["Thieves' tools"],
        proficiency_choices: [{
            choose: 1,
            type: "proficiencies",
            from: { options: makeOptions(["Dice set", "Playing card set"]) }
        }],
        equipment: ["Crowbar", "Dark clothes with a hood"],
        currency: { cp: 0, sp: 0, ep: 0, gp: 15, pp: 0 },
        feature: {
            name: "Spy Contact",
            desc: ["You have a reliable contact who acts as your liaison to a network of other spies."]
        }
    },
    {
        index: "urchin",
        name: "Urchin",
        source: "Player's Handbook",
        skill_proficiencies: ["Sleight of Hand", "Stealth"],
        tool_proficiencies: ["Disguise Kit", "Thieves' tools"],
        equipment: ["Small knife", "Map of your city", "Pet mouse", "Common clothes"],
        currency: { cp: 0, sp: 0, ep: 0, gp: 10, pp: 0 },
        feature: {
            name: "City Secrets",
            desc: ["You know the secret patterns and flow to cities and can find passages through the urban sprawl."]
        }
    },
    {
        index: "urban-bounty-hunter",
        name: "Urban Bounty Hunter",
        source: "Sword Coast Adventurer's Guide",
        skill_proficiencies: [],
        proficiency_choices: [
            {
                choose: 2,
                type: "proficiencies",
                from: { options: makeOptions(["Deception", "Insight", "Persuasion", "Stealth"], "Skill: ") }
            },
            {
                choose: 2,
                type: "proficiencies",
                from: { options: makeOptions(["Dice set", "Playing card set", "Thieves' tools", "Musical instrument"]) }
            }
        ],
        equipment: ["Clothes appropriate to your niche", "Pouch with 20gp"],
        currency: { cp: 0, sp: 0, ep: 0, gp: 20, pp: 0 },
        feature: {
            name: "Ear to the Ground",
            desc: ["You have frequent contact with people in the segment of society that your work brings you into contact with."]
        }
    }
];

function makeOptions(items: string[], prefix: string = "") {
    return items.map(s => ({
        item: { index: s.toLowerCase().replace(/\s+/g, '-'), name: prefix + s, url: "" }
    }));
}
