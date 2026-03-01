export interface Snippet {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSnippetDto {
  content: string;
}

export interface UpdateSnippetDto {
  content?: string;
}
