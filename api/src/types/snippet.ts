export interface Snippet {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSnippetDto {
  id?: string;
  content?: string;
}

export interface UpdateSnippetDto {
  content?: string;
}
