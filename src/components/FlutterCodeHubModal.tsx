import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Smartphone, 
  Database, 
  Layers, 
  FileCode, 
  Download, 
  ExternalLink,
  Sparkles,
  Cpu
} from 'lucide-react';
import { FLUTTER_SNIPPETS } from '../data/flutterSnippets';

interface FlutterCodeHubModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FlutterCodeHubModal: React.FC<FlutterCodeHubModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const [activeSnippetId, setActiveSnippetId] = useState(FLUTTER_SNIPPETS[0].id);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeSnippet = FLUTTER_SNIPPETS.find(s => s.id === activeSnippetId) || FLUTTER_SNIPPETS[0];

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAll = () => {
    const combined = FLUTTER_SNIPPETS.map(
      s => `// ==========================================\n// FILE: ${s.filename}\n// ${s.description}\n// ==========================================\n\n${s.code}\n\n`
    ).join('\n');

    navigator.clipboard.writeText(combined);
    setCopiedId('all');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 overflow-y-auto">
      <div className="bg-[#0D0E13] border border-[#252834] rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col h-[90vh] my-auto">
        {/* Header */}
        <div className="bg-[#14161F] p-4 sm:p-5 border-b border-[#252834] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#02569B]/20 text-[#02569B] border border-[#02569B]/40 flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-[#54C5F8]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#54C5F8]/20 text-[#54C5F8] border border-[#54C5F8]/30">
                  Flutter 3.x + Free SQLite Engine
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold">100% Free Stack</span>
              </div>
              <h2 className="text-base sm:text-lg font-extrabold text-white">
                Flutter Architecture & Dart Code Hub
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyAll}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#252834] hover:bg-[#2F3342] text-xs font-bold text-gray-200 transition-colors"
            >
              {copiedId === 'all' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedId === 'all' ? 'Copied Full Project!' : 'Copy All Dart Files'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-[#1E2029] hover:bg-[#252834] text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Architecture Highlights Bar */}
        <div className="grid grid-cols-3 gap-2 p-3 bg-[#111218] border-b border-[#252834] text-xs">
          <div className="flex items-center gap-2 text-gray-300 p-1.5 bg-[#161822] rounded-xl">
            <Database className="w-4 h-4 text-[#FF5E3A]" />
            <div>
              <span className="font-bold text-white block leading-tight">SQLite (sqflite)</span>
              <span className="text-[10px] text-gray-500">Free Offline Local Database</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-300 p-1.5 bg-[#161822] rounded-xl">
            <Layers className="w-4 h-4 text-sky-400" />
            <div>
              <span className="font-bold text-white block leading-tight">Provider / Riverpod</span>
              <span className="text-[10px] text-gray-500">Reactive State Architecture</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-300 p-1.5 bg-[#161822] rounded-xl">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <div>
              <span className="font-bold text-white block leading-tight">Zero-Cost Stack</span>
              <span className="text-[10px] text-gray-500">No Paid APIs or Subscriptions</span>
            </div>
          </div>
        </div>

        {/* File Tabs & Code Area */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* File Selector Sidebar */}
          <div className="w-full md:w-64 bg-[#11131A] border-r border-[#252834] p-3 space-y-1 overflow-y-auto shrink-0">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider px-2 py-1 block">
              Project Structure
            </span>
            {FLUTTER_SNIPPETS.map(snippet => {
              const isSelected = activeSnippetId === snippet.id;
              return (
                <button
                  key={snippet.id}
                  onClick={() => setActiveSnippetId(snippet.id)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-[#FF5E3A] text-white shadow-md shadow-[#FF5E3A]/20'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-[#1A1C24]'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileCode className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{snippet.filename.split('/').pop()}</span>
                  </div>
                  <span className="text-[9px] opacity-70 uppercase tracking-tight">{snippet.category}</span>
                </button>
              );
            })}
          </div>

          {/* Code Viewer Panel */}
          <div className="flex-1 flex flex-col bg-[#0B0C10] overflow-hidden">
            {/* Active File Header */}
            <div className="p-3 bg-[#14161F] border-b border-[#252834] flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-white">{activeSnippet.filename}</span>
                <p className="text-[11px] text-gray-400 mt-0.5">{activeSnippet.description}</p>
              </div>

              <button
                onClick={() => handleCopy(activeSnippet.code, activeSnippet.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FF5E3A] hover:bg-[#FF7043] text-white text-xs font-bold shadow-sm transition-all"
              >
                {copiedId === activeSnippet.id ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>

            {/* Syntax Code Container */}
            <div className="flex-1 p-4 overflow-y-auto font-mono text-xs text-gray-300 leading-relaxed bg-[#0B0C10]">
              <pre className="whitespace-pre overflow-x-auto text-[11px] sm:text-xs">
                <code>{activeSnippet.code}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#14161F] border-t border-[#252834] flex items-center justify-between text-xs text-gray-400">
          <span>Ready to paste into your Android Studio / VS Code Flutter project.</span>
          <span className="text-[#FF5E3A] font-bold">Free SQLite Database Included</span>
        </div>
      </div>
    </div>
  );
};
