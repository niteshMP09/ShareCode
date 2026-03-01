import { randomUUID } from 'crypto';
import { Snippet, CreateSnippetDto, UpdateSnippetDto } from '../types/snippet';

const store = new Map<string, Snippet>();

export class SnippetService {
  static create(data: CreateSnippetDto): Snippet {
    const id = randomUUID().replace(/-/g, '').slice(0, 10);
    const now = new Date().toISOString();
    const snippet: Snippet = {
      id,
      title: data.title?.trim() || 'Untitled',
      content: data.content,
      language: data.language || 'plaintext',
      createdAt: now,
      updatedAt: now,
    };
    store.set(id, snippet);
    return snippet;
  }

  static getById(id: string): Snippet | undefined {
    return store.get(id);
  }

  static update(id: string, data: UpdateSnippetDto): Snippet | undefined {
    const snippet = store.get(id);
    if (!snippet) return undefined;
    const updated: Snippet = {
      ...snippet,
      ...(data.title !== undefined && { title: data.title.trim() || 'Untitled' }),
      ...(data.content !== undefined && { content: data.content }),
      ...(data.language !== undefined && { language: data.language }),
      updatedAt: new Date().toISOString(),
    };
    store.set(id, updated);
    return updated;
  }
}
