import React from 'react';

const SidePanelLayout = ({ 
    title, 
    subtitle,
    children, 
    isOpen, 
    onClose, 
    isPinned, 
    onTogglePin,
    footer 
}: { 
    title: React.ReactNode;
    subtitle?: React.ReactNode;
    children?: React.ReactNode; 
    isOpen: boolean; 
    onClose: () => void; 
    isPinned: boolean;
    onTogglePin: () => void;
    footer?: React.ReactNode;
}) => {
    if (!isOpen) return null;

    const baseClasses = "bg-[#121316] border-l border-[#3e4149] shadow-2xl flex flex-col transition-all duration-300 w-full md:w-[400px]";
    const positionClasses = isPinned 
        ? "relative h-full shrink-0" 
        : "absolute right-0 top-[52px] md:top-0 h-[calc(100%-52px)] md:h-full z-[200]";

    return (
        <div className={`${baseClasses} ${positionClasses}`}>
            <div className="p-4 bg-[#1b1c20] border-b border-gray-700 flex justify-between items-start shrink-0">
                <div className="overflow-hidden">
                    <h2 className="text-xl font-serif text-white truncate">{title}</h2>
                    {subtitle && <div className="text-sm text-gray-400 italic truncate">{subtitle}</div>}
                </div>
                <div className="flex items-center gap-3 ml-4">
                    <button 
                        onClick={onTogglePin} 
                        className={`hidden md:block text-gray-400 hover:text-white p-1 rounded transition-colors ${isPinned ? 'text-dnd-gold bg-gray-800' : ''}`}
                        title={isPinned ? "Unpin Panel" : "Pin Panel"}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="17" x2="12" y2="22"></line><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"></path></svg>
                    </button>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-4xl leading-none p-1 transition-colors" aria-label="Close panel">&times;</button>
                </div>
            </div>
            
            <div className="flex-grow overflow-y-auto custom-scrollbar p-4 relative">
                {children}
            </div>

            {footer && (
                <div className="p-4 border-t border-gray-700 bg-[#1b1c20] shrink-0">
                    {footer}
                </div>
            )}
        </div>
    );
};

export default SidePanelLayout;
