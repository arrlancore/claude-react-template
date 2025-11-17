import { test, expect } from "@playwright/test";
import { ChatActions } from "./helpers/chat-actions";
import { EditorActions } from "./helpers/editor-actions";

test.describe.configure({ mode: "serial" });
import { ExecutionValidator } from "./helpers/execution-validator";
import { solutions } from "./fixtures/two-sum-solutions";
import { languageConfigs } from "./config/language-configs";

test.describe("Monaco Editor TypeScript Execution", () => {});
