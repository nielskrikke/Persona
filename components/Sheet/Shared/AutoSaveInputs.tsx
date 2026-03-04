
import React, { useState, useEffect } from 'react';

export const AutoSaveInput = ({ 
    value, 
    onSave, 
    className, 
    placeholder 
}: { 
    value: string, 
    onSave: (val: string) => void, 
    className?: string, 
    placeholder?: string 
}) => {
    const [local, setLocal] = useState(value);
    useEffect(() => setLocal(value), [value]);

    return (
        <input 
            type="text"
            value={local}
            onChange={e => setLocal(e.target.value)}
            onBlur={() => { if (local !== value) onSave(local); }}
            className={className}
            placeholder={placeholder}
        />
    );
};

export const AutoSaveTextarea = ({ 
    value, 
    onSave, 
    className, 
    placeholder 
}: { 
    value: string, 
    onSave: (val: string) => void, 
    className?: string, 
    placeholder?: string 
}) => {
    const [local, setLocal] = useState(value);
    useEffect(() => setLocal(value), [value]);

    return (
        <textarea
            value={local}
            onChange={e => setLocal(e.target.value)}
            onBlur={() => { if (local !== value) onSave(local); }}
            className={className}
            placeholder={placeholder}
        />
    );
};
