/**
 * ThreadManager service to maintain conversation threads for each document
 */
export class ThreadManager {
  private threads: Map<string, { threadId: string; assistantId: string }>;

  constructor() {
    this.threads = new Map();
  }

  /**
   * Set thread and assistant IDs for a document
   */
  setThread(documentId: string, threadId: string, assistantId: string): void {
    this.threads.set(documentId, { threadId, assistantId });
  }

  /**
   * Get thread ID for a document
   */
  getThreadId(documentId: string): string | undefined {
    return this.threads.get(documentId)?.threadId;
  }

  /**
   * Get assistant ID for a document
   */
  getAssistantId(documentId: string): string | undefined {
    return this.threads.get(documentId)?.assistantId;
  }

  /**
   * Remove thread for a document
   */
  removeThread(documentId: string): void {
    this.threads.delete(documentId);
  }
}
