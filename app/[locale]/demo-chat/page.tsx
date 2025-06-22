"use client";

import React, { useState, useRef, useEffect } from "react";
import "@/components/chat-ui/custom-chat-styles.css";
import ChatLayout from "@/components/chat-ui/ChatLayout";
import TypingIndicator from "@/components/chat-ui/TypingIndicator"; // Import TypingIndicator
import CodeCardComponent from "@/components/chat-ui/CodeCard"; // Placeholder for the new CodeCard component
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
  codeBlocks?: CodeBlock[];
}

interface CodeBlock {
  id: string;
  code: string;
  language: string;
}

export default function DemoChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm your AI assistant. I can help you with coding, questions, and various tasks. What would you like to work on today?",
      sender: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeCodePanel, setActiveCodePanel] = useState<string | null>(null);
  const [codeBlocks, setCodeBlocks] = useState<Record<string, CodeBlock>>({}); // This will store all code blocks by ID
  const messagesEndRef = useRef<HTMLDivElement>(null); // This ref should be attached to the MessageList or a wrapper around it
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    // Ensure this ref is correctly placed in MessageList or its child for scrolling
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]); // Scroll when new messages or typing indicator appears

  const autoResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const containsCode = (message: string) => {
    return (
      message.includes("```") ||
      message.toLowerCase().includes("function") ||
      message.toLowerCase().includes("class") ||
      message.toLowerCase().includes("const ") ||
      message.toLowerCase().includes("let ") ||
      message.toLowerCase().includes("var ")
    );
  };

  const extractCodeBlocks = (
    content: string
  ): { content: string; codeBlocks: CodeBlock[] } => {
    const blocks: CodeBlock[] = [];
    let processedContent = content;

    if (content.includes("```")) {
      processedContent = content.replace(
        /```(\w+)?\n([\s\S]*?)```/g,
        (match, lang, code) => {
          const codeId = `code_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          const language = lang || "Code";

          blocks.push({
            id: codeId,
            code: code.trim(),
            language,
          });

          return `[CODE_BLOCK:${codeId}]`;
        }
      );
    }

    return { content: processedContent, codeBlocks: blocks };
  };

  // Updated to return JSX
  const renderMessageContent = (message: Message): React.ReactNode => {
    const parts = message.content.split(/(\[CODE_BLOCK:[^\]]+\])/g);
    return parts.map((part, index) => {
      const match = part.match(/\[CODE_BLOCK:([^\]]+)\]/);
      if (match) {
        const codeId = match[1];
        const codeBlock = codeBlocks[codeId]; // Get from the central codeBlocks state
        if (!codeBlock) {
          console.warn(`Code block with ID ${codeId} not found.`);
          return <span key={`${message.id}-part-${index}`}>{part}</span>; // Fallback
        }
        return (
          <CodeCardComponent
            key={`${message.id}-code-${codeId}`}
            codeBlock={codeBlock}
            isActive={activeCodePanel === codeId}
            onClick={() => handleCodeCardClick(codeId)}
          />
        );
      }
      // Render simple text parts, ensuring newlines are handled (e.g., by MessageItem's dangerouslySetInnerHTML or by splitting and mapping <br />)
      // For now, MessageItem handles newline conversion.
      return <span key={`${message.id}-part-${index}`}>{part}</span>;
    });
  };

  // This function will be passed to MessageItem, which will then pass it to the actual CodeCardComponent
  const handleCodeCardClick = (codeId: string) => {
    if (activeCodePanel === codeId) {
      setActiveCodePanel(null);
    } else {
      setActiveCodePanel(codeId);
    }
  };

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    // Simulate AI response
    setTimeout(
      () => {
        const responses = [
          "I understand what you're looking for. Let me help you with that.",
          "Here's a solution for your request:",
          "I can definitely help with that. Here's what I suggest:",
          "Let me create something for you:",
          "Great question! Here's my response:",
        ];

        let response = responses[Math.floor(Math.random() * responses.length)];

        // Add code if user asks for code
        if (
          userMessage.content.toLowerCase().includes("code") ||
          userMessage.content.toLowerCase().includes("function") ||
          userMessage.content.toLowerCase().includes("algorithm")
        ) {
          response +=
            "\n\n```javascript\nfunction twoPointerExample(arr, target) {\n    let left = 0;\n    let right = arr.length - 1;\n    \n    while (left < right) {\n        const sum = arr[left] + arr[right];\n        \n        if (sum === target) {\n            return [left, right];\n        } else if (sum < target) {\n            left++;\n        } else {\n            right--;\n        }\n    }\n    \n    return null;\n}\n\n// Example usage\nconst result = twoPointerExample([1, 2, 3, 4, 5], 7);\nconsole.log(result); // [1, 4]\n```";
        }

        const { content: processedContent, codeBlocks: newCodeBlocks } =
          extractCodeBlocks(response);

        // Add new code blocks to state
        const newCodeBlocksMap: Record<string, CodeBlock> = {};
        newCodeBlocks.forEach((block) => {
          newCodeBlocksMap[block.id] = block;
        });
        setCodeBlocks((prev) => ({ ...prev, ...newCodeBlocksMap }));

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: processedContent,
          sender: "assistant",
          timestamp: new Date(),
          codeBlocks: newCodeBlocks,
        };

        setMessages((prev) => [...prev, assistantMessage]);
        setIsTyping(false);

        // Auto-open code panel for new code
        if (newCodeBlocks.length > 0) {
          setTimeout(() => {
            setActiveCodePanel(newCodeBlocks[newCodeBlocks.length - 1].id);
          }, 500);
        }
      },
      1000 + Math.random() * 2000
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      // You could add a toast notification here
      console.log("Code copied to clipboard!");
    });
  };

  const downloadCode = (code: string, language: string) => {
    const extensions: Record<string, string> = {
      JavaScript: "js",
      Python: "py",
      HTML: "html",
      CSS: "css",
      JSON: "json",
      Code: "txt",
    };

    const extension = extensions[language] || "txt";
    const filename = `code_${Date.now()}.${extension}`;

    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const hasCodePanel = activeCodePanel !== null;
  const activeCode = activeCodePanel ? codeBlocks[activeCodePanel] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50">
      {" "}
      {/* Original: #f3e8ff, #fdf2f8, #f3e8ff */}
      <ChatLayout
        messages={messages}
        isTyping={isTyping} // Pass isTyping state
        typingIndicator={<TypingIndicator />} // Pass TypingIndicator component
        messagesEndRef={messagesEndRef} // Pass ref for scrolling
        inputValue={inputValue}
        onInputChange={(value) => {
          // Changed 'e' to 'value' for clarity if ChatInput passes string directly
          setInputValue(value);
          autoResize();
        }}
        onSendMessage={sendMessage}
        textareaRef={textareaRef}
        onKeyDown={handleKeyDown}
        activeCode={activeCode}
        onToggleCodePanel={() => setActiveCodePanel(null)}
        copyCode={copyCode}
        downloadCode={downloadCode}
        renderMessageContent={
          renderMessageContent as (message: {
            id: string;
            content: string;
            sender: "user" | "assistant";
          }) => React.ReactNode
        } // Cast for ChatLayout
        handleCodeCardClick={handleCodeCardClick}
        hasCodePanel={activeCodePanel !== null}
      />
    </div>
  );
}
