export type ContentKey = 'classes' | 'subclasses' | 'races' | 'backgrounds' | 'feats';

export interface ContentTableSpec {
    key: ContentKey;
    table: string;
    label: string;
}

export const CONTENT_TABLES: ContentTableSpec[] = [
    { key: 'classes', table: 'custom_classes', label: 'Classes' },
    { key: 'subclasses', table: 'custom_subclasses', label: 'Subclasses' },
    { key: 'races', table: 'custom_races', label: 'Races' },
    { key: 'backgrounds', table: 'custom_backgrounds', label: 'Backgrounds' },
    { key: 'feats', table: 'custom_feats', label: 'Feats' },
];

export interface ContentRow {
    id: string;
    name: string;
    data: any;
    is_public?: boolean;
    user_id?: string | null;
    created_at?: string;
    homebrew?: boolean;
    schema_version?: number;
}

export interface MigrationIssue {
    severity: 'error' | 'warning';
    path: string;
    message: string;
}

export interface MigrationRecordResult {
    table: string;
    tableLabel: string;
    id: string;
    name: string;
    slug: string;
    changed: boolean;
    addedKeys: string[];
    changedKeys: string[];
    issues: MigrationIssue[];
    before: any;
    after: any;
}

export interface MigrationPlan {
    generatedAt: string;
    mode: 'dry-run' | 'apply';
    tables: Array<{
        table: string;
        label: string;
        total: number;
        changed: number;
        errors: number;
        warnings: number;
    }>;
    records: MigrationRecordResult[];
}
