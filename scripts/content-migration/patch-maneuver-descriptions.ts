import { supabase } from '../../services/supabase';
const descriptions: Record<string, string> = {
  'Ambush': 'When you make a Dexterity (Stealth) check, expend a Superiority Die and add the roll to the check.',
  'Bait and Switch': 'Expend a Superiority Die; swap places with a willing ally within 5 feet and add the roll to your AC until your next turn.',
  'Brace': 'When a creature enters your reach, expend a Superiority Die to make an opportunity attack and add the roll to its damage.',
  "Commander's Strike": 'Expend a Superiority Die; an ally can use its reaction to make one weapon attack and add the roll to its damage.',
  'Commanding Presence': 'When you make a Charisma (Intimidation, Performance, or Persuasion) check, expend a Superiority Die and add the roll.',
  'Disarming Attack': 'On a hit, expend a Superiority Die; the target makes a Strength save or drops an item, and add the roll to damage.',
  'Distracting Strike': 'On a hit, expend a Superiority Die; the next attack against the target has advantage, and add the roll to damage.',
  'Evasive Footwork': 'When you move, expend a Superiority Die and add the roll to your AC until you stop moving.',
  'Feinting Attack': 'As a bonus action, expend a Superiority Die to gain advantage on your next attack against a creature and add the roll to damage.',
  'Goading Attack': 'On a hit, expend a Superiority Die; the target makes a Wisdom save or has disadvantage attacking others, and add the roll to damage.',
  'Grappling Strike': 'On a hit, expend a Superiority Die; the target makes a Strength or Dexterity save or is grappled, and add the roll to damage.',
  'Lunging Attack': 'On a hit, expend a Superiority Die to increase your reach by 5 feet and add the roll to damage.',
  'Maneuvering Attack': 'On a hit, expend a Superiority Die; an ally can move half its speed without opportunity attacks, and add the roll to damage.',
  'Menacing Attack': 'On a hit, expend a Superiority Die; the target makes a Wisdom save or is frightened, and add the roll to damage.',
  'Parry': 'When hit by a melee attack, use your reaction and expend a Superiority Die to add the roll to your AC.',
  'Precision Attack': 'When you make an attack roll, expend a Superiority Die and add the roll to the attack.',
  'Pushing Attack': 'On a hit, expend a Superiority Die; the target makes a Strength save or is pushed up to 15 feet, and add the roll to damage.',
  'Rally': 'As a bonus action, expend a Superiority Die; an ally gains temporary HP equal to the roll plus your Charisma modifier.',
  'Riposte': 'When a creature misses you with a melee attack, use your reaction and expend a Superiority Die to make a melee attack, adding the roll to damage.',
  'Seize the Initiative': 'When you roll initiative, expend a Superiority Die and add the roll to your initiative.',
  'Sweeping Attack': 'On a hit, expend a Superiority Die; another creature within 5 feet of the target takes damage equal to the roll.',
  'Tactical Assessment': 'When you make an Investigation, History, or Insight check, expend a Superiority Die and add the roll.',
  'Trip Attack': 'On a hit, expend a Superiority Die; the target makes a Strength save or falls prone, and add the roll to damage.',
};
const { data, error } = await supabase.from('custom_subclasses').select('id,data').eq('data->>index','battle-master').limit(1);
if (error || !data?.[0]) { console.error(error?.message || 'Battle Master not found'); process.exit(1); }
const next = JSON.parse(JSON.stringify(data[0].data));
const feature = (next.feature_details || []).find((entry: any) => entry.index === 'combat-superiority');
const choice = (feature?.effects || []).find((effect: any) => effect.type === 'feature_choice');
if (choice) {
  choice.options = (choice.options || []).map((option: any) => {
    const name = typeof option === 'string' ? option : option.name;
    return { name, description: descriptions[name] || 'Battle Master maneuver. Expend a Superiority Die to use it.' };
  });
}
const { error: saveError } = await supabase.from('custom_subclasses').update({ data: next }).eq('id', data[0].id).select('id');
if (saveError) { console.error(saveError.message); process.exit(1); }
console.log('Maneuver descriptions updated');
