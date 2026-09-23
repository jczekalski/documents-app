import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { Document } from "@/schemas/document";
import { getDocuments } from "@/services/documents";
import { readStoredArray, storeArray } from "@/services/localStorage";

const DOCUMENTS_STORAGE_KEY = "documents";

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
  const [documents, setDocuments] = useState<Document[]>(() =>
    readStoredArray<Document>(DOCUMENTS_STORAGE_KEY),
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadDocuments = useCallback(async () => {
    setLoading(true);

    try {
      const documents = await getDocuments();
      setDocuments(documents);
      setError(null);
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
    storeArray(DOCUMENTS_STORAGE_KEY, documents);
  }, [documents]);

  useEffect(() => {
    // A request can finish after this effect is cleaned up (for example, when
    // the provider unmounts or Strict Mode re-runs the effect). Ignore results
    // from that stale request so they cannot update state afterward.
    let isActive = true;

    async function load() {
      try {
        const documents = await getDocuments();
        if (!isActive) return;

        setDocuments(documents);
        setError(null);
      } catch (error) {
        if (!isActive) return;

        setError(
          error instanceof Error
            ? error
            : new Error("Failed to fetch documents"),
        );
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      isActive = false;
    };
  }, []);

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
