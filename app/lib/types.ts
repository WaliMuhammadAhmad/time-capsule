export type User = {
  id: string;
  email: string;
  name?: string;
  passwordHash: string;
  createdAt: string;
};

export type CapsuleMedia = {
  id: string;
  name: string;
  type: string; // mime type
  dataUrl: string; // base64 data URL for demo persistence
  size: number;
};

export type Capsule = {
  id: string;
  userId: string;
  title: string;
  note: string;
  isPublic: boolean;
  unlockAt: string; // ISO
  createdAt: string;
  updatedAt: string;
  media: CapsuleMedia[];
  notified?: boolean; // simulated email sent
};
