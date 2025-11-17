import React, { useEffect } from "react";

interface ChatInputProps {
  inputValue: string;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  inputValue,
  onInputChange,
  onSendMessage,
  textareaRef,
  onKeyDown,
  disabled = false,
}) => {
  const containerClasses =
    "p-4 md:p-6 backdrop-blur-xl max-w-4xl mx-auto border-t border-purple-500/10";

  const wrapperClasses = "relative max-w-full overflow-hidden rounded-[24px]";

  const textareaClasses =
    "w-full bg-white/90 border border-purple-500/20 rounded-[24px] pl-5 pr-[60px] py-4 " +
    "text-slate-700 text-base outline-none resize-none min-h-[56px] max-h-[120px] " +
    "backdrop-blur-xl transition-all duration-200 ease-in-out shadow-[0_4px_20px_rgba(139,92,246,0.1)] " +
    "focus:border-purple-500/40 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.1),_0_4px_20px_rgba(139,92,246,0.2)] " +
    "placeholder-slate-500/60 " +
    (disabled ? "opacity-50 cursor-not-allowed" : "");

  const sendButtonClasses =
    "absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full " +
    "bg-gradient-to-r from-purple-500 to-fuchsia-500 " +
    "flex items-center justify-center cursor-pointer transition-all duration-200 ease-in-out text-white " +
    "shadow-[0_4px_12px_rgba(139,92,246,0.3)] " +
    "hover:scale-105 hover:shadow-[0_6px_20px_rgba(139,92,246,0.4)] " +
    "disabled:opacity-50 disabled:cursor-not-allowed";

  useEffect(() => {
    if (disabled && textareaRef.current) {
      textareaRef.current.blur();
    }
    if (!disabled && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [disabled]);

  return (
    <div className={containerClasses}>
      <div className={wrapperClasses}>
        <textarea
          ref={textareaRef}
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={
            disabled
              ? "Please respond to the question above"
              : "Ask me anything..."
          }
          className={textareaClasses}
          rows={1}
          disabled={disabled}
          data-testid="chat-input"
        />
        <button
          onClick={onSendMessage}
          disabled={!inputValue.trim() || disabled}
          className={sendButtonClasses}
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
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
