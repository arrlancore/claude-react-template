import React from "react";

// Renaming to CodeCardComponent to avoid conflict if there's another 'CodeCard' type/interface elsewhere
// and to match the import in page.tsx

interface CodeBlock {
  // Define CodeBlock type if not already globally available
  id: string;
  code: string;
  language: string;
}

interface CodeCardComponentProps {
  codeBlock: CodeBlock;
  isActive: boolean;
  onClick: () => void; // Simplified onClick, as the ID is in codeBlock
}

const CodeCardComponent: React.FC<CodeCardComponentProps> = ({
  codeBlock,
  isActive,
  onClick,
}) => {
  // Original .code-card: background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(168, 85, 247, 0.05)); border: 1px solid rgba(139, 92, 246, 0.2); border-radius: 12px; padding: 16px 20px; margin: 12px 0; cursor: pointer; transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94); display: flex; align-items: center; justify-content: space-between; position: relative; overflow: hidden;
  // Original .code-card:hover: border-color: rgba(139, 92, 246, 0.3); box-shadow: 0 8px 25px rgba(139, 92, 246, 0.15); transform: translateY(-2px);
  // Original .code-card.active: border-color: rgba(139, 92, 246, 0.4); box-shadow: 0 8px 30px rgba(139, 92, 246, 0.2); background: linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(168, 85, 247, 0.1)); transform: translateY(-1px);
  // Original .code-card::before (handled by custom CSS class 'code-card-before')

  const baseClasses =
    "border rounded-xl px-5 py-4 my-3 cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] flex items-center justify-between relative overflow-hidden code-card-before";

  const inactiveClasses =
    "bg-gradient-to-r from-purple-500/10 to-fuchsia-500/5 border-purple-500/20 hover:border-purple-500/30 hover:shadow-[0_8px_25px_rgba(139,92,246,0.15)] hover:-translate-y-0.5";

  const activeClasses =
    "border-purple-500/40 shadow-[0_8px_30px_rgba(139,92,246,0.2)] bg-gradient-to-r from-purple-500/15 to-fuchsia-500/10 -translate-y-px";

  // Original .code-card-content: display: flex; align-items: center; gap: 12px; flex: 1;
  const contentClasses = "flex items-center gap-3 flex-1";

  // Original .code-card-icon: width: 20px; height: 20px; background: linear-gradient(135deg, #8b5cf6, #a855f7); border-radius: 4px; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px; font-weight: 600;
  const iconClasses =
    "w-5 h-5 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-sm flex items-center justify-center text-white text-xs font-semibold";

  // Original .code-card-title: font-weight: 600; color: #374151; font-size: 14px;
  const titleClasses = "font-semibold text-slate-700 text-sm";

  // Original .code-card-subtitle: color: #6b7280; font-size: 12px; margin-left: 4px;
  const subtitleClasses = "text-slate-500 text-xs ml-1";

  // Original .code-card-toggle: color: #8b5cf6; font-size: 18px; transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  // Original .code-card.active .code-card-toggle: transform: rotate(180deg); color: #a855f7;
  const toggleClasses = `text-purple-500 text-lg transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${isActive ? "rotate-180 text-fuchsia-500" : ""}`;

  return (
    <div
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
      data-code-id={codeBlock.id} // Keep data-id for potential direct DOM targeting if needed by other scripts, though React state is preferred
      onClick={onClick}
    >
      <div className={contentClasses}>
        <div className={iconClasses}>{"</>"}</div>
        <div>
          <div className={titleClasses}>{codeBlock.language} Code</div>
          <span className={subtitleClasses}>Click to view code</span>
        </div>
      </div>
      <div className={toggleClasses}>▼</div>
    </div>
  );
};

export default CodeCardComponent;
