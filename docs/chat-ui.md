# Chat UI Documentation for Learning Activities

## 1. Overview

This document outlines the current state and future direction of the Chat User Interface (UI) designed for interactive and adaptive learning activities. The primary goal is to evolve the existing chat demo (`app/[locale]/demo-chat/page.tsx`) into a robust platform capable of delivering the dynamic learning experiences described in `patterns/two-pointer/user-simulation.md`.

The Chat UI aims to:
-   Provide a conversational interface for learning.
-   Embed various interactive elements like code editors, quizzes, and visualizations.
-   Adapt content and pacing based on user interaction and AI assessment.
-   Support a rich, engaging, and effective learning journey.

## 2. Current Chat UI Components & Functionality (Based on `app/[locale]/demo-chat/page.tsx`)

The current demo showcases several foundational components and features:

*   **Core Components:**
    *   `MessageList`: Displays a list of messages from the user and the assistant.
    *   `ChatInput`: Allows users to type and send text messages. Supports disabled state for interactive sessions.
    *   `CodeCardComponent`: Renders static code blocks within assistant messages.
    *   `ProblemCard`: Displays information about a DSA problem and provides an option to open an interactive editor.
    *   `MonacoEditorPanel`: An embedded Monaco editor for users to write and submit code for DSA problems. Includes features for running code against test cases (system and custom) and viewing results.
    *   `TypingIndicator`: Shows when the assistant is "typing."
    *   `PatternChoiceButtons`: Interactive pattern selection component with confidence levels and auto-focus.
    *   `InteractiveElementWrapper`: Wrapper component for future interactive elements.

*   **Implemented Features (✅ Done / 🚧 Partially Done / ❌ Not Done):**
    *   ✅ Sending and receiving text-based messages.
    *   ✅ Distinguishing between "user" and "assistant" messages.
    *   ✅ Extracting and displaying static code blocks from assistant messages (using `CodeCardComponent`).
    *   ✅ Displaying a `ProblemCard` when the assistant suggests a DSA problem.
    *   ✅ Opening the `MonacoEditorPanel` from a `ProblemCard` with pre-filled problem details (title, description, starter code for the default language, test cases for display in settings).
    *   ✅ Submitting code from the `MonacoEditorPanel`. The submission is then displayed as a new user message in the chat.
    *   ✅ Dynamic display of system test cases (input/output format) in the Monaco Editor Panel settings.
    *   ✅ Interactive pattern choice buttons with auto-focus and input management.
    *   🚧 Simulated AI responses: The demo uses `setTimeout` and predefined responses/problem data. Actual LLM/AI integration is pending.
    *   🚧 Basic DSA Problem structure (`DSAProblem` interface) defined and used, including ID, title, description, starter code, language, and test cases.
    *   💡 **Developer Simulation Triggers:** To facilitate rapid UI development and testing of specific components before full AI/backend integration, the demo page (`app/[locale]/demo-chat/page.tsx`) incorporates keyword-based triggers:
        *   Typing "dsa problem" or "give me a problem" simulates the AI presenting the "Two Sum II" problem, which then allows testing the `ProblemCard` and `MonacoEditorPanel` flow.
        *   Typing "code", "function", or "algorithm" (without "dsa problem") simulates the AI providing a generic JavaScript code block.
        *   Typing "interactive 1" shows pattern choice buttons with auto-focus and input disable functionality.
        *   *(Future simulation triggers for other interactive components can be added as needed.)*

## 3. Target Features for Learning Activities (Derived from User Simulation & Requirements)

To transform the demo into a full learning platform as envisioned in `patterns/two-pointer/user-simulation.md`, the following features and enhancements are needed:

### 3.1. Interactive Message Elements

*   **Buttons in Messages:**
    *   **Status:** ✅ Done (Pattern Choice Buttons)
    *   **Description:** Implemented `PatternChoiceButtons` component with color-coded confidence levels, selection state management, and auto-focus functionality. Integrated with demo-chat via "interactive 1" trigger.
*   **Embedded Quizzes/Polls:**
    *   **Status:** 🚧 Partially Done (Pattern selection implemented)
    *   **Description:**
        *   **Multiple-Choice:** ✅ Pattern choice buttons with confidence indicators (high/medium/low)
        *   **Short Answer/Reasoning Prompts:** ❌ Not Done - Future iteration
*   **User Input for Specific Prompts:**
    *   **Status:** ✅ Done (Input disabled during interactive sessions)
    *   **Description:** Main chat input is disabled when interactive elements are active, forcing user to respond to the specific prompt. Input re-enabled after selection.

### 3.2. Enhanced Content Display

*   **Rich Text Formatting for AI Messages:**
    *   **Status:** 🚧 Partially Done (Basic markdown-like code blocks are handled)
    *   **Description:** Support for more advanced formatting like bold, italics, lists, headings, and blockquotes within AI messages to improve readability and structure of explanations and feedback.
*   **Progress Indicators:**
    *   **Status:** ❌ Not Done
    *   **Description:** Visually display user progress (e.g., `📊 Progress: [▓▓░░░░░░] 2/8 problems`) within chat messages.
*   **Achievement/Badge Display:**
    *   **Status:** ❌ Not Done
    *   **Description:** Show notifications or visual badges for achievements unlocked (e.g., `🏆 Achievement Unlocked: Pattern Master`).
*   **Embedded Visualizations:**
    *   **Status:** ❌ Not Done
    *   **Description:** Ability to embed or link to visualizations for algorithms, data structures, or pointer movements directly within the chat flow.

### 3.3. Learning Flow Management

*   **Contextual & Adaptive Content Delivery:**
    *   **Status:** ❌ Not Done (Currently simulated with hardcoded logic)
    *   **Description:** The chat UI needs to dynamically adjust content, prompts, and interactive elements based on the user's current state in the learning curriculum, their performance (e.g., quiz answers, code submissions), and AI-driven adaptations.
*   **State Management for Learning Journey:**
    *   **Status:** ❌ Not Done
    *   **Description:** A robust system to track user progress, calibration results, completed problems, achievements, and current learning focus.

### 3.4. LLM/AI Integration

*   **Real-time Communication with LLM:**
    *   **Status:** ❌ Not Done
    *   **Description:** Implement actual API calls to an LLM service.
        *   Send user interactions (quiz answers, free-text reasoning, code submissions for analysis beyond execution) to the LLM.
        *   Receive and parse structured responses from the LLM.
*   **Rendering Dynamic AI Responses:**
    *   **Status:** 🚧 Partially Done (Can render text, code, problem cards, interactive elements)
    *   **Description:** Ability to render complex responses from the AI, which might include text, new interactive elements (quizzes, buttons), formatted explanations, or requests for further user input.

### 3.5. Navigation & External Content

*   **Links to Dashboards or Other Modules:**
    *   **Status:** ❌ Not Done
    *   **Description:** Ability for chat messages to include links or buttons that navigate the user to other parts of the application, like a personal dashboard or different learning patterns.

## 4. Recently Completed Features

### 4.1. Interactive Pattern Choice Buttons (Completed)
*   **Components Added:**
    *   `PatternChoiceButtons` (`components/chat-ui/interactive/PatternChoiceButtons.tsx`)
    *   `InteractiveElementWrapper` (`components/chat-ui/interactive/InteractiveElementWrapper.tsx`)
*   **Features:**
    *   Color-coded confidence levels (high=green, medium=yellow, low=red)
    *   Auto-focus on interactive elements
    *   Selection state management (shows "✓ Selected" after choice)
    *   Main chat input disabled during interactive sessions
    *   Automatic focus return to chat input after completion
*   **Testing:** Type "interactive 1" in demo-chat to test
*   **Integration:** Ready for AI backend integration
*   **UX Enhancements:**
    *   Cannot re-trigger after selection
    *   Visual feedback for user choices
    *   Smooth focus management

## 5. Key Considerations for Development

*   **Component Reusability:** Design new UI elements (quizzes, buttons-in-message, etc.) as modular and reusable React components.
*   **State Management:** Choose an appropriate state management solution (e.g., Context API, Zustand, Redux) to handle the complex state of the learning journey and chat interactions.
*   **API Design for LLM:** Define clear and efficient API contracts for communication between the frontend chat UI and the backend LLM service. This includes how structured data (like quiz responses or requests for specific UI elements) is exchanged.
*   **Accessibility (a11y):** Ensure all interactive elements are accessible and the UI is usable for people with disabilities.
*   **Styling and Theming:** Maintain a consistent and engaging visual style.

## 6. Open Questions/Future Enhancements

*   More sophisticated embedded visualization tools.
*   Voice input/output capabilities.
*   Integration with external coding platforms or version control.
*   Detailed analytics and reporting on user learning patterns.
*   Additional interactive element types (strategy quizzes, reasoning prompts, code insight buttons).
