import { useEffect, useRef } from "react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  List,
  ListOrdered,
  Redo2,
  Underline,
  Undo2,
  Unlink,
  Link,
} from "lucide-react";

const toolbarButtonClass =
  "inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-600 transition hover:bg-surface-subtle hover:text-brand-teal";

export default function RichTextEditor({ value, onChange, onBlur, error }) {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const runCommand = (command, commandValue = null) => {
    editorRef.current?.focus();
    document.execCommand(command, false, commandValue);
    onChange(editorRef.current?.innerHTML || "");
  };

  const addLink = () => {
    const url = window.prompt("Enter the link URL");
    if (url) runCommand("createLink", url);
  };

  const ToolbarButton = ({ label, icon: Icon, onMouseDown }) => (
    <button
      type="button"
      title={label}
      aria-label={label}
      onMouseDown={(event) => {
        event.preventDefault();
        onMouseDown();
      }}
      className={toolbarButtonClass}
    >
      <Icon size={16} />
    </button>
  );

  return (
    <div>
      <div className={`overflow-hidden rounded-xl border bg-white ${error ? "border-danger" : "border-border-default focus-within:border-brand-teal focus-within:ring-4 focus-within:ring-brand-teal/10"}`}>
        <div className="flex flex-wrap items-center gap-0.5 border-b border-border-default bg-surface-subtle px-2 py-1.5">
          <ToolbarButton label="Undo" icon={Undo2} onMouseDown={() => runCommand("undo")} />
          <ToolbarButton label="Redo" icon={Redo2} onMouseDown={() => runCommand("redo")} />
          <span className="mx-1 h-5 w-px bg-border-default" />
          <ToolbarButton label="Bold" icon={Bold} onMouseDown={() => runCommand("bold")} />
          <ToolbarButton label="Italic" icon={Italic} onMouseDown={() => runCommand("italic")} />
          <ToolbarButton label="Underline" icon={Underline} onMouseDown={() => runCommand("underline")} />
          <span className="mx-1 h-5 w-px bg-border-default" />
          <ToolbarButton label="Bulleted list" icon={List} onMouseDown={() => runCommand("insertUnorderedList")} />
          <ToolbarButton label="Numbered list" icon={ListOrdered} onMouseDown={() => runCommand("insertOrderedList")} />
          <span className="mx-1 h-5 w-px bg-border-default" />
          <ToolbarButton label="Align left" icon={AlignLeft} onMouseDown={() => runCommand("justifyLeft")} />
          <ToolbarButton label="Align center" icon={AlignCenter} onMouseDown={() => runCommand("justifyCenter")} />
          <ToolbarButton label="Align right" icon={AlignRight} onMouseDown={() => runCommand("justifyRight")} />
          <span className="mx-1 h-5 w-px bg-border-default" />
          <ToolbarButton label="Add link" icon={Link} onMouseDown={addLink} />
          <ToolbarButton label="Remove link" icon={Unlink} onMouseDown={() => runCommand("unlink")} />
        </div>
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-multiline="true"
          data-placeholder="Write announcement details..."
          onInput={(event) => onChange(event.currentTarget.innerHTML)}
          onBlur={(event) => {
            onChange(event.currentTarget.innerHTML);
            onBlur?.();
          }}
          className="min-h-52 max-h-72 overflow-y-auto px-4 py-3 text-sm leading-6 text-brand-navy outline-none empty:before:pointer-events-none empty:before:text-neutral-400 empty:before:content-[attr(data-placeholder)] [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-brand-teal [&_a]:underline"
        />
      </div>
      {error && <p className="mt-1.5 text-xs font-medium text-danger">{error}</p>}
    </div>
  );
}
