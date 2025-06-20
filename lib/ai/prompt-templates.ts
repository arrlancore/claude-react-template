import type { PromptTemplate, UserProfile } from './types';

export class PromptTemplateManager {
  private templates: Map<string, PromptTemplate> = new Map();

  constructor() {
    this.initializeTemplates();
  }

  private initializeTemplates() {
    // Assessment Templates
    this.addTemplate({
      template_id: 'initial_assessment',
      category: 'assessment',
      subcategory: 'initial',
      template: `You are an adaptive DSA learning mentor. Assess this user's level for the {{pattern_name}} pattern.

User Background:
- Experience: {{user_experience}}
- Previous coding background: {{coding_background}}
- Self-assessment: {{self_assessment}}

Pattern Context:
{{pattern_description}}

Based on this information, determine:
1. Their starting level (beginner/intermediate/advanced)
2. Optimal learning pace (fast/balanced/thorough)
3. Recommended learning path
4. Confidence level (0-100)

Respond in JSON format:
{
  "user_level": "beginner|intermediate|advanced",
  "learning_pace": "fast|balanced|thorough",
  "recommended_path": ["step1", "step2", "step3"],
  "confidence_score": 0-100,
  "next_action": "start_learning|review_prerequisites|advance_level",
  "ai_reasoning": "Brief explanation of assessment"
}`,
      variables: ['pattern_name', 'user_experience', 'coding_background', 'self_assessment', 'pattern_description'],
      model_preference: 'pro',
      max_tokens: 500,
      temperature: 0.3,
    });

    this.addTemplate({
      template_id: 'progress_assessment',
      category: 'assessment',
      subcategory: 'progress',
      template: `Evaluate the user's current progress on {{pattern_name}}.

Current Status:
- Problems completed: {{completed_problems}}
- Success rate: {{success_rate}}%
- Time spent: {{time_spent}} minutes
- Difficulty areas: {{struggling_areas}}

User's latest work:
{{user_solution}}

Determine if they should:
- Continue at current level
- Advance to next level
- Review fundamentals
- Practice specific areas

Respond in JSON format with assessment and recommendations.`,
      variables: ['pattern_name', 'completed_problems', 'success_rate', 'time_spent', 'struggling_areas', 'user_solution'],
      model_preference: 'pro',
      max_tokens: 400,
      temperature: 0.2,
    });

    // Guidance Templates
    this.addTemplate({
      template_id: 'socratic_guidance',
      category: 'guidance',
      subcategory: 'socratic',
      template: `You are a Socratic tutor for {{pattern_name}}. Guide the user through discovery without giving away the solution.

Problem: {{problem_description}}
User's current attempt: {{user_input}}
Hint level: {{hint_level}}/5 (1=minimal, 5=direct)

User Profile:
- Learning pace: {{learning_pace}}
- Preferred style: {{learning_style}}
- Current confidence: {{confidence_level}}

Provide guidance that:
1. Asks leading questions to help them discover the pattern
2. Matches their learning pace and style
3. Gives appropriate hint level
4. Encourages pattern thinking over memorization

Keep response {{learning_pace}} and {{learning_style}}.`,
      variables: ['pattern_name', 'problem_description', 'user_input', 'hint_level', 'learning_pace', 'learning_style', 'confidence_level'],
      model_preference: 'flash',
      max_tokens: 300,
      temperature: 0.6,
    });

    this.addTemplate({
      template_id: 'adaptive_hint',
      category: 'guidance',
      subcategory: 'hint',
      template: `Provide a {{hint_level}}-level hint for this {{pattern_name}} problem.

Problem: {{problem_title}}
User's approach: {{user_approach}}
Attempts so far: {{attempt_count}}

Hint Levels:
1. Gentle nudge in right direction
2. Key insight about pattern application
3. Concrete step guidance
4. Partial solution approach
5. Near-complete guidance

User prefers {{learning_style}} explanations and learns at {{learning_pace}} pace.

Give a helpful hint that maintains their discovery process.`,
      variables: ['hint_level', 'pattern_name', 'problem_title', 'user_approach', 'attempt_count', 'learning_style', 'learning_pace'],
      model_preference: 'flash',
      max_tokens: 200,
      temperature: 0.5,
    });

    // Validation Templates
    this.addTemplate({
      template_id: 'solution_validation',
      category: 'validation',
      subcategory: 'solution',
      template: `Evaluate this solution for the {{pattern_name}} pattern.

Problem: {{problem_description}}
User's Solution:
{{user_solution}}

User's Explanation:
{{user_explanation}}

Assess:
1. Correctness (functional and edge cases)
2. Pattern recognition and application
3. Code efficiency and style
4. Understanding depth (surface/functional/deep)
5. Transfer likelihood to similar problems

Provide specific feedback on:
- What they did well
- Areas for improvement
- Pattern mastery indicators
- Suggestions for similar problems

Respond in JSON format:
{
  "is_correct": boolean,
  "pattern_recognition": boolean,
  "efficiency_score": 0-100,
  "understanding_level": "surface|functional|deep",
  "feedback": "detailed feedback",
  "improvement_suggestions": ["suggestion1", "suggestion2"],
  "transfer_likelihood": 0-100,
  "mastery_indicators": ["indicator1", "indicator2"]
}`,
      variables: ['pattern_name', 'problem_description', 'user_solution', 'user_explanation'],
      model_preference: 'pro',
      max_tokens: 600,
      temperature: 0.2,
    });

    // Chat Templates
    this.addTemplate({
      template_id: 'conversational_ai',
      category: 'chat',
      subcategory: 'general',
      template: `You are an encouraging DSA mentor chatting with a student learning {{pattern_name}}.

Current Context:
- Pattern: {{pattern_name}}
- Problem: {{current_problem}}
- User's recent progress: {{recent_progress}}

User's message: {{user_message}}

Conversation history:
{{conversation_history}}

Respond naturally as a supportive mentor. Be encouraging, insightful, and help them think through algorithmic concepts. Keep responses conversational but educational.

User prefers {{learning_style}} communication and {{learning_pace}} pacing.`,
      variables: ['pattern_name', 'current_problem', 'recent_progress', 'user_message', 'conversation_history', 'learning_style', 'learning_pace'],
      model_preference: 'flash',
      max_tokens: 400,
      temperature: 0.7,
    });
  }

  private addTemplate(template: PromptTemplate) {
    this.templates.set(template.template_id, template);
  }

  getTemplate(templateId: string): PromptTemplate | null {
    return this.templates.get(templateId) || null;
  }

  renderTemplate(templateId: string, variables: Record<string, string>): {
    prompt: string;
    template: PromptTemplate;
  } | null {
    const template = this.templates.get(templateId);
    if (!template) return null;

    let prompt = template.template;

    // Replace all variables in the template
    for (const variable of template.variables) {
      const value = variables[variable] || `[${variable}]`;
      prompt = prompt.replace(new RegExp(`{{${variable}}}`, 'g'), value);
    }

    return { prompt, template };
  }

  getTemplatesByCategory(category: string): PromptTemplate[] {
    return Array.from(this.templates.values()).filter(t => t.category === category);
  }

  getAllTemplates(): PromptTemplate[] {
    return Array.from(this.templates.values());
  }

  // Helper method to build user profile context for templates
  buildUserProfileContext(profile: UserProfile): Record<string, string> {
    return {
      learning_pace: profile.learning_pace,
      learning_style: profile.preferred_style,
      user_experience: profile.experience_level,
      current_pattern: profile.current_pattern || 'general',
      confidence_level: profile.progress_data?.confidence_level || 'medium',
    };
  }

  // Template validation
  validateTemplate(template: PromptTemplate): boolean {
    // Check required fields
    if (!template.template_id || !template.template || !template.category) {
      return false;
    }

    // Check if all variables in template are declared
    const templateVariables = template.template.match(/{{(\w+)}}/g);
    if (templateVariables) {
      const foundVariables = templateVariables.map(v => v.replace(/[{}]/g, ''));
      const undeclaredVars = foundVariables.filter(v => !template.variables.includes(v));
      if (undeclaredVars.length > 0) {
        console.warn(`Template ${template.template_id} has undeclared variables:`, undeclaredVars);
        return false;
      }
    }

    return true;
  }
}

// Singleton instance
let promptManager: PromptTemplateManager | null = null;

export function getPromptManager(): PromptTemplateManager {
  if (!promptManager) {
    promptManager = new PromptTemplateManager();
  }
  return promptManager;
}

export { promptManager };
