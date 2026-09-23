import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { getDocuments } from "@/services/documents";
import { Document } from "@/types/document";

interface DocumentsContextValue {
  documents: Document[];
  loading: boolean;
  error: Error | null;
  loadDocuments: () => Promise<void>;
  addDocument: (document: Document) => void;
}

const DocumentsContext = createContext<DocumentsContextValue | undefined>(
  undefined,
);

interface DocumentsProviderProps {
  children: ReactNode;
}

export function DocumentsProvider({ children }: DocumentsProviderProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadDocuments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const documents = await getDocuments();

      setDocuments(documents);
    } catch (error) {
      setError(
        error instanceof Error ? error : new Error("Failed to fetch documents"),
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const addDocument = useCallback((document: Document) => {
    setDocuments((currentDocuments) => [...currentDocuments, document]);
  }, []);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const value = useMemo(
    () => ({
      documents,
      loading,
      error,
      loadDocuments,
      addDocument,
    }),
    [documents, loading, error, loadDocuments, addDocument],
  );

  return (
    <DocumentsContext.Provider value={value}>
      {children}
    </DocumentsContext.Provider>
  );
}

export function useDocuments() {
  const context = useContext(DocumentsContext);

  if (!context) {
    throw new Error("useDocuments must be used within a DocumentsProvider");
  }

  return context;
}
