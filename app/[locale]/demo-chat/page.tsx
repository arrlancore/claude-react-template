"use client";

/**
 * PHASE 2 IMPLEMENTATION - Learning Flow Structure 🚀
 *
 * ✅ PHASE 1 COMPLETE: Real AI Integration with progress tracking
 * 🔄 PHASE 2 IN PROGRESS: Learning Flow Structure
 *    - Learning stage navigation (calibration → discovery → practice → assessment)
 *    - Problem-based learning flow (8 problems curriculum)
 *    - Achievement notifications system
 *
 * TARGET: Transform free-form chat into structured learning journey
 * CORE: Use /api/ai/guide for stage transitions and problem introductions
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
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

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
  interactive?: boolean;
}

// Interface to represent the structure from test-cases.json, mirroring MonacoEditorPanel
interface SourceTestCase {
  input: Record<string, any> | any;
  expected: any;
  explanation?: string;
}

interface CodeBlock {
  id: string;
  code: string;
  language: string;
}

interface DemoChatPageProps {
  user: {
    id: string;
    email: string | null;
  };
}

function DemoChatPage({ user }: DemoChatPageProps) {
  // Learning session hooks
  const {
    session,
    resumeOrCreateSession,
    isLoading: sessionLoading,
  } = useLearningSession(user.id);
  const { updateUnderstanding } = useProgress();

  // Initialize session immediately
  useEffect(() => {
    console.log("[DEBUG]: Component mounted, forcing session creation");
    resumeOrCreateSession("two-pointer").catch(console.error);
  }, []); // Empty deps = run once on mount

  // PHASE 2: Learning stage navigation
  const [currentStage, setCurrentStage] = useState<
    "calibration" | "discovery" | "practice" | "assessment"
  >("calibration");

  // Problem progression curriculum (8 problems for interview ready)
  const curriculum = [
    "01-two-sum-ii",
    "02-valid-palindrome",
    "03-container-with-water",
    "04-move-zeroes",
    "05-three-sum",
    "06-remove-duplicates",
    "07-sort-colors",
    "08-remove-nth-node",
  ];

  // Stage-based welcome messages
  const getWelcomeMessage = (stage: string) => {
    switch (stage) {
      case "calibration":
        return "Hi! I'm your AI learning mentor. Let's start with a quick assessment to personalize your learning. Ready?";
      case "discovery":
        return "Great! Now let's discover the Two Pointer pattern together. I'll guide you through the core insights.";
      case "practice":
        return "Time to practice! I'll give you problems and guide you through the solutions step by step.";
      case "assessment":
        return "Final challenge! Let's see how well you've mastered the Two Pointer pattern.";
      default:
        return "Hello! I'm your AI assistant for learning Two Pointer patterns.";
    }
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: getWelcomeMessage("calibration"),
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
          await resumeOrCreateSession(user.id as string, "two-pointer");
        } catch (error) {
          console.error("Failed to initialize session:", error);
        }
      }
    };
    initSession();
  }, [session, sessionLoading, resumeOrCreateSession, user.id]);

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
            onSelect={async (optionId) => {
              console.log(
                "[DEBUG]: Main component onSelect called with:",
                optionId
              );

              // Update understanding based on correctness
              const isCorrect = optionId === "two-pointer";
              console.log("[DEBUG]: Option is correct:", isCorrect);
              updateUnderstanding(isCorrect ? 10 : -5);

              // Check for achievements (bypass session requirement)
              if (isCorrect) {
                console.log("[DEBUG]: Triggering completion flow");

                // Show loading for completion message
                setIsTyping(true);

                setTimeout(() => {
                  // Add completion message
                  const completionMessage: Message = {
                    id: (Date.now() + 2).toString(),
                    content:
                      "✅ **Excellent!** You correctly identified the Two Pointer pattern. This shows you understand when to use strategic pointer movement for optimization.",
                    sender: "assistant",
                    timestamp: new Date(),
                  };

                  setMessages((prev) => [...prev, completionMessage]);
                  setIsTyping(false);

                  // Auto-progress if in calibration stage
                  if (currentStage === "calibration") {
                    setTimeout(() => {
                      setIsTyping(true); // Show loading for stage transition
                      setTimeout(() => {
                        progressToNextStage();
                      }, 400);
                    }, 1500);
                  }
                }, 500); // 500ms loading for completion message
              } else {
                console.log(
                  "[DEBUG]: Incorrect option, no achievements triggered"
                );
              }

              // Record interaction if session exists
              if (session?.id) {
                console.log(
                  "[DEBUG]: Recording interaction for session:",
                  session.id
                );
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
              } else {
                console.log(
                  "[DEBUG]: No session found, skipping interaction recording"
                );
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

                // Check for achievements on correct algorithm interaction
                if (isCorrect && currentStage === "discovery") {
                  checkForAchievements("stage_completed", {
                    stage: "discovery",
                  });
                  setTimeout(() => progressToNextStage(), 2000);
                }
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
    const parts = message.content.split(/(\[CODE_BLOCK:[^\]]+)\]/g);
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
    console.log("[DEBUG] handleEditorSubmit called with:", {
      submittedCode,
      language,
      currentProblem,
    });

    if (!currentProblem) {
      console.log("[DEBUG] No current problem, returning early");
      return;
    }

    console.log("[DEBUG] Creating solution message");
    const solutionMessage: Message = {
      id: Date.now().toString(),
      content: `Solution submitted for "${currentProblem.title}"`,
      sender: "user",
      timestamp: new Date(),
    };

    console.log("[DEBUG] Extracting code blocks");
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

    console.log("[DEBUG] Adding message to chat");
    setMessages((prevMessages) => [...prevMessages, finalSolutionMessage]);
    setIsTyping(true);

    console.log("[DEBUG] Starting AI validation call");
    // Send directly to AI validation (Monaco editor handles test execution)
    try {
      // Send to AI for validation
      const response = await fetch("/api/ai/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id as string,
          pattern_id: currentProblem.pattern,
          problem_id: currentProblem.id,
          user_solution: submittedCode,
          language: language,
          context: {
            session_data: {
              understanding_level: session?.understanding_level || 50,
              attempt_number: 1,
              time_spent_minutes: 10,
            },
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Validation API error: ${response.status}`);
      }

      const validation = await response.json();
      console.log("[DEBUG] AI validation response:", validation);

      // Create AI feedback message from actual response
      const feedbackContent = `**Code Analysis Results:**

${validation.data.is_correct ? "✅" : "❌"} **Correctness:** ${validation.data.is_correct ? "Passed" : "Needs work"}
⚡ **Efficiency:** ${validation.data.efficiency_score}/100
🎯 **Pattern Recognition:** ${validation.data.pattern_recognition ? "Good" : "Needs improvement"}
📊 **Understanding Level:** ${validation.data.understanding_level}

**AI Feedback:**
${validation.data.feedback}

${
  validation.data.improvement_suggestions.length > 0
    ? `**Suggestions:**
${validation.data.improvement_suggestions.map((s) => `• ${s}`).join("\n")}`
    : ""
}

${validation.data.is_correct ? "🎉 Great job! Your solution is working correctly!" : "💪 Keep refining your approach!"}`;

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: feedbackContent,
        sender: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);

      // Check for problem completion achievements
      const currentIndex = curriculum.indexOf(currentProblem.id);
      checkForAchievements("problem_completed", { problemIndex: currentIndex });

      // Check for speed achievement (if completed quickly)
      const timeSpent = 12; // Could calculate actual time spent
      if (timeSpent < 15) {
        checkForAchievements("problem_solved_fast", { timeMinutes: timeSpent });
      }

      // Auto-progress if in practice stage and this was the last problem
      if (
        currentStage === "practice" &&
        currentIndex === curriculum.length - 1
      ) {
        setTimeout(() => {
          checkForAchievements("stage_completed", { stage: "practice" });
          progressToNextStage();
        }, 3000);
      }
    } finally {
      setIsTyping(false);
    }
  };

  // PHASE 2: Stage progression logic
  const progressToNextStage = async () => {
    const stages = ["calibration", "discovery", "practice", "assessment"];
    const currentIndex = stages.indexOf(currentStage);

    if (currentIndex < stages.length - 1) {
      const nextStage = stages[currentIndex + 1] as typeof currentStage;
      setCurrentStage(nextStage);

      // Get AI guidance for stage transition
      setIsTyping(true);

      try {
        const response = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: user.id,
            message: `Transitioning from ${currentStage} to ${nextStage} stage. Please provide guidance for the ${nextStage} stage.`,
            context: {
              pattern_id: "two-pointer",
              current_stage: nextStage,
              problem_id: currentProblem,
              conversation_history: messages.slice(-5),
              session_data: {
                understanding_level: session?.understanding_level || 50,
                current_stage: nextStage,
                guidance_level: "balanced",
              },
            },
          }),
        });

        if (response.ok) {
          const aiResponse = await response.json();

          setTimeout(() => {
            const transitionMessage: Message = {
              id: Date.now().toString(),
              content: aiResponse.content || getWelcomeMessage(nextStage),
              sender: "assistant",
              timestamp: new Date(),
            };

            setMessages((prev) => [...prev, transitionMessage]);
            setIsTyping(false);
          }, 400);
        } else {
          throw new Error("Chat API failed");
        }
      } catch (error) {
        setTimeout(() => {
          const fallbackMessage: Message = {
            id: Date.now().toString(),
            content: getWelcomeMessage(nextStage),
            sender: "assistant",
            timestamp: new Date(),
          };

          setMessages((prev) => [...prev, fallbackMessage]);
          setIsTyping(false);
        }, 400);
      }
    }
  };

  // PHASE 2: Achievement notification system
  interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: string;
  }

  const [showAchievement, setShowAchievement] = useState<Achievement | null>(
    null
  );

  // Achievement detection based on actions
  const checkForAchievements = (action: string, data?: any) => {
    console.log(
      "[DEBUG]: checkForAchievements called with action:",
      action,
      "data:",
      data
    );
    const achievements: Achievement[] = [];

    // Stage progression achievements
    if (action === "stage_completed") {
      switch (data.stage) {
        case "calibration":
          achievements.push({
            id: "calibration_complete",
            name: "Assessment Complete",
            description: "Successfully completed initial calibration",
            icon: "🎯",
          });
          break;
        case "discovery":
          achievements.push({
            id: "pattern_discovered",
            name: "Pattern Explorer",
            description: "Discovered the Two Pointer pattern insights",
            icon: "🔍",
          });
          break;
        case "practice":
          achievements.push({
            id: "practice_warrior",
            name: "Practice Warrior",
            description: "Completed hands-on practice session",
            icon: "⚔️",
          });
          break;
      }
    }

    // Problem completion achievements
    if (action === "problem_completed" && data?.problemIndex !== undefined) {
      if (data.problemIndex === 0) {
        achievements.push({
          id: "first_problem",
          name: "First Steps",
          description: "Solved your first Two Pointer problem",
          icon: "👶",
        });
      } else if (data.problemIndex === 4) {
        // Three Sum (critical problem)
        achievements.push({
          id: "three_sum_master",
          name: "Three Sum Master",
          description: "Mastered the most important pattern extension",
          icon: "🏆",
        });
      } else if (data.problemIndex === 7) {
        // Last problem
        achievements.push({
          id: "interview_ready",
          name: "Interview Ready",
          description: "Completed all 8 core problems - you're ready!",
          icon: "🎓",
        });
      }
    }

    // Speed achievements
    if (action === "problem_solved_fast" && data?.timeMinutes < 15) {
      achievements.push({
        id: "speed_demon",
        name: "Speed Demon",
        description: "Solved a problem in under 15 minutes",
        icon: "⚡",
      });
    }

    // Pattern recognition achievements
    if (
      action === "pattern_recognized_instantly" &&
      data?.recognitionTime < 30
    ) {
      achievements.push({
        id: "pattern_spotter",
        name: "Pattern Spotter",
        description: "Recognized pattern in under 30 seconds",
        icon: "👁️",
      });
    }

    console.log("[DEBUG]: Generated achievements:", achievements);

    // Show first achievement if any unlocked
    if (achievements.length > 0) {
      console.log("[DEBUG]: Setting achievement toast:", achievements[0]);
      setShowAchievement(achievements[0]);
      setTimeout(() => {
        console.log("[DEBUG]: Clearing achievement toast");
        setShowAchievement(null);
      }, 4000);
    } else {
      console.log("[DEBUG]: No achievements generated for action:", action);
    }
  };

  // Achievement toast component
  const AchievementToast = ({ achievement }: { achievement: Achievement }) => (
    <div className="fixed top-20 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-lg shadow-lg animate-in slide-in-from-right z-50 max-w-sm">
      <div className="flex items-center gap-3">
        <div className="text-2xl">{achievement.icon}</div>
        <div>
          <div className="font-bold">{achievement.name}</div>
          <div className="text-sm opacity-90">{achievement.description}</div>
        </div>
      </div>
    </div>
  );

  // Enhanced progress header with stage indicator
  const ProgressHeader = () => {
    const currentProblemIndex = curriculum.indexOf(currentProblem);
    const stageEmoji = {
      calibration: "🎯",
      discovery: "🔍",
      practice: "💪",
      assessment: "🏆",
    };

    return (
      <div className="fixed top-0 w-full z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-foreground">
              Two Pointer Learning
            </h1>

            {session && (
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{stageEmoji[currentStage]}</span>
                  <div className="text-sm font-medium capitalize">
                    {currentStage}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Understanding:</span>
                  <div className="w-24 bg-muted rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${session?.understanding_level || 0}%` }}
                    />
                  </div>
                  <span className="font-medium">
                    {Math.round(session?.understanding_level || 0)}%
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Problem {Math.max(1, currentProblemIndex + 1)} of{" "}
                  {curriculum.length}
                </div>

                {sessionLoading && (
                  <div className="text-muted-foreground text-xs">
                    Loading...
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  const progressToNextProblem = async () => {
    const currentIndex = curriculum.indexOf(currentProblem);

    if (currentIndex < curriculum.length - 1) {
      const nextProblem = curriculum[currentIndex + 1];
      setCurrentProblem(nextProblem);

      // Show loading for async AI call
      setIsTyping(true);

      // Load next problem via chat API
      try {
        const response = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: user.id,
            message: `Moving to next problem: ${nextProblem}. Please introduce this problem.`,
            context: {
              pattern_id: "two-pointer",
              current_stage: currentStage,
              problem_id: nextProblem,
              conversation_history: messages.slice(-3),
              session_data: {
                understanding_level: session?.understanding_level || 50,
                current_stage: currentStage,
                guidance_level: "balanced",
              },
            },
          }),
        });

        if (response.ok) {
          const aiResponse = await response.json();

          const problemMessage: Message = {
            id: Date.now().toString(),
            content:
              aiResponse.content ||
              `Let's work on problem ${currentIndex + 2}: ${nextProblem.replace(/-/g, " ").replace(/^\d+\s*/, "")}`,
            sender: "assistant",
            timestamp: new Date(),
          };

          setMessages((prev) => [...prev, problemMessage]);

          // Auto-open editor with problem data
          const problemData: DSAProblem = {
            id: nextProblem,
            pattern: "two-pointer",
            title: nextProblem.replace(/-/g, " ").replace(/^\d+\s*/, ""),
            description: `Solve this ${nextProblem.replace(/-/g, " ")} problem using the Two Pointer technique.`,
            starterCode: {
              javascript:
                "// Write your solution here\nfunction solution() {\n    \n}",
              python: "# Write your solution here\ndef solution():\n    pass",
            },
            language: "javascript",
          };

          setCurrentProblem(problemData);
          setIsEditorPanelOpen(true);
          setIsTyping(false);
        } else {
          throw new Error("Chat API failed");
        }
      } catch (error) {
        // Fallback problem introduction
        const fallbackMessage: Message = {
          id: Date.now().toString(),
          content: `Great progress! Let's move to problem ${currentIndex + 2}: ${nextProblem.replace(/-/g, " ").replace(/^\d+\s*/, "")}. Ready to tackle this next challenge?`,
          sender: "assistant",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, fallbackMessage]);

        // Auto-open editor with problem data (fallback)
        const problemData: DSAProblem = {
          id: nextProblem,
          pattern: "two-pointer",
          title: nextProblem.replace(/-/g, " ").replace(/^\d+\s*/, ""),
          description: `Solve this ${nextProblem.replace(/-/g, " ")} problem using the Two Pointer technique.`,
          starterCode: {
            javascript:
              "// Write your solution here\nfunction solution() {\n    \n}",
            python: "# Write your solution here\ndef solution():\n    pass",
          },
          language: "javascript",
        };

        setCurrentProblem(problemData);
        setIsEditorPanelOpen(true);
        setIsTyping(false);
      }
    } else {
      // Completed all problems - trigger assessment
      if (currentStage !== "assessment") {
        progressToNextStage();
      }
    }
  };

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    // PHASE 2: Check interactive commands first
    const command = inputValue.toLowerCase().trim();

    if (command === "interactive 1") {
      const userMessage: Message = {
        id: Date.now().toString(),
        content: inputValue,
        sender: "user",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInputValue("");
      setIsTyping(true);

      setTimeout(() => {
        const interactiveMessage: Message = {
          id: (Date.now() + 1).toString(),
          content:
            "Which pattern would you use to find two numbers that sum to a target in a sorted array?",
          sender: "assistant",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, interactiveMessage]);
        setIsTyping(false);
      }, 500);
      return;
    }

    if (command === "interactive 2") {
      const userMessage: Message = {
        id: Date.now().toString(),
        content: inputValue,
        sender: "user",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInputValue("");
      setIsTyping(true);

      setTimeout(() => {
        const interactiveMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "Let's visualize the Two Pointer algorithm step by step:",
          sender: "assistant",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, interactiveMessage]);
        setIsTyping(false);
      }, 500);
      return;
    }

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

    // Stage progression commands
    if (
      command === "next stage" ||
      command === "progress" ||
      command === "continue"
    ) {
      progressToNextStage();
      return;
    }

    // Problem navigation commands
    if (command === "next problem" || command === "next") {
      progressToNextProblem();
      return;
    }

    // Help command
    if (command === "help") {
      // 500ms delay for system response
      setTimeout(() => {
        const helpMessage: Message = {
          id: Date.now().toString(),
          content: `**Learning Commands:**

🎯 **Stage Navigation:**
• \`next stage\` or \`progress\` - Move to next learning stage
• \`continue\` - Continue your learning journey

💪 **Problem Navigation:**
• \`next problem\` or \`next\` - Move to next problem in curriculum

🏆 **Quick Actions:**
• \`interactive 1\` - Pattern recognition exercise
• \`interactive 2\` - Algorithm visualization
• \`give me a problem\` - Load coding problem

Your current stage: **${currentStage}** | Problem: **${currentProblem}**`,
          sender: "assistant",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage, helpMessage]);
        setIsTyping(false);
      }, 500);
      setInputValue("");
      return;
    }

    try {
      // Use real AI endpoint
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id as string,
          message: inputValue,
          context: {
            pattern_id: "two-pointer",
            problem_id: currentProblem,
            current_stage: currentStage,
            conversation_history: messages.slice(-10),
            session_data: {
              understanding_level: session?.understanding_level || 50,
              current_stage: session?.current_stage || currentStage,
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
      {/* Enhanced Progress Header */}
      <ProgressHeader />

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
            {/* Learning Navigation Controls */}
            <div className="container mx-auto px-4 py-2 border-b border-purple-500/5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={progressToNextStage}
                    disabled={currentStage === "assessment"}
                    className="h-6 px-2 text-xs"
                  >
                    Next Stage →
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={progressToNextProblem}
                    disabled={
                      curriculum.indexOf(currentProblem) ===
                      curriculum.length - 1
                    }
                    className="h-6 px-2 text-xs"
                  >
                    Next Problem →
                  </Button>
                </div>
                <div className="text-muted-foreground">
                  Type "help" for learning commands
                </div>
              </div>
            </div>

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

interface DemoChatPageProps {
  user: {
    id: string;
    email: string | null;
  };
}

function DemoChatPageWithAuth() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/auth");
    }
  }, [router, isAuthenticated, loading]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || !user) {
    return null; // Or a specific "not authenticated" message
  }

  return <DemoChatPage user={user as { id: string; email: string | null }} />;
}

export default DemoChatPageWithAuth;
