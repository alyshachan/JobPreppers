import React from "react";
import { Controller } from "react-hook-form";
import { EditorContent } from "@tiptap/react";
const TipTapEditor = ({ control, name, editor }) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <EditorContent
          editor={editor}
          onBlur={() => field.onChange(editor.getHTML())}
        />
      )}
    />
  );
};
export default TipTapEditor;
