import { supabase } from '../../services/supabase';
const progress: Record<string, Record<number, number>> = {
    fighter: { 1: 3, 4: 4, 10: 5, 16: 6 },
    barbarian: { 1: 2, 4: 3, 10: 4 },
};
const { data: rows, error } = await supabase.from('custom_classes').select('id,data').eq('is_public', true);
if (error) { console.error(error.message); process.exit(1); }
for (const row of rows || []) {
    const index = row.data?.index;
    const progressMap = progress[index];
    if (!progressMap) continue;
    const next = JSON.parse(JSON.stringify(row.data));
    const choice = (next.choices || []).find((item: any) => item.kind === 'weapon_mastery');
    if (!choice) continue;
    choice.count_by_level = progressMap;
    choice.count = progressMap[1];
    const { error: saveError } = await supabase.from('custom_classes').update({ data: next }).eq('id', row.id).select('id');
    if (saveError) console.error(saveError.message); else console.log(`Updated ${index}`);
}
