export interface JoinPayload {
  snippetId: string;
  name: string;
}

export interface ContentChangePayload {
  snippetId: string;
  content: string;
}

export interface TypingPayload {
  snippetId: string;
}
