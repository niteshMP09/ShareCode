export interface Snippet {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSnippetPayload {
  id?: string;
  content?: string;
}

export interface UpdateSnippetPayload {
  content?: string;
}
