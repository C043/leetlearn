import CopyButton from "./CopyButton";

const KEYWORDS = new Set([
  "and", "as", "break", "class", "continue", "def", "del", "elif", "else", "for", "from", "if", "import",
  "in", "is", "lambda", "nonlocal", "not", "or", "pass", "return", "while", "yield", "True", "False", "None",
]);

/* Comments, strings (incl. f-strings), numbers and identifiers; everything else passes through. */
const TOKEN = /(#.*)|([fr]?"(?:[^"\\]|\\.)*"|[fr]?'(?:[^'\\]|\\.)*')|(\b0[xb][\dA-Fa-f]+\b|\b\d[\d_]*(?:\.\d+)?\b)|([A-Za-z_]\w*)/g;

function highlight(code: string) {
  const out: React.ReactNode[] = [];
  let last = 0;
  let prev = "";
  for (const m of code.matchAll(TOKEN)) {
    if (m.index > last) out.push(code.slice(last, m.index));
    const [text, comment, string, number, word] = m;
    let cls: string | undefined;
    if (comment) cls = "text-zinc-500 italic";
    else if (string) cls = "text-emerald-300";
    else if (number) cls = "text-amber-300";
    else if (word && KEYWORDS.has(word)) cls = "text-pink-400";
    else if (word && (prev === "def" || prev === "class")) cls = "text-sky-300";
    else if (word === "self") cls = "text-violet-300";
    out.push(cls ? <span key={m.index} className={cls}>{text}</span> : text);
    if (word) prev = word;
    last = m.index + text.length;
  }
  out.push(code.slice(last));
  return out;
}

export default function CodeBlock({ code }: { code: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border-2 border-zinc-800 bg-zinc-900">
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2">
        <span className="text-xs font-extrabold uppercase tracking-wider text-zinc-400">Python</span>
        <CopyButton text={code} />
      </div>
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed text-zinc-100">
        <code className="font-mono">{highlight(code)}</code>
      </pre>
    </div>
  );
}
