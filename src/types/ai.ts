export type MessageRole = "user" | "model" | "system";

export type AiAttachment = {
  type: "image";
  url: string; // base64 data url or public url
  mimeType: string;
  name: string;
  sizeBytes: number;
};

export type MedicalSourceCitation = {
  title: string;
  uri?: string;
  sourceName?: string;
};

export type AiChatMessage = {
  id: string;
  role: MessageRole;
  content: string;
  attachment?: AiAttachment;
  sources?: MedicalSourceCitation[];
  createdAt: string;
  isStreaming?: boolean;
  hasError?: boolean;
};

export type AiChatSession = {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: AiChatMessage[];
};

export type AiQuickSuggestion = {
  id: string;
  textAr: string;
  textDz: string;
  textFr: string;
  category: "medical" | "support" | "exercise" | "nutrition" | "medication";
};
