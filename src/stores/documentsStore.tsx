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
import {
  fetchDocuments,
  type DocumentsFetchResult,
} from "@/services/documents";
import { readStoredArray, storeArray } from "@/services/localStorage";

const DOCUMENTS_STORAGE_KEY = "documents";

interface DocumentsContextValue {
  documents: Document[];
  loading: boolean;
  error: Error | null;
  refetchDocuments: () => Promise<void>;
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
  const [persistenceEnabled, setPersistenceEnabled] = useState(false);

  const handleDocumentsFetchResult = useCallback(
    (result: DocumentsFetchResult) => {
      if (result.error) {
        setError(result.error);
      } else {
        setDocuments(result.documents);
        setError(null);
      }
      setLoading(false);
    },
    [],
  );

  const refetchDocuments = useCallback(async () => {
    setLoading(true);
    handleDocumentsFetchResult(await fetchDocuments());
  }, [handleDocumentsFetchResult]);

  const addDocument = useCallback((document: Document) => {
    setDocuments((currentDocuments) => [...currentDocuments, document]);
  }, []);

  useEffect(() => {
    if (persistenceEnabled) {
      storeArray(DOCUMENTS_STORAGE_KEY, documents);
    }
  }, [documents, persistenceEnabled]);

  useEffect(() => {
    // Keep the initial request inside an async effect function. Calling
    // refetchDocuments here would synchronously set loading and trigger
    // React's set-state-in-effect lint rule.
    async function initialLoadDocuments() {
      const result = await fetchDocuments();

      // Load saved documents only when this initial request fails, then let
      // the shared handler expose the error.
      if (result.error) {
        setDocuments(readStoredArray<Document>(DOCUMENTS_STORAGE_KEY));
      }
      handleDocumentsFetchResult(result);
      setPersistenceEnabled(true);
    }

    initialLoadDocuments();
  }, [handleDocumentsFetchResult]);

  const value = useMemo(
    () => ({
      documents,
      loading,
      error,
      refetchDocuments,
      addDocument,
    }),
    [documents, loading, error, refetchDocuments, addDocument],
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
