export interface Snippet {
  id: string;
  title: string;
  content: string;
  language: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSnippetDto {
  title?: string;
  content: string;
  language?: string;
}

export interface UpdateSnippetDto {
  title?: string;
  content?: string;
  language?: string;
}
