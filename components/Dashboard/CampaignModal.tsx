import React, { useState, useEffect } from 'react';
import { Users, Plus, Key, Copy, Check, Trash2, Link as LinkIcon, Shield, Sparkles, X } from 'lucide-react';
import { Campaign, CharacterState } from '../../types';
import { loadCampaigns, createCampaign, deleteCampaign, joinCampaignByCode, linkCharacterToCampaign, saveCharacterToDb } from '../../services/supabase';

interface CampaignModalProps {
    isOpen: boolean;
    onClose: () => void;
    characters: any[];
    userId?: string;
    onRefreshCharacters: () => void;
    selectedCharacterForLinking?: any;
}

export const CampaignModal: React.FC<CampaignModalProps> = ({
    isOpen,
    onClose,
    characters,
    userId,
    onRefreshCharacters,
    selectedCharacterForLinking
}) => {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'my_campaigns' | 'create' | 'join'>('my_campaigns');
    const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

    // Create form
    const [createName, setCreateName] = useState('');
    const [createDesc, setCreateDesc] = useState('');

    // Join form
    const [joinCode, setJoinCode] = useState('');
    const [selectedCharForJoin, setSelectedCharForJoin] = useState<string>(
        selectedCharacterForLinking?.id || (characters[0]?.id || '')
    );

    // Feedback
    const [copiedCode, setCopiedCode] = useState(false);
    const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        if (isOpen) {
            fetchCampaigns();
            if (selectedCharacterForLinking) {
                setSelectedCharForJoin(selectedCharacterForLinking.id);
            }
        }
    }, [isOpen, selectedCharacterForLinking]);

    const fetchCampaigns = async () => {
        setLoading(true);
        try {
            const list = await loadCampaigns(userId);
            setCampaigns(list);
            setSelectedCampaign(prev => {
                if (prev && list.some(c => c.id === prev.id)) {
                    return list.find(c => c.id === prev.id) || list[0] || null;
                }
                return list[0] || null;
            });
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!createName.trim()) return;
        setLoading(true);
        setStatusMsg(null);
        try {
            const newCmp = await createCampaign(createName.trim(), createDesc.trim(), userId);
            setCreateName('');
            setCreateDesc('');
            setStatusMsg({ type: 'success', text: `Campaign "${newCmp.name}" created! Join Code: ${newCmp.code}` });
            await fetchCampaigns();
            setSelectedCampaign(newCmp);
            setActiveTab('my_campaigns');
        } catch (err: any) {
            setStatusMsg({ type: 'error', text: err.message || "Failed to create campaign" });
        } finally {
            setLoading(false);
        }
    };

    const extractFlatChar = (charObj: any) => {
        if (!charObj) return null;
        let dataObj = charObj.data || charObj;
        while (dataObj.data && typeof dataObj.data === 'object' && !Array.isArray(dataObj.data)) {
            const { data: inner, ...rest } = dataObj;
            dataObj = { ...inner, ...rest };
        }
        return {
            ...dataObj,
            id: charObj.id || dataObj.id,
            user_id: charObj.user_id || dataObj.user_id,
            name: charObj.name || dataObj.name || 'Hero'
        };
    };

    const handleJoin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!joinCode.trim()) return;
        const charObj = characters.find(c => c.id === selectedCharForJoin) || selectedCharacterForLinking;
        if (!charObj) {
            setStatusMsg({ type: 'error', text: "Please select a character to link to this campaign." });
            return;
        }

        setLoading(true);
        setStatusMsg(null);
        try {
            const flatChar = extractFlatChar(charObj);
            const updatedCampaign = await joinCampaignByCode(joinCode.trim(), flatChar, userId || charObj.user_id);
            
            // Also update character object with campaign_id and campaign_name
            const updatedChar = {
                ...flatChar,
                campaign_id: updatedCampaign.id,
                campaign_name: updatedCampaign.name
            };
            await saveCharacterToDb(updatedChar, userId || charObj.user_id || 'local_user');

            setStatusMsg({ type: 'success', text: `Successfully linked ${flatChar.name || 'Character'} to "${updatedCampaign.name}"!` });
            setJoinCode('');
            await fetchCampaigns();
            setSelectedCampaign(updatedCampaign);
            setActiveTab('my_campaigns');
            onRefreshCharacters();
        } catch (err: any) {
            setStatusMsg({ type: 'error', text: err.message || "Failed to join campaign." });
        } finally {
            setLoading(false);
        }
    };

    const handleLinkCharacterDirectly = async (charId: string, campaignId: string | null) => {
        const charObj = characters.find(c => c.id === charId);
        if (!charObj) return;

        setLoading(true);
        try {
            const targetCampaign = campaigns.find(c => c.id === campaignId);
            const campaignName = targetCampaign ? targetCampaign.name : null;
            const flatChar = extractFlatChar(charObj);

            await linkCharacterToCampaign(charId, campaignId, campaignName, flatChar, userId || charObj.user_id);

            // Update character db record
            const updatedChar = {
                ...flatChar,
                campaign_id: campaignId,
                campaign_name: campaignName
            };
            await saveCharacterToDb(updatedChar, userId || charObj.user_id || 'local_user');

            setStatusMsg({
                type: 'success',
                text: campaignId ? `Linked ${flatChar.name} to campaign!` : `Unlinked ${flatChar.name} from campaign.`
            });

            await fetchCampaigns();
            onRefreshCharacters();
        } catch (err: any) {
            setStatusMsg({ type: 'error', text: err.message || "Error updating character campaign link." });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCampaign = async (cmpId: string) => {
        if (!confirm("Are you sure you want to delete this campaign? Linked characters will be unlinked.")) return;
        setLoading(true);
        try {
            await deleteCampaign(cmpId);
            // Unlink characters
            for (const charObj of characters) {
                const flatChar = extractFlatChar(charObj);
                if (flatChar.campaign_id === cmpId) {
                    const updatedChar = { ...flatChar, campaign_id: null, campaign_name: null };
                    await saveCharacterToDb(updatedChar, userId || charObj.user_id || 'local_user');
                }
            }
            setSelectedCampaign(null);
            await fetchCampaigns();
            onRefreshCharacters();
            setStatusMsg({ type: 'success', text: "Campaign deleted." });
        } catch (err: any) {
            setStatusMsg({ type: 'error', text: "Failed to delete campaign" });
        } finally {
            setLoading(false);
        }
    };

    const copyCodeToClipboard = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#121316] border border-[#3e4149] w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="bg-[#1b1c20] p-6 border-b border-[#3e4149] flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-dnd-gold/10 border border-dnd-gold/30 rounded-xl text-dnd-gold">
                            <Users size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold font-serif text-white tracking-wide">Campaign Hub</h2>
                            <p className="text-xs text-gray-400">Link party members, share inventory, and track party rolls</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Sub-header Navigation Tabs */}
                <div className="bg-[#16171a] border-b border-[#3e4149] px-6 py-3 flex gap-3 shrink-0">
                    <button 
                        onClick={() => { setActiveTab('my_campaigns'); setStatusMsg(null); }}
                        className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${activeTab === 'my_campaigns' ? 'bg-dnd-gold text-black shadow-md' : 'bg-gray-800/60 text-gray-300 hover:bg-gray-700'}`}
                    >
                        <Shield size={14} /> My Campaigns ({campaigns.length})
                    </button>
                    <button 
                        onClick={() => { setActiveTab('create'); setStatusMsg(null); }}
                        className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${activeTab === 'create' ? 'bg-dnd-gold text-black shadow-md' : 'bg-gray-800/60 text-gray-300 hover:bg-gray-700'}`}
                    >
                        <Plus size={14} /> Create Campaign
                    </button>
                    <button 
                        onClick={() => { setActiveTab('join'); setStatusMsg(null); }}
                        className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${activeTab === 'join' ? 'bg-dnd-gold text-black shadow-md' : 'bg-gray-800/60 text-gray-300 hover:bg-gray-700'}`}
                    >
                        <Key size={14} /> Join by Code
                    </button>
                </div>

                {/* Status Messages */}
                {statusMsg && (
                    <div className={`mx-6 mt-4 p-3 rounded-lg text-xs font-bold flex items-center justify-between ${statusMsg.type === 'success' ? 'bg-green-950/80 border border-green-800 text-green-300' : 'bg-red-950/80 border border-red-800 text-red-300'}`}>
                        <span>{statusMsg.text}</span>
                        <button onClick={() => setStatusMsg(null)} className="opacity-60 hover:opacity-100">✕</button>
                    </div>
                )}

                {/* Body Content */}
                <div className="p-6 overflow-y-auto custom-scrollbar flex-grow">
                    {activeTab === 'my_campaigns' && (
                        campaigns.length === 0 ? (
                            <div className="text-center py-16 text-gray-400 space-y-4">
                                <Users size={48} className="mx-auto text-gray-600 animate-bounce" />
                                <h3 className="text-lg font-bold text-gray-300">No Campaigns Found</h3>
                                <p className="text-xs max-w-md mx-auto text-gray-500">Create a new campaign to unite your adventuring party, or join an existing campaign with a Join Code!</p>
                                <div className="flex justify-center gap-3 pt-2">
                                    <button onClick={() => setActiveTab('create')} className="px-5 py-2.5 bg-dnd-gold text-black font-bold text-xs uppercase rounded-lg hover:bg-amber-400 transition-colors">
                                        Create Campaign
                                    </button>
                                    <button onClick={() => setActiveTab('join')} className="px-5 py-2.5 bg-gray-800 text-gray-200 font-bold text-xs uppercase rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
                                        Join by Code
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                                {/* Campaign List Sidebar */}
                                <div className="space-y-3 lg:col-span-1 border-r border-[#3e4149]/50 pr-0 lg:pr-4">
                                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Select Campaign</div>
                                    {campaigns.map(cmp => {
                                        const isSelected = selectedCampaign?.id === cmp.id;
                                        return (
                                            <div 
                                                key={cmp.id}
                                                onClick={() => setSelectedCampaign(cmp)}
                                                className={`p-4 rounded-xl border cursor-pointer transition-all ${isSelected ? 'bg-dnd-gold/10 border-dnd-gold shadow-lg' : 'bg-[#1b1c20] border-gray-800 hover:border-gray-600'}`}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <h4 className="font-bold text-white text-sm truncate">{cmp.name}</h4>
                                                    <span className="text-[9px] bg-black/50 border border-gray-700 text-dnd-gold font-mono px-1.5 py-0.5 rounded">
                                                        {cmp.code}
                                                    </span>
                                                </div>
                                                {cmp.description && <p className="text-xs text-gray-400 mt-1 line-clamp-2">{cmp.description}</p>}
                                                <div className="text-[10px] text-gray-500 mt-2 flex items-center justify-between">
                                                    <span>{(cmp.characters || []).length} Character(s)</span>
                                                    {isSelected && <span className="text-dnd-gold font-bold">Active →</span>}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Active Campaign Details */}
                                {selectedCampaign ? (
                                    <div className="lg:col-span-2 space-y-6">
                                        <div className="bg-[#1b1c20] p-5 rounded-xl border border-gray-800 space-y-3">
                                            <div className="flex flex-wrap justify-between items-start gap-3">
                                                <div>
                                                    <h3 className="text-xl font-bold text-dnd-gold font-serif">{selectedCampaign.name}</h3>
                                                    {selectedCampaign.description && (
                                                        <p className="text-xs text-gray-300 mt-1 leading-relaxed">{selectedCampaign.description}</p>
                                                    )}
                                                </div>
                                                <button 
                                                    onClick={() => handleDeleteCampaign(selectedCampaign.id)}
                                                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-950/40 border border-red-900/50 rounded-lg transition-colors text-xs flex items-center gap-1.5 font-bold uppercase"
                                                    title="Delete Campaign"
                                                >
                                                    <Trash2 size={14} /> Delete
                                                </button>
                                            </div>

                                            {/* Code Bar */}
                                            <div className="bg-black/60 p-3 rounded-lg border border-gray-800 flex items-center justify-between">
                                                <div>
                                                    <span className="text-[10px] text-gray-500 font-bold uppercase block">Party Invite Code</span>
                                                    <span className="text-sm font-mono font-bold text-dnd-gold tracking-widest">{selectedCampaign.code}</span>
                                                </div>
                                                <button 
                                                    onClick={() => copyCodeToClipboard(selectedCampaign.code)}
                                                    className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-xs font-bold uppercase rounded border border-gray-700 text-gray-200 transition-colors flex items-center gap-1.5"
                                                >
                                                    {copiedCode ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                                                    {copiedCode ? 'Copied!' : 'Copy Code'}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Party Members */}
                                        <div className="space-y-3">
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                                <Users size={14} /> Linked Party Roster ({(selectedCampaign.characters || []).length})
                                            </h4>
                                            
                                            {(selectedCampaign.characters || []).length === 0 ? (
                                                <div className="p-6 bg-black/20 border border-gray-800 rounded-xl text-center text-xs text-gray-500 italic">
                                                    No characters linked to this campaign yet. Share the invite code above or link your characters below!
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    {(selectedCampaign.characters || []).map(ch => (
                                                        <div key={ch.id} className="p-3 bg-[#1b1c20] border border-gray-800 rounded-xl flex items-center justify-between group">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center font-bold text-dnd-gold text-sm overflow-hidden shrink-0">
                                                                    {ch.avatarUrl ? <img src={ch.avatarUrl} alt={ch.name} className="w-full h-full object-cover" /> : ch.name.charAt(0)}
                                                                </div>
                                                                <div>
                                                                    <div className="font-bold text-sm text-gray-200 group-hover:text-dnd-gold transition-colors">{ch.name}</div>
                                                                    <div className="text-[10px] text-gray-500">
                                                                        {ch.race ? `${ch.race} • ` : ''}{ch.className ? `${ch.className} ` : ''}Lvl {ch.level || 1}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <button 
                                                                onClick={() => handleLinkCharacterDirectly(ch.id, null)}
                                                                className="text-[10px] text-red-400 hover:text-red-300 hover:bg-red-950/30 px-2 py-1 rounded border border-red-900/40 transition-colors uppercase font-bold"
                                                                title="Unlink from Campaign"
                                                            >
                                                                Unlink
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Link User Characters to this Campaign */}
                                        <div className="space-y-3 pt-4 border-t border-gray-800">
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                                <LinkIcon size={14} /> Quick Link Your Characters
                                            </h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {characters.map(charObj => {
                                                    const charData = charObj.data || charObj;
                                                    const charName = charObj.name || charData.name || 'Hero';
                                                    const isLinkedToThis = charData.campaign_id === selectedCampaign.id;
                                                    const isLinkedToOther = charData.campaign_id && charData.campaign_id !== selectedCampaign.id;

                                                    return (
                                                        <div key={charObj.id} className="p-3 bg-black/30 border border-gray-800 rounded-xl flex items-center justify-between">
                                                            <div>
                                                                <div className="font-bold text-xs text-gray-200">{charName}</div>
                                                                <div className="text-[10px] text-gray-500">
                                                                    {isLinkedToThis ? 'Linked to this campaign' : (isLinkedToOther ? `In: ${charData.campaign_name || 'Other'}` : 'Not in campaign')}
                                                                </div>
                                                            </div>
                                                            {isLinkedToThis ? (
                                                                <button 
                                                                    onClick={() => handleLinkCharacterDirectly(charObj.id, null)}
                                                                    className="px-2.5 py-1 bg-red-900/30 border border-red-800 text-red-400 text-[10px] font-bold uppercase rounded hover:bg-red-900/50 transition-colors"
                                                                >
                                                                    Unlink
                                                                </button>
                                                            ) : (
                                                                <button 
                                                                    onClick={() => handleLinkCharacterDirectly(charObj.id, selectedCampaign.id)}
                                                                    className="px-2.5 py-1 bg-dnd-gold/20 border border-dnd-gold/50 text-dnd-gold text-[10px] font-bold uppercase rounded hover:bg-dnd-gold hover:text-black transition-colors"
                                                                >
                                                                    Link Here
                                                                </button>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="lg:col-span-2 flex items-center justify-center text-gray-500 text-xs italic">
                                        Select a campaign from the left list to view details.
                                    </div>
                                )}
                            </div>
                        )
                    )}

                    {activeTab === 'create' && (
                        <form onSubmit={handleCreate} className="max-w-xl mx-auto space-y-5 py-4">
                            <div className="text-center space-y-1 mb-6">
                                <h3 className="text-lg font-bold text-dnd-gold font-serif uppercase tracking-wider">Create New Campaign</h3>
                                <p className="text-xs text-gray-400">Establish a campaign group to unify character inventories and party rolls.</p>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">Campaign Title *</label>
                                <input 
                                    type="text"
                                    required
                                    value={createName}
                                    onChange={(e) => setCreateName(e.target.value)}
                                    placeholder="e.g. Curse of Strahd, The Lost Mine of Phandelver..."
                                    className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-dnd-gold transition-colors"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">Description / Notes (Optional)</label>
                                <textarea 
                                    rows={3}
                                    value={createDesc}
                                    onChange={(e) => setCreateDesc(e.target.value)}
                                    placeholder="Brief background or campaign goals..."
                                    className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-dnd-gold transition-colors resize-none"
                                />
                            </div>

                            <button 
                                type="submit"
                                disabled={loading || !createName.trim()}
                                className="w-full py-3 bg-dnd-gold hover:bg-amber-400 disabled:opacity-50 text-black font-bold uppercase text-xs tracking-widest rounded-lg shadow-lg transition-colors flex items-center justify-center gap-2"
                            >
                                <Sparkles size={16} /> Create Campaign & Generate Join Code
                            </button>
                        </form>
                    )}

                    {activeTab === 'join' && (
                        <form onSubmit={handleJoin} className="max-w-xl mx-auto space-y-5 py-4">
                            <div className="text-center space-y-1 mb-6">
                                <h3 className="text-lg font-bold text-dnd-gold font-serif uppercase tracking-wider">Join Campaign</h3>
                                <p className="text-xs text-gray-400">Enter the join code provided by your Dungeon Master or Party Leader.</p>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">Join Code *</label>
                                <input 
                                    type="text"
                                    required
                                    value={joinCode}
                                    onChange={(e) => setJoinCode(e.target.value)}
                                    placeholder="CMP-123456"
                                    className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-dnd-gold font-mono tracking-widest outline-none focus:border-dnd-gold uppercase transition-colors"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">Select Character to Link *</label>
                                <select 
                                    value={selectedCharForJoin}
                                    onChange={(e) => setSelectedCharForJoin(e.target.value)}
                                    className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-dnd-gold transition-colors"
                                >
                                    {characters.map(c => (
                                        <option key={c.id} value={c.id}>
                                            {c.name || c.data?.name || 'Unnamed'} (Lvl {c.level || c.data?.level || 1})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <button 
                                type="submit"
                                disabled={loading || !joinCode.trim() || !selectedCharForJoin}
                                className="w-full py-3 bg-dnd-gold hover:bg-amber-400 disabled:opacity-50 text-black font-bold uppercase text-xs tracking-widest rounded-lg shadow-lg transition-colors flex items-center justify-center gap-2"
                            >
                                <Key size={16} /> Join Campaign
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};
