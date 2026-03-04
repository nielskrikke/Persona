
import React, { useState } from 'react';
import { loginUser } from '../../services/supabase';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (user: any) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    if (!isOpen) return null;

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const user = await loginUser(username);
            if (user) {
                onSuccess(user);
                onClose();
            } else {
                setMessage('User not found. Please contact the DM to be added.');
            }
        } catch (err: any) {
            console.error(err);
            if (err.code === 'PGRST116') {
                 setMessage('User not found. Please contact the DM to be added.');
            } else {
                setMessage('Failed to connect to the archives.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/90 z-[1000] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-[#1b1c20] border-2 border-dnd-gold rounded-xl w-full max-w-md p-8 shadow-2xl relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white text-2xl">&times;</button>
                
                <h2 className="text-3xl font-serif text-dnd-gold mb-6 text-center">
                    Identify Yourself
                </h2>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Username</label>
                        <input 
                            type="text" 
                            required
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            className="w-full bg-[#0b0c0e] border border-gray-600 rounded p-3 text-white focus:border-dnd-gold outline-none text-lg"
                            placeholder="e.g. dm_admin"
                            autoFocus
                        />
                    </div>

                    {message && <div className="text-center text-sm text-red-400 font-bold">{message}</div>}

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full py-4 bg-dnd-gold hover:bg-yellow-600 text-black font-bold uppercase rounded shadow-lg transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Consulting Archives...' : 'Enter'}
                    </button>
                </form>

                <p className="mt-6 text-center text-xs text-gray-600">
                    Registration is restricted. Ask your Dungeon Master to add you to the <code>app_users</code> table.
                </p>
            </div>
        </div>
    );
};

export default AuthModal;
