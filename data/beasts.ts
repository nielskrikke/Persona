

import { CreatureDetail } from '../types';

export const COMMON_CREATURES: CreatureDetail[] = [
    // CR 0
    {
        index: 'baboon', name: 'Baboon', size: 'Small', type: 'beast', challenge_rating: 0,
        ac: 12, hp: 3, hit_dice: '1d6', speed: '30 ft., climb 30 ft.',
        str: 8, dex: 14, con: 11, int: 4, wis: 12, cha: 6,
        senses: 'Passive Perception 11', languages: '',
        traits: [{ name: 'Pack Tactics', desc: 'Advantage on attack rolls if ally within 5ft.' }],
        actions: [{ name: 'Bite', desc: 'Melee Weapon Attack: +1 to hit, reach 5 ft., one target. Hit: 1d4-1 piercing damage.', attack_bonus: 1, damage_dice: '1d4-1', damage_type: 'piercing' }]
    },
    {
        index: 'badger', name: 'Badger', size: 'Tiny', type: 'beast', challenge_rating: 0,
        ac: 10, hp: 3, hit_dice: '1d4 + 1', speed: '20 ft., burrow 5 ft.',
        str: 4, dex: 11, con: 12, int: 2, wis: 12, cha: 5,
        senses: 'Darkvision 30 ft., Passive Perception 11', languages: '',
        traits: [{ name: 'Keen Smell', desc: 'Advantage on Perception checks that rely on smell.' }],
        actions: [{ name: 'Bite', desc: 'Melee Weapon Attack: +2 to hit, reach 5 ft., one target. Hit: 1 piercing damage.', attack_bonus: 2, damage_dice: '1', damage_type: 'piercing' }]
    },
    {
        index: 'bat', name: 'Bat', size: 'Tiny', type: 'beast', challenge_rating: 0,
        ac: 12, hp: 1, hit_dice: '1d4-1', speed: '5 ft., fly 30 ft.',
        str: 2, dex: 15, con: 8, int: 2, wis: 12, cha: 4,
        senses: 'Blindsight 60 ft.', languages: '',
        traits: [{name: 'Echolocation', desc: 'No blindsight while deafened.'}, {name: 'Keen Hearing', desc: 'Advantage on Perception (hearing).'}],
        actions: [{name: 'Bite', desc: 'Melee Weapon Attack: +0 to hit, reach 5 ft., one creature. Hit: 1 piercing damage.', attack_bonus: 0, damage_dice: '1'}],
        fly_speed: 30
    },
    {
        index: 'cat', name: 'Cat', size: 'Tiny', type: 'beast', challenge_rating: 0,
        ac: 12, hp: 2, hit_dice: '1d4', speed: '40 ft., climb 30 ft.',
        str: 3, dex: 15, con: 10, int: 3, wis: 12, cha: 7,
        senses: 'Passive Perception 13', languages: '',
        traits: [{name: 'Keen Smell', desc: 'Advantage on Perception (smell).'}],
        actions: [{name: 'Claws', desc: 'Melee Weapon Attack: +0 to hit, reach 5 ft., one target. Hit: 1 slashing damage.', attack_bonus: 0, damage_dice: '1'}]
    },
    {
        index: 'crab', name: 'Crab', size: 'Tiny', type: 'beast', challenge_rating: 0,
        ac: 11, hp: 2, hit_dice: '1d4', speed: '20 ft., swim 20 ft.',
        str: 2, dex: 11, con: 10, int: 1, wis: 8, cha: 2,
        senses: 'Blindsight 30 ft., Passive Perception 9', languages: '',
        traits: [{name: 'Amphibious', desc: 'Can breathe air and water.'}],
        actions: [{name: 'Claw', desc: 'Melee Weapon Attack: +0 to hit, reach 5 ft., one target. Hit: 1 bludgeoning damage.', attack_bonus: 0, damage_dice: '1'}],
        swim_speed: 20
    },
    {
        index: 'deer', name: 'Deer', size: 'Medium', type: 'beast', challenge_rating: 0,
        ac: 13, hp: 4, hit_dice: '1d8', speed: '50 ft.',
        str: 11, dex: 16, con: 11, int: 2, wis: 14, cha: 5,
        senses: 'Passive Perception 12', languages: '',
        traits: [],
        actions: [{name: 'Bite', desc: 'Melee Weapon Attack: +2 to hit, reach 5 ft., one target. Hit: 2 (1d4) piercing damage.', attack_bonus: 2, damage_dice: '1d4'}]
    },
    {
        index: 'eagle', name: 'Eagle', size: 'Small', type: 'beast', challenge_rating: 0,
        ac: 12, hp: 3, hit_dice: '1d6', speed: '10 ft., fly 60 ft.',
        str: 6, dex: 15, con: 10, int: 2, wis: 14, cha: 7,
        senses: 'Passive Perception 14', languages: '',
        traits: [{name: 'Keen Sight', desc: 'Advantage on Perception (sight).'}],
        actions: [{name: 'Talons', desc: 'Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 1d4+2 slashing damage.', attack_bonus: 4, damage_dice: '1d4+2'}],
        fly_speed: 60
    },
    {
        index: 'frog', name: 'Frog', size: 'Tiny', type: 'beast', challenge_rating: 0,
        ac: 11, hp: 1, hit_dice: '1d4-1', speed: '20 ft., swim 20 ft.',
        str: 1, dex: 13, con: 8, int: 1, wis: 8, cha: 3,
        senses: 'Darkvision 30 ft., Passive Perception 9', languages: '',
        traits: [{name: 'Amphibious', desc: 'Can breathe air and water.'}, {name: 'Standing Leap', desc: 'Long jump up to 10 ft. and high jump up to 5 ft. with or without running start.'}],
        actions: [],
        swim_speed: 20
    },
    {
        index: 'giant-fire-beetle', name: 'Giant Fire Beetle', size: 'Small', type: 'beast', challenge_rating: 0,
        ac: 13, hp: 4, hit_dice: '1d6+1', speed: '30 ft.',
        str: 8, dex: 10, con: 12, int: 1, wis: 7, cha: 3,
        senses: 'Blindsight 30 ft., Passive Perception 8', languages: '',
        traits: [{name: 'Illumination', desc: 'Sheds bright light in a 10-foot radius and dim light for an additional 10 feet.'}],
        actions: [{name: 'Bite', desc: 'Melee Weapon Attack: +1 to hit, reach 5 ft., one target. Hit: 1d6-1 slashing damage.', attack_bonus: 1, damage_dice: '1d6-1'}]
    },
    {
        index: 'goat', name: 'Goat', size: 'Medium', type: 'beast', challenge_rating: 0,
        ac: 10, hp: 4, hit_dice: '1d8', speed: '40 ft.',
        str: 12, dex: 10, con: 11, int: 2, wis: 10, cha: 5,
        senses: 'Passive Perception 10', languages: '',
        traits: [{name: 'Charge', desc: 'If the goat moves at least 20 ft. straight toward a target and then hits it with a ram attack on the same turn, the target takes an extra 2 (1d4) bludgeoning damage. DC 10 Str save or prone.'}, {name: 'Sure-Footed', desc: 'Advantage on Str/Dex saves vs prone.'}],
        actions: [{name: 'Ram', desc: 'Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 1d4+1 bludgeoning damage.', attack_bonus: 3, damage_dice: '1d4+1'}]
    },
    {
        index: 'hawk', name: 'Hawk', size: 'Tiny', type: 'beast', challenge_rating: 0,
        ac: 13, hp: 1, hit_dice: '1d4-1', speed: '10 ft., fly 60 ft.',
        str: 5, dex: 16, con: 8, int: 2, wis: 14, cha: 6,
        senses: 'Passive Perception 14', languages: '',
        traits: [{name: 'Keen Sight', desc: 'Advantage on Perception (sight).'}],
        actions: [{name: 'Talons', desc: 'Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 1 slashing damage.', attack_bonus: 5, damage_dice: '1'}],
        fly_speed: 60
    },
    {
        index: 'hyena', name: 'Hyena', size: 'Medium', type: 'beast', challenge_rating: 0,
        ac: 11, hp: 5, hit_dice: '1d8+1', speed: '50 ft.',
        str: 11, dex: 13, con: 12, int: 2, wis: 12, cha: 5,
        senses: 'Passive Perception 11', languages: '',
        traits: [{name: 'Pack Tactics', desc: 'Advantage on attack rolls if ally within 5ft.'}],
        actions: [{name: 'Bite', desc: 'Melee Weapon Attack: +2 to hit, reach 5 ft., one target. Hit: 3 (1d6) piercing damage.', attack_bonus: 2, damage_dice: '1d6'}]
    },
    {
        index: 'jackal', name: 'Jackal', size: 'Small', type: 'beast', challenge_rating: 0,
        ac: 12, hp: 3, hit_dice: '1d6', speed: '40 ft.',
        str: 8, dex: 15, con: 11, int: 3, wis: 12, cha: 6,
        senses: 'Passive Perception 11', languages: '',
        traits: [{name: 'Keen Hearing and Smell', desc: 'Advantage on Perception (hearing/smell).'}, {name: 'Pack Tactics', desc: 'Advantage on attack rolls if ally within 5ft.'}],
        actions: [{name: 'Bite', desc: 'Melee Weapon Attack: +1 to hit, reach 5 ft., one target. Hit: 1d4-1 piercing damage.', attack_bonus: 1, damage_dice: '1d4-1'}]
    },
    {
        index: 'lizard', name: 'Lizard', size: 'Tiny', type: 'beast', challenge_rating: 0,
        ac: 10, hp: 2, hit_dice: '1d4', speed: '20 ft., climb 20 ft.',
        str: 2, dex: 11, con: 10, int: 1, wis: 8, cha: 3,
        senses: 'Darkvision 30 ft., Passive Perception 9', languages: '',
        traits: [],
        actions: [{name: 'Bite', desc: 'Melee Weapon Attack: +0 to hit, reach 5 ft., one target. Hit: 1 piercing damage.', attack_bonus: 0, damage_dice: '1'}]
    },
    {
        index: 'octopus', name: 'Octopus', size: 'Small', type: 'beast', challenge_rating: 0,
        ac: 12, hp: 3, hit_dice: '1d6', speed: '5 ft., swim 30 ft.',
        str: 4, dex: 15, con: 11, int: 3, wis: 10, cha: 4,
        senses: 'Darkvision 30 ft., Passive Perception 10', languages: '',
        traits: [{name: 'Hold Breath', desc: 'While out of water, can hold breath for 30 minutes.'}, {name: 'Underwater Camouflage', desc: 'Advantage on Stealth checks while underwater.'}, {name: 'Water Breathing', desc: 'Can breathe only underwater.'}],
        actions: [{name: 'Tentacles', desc: 'Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 1 bludgeoning damage, and target is grappled (escape DC 10).', attack_bonus: 4, damage_dice: '1'}, {name: 'Ink Cloud', desc: '5ft radius cloud. Heavily obscured. Dash as bonus action (Recharge 6).'}],
        swim_speed: 30
    },
    {
        index: 'owl', name: 'Owl', size: 'Tiny', type: 'beast', challenge_rating: 0,
        ac: 11, hp: 1, hit_dice: '1d4-1', speed: '5 ft., fly 60 ft.',
        str: 3, dex: 13, con: 8, int: 2, wis: 12, cha: 7,
        senses: 'Darkvision 120 ft., Passive Perception 13', languages: '',
        traits: [{name: 'Flyby', desc: 'Doesn\'t provoke opportunity attacks when flying out of reach.'}, {name: 'Keen Hearing and Sight', desc: 'Advantage on Perception (hearing/sight).'}],
        actions: [{name: 'Talons', desc: 'Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 1 slashing damage.', attack_bonus: 3, damage_dice: '1'}],
        fly_speed: 60
    },
    {
        index: 'quipper', name: 'Quipper', size: 'Tiny', type: 'beast', challenge_rating: 0,
        ac: 13, hp: 1, hit_dice: '1d4-1', speed: '0 ft., swim 40 ft.',
        str: 2, dex: 16, con: 9, int: 1, wis: 7, cha: 2,
        senses: 'Darkvision 60 ft., Passive Perception 8', languages: '',
        traits: [{name: 'Blood Frenzy', desc: 'Advantage on melee attack rolls against creature that doesn\'t have all its hp.'}, {name: 'Water Breathing', desc: 'Can breathe only underwater.'}],
        actions: [{name: 'Bite', desc: 'Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 1 piercing damage.', attack_bonus: 5, damage_dice: '1'}],
        swim_speed: 40
    },
    {
        index: 'rat', name: 'Rat', size: 'Tiny', type: 'beast', challenge_rating: 0,
        ac: 10, hp: 1, hit_dice: '1d4-1', speed: '20 ft.',
        str: 2, dex: 11, con: 9, int: 2, wis: 10, cha: 4,
        senses: 'Darkvision 30 ft., Passive Perception 10', languages: '',
        traits: [{name: 'Keen Smell', desc: 'Advantage on Perception (smell).'}],
        actions: [{name: 'Bite', desc: 'Melee Weapon Attack: +0 to hit, reach 5 ft., one target. Hit: 1 piercing damage.', attack_bonus: 0, damage_dice: '1'}]
    },
    {
        index: 'raven', name: 'Raven', size: 'Tiny', type: 'beast', challenge_rating: 0,
        ac: 12, hp: 1, hit_dice: '1d4-1', speed: '10 ft., fly 50 ft.',
        str: 2, dex: 14, con: 8, int: 2, wis: 12, cha: 6,
        senses: 'Passive Perception 13', languages: '',
        traits: [{name: 'Mimicry', desc: 'Can mimic simple sounds (DC 10 Insight to detect).'}],
        actions: [{name: 'Beak', desc: 'Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 1 piercing damage.', attack_bonus: 4, damage_dice: '1'}],
        fly_speed: 50
    },
    {
        index: 'scorpion', name: 'Scorpion', size: 'Tiny', type: 'beast', challenge_rating: 0,
        ac: 11, hp: 1, hit_dice: '1d4-1', speed: '10 ft.',
        str: 2, dex: 11, con: 10, int: 1, wis: 8, cha: 2,
        senses: 'Blindsight 10 ft., Passive Perception 9', languages: '',
        traits: [],
        actions: [{name: 'Sting', desc: 'Melee Weapon Attack: +2 to hit, reach 5 ft., one creature. Hit: 1 piercing damage + 1d8 poison (half on DC 9 Con save).', attack_bonus: 2, damage_dice: '1d8+1'}]
    },
    {
        index: 'sea-horse', name: 'Sea Horse', size: 'Tiny', type: 'beast', challenge_rating: 0,
        ac: 11, hp: 1, hit_dice: '1d4-1', speed: '0 ft., swim 20 ft.',
        str: 1, dex: 12, con: 8, int: 1, wis: 10, cha: 2,
        senses: 'Passive Perception 10', languages: '',
        traits: [{name: 'Water Breathing', desc: 'Can breathe only underwater.'}],
        actions: [],
        swim_speed: 20
    },
    {
        index: 'spider', name: 'Spider', size: 'Tiny', type: 'beast', challenge_rating: 0,
        ac: 12, hp: 1, hit_dice: '1d4-1', speed: '20 ft., climb 20 ft.',
        str: 2, dex: 14, con: 8, int: 1, wis: 10, cha: 2,
        senses: 'Darkvision 30 ft., Passive Perception 10', languages: '',
        traits: [{name: 'Spider Climb', desc: 'Can climb difficult surfaces, including upside down.'}, {name: 'Web Sense', desc: 'Knows location of creatures in contact with same web.'}],
        actions: [{name: 'Bite', desc: 'Melee Weapon Attack: +4 to hit, reach 5 ft., one creature. Hit: 1 piercing damage + 1d4 poison.', attack_bonus: 4, damage_dice: '1'}]
    },
    {
        index: 'vulture', name: 'Vulture', size: 'Medium', type: 'beast', challenge_rating: 0,
        ac: 10, hp: 5, hit_dice: '1d8+1', speed: '10 ft., fly 50 ft.',
        str: 7, dex: 10, con: 13, int: 2, wis: 12, cha: 4,
        senses: 'Passive Perception 11', languages: '',
        traits: [{name: 'Keen Sight and Smell', desc: 'Advantage on Perception (sight/smell).'}, {name: 'Pack Tactics', desc: 'Advantage on attack rolls if ally within 5ft.'}],
        actions: [{name: 'Beak', desc: 'Melee Weapon Attack: +2 to hit, reach 5 ft., one target. Hit: 2 (1d4) piercing damage.', attack_bonus: 2, damage_dice: '1d4'}],
        fly_speed: 50
    },
    {
        index: 'weasel', name: 'Weasel', size: 'Tiny', type: 'beast', challenge_rating: 0,
        ac: 13, hp: 1, hit_dice: '1d4-1', speed: '30 ft.',
        str: 3, dex: 16, con: 8, int: 2, wis: 12, cha: 3,
        senses: 'Passive Perception 13', languages: '',
        traits: [{name: 'Keen Hearing and Smell', desc: 'Advantage on Perception (hearing/smell).'}],
        actions: [{name: 'Bite', desc: 'Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 1 piercing damage.', attack_bonus: 5, damage_dice: '1'}]
    },

    // CR 1/8
    {
        index: 'blood-hawk', name: 'Blood Hawk', size: 'Small', type: 'beast', challenge_rating: 0.125,
        ac: 12, hp: 7, hit_dice: '2d6', speed: '10 ft., fly 60 ft.',
        str: 6, dex: 14, con: 10, int: 3, wis: 14, cha: 5,
        senses: 'Passive Perception 14', languages: '',
        traits: [{name: 'Keen Sight', desc: 'Advantage on Perception (sight).'}, {name: 'Pack Tactics', desc: 'Advantage on attack rolls if ally within 5ft.'}],
        actions: [{name: 'Beak', desc: 'Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 1d4+2 piercing damage.', attack_bonus: 4, damage_dice: '1d4+2'}],
        fly_speed: 60
    },
    {
        index: 'camel', name: 'Camel', size: 'Large', type: 'beast', challenge_rating: 0.125,
        ac: 9, hp: 15, hit_dice: '2d10+4', speed: '50 ft.',
        str: 16, dex: 8, con: 14, int: 2, wis: 8, cha: 5,
        senses: 'Passive Perception 9', languages: '',
        traits: [],
        actions: [{name: 'Bite', desc: 'Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 1d4 damage.', attack_bonus: 5, damage_dice: '1d4'}]
    },
    {
        index: 'flying-snake', name: 'Flying Snake', size: 'Tiny', type: 'beast', challenge_rating: 0.125,
        ac: 14, hp: 5, hit_dice: '2d4', speed: '30 ft., fly 60 ft., swim 30 ft.',
        str: 4, dex: 18, con: 11, int: 2, wis: 12, cha: 5,
        senses: 'Blindsight 10 ft., Passive Perception 11', languages: '',
        traits: [{name: 'Flyby', desc: 'Doesn\'t provoke opportunity attacks when flying out of reach.'}],
        actions: [{name: 'Bite', desc: 'Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 1 piercing damage + 3d4 poison.', attack_bonus: 6, damage_dice: '1+3d4'}],
        fly_speed: 60, swim_speed: 30
    },
    {
        index: 'giant-crab', name: 'Giant Crab', size: 'Medium', type: 'beast', challenge_rating: 0.125,
        ac: 15, hp: 13, hit_dice: '3d8', speed: '30 ft., swim 30 ft.',
        str: 13, dex: 15, con: 11, int: 1, wis: 9, cha: 3,
        senses: 'Blindsight 30 ft., Passive Perception 9', languages: '',
        traits: [{name: 'Amphibious', desc: 'Can breathe air and water.'}],
        actions: [{name: 'Claw', desc: 'Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 1d6+1 bludgeoning, and target is grappled (escape DC 11).', attack_bonus: 3, damage_dice: '1d6+1'}],
        swim_speed: 30
    },
    {
        index: 'giant-rat', name: 'Giant Rat', size: 'Small', type: 'beast', challenge_rating: 0.125,
        ac: 12, hp: 7, hit_dice: '2d6', speed: '30 ft.',
        str: 7, dex: 15, con: 11, int: 2, wis: 10, cha: 4,
        senses: 'Darkvision 60 ft., Passive Perception 10', languages: '',
        traits: [{name: 'Keen Smell', desc: 'Advantage on Perception (smell).'}, {name: 'Pack Tactics', desc: 'Advantage on attack rolls if ally within 5ft.'}],
        actions: [{name: 'Bite', desc: 'Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 1d4+2 piercing damage.', attack_bonus: 4, damage_dice: '1d4+2'}]
    },
    {
        index: 'giant-weasel', name: 'Giant Weasel', size: 'Medium', type: 'beast', challenge_rating: 0.125,
        ac: 13, hp: 9, hit_dice: '2d8', speed: '40 ft.',
        str: 11, dex: 16, con: 10, int: 4, wis: 12, cha: 5,
        senses: 'Darkvision 60 ft., Passive Perception 13', languages: '',
        traits: [{name: 'Keen Hearing and Smell', desc: 'Advantage on Perception (hearing/smell).'}],
        actions: [{name: 'Bite', desc: 'Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 1d4+3 piercing damage.', attack_bonus: 5, damage_dice: '1d4+3'}]
    },
    {
        index: 'mastiff', name: 'Mastiff', size: 'Medium', type: 'beast', challenge_rating: 0.125,
        ac: 12, hp: 5, hit_dice: '1d8+1', speed: '40 ft.',
        str: 13, dex: 14, con: 12, int: 3, wis: 12, cha: 7,
        senses: 'Passive Perception 13', languages: '',
        traits: [{name: 'Keen Hearing and Smell', desc: 'Advantage on Perception (hearing/smell).'}],
        actions: [{name: 'Bite', desc: 'Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 1d6+1 piercing damage. If target is creature, DC 11 Str save or prone.', attack_bonus: 3, damage_dice: '1d6+1'}]
    },
    {
        index: 'mule', name: 'Mule', size: 'Medium', type: 'beast', challenge_rating: 0.125,
        ac: 10, hp: 11, hit_dice: '2d8+2', speed: '40 ft.',
        str: 14, dex: 10, con: 13, int: 2, wis: 10, cha: 5,
        senses: 'Passive Perception 10', languages: '',
        traits: [{name: 'Beast of Burden', desc: 'Considered Large for carrying capacity.'}, {name: 'Sure-Footed', desc: 'Advantage on Str/Dex saves vs prone.'}],
        actions: [{name: 'Hooves', desc: 'Melee Weapon Attack: +2 to hit, reach 5 ft., one target. Hit: 1d4+2 bludgeoning damage.', attack_bonus: 2, damage_dice: '1d4+2'}]
    },
    {
        index: 'poisonous-snake', name: 'Poisonous Snake', size: 'Tiny', type: 'beast', challenge_rating: 0.125,
        ac: 13, hp: 2, hit_dice: '1d4', speed: '30 ft., swim 30 ft.',
        str: 2, dex: 16, con: 11, int: 1, wis: 10, cha: 3,
        senses: 'Blindsight 10 ft., Passive Perception 10', languages: '',
        traits: [],
        actions: [{name: 'Bite', desc: 'Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 1 piercing damage + 2d4 poison (half on DC 10 Con save).', attack_bonus: 5, damage_dice: '1+2d4'}],
        swim_speed: 30
    },
    {
        index: 'pony', name: 'Pony', size: 'Medium', type: 'beast', challenge_rating: 0.125,
        ac: 10, hp: 11, hit_dice: '2d8+2', speed: '40 ft.',
        str: 15, dex: 10, con: 13, int: 2, wis: 11, cha: 7,
        senses: 'Passive Perception 10', languages: '',
        traits: [],
        actions: [{name: 'Hooves', desc: 'Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 2d4+2 bludgeoning damage.', attack_bonus: 4, damage_dice: '2d4+2'}]
    },
    {
        index: 'stirge', name: 'Stirge', size: 'Tiny', type: 'beast', challenge_rating: 0.125,
        ac: 14, hp: 2, hit_dice: '1d4', speed: '10 ft., fly 40 ft.',
        str: 4, dex: 16, con: 11, int: 2, wis: 8, cha: 6,
        senses: 'Darkvision 60 ft., Passive Perception 9', languages: '',
        traits: [],
        actions: [{name: 'Blood Drain', desc: 'Melee Weapon Attack: +5 to hit, reach 5 ft., one creature. Hit: 1d4+3 piercing, and stirge attaches. While attached, auto hits for 1d4+3 damage each turn.', attack_bonus: 5, damage_dice: '1d4+3'}],
        fly_speed: 40
    },

    // CR 1/4
    {
        index: 'axe-beak', name: 'Axe Beak', size: 'Large', type: 'beast', challenge_rating: 0.25,
        ac: 11, hp: 19, hit_dice: '3d10+3', speed: '50 ft.',
        str: 14, dex: 12, con: 12, int: 2, wis: 10, cha: 5,
        senses: 'Passive Perception 10', languages: '',
        traits: [],
        actions: [{name: 'Beak', desc: 'Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 1d8+2 slashing damage.', attack_bonus: 4, damage_dice: '1d8+2'}]
    },
    {
        index: 'boar', name: 'Boar', size: 'Medium', type: 'beast', challenge_rating: 0.25,
        ac: 11, hp: 11, hit_dice: '2d8+2', speed: '40 ft.',
        str: 13, dex: 11, con: 12, int: 2, wis: 9, cha: 5,
        senses: 'Passive Perception 9', languages: '',
        traits: [{name: 'Charge', desc: 'Move 20ft straight -> extra 1d6 dmg. DC 11 Str save or prone.'}, {name: 'Relentless', desc: 'If takes <=7 damage and reduced to 0 HP, drops to 1 HP instead (1/Short Rest).'}],
        actions: [{name: 'Tusk', desc: 'Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 1d6+1 slashing damage.', attack_bonus: 3, damage_dice: '1d6+1'}]
    },
    {
        index: 'constrictor-snake', name: 'Constrictor Snake', size: 'Large', type: 'beast', challenge_rating: 0.25,
        ac: 12, hp: 13, hit_dice: '2d10+2', speed: '30 ft., swim 30 ft.',
        str: 15, dex: 14, con: 12, int: 1, wis: 10, cha: 3,
        senses: 'Blindsight 10 ft., Passive Perception 10', languages: '',
        traits: [],
        actions: [{name: 'Bite', desc: 'Melee Weapon Attack: +4 to hit, reach 5 ft., one creature. Hit: 1d6+2 piercing damage.', attack_bonus: 4, damage_dice: '1d6+2'}, {name: 'Constrict', desc: 'Melee Weapon Attack: +4 to hit, reach 5 ft., one creature. Hit: 1d8+2 bludgeoning, target grappled (escape DC 14) and restrained.', attack_bonus: 4, damage_dice: '1d8+2'}],
        swim_speed: 30
    },
    {
        index: 'cow', name: 'Cow', size: 'Large', type: 'beast', challenge_rating: 0.25,
        ac: 10, hp: 15, hit_dice: '2d10+4', speed: '30 ft.',
        str: 18, dex: 10, con: 14, int: 2, wis: 10, cha: 4,
        senses: 'Passive Perception 10', languages: '',
        traits: [{name: 'Charge', desc: 'Move 20ft straight -> extra 2d6 damage. DC 13 Str save or prone.'}],
        actions: [{name: 'Gore', desc: 'Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 1d6+4 piercing damage.', attack_bonus: 6, damage_dice: '1d6+4'}]
    },
    {
        index: 'draft-horse', name: 'Draft Horse', size: 'Large', type: 'beast', challenge_rating: 0.25,
        ac: 10, hp: 19, hit_dice: '3d10+3', speed: '40 ft.',
        str: 18, dex: 10, con: 12, int: 2, wis: 11, cha: 7,
        senses: 'Passive Perception 10', languages: '',
        traits: [],
        actions: [{name: 'Hooves', desc: 'Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 2d4+4 bludgeoning damage.', attack_bonus: 6, damage_dice: '2d4+4'}]
    },
    {
        index: 'elk', name: 'Elk', size: 'Large', type: 'beast', challenge_rating: 0.25,
        ac: 10, hp: 13, hit_dice: '2d10+2', speed: '50 ft.',
        str: 16, dex: 10, con: 12, int: 2, wis: 10, cha: 6,
        senses: 'Passive Perception 10', languages: '',
        traits: [{name: 'Charge', desc: 'Move 20ft straight -> extra 2d6 damage. DC 13 Str save or prone.'}],
        actions: [{name: 'Ram', desc: 'Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 1d6+3 bludgeoning damage.', attack_bonus: 5, damage_dice: '1d6+3'}, {name: 'Hooves', desc: 'Melee Weapon Attack: +5 to hit, reach 5 ft., one prone creature. Hit: 2d4+3 bludgeoning damage.', attack_bonus: 5, damage_dice: '2d4+3'}]
    },
    {
        index: 'giant-badger', name: 'Giant Badger', size: 'Medium', type: 'beast', challenge_rating: 0.25,
        ac: 10, hp: 13, hit_dice: '2d8 + 4', speed: '30 ft., burrow 10 ft.',
        str: 13, dex: 10, con: 15, int: 2, wis: 12, cha: 5,
        senses: 'Darkvision 30 ft., Passive Perception 11', languages: '',
        traits: [{ name: 'Keen Smell', desc: 'Advantage on Perception checks that rely on smell.' }, { name: 'Multiattack', desc: 'The badger makes two attacks: one with its bite and one with its claws.' }],
        actions: [
            { name: 'Bite', desc: 'Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 4 (1d6 + 1) piercing damage.', attack_bonus: 3, damage_dice: '1d6+1', damage_type: 'piercing' },
            { name: 'Claws', desc: 'Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 6 (2d4 + 1) slashing damage.', attack_bonus: 3, damage_dice: '2d4+1', damage_type: 'slashing' }
        ]
    },
    {
        index: 'giant-bat', name: 'Giant Bat', size: 'Large', type: 'beast', challenge_rating: 0.25,
        ac: 13, hp: 22, hit_dice: '4d10', speed: '10 ft., fly 60 ft.',
        str: 15, dex: 16, con: 11, int: 2, wis: 12, cha: 6,
        senses: 'Blindsight 60 ft., Passive Perception 11', languages: '',
        traits: [{name: 'Echolocation', desc: 'No blindsight while deafened.'}, {name: 'Keen Hearing', desc: 'Advantage on Perception (hearing).'}],
        actions: [{name: 'Bite', desc: 'Melee Weapon Attack: +4 to hit, reach 5 ft., one creature. Hit: 1d6+2 piercing damage.', attack_bonus: 4, damage_dice: '1d6+2'}],
        fly_speed: 60
    },
    {
        index: 'giant-centipede', name: 'Giant Centipede', size: 'Small', type: 'beast', challenge_rating: 0.25,
        ac: 13, hp: 4, hit_dice: '1d6+1', speed: '30 ft., climb 30 ft.',
        str: 5, dex: 14, con: 12, int: 1, wis: 7, cha: 3,
        senses: 'Blindsight 30 ft., Passive Perception 8', languages: '',
        traits: [],
        actions: [{name: 'Bite', desc: 'Melee Weapon Attack: +4 to hit, reach 5 ft., one creature. Hit: 1d4+2 piercing damage. Target must succeed on DC 11 Con save or take 3d6 poison damage. If damage reduces target to 0 HP, target is stable but poisoned/paralyzed for 1 hour.', attack_bonus: 4, damage_dice: '1d4+2'}]
    },
    {
        index: 'giant-frog', name: 'Giant Frog', size: 'Medium', type: 'beast', challenge_rating: 0.25,
        ac: 11, hp: 18, hit_dice: '4d8', speed: '30 ft., swim 30 ft.',
        str: 12, dex: 13, con: 11, int: 2, wis: 10, cha: 3,
        senses: 'Darkvision 30 ft., Passive Perception 10', languages: '',
        traits: [{name: 'Amphibious', desc: 'Can breathe air and water.'}, {name: 'Standing Leap', desc: 'Long jump up to 20 ft. and high jump up to 10 ft.'}],
        actions: [{name: 'Bite', desc: 'Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 1d6+1 piercing damage, and target is grappled (escape DC 11). Until grapple ends, target is restrained, and frog can\'t bite another target. Swallow: bite against Medium or smaller grappled target. Swallowed target is blinded/restrained.', attack_bonus: 3, damage_dice: '1d6+1'}],
        swim_speed: 30
    },
    {
        index: 'giant-lizard', name: 'Giant Lizard', size: 'Large', type: 'beast', challenge_rating: 0.25,
        ac: 12, hp: 19, hit_dice: '3d10+3', speed: '30 ft., climb 30 ft.',
        str: 15, dex: 12, con: 13, int: 2, wis: 10, cha: 5,
        senses: 'Darkvision 30 ft., Passive Perception 10', languages: '',
        traits: [],
        actions: [{name: 'Bite', desc: 'Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 1d8+2 piercing damage.', attack_bonus: 4, damage_dice: '1d8+2'}]
    },
    {
        index: 'giant-owl', name: 'Giant Owl', size: 'Large', type: 'beast', challenge_rating: 0.25,
        ac: 12, hp: 19, hit_dice: '3d10+3', speed: '5 ft., fly 60 ft.',
        str: 13, dex: 15, con: 12, int: 8, wis: 13, cha: 10,
        senses: 'Darkvision 120 ft., Passive Perception 15', languages: 'Giant Owl, understands Common, Elvish, Sylvan',
        traits: [{name: 'Flyby', desc: 'Doesn\'t provoke opportunity attacks when flying out of reach.'}, {name: 'Keen Hearing and Sight', desc: 'Advantage on Perception (hearing/sight).'}],
        actions: [{name: 'Talons', desc: 'Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 2d6+1 slashing damage.', attack_bonus: 3, damage_dice: '2d6+1'}],
        fly_speed: 60
    },
    {
        index: 'giant-poisonous-snake', name: 'Giant Poisonous Snake', size: 'Medium', type: 'beast', challenge_rating: 0.25,
        ac: 14, hp: 11, hit_dice: '2d8+2', speed: '30 ft., swim 30 ft.',
        str: 10, dex: 18, con: 13, int: 2, wis: 10, cha: 3,
        senses: 'Blindsight 10 ft., Passive Perception 10', languages: '',
        traits: [],
        actions: [{name: 'Bite', desc: 'Melee Weapon Attack: +6 to hit, reach 10 ft., one target. Hit: 1d4+4 piercing damage + 3d6 poison (half on DC 11 Con save).', attack_bonus: 6, damage_dice: '1d4+4'}],
        swim_speed: 30
    },
    {
        index: 'giant-wolf-spider', name: 'Giant Wolf Spider', size: 'Medium', type: 'beast', challenge_rating: 0.25,
        ac: 13, hp: 11, hit_dice: '2d8+2', speed: '40 ft., climb 40 ft.',
        str: 12, dex: 16, con: 13, int: 3, wis: 12, cha: 4,
        senses: 'Blindsight 10 ft., Darkvision 60 ft., Passive Perception 13', languages: '',
        traits: [{name: 'Spider Climb', desc: 'Can climb difficult surfaces.'}, {name: 'Web Sense', desc: 'Knows location of creatures in contact with same web.'}, {name: 'Web Walker', desc: 'Ignores movement restrictions in webs.'}],
        actions: [{name: 'Bite', desc: 'Melee Weapon Attack: +3 to hit, reach 5 ft., one creature. Hit: 1d6+1 piercing damage + 2d6 poison (half on DC 11 Con save).', attack_bonus: 3, damage_dice: '1d6+1'}]
    },
    {
        index: 'panther', name: 'Panther', size: 'Medium', type: 'beast', challenge_rating: 0.25,
        ac: 12, hp: 13, hit_dice: '3d8', speed: '50 ft., climb 40 ft.',
        str: 14, dex: 15, con: 10, int: 3, wis: 14, cha: 7,
        senses: 'Passive Perception 14', languages: '',
        traits: [{name: 'Keen Smell', desc: 'Advantage on Perception (smell).'}, {name: 'Pounce', desc: 'Move 20ft straight then hit with claw -> DC 12 Str save or prone. If prone, bonus action bite.'}],
        actions: [{name: 'Bite', desc: 'Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 1d6+2 piercing damage.', attack_bonus: 4, damage_dice: '1d6+2'}, {name: 'Claw', desc: 'Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 1d4+2 slashing damage.', attack_bonus: 4, damage_dice: '1d4+2'}]
    },
    {
        index: 'riding-horse', name: 'Riding Horse', size: 'Large', type: 'beast', challenge_rating: 0.25,
        ac: 10, hp: 13, hit_dice: '2d10+2', speed: '60 ft.',
        str: 16, dex: 10, con: 12, int: 2, wis: 11, cha: 7,
        senses: 'Passive Perception 10', languages: '',
        traits: [],
        actions: [{name: 'Hooves', desc: 'Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 2d4+3 bludgeoning damage.', attack_bonus: 5, damage_dice: '2d4+3'}]
    },
    {
        index: 'wolf', name: 'Wolf', size: 'Medium', type: 'beast', challenge_rating: 0.25,
        ac: 13, hp: 11, hit_dice: '2d8+2', speed: '40 ft.',
        str: 12, dex: 15, con: 12, int: 3, wis: 12, cha: 6,
        senses: 'Passive Perception 13', languages: '',
        traits: [{name: 'Keen Hearing and Smell', desc: 'Advantage on Perception (hearing/smell).'}, {name: 'Pack Tactics', desc: 'Advantage on attack rolls if ally within 5ft.'}],
        actions: [{name: 'Bite', desc: 'Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 2d4+2 piercing damage. DC 11 Str save or prone.', attack_bonus: 4, damage_dice: '2d4+2'}]
    },

    // CR 1/2
    {
        index: 'ape', name: 'Ape', size: 'Medium', type: 'beast', challenge_rating: 0.5,
        ac: 12, hp: 19, hit_dice: '3d8+6', speed: '30 ft., climb 30 ft.',
        str: 16, dex: 14, con: 14, int: 6, wis: 12, cha: 7,
        senses: 'Passive Perception 13', languages: '',
        traits: [{name: 'Multiattack', desc: 'The ape makes two fist attacks.'}],
        actions: [
            {name: 'Fist', desc: 'Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 1d6+3 bludgeoning damage.', attack_bonus: 5, damage_dice: '1d6+3'},
            {name: 'Rock', desc: 'Ranged Weapon Attack: +5 to hit, range 25/50 ft., one target. Hit: 1d6+3 bludgeoning damage.', attack_bonus: 5, damage_dice: '1d6+3'}
        ]
    },
    {
        index: 'black-bear', name: 'Black Bear', size: 'Medium', type: 'beast', challenge_rating: 0.5,
        ac: 11, hp: 19, hit_dice: '3d8+6', speed: '40 ft., climb 30 ft.',
        str: 15, dex: 10, con: 14, int: 2, wis: 12, cha: 7,
        senses: 'Passive Perception 13', languages: '',
        traits: [{name: 'Keen Smell', desc: 'Advantage on Perception (smell).'}, {name: 'Multiattack', desc: 'The bear makes two attacks: one with its bite and one with its claws.'}],
        actions: [
            {name: 'Bite', desc: 'Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 1d6+2 piercing damage.', attack_bonus: 3, damage_dice: '1d6+2'},
            {name: 'Claws', desc: 'Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 2d4+2 slashing damage.', attack_bonus: 3, damage_dice: '2d4+2'}
        ]
    },
    {
        index: 'crocodile', name: 'Crocodile', size: 'Large', type: 'beast', challenge_rating: 0.5,
        ac: 12, hp: 19, hit_dice: '3d10+3', speed: '20 ft., swim 30 ft.',
        str: 15, dex: 10, con: 13, int: 2, wis: 10, cha: 5,
        senses: 'Passive Perception 10', languages: '',
        traits: [{name: 'Hold Breath', desc: 'Can hold breath for 15 minutes.'}],
        actions: [{name: 'Bite', desc: 'Melee Weapon Attack: +4 to hit, reach 5 ft., one creature. Hit: 1d10+2 piercing damage, and target is grappled (escape DC 12). Until grapple ends, target is restrained, and crocodile can\'t bite another target.', attack_bonus: 4, damage_dice: '1d10+2'}],
        swim_speed: 30
    },
    {
        index: 'giant-goat', name: 'Giant Goat', size: 'Large', type: 'beast', challenge_rating: 0.5,
        ac: 11, hp: 19, hit_dice: '3d10+3', speed: '40 ft.',
        str: 17, dex: 11, con: 12, int: 3, wis: 12, cha: 6,
        senses: 'Passive Perception 11', languages: '',
        traits: [{name: 'Charge', desc: 'Move 20ft straight -> extra 2d4 damage. DC 13 Str save or prone.'}, {name: 'Sure-Footed', desc: 'Advantage on Str/Dex saves vs prone.'}],
        actions: [{name: 'Ram', desc: 'Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 2d4+3 bludgeoning damage.', attack_bonus: 5, damage_dice: '2d4+3'}]
    },
    {
        index: 'giant-sea-horse', name: 'Giant Sea Horse', size: 'Large', type: 'beast', challenge_rating: 0.5,
        ac: 13, hp: 16, hit_dice: '3d10', speed: '0 ft., swim 40 ft.',
        str: 12, dex: 15, con: 11, int: 2, wis: 12, cha: 5,
        senses: 'Passive Perception 11', languages: '',
        traits: [{name: 'Charge', desc: 'Move 20ft straight -> extra 2d6 damage.'}, {name: 'Water Breathing', desc: 'Can breathe only underwater.'}],
        actions: [{name: 'Ram', desc: 'Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 1d6+1 bludgeoning damage.', attack_bonus: 3, damage_dice: '1d6+1'}],
        swim_speed: 40
    },
    {
        index: 'giant-wasp', name: 'Giant Wasp', size: 'Medium', type: 'beast', challenge_rating: 0.5,
        ac: 12, hp: 13, hit_dice: '3d8', speed: '10 ft., fly 50 ft.',
        str: 10, dex: 14, con: 10, int: 2, wis: 10, cha: 3,
        senses: 'Passive Perception 10', languages: '',
        traits: [],
        actions: [{name: 'Sting', desc: 'Melee Weapon Attack: +4 to hit, reach 5 ft., one creature. Hit: 1d6+2 piercing damage + 2d6 poison (half on DC 11 Con save). If poison reduces to 0 HP, target is stable but poisoned/paralyzed for 1 hour.', attack_bonus: 4, damage_dice: '1d6+2'}],
        fly_speed: 50
    },
    {
        index: 'reef-shark', name: 'Reef Shark', size: 'Medium', type: 'beast', challenge_rating: 0.5,
        ac: 12, hp: 22, hit_dice: '4d8+4', speed: '0 ft., swim 40 ft.',
        str: 14, dex: 13, con: 13, int: 1, wis: 10, cha: 4,
        senses: 'Blindsight 30 ft., Passive Perception 12', languages: '',
        traits: [{name: 'Pack Tactics', desc: 'Advantage on attack rolls if ally within 5ft.'}, {name: 'Water Breathing', desc: 'Can breathe only underwater.'}],
        actions: [{name: 'Bite', desc: 'Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 1d8+2 piercing damage.', attack_bonus: 4, damage_dice: '1d8+2'}],
        swim_speed: 40
    },
    {
        index: 'warhorse', name: 'Warhorse', size: 'Large', type: 'beast', challenge_rating: 0.5,
        ac: 11, hp: 19, hit_dice: '3d10+3', speed: '60 ft.',
        str: 18, dex: 12, con: 13, int: 2, wis: 12, cha: 7,
        senses: 'Passive Perception 11', languages: '',
        traits: [{name: 'Trampling Charge', desc: 'Move 20ft straight -> hit with hooves -> DC 14 Str save or prone. If prone, bonus action hooves.'}],
        actions: [{name: 'Hooves', desc: 'Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 2d6+4 bludgeoning damage.', attack_bonus: 6, damage_dice: '2d6+4'}]
    },

    // CR 1
    {
        index: 'brown-bear', name: 'Brown Bear', size: 'Large', type: 'beast', challenge_rating: 1,
        ac: 11, hp: 34, hit_dice: '4d10+12', speed: '40 ft., climb 30 ft.',
        str: 19, dex: 10, con: 16, int: 2, wis: 13, cha: 7,
        senses: 'Passive Perception 13', languages: '',
        traits: [{name: 'Keen Smell', desc: 'Advantage on Perception (smell).'}, {name: 'Multiattack', desc: 'The bear makes two attacks: one with its bite and one with its claws.'}],
        actions: [
            {name: 'Bite', desc: 'Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 1d8+4 piercing damage.', attack_bonus: 5, damage_dice: '1d8+4'},
            {name: 'Claws', desc: 'Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 2d6+4 slashing damage.', attack_bonus: 5, damage_dice: '2d6+4'}
        ]
    },
    {
        index: 'dire-wolf', name: 'Dire Wolf', size: 'Large', type: 'beast', challenge_rating: 1,
        ac: 14, hp: 37, hit_dice: '5d10+10', speed: '50 ft.',
        str: 17, dex: 15, con: 15, int: 3, wis: 12, cha: 7,
        senses: 'Passive Perception 13', languages: '',
        traits: [{name: 'Keen Hearing and Smell', desc: 'Advantage on Perception (hearing/smell).'}, {name: 'Pack Tactics', desc: 'Advantage on attack rolls if ally within 5ft.'}],
        actions: [{name: 'Bite', desc: 'Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 2d6+3 piercing damage. DC 13 Str save or prone.', attack_bonus: 5, damage_dice: '2d6+3'}]
    },
    {
        index: 'giant-eagle', name: 'Giant Eagle', size: 'Large', type: 'beast', challenge_rating: 1,
        ac: 13, hp: 26, hit_dice: '4d10+4', speed: '10 ft., fly 80 ft.',
        str: 16, dex: 17, con: 13, int: 8, wis: 14, cha: 10,
        senses: 'Passive Perception 14', languages: 'Giant Eagle, understands Common and Auran',
        traits: [{name: 'Keen Sight', desc: 'Advantage on Perception (sight).'}, {name: 'Multiattack', desc: 'The eagle makes two attacks: one with its beak and one with its talons.'}],
        actions: [
            {name: 'Beak', desc: 'Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 1d6+3 piercing damage.', attack_bonus: 5, damage_dice: '1d6+3'},
            {name: 'Talons', desc: 'Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 2d6+3 slashing damage.', attack_bonus: 5, damage_dice: '2d6+3'}
        ],
        fly_speed: 80
    },
    {
        index: 'giant-hyena', name: 'Giant Hyena', size: 'Large', type: 'beast', challenge_rating: 1,
        ac: 12, hp: 45, hit_dice: '6d10+12', speed: '50 ft.',
        str: 16, dex: 14, con: 14, int: 2, wis: 12, cha: 7,
        senses: 'Passive Perception 11', languages: '',
        traits: [{name: 'Rampage', desc: 'When reduces creature to 0 HP with melee attack, can use bonus action to move half speed and make bite attack.'}],
        actions: [{name: 'Bite', desc: 'Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 2d6+3 piercing damage.', attack_bonus: 5, damage_dice: '2d6+3'}]
    },
    {
        index: 'giant-octopus', name: 'Giant Octopus', size: 'Large', type: 'beast', challenge_rating: 1,
        ac: 11, hp: 52, hit_dice: '8d10+8', speed: '10 ft., swim 60 ft.',
        str: 17, dex: 13, con: 13, int: 4, wis: 10, cha: 4,
        senses: 'Darkvision 60 ft., Passive Perception 10', languages: '',
        traits: [{name: 'Hold Breath', desc: 'Can hold breath for 1 hour.'}, {name: 'Underwater Camouflage', desc: 'Advantage on Stealth checks while underwater.'}, {name: 'Water Breathing', desc: 'Can breathe only underwater.'}],
        actions: [
            {name: 'Tentacles', desc: 'Melee Weapon Attack: +5 to hit, reach 15 ft., one target. Hit: 2d6+3 bludgeoning damage, and target is grappled (escape DC 16). Until grapple ends, target is restrained, and octopus can\'t use tentacles on another target.', attack_bonus: 5, damage_dice: '2d6+3'},
            {name: 'Ink Cloud', desc: '20ft radius cloud. Heavily obscured. Dash as bonus action (Recharge 6).'}
        ],
        swim_speed: 60
    },
    {
        index: 'giant-spider', name: 'Giant Spider', size: 'Large', type: 'beast', challenge_rating: 1,
        ac: 14, hp: 26, hit_dice: '4d10+4', speed: '30 ft., climb 30 ft.',
        str: 14, dex: 16, con: 12, int: 2, wis: 11, cha: 4,
        senses: 'Blindsight 10 ft., Darkvision 60 ft., Passive Perception 10', languages: '',
        traits: [{name: 'Spider Climb', desc: 'Can climb difficult surfaces.'}, {name: 'Web Sense', desc: 'Knows location of creatures in contact with same web.'}, {name: 'Web Walker', desc: 'Ignores movement restrictions in webs.'}],
        actions: [
            {name: 'Bite', desc: 'Melee Weapon Attack: +5 to hit, reach 5 ft., one creature. Hit: 1d8+3 piercing damage + 2d8 poison (half on DC 11 Con save). If poison reduces to 0 HP, target is stable but poisoned/paralyzed/unconscious for 1 hour.', attack_bonus: 5, damage_dice: '1d8+3'},
            {name: 'Web', desc: 'Ranged Weapon Attack: +5 to hit, range 30/60 ft., one creature. Hit: Target is restrained by webbing (escape DC 12).', attack_bonus: 5}
        ]
    },
    {
        index: 'giant-toad', name: 'Giant Toad', size: 'Large', type: 'beast', challenge_rating: 1,
        ac: 11, hp: 39, hit_dice: '6d10+6', speed: '20 ft., swim 40 ft.',
        str: 15, dex: 13, con: 13, int: 2, wis: 10, cha: 3,
        senses: 'Darkvision 30 ft., Passive Perception 10', languages: '',
        traits: [{name: 'Amphibious', desc: 'Can breathe air and water.'}, {name: 'Standing Leap', desc: 'Long jump up to 20 ft. and high jump up to 10 ft.'}],
        actions: [
            {name: 'Bite', desc: 'Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 1d10+2 piercing damage + 1d10 poison. Target is grappled (escape DC 13). Until grapple ends, target is restrained, and toad can\'t bite another target.', attack_bonus: 4, damage_dice: '1d10+2'},
            {name: 'Swallow', desc: 'Bite against Medium or smaller grappled target. Swallowed target is blinded/restrained, has total cover, and takes 2d6 acid damage at start of toad\'s turns.'}
        ],
        swim_speed: 40
    },
    {
        index: 'giant-vulture', name: 'Giant Vulture', size: 'Large', type: 'beast', challenge_rating: 1,
        ac: 10, hp: 22, hit_dice: '3d10+6', speed: '10 ft., fly 60 ft.',
        str: 15, dex: 10, con: 15, int: 6, wis: 12, cha: 7,
        senses: 'Passive Perception 11', languages: 'understands Common, can\'t speak',
        traits: [{name: 'Keen Sight and Smell', desc: 'Advantage on Perception (sight/smell).'}, {name: 'Pack Tactics', desc: 'Advantage on attack rolls if ally within 5ft.'}, {name: 'Multiattack', desc: 'The vulture makes two attacks: one with its beak and one with its talons.'}],
        actions: [
            {name: 'Beak', desc: 'Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 2d4+2 piercing damage.', attack_bonus: 4, damage_dice: '2d4+2'},
            {name: 'Talons', desc: 'Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 2d6+2 slashing damage.', attack_bonus: 4, damage_dice: '2d6+2'}
        ],
        fly_speed: 60
    },
    {
        index: 'lion', name: 'Lion', size: 'Large', type: 'beast', challenge_rating: 1,
        ac: 12, hp: 26, hit_dice: '4d10+4', speed: '50 ft.',
        str: 17, dex: 15, con: 13, int: 3, wis: 12, cha: 8,
        senses: 'Passive Perception 13', languages: '',
        traits: [{name: 'Keen Smell', desc: 'Advantage on Perception (smell).'}, {name: 'Pack Tactics', desc: 'Advantage on attack rolls if ally within 5ft.'}, {name: 'Pounce', desc: 'Move 20ft straight then hit with claw -> DC 13 Str save or prone. If prone, bonus action bite.'}],
        actions: [
            {name: 'Bite', desc: 'Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 1d8+3 piercing damage.', attack_bonus: 5, damage_dice: '1d8+3'},
            {name: 'Claw', desc: 'Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 1d6+3 slashing damage.', attack_bonus: 5, damage_dice: '1d6+3'}
        ]
    },
    {
        index: 'tiger', name: 'Tiger', size: 'Large', type: 'beast', challenge_rating: 1,
        ac: 12, hp: 37, hit_dice: '5d10+10', speed: '40 ft.',
        str: 17, dex: 15, con: 14, int: 3, wis: 12, cha: 8,
        senses: 'Darkvision 60 ft., Passive Perception 13', languages: '',
        traits: [{name: 'Keen Smell', desc: 'Advantage on Perception (smell).'}, {name: 'Pounce', desc: 'Move 20ft straight then hit with claw -> DC 13 Str save or prone. If prone, bonus action bite.'}],
        actions: [
            {name: 'Bite', desc: 'Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 1d10+3 piercing damage.', attack_bonus: 5, damage_dice: '1d10+3'},
            {name: 'Claw', desc: 'Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 1d8+3 slashing damage.', attack_bonus: 5, damage_dice: '1d8+3'}
        ]
    },

    // CR 2
    {
        index: 'allosaurus', name: 'Allosaurus', size: 'Large', type: 'beast', challenge_rating: 2,
        ac: 13, hp: 51, hit_dice: '6d10+18', speed: '60 ft.',
        str: 19, dex: 13, con: 17, int: 2, wis: 12, cha: 5,
        senses: 'Passive Perception 11', languages: '',
        traits: [{name: 'Pounce', desc: 'Move 20ft straight then hit with claw -> DC 13 Str save or prone. If prone, bonus action bite.'}],
        actions: [
            {name: 'Bite', desc: 'Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 2d10+4 piercing damage.', attack_bonus: 6, damage_dice: '2d10+4'},
            {name: 'Claw', desc: 'Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 1d8+4 slashing damage.', attack_bonus: 6, damage_dice: '1d8+4'}
        ]
    },
    {
        index: 'giant-boar', name: 'Giant Boar', size: 'Large', type: 'beast', challenge_rating: 2,
        ac: 12, hp: 42, hit_dice: '5d10+15', speed: '40 ft.',
        str: 17, dex: 10, con: 16, int: 2, wis: 7, cha: 5,
        senses: 'Passive Perception 8', languages: '',
        traits: [{name: 'Charge', desc: 'Move 20ft straight -> extra 2d6 damage. DC 13 Str save or prone.'}, {name: 'Relentless', desc: 'If takes <=10 damage and reduced to 0 HP, drops to 1 HP instead (1/Short Rest).'}],
        actions: [{name: 'Tusk', desc: 'Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 2d6+3 slashing damage.', attack_bonus: 5, damage_dice: '2d6+3'}]
    },
    {
        index: 'giant-constrictor-snake', name: 'Giant Constrictor Snake', size: 'Huge', type: 'beast', challenge_rating: 2,
        ac: 12, hp: 60, hit_dice: '8d12+8', speed: '30 ft., swim 30 ft.',
        str: 19, dex: 14, con: 12, int: 1, wis: 10, cha: 3,
        senses: 'Blindsight 10 ft., Passive Perception 10', languages: '',
        traits: [],
        actions: [
            {name: 'Bite', desc: 'Melee Weapon Attack: +6 to hit, reach 10 ft., one creature. Hit: 2d6+4 piercing damage.', attack_bonus: 6, damage_dice: '2d6+4'},
            {name: 'Constrict', desc: 'Melee Weapon Attack: +6 to hit, reach 5 ft., one creature. Hit: 2d8+4 bludgeoning, target grappled (escape DC 16) and restrained.', attack_bonus: 6, damage_dice: '2d8+4'}
        ],
        swim_speed: 30
    },
    {
        index: 'giant-elk', name: 'Giant Elk', size: 'Huge', type: 'beast', challenge_rating: 2,
        ac: 14, hp: 42, hit_dice: '5d12+10', speed: '60 ft.',
        str: 19, dex: 16, con: 14, int: 7, wis: 14, cha: 10,
        senses: 'Passive Perception 14', languages: 'Giant Elk, understands Common, Elvish, Sylvan',
        traits: [{name: 'Charge', desc: 'Move 20ft straight -> extra 2d6 damage. DC 14 Str save or prone.'}],
        actions: [
            {name: 'Ram', desc: 'Melee Weapon Attack: +6 to hit, reach 10 ft., one target. Hit: 2d6+4 bludgeoning damage.', attack_bonus: 6, damage_dice: '2d6+4'},
            {name: 'Hooves', desc: 'Melee Weapon Attack: +6 to hit, reach 5 ft., one prone creature. Hit: 4d8+4 bludgeoning damage.', attack_bonus: 6, damage_dice: '4d8+4'}
        ]
    },
    {
        index: 'hunter-shark', name: 'Hunter Shark', size: 'Large', type: 'beast', challenge_rating: 2,
        ac: 12, hp: 45, hit_dice: '6d10+12', speed: '0 ft., swim 40 ft.',
        str: 18, dex: 13, con: 15, int: 1, wis: 10, cha: 4,
        senses: 'Blindsight 30 ft., Passive Perception 12', languages: '',
        traits: [{name: 'Blood Frenzy', desc: 'Advantage on melee attack rolls against creature that doesn\'t have all its hp.'}, {name: 'Water Breathing', desc: 'Can breathe only underwater.'}],
        actions: [{name: 'Bite', desc: 'Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 2d8+4 piercing damage.', attack_bonus: 6, damage_dice: '2d8+4'}],
        swim_speed: 40
    },
    {
        index: 'plesiosaurus', name: 'Plesiosaurus', size: 'Large', type: 'beast', challenge_rating: 2,
        ac: 13, hp: 68, hit_dice: '8d10+24', speed: '20 ft., swim 40 ft.',
        str: 18, dex: 15, con: 16, int: 2, wis: 12, cha: 5,
        senses: 'Passive Perception 11', languages: '',
        traits: [{name: 'Hold Breath', desc: 'Can hold breath for 1 hour.'}],
        actions: [{name: 'Bite', desc: 'Melee Weapon Attack: +6 to hit, reach 10 ft., one target. Hit: 3d6+4 piercing damage.', attack_bonus: 6, damage_dice: '3d6+4'}],
        swim_speed: 40
    },
    {
        index: 'polar-bear', name: 'Polar Bear', size: 'Large', type: 'beast', challenge_rating: 2,
        ac: 12, hp: 42, hit_dice: '5d10+15', speed: '40 ft., swim 30 ft.',
        str: 20, dex: 10, con: 16, int: 2, wis: 13, cha: 7,
        senses: 'Passive Perception 13', languages: '',
        traits: [{name: 'Keen Smell', desc: 'Advantage on Perception (smell).'}, {name: 'Multiattack', desc: 'The bear makes two attacks: one with its bite and one with its claws.'}],
        actions: [
            {name: 'Bite', desc: 'Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 1d8+5 piercing damage.', attack_bonus: 7, damage_dice: '1d8+5'},
            {name: 'Claws', desc: 'Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 2d6+5 slashing damage.', attack_bonus: 7, damage_dice: '2d6+5'}
        ],
        swim_speed: 30
    },
    {
        index: 'rhinoceros', name: 'Rhinoceros', size: 'Large', type: 'beast', challenge_rating: 2,
        ac: 11, hp: 45, hit_dice: '6d10+12', speed: '40 ft.',
        str: 21, dex: 8, con: 15, int: 2, wis: 12, cha: 6,
        senses: 'Passive Perception 11', languages: '',
        traits: [{name: 'Charge', desc: 'Move 20ft straight -> extra 2d8 damage. DC 15 Str save or prone.'}],
        actions: [{name: 'Gore', desc: 'Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 2d8+5 piercing damage.', attack_bonus: 7, damage_dice: '2d8+5'}]
    },
    {
        index: 'saber-toothed-tiger', name: 'Saber-Toothed Tiger', size: 'Large', type: 'beast', challenge_rating: 2,
        ac: 12, hp: 52, hit_dice: '7d10+14', speed: '40 ft.',
        str: 18, dex: 15, con: 15, int: 3, wis: 12, cha: 8,
        senses: 'Passive Perception 13', languages: '',
        traits: [{name: 'Keen Smell', desc: 'Advantage on Perception (smell).'}, {name: 'Pounce', desc: 'Move 20ft straight then hit with claw -> DC 14 Str save or prone. If prone, bonus action bite.'}],
        actions: [
            {name: 'Bite', desc: 'Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 1d10+4 piercing damage.', attack_bonus: 6, damage_dice: '1d10+4'},
            {name: 'Claw', desc: 'Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 2d6+4 slashing damage.', attack_bonus: 6, damage_dice: '2d6+4'}
        ]
    },

    // CR 3
    {
        index: 'ankylosaurus', name: 'Ankylosaurus', size: 'Huge', type: 'beast', challenge_rating: 3,
        ac: 15, hp: 68, hit_dice: '8d12+16', speed: '30 ft.',
        str: 19, dex: 11, con: 15, int: 2, wis: 12, cha: 5,
        senses: 'Passive Perception 11', languages: '',
        traits: [],
        actions: [{name: 'Tail', desc: 'Melee Weapon Attack: +7 to hit, reach 10 ft., one target. Hit: 4d6+4 bludgeoning damage. If target is creature, DC 14 Str save or prone.', attack_bonus: 7, damage_dice: '4d6+4'}]
    },
    {
        index: 'giant-scorpion', name: 'Giant Scorpion', size: 'Large', type: 'beast', challenge_rating: 3,
        ac: 15, hp: 52, hit_dice: '7d10+14', speed: '40 ft.',
        str: 15, dex: 13, con: 15, int: 1, wis: 9, cha: 3,
        senses: 'Blindsight 60 ft., Passive Perception 9', languages: '',
        traits: [{name: 'Multiattack', desc: 'The scorpion makes three attacks: two with its claws and one with its sting.'}],
        actions: [
            {name: 'Claw', desc: 'Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 1d8+2 bludgeoning damage, and target is grappled (escape DC 12). The scorpion has two claws, each of which can grapple one target.', attack_bonus: 4, damage_dice: '1d8+2'},
            {name: 'Sting', desc: 'Melee Weapon Attack: +4 to hit, reach 5 ft., one creature. Hit: 1d10+2 piercing damage + 4d10 poison (half on DC 12 Con save).', attack_bonus: 4, damage_dice: '1d10+2'}
        ]
    },
    {
        index: 'killer-whale', name: 'Killer Whale', size: 'Huge', type: 'beast', challenge_rating: 3,
        ac: 12, hp: 90, hit_dice: '12d12+12', speed: '0 ft., swim 60 ft.',
        str: 19, dex: 10, con: 13, int: 3, wis: 12, cha: 7,
        senses: 'Blindsight 120 ft., Passive Perception 13', languages: '',
        traits: [{name: 'Echolocation', desc: 'No blindsight while deafened.'}, {name: 'Hold Breath', desc: 'Can hold breath for 30 minutes.'}, {name: 'Keen Hearing', desc: 'Advantage on Perception (hearing).'}],
        actions: [{name: 'Bite', desc: 'Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 5d6+4 piercing damage.', attack_bonus: 6, damage_dice: '5d6+4'}],
        swim_speed: 60
    },

    // CR 4
    {
        index: 'elephant', name: 'Elephant', size: 'Huge', type: 'beast', challenge_rating: 4,
        ac: 12, hp: 76, hit_dice: '8d12+24', speed: '40 ft.',
        str: 22, dex: 9, con: 17, int: 3, wis: 11, cha: 6,
        senses: 'Passive Perception 10', languages: '',
        traits: [{name: 'Trampling Charge', desc: 'Move 20ft straight -> hit with gore -> DC 12 Str save or prone. If prone, bonus action stomp.'}],
        actions: [
            {name: 'Gore', desc: 'Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 3d8+6 piercing damage.', attack_bonus: 8, damage_dice: '3d8+6'},
            {name: 'Stomp', desc: 'Melee Weapon Attack: +8 to hit, reach 5 ft., one prone creature. Hit: 3d10+6 bludgeoning damage.', attack_bonus: 8, damage_dice: '3d10+6'}
        ]
    },
    {
        index: 'stegosaurus', name: 'Stegosaurus', size: 'Huge', type: 'beast', challenge_rating: 4,
        ac: 13, hp: 76, hit_dice: '8d12+24', speed: '40 ft.',
        str: 20, dex: 9, con: 17, int: 2, wis: 11, cha: 5,
        senses: 'Passive Perception 11', languages: '',
        traits: [],
        actions: [{name: 'Tail', desc: 'Melee Weapon Attack: +7 to hit, reach 10 ft., one target. Hit: 6d6+5 bludgeoning damage. If target is creature, DC 15 Str save or prone.', attack_bonus: 7, damage_dice: '6d6+5'}]
    },

    // CR 5
    {
        index: 'giant-crocodile', name: 'Giant Crocodile', size: 'Huge', type: 'beast', challenge_rating: 5,
        ac: 14, hp: 85, hit_dice: '9d12+27', speed: '30 ft., swim 50 ft.',
        str: 21, dex: 9, con: 17, int: 2, wis: 10, cha: 7,
        senses: 'Passive Perception 10', languages: '',
        traits: [{name: 'Hold Breath', desc: 'Can hold breath for 30 minutes.'}, {name: 'Multiattack', desc: 'The crocodile makes two attacks: one with its bite and one with its tail.'}],
        actions: [
            {name: 'Bite', desc: 'Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 3d10+5 piercing damage, and target is grappled (escape DC 16). Until grapple ends, target is restrained, and crocodile can\'t bite another target.', attack_bonus: 8, damage_dice: '3d10+5'},
            {name: 'Tail', desc: 'Melee Weapon Attack: +8 to hit, reach 10 ft., one target not grappled by crocodile. Hit: 2d8+5 bludgeoning damage. If target is creature, DC 16 Str save or prone.', attack_bonus: 8, damage_dice: '2d8+5'}
        ],
        swim_speed: 50
    },
    {
        index: 'giant-shark', name: 'Giant Shark', size: 'Huge', type: 'beast', challenge_rating: 5,
        ac: 13, hp: 126, hit_dice: '11d12+55', speed: '0 ft., swim 50 ft.',
        str: 23, dex: 11, con: 21, int: 1, wis: 10, cha: 5,
        senses: 'Blindsight 60 ft., Passive Perception 10', languages: '',
        traits: [{name: 'Blood Frenzy', desc: 'Advantage on melee attack rolls against creature that doesn\'t have all its hp.'}, {name: 'Water Breathing', desc: 'Can breathe only underwater.'}],
        actions: [{name: 'Bite', desc: 'Melee Weapon Attack: +9 to hit, reach 5 ft., one target. Hit: 3d10+6 piercing damage.', attack_bonus: 9, damage_dice: '3d10+6'}],
        swim_speed: 50
    },
    {
        index: 'triceratops', name: 'Triceratops', size: 'Huge', type: 'beast', challenge_rating: 5,
        ac: 13, hp: 95, hit_dice: '10d12+30', speed: '50 ft.',
        str: 22, dex: 9, con: 17, int: 2, wis: 11, cha: 5,
        senses: 'Passive Perception 11', languages: '',
        traits: [{name: 'Trampling Charge', desc: 'Move 20ft straight -> hit with gore -> DC 13 Str save or prone. If prone, bonus action stomp.'}],
        actions: [
            {name: 'Gore', desc: 'Melee Weapon Attack: +9 to hit, reach 5 ft., one target. Hit: 4d8+6 piercing damage.', attack_bonus: 9, damage_dice: '4d8+6'},
            {name: 'Stomp', desc: 'Melee Weapon Attack: +9 to hit, reach 5 ft., one prone creature. Hit: 3d10+6 bludgeoning damage.', attack_bonus: 9, damage_dice: '3d10+6'}
        ]
    },

    // CR 6
    {
        index: 'mammoth', name: 'Mammoth', size: 'Huge', type: 'beast', challenge_rating: 6,
        ac: 13, hp: 126, hit_dice: '11d12+55', speed: '40 ft.',
        str: 24, dex: 9, con: 21, int: 3, wis: 11, cha: 6,
        senses: 'Passive Perception 11', languages: '',
        traits: [{name: 'Trampling Charge', desc: 'Move 20ft straight -> hit with gore -> DC 18 Str save or prone. If prone, bonus action stomp.'}],
        actions: [
            {name: 'Gore', desc: 'Melee Weapon Attack: +10 to hit, reach 9 ft., one target. Hit: 4d8+7 piercing damage.', attack_bonus: 10, damage_dice: '4d8+7'},
            {name: 'Stomp', desc: 'Melee Weapon Attack: +10 to hit, reach 5 ft., one prone creature. Hit: 4d10+7 bludgeoning damage.', attack_bonus: 10, damage_dice: '4d10+7'}
        ]
    }
];
