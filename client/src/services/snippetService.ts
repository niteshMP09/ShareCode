import type { Snippet, CreateSnippetPayload, UpdateSnippetPayload } from '@/types/snippet';
import { apiClient } from '@/services/clientApi';

export const snippetService = {
  createSnippet: (data: CreateSnippetPayload) =>
    apiClient<Snippet>('/snippets', {
      method: 'POST',
      body: data,
    }),

  getSnippet: (id: string) => apiClient<Snippet>(`/snippets/${id}`),

  updateSnippet: (id: string, data: UpdateSnippetPayload) =>
    apiClient<Snippet>(`/snippets/${id}`, {
      method: 'PUT',
      body: data,
    }),
};
