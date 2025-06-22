import React from "react";

const TypingIndicator: React.FC = () => {
  // Original .message.assistant (for overall structure)
  // Original .typing-indicator: display: flex; align-items: center; gap: 16px; padding: 16px 20px; background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(20px); border-radius: 20px; max-width: 70%; color: #374151; opacity: 0; animation: fadeInUp 0.5s ease-out forwards; border: 1px solid rgba(139, 92, 246, 0.1); box-shadow: 0 4px 20px rgba(139, 92, 246, 0.1);
  // Original .typing-dots: display: flex; gap: 4px;
  // Original .typing-dot: width: 8px; height: 8px; background: rgba(139, 92, 246, 0.8); border-radius: 50%; animation: bounce 1.4s infinite ease-in-out; (animation defined in custom-chat-styles.css)

  const assistantMessageClasses = "flex gap-4 animate-fadeInUp"; // Matches MessageItem assistant structure
  const avatarClasses =
    "w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0 text-white bg-gradient-to-r from-pink-500 to-fuchsia-500"; // Matches MessageItem assistant avatar

  const typingIndicatorBubbleClasses =
    "flex items-center gap-4 px-5 py-4 " + // padding: 16px 20px
    "bg-white/90 backdrop-blur-xl rounded-[20px] max-w-[70%] md:max-w-[85%] " +
    "text-slate-700 border border-purple-500/10 shadow-[0_4px_20px_rgba(139,92,246,0.1)]";

  const dotBaseClasses =
    "w-2 h-2 bg-purple-500/80 rounded-full animate-bounce-dot";

  return (
    <div className={assistantMessageClasses}>
      <div className={avatarClasses}>AI</div>
      <div className={typingIndicatorBubbleClasses}>
        <span>Thinking</span>
        <div className="flex gap-1">
          {" "}
          {/* Original gap: 4px, Tailwind gap-1 is 4px */}
          <div className={`${dotBaseClasses} delay-[-0.32s]`}></div>
          <div className={`${dotBaseClasses} delay-[-0.16s]`}></div>
          <div className={dotBaseClasses}></div>{" "}
          {/* No delay on the third dot in original CSS, but custom CSS handles it */}
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
