/** Renders `code` and **bold** spans; everything else is plain text. */
export default function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).map((part, i) => {
        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <code key={i} className="rounded-md bg-zinc-100 px-1.5 py-0.5 font-mono text-[0.9em] text-pink-600 dark:bg-zinc-800 dark:text-pink-400">
              {part.slice(1, -1)}
            </code>
          );
        }
        // Bold may contain `code`, so render its inside as rich text too
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i}>
              <Rich text={part.slice(2, -2)} />
            </strong>
          );
        }
        return part;
      })}
    </>
  );
}
