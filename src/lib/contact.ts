// The contact conversation: what Ayoub asks, in order, and how answers are checked.
// Shared by the chat UI and the server action, so both validate the same way.

export interface ContactAnswers {
  topic: string;
  name: string;
  email: string;
  message: string;
}

export type AnswerKey = keyof ContactAnswers;

export interface ChatStep {
  key: AnswerKey;
  prompt: (answers: Partial<ContactAnswers>) => string;
  // Accessible name for the composer field.
  label: string;
  placeholder: string;
  // Shown under the composer when the answer isn't valid yet.
  error: string;
  inputType?: "text" | "email";
  autoComplete?: string;
  multiline?: boolean;
}

export const TOPICS = [
  "A project",
  "A job",
  "Freelance work",
  "Just saying hi",
] as const;

const ACK: Record<string, string> = {
  "A project": "A project, nice.",
  "A job": "Always happy to talk about roles.",
  "Freelance work": "Freelance works for me.",
  "Just saying hi": "Hi back!",
};

const MAX_LENGTH: Record<AnswerKey, number> = {
  topic: 80,
  name: 100,
  email: 254,
  // Telegram caps a message at 4096 characters, and the header lines need room too.
  message: 3500,
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function firstName(name: string) {
  return name.trim().split(/\s+/)[0];
}

export const STEPS: ChatStep[] = [
  {
    key: "topic",
    prompt: () => "Hi, I'm Ayoub. What brings you here?",
    label: "What brings you here?",
    placeholder: "Or type your own…",
    error: "Pick one above, or type a few words.",
  },
  {
    key: "name",
    prompt: (a) => `${ACK[a.topic ?? ""] ?? "Got it."} What's your name?`,
    label: "Your name",
    placeholder: "Your name",
    error: "I'd like to know who I'm talking to.",
    autoComplete: "name",
  },
  {
    key: "email",
    prompt: (a) =>
      `Nice to meet you, ${firstName(a.name ?? "")}. What email should I reply to?`,
    label: "Your email",
    placeholder: "you@email.com",
    error: "That email doesn't look right yet.",
    inputType: "email",
    autoComplete: "email",
  },
  {
    key: "message",
    prompt: () =>
      "Last one. What's on your mind? As much or as little as you like.",
    label: "Your message",
    placeholder: "Write your message…",
    error: "Write a few words first.",
    multiline: true,
  },
];

export const READY_PROMPT = "Ready when you are.";

export function thanksReply(answers: Partial<ContactAnswers>) {
  return `Got it, ${firstName(answers.name ?? "")}. It's with me now, and I'll reply to ${answers.email} within a day.`;
}

export function maxLength(key: AnswerKey) {
  return MAX_LENGTH[key];
}

export function isValidAnswer(key: AnswerKey, value: string) {
  const v = value.trim();
  if (v.length > MAX_LENGTH[key]) return false;
  if (key === "email") return EMAIL.test(v);
  if (key === "topic") return v.length > 1;
  return v.length > 0;
}

// Server functions can be called with anything, so check the shape as well as the values.
export function parseContact(input: unknown): ContactAnswers | null {
  if (typeof input !== "object" || input === null) return null;
  const record = input as Record<string, unknown>;
  const result: Partial<ContactAnswers> = {};
  for (const { key } of STEPS) {
    const value = record[key];
    if (typeof value !== "string" || !isValidAnswer(key, value)) return null;
    result[key] = value.trim();
  }
  return result as ContactAnswers;
}
