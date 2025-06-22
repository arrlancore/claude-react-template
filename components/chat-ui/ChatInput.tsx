import React from "react";

interface ChatInputProps {
  inputValue: string;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  inputValue,
  onInputChange,
  onSendMessage,
  textareaRef,
  onKeyDown,
}) => {
  // Original .chat-input-container: padding: 24px; background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(20px); border-top: 1px solid rgba(139, 92, 246, 0.1);
  // Responsive padding from original: padding: 16px;
  const containerClasses =
    "p-4 md:p-6 backdrop-blur-xl max-w-4xl mx-auto border-t border-purple-500/10";

  // Original .chat-input-wrapper: position: relative; max-width: 100%;
  const wrapperClasses = "relative max-w-full";

  // Original .chat-input: width: 100%; background: rgba(255, 255, 255, 0.9); border: 1px solid rgba(139, 92, 246, 0.2); border-radius: 24px; padding: 16px 60px 16px 20px; color: #374151; font-size: 16px; outline: none; resize: none; min-height: 24px; max-height: 120px; backdrop-filter: blur(20px); transition: all 0.2s ease; box-shadow: 0 4px 20px rgba(139, 92, 246, 0.1);
  // Original .chat-input:focus: border-color: rgba(139, 92, 246, 0.4); box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1), 0 4px 20px rgba(139, 92, 246, 0.2);
  // Original .chat-input::placeholder: color: rgba(55, 65, 81, 0.6);
  const textareaClasses =
    "w-full bg-white/90 border border-purple-500/20 rounded-[24px] pl-5 pr-[60px] py-4 " + // padding: 16px 60px 16px 20px
    "text-slate-700 text-base outline-none resize-none min-h-[56px] max-h-[120px] " + // Adjusted min-height for py-4
    "backdrop-blur-xl transition-all duration-200 ease-in-out shadow-[0_4px_20px_rgba(139,92,246,0.1)] " +
    "focus:border-purple-500/40 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.1),_0_4px_20px_rgba(139,92,246,0.2)] " +
    "placeholder-slate-500/60";

  // Original .send-button: position: absolute; right: 8px; top: 50%; transform: translateY(-50%); background: linear-gradient(135deg, #8b5cf6, #a855f7); border: none; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s ease; color: white; box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
  // Original .send-button:hover: transform: translateY(-50%) scale(1.05); box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
  // Original .send-button:disabled: opacity: 0.5; cursor: not-allowed;
  const sendButtonClasses =
    "absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full " +
    "bg-gradient-to-r from-purple-500 to-fuchsia-500 " + // Original: #8b5cf6, #a855f7
    "flex items-center justify-center cursor-pointer transition-all duration-200 ease-in-out text-white " +
    "shadow-[0_4px_12px_rgba(139,92,246,0.3)] " +
    "hover:scale-105 hover:shadow-[0_6px_20px_rgba(139,92,246,0.4)] " +
    "disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className={containerClasses}>
      <div className={wrapperClasses}>
        <textarea
          ref={textareaRef}
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Ask me anything..."
          className={textareaClasses}
          rows={1}
        />
        <button
          onClick={onSendMessage}
          disabled={!inputValue.trim()}
          className={sendButtonClasses}
        >
          <svg
            className="w-5 h-5" // Ensure SVG size is controlled
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round" // Added for better icon appearance
            strokeLinejoin="round" // Added for better icon appearance
          >
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
