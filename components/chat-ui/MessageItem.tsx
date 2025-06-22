import React from "react";

interface MessageItemProps {
  message: {
    id: string;
    content: string;
    sender: "user" | "assistant";
    timestamp?: Date; // Match the full Message type
    codeBlocks?: any[]; // Match the full Message type
  };
  onCodeCardClick: (codeId: string) => void;
  // renderMessageContent now directly provides the ReactNode content
  renderMessageContent: () => React.ReactNode;
}

const MessageItem: React.FC<MessageItemProps> = ({
  message,
  onCodeCardClick,
  renderMessageContent, // This is now a function that directly returns the ReactNode
}) => {
  const isUser = message.sender === "user";

  // Base message container classes
  // Original .message: display: flex; gap: 16px; opacity: 0; animation: fadeInUp 0.5s ease-out forwards;
  // Original .message.user: flex-direction: row-reverse; align-self: flex-end;
  const messageContainerClasses = `flex gap-4 animate-fadeInUp ${
    isUser ? "flex-row-reverse self-end" : ""
  }`;

  // Avatar classes
  // Original .message-avatar: width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 14px; flex-shrink: 0;
  // Original .message.user .message-avatar: background: linear-gradient(135deg, #8b5cf6, #a855f7); color: white;
  // Original .message.assistant .message-avatar: background: linear-gradient(135deg, #ec4899, #a855f7); color: white;
  const avatarClasses = `w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0 text-white ${
    isUser
      ? "bg-gradient-to-r from-purple-500 to-fuchsia-500" // Tailwind gradient, original: #8b5cf6, #a855f7
      : "bg-gradient-to-r from-pink-500 to-fuchsia-500" // Tailwind gradient, original: #ec4899, #a855f7
  }`;

  // Message content classes
  // Original .message-content: background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(20px); border-radius: 20px; padding: 16px 20px; max-width: 70%; color: #374151; line-height: 1.6; border: 1px solid rgba(139, 92, 246, 0.1); box-shadow: 0 4px 20px rgba(139, 92, 246, 0.1);
  // Original .message.user .message-content: background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(168, 85, 247, 0.1)); border: 1px solid rgba(139, 92, 246, 0.2);
  // Original .message.assistant .message-content: background: linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(168, 85, 247, 0.1)); border: 1px solid rgba(236, 72, 153, 0.2);
  // Responsive max-width from original CSS: .message-content { max-width: 85%; } @media (max-width: 768px)
  const contentClasses = `rounded-[20px] px-5 py-4 max-w-[70%] md:max-w-[85%] text-slate-700 leading-relaxed shadow-[0_4px_20px_rgba(139,92,246,0.1)] backdrop-blur-xl ${
    isUser
      ? "bg-gradient-to-r from-purple-500/10 to-fuchsia-500/10 border border-purple-500/20"
      : "bg-gradient-to-r from-pink-500/10 to-fuchsia-500/10 border border-pink-500/20"
  }`;
  // Note: The original CSS uses rgba values for gradients. Tailwind's direct gradient stops might look slightly different.
  // If exact color matching is critical, these gradients might need to be custom defined in tailwind.config.js or as custom CSS.

  return (
    <div key={message.id} className={messageContainerClasses}>
      <div className={avatarClasses}>{isUser ? "You" : "AI"}</div>

      <div className={contentClasses}>
        {/* 
          The renderMessageContent function passed from MessageList already prepares the full ReactNode.
          We no longer need dangerouslySetInnerHTML here if renderMessageContent from DemoChatPage
          correctly maps text parts to <span> and code block placeholders to <CodeCardComponent />.
          The onClick for code cards is handled within CodeCardComponent itself.
          The general onClick here is for any other interactions within the message content,
          but specifically for code cards, it's better handled by the component.
          If CodeCardComponent is the only interactive element, this outer onClick might not be needed,
          or could be simplified if there are other clickable elements.
        */}
        <div
          className="prose prose-sm max-w-none prose-p:my-0 prose-pre:my-0"
          // The onClick for code cards is now handled by the CodeCardComponent itself.
          // If there are other types of interactive elements to be rendered via renderMessageContent,
          // their event handling would need to be part of the JSX returned by renderMessageContent.
        >
          {renderMessageContent()}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
