"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Toolbar from "./toolbar";
import Underline from "@tiptap/extension-underline";

const Tiptap = ({
  onChange,
  content,
  initialContent,
  showToolbar = true,
  editable = true,
}: any) => {
  const handleChange = (newContent: string) => {
    onChange(newContent);
  };
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: initialContent || content || "",
    editable: editable,
    editorProps: {
      attributes: {
        class:
          "flex flex-col px-4 py-3 justify-start  text-zinc-700 dark:text-neutral-300 items-start w-full gap-3 font-medium text-[16px] pt-4 rounded-bl-md rounded-br-md outline-none min-h-[40vh]",
      },
    },
    onUpdate: ({ editor }) => {
      handleChange(editor.getHTML());
    },
  });

  return (
    <div className="w-full rounded-lg border">
      {showToolbar && <Toolbar editor={editor} content={content} />}
      <EditorContent style={{ whiteSpace: "pre-line" }} editor={editor} />
    </div>
  );
};

export default Tiptap;
