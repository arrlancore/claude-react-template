/**
 * Execution Factory - Routes execution to pattern-specific problem executors
 */

export interface ExecutionResult {
  success: boolean;
  output: string;
  executionTime: number;
  testResults: any[];
  error?: string;
}

export interface ProblemExecutor {
  execute(language: string, code: string, customTests?: string): Promise<ExecutionResult>;
  getTemplate(language: string): string;
}

class ExecutionFactory {
  private executorCache = new Map<string, ProblemExecutor>();

  async execute(
    pattern: string,
    problemId: string,
    language: string,
    code: string,
    customTests?: string
  ): Promise<ExecutionResult> {
    const executorKey = `${pattern}/${problemId}`;

    let executor = this.executorCache.get(executorKey);

    if (!executor) {
      executor = await this.loadExecutor(pattern, problemId);
      this.executorCache.set(executorKey, executor);
    }

    return executor.execute(language, code, customTests);
  }

  async getTemplate(
    pattern: string,
    problemId: string,
    language: string
  ): Promise<string> {
    const executorKey = `${pattern}/${problemId}`;

    let executor = this.executorCache.get(executorKey);

    if (!executor) {
      executor = await this.loadExecutor(pattern, problemId);
      this.executorCache.set(executorKey, executor);
    }

    return executor.getTemplate(language);
  }

  private async loadExecutor(pattern: string, problemId: string): Promise<ProblemExecutor> {
    try {
      const module = await import(`@/patterns/${pattern}/problems/${problemId}/execution`);
      return module.default;
    } catch (error) {
      throw new Error(`No executor found for ${pattern}/${problemId}`);
    }
  }
}

export const executionFactory = new ExecutionFactory();
export default executionFactory;
