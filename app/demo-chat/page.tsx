'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
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
      id: '1',
      content: "Hello! I'm your AI assistant. I can help you with coding, questions, and various tasks. What would you like to work on today?",
      sender: 'assistant',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeCodePanel, setActiveCodePanel] = useState<string | null>(null);
  const [codeBlocks, setCodeBlocks] = useState<Record<string, CodeBlock>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const autoResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const containsCode = (message: string) => {
    return message.includes('```') ||
           message.toLowerCase().includes('function') ||
           message.toLowerCase().includes('class') ||
           message.toLowerCase().includes('const ') ||
           message.toLowerCase().includes('let ') ||
           message.toLowerCase().includes('var ');
  };

  const extractCodeBlocks = (content: string): { content: string; codeBlocks: CodeBlock[] } => {
    const blocks: CodeBlock[] = [];
    let processedContent = content;

    if (content.includes('```')) {
      processedContent = content.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
        const codeId = `code_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const language = lang || 'Code';

        blocks.push({
          id: codeId,
          code: code.trim(),
          language
        });

        return `[CODE_BLOCK:${codeId}]`;
      });
    }

    return { content: processedContent, codeBlocks: blocks };
  };

  const renderMessageContent = (message: Message) => {
    let content = message.content;

    // Replace code block placeholders with code cards
    content = content.replace(/\[CODE_BLOCK:([^\]]+)\]/g, (match, codeId) => {
      const codeBlock = codeBlocks[codeId];
      if (!codeBlock) return match;

      return `<div class="code-card" data-code-id="${codeId}">
        <div class="code-card-content">
          <div class="code-card-icon">&lt;/&gt;</div>
          <div>
            <div class="code-card-title">${codeBlock.language} Code</div>
            <span class="code-card-subtitle">Click to view code</span>
          </div>
        </div>
        <div class="code-card-toggle">▼</div>
      </div>`;
    });

    return content;
  };

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
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "I understand what you're looking for. Let me help you with that.",
        "Here's a solution for your request:",
        "I can definitely help with that. Here's what I suggest:",
        "Let me create something for you:",
        "Great question! Here's my response:"
      ];

      let response = responses[Math.floor(Math.random() * responses.length)];

      // Add code if user asks for code
      if (userMessage.content.toLowerCase().includes('code') ||
          userMessage.content.toLowerCase().includes('function') ||
          userMessage.content.toLowerCase().includes('algorithm')) {
        response += "\n\n```javascript\nfunction twoPointerExample(arr, target) {\n    let left = 0;\n    let right = arr.length - 1;\n    \n    while (left < right) {\n        const sum = arr[left] + arr[right];\n        \n        if (sum === target) {\n            return [left, right];\n        } else if (sum < target) {\n            left++;\n        } else {\n            right--;\n        }\n    }\n    \n    return null;\n}\n\n// Example usage\nconst result = twoPointerExample([1, 2, 3, 4, 5], 7);\nconsole.log(result); // [1, 4]\n```";
      }

      const { content: processedContent, codeBlocks: newCodeBlocks } = extractCodeBlocks(response);

      // Add new code blocks to state
      const newCodeBlocksMap: Record<string, CodeBlock> = {};
      newCodeBlocks.forEach(block => {
        newCodeBlocksMap[block.id] = block;
      });
      setCodeBlocks(prev => ({ ...prev, ...newCodeBlocksMap }));

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: processedContent,
        sender: 'assistant',
        timestamp: new Date(),
        codeBlocks: newCodeBlocks,
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);

      // Auto-open code panel for new code
      if (newCodeBlocks.length > 0) {
        setTimeout(() => {
          setActiveCodePanel(newCodeBlocks[newCodeBlocks.length - 1].id);
        }, 500);
      }
    }, 1000 + Math.random() * 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      // You could add a toast notification here
      console.log('Code copied to clipboard!');
    });
  };

  const downloadCode = (code: string, language: string) => {
    const extensions: Record<string, string> = {
      'JavaScript': 'js',
      'Python': 'py',
      'HTML': 'html',
      'CSS': 'css',
      'JSON': 'json',
      'Code': 'txt'
    };

    const extension = extensions[language] || 'txt';
    const filename = `code_${Date.now()}.${extension}`;

    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
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
      <div className={`h-screen flex transition-all duration-300 ease-out ${hasCodePanel ? 'has-code-panel' : ''}`}>
        {/* Chat Container */}
        <div className={`flex flex-col bg-white/80 backdrop-blur-xl border-r border-purple-100 shadow-lg shadow-purple-500/10 transition-all duration-300 ease-out relative z-10 ${
          hasCodePanel
            ? 'max-w-[400px] min-w-[350px] flex-shrink-0'
            : 'flex-1'
        }`}>
          {/* Header */}
          <div className="p-5 bg-white/90 backdrop-blur-xl border-b border-purple-100 flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 bg-clip-text text-transparent">
              Two Pointer
            </h1>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((message) => (
              <div key={message.id} className={`flex gap-4 opacity-0 animate-[fadeInUp_0.5s_ease-out_forwards] ${
                message.sender === 'user' ? 'flex-row-reverse' : ''
              }`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-white ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-br from-purple-500 to-purple-600'
                    : 'bg-gradient-to-br from-pink-500 to-purple-600'
                }`}>
                  {message.sender === 'user' ? 'You' : 'AI'}
                </div>

                <div className={`max-w-[70%] rounded-2xl p-4 border shadow-sm backdrop-blur-sm ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200'
                    : 'bg-gradient-to-br from-pink-50 to-purple-50/50 border-pink-200'
                }`}>
                  <div
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: renderMessageContent(message).replace(/\n/g, '<br>')
                    }}
                    onClick={(e) => {
                      const target = e.target as HTMLElement;
                      const codeCard = target.closest('.code-card') as HTMLElement;
                      if (codeCard) {
                        const codeId = codeCard.getAttribute('data-code-id');
                        if (codeId) handleCodeCardClick(codeId);
                      }
                    }}
                  />
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-4 opacity-0 animate-[fadeInUp_0.5s_ease-out_forwards]">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-sm font-semibold text-white">
                  AI
                </div>
                <div className="bg-gradient-to-br from-pink-50 to-purple-50/50 border border-pink-200 rounded-2xl p-4 flex items-center gap-4 backdrop-blur-sm">
                  <span className="text-gray-700">Thinking</span>
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.16}s` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-6 bg-white/80 backdrop-blur-xl border-t border-purple-100">
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  autoResize();
                }}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything..."
                className="w-full bg-white/90 border border-purple-200 rounded-3xl px-5 py-4 pr-14 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-300 backdrop-blur-sm shadow-sm resize-none min-h-[24px] max-h-[120px]"
                rows={1}
              />
              <Button
                onClick={sendMessage}
                disabled={!inputValue.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-lg disabled:opacity-50"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
                </svg>
              </Button>
            </div>
          </div>
        </div>

        {/* Code Panel */}
        <div className={`flex-1 bg-slate-900 flex flex-col border-l border-purple-200 transition-all duration-300 ease-out ${
          hasCodePanel ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        } ${!hasCodePanel ? 'pointer-events-none' : ''}`}>
          <div className={`p-5 bg-slate-800 border-b border-slate-700 flex items-center justify-between transition-all duration-200 delay-100 ${
            hasCodePanel ? 'translate-y-0 opacity-100' : '-translate-y-5 opacity-0'
          }`}>
            <h2 className="text-white font-semibold">Code Output</h2>
            <Button
              onClick={() => setActiveCodePanel(null)}
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-white hover:bg-purple-600/20 w-8 h-8 p-0"
            >
              ×
            </Button>
          </div>

          <div className={`flex-1 p-6 overflow-auto transition-all duration-200 delay-200 ${
            hasCodePanel ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
          }`}>
            {activeCode && (
              <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-700">
                  <span className="text-slate-400 text-xs uppercase tracking-wider font-semibold">
                    {activeCode.language}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => copyCode(activeCode.code)}
                      size="sm"
                      className="bg-purple-600/20 border border-purple-600/30 text-slate-300 hover:bg-purple-600/30 text-xs"
                    >
                      Copy
                    </Button>
                    <Button
                      onClick={() => downloadCode(activeCode.code, activeCode.language)}
                      size="sm"
                      className="bg-purple-600/20 border border-purple-600/30 text-slate-300 hover:bg-purple-600/30 text-xs"
                    >
                      Download
                    </Button>
                  </div>
                </div>
                <pre className="text-slate-200 text-sm leading-relaxed overflow-x-auto">
                  <code>{activeCode.code}</code>
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .code-card {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(168, 85, 247, 0.05));
          border: 1px solid rgba(139, 92, 246, 0.2);
          border-radius: 12px;
          padding: 16px 20px;
          margin: 12px 0;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
        }

        .code-card:hover {
          border-color: rgba(139, 92, 246, 0.3);
          box-shadow: 0 8px 25px rgba(139, 92, 246, 0.15);
          transform: translateY(-2px);
        }

        .code-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: linear-gradient(135deg, #8b5cf6, #a855f7);
          opacity: 0.6;
        }

        .code-card-content {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
        }

        .code-card-icon {
          width: 20px;
          height: 20px;
          background: linear-gradient(135deg, #8b5cf6, #a855f7);
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 12px;
          font-weight: 600;
        }

        .code-card-title {
          font-weight: 600;
          color: #374151;
          font-size: 14px;
        }

        .code-card-subtitle {
          color: #6b7280;
          font-size: 12px;
          margin-left: 4px;
        }

        .code-card-toggle {
          color: #8b5cf6;
          font-size: 18px;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
      `}</style>
    </div>
  );
}
