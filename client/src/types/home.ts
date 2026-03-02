export const HomeMode = {
  Create: 'create',
  Join: 'join',
} as const;

export type HomeMode = (typeof HomeMode)[keyof typeof HomeMode];
