export interface Snippet {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSnippetPayload {
  content: string;
}

export interface UpdateSnippetPayload {
  content?: string;
}
