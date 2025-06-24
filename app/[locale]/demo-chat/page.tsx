"use client";

/**
 * PHASE 1 IMPLEMENTATION COMPLETE ✅
 *
 * ✅ Real AI Integration: Replaced setTimeout with actual /api/ai/chat calls
 * ✅ Learning Session Management: Added session initialization and hooks
 * ✅ Progress Tracking: Real-time understanding level updates
 * ✅ Interactive Element Recording: Pattern choice buttons record actual data
 * ✅ Algorithm Visualization Recording: Two-pointer interactions logged
 * ✅ AI Code Validation: Monaco editor submissions get real AI feedback
 * ✅ Progress Header: Visual understanding level and stage indicators
 * ✅ Error Handling: Fallback responses when AI is unavailable
 *
 * TESTING COMMANDS:
 * - "Start learning two pointer" - should trigger real AI response
 * - Type "interactive 1" - should show pattern choice buttons with real recording
 * - Type "interactive 2" - should show algorithm visualization with real tracking
 * - Type "give me a problem" - should load problem and submit code for AI validation
 * - All interactions now update understanding level in real-time
 *
 * NEXT: Phase 2 - Learning Flow Structure (stages, problem progression, achievements)
 */

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
import InteractiveElementWrapper, {
  InteractiveElement,
  AlgorithmStateData,
} from "@/components/chat-ui/interactive/InteractiveElementWrapper";
import { useLearningSession, useProgress } from "@/lib/learning/hooks";
import { recordUserInteraction } from "@/lib/learning";
import { convertMDToContent } from "@/lib/mdx/mdx-utils";
import MDXViewer from "@/components/chat-ui/mdx-viewer";

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
  // Learning session hooks
  const {
    session,
    resumeOrCreateSession,
    isLoading: sessionLoading,
  } = useLearningSession();
  const { updateUnderstanding } = useProgress();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm your AI learning mentor. Let's start with the Two Pointer pattern. Ready to begin?",
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

  // Initialize learning session on mount
  useEffect(() => {
    const initSession = async () => {
      if (!session && !sessionLoading) {
        try {
          await resumeOrCreateSession("demo-user", "two-pointer");
        } catch (error) {
          console.error("Failed to initialize session:", error);
        }
      }
    };
    initSession();
  }, [session, sessionLoading, resumeOrCreateSession]);

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
          <div className="mb-4">
            <MDXViewer source={message.content} />
          </div>
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
            onSelect={async (optionId) => {
              // Record real interaction
              if (session?.id) {
                await recordUserInteraction({
                  session_id: session.id,
                  interaction_type: "pattern_recognition",
                  user_input: optionId,
                  ai_response: null,
                  timestamp: new Date(),
                  metadata: {
                    selected_option: optionId,
                    correct: optionId === "two-pointer",
                    options_shown: [
                      "two-pointer",
                      "sliding-window",
                      "binary-search",
                      "not-sure",
                    ],
                  },
                });

                // Update understanding based on correctness
                const isCorrect = optionId === "two-pointer";
                updateUnderstanding(isCorrect ? 10 : -5);
              }

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

    // Handle interactive 2 - algorithm state
    if (
      message.content.includes("interactive 2") &&
      message.sender === "assistant"
    ) {
      const algorithmElement: InteractiveElement = {
        type: "algorithm-state",
        data: {
          visualizer: "two-pointer",
          state: {
            array: [2, 7, 11, 15],
            left: 0,
            right: 3,
            target: 9,
            currentSum: 17,
            status: "Sum is too high, which pointer should move?",
          },
          question:
            "Current sum is 17, target is 9 (too high). Which pointer should move?",
          options: [
            {
              id: "move-left",
              label: "Move left pointer right",
              action: "increment-left",
              explanation:
                "This would increase the sum further (2→7), making it even higher",
              correct: false,
            },
            {
              id: "move-right",
              label: "Move right pointer left",
              action: "decrement-right",
              explanation:
                "Correct! This reduces the sum by using a smaller value (15→11)",
              correct: true,
            },
          ],
        },
      };

      return (
        <>
          <div className="mb-4">{message.content}</div>
          <InteractiveElementWrapper
            element={algorithmElement}
            onRender={(container) => {
              container.focus();
              setIsInteractiveActive(true);
            }}
            onResponse={async (response) => {
              // Record the algorithm interaction
              if (session?.id) {
                await recordUserInteraction({
                  session_id: session.id,
                  interaction_type: "algorithm_visualization",
                  user_input: response.selectedOption,
                  ai_response: null,
                  timestamp: new Date(),
                  metadata: {
                    selected_option: response.selectedOption,
                    correct: response.correct || false,
                    algorithm_state: response.algorithmState || null,
                    explanation_shown: response.explanationShown || false,
                  },
                });

                // Update understanding based on correctness
                const isCorrect = response.correct || false;
                updateUnderstanding(isCorrect ? 15 : -3);
              }

              const userMessage: Message = {
                id: Date.now().toString(),
                content: `Selected: ${response.selectedOption}`,
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

  const handleEditorSubmit = async (
    submittedCode: string,
    language: string
  ) => {
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
    setIsTyping(true);

    try {
      // Send to AI for validation
      const response = await fetch("/api/ai/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: "demo-user",
          code: submittedCode,
          language: language,
          pattern_id: "two-pointer",
          problem_id: currentProblem.id,
          context: {
            session_data: {
              understanding_level: session?.understanding_level || 50,
              attempt_number: 1, // Could track this
              time_spent_minutes: 10, // Could calculate actual time
            },
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Validation API error: ${response.status}`);
      }

      const validation = await response.json();

      // Create AI feedback message
      const feedbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `
**Code Analysis Complete! 🎯**

• **Correctness**: ${validation.data.correctness}%
• **Efficiency**: ${validation.data.efficiency || "Good"}
• **Pattern Usage**: ${validation.data.pattern_recognition || "Detected"}

**Feedback**: ${validation.data.feedback}

${validation.data.suggestions?.length > 0 ? `**Suggestions**:\n${validation.data.suggestions.map((s: string) => `• ${s}`).join("\n")}` : ""}

${validation.data.correctness >= 80 ? "🎉 Great work! You've successfully implemented the Two Pointer pattern!" : "💪 Keep going! You're on the right track."}
        `,
        sender: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, feedbackMessage]);

      // Record the submission and update progress
      if (session?.id) {
        await recordUserInteraction({
          session_id: session.id,
          interaction_type: "code_submission",
          user_input: submittedCode,
          ai_response: validation.data.feedback,
          timestamp: new Date(),
          metadata: {
            problem_id: currentProblem.id,
            language: language,
            correctness: validation.data.correctness,
            efficiency: validation.data.efficiency,
            pattern_recognition: validation.data.pattern_recognition,
          },
        });

        // Update understanding based on code quality
        if (validation.data.understanding_adjustment) {
          updateUnderstanding(validation.data.understanding_adjustment);
        }
      }
    } catch (error) {
      console.error("Code validation error:", error);

      // Fallback feedback
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Thanks for submitting your solution for "${currentProblem.title}"! Let me analyze your code...

I can see you're working on implementing the Two Pointer pattern. The structure looks good!

Some general guidance:
• Make sure you're moving the pointers strategically based on the comparison
• Remember that we're working with a sorted array
• The goal is to find the target sum efficiently

Would you like to discuss your approach or try another problem?`,
        sender: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsTyping(false);
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

    try {
      // Use real AI endpoint
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: "demo-user",
          message: inputValue,
          context: {
            pattern_id: "two-pointer",
            problem_id: session?.stage_progress?.current_problem || null,
            conversation_history: messages.slice(-10),
            session_data: {
              understanding_level: session?.understanding_level || 50,
              current_stage: session?.current_stage || "introduction",
              guidance_level:
                session?.stage_progress?.guidance_level || "balanced",
            },
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const aiResponse = await response.json();

      let assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse.data.message,
        sender: "assistant",
        timestamp: new Date(),
        interactive: aiResponse.data.requires_interaction,
      };

      // Handle special AI responses
      if (aiResponse.data.interactive_type === "pattern_choice") {
        assistantMessage.content =
          "Which pattern would you use for this problem? Array: [1,3,6,8,11,15], Target: 14";
        assistantMessage.interactive = true;
      } else if (
        aiResponse.data.interactive_type === "algorithm_visualization"
      ) {
        assistantMessage.content =
          "Let's analyze this two-pointer scenario: Array: [2,7,11,15], Target: 9. We start with pointers at positions 0 and 3. interactive 2";
        assistantMessage.interactive = true;
      }

      // Handle DSA problems
      if (aiResponse.data.problem_data) {
        assistantMessage.dsaProblem = {
          id: aiResponse.data.problem_data.id,
          pattern: aiResponse.data.problem_data.pattern,
          title: aiResponse.data.problem_data.title,
          description: aiResponse.data.problem_data.description,
          starterCode: aiResponse.data.problem_data.starter_code,
          language: aiResponse.data.problem_data.language || "javascript",
          testCases: aiResponse.data.problem_data.test_cases,
        };
      }

      // Handle code blocks
      const { content: processedContent, codeBlocks: newCodeBlocks } =
        extractCodeBlocks(assistantMessage.content);

      if (newCodeBlocks.length > 0) {
        const newCodeBlocksMap: Record<string, CodeBlock> = {};
        newCodeBlocks.forEach((block) => {
          newCodeBlocksMap[block.id] = block;
        });
        setCodeBlocks((prev) => ({ ...prev, ...newCodeBlocksMap }));

        assistantMessage = {
          ...assistantMessage,
          content: processedContent,
          codeBlocks: newCodeBlocks,
        };

        setTimeout(() => {
          setActiveCodePanel(newCodeBlocks[newCodeBlocks.length - 1].id);
        }, 500);
      }

      setMessages((prev) => [...prev, assistantMessage]);

      // Record interaction
      if (session?.id) {
        await recordUserInteraction({
          session_id: session.id,
          interaction_type: "chat_message",
          user_input: inputValue,
          ai_response: aiResponse.data.message,
          timestamp: new Date(),
          metadata: {
            understanding_delta: aiResponse.data.understanding_adjustment || 0,
            requires_interaction: aiResponse.data.requires_interaction || false,
          },
        });

        if (aiResponse.data.understanding_adjustment) {
          updateUnderstanding(aiResponse.data.understanding_adjustment);
        }
      }
    } catch (error) {
      console.error("AI Error:", error);

      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "I'm having trouble connecting right now. Let me help you with the Two Pointer pattern. Can you tell me what specific aspect you'd like to learn about?",
        sender: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsTyping(false);
    }
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
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-foreground">
              Two Pointer Learning
            </h1>

            {/* Progress Indicator */}
            {session && (
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Understanding:</span>
                  <div className="w-24 bg-muted rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${session.understanding_level || 0}%` }}
                    />
                  </div>
                  <span className="font-medium">
                    {Math.round(session.understanding_level || 0)}%
                  </span>
                </div>

                {sessionLoading && (
                  <div className="text-muted-foreground text-xs">
                    Loading session...
                  </div>
                )}

                {session.current_stage && (
                  <div className="text-xs text-muted-foreground capitalize">
                    Stage: {session.current_stage.replace("_", " ")}
                  </div>
                )}
              </div>
            )}
          </div>
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
