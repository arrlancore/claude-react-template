import React from "react";
import { Button } from "@/components/ui/button";

interface CodePanelProps {
  activeCode: {
    code: string;
    language: string;
  } | null;
  onClose: () => void;
  copyCode: (code: string) => void;
  downloadCode: (code: string, language: string) => void;
}

const CodePanel: React.FC<CodePanelProps> = ({
  activeCode,
  onClose,
  copyCode,
  downloadCode,
}) => {
  if (!activeCode) return null;

  // The main container for CodePanel already has transition classes from ChatLayout.
  // We need to apply transitions to the inner elements (header and content) as per original CSS.

  // Original .code-panel-header: padding: 20px 24px; background: #1e293b; border-bottom: 1px solid #334155; display: flex; align-items: center; justify-content: space-between; transform: translateY(-20px); opacity: 0; transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.1s;
  // Original .code-panel.active .code-panel-header: transform: translateY(0); opacity: 1;
  const headerClasses =
    "px-6 py-5 bg-slate-800 border-b border-slate-700 flex items-center justify-between " +
    "transform -translate-y-5 opacity-0 transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] delay-100";
  const activeHeaderClasses = "translate-y-0 opacity-100"; // Applied when panel is active

  // Original .code-panel-title: color: white; font-weight: 600; font-size: 16px;
  const titleClasses = "text-white font-semibold text-base";

  // Original .close-code-btn: background: none; border: none; color: #64748b; font-size: 18px; cursor: pointer; padding: 8px; border-radius: 6px; transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94); display: flex; align-items: center; justify-content: center; width: 32px; height: 32px;
  // Original .close-code-btn:hover: color: white; background: rgba(139, 92, 246, 0.2); transform: scale(1.1);
  // Original .close-code-btn:active: transform: scale(0.95);
  const closeButtonClasses =
    "text-slate-500 text-lg cursor-pointer p-2 rounded-md transition-all duration-200 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] " +
    "flex items-center justify-center w-8 h-8 " +
    "hover:text-white hover:bg-purple-500/20 hover:scale-110 active:scale-95";

  // Original .code-panel-content: flex: 1; padding: 24px; overflow: auto; font-family: 'Monaco', 'Consolas', monospace; font-size: 14px; line-height: 1.6; color: #e0e0e0; transform: translateY(20px); opacity: 0; transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s;
  // Original .code-panel.active .code-panel-content: transform: translateY(0); opacity: 1;
  const contentContainerClasses =
    "flex-1 p-6 overflow-auto font-mono text-sm leading-relaxed text-slate-200 " +
    "transform translate-y-5 opacity-0 transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] delay-200";
  const activeContentContainerClasses = "translate-y-0 opacity-100";

  // Original .code-block: background: rgba(15, 23, 42, 0.9); border-radius: 12px; padding: 20px; margin: 12px 0; font-family: 'Monaco', 'Consolas', monospace; font-size: 14px; overflow-x: auto; border: 1px solid rgba(139, 92, 246, 0.2); color: #e2e8f0; line-height: 1.6;
  // Using existing bg-slate-800/50, can be changed to bg-slate-900/90 if needed for darker effect.
  const codeBlockClasses =
    "bg-slate-800/50 rounded-xl p-5 my-3 border border-purple-500/20 text-slate-200";

  // Original .code-header: display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid rgba(139, 92, 246, 0.2);
  const codeBlockHeaderClasses =
    "flex justify-between items-center mb-4 pb-3 border-b border-purple-500/20";

  // Original .code-language: color: #94a3b8; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;
  const languageClasses =
    "text-slate-400 text-xs uppercase tracking-wider font-semibold";

  // Original .code-actions: display: flex; gap: 8px;
  const actionsClasses = "flex gap-2";

  // Original .code-btn: background: rgba(139, 92, 246, 0.2); border: 1px solid rgba(139, 92, 246, 0.3); color: #e2e8f0; padding: 6px 12px; border-radius: 6px; font-size: 12px; cursor: pointer; transition: all 0.2s ease; font-weight: 500;
  // Original .code-btn:hover: background: rgba(139, 92, 246, 0.3); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(139, 92, 246, 0.2);
  const codeButtonClasses =
    "bg-purple-500/20 border border-purple-500/30 text-slate-200 px-3 py-1.5 rounded-md text-xs cursor-pointer transition-all duration-200 ease-in-out font-medium " +
    "hover:bg-purple-500/30 hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(139,92,246,0.2)]";

  // We assume the parent div in ChatLayout handles the overall panel active state.
  // Here we apply conditional classes for the inner animations.
  // A simple way to trigger this is to rely on the parent's opacity/transform to already be set.
  // For more precise control, an `isPanelActive` prop could be passed.
  // Assuming ChatLayout's `hasCodePanel` correctly makes this component visible, these transitions should play.

  return (
    <>
      {" "}
      {/* Using Fragment as the root is handled by ChatLayout */}
      <div className={`${headerClasses} ${activeHeaderClasses}`}>
        {" "}
        {/* Apply active classes directly for now, assuming it's always rendered when activeCode is present */}
        <h2 className={titleClasses}>Code Output</h2>
        <button onClick={onClose} className={closeButtonClasses}>
          ×
        </button>
      </div>
      <div
        className={`${contentContainerClasses} ${activeContentContainerClasses}`}
      >
        <div className={codeBlockClasses}>
          <div className={codeBlockHeaderClasses}>
            <span className={languageClasses}>{activeCode.language}</span>
            <div className={actionsClasses}>
              <Button
                onClick={() => copyCode(activeCode.code)}
                variant="ghost" // Use ShadCN variants if preferred, or custom classes
                size="sm"
                className={codeButtonClasses}
              >
                Copy
              </Button>
              <Button
                onClick={() =>
                  downloadCode(activeCode.code, activeCode.language)
                }
                variant="ghost"
                size="sm"
                className={codeButtonClasses}
              >
                Download
              </Button>
            </div>
          </div>
          <pre className="text-sm leading-relaxed overflow-x-auto">
            {" "}
            {/* text-slate-200 is inherited */}
            <code>{activeCode.code}</code>
          </pre>
        </div>
      </div>
    </>
  );
};

export default CodePanel;
