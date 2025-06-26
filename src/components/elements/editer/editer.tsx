import { useEffect } from 'react';
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextAlign } from '@tiptap/extension-text-align';
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import EditerMenu from "./editer-menu";
import EditerInput from "./editer-input";

export default function Editer({
  text,
  setText,
}: {
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
      }),
    ],
    content: '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      if (html !== text) setText(html);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm focus:outline-none p-2',
      },
    },
  });

  useEffect(() => {
    if (editor && text && editor.getHTML() !== text) {
      editor.commands.setContent(text);
    }
  }, [text, editor]);

  if (!editor) return null;

  return (
    <div className='border rounded-sm flex flex-col border-[#2c95ff] h-full'>
      <EditerMenu editor={editor} />
      <EditerInput editor={editor} />
    </div>
  );
}
