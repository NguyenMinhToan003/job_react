import { Editor, EditorContent } from "@tiptap/react";

export default function EditerInput({editor}: { editor: Editor| null }) {
  return <>
    <div className=' p-2 overflow-y-auto overflow-x-hidden h-[400px] flex flex-col'>
      <EditorContent 
        editor={editor}
      />
    </div>

  </>
}