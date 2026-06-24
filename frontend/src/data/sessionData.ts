export interface TranscriptItem {
  id: number;
  role: "student" | "tutor";
  message: string;
}

export const transcript: TranscriptItem[] = [
  {
    id: 1,
    role: "student",
    message:
      "I don't understand why x becomes negative when we move it.",
  },

  {
    id: 2,
    role: "tutor",
    message:
      "Let's focus on what operation is happening on both sides.",
  },

  {
    id: 3,
    role: "student",
    message:
      "So we're subtracting x from both sides?",
  },

  {
    id: 4,
    role: "tutor",
    message:
      "Exactly. We perform the same operation on both sides to keep the equation balanced.",
  },
];