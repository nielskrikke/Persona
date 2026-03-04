import { SubclassDetail, ClassFeature } from '../types';

export type SubclassFeatureModifier = 
    | { type: 'bonus_action'; name: string; description: string }
    | { type: 'action'; name: string; description: string }
    | { type: 'reaction'; name: string; description: string }
    | { type: 'stat_bonus'; stat: 'initiative' | 'ac' | 'speed' | 'hp_per_level' | 'darkvision' | 'passive_perception'; value: number }
    | { type: 'stat_bonus_attribute'; stat: 'initiative' | 'ac'; attribute: 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha' }
    | { type: 'proficiency'; target: string; category: 'skill' | 'tool' | 'armor' | 'weapon' | 'save' }
    | { type: 'proficiency_choice'; category: 'skill' | 'tool' | 'language' | 'weapon'; count: number; options?: string[] }
    | { type: 'expertise_choice'; category: 'skill' | 'tool'; count: number; options?: string[] }
    | { type: 'resistance'; damage_type: string }
    | { type: 'immunity'; condition: string }
    | { type: 'advantage'; key: string; label: string }
    | { type: 'spell_access'; spell?: string; school?: string; level?: number; count?: number; cast_free?: boolean; ritual?: boolean }
    | { type: 'feature'; name: string; description: string };

export interface ExtendedClassFeature extends ClassFeature {
    effects?: SubclassFeatureModifier[];
}

export interface ExtendedSubclassDetail extends SubclassDetail {
    source: string;
    feature_details: ExtendedClassFeature[];
}

export const SUBCLASSES: ExtendedSubclassDetail[] = [
    // --- ARROWSMITH SPECIALIZATIONS ---
    {
        index: "magic-as",
        name: "Magic Specialization",
        source: "Arrowsmith Specialization",
        class: { index: "arrowsmith", name: "Arrowsmith", url: "" },
        desc: ["Focusing on magical / elemental effects, this specialization gives you access to magical arrows."],
        feature_details: [
            { 
                index: "magic-as-prof", name: "Magic Arrowsmith", level: 5, source: "Magic Specialization", url: "", 
                desc: ["Gain proficiency in Calligrapher's Supplies. You gain access to the Magic Arrows table: Elemental Arrow, Spectral Arrow, Cursed Arrow, Seeking Arrow, and Shifter Arrow."],
                effects: [{ type: 'proficiency', target: "Calligrapher's Supplies", category: 'tool' }]
            },
            { index: "arcane-shot-as", name: "Arcane Shot", level: 8, source: "Magic Specialization", url: "", desc: ["At 8th level, all Custom Arrows now count as magical for the sake of overcoming resistances."] },
            { index: "magic-trick-as", name: "Magic Trick", level: 11, source: "Magic Specialization", url: "", desc: ["At 11th level, whenever you crit on a ranged attack with a Custom Arrow, the arrow returns to your quiver."] },
            { index: "wise-aim-as", name: "Wise Aim", level: 14, source: "Magic Specialization", url: "", desc: ["At 14th level, you can add your wisdom modifier plus your proficiency bonus to the damage of a ranged attack as psychic damage."] }
        ]
    },
    {
        index: "toxins-as",
        name: "Toxins Specialization",
        source: "Arrowsmith Specialization",
        class: { index: "arrowsmith", name: "Arrowsmith", url: "" },
        desc: ["Focuses on poisons and natural effects caused by toxin-laced Custom Arrows."],
        feature_details: [
            { 
                index: "toxin-as-prof", name: "Toxins Arrowsmith", level: 5, source: "Toxins Specialization", url: "", 
                desc: ["Gain proficiency in Alchemist's tools. You gain access to the Toxins Arrows table: Intoxicating Arrow, Paralytic Arrow, Toxic Cloud Arrow, Furious Arrow, and Sleeping Arrow. Effects are guaranteed on a crit."],
                effects: [{ type: 'proficiency', target: "Alchemist's tools", category: 'tool' }]
            },
            { index: "sickly-arrows-as", name: "Sickly Arrows", level: 8, source: "Toxins Specialization", url: "", desc: ["At 8th level, all Custom Arrows deal an additional 1d10 poison damage."] },
            { index: "icy-arrows-as", name: "Icy Arrows", level: 11, source: "Toxins Specialization", url: "", desc: ["At 11th level, all Custom Arrows deal an additional 1d10 cold damage and slow the target by 5ft (stacks up to 15ft)."] },
            { 
                index: "build-up-resistance-as", name: "Build Up Resistance", level: 14, source: "Toxins Specialization", url: "", 
                desc: ["At 14th level, gain proficiency in constitution saving throws (or expertise) and resistance to poison."],
                effects: [{ type: 'proficiency', target: 'CON', category: 'save' }, { type: 'resistance', damage_type: 'Poison' }]
            }
        ]
    },
    {
        index: "support-as",
        name: "Support Specialization",
        source: "Arrowsmith Specialization",
        class: { index: "arrowsmith", name: "Arrowsmith", url: "" },
        desc: ["Focuses on Custom Arrows that can be helpful to their target."],
        feature_details: [
            { 
                index: "support-as-prof", name: "Support Arrowsmith", level: 5, source: "Support Specialization", url: "", 
                desc: ["Gain proficiency in healing tools. You gain access to the Support Arrows table: Healing Arrow, Vigorous Arrow, Anti-Healing Arrow, Adrenaline Arrow, and Affection Arrow. Effects are doubled on a crit."],
                effects: [{ type: 'proficiency', target: "Healing tools", category: 'tool' }]
            },
            { index: "hold-still-as", name: "Hold Still", level: 8, source: "Support Specialization", url: "", desc: ["At 8th level, you never miss a friendly creature with an arrow unless it is impossible to hit them."] },
            { index: "medical-reaction-as", name: "Medical Reaction", level: 11, source: "Support Specialization", url: "", desc: ["At 11th level, as a reaction, you can shoot a teammate who is being attacked by an enemy with a special arrow."] },
            { index: "self-care-as", name: "Self Care", level: 14, source: "Support Specialization", url: "", desc: ["At 14th level, when hitting yourself with one of your arrows, you always crit, doubling the effects."] }
        ]
    },
    // --- GUNSLINGER BRAVADOS ---
    {
        index: "commander",
        name: "Commander",
        source: "Gunslinger Bravado",
        class: { index: "gunslinger", name: "Gunslinger", url: "" },
        desc: ["Commanders on the battlefield are a wonder to behold. Leading their troops to victory, they are tactical geniuses and experts at supporting their troops."],
        feature_details: [
            { index: "battlefield-influence", name: "Battlefield Influence", level: 3, source: "Commander", url: "", desc: ["You learn the Moralize and Demoralize actions. Uses: 2 per Long Rest. Gained bonus/penalty increases at later levels."] },
            { index: "commanding-presence", name: "Commanding Presence", level: 7, source: "Commander", url: "", desc: ["While Moralize is active, you have advantage on all saving throws and ranged attack rolls made with a firearm."] },
            { index: "stand-as-one", name: "Stand as One", level: 13, source: "Commander", url: "", desc: ["Allies under Moralize can use a bonus action to deal extra 1d6 damage."] },
            { index: "guiding-shot", name: "Guiding Shot", level: 15, source: "Commander", url: "", desc: ["When you hit with a firearm, one ally gets advantage on their next attack."] },
            { index: "militarized-mobilization", name: "Militarized Mobilization", level: 18, source: "Commander", url: "", desc: ["You can train NPC soldiers (Scouts) equal to your Charisma modifier to serve as your loyal militia."] }
        ]
    },
    {
        index: "cqc",
        name: "CQC",
        source: "Gunslinger Bravado",
        class: { index: "gunslinger", name: "Gunslinger", url: "" },
        desc: ["Close Quarter Combatant experts prefer to be at the front line of combat, dealing damage and taking hits in place of other teammates."],
        feature_details: [
            { index: "armored-brute", name: "Armored Brute", level: 3, source: "CQC", url: "", desc: ["You gain +1 to AC while wearing armor (+2 at level 15)."], effects: [{ type: 'stat_bonus', stat: 'ac', value: 1 }] },
            { index: "cqc-training", name: "CQC Training", level: 3, source: "CQC", url: "", desc: ["Firearms in melee don't have disadvantage. You can use Strength for firearm attack rolls."] },
            { index: "combat-conditioning", name: "Combat Conditioning", level: 7, source: "CQC", url: "", desc: ["Your hit point maximum increases by an amount equal to twice your level."], effects: [{ type: 'stat_bonus', stat: 'hp_per_level', value: 2 }] },
            { index: "crowd-control", name: "Crowd Control", level: 13, source: "CQC", url: "", desc: ["Bonus action to shove a creature 10 feet after a ranged firearm attack."] },
            { index: "riot-shield", name: "Riot Shield", level: 18, source: "CQC", url: "", desc: ["Proficiency with shields. Can mount a shield and still use two-handed firearms."] }
        ]
    },
    {
        index: "desperado",
        name: "Desperado",
        source: "Gunslinger Bravado",
        class: { index: "gunslinger", name: "Gunslinger", url: "" },
        desc: ["Daredevils with a reckless, flashy style, desperadoes excel at fighting with one-handed firearms, either singly or in pairs."],
        feature_details: [
            { index: "duelist-fighting-style", name: "Duelist Fighting Style", level: 3, source: "Desperado", url: "", desc: ["+4 bonus to damage and +2 bonus to attack rolls when wielding a single one-handed firearm."] },
            { index: "two-gun-fighting-style", name: "Two-Gun Fighting Style", level: 3, source: "Desperado", url: "", desc: ["Bonus action to attack with off-hand firearm. Reload with full hands."] },
            { index: "unique-style", name: "Unique Style", level: 7, source: "Desperado", url: "", desc: ["Expertise in Intimidation and Persuasion."], effects: [{ type: 'expertise_choice', category: 'skill', count: 2, options: ["Intimidation", "Persuasion"] }] },
            { index: "taunt-gs", name: "Taunt", level: 13, source: "Desperado", url: "", desc: ["Action: Force a Wisdom save. On failure, target has disadvantage on attacks against you."] },
            { index: "kill-in-the-blink", name: "Kill in the Blink of an Eye", level: 20, source: "Desperado", url: "", desc: ["Draw and attack before anyone else rolls initiative."] }
        ]
    },
    {
        index: "marksman-gs",
        name: "Marksman",
        source: "Gunslinger Bravado",
        class: { index: "gunslinger", name: "Gunslinger", url: "" },
        desc: ["Marksmen are the guardians of the battlefield, constantly watching over their allies."],
        feature_details: [
            { index: "snipers-mark", name: "Sniper's Mark", level: 3, source: "Marksman", url: "", desc: ["Bonus action to mark target for advantage on attacks (Wis modifier uses)."] },
            { index: "marked-quarry", name: "Marked Quarry", level: 7, source: "Marksman", url: "", desc: ["Extra 1d6 damage against marked targets."] },
            { index: "arcane-infused-weaponry", name: "Arcane Infused Weaponry", level: 13, source: "Marksman", url: "", desc: ["Firearm attacks are considered magical."] },
            { index: "interrupting-shot", name: "Interrupting Shot", level: 15, source: "Marksman", url: "", desc: ["Reaction: Attack a marked target that is making an attack."] }
        ]
    },
    {
        index: "preacher",
        name: "Preacher",
        source: "Gunslinger Bravado",
        class: { index: "gunslinger", name: "Gunslinger", url: "" },
        desc: ["Preachers combine the studies of gunslingers with a pious devotion to their deity that allows them to cast spells like a paladin."],
        feature_details: [
            { index: "religious-studies", name: "Religious Studies", level: 3, source: "Preacher", url: "", desc: ["Expertise in Religion."], effects: [{ type: 'expertise_choice', category: 'skill', count: 1, options: ["Religion"] }] },
            { index: "spellcasting-preacher", name: "Spellcasting", level: 3, source: "Preacher", url: "", desc: ["You use Charisma to cast Paladin spells."] },
            { index: "ranged-smite", name: "Ranged Smite", level: 3, source: "Preacher", url: "", desc: ["Use 'Smite' spells with firearms within normal range."] },
            { index: "bane-shot", name: "Bane Shot", level: 7, source: "Preacher", url: "", desc: ["Extra 2d6 radiant damage against fiends and undead."] },
            { index: "shot-of-disruption", name: "Shot of Disruption", level: 18, source: "Preacher", url: "", desc: ["Firearm attacks can destroy low-HP fiends and undead."] }
        ]
        },
    // --- ARTIFICER SPECIALISTS ---
    {
        index: "alchemist",
        name: "Alchemist",
        source: "Eberron",
        class: { index: "artificer", name: "Artificer", url: "" },
        desc: ["An Alchemist is an expert at combining exotic reagents to produce mystical effects. Among artificers, members of this subclass are the greatest healers, as well as the ones most adept at wielding dangerous chemicals."],
        feature_details: [
            { 
                index: "alchemist-tool-proficiency", 
                name: "Tool Proficiency", 
                level: 3, 
                source: "Alchemist", 
                url: "", 
                desc: ["You gain proficiency with alchemist's supplies. If you already have this proficiency, you gain proficiency with one other type of artisan's tools of your choice."],
                effects: [{ type: 'proficiency', target: "Alchemist's Supplies", category: 'tool' }]
            },
            { 
                index: "alchemist-spells", 
                name: "Alchemist Spells", 
                level: 3, 
                source: "Alchemist", 
                url: "", 
                desc: ["You always have certain spells prepared. 3rd: Purify Food and Drink, Ray of Sickness; 5th: Melf's Acid Arrow, Web; 9th: Create Food and Water, Stinking Cloud; 13th: Blight, Death Ward; 17th: Cloudkill, Raise Dead."] 
            },
            { 
                index: "experimental-elixir", 
                name: "Experimental Elixir", 
                level: 3, 
                source: "Alchemist", 
                url: "", 
                desc: ["As an action, you can magically produce an experimental elixir in an empty flask you touch. Roll on the table for its effect. Creating an elixir requires alchemist's supplies."] 
            },
            { 
                index: "alchemical-savant", 
                name: "Alchemical Savant", 
                level: 5, 
                source: "Alchemist", 
                url: "", 
                desc: ["Whenever you cast a spell using your alchemist's supplies as a spellcasting focus, you gain a bonus to one roll of the spell. The roll must restore HP or deal acid, fire, necrotic, or poison damage. The bonus equals your Intelligence modifier (min +1)."] 
            },
            { 
                index: "restorative-reagents", 
                name: "Restorative Reagents", 
                level: 9, 
                source: "Alchemist", 
                url: "", 
                desc: ["Experimental elixirs now grant 2d6 + Int mod temporary HP. You can also cast Lesser Restoration without expending a spell slot (Int mod times per Long Rest)."] 
            },
            { 
                index: "chemical-mastery", 
                name: "Chemical Mastery", 
                level: 15, 
                source: "Alchemist", 
                url: "", 
                desc: ["You gain resistance to acid and poison damage, and immunity to the poisoned condition. You can cast Greater Restoration and Heal once each per Long Rest without expending a spell slot."],
                effects: [{ type: 'resistance', damage_type: 'Acid' }, { type: 'resistance', damage_type: 'Poison' }, { type: 'immunity', condition: 'Poisoned' }]
            }
        ]
    },
    {
        index: "artillerist",
        name: "Artillerist",
        source: "Eberron",
        class: { index: "artificer", name: "Artificer", url: "" },
        desc: ["An Artillerist specializes in using magic to create explosions and defensive positions, as well as magic-infused sidearms—especially wands."],
        feature_details: [
            { 
                index: "artillerist-tool-proficiency", 
                name: "Tool Proficiency", 
                level: 3, 
                source: "Artillerist", 
                url: "", 
                desc: ["You gain proficiency with woodcarver's tools. If you already have this proficiency, you gain proficiency with one other type of artisan's tools of your choice."],
                effects: [{ type: 'proficiency', target: "Woodcarver's Tools", category: 'tool' }]
            },
            { 
                index: "artillerist-spells", 
                name: "Artillerist Spells", 
                level: 3, 
                source: "Artillerist", 
                url: "", 
                desc: ["You always have certain spells prepared. 3rd: Shield, Thunderwave; 5th: Scorching Ray, Shatter; 9th: Fireball, Wind Wall; 13th: Ice Storm, Wall of Fire; 17th: Cone of Cold, Wall of Force."] 
            },
            { 
                index: "eldritch-cannon", 
                name: "Eldritch Cannon", 
                level: 3, 
                source: "Artillerist", 
                url: "", 
                desc: ["You can take an action to summon a Tiny or Small turret. You choose Flamethrower, Force Ballista, or Defender. You can activate it as a bonus action."] 
            },
            { 
                index: "arcane-firearm", 
                name: "Arcane Firearm", 
                level: 5, 
                source: "Artillerist", 
                url: "", 
                desc: ["You turn a wand, staff, or rod into an arcane firearm. When you cast an artificer spell through it, roll a d8 and add it to one damage roll."] 
            },
            { 
                index: "explosive-cannon", 
                name: "Explosive Cannon", 
                level: 9, 
                source: "Artillerist", 
                url: "", 
                desc: ["Eldritch Cannon damage increases by 1d8. You can also detonate the cannon as an action."] 
            },
            { 
                index: "fortified-position", 
                name: "Fortified Position", 
                level: 15, 
                source: "Artillerist", 
                url: "", 
                desc: ["You and your allies have half cover while within 10 feet of a turret. You can summon two turrets simultaneously."] 
            }
        ]
    },
    {
        index: "battle-smith",
        name: "Battle Smith",
        source: "Eberron",
        class: { index: "artificer", name: "Artificer", url: "" },
        desc: ["A combination of protector and medic, a Battle Smith is an expert at defending others and repairing both materiel and personnel."],
        feature_details: [
            { 
                index: "battle-smith-tool-proficiency", 
                name: "Tool Proficiency", 
                level: 3, 
                source: "Battle Smith", 
                url: "", 
                desc: ["You gain proficiency with smith's tools. If you already have this proficiency, you gain proficiency with one other type of artisan's tools of your choice."],
                effects: [{ type: 'proficiency', target: "Smith's Tools", category: 'tool' }]
            },
            { 
                index: "battle-smith-spells", 
                name: "Battle Smith Spells", 
                level: 3, 
                source: "Battle Smith", 
                url: "", 
                desc: ["You always have certain spells prepared. 3rd: Heroism, Searing Smite; 5th: Branding Smite, Warding Bond; 9th: Aura of Vitality, Blinding Smite; 13th: Aura of Purity, Staggering Smite; 17th: Banishing Smite, Mass Cure Wounds."] 
            },
            { 
                index: "battle-ready", 
                name: "Battle Ready", 
                level: 3, 
                source: "Battle Smith", 
                url: "", 
                desc: ["You gain proficiency with martial weapons. When you attack with a magic weapon, you can use your Intelligence modifier for the attack and damage rolls."],
                effects: [{ type: 'proficiency', target: 'Martial Weapons', category: 'weapon' }]
            },
            { 
                index: "steel-defender", 
                name: "Steel Defender", 
                level: 3, 
                source: "Battle Smith", 
                url: "", 
                desc: ["You gain a faithful metallic companion. In combat, it shares your initiative and acts immediately after you. It obeys your commands."] 
            },
            { 
                index: "extra-attack-artificer", 
                name: "Extra Attack", 
                level: 5, 
                source: "Battle Smith", 
                url: "", 
                desc: ["You can attack twice, instead of once, whenever you take the Attack action on your turn."] 
            },
            { 
                index: "arcane-jolt", 
                name: "Arcane Jolt", 
                level: 9, 
                source: "Battle Smith", 
                url: "", 
                desc: ["When you or your steel defender hits with an attack, you can deal an extra 2d6 force damage or restore 2d6 HP to a nearby creature."] 
            },
            { 
                index: "improved-defender", 
                name: "Improved Defender", 
                level: 15, 
                source: "Battle Smith", 
                url: "", 
                desc: ["Arcane Jolt damage and healing increases to 4d6. Your steel defender gains a +2 bonus to AC. Its deflect attack deals force damage."] 
            }
        ]
    },
    // --- PUGILIST FIGHT CLUBS ---
    {
        index: "arena-royale",
        name: "Arena Royale",
        source: "The Pugilist",
        class: { index: "pugilist", name: "Pugilist", url: "" },
        desc: ["The Arena Royale is for those who treat every fight like a show."],
        feature_details: [
            { index: "persona-non-grata", name: "Persona Non Grata", level: 3, source: "Arena Royale", url: "", desc: ["You adopt an alternate persona. Gain Persona Points to fuel social manipulation and high-flying critical strikes."] },
            { index: "the-high-road", name: "The High Road", level: 6, source: "Arena Royale", url: "", desc: ["Advantage on attacks when you are at least 10 feet above the target."] }
        ]
    },
    {
        index: "bloodhound-bruisers",
        name: "Bloodhound Bruisers",
        source: "The Pugilist",
        class: { index: "pugilist", name: "Pugilist", url: "" },
        desc: ["Urban detectives who solve crimes with their fists."],
        feature_details: [
            { index: "ear-to-the-ground", name: "Ear to the Ground", level: 3, source: "Bloodhound Bruisers", url: "", desc: ["Advantage on initiative and bonuses to Investigation checks."], effects: [{type: 'advantage', key: 'initiative', label: 'Initiative'}] },
            { index: "nose-for-trouble", name: "Nose for Trouble", level: 6, source: "Bloodhound Bruisers", url: "", desc: ["You can't be surprised while you are conscious."] }
        ]
    },
    {
        index: "dog-hound",
        name: "Dog & Hound",
        source: "The Pugilist",
        class: { index: "pugilist", name: "Pugilist", url: "" },
        desc: ["Fights with a loyal canine companion."],
        feature_details: [
            { index: "loyal-companion", name: "Loyal Companion", level: 3, source: "Dog & Hound", url: "", desc: ["Gain a hound companion that scales with your level and benefits from your Moxie abilities like Brace Up."] }
        ]
    },
    {
        index: "hand-of-dread",
        name: "Hand of Dread",
        source: "The Pugilist",
        class: { index: "pugilist", name: "Pugilist", url: "" },
        desc: ["Pact-bound bruiser with a monstrous limb."],
        feature_details: [
            { index: "dread-limb", name: "Dread Limb", level: 3, source: "Hand of Dread", url: "", desc: ["Manifest a monstrous limb. Cast Constitution-based cantrips and execute foes with a 'Fountain of Viscera'."] }
        ]
    },
    {
        index: "piss-vinegar",
        name: "Piss & Vinegar",
        source: "The Pugilist",
        class: { index: "pugilist", name: "Pugilist", url: "" },
        desc: ["The 'Heel' who uses dirty tricks and insults."],
        feature_details: [
            { index: "salty-salute", name: "Salty Salute", level: 3, source: "Piss & Vinegar", url: "", desc: ["Insult and taunt enemies. Use tricks like Pocket Sand or Heelstomper to blind or slow foes."] }
        ]
    },
    {
        index: "squared-circle",
        name: "The Squared Circle",
        source: "The Pugilist",
        class: { index: "pugilist", name: "Pugilist", url: "" },
        desc: ["Technical grappler who controls the ring."],
        feature_details: [
            { index: "ring-general", name: "Ring General", level: 3, source: "The Squared Circle", url: "", desc: ["Move at full speed while dragging creatures and treat yourself as one size larger for grappling."] }
        ]
    },
    {
        index: "sweet-science",
        name: "The Sweet Science",
        source: "The Pugilist",
        class: { index: "pugilist", name: "Pugilist", url: "" },
        desc: ["Technical boxer who values precision and defense."],
        feature_details: [
            { index: "cross-counter", name: "Cross Counter", level: 3, source: "The Sweet Science", url: "", desc: ["Use reaction and 1 Moxie to reduce incoming damage and strike back."] },
            { index: "knock-out", name: "Knock Out", level: 6, source: "The Sweet Science", url: "", desc: ["Spend Moxie to attempt an instant knock-out punch."] }
        ]
    },
    // --- BARBARIAN ---
    {
        index: "berserker",
        name: "Path of the Berserker",
        source: "Player's Handbook",
        class: { index: "barbarian", name: "Barbarian", url: "" },
        desc: ["For some barbarians, rage is a means to an end—that end being violence."],
        feature_details: [
            { 
                index: "frenzy", 
                name: "Frenzy", 
                level: 3, 
                source: "Berserker", 
                url: "", 
                desc: ["When you rage, you can frenzy. If you do, make a single melee weapon attack as a bonus action on each turn. Gain one level of exhaustion when rage ends."],
                effects: [{ type: 'bonus_action', name: 'Frenzy Attack', description: 'Make a single melee weapon attack while raging (costs 1 exhaustion level when rage ends).' }]
            },
            { 
                index: "mindless-rage", 
                name: "Mindless Rage", 
                level: 6, 
                source: "Berserker", 
                url: "", 
                desc: ["You can't be charmed or frightened while raging."],
                effects: [{ type: 'immunity', condition: 'Charmed (while raging)' }, { type: 'immunity', condition: 'Frightened (while raging)' }]
            },
            { 
                index: "intimidating-presence", 
                name: "Intimidating Presence", 
                level: 10, 
                source: "Berserker", 
                url: "", 
                desc: ["Action: Frighten someone within 30 feet (Wisdom save)."],
                effects: [{ type: 'action', name: 'Intimidating Presence', description: 'Frighten one creature within 30ft (Wisdom save).' }]
            },
            { 
                index: "retaliation", 
                name: "Retaliation", 
                level: 14, 
                source: "Berserker", 
                url: "", 
                desc: ["Reaction: Make a melee attack against a creature within 5 feet that damaged you."],
                effects: [{ type: 'reaction', name: 'Retaliation', description: 'Melee attack creature within 5ft that damaged you.' }]
            }
        ]
    },
       {
        index: "totem-warrior",
        name: "Path of the Totem Warrior",
        source: "Player's Handbook",
        class: { index: "barbarian", name: "Barbarian", url: "" },
        desc: ["The Path of the Totem Warrior is a spiritual journey, as the barbarian accepts a spirit animal as a guide."],
        feature_details: [
            { 
                index: "spirit-seeker", 
                name: "Spirit Seeker", 
                level: 3, 
                source: "Totem Warrior", 
                url: "", 
                desc: ["You can cast Beast Sense and Speak with Animals as rituals."],
                effects: [{ type: 'spell_access', spell: 'Beast Sense', ritual: true }, { type: 'spell_access', spell: 'Speak with Animals', ritual: true }]
            },
            { 
                index: "totem-spirit", 
                name: "Totem Spirit", 
                level: 3, 
                source: "Totem Warrior", 
                url: "", 
                desc: ["Choose a totem spirit (Bear: Resistance to all dmg except psychic; Eagle: Dash as bonus action/Disadv on opp attacks; Wolf: Adv for allies on melee attacks)."],
                effects: [
                    { type: 'feature', name: 'Totem Choice', description: 'Choose Bear (Resistances), Eagle (Bonus Dash), or Wolf (Ally Adv).' }
                ]
            },
            { index: "aspect-of-the-beast", name: "Aspect of the Beast", level: 6, source: "Totem Warrior", url: "", desc: ["Choose a magical benefit based on a totem animal (Bear: Carry capacity; Eagle: Sight; Wolf: Tracking)."] }
        ]
    },
    {
        index: "zealot",
        name: "Path of the Zealot",
        source: "Xanathar's Guide to Everything",
        class: { index: "barbarian", name: "Barbarian", url: "" },
        desc: ["Some deities inspire their followers to pitch themselves into a ferocious battle fury."],
        feature_details: [
            { index: "divine-fury", name: "Divine Fury", level: 3, source: "Zealot", url: "", desc: ["While raging, the first creature you hit takes extra necrotic or radiant damage equal to 1d6 + half your Barbarian level."] },
            { 
                index: "warrior-of-the-gods", 
                name: "Warrior of the Gods", 
                level: 3, 
                source: "Zealot", 
                url: "", 
                desc: ["Spells that restore you to life (like Revivify) don't require material components."],
                effects: [{ type: 'feature', name: 'Warrior of the Gods', description: 'Revival spells cost no components.' }]
            },
            { 
                index: "fanatical-focus", 
                name: "Fanatical Focus", 
                level: 6, 
                source: "Zealot", 
                url: "", 
                desc: ["Reroll a failed saving throw. (1/Long Rest)"],
                effects: [{ type: 'feature', name: 'Fanatical Focus', description: 'Reroll failed save (1/Long Rest).' }]
            }
        ]
    },
    {
        index: "ancestral-guardian",
        name: "Path of the Ancestral Guardian",
        source: "Xanathar's Guide to Everything",
        class: { index: "barbarian", name: "Barbarian", url: "" },
        desc: ["Barbarians who respect their ancestors and channel them in battle."],
        feature_details: [
            { index: "ancestral-protectors", name: "Ancestral Protectors", level: 3, source: "Ancestral Guardian", url: "", desc: ["While raging, the first creature you hit has disadvantage on attacks against others, and others have resistance to its damage."] },
            { 
                index: "spirit-shield", 
                name: "Spirit Shield", 
                level: 6, 
                source: "Ancestral Guardian", 
                url: "", 
                desc: ["Reaction: Reduce damage to another creature by 2d6 (scales with level) while raging."],
                effects: [{ type: 'reaction', name: 'Spirit Shield', description: 'Reduce damage to ally by 2d6.' }]
            }
        ]
    },
    {
        index: "storm-herald",
        name: "Path of the Storm Herald",
        source: "Xanathar's Guide to Everything",
        class: { index: "barbarian", name: "Barbarian", url: "" },
        desc: ["Barbarians who fury with the power of the storm."],
        feature_details: [
            { index: "storm-aura", name: "Storm Aura", level: 3, source: "Storm Herald", url: "", desc: ["Emit a 10ft aura while raging. Effect depends on environment (Desert, Sea, Tundra). Bonus Action to activate."] },
            { index: "storm-soul", name: "Storm Soul", level: 6, source: "Storm Herald", url: "", desc: ["Grant resistance or water breathing depending on environment choice."] }
        ]
    },
    {
        index: "beast",
        name: "Path of the Beast",
        source: "Tasha's Cauldron of Everything",
        class: { index: "barbarian", name: "Barbarian", url: "" },
        desc: ["Barbarians who transform into bestial forms."],
        feature_details: [
            { 
                index: "form-of-the-beast", 
                name: "Form of the Beast", 
                level: 3, 
                source: "Beast", 
                url: "", 
                desc: ["When you rage, transform bite, claws, or tail. Each has unique combat properties."],
                effects: [{ type: 'feature', name: 'Form of the Beast', description: 'Gain Bite (heal), Claws (extra attack), or Tail (reach/defense) while raging.' }]
            },
            { index: "bestial-soul", name: "Bestial Soul", level: 6, source: "Beast", url: "", desc: ["Attacks count as magical. Gain swimming, climbing, or jumping benefits."] }
        ]
    },
    {
        index: "wild-magic-barb",
        name: "Path of Wild Magic",
        source: "Tasha's Cauldron of Everything",
        class: { index: "barbarian", name: "Barbarian", url: "" },
        desc: ["Magic that surges when you rage."],
        feature_details: [
            { index: "magic-awareness", name: "Magic Awareness", level: 3, source: "Wild Magic", url: "", desc: ["Detect magic within 60ft as an action."] },
            { index: "wild-surge", name: "Wild Surge", level: 3, source: "Wild Magic", url: "", desc: ["Roll on Wild Magic table when you rage."] },
            { index: "bolstering-magic", name: "Bolstering Magic", level: 6, source: "Wild Magic", url: "", desc: ["Action: Grant 1d3 bonus to attack/checks or recover spell slot."] }
        ]
    },

    // --- BARD ---
    {
        index: "lore",
        name: "College of Lore",
        source: "Player's Handbook",
        class: { index: "bard", name: "Bard", url: "" },
        desc: ["Bards of the College of Lore know something about most things."],
        feature_details: [
            { 
                index: "bonus-proficiencies-lore", 
                name: "Bonus Proficiencies", 
                level: 3, 
                source: "Lore", 
                url: "", 
                desc: ["Gain proficiency with three skills of your choice."],
                effects: [{ type: 'proficiency_choice', category: 'skill', count: 3 }]
            },
            { 
                index: "cutting-words", 
                name: "Cutting Words", 
                level: 3, 
                source: "Lore", 
                url: "", 
                desc: ["Reaction: Spend Bardic Inspiration to subtract from a creature's attack roll, ability check, or damage roll."],
                effects: [{ type: 'reaction', name: 'Cutting Words', description: 'Subtract Bardic Inspiration from creature roll.' }]
            },
            { 
                index: "additional-magical-secrets", 
                name: "Additional Magical Secrets", 
                level: 6, 
                source: "Lore", 
                url: "", 
                desc: ["Learn two spells from any class list."],
                effects: [{ type: 'feature', name: 'Additional Magical Secrets', description: 'Learn 2 spells from any class.' }]
            }
        ]
    },
    {
        index: "valor",
        name: "College of Valor",
        source: "Player's Handbook",
        class: { index: "bard", name: "Bard", url: "" },
        desc: ["Bards of the College of Valor are daring skalds whose tales keep the memory of the great heroes of the past alive."],
        feature_details: [
            { 
                index: "bonus-proficiencies-valor", 
                name: "Bonus Proficiencies", 
                level: 3, 
                source: "Valor", 
                url: "", 
                desc: ["Proficiency with medium armor, shields, and martial weapons."],
                effects: [
                    { type: 'proficiency', target: 'Medium Armor', category: 'armor' },
                    { type: 'proficiency', target: 'Shields', category: 'armor' },
                    { type: 'proficiency', target: 'Martial Weapons', category: 'weapon' }
                ]
            },
            { 
                index: "combat-inspiration", 
                name: "Combat Inspiration", 
                level: 3, 
                source: "Valor", 
                url: "", 
                desc: ["Creatures can add Bardic Inspiration to weapon damage or AC (reaction)."]
            },
            { index: "extra-attack-valor", name: "Extra Attack", level: 6, source: "Valor", url: "", desc: ["Attack twice when taking the Attack action."] }
        ]
    },
    {
        index: "glamour",
        name: "College of Glamour",
        source: "Xanathar's Guide to Everything",
        class: { index: "bard", name: "Bard", url: "" },
        desc: ["Bards who mastered their craft in the vibrant realm of the Feywild."],
        feature_details: [
            { 
                index: "mantle-of-inspiration", 
                name: "Mantle of Inspiration", 
                level: 3, 
                source: "Glamour", 
                url: "", 
                desc: ["Bonus Action: Spend Inspiration. Allies gain temp HP and can use reaction to move without opportunity attacks."],
                effects: [{ type: 'bonus_action', name: 'Mantle of Inspiration', description: 'Grant temp HP and movement to allies.' }]
            },
            { 
                index: "enthralling-performance", 
                name: "Enthralling Performance", 
                level: 3, 
                source: "Glamour", 
                url: "", 
                desc: ["Perform for 1 min. Humanoids must save or be charmed and idolize you."],
                effects: [{ type: 'action', name: 'Enthralling Performance', description: 'Charm humanoids who watch you perform.' }]
            }
        ]
    },
    {
        index: "swords",
        name: "College of Swords",
        source: "Xanathar's Guide to Everything",
        class: { index: "bard", name: "Bard", url: "" },
        desc: ["Bards who perform daring feats with weapons."],
        feature_details: [
            { 
                index: "bonus-proficiencies-swords", 
                name: "Bonus Proficiencies", 
                level: 3, 
                source: "Swords", 
                url: "", 
                desc: ["Proficiency with medium armor and scimitar. Use weapon as focus."],
                effects: [
                    { type: 'proficiency', target: 'Medium Armor', category: 'armor' },
                    { type: 'proficiency', target: 'Scimitar', category: 'weapon' }
                ]
            },
            { index: "fighting-style-swords", name: "Fighting Style", level: 3, source: "Swords", url: "", desc: ["Choose Dueling or Two-Weapon Fighting."] },
            { 
                index: "blade-flourish", 
                name: "Blade Flourish", 
                level: 3, 
                source: "Swords", 
                url: "", 
                desc: ["When you attack, +10ft speed. Use Inspiration to perform flourishes (Defensive, Slashing, Mobile) for extra damage/effects."],
                effects: [{ type: 'feature', name: 'Blade Flourish', description: 'Add Inspiration to damage + AC/Push/Move.' }]
            },
            { index: "extra-attack-swords", name: "Extra Attack", level: 6, source: "Swords", url: "", desc: ["Attack twice."] }
        ]
    },
    {
        index: "whispers",
        name: "College of Whispers",
        source: "Xanathar's Guide to Everything",
        class: { index: "bard", name: "Bard", url: "" },
        desc: ["Bards who use their magic to uncover secrets and turn minds against each other."],
        feature_details: [
            { 
                index: "psychic-blades", 
                name: "Psychic Blades", 
                level: 3, 
                source: "Whispers", 
                url: "", 
                desc: ["When you hit a weapon attack, spend Inspiration to deal extra 2d6 psychic damage (scales).."],
                effects: [{ type: 'feature', name: 'Psychic Blades', description: 'Smite with Inspiration for psychic dmg.' }]
            },
            { 
                index: "words-of-terror", 
                name: "Words of Terror", 
                level: 3, 
                source: "Whispers", 
                url: "", 
                desc: ["Speak to humanoid for 1 min to frighten them (Wis save)."] 
            }
        ]
    },
    {
        index: "eloquence",
        name: "College of Eloquence",
        source: "Tasha's Cauldron of Everything",
        class: { index: "bard", name: "Bard", url: "" },
        desc: ["Masters of oratory and persuasion."],
        feature_details: [
            { 
                index: "silver-tongue", 
                name: "Silver Tongue", 
                level: 3, 
                source: "Eloquence", 
                url: "", 
                desc: ["Minimum roll of 10 on Deception and Persuasion checks."],
                effects: [{ type: 'feature', name: 'Silver Tongue', description: 'Treat d20 roll of 9 or lower as 10 for Deception/Persuasion.' }]
            },
            { 
                index: "unsettling-words", 
                name: "Unsettling Words", 
                level: 3, 
                source: "Eloquence", 
                url: "", 
                desc: ["Bonus Action: Spend Inspiration. Subtract die from target's next saving throw."],
                effects: [{ type: 'bonus_action', name: 'Unsettling Words', description: 'Subtract Bardic Inspiration die from target next save.' }]
            }
        ]
    },
    {
        index: "creation",
        name: "College of Creation",
        source: "Tasha's Cauldron of Everything",
        class: { index: "bard", name: "Bard", url: "" },
        desc: ["Bards who sing the song of creation."],
        feature_details: [
            { 
                index: "mote-of-potential", 
                name: "Mote of Potential", 
                level: 3, 
                source: "Creation", 
                url: "", 
                desc: ["Bardic Inspiration grants extra effects based on how it's used (Attack/Check/Save)."] 
            },
            { 
                index: "performance-of-creation", 
                name: "Performance of Creation", 
                level: 3, 
                source: "Creation", 
                url: "", 
                desc: ["Action: Create one nonmagical item. Lasts for hours equal to PB."] 
            }
        ]
    },
    {
        index: "spirits",
        name: "College of Spirits",
        source: "Van Richten's Guide to Ravenloft",
        class: { index: "bard", name: "Bard", url: "" },
        desc: ["Channel spirits to recount their tales."],
        feature_details: [
            { index: "guiding-whispers", name: "Guiding Whispers", level: 3, source: "Spirits", url: "", desc: ["Learn Guidance. 60ft range."] },
            { index: "spiritual-focus", name: "Spiritual Focus", level: 3, source: "Spirits", url: "", desc: ["Use skull/crystal/tarot/etc as focus. Bonus to healing/damage."] },
            { index: "tales-from-beyond", name: "Tales from Beyond", level: 3, source: "Spirits", url: "", desc: ["Bonus Action: Roll on Spirit Tales table to get random effect."] }
        ]
    },

    // --- CLERIC ---
    {
        index: "knowledge",
        name: "Knowledge Domain",
        source: "Player's Handbook",
        class: { index: "cleric", name: "Cleric", url: "" },
        desc: ["Gods of knowledge value learning and understanding."],
        feature_details: [
            { 
                index: "blessings-of-knowledge", 
                name: "Blessings of Knowledge", 
                level: 1, 
                source: "Knowledge", 
                url: "", 
                desc: ["Learn two languages. Proficiency and Expertise in two skills (Arcana, History, Nature, Religion)."],
                effects: [{ type: 'proficiency_choice', category: 'skill', count: 2 }, { type: 'expertise_choice', category: 'skill', count: 2 }]
            },
            { index: "channel-divinity-knowledge-ages", name: "CD: Knowledge of the Ages", level: 2, source: "Knowledge", url: "", desc: ["Gain proficiency in a skill or tool for 10 minutes."] }
        ]
    },
    {
        index: "life",
        name: "Life Domain",
        source: "Player's Handbook",
        class: { index: "cleric", name: "Cleric", url: "" },
        desc: ["The Life domain focuses on the vibrant positive energy that sustains all life."],
        feature_details: [
            { 
                index: "bonus-proficiency-life", 
                name: "Bonus Proficiency", 
                level: 1, 
                source: "Life", 
                url: "", 
                desc: ["You gain proficiency with heavy armor."],
                effects: [{ type: 'proficiency', target: 'Heavy Armor', category: 'armor' }]
            },
            { 
                index: "disciple-of-life", 
                name: "Disciple of Life", 
                level: 1, 
                source: "Life", 
                url: "", 
                desc: ["Healing spells restore additional HP equal to 2 + spell level."] 
            },
            { 
                index: "channel-divinity-preserve-life", 
                name: "CD: Preserve Life", 
                level: 2, 
                source: "Life", 
                url: "", 
                desc: ["Heal 5 * Cleric Level HP divided among creatures within 30ft (max half HP)."],
                effects: [{ type: 'action', name: 'CD: Preserve Life', description: 'Heal pool of 5x Level HP to allies.' }]
            },
            { index: "blessed-healer", name: "Blessed Healer", level: 6, source: "Life", url: "", desc: ["When you cast a healing spell on another, you regain 2 + spell level HP."] }
        ]
    },
    {
        index: "light",
        name: "Light Domain",
        source: "Player's Handbook",
        class: { index: "cleric", name: "Cleric", url: "" },
        desc: ["Gods of light promote the ideals of rebirth and renewal, truth, vigilance, and beauty."],
        feature_details: [
            { 
                index: "bonus-cantrip-light", 
                name: "Bonus Cantrip", 
                level: 1, 
                source: "Light", 
                url: "", 
                desc: ["Gain the Light cantrip."],
                effects: [{ type: 'spell_access', spell: 'Light', cast_free: true }]
            },
            { 
                index: "warding-flare", 
                name: "Warding Flare", 
                level: 1, 
                source: "Light", 
                url: "", 
                desc: ["Reaction: Impose disadvantage on attack against you. (Wis Mod/Long Rest)"],
                effects: [{ type: 'reaction', name: 'Warding Flare', description: 'Impose disadvantage on attacker within 30ft.' }]
            },
            { 
                index: "channel-divinity-radiance-of-the-dawn", 
                name: "CD: Radiance of the Dawn", 
                level: 2, 
                source: "Light", 
                url: "", 
                desc: ["Dispel magical darkness. Deal 2d10+Level radiant damage to foes within 30ft (Con save)."],
                effects: [{ type: 'action', name: 'CD: Radiance of the Dawn', description: 'AoE Radiant damage.' }]
            }
        ]
    },
    {
        index: "nature",
        name: "Nature Domain",
        source: "Player's Handbook",
        class: { index: "cleric", name: "Cleric", url: "" },
        desc: ["Gods of nature are as varied as the natural world itself."],
        feature_details: [
            { 
                index: "acolyte-of-nature", 
                name: "Acolyte of Nature", 
                level: 1, 
                source: "Nature", 
                url: "", 
                desc: ["Learn one druid cantrip. Proficiency in heavy armor. Proficiency in one nature skill."],
                effects: [
                    { type: 'proficiency', target: 'Heavy Armor', category: 'armor' },
                    { type: 'proficiency_choice', category: 'skill', count: 1 },
                    { type: 'spell_access', level: 0, count: 1 } // Generic cantrip logic
                ]
            },
            { index: "channel-divinity-charm-animals", name: "CD: Charm Animals and Plants", level: 2, source: "Nature", url: "", desc: ["Charm beasts and plants within 30ft."] }
        ]
    },
    {
        index: "tempest",
        name: "Tempest Domain",
        source: "Player's Handbook",
        class: { index: "cleric", name: "Cleric", url: "" },
        desc: ["Gods whose portfolios include the Tempest govern storms, sea, and sky."],
        feature_details: [
            { 
                index: "bonus-proficiencies-tempest", 
                name: "Bonus Proficiencies", 
                level: 1, 
                source: "Tempest", 
                url: "", 
                desc: ["Proficiency with martial weapons and heavy armor."],
                effects: [
                    { type: 'proficiency', target: 'Heavy Armor', category: 'armor' },
                    { type: 'proficiency', target: 'Martial Weapons', category: 'weapon' }
                ]
            },
            { 
                index: "wrath-of-the-storm", 
                name: "Wrath of the Storm", 
                level: 1, 
                source: "Tempest", 
                url: "", 
                desc: ["Reaction: When hit, deal 2d8 lightning or thunder damage (Dex save half). (Wis Mod/Long Rest)"],
                effects: [{ type: 'reaction', name: 'Wrath of the Storm', description: 'Deal 2d8 thunder/lightning to attacker.' }]
            },
            { 
                index: "channel-divinity-destructive-wrath", 
                name: "CD: Destructive Wrath", 
                level: 2, 
                source: "Tempest", 
                url: "", 
                desc: ["Max damage on thunder/lightning spell."] 
            },
            { index: "thunderbolt-strike", name: "Thunderbolt Strike", level: 6, source: "Tempest", url: "", desc: ["Push Large or smaller creature 10ft when dealing lightning damage."] }
        ]
    },
    {
        index: "trickery",
        name: "Trickery Domain",
        source: "Player's Handbook",
        class: { index: "cleric", name: "Cleric", url: "" },
        desc: ["Gods of trickery are mischief-makers and instigators."],
        feature_details: [
            { 
                index: "blessing-of-the-trickster", 
                name: "Blessing of the Trickster", 
                level: 1, 
                source: "Trickery", 
                url: "", 
                desc: ["Grant advantage on Stealth checks to another creature."] 
            },
            { 
                index: "channel-divinity-invoke-duplicity", 
                name: "CD: Invoke Duplicity", 
                level: 2, 
                source: "Trickery", 
                url: "", 
                desc: ["Create an illusory duplicate. Cast spells from its space. Gain advantage if both are within 5ft of enemy."],
                effects: [{ type: 'action', name: 'CD: Invoke Duplicity', description: 'Create illusory duplicate.' }]
            }
        ]
    },
    {
        index: "war",
        name: "War Domain",
        source: "Player's Handbook",
        class: { index: "cleric", name: "Cleric", url: "" },
        desc: ["The War domain delivers the spells and blessings of gods of war."],
        feature_details: [
            { 
                index: "bonus-proficiencies-war", 
                name: "Bonus Proficiencies", 
                level: 1, 
                source: "War", 
                url: "", 
                desc: ["Proficiency with martial weapons and heavy armor."],
                effects: [
                    { type: 'proficiency', target: 'Heavy Armor', category: 'armor' },
                    { type: 'proficiency', target: 'Martial Weapons', category: 'weapon' }
                ]
            },
            { 
                index: "war-priest", 
                name: "War Priest", 
                level: 1, 
                source: "War", 
                url: "", 
                desc: ["Bonus Action: Make one weapon attack after taking Attack action. (Wis Mod/Long Rest)"],
                effects: [{ type: 'bonus_action', name: 'War Priest Attack', description: 'Make an attack if you took Attack action.' }]
            },
            { 
                index: "channel-divinity-guided-strike", 
                name: "CD: Guided Strike", 
                level: 2, 
                source: "War", 
                url: "", 
                desc: ["+10 to an attack roll."],
                effects: [{ type: 'reaction', name: 'CD: Guided Strike', description: '+10 to an attack roll.' }]
            }
        ]
    },
    {
        index: "forge",
        name: "Forge Domain",
        source: "Xanathar's Guide to Everything",
        class: { index: "cleric", name: "Cleric", url: "" },
        desc: ["Gods of the forge are patrons of artisans who work with metal."],
        feature_details: [
            { 
                index: "bonus-proficiencies-forge", 
                name: "Bonus Proficiencies", 
                level: 1, 
                source: "Forge", 
                url: "", 
                desc: ["Proficiency with heavy armor and smith's tools."],
                effects: [
                    { type: 'proficiency', target: 'Heavy Armor', category: 'armor' },
                    { type: 'proficiency', target: "Smith's Tools", category: 'tool' }
                ]
            },
            { 
                index: "blessing-of-the-forge", 
                name: "Blessing of the Forge", 
                level: 1, 
                source: "Forge", 
                url: "", 
                desc: ["At end of long rest, touch weapon or armor. It becomes magical (+1) until next long rest."] 
            },
            { index: "channel-divinity-artisans-blessing", name: "CD: Artisan's Blessing", level: 2, source: "Forge", url: "", desc: ["Conduct 1 hour ritual to create metal object worth <100gp."] }
        ]
    },
    {
        index: "grave",
        name: "Grave Domain",
        source: "Xanathar's Guide to Everything",
        class: { index: "cleric", name: "Cleric", url: "" },
        desc: ["Gods of the grave watch over the line between life and death."],
        feature_details: [
            { 
                index: "circle-of-mortality", 
                name: "Circle of Mortality", 
                level: 1, 
                source: "Grave", 
                url: "", 
                desc: ["Healing spells on creatures at 0 HP restore max possible HP. Spare the Dying is a bonus action with range 30ft."],
                effects: [
                    { type: 'bonus_action', name: 'Spare the Dying', description: 'Cast Spare the Dying as bonus action.' },
                    { type: 'spell_access', spell: 'Spare the Dying', cast_free: true }
                ]
            },
            { 
                index: "eyes-of-the-grave", 
                name: "Eyes of the Grave", 
                level: 1, 
                source: "Grave", 
                url: "", 
                desc: ["Sense undead within 60ft (Wis Mod/Long Rest)."],
                effects: [{ type: 'action', name: 'Eyes of the Grave', description: 'Detect undead within 60ft.' }]
            },
            { 
                index: "channel-divinity-path-to-the-grave", 
                name: "CD: Path to the Grave", 
                level: 2, 
                source: "Grave", 
                url: "", 
                desc: ["Action: Curse creature. Next time it takes damage, it has vulnerability to that damage."],
                effects: [{ type: 'action', name: 'CD: Path to the Grave', description: 'Grant vulnerability to next damage source.' }]
            }
        ]
    },
    {
        index: "order",
        name: "Order Domain",
        source: "Tasha's Cauldron of Everything",
        class: { index: "cleric", name: "Cleric", url: "" },
        desc: ["Gods of order meditate on logic and justice."],
        feature_details: [
            { 
                index: "voice-of-authority", 
                name: "Voice of Authority", 
                level: 1, 
                source: "Order", 
                url: "", 
                desc: ["When you cast a spell on an ally, they can use reaction to make an attack."] 
            },
            { 
                index: "channel-divinity-orders-demand", 
                name: "CD: Order's Demand", 
                level: 2, 
                source: "Order", 
                url: "", 
                desc: ["Charm creatures within 30ft and make them drop what they are holding."] 
            }
        ]
    },
    {
        index: "peace",
        name: "Peace Domain",
        source: "Tasha's Cauldron of Everything",
        class: { index: "cleric", name: "Cleric", url: "" },
        desc: ["Gods of peace inspire people to resolve conflict."],
        feature_details: [
            { 
                index: "emboldening-bond", 
                name: "Emboldening Bond", 
                level: 1, 
                source: "Peace", 
                url: "", 
                desc: ["Action: Bond PB number of creatures. They add 1d4 to attack/check/save once per turn while near each other. (PB/Long Rest)"],
                effects: [{ type: 'action', name: 'Emboldening Bond', description: 'Bond allies. +1d4 to rolls when near each other.' }]
            },
            { 
                index: "channel-divinity-balm-of-peace", 
                name: "CD: Balm of Peace", 
                level: 2, 
                source: "Peace", 
                url: "", 
                desc: ["Move speed. Heal everyone you pass 2d6+Wis HP."] 
            }
        ]
    },
    {
        index: "twilight",
        name: "Twilight Domain",
        source: "Tasha's Cauldron of Everything",
        class: { index: "cleric", name: "Cleric", url: "" },
        desc: ["The twilight transition from light into darkness is a time of rest and comfort."],
        feature_details: [
            { 
                index: "bonus-proficiencies-twilight", 
                name: "Bonus Proficiencies", 
                level: 1, 
                source: "Twilight", 
                url: "", 
                desc: ["Proficiency with martial weapons and heavy armor."],
                effects: [
                    { type: 'proficiency', target: 'Heavy Armor', category: 'armor' },
                    { type: 'proficiency', target: 'Martial Weapons', category: 'weapon' }
                ]
            },
            { 
                index: "eyes-of-night", 
                name: "Eyes of Night", 
                level: 1, 
                source: "Twilight", 
                url: "", 
                desc: ["Darkvision 300ft. Share with allies."],
                effects: [{ type: 'stat_bonus', stat: 'darkvision', value: 300 }]
            },
            { 
                index: "vigilant-blessing", 
                name: "Vigilant Blessing", 
                level: 1, 
                source: "Twilight", 
                url: "", 
                desc: ["Give advantage on initiative to one creature."],
                effects: [{ type: 'advantage', key: 'initiative', label: 'Advantage on Initiative (can give to others)' }]
            },
            { 
                index: "channel-divinity-twilight-sanctuary", 
                name: "CD: Twilight Sanctuary", 
                level: 2, 
                source: "Twilight", 
                url: "", 
                desc: ["Sphere of dim light. Allies gain temp HP (1d6+Level) or end charm/fear."],
                effects: [{ type: 'action', name: 'CD: Twilight Sanctuary', description: 'Create sphere of twilight. Grant Temp HP or end effects.' }]
            }
        ]
    },
    {
        index: "death",
        name: "Death Domain",
        source: "Dungeon Master's Guide",
        class: { index: "cleric", name: "Cleric", url: "" },
        desc: ["Gods of death promote the cycle of life and death, or the undead."],
        feature_details: [
            { index: "reaper", name: "Reaper", level: 1, source: "Death", url: "", desc: ["Necromancy cantrip targets two adjacent creatures."] },
            { index: "channel-divinity-touch-of-death", name: "CD: Touch of Death", level: 2, source: "Death", url: "", desc: ["Melee hit deals extra necrotic damage (5 + 2*Level)."] }
        ]
    },
    {
        index: "arcana",
        name: "Arcana Domain",
        source: "Sword Coast Adventurer's Guide",
        class: { index: "cleric", name: "Cleric", url: "" },
        desc: ["Gods of magic."],
        feature_details: [
            { index: "arcane-initiate", name: "Arcane Initiate", level: 1, source: "Arcana", url: "", desc: ["Proficiency in Arcana. Learn two Wizard cantrips."] },
            { index: "channel-divinity-arcane-abjuration", name: "CD: Arcane Abjuration", level: 2, source: "Arcana", url: "", desc: ["Turn celestial, elemental, fey, or fiend."] }
        ]
    },

    // --- DRUID ---
    {
        index: "land",
        name: "Circle of the Land",
        source: "Player's Handbook",
        class: { index: "druid", name: "Druid", url: "" },
        desc: ["The Circle of the Land is made up of mystics and sages who safeguard ancient knowledge."],
        feature_details: [
            { 
                index: "bonus-cantrip", 
                name: "Bonus Cantrip", 
                level: 2, 
                source: "Land", 
                url: "", 
                desc: ["Learn one additional druid cantrip."],
                effects: [{ type: 'spell_access', count: 1, level: 0 }] 
            },
            { 
                index: "natural-recovery", 
                name: "Natural Recovery", 
                level: 2, 
                source: "Land", 
                url: "", 
                desc: ["Recover spell slots on short rest (up to half level)."],
                effects: [{ type: 'feature', name: 'Natural Recovery', description: 'Recover spell slots during Short Rest.' }]
            },
            { 
                index: "lands-stride", 
                name: "Land's Stride", 
                level: 6, 
                source: "Land", 
                url: "", 
                desc: ["Move through nonmagical difficult terrain without cost. Adv on saves vs magical plants."],
                effects: [{ type: 'advantage', key: 'magical_plants', label: 'Saves vs Magical Plants' }]
            }
        ]
    },
    {
        index: "moon",
        name: "Circle of the Moon",
        source: "Player's Handbook",
        class: { index: "druid", name: "Druid", url: "" },
        desc: ["Druids of the Circle of the Moon are fierce guardians of the wilds."],
        feature_details: [
            { 
                index: "combat-wild-shape", 
                name: "Combat Wild Shape", 
                level: 2, 
                source: "Moon", 
                url: "", 
                desc: ["Wild Shape as a Bonus Action. Expend spell slot to heal 1d8 per level while shaped."],
                effects: [{ type: 'bonus_action', name: 'Combat Wild Shape', description: 'Wild Shape as bonus action.' }]
            },
            { index: "circle-forms", name: "Circle Forms", level: 2, source: "Moon", url: "", desc: ["Transform into beasts of CR 1 (normally CR 1/4). Max CR increases at level 6 (CR 2) and higher."] },
            { index: "primal-strike", name: "Primal Strike", level: 6, source: "Moon", url: "", desc: ["Attacks in beast form count as magical."] }
        ]
    },
    {
        index: "dreams",
        name: "Circle of Dreams",
        source: "Xanathar's Guide to Everything",
        class: { index: "druid", name: "Druid", url: "" },
        desc: ["Guardians of the Feywild."],
        feature_details: [
            { 
                index: "balm-of-the-summer-court", 
                name: "Balm of the Summer Court", 
                level: 2, 
                source: "Dreams", 
                url: "", 
                desc: ["Pool of d6s (Level). Bonus Action: Heal ally within 120ft. Gain 1 temp HP per die spent."],
                effects: [{ type: 'bonus_action', name: 'Balm of the Summer Court', description: 'Heal ally using d6 pool.' }]
            },
            { index: "hearth-of-moonlight-and-shadow", name: "Hearth of Moonlight and Shadow", level: 6, source: "Dreams", url: "", desc: ["During rest, create invisible sphere. +5 Stealth/Perception."] }
        ]
    },
    {
        index: "shepherd",
        name: "Circle of the Shepherd",
        source: "Xanathar's Guide to Everything",
        class: { index: "druid", name: "Druid", url: "" },
        desc: ["Commune with the spirits of nature."],
        feature_details: [
            { index: "speech-of-the-woods", name: "Speech of the Woods", level: 2, source: "Shepherd", url: "", desc: ["Sylvan language. Speak with Animals at will."] },
            { 
                index: "spirit-totem", 
                name: "Spirit Totem", 
                level: 2, 
                source: "Shepherd", 
                url: "", 
                desc: ["Bonus Action: Summon Bear (Temp HP), Hawk (Reaction Adv), or Unicorn (AoE Heal) spirit aura. (1/Short Rest)"],
                effects: [{ type: 'bonus_action', name: 'Spirit Totem', description: 'Summon Bear, Hawk, or Unicorn spirit.' }]
            }
        ]
    },
    {
        index: "stars",
        name: "Circle of Stars",
        source: "Tasha's Cauldron of Everything",
        class: { index: "druid", name: "Druid", url: "" },
        desc: ["Druids who track the patterns of the constellations."],
        feature_details: [
            { 
                index: "star-map", 
                name: "Star Map", 
                level: 2, 
                source: "Stars", 
                url: "", 
                desc: ["Know Guidance cantrip. Cast Guiding Bolt without spell slot (PB/Long Rest)."],
                effects: [
                    { type: 'spell_access', spell: 'Guidance', cast_free: true },
                    { type: 'spell_access', spell: 'Guiding Bolt', cast_free: true }
                ]
            },
            { 
                index: "starry-form", 
                name: "Starry Form", 
                level: 2, 
                source: "Stars", 
                url: "", 
                desc: ["Bonus Action: Expend Wild Shape to take starry form. Choose Archer (Bonus Attack), Chalice (Extra Heal), or Dragon (Reliable Concentration)."],
                effects: [{ type: 'bonus_action', name: 'Starry Form', description: 'Transform into Archer, Chalice, or Dragon form.' }]
            }
        ]
    },
    {
        index: "spores",
        name: "Circle of Spores",
        source: "Tasha's Cauldron of Everything",
        class: { index: "druid", name: "Druid", url: "" },
        desc: ["Druids who find beauty in decay."],
        feature_details: [
            { 
                index: "halo-of-spores", 
                name: "Halo of Spores", 
                level: 2, 
                source: "Spores", 
                url: "", 
                desc: ["Reaction: Deal 1d4 necrotic to creature within 10ft."],
                effects: [{ type: 'reaction', name: 'Halo of Spores', description: 'Deal 1d4 necrotic to nearby creature.' }]
            },
            { 
                index: "symbiotic-entity", 
                name: "Symbiotic Entity", 
                level: 2, 
                source: "Spores", 
                url: "", 
                desc: ["Action: Expend Wild Shape. Gain 4*Level Temp HP. Double Halo damage. Melee hits deal +1d6 necrotic."],
                effects: [{ type: 'action', name: 'Symbiotic Entity', description: 'Gain temp HP and extra damage.' }]
            }
        ]
    },
    {
        index: "wildfire",
        name: "Circle of Wildfire",
        source: "Tasha's Cauldron of Everything",
        class: { index: "druid", name: "Druid", url: "" },
        desc: ["Destruction is the precursor to creation."],
        feature_details: [
            { 
                index: "summon-wildfire-spirit", 
                name: "Summon Wildfire Spirit", 
                level: 2, 
                source: "Wildfire", 
                url: "", 
                desc: ["Action: Expend Wild Shape to summon spirit. It shoots fire and teleports allies."],
                effects: [{ type: 'action', name: 'Summon Wildfire Spirit', description: 'Summon fire spirit companion.' }]
            }
        ]
    },

    // --- FIGHTER ---
    {
        index: "champion",
        name: "Champion",
        source: "Player's Handbook",
        class: { index: "fighter", name: "Fighter", url: "" },
        desc: ["The archetypal Champion focuses on the development of raw physical power."],
        feature_details: [
            { 
                index: "improved-critical", 
                name: "Improved Critical", 
                level: 3, 
                source: "Champion", 
                url: "", 
                desc: ["Crit on 19-20."],
                effects: [{ type: 'feature', name: 'Improved Critical', description: 'Critical hit range 19-20.' }]
            },
            { 
                index: "remarkable-athlete", 
                name: "Remarkable Athlete", 
                level: 7, 
                source: "Champion", 
                url: "", 
                desc: ["Add half prof bonus to Str/Dex/Con checks. Increase jump distance."],
                effects: [{ type: 'stat_bonus', stat: 'initiative', value: 0 }] // Half-prof logic usually hardcoded, placeholder
            },
            { 
                index: "additional-fighting-style", 
                name: "Additional Fighting Style", 
                level: 10, 
                source: "Champion", 
                url: "", 
                desc: ["Choose a second Fighting Style."] 
            }
        ]
    },
    {
        index: "battle-master",
        name: "Battle Master",
        source: "Player's Handbook",
        class: { index: "fighter", name: "Fighter", url: "" },
        desc: ["Student of the art of war, using maneuvers and superiority dice."],
        feature_details: [
            { 
                index: "combat-superiority", 
                name: "Combat Superiority", 
                level: 3, 
                source: "Battle Master", 
                url: "", 
                desc: ["Gain 4 Superiority Dice (d8). Learn 3 Maneuvers."],
                effects: [{ type: 'feature', name: 'Combat Superiority', description: '4d8 Superiority Dice. 3 Maneuvers.' }]
            },
            { 
                index: "student-of-war", 
                name: "Student of War", 
                level: 3, 
                source: "Battle Master", 
                url: "", 
                desc: ["Proficiency with one type of artisan's tools."],
                effects: [{ type: 'proficiency_choice', category: 'tool', count: 1 }]
            },
            { index: "know-your-enemy", name: "Know Your Enemy", level: 7, source: "Battle Master", url: "", desc: ["Observe enemy for 1 min to learn stats relative to yours."] }
        ]
    },
    {
        index: "eldritch-knight",
        name: "Eldritch Knight",
        source: "Player's Handbook",
        class: { index: "fighter", name: "Fighter", url: "" },
        desc: ["Combines martial mastery with spellcasting."],
        feature_details: [
            { index: "spellcasting-ek", name: "Spellcasting", level: 3, source: "Eldritch Knight", url: "", desc: ["Cast Wizard spells (Abjuration/Evocation). Int based."] },
            { 
                index: "weapon-bond", 
                name: "Weapon Bond", 
                level: 3, 
                source: "Eldritch Knight", 
                url: "", 
                desc: ["Bond with weapon. Can't be disarmed. Summon as bonus action."],
                effects: [{ type: 'bonus_action', name: 'Summon Bonded Weapon', description: 'Teleport weapon to hand.' }]
            },
            { 
                index: "war-magic", 
                name: "War Magic", 
                level: 7, 
                source: "Eldritch Knight", 
                url: "", 
                desc: ["When you cast a cantrip as action, make one weapon attack as bonus action."],
                effects: [{ type: 'bonus_action', name: 'War Magic Attack', description: 'Attack after casting cantrip.' }]
            }
        ]
    },
    {
        index: "arcane-archer",
        name: "Arcane Archer",
        source: "Xanathar's Guide to Everything",
        class: { index: "fighter", name: "Fighter", url: "" },
        desc: ["Master of elven archery methods."],
        feature_details: [
            { index: "arcane-shot", name: "Arcane Shot", level: 3, source: "Arcane Archer", url: "", desc: ["2/Short Rest. Apply magic effect to arrow."] },
            { index: "magic-arrow", name: "Magic Arrow", level: 7, source: "Arcane Archer", url: "", desc: ["Nonmagical arrows count as magical."] }
        ]
    },
    {
        index: "cavalier",
        name: "Cavalier",
        source: "Xanathar's Guide to Everything",
        class: { index: "fighter", name: "Fighter", url: "" },
        desc: ["Mounted or not, you excel at guarding others."],
        feature_details: [
            { index: "unwavering-mark", name: "Unwavering Mark", level: 3, source: "Cavalier", url: "", desc: ["Mark targets you hit. They have disadvantage to attack others. Bonus action attack if they deal damage to others."] }
        ]
    },
    {
        index: "samurai",
        name: "Samurai",
        source: "Xanathar's Guide to Everything",
        class: { index: "fighter", name: "Fighter", url: "" },
        desc: ["A fighter who draws on an implacable fighting spirit."],
        feature_details: [
            { 
                index: "fighting-spirit", 
                name: "Fighting Spirit", 
                level: 3, 
                source: "Samurai", 
                url: "", 
                desc: ["Bonus Action: Advantage on all attacks this turn. Gain 5 temp HP. (3/Long Rest)"],
                effects: [{ type: 'bonus_action', name: 'Fighting Spirit', description: 'Gain Advantage and 5 Temp HP.' }]
            },
            { 
                index: "elegant-courtier", 
                name: "Elegant Courtier", 
                level: 7, 
                source: "Samurai", 
                url: "", 
                desc: ["Add Wis mod to Persuasion checks. Proficiency in Wis saves."],
                effects: [
                    { type: 'proficiency', target: 'WIS', category: 'save' }
                ]
            }
        ]
    },
    {
        index: "psi-warrior",
        name: "Psi Warrior",
        source: "Tasha's Cauldron of Everything",
        class: { index: "fighter", name: "Fighter", url: "" },
        desc: ["Augment physical might with psionic power."],
        feature_details: [
            { index: "psionic-power", name: "Psionic Power", level: 3, source: "Psi Warrior", url: "", desc: ["Psionic Energy dice to reduce damage, deal extra damage, or move objects."] }
        ]
    },
    {
        index: "rune-knight",
        name: "Rune Knight",
        source: "Tasha's Cauldron of Everything",
        class: { index: "fighter", name: "Fighter", url: "" },
        desc: ["A fighter who uses the ancient practice of rune magic."],
        feature_details: [
            { 
                index: "rune-carver", 
                name: "Rune Carver", 
                level: 3, 
                source: "Rune Knight", 
                url: "", 
                desc: ["Learn 2 runes (e.g. Fire, Cloud, Stone) to inscribe on gear for passive/active benefits."] 
            },
            { 
                index: "giants-might", 
                name: "Giant's Might", 
                level: 3, 
                source: "Rune Knight", 
                url: "", 
                desc: ["Bonus Action: Become Large. Adv on Str checks/saves. +1d6 dmg once per turn."],
                effects: [{ type: 'bonus_action', name: "Giant's Might", description: 'Become Large, deal extra damage.' }]
            }
        ]
    },
    {
        index: "echo-knight",
        name: "Echo Knight",
        source: "Explorer's Guide to Wildemount",
        class: { index: "fighter", name: "Fighter", url: "" },
        desc: ["Summon a magical echo of yourself."],
        feature_details: [
            { index: "manifest-echo", name: "Manifest Echo", level: 3, source: "Echo Knight", url: "", desc: ["Bonus Action: Summon echo. Swap places, attack from its space."] },
            { index: "unleash-incarnation", name: "Unleash Incarnation", level: 3, source: "Echo Knight", url: "", desc: ["Melee attack from Echo's position (Con mod/Long Rest)."] }
        ]
    },

    // --- MONK ---
    {
        index: "open-hand",
        name: "Way of the Open Hand",
        source: "Player's Handbook",
        class: { index: "monk", name: "Monk", url: "" },
        desc: ["Masters of martial arts combat, manipulating Ki to heal or harm."],
        feature_details: [
            { index: "open-hand-technique", name: "Open Hand Technique", level: 3, source: "Open Hand", url: "", desc: ["Flurry of Blows adds effects: knockdown (Dex save), push 15ft (Str save), or remove reactions."] },
            { 
                index: "wholeness-of-body", 
                name: "Wholeness of Body", 
                level: 6, 
                source: "Open Hand", 
                url: "", 
                desc: ["Action: Heal 3 * Monk Level HP. (1/Long Rest)"],
                effects: [{ type: 'action', name: 'Wholeness of Body', description: 'Heal 3x Level HP.' }]
            }
        ]
    },
    {
        index: "shadow",
        name: "Way of Shadow",
        source: "Player's Handbook",
        class: { index: "monk", name: "Monk", url: "" },
        desc: ["Ninjas and assassins who manipulate darkness."],
        feature_details: [
            { 
                index: "shadow-arts", 
                name: "Shadow Arts", 
                level: 3, 
                source: "Shadow", 
                url: "", 
                desc: ["Spend 2 Ki to cast Darkness, Darkvision, Pass Without Trace, or Silence. Minor Illusion cantrip."],
                effects: [{ type: 'spell_access', spell: 'Minor Illusion', cast_free: true }]
            },
            { 
                index: "shadow-step", 
                name: "Shadow Step", 
                level: 6, 
                source: "Shadow", 
                url: "", 
                desc: ["Bonus Action: Teleport 60ft from dim light to dim light. Adv on next melee attack."],
                effects: [{ type: 'bonus_action', name: 'Shadow Step', description: 'Teleport 60ft in dim light.' }]
            }
        ]
    },
    {
        index: "four-elements",
        name: "Way of the Four Elements",
        source: "Player's Handbook",
        class: { index: "monk", name: "Monk", url: "" },
        desc: ["Use Ki to cast elemental spells."],
        feature_details: [
            { index: "disciple-of-the-elements", name: "Disciple of the Elements", level: 3, source: "Four Elements", url: "", desc: ["Learn elemental disciplines (spells)."] }
        ]
    },
    {
        index: "drunken-master",
        name: "Way of the Drunken Master",
        source: "Xanathar's Guide to Everything",
        class: { index: "monk", name: "Monk", url: "" },
        desc: ["Perform like a drunkard to confuse enemies."],
        feature_details: [
            { index: "drunken-technique", name: "Drunken Technique", level: 3, source: "Drunken Master", url: "", desc: ["Flurry of Blows grants Disengage and +10ft speed."] }
        ]
    },
    {
        index: "kensei",
        name: "Way of the Kensei",
        source: "Xanathar's Guide to Everything",
        class: { index: "monk", name: "Monk", url: "" },
        desc: ["Monks who train relentlessly with their weapons."],
        feature_details: [
            { 
                index: "path-of-the-kensei", 
                name: "Path of the Kensei", 
                level: 3, 
                source: "Kensei", 
                url: "", 
                desc: ["Choose 2 Kensei weapons. Agile Parry: +2 AC if you make unarmed strike. Kensei's Shot: Bonus action +1d4 ranged dmg."],
                effects: [{ type: 'bonus_action', name: "Kensei's Shot", description: 'Add 1d4 to ranged attacks this turn.' }]
            },
            { index: "one-with-the-blade", name: "One with the Blade", level: 6, source: "Kensei", url: "", desc: ["Kensei weapons count as magical. Deft Strike: Spend 1 ki to deal extra damage."] }
        ]
    },
    {
        index: "sun-soul",
        name: "Way of the Sun Soul",
        source: "Xanathar's Guide to Everything",
        class: { index: "monk", name: "Monk", url: "" },
        desc: ["Channel life energy into searing bolts of light."],
        feature_details: [
            { index: "radiant-sun-bolt", name: "Radiant Sun Bolt", level: 3, source: "Sun Soul", url: "", desc: ["Ranged spell attack (30ft) dealing radiant damage (martial arts die)."] }
        ]
    },
    {
        index: "astral-self",
        name: "Way of the Astral Self",
        source: "Tasha's Cauldron of Everything",
        class: { index: "monk", name: "Monk", url: "" },
        desc: ["Summon spectral arms of your astral self."],
        feature_details: [
            { index: "arms-of-the-astral-self", name: "Arms of the Astral Self", level: 3, source: "Astral Self", url: "", desc: ["Bonus Action: Summon arms. Reach +5ft. Use Wis for Str checks/attacks. Radiant/Necrotic damage."] }
        ]
    },
    {
        index: "mercy",
        name: "Way of Mercy",
        source: "Tasha's Cauldron of Everything",
        class: { index: "monk", name: "Monk", url: "" },
        desc: ["Monks who manipulate the life force of others to bring aid or end suffering."],
        feature_details: [
            { 
                index: "hand-of-healing", 
                name: "Hand of Healing", 
                level: 3, 
                source: "Mercy", 
                url: "", 
                desc: ["Spend 1 Ki to heal (Martial Arts die + Wis) as an action, or as part of Flurry of Blows."],
                effects: [{ type: 'action', name: 'Hand of Healing', description: 'Heal ally using Ki.' }]
            },
            { index: "hand-of-harm", name: "Hand of Harm", level: 3, source: "Mercy", url: "", desc: ["Spend 1 Ki when you hit to deal extra necrotic damage."] }
        ]
    },
    {
        index: "ascendant-dragon",
        name: "Way of the Ascendant Dragon",
        source: "Fizban's Treasury of Dragons",
        class: { index: "monk", name: "Monk", url: "" },
        desc: ["Channel the power of dragons."],
        feature_details: [
            { index: "draconic-disciple", name: "Draconic Disciple", level: 3, source: "Ascendant Dragon", url: "", desc: ["Change unarmed damage type. Speak Draconic."] },
            { index: "breath-of-the-dragon", name: "Breath of the Dragon", level: 3, source: "Ascendant Dragon", url: "", desc: ["Replace attack with breath weapon (cone/line)."] }
        ]
    },
    {
        index: "long-death",
        name: "Way of the Long Death",
        source: "Sword Coast Adventurer's Guide",
        class: { index: "monk", name: "Monk", url: "" },
        desc: ["Obsessed with the meaning and mechanics of dying."],
        feature_details: [
            { index: "touch-of-death", name: "Touch of Death", level: 3, source: "Long Death", url: "", desc: ["Reduce creature to 0 HP -> gain temp HP (Wis + Level)."] }
        ]
    },

    // --- ROGUE ---
    {
        index: "thief",
        name: "Thief",
        source: "Player's Handbook",
        class: { index: "rogue", name: "Rogue", url: "" },
        desc: ["Professional treasure seeker."],
        feature_details: [
            { 
                index: "fast-hands", 
                name: "Fast Hands", 
                level: 3, 
                source: "Thief", 
                url: "", 
                desc: ["Cunning Action: Sleight of Hand, Thieves' Tools, or Use Object."],
                effects: [{ type: 'bonus_action', name: 'Fast Hands', description: 'Use Object, Sleight of Hand, or Thieves Tools.' }]
            },
            { 
                index: "second-story-work", 
                name: "Second-Story Work", 
                level: 3, 
                source: "Thief", 
                url: "", 
                desc: ["Climb speed. Jump distance based on Dex."] 
            },
            { 
                index: "supreme-sneak", 
                name: "Supreme Sneak", 
                level: 9, 
                source: "Thief", 
                url: "", 
                desc: ["Adv on Stealth if you move half speed."] 
            }
        ]
    },
    {
        index: "assassin",
        name: "Assassin",
        source: "Player's Handbook",
        class: { index: "rogue", name: "Rogue", url: "" },
        desc: ["Master of the quick kill."],
        feature_details: [
            { 
                index: "bonus-proficiencies-assassin", 
                name: "Bonus Proficiencies", 
                level: 3, 
                source: "Assassin", 
                url: "", 
                desc: ["Disguise kit, poisoner's kit."],
                effects: [
                    { type: 'proficiency', target: 'Disguise Kit', category: 'tool' },
                    { type: 'proficiency', target: "Poisoner's Kit", category: 'tool' }
                ]
            },
            { index: "assassinate", name: "Assassinate", level: 3, source: "Assassin", url: "", desc: ["Adv on attacks vs creatures that haven't acted. Auto-crit vs surprised creatures."] },
            { index: "infiltration-expertise", name: "Infiltration Expertise", level: 9, source: "Assassin", url: "", desc: ["Create false identities."] }
        ]
    },
    {
        index: "arcane-trickster",
        name: "Arcane Trickster",
        source: "Player's Handbook",
        class: { index: "rogue", name: "Rogue", url: "" },
        desc: ["Combines sleight of hand with illusion magic."],
        feature_details: [
            { 
                index: "spellcasting-at", 
                name: "Spellcasting", 
                level: 3, 
                source: "Arcane Trickster", 
                url: "", 
                desc: ["Wizard spells (Enchantment/Illusion). Int based."] 
            },
            { 
                index: "mage-hand-legerdemain", 
                name: "Mage Hand Legerdemain", 
                level: 3, 
                source: "Arcane Trickster", 
                url: "", 
                desc: ["Invisible Mage Hand. Pick pockets/locks at range."],
                effects: [{ type: 'spell_access', spell: 'Mage Hand', cast_free: true }]
            },
            { 
                index: "magical-ambush", 
                name: "Magical Ambush", 
                level: 9, 
                source: "Arcane Trickster", 
                url: "", 
                desc: ["Disadv on saves vs your spells if you are hidden."] 
            }
        ]
    },
    {
        index: "inquisitive",
        name: "Inquisitive",
        source: "Xanathar's Guide to Everything",
        class: { index: "rogue", name: "Rogue", url: "" },
        desc: ["Expert at rooting out secrets and reading people."],
        feature_details: [
            { index: "insightful-fighting", name: "Insightful Fighting", level: 3, source: "Inquisitive", url: "", desc: ["Bonus Action: Insight vs Deception. Success = Sneak Attack even without advantage for 1 min."] }
        ]
    },
    {
        index: "mastermind",
        name: "Mastermind",
        source: "Xanathar's Guide to Everything",
        class: { index: "rogue", name: "Rogue", url: "" },
        desc: ["Spy, courtier, and schemer."],
        feature_details: [
            { index: "master-of-tactics", name: "Master of Tactics", level: 3, source: "Mastermind", url: "", desc: ["Use Help action as Bonus Action. Range 30ft."] }
        ]
    },
    {
        index: "scout",
        name: "Scout",
        source: "Xanathar's Guide to Everything",
        class: { index: "rogue", name: "Rogue", url: "" },
        desc: ["Skilled in woodcraft and stealth."],
        feature_details: [
            { index: "skirmisher", name: "Skirmisher", level: 3, source: "Scout", url: "", desc: ["Reaction: Move half speed when enemy ends turn near you (no OA)."] },
            { index: "survivalist", name: "Survivalist", level: 3, source: "Scout", url: "", desc: ["Proficiency and Expertise in Nature and Survival."] }
        ]

    }
];