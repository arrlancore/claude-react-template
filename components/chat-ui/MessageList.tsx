import React from "react";
import MessageItem from "./MessageItem";

interface MessageListProps {
  messages: {
    id: string;
    content: string;
    sender: "user" | "assistant";
    timestamp?: Date; // Match the full Message type from ChatLayout/DemoChatPage
    codeBlocks?: any[]; // Match the full Message type
  }[];
  isTyping?: boolean;
  typingIndicator?: React.ReactNode;
  messagesEndRef?: React.RefObject<HTMLDivElement>;
  renderMessageContent: (
    message: MessageListProps["messages"][0]
  ) => React.ReactNode; // Expects full message, returns ReactNode
  handleCodeCardClick: (codeId: string) => void;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  isTyping,
  typingIndicator,
  messagesEndRef,
  renderMessageContent,
  handleCodeCardClick,
}) => {
  // Original .chat-messages: flex: 1; overflow-y: auto; padding: 24px; display: flex; flex-direction: column; gap: 24px;
  // Tailwind equivalent: flex-1 overflow-y-auto p-6 flex flex-col gap-6
  // The original HTML also has responsive padding for mobile (padding: 16px;).
  // We can use responsive padding in Tailwind: p-4 md:p-6
  return (
    <div
      className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-6 pb-24"
      ref={messagesEndRef}
    >
      {messages.map((message) => (
        <MessageItem
          key={message.id}
          message={message} // Pass the full message object
          renderMessageContent={() => renderMessageContent(message)} // Pass a function that calls renderMessageContent with the specific message
          onCodeCardClick={handleCodeCardClick}
        />
      ))}
      {isTyping && typingIndicator} {/* Display typing indicator */}
      {/* The messagesEndRef was originally on DemoChatPage, moving it here or to a child div for scrollIntoView */}
      {/* If messagesEndRef is for the div itself, it's already applied. If for an empty div at the end: */}
      {/* <div ref={messagesEndRef} /> */}
    </div>
  );
};

export default MessageList;
