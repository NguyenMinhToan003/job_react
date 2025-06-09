import { Toggle } from "@/components/ui/toggle";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  List,
  AlignRight,
} from "lucide-react";
import { Editor } from "@tiptap/react";

export default function EditerMenu({ editor }: { editor: Editor | null }) {
  if (!editor) return null;

  const menuOptions = [
    {
      icon: <Bold className="w-4 h-4" />,
      onClick: () => { editor.chain().focus().toggleBold().run(); },
      preesed: editor.isActive("bold")
    }
    ,
    {
      icon: <Italic className="w-4 h-4" />,
      onClick: () => { editor.chain().focus().toggleItalic().run(); },
      preesed: editor.isActive("italic")
    },
    {
      icon: <Strikethrough className="w-4 h-4" />,
      onClick: () => { editor.chain().focus().toggleStrike().run(); },
      preesed: editor.isActive("strike")
    },
    {
      icon: <Heading1 className="w-4 h-4" />,
      onClick: () => { editor.chain().focus().setHeading({ level: 1 }).run(); },
      preesed: editor.isActive("heading", { level: 1 })
    },
    {
      icon: <Heading2 className="w-4 h-4" />,
      onClick: () => { editor.chain().focus().setHeading({ level: 2 }).run(); },
      preesed: editor.isActive("heading", { level: 2 })
    },
    {
      icon: <Heading3 className="w-4 h-4" />,
      onClick: () => { editor.chain().focus().setHeading({ level: 3 }).run(); },
      preesed: editor.isActive("heading", { level: 3 })
    },
    {
      icon: <AlignLeft className="w-4 h-4" />,
      onClick: () => editor.chain().focus().setTextAlign("left").run(),
      pressed: editor.isActive({ textAlign: "left" }),
    },
    {
      icon: <AlignCenter className="w-4 h-4" />,
      onClick: () => editor.chain().focus().setTextAlign("center").run(),
      pressed: editor.isActive({ textAlign: "center" }),
    },
    {
      icon: <AlignRight className="w-4 h-4" />,
      onClick: () => editor.chain().focus().setTextAlign("right").run(),
      pressed: editor.isActive({ textAlign: "right" }),
    },
    {
      icon: <List className="w-4 h-4" />,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      pressed: editor.isActive("bulletList"),
    },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-2 p-1">
      {menuOptions.map((option, index) => (
        <Toggle
          key={index}
          className={`h-8 w-8 `}
          pressed={option.preesed}
          onClick={option.onClick}
        >
          {option.icon}
        </Toggle>
      ))}
    </div>
  );
}
