"use client";

import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import "@blocknote/core/style.css";
import { BlockNoteView, useBlockNote } from "@blocknote/react";
import { useTheme } from "next-themes";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
// import { getSpaceNameFromUrl } from "@/utils/helpers";
import { useMutation } from "convex/react";

interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
}

const Editor = ({ onChange, initialContent, editable }: EditorProps) => {
  const { resolvedTheme } = useTheme();
  const handleUpload = async (file: File) => {
    console.log("INSIDE HANDLE UPLOAD");
  };


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
      <BlockNoteView
        editor={editor}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
      />
    </div>
  );
};

export default Editor;

// "use client"; // this registers <Editor> as a Client Component
// import { BlockNoteEditor } from "@blocknote/core";
// import { BlockNoteView, useBlockNote } from "@blocknote/react";
// import "@blocknote/core/style.css";

// // Our <Editor> component we can reuse later
// export default function Editor() {
//   // Creates a new editor instance.
//   const editor: BlockNoteEditor | null = useBlockNote({});

//   // Renders the editor instance using a React component.
//   return <BlockNoteView editor={editor} />;
// }
