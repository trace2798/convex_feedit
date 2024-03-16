"use client";

import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import "@blocknote/core/style.css";
// import { BlockNoteView, useBlockNote } from "@blocknote/react";
import {
  BlockNoteView,
  darkDefaultTheme,
  lightDefaultTheme,
  Theme,
  useBlockNote,
} from "@blocknote/react";
import { useTheme } from "next-themes";

// Base theme
const lightTheme = {
  ...lightDefaultTheme,
} satisfies Theme;

// Changes for dark mode
const darkTheme = {
  ...darkDefaultTheme,
  colors: {
    ...darkDefaultTheme.colors,
    editor: {
      text: "#ffffff",
      background: "#09090B",
    },
    highlightColors: darkDefaultTheme.colors.highlightColors,
  },
} satisfies Theme;

const customTheme = {
  light: lightTheme,
  dark: darkTheme,
};

interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
}

const Editor = ({ onChange, initialContent, editable }: EditorProps) => {
  const { resolvedTheme } = useTheme();
  
  // const handleUpload = async (file: File) => {
  //   console.log("INSIDE HANDLE UPLOAD");
  // };

  const editor: BlockNoteEditor = useBlockNote({
    editable,
    initialContent: initialContent
      ? (JSON.parse(initialContent) as PartialBlock[])
      : undefined,
    onEditorContentChange: (editor: any) => {
      onChange(JSON.stringify(editor.topLevelBlocks, null, 2));
    },
    // uploadFile: handleUpload,
  });

  return (
    <div>
      <BlockNoteView editor={editor} theme={customTheme[resolvedTheme === "dark" ? "dark" : "light"]} />
    </div>
  );
};

export default Editor;
