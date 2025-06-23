"use client";

import React, { useState, useRef, useEffect } from "react";
import "@/components/chat-ui/custom-chat-styles.css";
import MessageList from "@/components/chat-ui/MessageList";
import ChatInput from "@/components/chat-ui/ChatInput";
import CodePanel from "@/components/chat-ui/CodePanel";
import TypingIndicator from "@/components/chat-ui/TypingIndicator";
import CodeCardComponent from "@/components/chat-ui/CodeCard";
import MonacoEditorPanel from "@/components/chat-ui/MonacoEditorPanel";
import ProblemCard from "@/components/chat-ui/ProblemCard";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import PatternChoiceButtons from "@/components/chat-ui/interactive/PatternChoiceButtons";
import { is } from "date-fns/locale";

// Define DSAProblem interface
interface DSAProblem {
  id: string;
  pattern: string; // Add pattern property
  title: string;
  description: string;
  starterCode?: Record<string, string>; // { language: code }
  language: string;
  testCases?: SourceTestCase[]; // Added for consistency with MonacoEditorPanel's expectation
}

interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp?: Date;
  codeBlocks?: CodeBlock[];
  dsaProblem?: DSAProblem;
  interactive?: boolean; // ADD THIS LINE
}

// Interface to represent the structure from test-cases.json, mirroring MonacoEditorPanel
interface SourceTestCase {
  input: Record<string, any> | any;
  expected: any;
  explanation?: string;
}

interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp?: Date; // Made timestamp optional
  codeBlocks?: CodeBlock[];
  dsaProblem?: DSAProblem; // Add dsaProblem to Message interface
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
  const [activeCodePanel, setActiveCodePanel] = useState<string | null>(null); // For existing CodeCard/CodePanel
  const [codeBlocks, setCodeBlocks] = useState<Record<string, CodeBlock>>({});
  const [isUserNearBottom, setIsUserNearBottom] = useState(true);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isInteractiveActive, setIsInteractiveActive] = useState(false);
  // New state for Monaco Editor Panel
  const [isEditorPanelOpen, setIsEditorPanelOpen] = useState(false);
  const [currentProblem, setCurrentProblem] = useState<DSAProblem | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const checkScrollPosition = () => {
    if (!chatContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;

    setIsUserNearBottom(isNearBottom);
    setShowScrollToBottom(!isNearBottom);
  };

  useEffect(() => {
    if (isUserNearBottom) {
      scrollToBottom();
    }
  }, [messages, isTyping, isUserNearBottom]);

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
    // Handle interactive elements
    if (
      message.content.includes("Which pattern would you use") &&
      message.sender === "assistant"
    ) {
      return (
        <>
          <div className="mb-4">{message.content}</div>
          <PatternChoiceButtons
            question="Select the best pattern:"
            onRender={(container) => {
              container.focus();
              setIsInteractiveActive(true);
            }}
            options={[
              { id: "two-pointer", label: "Two Pointer", confidence: "high" },
              {
                id: "sliding-window",
                label: "Sliding Window",
                confidence: "medium",
              },
              {
                id: "binary-search",
                label: "Binary Search",
                confidence: "low",
              },
              { id: "not-sure", label: "Not Sure", confidence: "low" },
            ]}
            onSelect={(optionId) => {
              const userMessage: Message = {
                id: Date.now().toString(),
                content: `Selected: ${optionId}`,
                sender: "user",
                timestamp: new Date(),
              };
              setMessages((prev) => [...prev, userMessage]);
              setIsInteractiveActive(false);
            }}
          />
        </>
      );
    }
    // Handle DSA Problem Card
    if (message.dsaProblem) {
      return (
        <ProblemCard
          key={`${message.id}-problem`}
          problem={message.dsaProblem}
          onOpenEditor={handleOpenEditor}
        />
      );
    }

    // Handle regular code blocks
    const parts = message.content.split(/(\[CODE_BLOCK:[^\]]+\])/g);
    return parts.map((part, index) => {
      const match = part.match(/\[CODE_BLOCK:([^\]]+)\]/);
      if (match) {
        const codeId = match[1];
        const codeBlock = codeBlocks[codeId];
        if (!codeBlock) {
          console.warn(`Code block with ID ${codeId} not found.`);
          return <span key={`${message.id}-part-${index}`}>{part}</span>;
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
      return <span key={`${message.id}-part-${index}`}>{part}</span>;
    });
  };

  const handleCodeCardClick = (codeId: string) => {
    if (activeCodePanel === codeId) {
      setActiveCodePanel(null);
    } else {
      setActiveCodePanel(codeId);
    }
  };

  // Event handlers for Monaco Editor Panel
  const handleOpenEditor = (problem: DSAProblem) => {
    setCurrentProblem(problem);
    setIsEditorPanelOpen(true);
    setActiveCodePanel(null); // Close any active static code panel
  };

  const handleCloseEditor = () => {
    setIsEditorPanelOpen(false);
    setCurrentProblem(null);
  };

  const handleEditorSubmit = (submittedCode: string, language: string) => {
    if (!currentProblem) return;

    const solutionMessage: Message = {
      id: Date.now().toString(),
      content: `Solution submitted for "${currentProblem.title}":\n\`\`\`${language}\n${submittedCode}\n\`\`\``,
      sender: "user",
      timestamp: new Date(),
    };

    const { content: processedContent, codeBlocks: newCodeBlocks } =
      extractCodeBlocks(solutionMessage.content);

    const newCodeBlocksMap: Record<string, CodeBlock> = {};
    newCodeBlocks.forEach((block) => {
      newCodeBlocksMap[block.id] = block;
    });
    setCodeBlocks((prev) => ({ ...prev, ...newCodeBlocksMap }));

    const finalSolutionMessage: Message = {
      ...solutionMessage,
      content: processedContent,
      codeBlocks: newCodeBlocks,
    };

    setMessages((prevMessages) => [...prevMessages, finalSolutionMessage]);
    // setIsEditorPanelOpen(false); // Optionally close editor on submit, or keep open
    // setCurrentProblem(null);

    // Simulate AI feedback to the submission
    setIsTyping(true);
    setTimeout(() => {
      const feedbackAssistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Thanks for submitting your solution for "${currentProblem.title}"! Let me review it... (Simulated AI feedback)`,
        sender: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, feedbackAssistantMessage]);
      setIsTyping(false);
    }, 1500);
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

        let responseContent =
          responses[Math.floor(Math.random() * responses.length)];
        let dsaProblemForMessage: DSAProblem | undefined = undefined;

        // Simulate AI giving a DSA problem
        if (
          userMessage.content.toLowerCase().includes("dsa problem") ||
          userMessage.content.toLowerCase().includes("give me a problem")
        ) {
          dsaProblemForMessage = {
            id: "01-two-sum-ii", // Use actual problem ID
            pattern: "two-pointer", // Add pattern
            title: "Two Sum II - Input Array is Sorted",
            description:
              "Given a 1-indexed array of integers `numbers` that is already sorted in non-decreasing order, find two numbers such that they add up to a specific `target` number.\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nExample:\nInput: numbers = [2,7,11,15], target = 9\nOutput: [1,2]\nExplanation: The sum of 2 and 7 is 9. Therefore index1 = 1, index2 = 2. We return [1, 2].",
            starterCode: {
              javascript:
                "function twoSum(numbers, target) {\n    // numbers: sorted array of integers\n    // target: integer to find sum for\n    // return: array of indices [index1, index2] (1-indexed per LeetCode #167)\n    \n}",
              python:
                "def twoSum(numbers, target):\n    # numbers: sorted list of integers\n    # target: integer to find sum for\n    # return: list of indices [index1, index2] (1-indexed per LeetCode #167)\n    pass",
              go: "func twoSum(numbers []int, target int) []int {\n    // numbers: sorted slice of integers\n    // target: integer to find sum for\n    // return: slice of indices [index1, index2] (1-indexed per LeetCode #167)\n    \n}",
            },
            language: "javascript", // Default language for the problem card and editor
            testCases: [
              {
                input: { numbers: [2, 7, 11, 15], target: 9 },
                expected: [[1, 2]],
                explanation: "Basic case: 2 + 7 = 9",
              },
              {
                input: { numbers: [2, 3, 4], target: 6 },
                expected: [[1, 3]],
                explanation: "Skip middle element: 2 + 4 = 6",
              },
              {
                input: { numbers: [-1, 0], target: -1 },
                expected: [[1, 2]],
                explanation: "Negative numbers: -1 + 0 = -1",
              },
              {
                input: { numbers: [1, 2], target: 3 },
                expected: [[1, 2]],
                explanation: "Minimum array size: 1 + 2 = 3",
              },
              {
                input: { numbers: [-3, -1, 0, 2, 4], target: 1 },
                expected: [
                  [2, 4],
                  [1, 5],
                ],
                explanation:
                  "Mixed negative/positive: -1 + 2 = 1 OR -3 + 4 = 1",
              },
              {
                input: { numbers: [1, 3, 3, 6], target: 6 },
                expected: [[2, 3]],
                explanation: "Duplicate values: 3 + 3 = 6",
              },
              {
                input: { numbers: [-5, -3, -1, 0, 2, 4, 6], target: -4 },
                expected: [[2, 3]],
                explanation: "Large array: -3 + (-1) = -4",
              },
              {
                input: { numbers: [0, 0, 3, 4], target: 0 },
                expected: [[1, 2]],
                explanation: "Target zero: 0 + 0 = 0",
              },
              {
                input: { numbers: [1, 2, 3, 4, 4, 9, 56, 90], target: 8 },
                expected: [[4, 5]],
                explanation: "Large array: 4 + 4 = 8",
              },
              {
                input: { numbers: [-10, -8, -2, 1, 2, 5, 6], target: 0 },
                expected: [[3, 5]],
                explanation: "Wide range: -2 + 2 = 0",
              },
            ],
          };
          // The ProblemCard will display the problem, so the message content can be simpler
          responseContent = `Here's a DSA problem for you: ${dsaProblemForMessage.title}. Click below to open the editor.`;
        }
        // Add regular code block if user asks for "code", "function", "algorithm" but not "dsa problem"
        else if (
          userMessage.content.toLowerCase().includes("code") ||
          userMessage.content.toLowerCase().includes("function") ||
          userMessage.content.toLowerCase().includes("algorithm")
        ) {
          responseContent +=
            "\n\n```javascript\nfunction twoPointerExample(arr, target) {\n    let left = 0;\n    let right = arr.length - 1;\n    \n    while (left < right) {\n        const sum = arr[left] + arr[right];\n        \n        if (sum === target) {\n            return [left, right];\n        } else if (sum < target) {\n            left++;\n        } else {\n            right--;\n        }\n    }\n    \n    return null;\n}\n\n// Example usage\nconst result = twoPointerExample([1, 2, 3, 4, 5], 7);\nconsole.log(result); // [1, 4]\n```";
        } else if (
          userMessage.content.toLowerCase().includes("interactive 1")
        ) {
          responseContent =
            "Which pattern would you use for this problem? Array: [1,3,6,8,11,15], Target: 14";
          // Will add interactive element in render
        }

        const { content: processedContent, codeBlocks: newCodeBlocks } =
          extractCodeBlocks(responseContent);

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
          dsaProblem: dsaProblemForMessage, // Attach DSA problem if any
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
    <div className="h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50">
      {/* Fixed Header */}
      <div className="fixed top-0 w-full z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-foreground">Two Pointer</h1>
        </div>
      </div>

      {/* Main Layout */}
      <div className="pt-16 h-screen flex">
        {/* Chat Area */}
        <div
          className={`flex flex-col transition-all duration-300 ${
            hasCodePanel || isEditorPanelOpen
              ? "hidden md:flex md:w-96 md:min-w-96"
              : "flex-1"
          }`}
        >
          {/* Messages */}
          <div className="flex-1 overflow-hidden relative">
            <div
              ref={chatContainerRef}
              onScroll={checkScrollPosition}
              className="container mx-auto px-4 overflow-y-auto h-full"
            >
              <MessageList
                messages={messages}
                isTyping={isTyping}
                typingIndicator={<TypingIndicator />}
                messagesEndRef={messagesEndRef}
                renderMessageContent={renderMessageContent}
                handleCodeCardClick={handleCodeCardClick}
              />
            </div>

            {/* Scroll to Bottom Button */}
            {showScrollToBottom && (
              <Button
                onClick={scrollToBottom}
                size="sm"
                className="absolute bottom-4 right-4 h-10 w-10 rounded-full bg-purple-500 hover:bg-purple-600 text-white shadow-lg transition-all duration-200 z-10"
                variant="default"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Chat Input */}
          <div className="backdrop-blur-xl border-t border-purple-500/10">
            <div className="container mx-auto">
              <ChatInput
                inputValue={inputValue}
                disabled={isInteractiveActive}
                onInputChange={(value) => {
                  setInputValue(value);
                  autoResize();
                }}
                onSendMessage={sendMessage}
                textareaRef={textareaRef}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>
        </div>

        {/* Code Panels */}
        {(hasCodePanel || isEditorPanelOpen) && (
          <div className="flex-1 md:bg-slate-900 md:border-l md:border-purple-500/20 fixed md:relative top-16 md:top-auto bottom-0 md:bottom-auto left-0 md:left-auto right-0 md:right-auto z-50 md:z-auto bg-slate-900 h-full md:h-auto">
            {isEditorPanelOpen && currentProblem ? (
              <MonacoEditorPanel
                problem={currentProblem}
                initialCode={
                  currentProblem.starterCode?.[currentProblem.language] || ""
                }
                language={currentProblem.language}
                onClose={handleCloseEditor}
                onSubmit={handleEditorSubmit}
                isVisible={isEditorPanelOpen}
              />
            ) : activeCode ? (
              <CodePanel
                activeCode={activeCode}
                onClose={() => setActiveCodePanel(null)}
                copyCode={copyCode}
                downloadCode={downloadCode}
              />
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
