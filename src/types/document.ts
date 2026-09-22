export interface DocumentUser {
  id: string;
  name: string;
}

export interface Document {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  attachments: string[];
  contributors: DocumentUser[];
  version: string;
}
