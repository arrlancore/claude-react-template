import React from "react";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import CodePanel from "./CodePanel";

interface ChatLayoutProps {
  messages: {
    id: string;
    content: string;
    sender: "user" | "assistant";
    // Add timestamp and codeBlocks if ChatLayout needs them directly, or ensure Message type is imported
    timestamp?: Date; // Optional, assuming MessageList/Item might use it
    codeBlocks?: any[]; // Use a more specific type if available, e.g., CodeBlock[] from page.tsx
  }[];
  isTyping?: boolean; // Added from page.tsx
  typingIndicator?: React.ReactNode; // Added from page.tsx
  messagesEndRef?: React.RefObject<HTMLDivElement>; // Added from page.tsx
  inputValue: string;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  activeCode: {
    code: string;
    language: string;
  } | null;
  onToggleCodePanel: () => void;
  copyCode: (code: string) => void;
  downloadCode: (code: string, language: string) => void;
  // Updated renderMessageContent type to expect the full Message object and return ReactNode
  renderMessageContent: (message: {
    id: string;
    content: string;
    sender: "user" | "assistant";
    timestamp?: Date;
    codeBlocks?: any[];
  }) => React.ReactNode;
  handleCodeCardClick: (codeId: string) => void;
  hasCodePanel: boolean;
}

const ChatLayout: React.FC<ChatLayoutProps> = ({
  messages,
  isTyping,
  typingIndicator,
  messagesEndRef,
  inputValue,
  onInputChange,
  onSendMessage,
  textareaRef,
  onKeyDown,
  activeCode,
  onToggleCodePanel,
  copyCode,
  downloadCode,
  renderMessageContent,
  handleCodeCardClick,
  hasCodePanel,
}) => {
  // Base classes from the original HTML structure
  const appContainerBase =
    "flex h-screen transition-all duration-400 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] overflow-hidden";
  const chatContainerBase =
    "flex flex-col bg-white/80 backdrop-blur-xl border-r border-purple-500/10 transition-all duration-400 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] shadow-[0_0_40px_rgba(139,92,246,0.1)] relative z-10";

  // Conditional classes for chat container
  const chatContainerLayoutClasses = hasCodePanel
    ? "md:max-w-[400px] md:min-w-[350px] md:flex-none shadow-[0_0_60px_rgba(139,92,246,0.15)]" // Desktop: sidebar mode
    : "w-full flex-1 max-w-none"; // Desktop: full width mode or Mobile: always full width before panel opens

  // Conditional classes for code panel
  // Base for transitions and common styles
  const codePanelBaseClasses =
    "bg-slate-900 flex flex-col transition-all duration-400 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] overflow-hidden";

  let codePanelLayoutClasses = "";
  if (hasCodePanel) {
    codePanelLayoutClasses =
      // Mobile active: slides from bottom
      "fixed bottom-0 left-0 right-0 h-[80vh] z-20 translate-y-0 opacity-100 " +
      // Desktop active: slides from right, takes flex space
      "md:relative md:h-auto md:flex-1 md:translate-x-0 md:border-l md:border-purple-500/20 md:min-w-0 md:z-auto";
  } else {
    codePanelLayoutClasses =
      // Mobile hidden: below screen
      "fixed bottom-0 left-0 right-0 h-[80vh] z-20 translate-y-full opacity-0 " +
      // Desktop hidden: to the right, takes no space
      "md:relative md:h-auto md:w-0 md:translate-x-full md:opacity-0 md:border-l md:border-purple-500/20 md:min-w-0 md:z-auto";
  }

  const codePanelContainerClasses = `${codePanelBaseClasses} ${codePanelLayoutClasses}`;

  // For mobile overlay effect (backdrop)
  // This class comes from custom-chat-styles.css and is conditionally applied via @media
  const appContainerMobileOverlay = hasCodePanel
    ? "mobile-code-panel-overlay"
    : "";

  return (
    <div className={`${appContainerBase} ${appContainerMobileOverlay}`}>
      {/* Chat Container */}
      <div className={`${chatContainerBase} ${chatContainerLayoutClasses}`}>
        <ChatHeader />
        <MessageList
          messages={messages}
          isTyping={isTyping} // Pass down
          typingIndicator={typingIndicator} // Pass down
          messagesEndRef={messagesEndRef} // Pass down
          renderMessageContent={renderMessageContent}
          handleCodeCardClick={handleCodeCardClick}
        />
        <ChatInput
          inputValue={inputValue}
          onInputChange={onInputChange}
          onSendMessage={onSendMessage}
          textareaRef={textareaRef}
          onKeyDown={onKeyDown}
        />
      </div>

      {/* Code Panel Container - always in DOM for transition, visibility controlled by classes */}
      <div className={codePanelContainerClasses}>
        {activeCode && ( // Render CodePanel content only if activeCode exists
          <CodePanel
            activeCode={activeCode}
            onClose={onToggleCodePanel}
            copyCode={copyCode}
            downloadCode={downloadCode}
          />
        )}
      </div>
    </div>
  );
};

export default ChatLayout;
