import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import { Text } from "react-native";

import { fetchDocuments } from "@/services/documents";
import { readStoredArray, storeArray } from "@/services/localStorage";
import { DocumentsProvider, useDocuments } from "@/stores/documentsStore";
import { readAttachmentCsv } from "@/utils/attachmentsCsv";
import { AddDocumentSheet } from "./AddDocumentSheet";

jest.mock("@gorhom/bottom-sheet", () => {
  const React = jest.requireActual<typeof import("react")>("react");
  const { ScrollView, TextInput, View } =
    jest.requireActual<typeof import("react-native")>("react-native");
  const BottomSheetModalMock = React.forwardRef(
    ({ children }: { children: React.ReactNode }, ref: React.Ref<unknown>) => {
      React.useImperativeHandle(ref, () => ({ dismiss: jest.fn() }));
      return <View>{children}</View>;
    },
  );
  BottomSheetModalMock.displayName = "BottomSheetModalMock";

  return {
    BottomSheetBackdrop: View,
    BottomSheetModal: BottomSheetModalMock,
    BottomSheetScrollView: ScrollView,
    BottomSheetTextInput: TextInput,
  };
});
jest.mock("@expo/vector-icons", () => ({
  MaterialCommunityIcons: () => null,
}));
jest.mock("expo-crypto", () => ({
  randomUUID: () => "a9c1ac2a-473c-4b46-9388-08f91fcfdc88",
}));
jest.mock("expo-document-picker", () => ({
  getDocumentAsync: jest.fn().mockResolvedValue({
    canceled: false,
    assets: [{ name: "attachments.csv", uri: "file:///attachments.csv" }],
  }),
}));
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}));
jest.mock("@/services/documents", () => ({ fetchDocuments: jest.fn() }));
jest.mock("@/services/localStorage", () => ({
  readStoredArray: jest.fn(() => []),
  storeArray: jest.fn(),
}));
jest.mock("@/utils/attachmentsCsv", () => ({
  readAttachmentCsv: jest
    .fn()
    .mockResolvedValue(["Annual report", "Meeting notes"]),
}));

function AddDocumentHarness() {
  const { documents, addDocument, loading } = useDocuments();

  return (
    <>
      <Text testID="documents">{JSON.stringify(documents)}</Text>
      <Text testID="loading">{String(loading)}</Text>
      <AddDocumentSheet onSubmit={addDocument} />
    </>
  );
}

describe("AddDocumentSheet", () => {
  beforeEach(() => {
    jest
      .mocked(fetchDocuments)
      .mockResolvedValue({ documents: [], error: null });
    jest.mocked(readStoredArray).mockReturnValue([]);
    jest.mocked(storeArray).mockClear();
    jest
      .mocked(readAttachmentCsv)
      .mockResolvedValue(["Annual report", "Meeting notes"]);
  });

  it("adds a document to provider state after submitting valid details", async () => {
    await render(
      <DocumentsProvider>
        <AddDocumentHarness />
      </DocumentsProvider>,
    );

    await waitFor(() =>
      expect(screen.getByTestId("loading").props.children).toBe("false"),
    );
    expect(fetchDocuments).toHaveBeenCalledTimes(1);
    await fireEvent.changeText(
      screen.getByTestId("document-title-input"),
      "  Budget  ",
    );
    await fireEvent.changeText(
      screen.getByTestId("document-version-input"),
      "  2.1.0 ",
    );
    await fireEvent.press(screen.getByTestId("choose-attachment-file-button"));
    await screen.findByTestId("selected-attachment-file");

    await fireEvent.press(screen.getByTestId("submit-document-button"));

    await waitFor(() => {
      expect(screen.getByTestId("documents").props.children).toContain(
        "Budget",
      );
    });
    expect(screen.getByTestId("documents").props.children).toContain(
      '"version":"2.1.0"',
    );
    expect(screen.getByTestId("documents").props.children).toContain(
      '"attachments":["Annual report","Meeting notes"]',
    );
    expect(readAttachmentCsv).toHaveBeenCalledWith("file:///attachments.csv");
  });
});
