import { supabase } from '../../services/supabase';
const maneuvers = ['Ambush','Bait and Switch','Brace',"Commander's Strike",'Commanding Presence','Disarming Attack','Distracting Strike','Evasive Footwork','Feinting Attack','Goading Attack','Grappling Strike','Lunging Attack','Maneuvering Attack','Menacing Attack','Parry','Precision Attack','Pushing Attack','Rally','Riposte','Seize the Initiative','Sweeping Attack','Tactical Assessment','Trip Attack'];
const { data, error } = await supabase.from('custom_subclasses').select('id,data').eq('data->>index','battle-master').limit(1);
if (error || !data?.[0]) { console.error(error?.message || 'Battle Master not found'); process.exit(1); }
const next = JSON.parse(JSON.stringify(data[0].data));
next.resources = (next.resources || []).map((resource: any) =>
    resource.key === 'superiority_dice'
        ? { ...resource, max: { type: 'table', values: [0,0,4,4,4,4,5,5,5,5,5,5,5,5,6,6,6,6,6,6] } }
        : resource
);
const feature = (next.feature_details || []).find((entry: any) => entry.index === 'combat-superiority');
if (feature) {
    feature.effects = (feature.effects || []).filter((effect: any) => effect.name !== 'Maneuvers Choice');
    feature.effects.push({
        name: 'Maneuvers',
        type: 'feature_choice',
        count: 3,
        count_by_level: { 3: 3, 7: 5, 10: 7, 15: 9 },
        options: maneuvers,
    });
}
const { error: saveError } = await supabase.from('custom_subclasses').update({ data: next }).eq('id', data[0].id).select('id');
if (saveError) { console.error(saveError.message); process.exit(1); }
console.log('Battle Master updated');
