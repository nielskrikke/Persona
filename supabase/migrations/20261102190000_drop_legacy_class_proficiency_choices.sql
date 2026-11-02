-- The builder now reads class choices from `data.choices`.
-- Drop the legacy `proficiency_choices` copy from class documents.
begin;

update public.custom_classes
set data = data - 'proficiency_choices'
where data ? 'proficiency_choices';

commit;
