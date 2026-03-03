import type { Snippet, CreateSnippetPayload, UpdateSnippetPayload } from '@/types/snippet';
import { apiClient } from '@/services/clientApi';

export const snippetService = {
  createSnippet: (data: CreateSnippetPayload) =>
    apiClient<Snippet>('/api/snippets', {
      method: 'POST',
      body: data,
    }),

  getSnippet: (id: string) => apiClient<Snippet>(`/api/snippets/${id}`),

  updateSnippet: (id: string, data: UpdateSnippetPayload) =>
    apiClient<Snippet>(`/api/snippets/${id}`, {
      method: 'PUT',
      body: data,
    }),
};
