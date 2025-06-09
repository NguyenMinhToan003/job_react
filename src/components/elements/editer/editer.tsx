import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextAlign } from '@tiptap/extension-text-align'
import EditerInput from "./editer-input";
import EditerMenu from "./editer-menu";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
export default function Editer({text, setText}: {
  text: string;
  setText: (text: string) => void;
}) {
  
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      })
    ],
    content: text,
    onUpdate: ({ editor }) => {
      setText(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm focus:outline-none p-2',
      },
    },
  })
  if (!editor) {
    return null;
  }

  return <>
  
    <div className='border rounded-md  h-full flex flex-col '>
      <EditerMenu editor={editor} />
      <EditerInput 
        editor={editor}
      />
    </div>
  </>
}