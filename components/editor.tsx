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
  //   const generateUrl = useMutation(api.posts.generateMutationUrlFromId);
  //   // This part it to upload the file to convex storage. The file is successfully uploaded to convex storage and the storageId is returned.
  //   // But for blocknote image block url I am not being able to figure out a way to change the storageId to url.
  //   // Currently after successful upload the url field takes the storageId.
  //   //Figured it out
  //   const spaceName = getSpaceNameFromUrl();
  //   console.log(spaceName);
  //   const generateUploadUrl = useMutation(api.documents.generateUploadUrl);
  //   console.log(generateUploadUrl);
  //   const saveStorageId = useMutation(api.documents.saveStorageId);
  //   const handleUpload = async (file: File) => {
  //     console.log("INSIDE HANDLE UPLOAD");
  //     try {
  //       const postUrl = await generateUploadUrl({
  //         id: spaceName as Id<"documents">,
  //       });
  //       const result = await fetch(postUrl, {
  //         method: "POST",
  //         headers: { "Content-Type": file.type }, // use file.type here
  //         body: file, // use file here
  //       });
  //       const body = await result.json();
  //       const url = await generateUrl({ id: body.storageId });
  //       console.log(body);
  //       console.log(url);
  //       return url as any;
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

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
