export interface Snippet {
  id: string;
  title: string;
  content: string;
  language: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSnippetPayload {
  title?: string;
  content: string;
  language: string;
}

export interface UpdateSnippetPayload {
  title?: string;
  content?: string;
  language?: string;
}
