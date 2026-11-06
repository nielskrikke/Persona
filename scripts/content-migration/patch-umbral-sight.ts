import { supabase } from '../../services/supabase';
const { data, error } = await supabase.from('custom_subclasses').select('id,data').eq('data->>index','gloom-stalker').limit(1);
if (error || !data?.[0]) { console.error(error?.message || 'Gloom Stalker not found'); process.exit(1); }
const next = JSON.parse(JSON.stringify(data[0].data));
const feature = (next.feature_details || []).find((entry: any) => /umbral sight/i.test(entry.name || ''));
if (feature) {
    feature.effects = (feature.effects || []).filter((effect: any) => effect.name !== 'Umbral Sight');
    feature.effects.push({ name: 'Umbral Sight', type: 'bonus', target: 'darkvision', value: 60, description: 'Darkvision 60 ft. (or +60 ft. if you already have it).' });
}
const { error: saveError } = await supabase.from('custom_subclasses').update({ data: next }).eq('id', data[0].id).select('id');
if (saveError) { console.error(saveError.message); process.exit(1); }
console.log('Umbral Sight updated');
