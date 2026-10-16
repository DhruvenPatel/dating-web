import { useRef, useState, type ChangeEvent, type KeyboardEvent } from "react";
import { Paperclip, SendHorizontal } from "lucide-react";
import { CHAT_ACCEPT } from "../media";

interface ComposerProps {
  disabled?: boolean;
  onSendText: (text: string) => void;
  onSendFile: (file: File) => void;
}

const MAX_LENGTH = 5000; // backend limit

export function Composer({ disabled, onSendText, onSendFile }: ComposerProps) {
  const [text, setText] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const areaRef = useRef<HTMLTextAreaElement>(null);

  const resize = () => {
    const el = areaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
  };

  const submit = () => {
    const value = text.trim();
    if (!value || disabled) return;
    onSendText(value);
    setText("");
    requestAnimationFrame(resize);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter sends, Shift+Enter adds a new line (ignored while using an IME).
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      submit();
    }
  };

  const handleFiles = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    files.forEach(onSendFile);
  };

  return (
    <div className="border-t p-3">
      <div className="flex items-end gap-2">
        <button
          onClick={() => fileRef.current?.click()}
          disabled={disabled}
          aria-label="Attach photo or video"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border bg-card text-muted-foreground transition hover:text-foreground disabled:opacity-60"
        >
          <Paperclip size={18} />
        </button>
        <input
          ref={fileRef}
          type="file"
          accept={CHAT_ACCEPT}
          multiple
          hidden
          onChange={handleFiles}
        />

        <textarea
          ref={areaRef}
          value={text}
          rows={1}
          maxLength={MAX_LENGTH}
          disabled={disabled}
          placeholder="Type a message..."
          onChange={(e) => {
            setText(e.target.value);
            resize();
          }}
          onKeyDown={handleKeyDown}
          className="max-h-36 min-h-11 flex-1 resize-none rounded-lg border bg-background px-3.5 py-2.5 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
        />

        <button
          onClick={submit}
          disabled={disabled || !text.trim()}
          aria-label="Send message"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
        >
          <SendHorizontal size={18} />
        </button>
      </div>
      {text.length > MAX_LENGTH - 500 && (
        <p className="mt-1 text-right text-[11px] text-muted-foreground">
          {text.length}/{MAX_LENGTH}
        </p>
      )}
    </div>
  );
}