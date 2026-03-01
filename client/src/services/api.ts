import type { Snippet, CreateSnippetPayload, UpdateSnippetPayload } from '../types/snippet';

const BASE = '/api';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error((err as { message: string }).message || 'Request failed');
  }
  return res.json() as Promise<T>;
}

export const api = {
  createSnippet: (data: CreateSnippetPayload) =>
    request<Snippet>('/snippets', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getSnippet: (id: string) => request<Snippet>(`/snippets/${id}`),

  updateSnippet: (id: string, data: UpdateSnippetPayload) =>
    request<Snippet>(`/snippets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};
