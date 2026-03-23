
import { CreatureDetail } from '../types';

export const STANDARD_FAMILIARS: CreatureDetail[] = [
    {
        index: 'bat', name: 'Bat', size: 'Tiny', type: 'beast', challenge_rating: 0,
        ac: 12, hp: 1, hit_dice: '1d4-1', speed: '5 ft., fly 30 ft.',
        str: 2, dex: 15, con: 8, int: 2, wis: 12, cha: 4,
        senses: 'Blindsight 60 ft.', languages: '',
        traits: [{name: 'Echolocation', desc: 'No blindsight while deafened.'}, {name: 'Keen Hearing', desc: 'Advantage on Perception (hearing).'}],
        actions: [{name: 'Bite', desc: 'Melee Weapon Attack: +0 to hit, reach 5 ft., one creature. Hit: 1 piercing damage.', attack_bonus: 0, damage_dice: '1'}]
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
        index: 'owl', name: 'Owl', size: 'Tiny', type: 'beast', challenge_rating: 0,
        ac: 11, hp: 1, hit_dice: '1d4-1', speed: '5 ft., fly 60 ft.',
        str: 3, dex: 13, con: 8, int: 2, wis: 12, cha: 7,
        senses: 'Darkvision 120 ft., Passive Perception 13', languages: '',
        traits: [{name: 'Flyby', desc: 'Doesn\'t provoke opportunity attacks when flying out of reach.'}, {name: 'Keen Hearing and Sight', desc: 'Advantage on Perception (hearing/sight).'}],
        actions: [{name: 'Talons', desc: 'Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 1 slashing damage.', attack_bonus: 3, damage_dice: '1'}]
    },
    {
        index: 'hawk', name: 'Hawk', size: 'Tiny', type: 'beast', challenge_rating: 0,
        ac: 13, hp: 1, hit_dice: '1d4-1', speed: '10 ft., fly 60 ft.',
        str: 5, dex: 16, con: 8, int: 2, wis: 14, cha: 6,
        senses: 'Passive Perception 14', languages: '',
        traits: [{name: 'Keen Sight', desc: 'Advantage on Perception (sight).'}],
        actions: [{name: 'Talons', desc: 'Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 1 slashing damage.', attack_bonus: 5, damage_dice: '1'}]
    },
    {
        index: 'frog', name: 'Frog', size: 'Tiny', type: 'beast', challenge_rating: 0,
        ac: 11, hp: 1, hit_dice: '1d4-1', speed: '20 ft., swim 20 ft.',
        str: 1, dex: 13, con: 8, int: 1, wis: 8, cha: 3,
        senses: 'Darkvision 30 ft., Passive Perception 9', languages: '',
        traits: [{name: 'Amphibious', desc: 'Can breathe air and water.'}, {name: 'Standing Leap', desc: 'Long jump up to 10 ft. and high jump up to 5 ft. with or without running start.'}],
        actions: []
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
        actions: [{name: 'Beak', desc: 'Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 1 piercing damage.', attack_bonus: 4, damage_dice: '1'}]
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
        index: 'weasel', name: 'Weasel', size: 'Tiny', type: 'beast', challenge_rating: 0,
        ac: 13, hp: 1, hit_dice: '1d4-1', speed: '30 ft.',
        str: 3, dex: 16, con: 8, int: 2, wis: 12, cha: 3,
        senses: 'Passive Perception 13', languages: '',
        traits: [{name: 'Keen Hearing and Smell', desc: 'Advantage on Perception (hearing/smell).'}],
        actions: [{name: 'Bite', desc: 'Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 1 piercing damage.', attack_bonus: 5, damage_dice: '1'}]
    },
    {
        index: 'crab', name: 'Crab', size: 'Tiny', type: 'beast', challenge_rating: 0,
        ac: 11, hp: 2, hit_dice: '1d4', speed: '20 ft., swim 20 ft.',
        str: 2, dex: 11, con: 10, int: 1, wis: 8, cha: 2,
        senses: 'Blindsight 30 ft., Passive Perception 9', languages: '',
        traits: [{name: 'Amphibious', desc: 'Can breathe air and water.'}],
        actions: [{name: 'Claw', desc: 'Melee Weapon Attack: +0 to hit, reach 5 ft., one target. Hit: 1 bludgeoning damage.', attack_bonus: 0, damage_dice: '1'}]
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
        traits: [{name: 'Hold Breath', desc: 'While out of water, can hold breath for 30 minutes.'}, {name: 'Underwater Camouflage', desc: 'Advantage on Stealth checks while underwater.'}],
        actions: [{name: 'Tentacles', desc: 'Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 1 bludgeoning damage, and target is grappled (escape DC 10).', attack_bonus: 4, damage_dice: '1'}]
    },
    {
        index: 'poisonous-snake', name: 'Poisonous Snake', size: 'Tiny', type: 'beast', challenge_rating: 0.125,
        ac: 13, hp: 2, hit_dice: '1d4', speed: '30 ft., swim 30 ft.',
        str: 2, dex: 16, con: 11, int: 1, wis: 10, cha: 3,
        senses: 'Blindsight 10 ft., Passive Perception 10', languages: '',
        traits: [],
        actions: [{name: 'Bite', desc: 'Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 1 piercing damage + 2d4 poison (half on DC 10 Con save).', attack_bonus: 5, damage_dice: '1'}]
    },
    {
        index: 'quipper', name: 'Quipper', size: 'Tiny', type: 'beast', challenge_rating: 0,
        ac: 13, hp: 1, hit_dice: '1d4-1', speed: '0 ft., swim 40 ft.',
        str: 2, dex: 16, con: 9, int: 1, wis: 7, cha: 2,
        senses: 'Darkvision 60 ft., Passive Perception 8', languages: '',
        traits: [{name: 'Blood Frenzy', desc: 'Advantage on melee attack rolls against creature that doesn\'t have all its hp.'}],
        actions: [{name: 'Bite', desc: 'Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 1 piercing damage.', attack_bonus: 5, damage_dice: '1'}]
    },
    {
        index: 'sea-horse', name: 'Sea Horse', size: 'Tiny', type: 'beast', challenge_rating: 0,
        ac: 11, hp: 1, hit_dice: '1d4-1', speed: '0 ft., swim 20 ft.',
        str: 1, dex: 12, con: 8, int: 1, wis: 10, cha: 2,
        senses: 'Passive Perception 10', languages: '',
        traits: [{name: 'Water Breathing', desc: 'Can breathe only underwater.'}],
        actions: []
    }
];
