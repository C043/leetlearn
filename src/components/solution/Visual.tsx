import type { Cell, NTreeNode, Pointer, Tone, Visual as VisualSpec } from "@/content/solutions/types";

/* Shape + label classes per tone; Tailwind's fill/stroke utilities keep SVGs theme-aware. */
const SHAPE: Record<Tone | "base", string> = {
  base: "fill-white stroke-zinc-300 dark:fill-zinc-900 dark:stroke-zinc-600",
  accent: "fill-sky-100 stroke-sky-500 dark:fill-sky-950 dark:stroke-sky-400",
  good: "fill-emerald-100 stroke-emerald-500 dark:fill-emerald-950 dark:stroke-emerald-400",
  bad: "fill-rose-100 stroke-rose-500 dark:fill-rose-950 dark:stroke-rose-400",
  muted: "fill-zinc-100 stroke-zinc-200 dark:fill-zinc-800 dark:stroke-zinc-700",
};
const LABEL: Record<Tone | "base", string> = {
  base: "fill-zinc-700 dark:fill-zinc-200",
  accent: "fill-sky-800 dark:fill-sky-200",
  good: "fill-emerald-800 dark:fill-emerald-200",
  bad: "fill-rose-800 dark:fill-rose-200",
  muted: "fill-zinc-400 dark:fill-zinc-500",
};
const INK: Record<Tone | "base", string> = {
  base: "fill-zinc-500 stroke-zinc-500 dark:fill-zinc-400 dark:stroke-zinc-400",
  accent: "fill-sky-600 stroke-sky-600 dark:fill-sky-400 dark:stroke-sky-400",
  good: "fill-emerald-600 stroke-emerald-600 dark:fill-emerald-400 dark:stroke-emerald-400",
  bad: "fill-rose-600 stroke-rose-600 dark:fill-rose-400 dark:stroke-rose-400",
  muted: "fill-zinc-400 stroke-zinc-400 dark:fill-zinc-600 dark:stroke-zinc-600",
};
const LINE = "stroke-zinc-400 dark:stroke-zinc-500";
const FAINT = "fill-zinc-400 dark:fill-zinc-500";

function toneOf<T>(tones: Partial<Record<Tone, T[]>> | undefined, match: (t: T) => boolean) {
  if (!tones) return "base" as const;
  for (const tone of ["bad", "good", "accent", "muted"] as const) {
    if (tones[tone]?.some(match)) return tone;
  }
  return "base" as const;
}

const textWidth = (s: Cell) => String(s).length * 8.5;

function Frame({ width, height, children }: { width: number; height: number; children: React.ReactNode }) {
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      style={{ maxWidth: width }}
      className="h-auto font-sans"
      fontFamily="inherit"
      role="img"
    >
      {children}
    </svg>
  );
}

function Box({
  x, y, w, h, tone = "base", label, rx = 8, size = 15,
}: {
  x: number; y: number; w: number; h: number; tone?: Tone | "base"; label: Cell; rx?: number; size?: number;
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={rx} strokeWidth={2} className={SHAPE[tone]} />
      <text
        x={x + w / 2}
        y={y + h / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={size}
        fontWeight={700}
        className={LABEL[tone]}
      >
        {label}
      </text>
    </g>
  );
}

/** Upward arrows with stacked labels under the given column centers. */
function Pointers({ pointers, centerOf, y }: { pointers: Pointer[]; centerOf: (i: number) => number; y: number }) {
  const seen = new Map<number, number>();
  return (
    <>
      {pointers.map((p, k) => {
        const slot = seen.get(p.at) ?? 0;
        seen.set(p.at, slot + 1);
        const cx = centerOf(p.at);
        const tone = p.tone ?? "accent";
        return (
          <g key={k}>
            {slot === 0 && <path d={`M${cx} ${y + 2} l-6 9 h12 z`} className={INK[tone]} />}
            <text
              x={cx}
              y={y + 24 + slot * 15}
              textAnchor="middle"
              fontSize={12}
              fontWeight={800}
              className={INK[tone]}
              strokeWidth={0}
            >
              {p.label}
            </text>
          </g>
        );
      })}
    </>
  );
}

function pointerDepth(pointers: Pointer[] | undefined) {
  if (!pointers?.length) return 0;
  const counts = new Map<number, number>();
  for (const p of pointers) counts.set(p.at, (counts.get(p.at) ?? 0) + 1);
  return 18 + Math.max(...counts.values()) * 15;
}

function ArrayVisual({ v }: { v: Extract<VisualSpec, { kind: "array" }> }) {
  const cw = Math.max(40, ...v.values.map((s) => textWidth(s) + 16));
  const gap = 4;
  const pad = 8;
  const showIdx = v.indices ?? true;
  const top = pad + (v.window ? 16 : 0) + (showIdx ? 16 : 0);
  const h = 40;
  const width = pad * 2 + v.values.length * (cw + gap) - gap;
  const height = top + h + pointerDepth(v.pointers) + pad;
  const xOf = (i: number) => pad + i * (cw + gap);

  return (
    <Frame width={width} height={height}>
      {v.window && (
        <path
          d={`M${xOf(v.window[0])} ${pad + 12} v-6 H${xOf(v.window[1]) + cw} v6`}
          fill="none"
          strokeWidth={2.5}
          className={INK.good}
        />
      )}
      {v.values.map((val, i) => (
        <g key={i}>
          {showIdx && (
            <text x={xOf(i) + cw / 2} y={top - 5} textAnchor="middle" fontSize={10} className={FAINT}>
              {i}
            </text>
          )}
          <Box x={xOf(i)} y={top} w={cw} h={h} label={val} tone={toneOf(v.tones, (t) => t === i)} />
        </g>
      ))}
      {v.pointers && <Pointers pointers={v.pointers} centerOf={(i) => xOf(i) + cw / 2} y={top + h} />}
    </Frame>
  );
}

function GridVisual({ v }: { v: Extract<VisualSpec, { kind: "grid" }> }) {
  const cols = Math.max(...v.rows.map((r) => r.length), v.colLabels?.length ?? 0);
  const cs = Math.max(34, ...v.rows.flat().map((s) => textWidth(s) + 12), ...(v.colLabels ?? []).map((s) => textWidth(s) + 8));
  const gap = 3;
  const pad = 6;
  const left = pad + (v.rowLabels ? Math.max(...v.rowLabels.map(textWidth)) + 10 : 0);
  const top = pad + (v.colLabels ? 18 : 0);
  const width = left + cols * (cs + gap) - gap + pad;
  const height = top + v.rows.length * (cs + gap) - gap + pad;

  return (
    <Frame width={width} height={height}>
      {v.colLabels?.map((l, c) => (
        <text key={c} x={left + c * (cs + gap) + cs / 2} y={top - 6} textAnchor="middle" fontSize={11} fontWeight={700} className={FAINT}>
          {l}
        </text>
      ))}
      {v.rows.map((row, r) => (
        <g key={r}>
          {v.rowLabels?.[r] !== undefined && (
            <text x={left - 8} y={top + r * (cs + gap) + cs / 2} textAnchor="end" dominantBaseline="central" fontSize={11} fontWeight={700} className={FAINT}>
              {v.rowLabels[r]}
            </text>
          )}
          {row.map((cell, c) => (
            <Box
              key={c}
              x={left + c * (cs + gap)}
              y={top + r * (cs + gap)}
              w={cs}
              h={cs}
              rx={5}
              size={13}
              label={cell}
              tone={toneOf(v.tones, ([tr, tc]) => tr === r && tc === c)}
            />
          ))}
        </g>
      ))}
    </Frame>
  );
}

function TreeVisual({ v }: { v: Extract<VisualSpec, { kind: "tree" }> }) {
  const r = Math.max(17, ...v.values.map((s) => (s === null ? 0 : textWidth(s) / 2 + 6)));
  let last = v.values.length - 1;
  while (last > 0 && v.values[last] === null) last--;
  const depth = Math.floor(Math.log2(last + 1));
  const slot = 2 * r + 8;
  const width = Math.max(2 ** depth * slot, 4 * r);
  const levelH = 62;
  const height = depth * levelH + 2 * r + 12;
  const pos = (i: number) => {
    const d = Math.floor(Math.log2(i + 1));
    const p = i - (2 ** d - 1);
    return { x: ((p + 0.5) * width) / 2 ** d, y: r + 6 + d * levelH };
  };
  const nodes = v.values.flatMap((val, i) => (val === null || i > last ? [] : [{ i, val, ...pos(i) }]));

  return (
    <Frame width={width} height={height}>
      {nodes.map(({ i, x, y }) => {
        if (i === 0) return null;
        const parent = Math.floor((i - 1) / 2);
        if (v.values[parent] === null || v.values[parent] === undefined) return null;
        const pp = pos(parent);
        return <line key={`e${i}`} x1={pp.x} y1={pp.y} x2={x} y2={y} strokeWidth={2} className={LINE} />;
      })}
      {nodes.map(({ i, val, x, y }) => {
        const tone = toneOf(v.tones, (t) => t === i);
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={r} strokeWidth={2} className={SHAPE[tone]} />
            <text x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize={14} fontWeight={700} className={LABEL[tone]}>
              {val}
            </text>
          </g>
        );
      })}
    </Frame>
  );
}

interface Placed {
  node: NTreeNode;
  x: number;
  y: number;
  w: number;
  children: Placed[];
}

function NTreeVisual({ v }: { v: Extract<VisualSpec, { kind: "ntree" }> }) {
  const levelH = 66;
  const h = 30;
  const gap = 10;
  const nodeW = (n: NTreeNode) => Math.max(34, textWidth(n.label) + 16);
  const span = (n: NTreeNode): number => {
    const kids = n.children ?? [];
    const own = Math.max(nodeW(n), ...kids.map((k) => (k.edge ? textWidth(k.edge) * 0.8 + 8 : 0)));
    if (!kids.length) return own;
    return Math.max(own, kids.reduce((s, k) => s + span(k), 0) + gap * (kids.length - 1));
  };
  const place = (n: NTreeNode, left: number, depth: number): Placed => {
    const total = span(n);
    const kids = n.children ?? [];
    const kidsW = kids.reduce((s, k) => s + span(k), 0) + gap * Math.max(0, kids.length - 1);
    let cursor = left + (total - kidsW) / 2;
    const children = kids.map((k) => {
      const placed = place(k, cursor, depth + 1);
      cursor += span(k) + gap;
      return placed;
    });
    return { node: n, x: left + total / 2, y: 6 + depth * levelH, w: nodeW(n), children };
  };
  const root = place(v.root, 6, 0);
  const all: Placed[] = [];
  const walk = (p: Placed) => {
    all.push(p);
    p.children.forEach(walk);
  };
  walk(root);
  const width = span(v.root) + 12;
  const height = Math.max(...all.map((p) => p.y)) + h + 6;

  return (
    <Frame width={width} height={height}>
      {all.flatMap((p) =>
        p.children.map((c, k) => (
          <g key={`${p.x}-${p.y}-${k}`}>
            <line x1={p.x} y1={p.y + h} x2={c.x} y2={c.y} strokeWidth={2} className={LINE} />
            {c.node.edge && (
              <text
                x={(p.x + c.x) / 2 + (c.x < p.x ? -4 : c.x > p.x ? 4 : 6)}
                y={(p.y + h + c.y) / 2}
                textAnchor={c.x < p.x ? "end" : "start"}
                dominantBaseline="central"
                fontSize={11}
                fontWeight={700}
                className={INK.accent}
                strokeWidth={0}
              >
                {c.node.edge}
              </text>
            )}
          </g>
        )),
      )}
      {all.map((p, i) => (
        <Box key={i} x={p.x - p.w / 2} y={p.y} w={p.w} h={h} rx={h / 2} size={13} label={p.node.label} tone={p.node.tone ?? "base"} />
      ))}
    </Frame>
  );
}

function ListVisual({ v }: { v: Extract<VisualSpec, { kind: "list" }> }) {
  const bw = Math.max(40, ...v.values.map((s) => textWidth(s) + 16));
  const arrow = 26;
  const pad = 8;
  const top = pad + (v.cycleTo !== undefined ? 26 : 0);
  const h = 36;
  const width = pad * 2 + v.values.length * (bw + arrow) - arrow + (v.cycleTo === undefined ? arrow + 22 : 0);
  const height = top + h + pointerDepth(v.pointers) + pad;
  const xOf = (i: number) => pad + i * (bw + arrow);
  const lastX = xOf(v.values.length - 1);

  return (
    <Frame width={width} height={height}>
      {v.values.map((val, i) => (
        <g key={i}>
          <Box x={xOf(i)} y={top} w={bw} h={h} label={val} tone={toneOf(v.tones, (t) => t === i)} />
          {i < v.values.length - 1 && (
            <g className={INK.base}>
              <line x1={xOf(i) + bw + 3} y1={top + h / 2} x2={xOf(i + 1) - 7} y2={top + h / 2} strokeWidth={2} />
              <path d={`M${xOf(i + 1) - 3} ${top + h / 2} l-7 -5 v10 z`} strokeWidth={0} />
            </g>
          )}
        </g>
      ))}
      {v.cycleTo === undefined ? (
        <g className={INK.base}>
          <line x1={lastX + bw + 3} y1={top + h / 2} x2={lastX + bw + arrow - 4} y2={top + h / 2} strokeWidth={2} />
          <text x={lastX + bw + arrow} y={top + h / 2} dominantBaseline="central" fontSize={13} fontWeight={700} strokeWidth={0}>
            ∅
          </text>
        </g>
      ) : (
        <g className={INK.bad}>
          <path
            d={`M${lastX + bw / 2} ${top} V${pad + 4} H${xOf(v.cycleTo) + bw / 2} V${top - 8}`}
            fill="none"
            strokeWidth={2}
          />
          <path d={`M${xOf(v.cycleTo) + bw / 2} ${top - 1} l-5 -8 h10 z`} strokeWidth={0} />
        </g>
      )}
      {v.pointers && <Pointers pointers={v.pointers} centerOf={(i) => xOf(i) + bw / 2} y={top + h} />}
    </Frame>
  );
}

function GraphVisual({ v }: { v: Extract<VisualSpec, { kind: "graph" }> }) {
  const r = Math.max(18, ...v.nodes.map((n) => textWidth(n.id) / 2 + 7));
  const unit = 78;
  const placed = v.nodes.every((n) => n.x !== undefined && n.y !== undefined);
  const ring = Math.max(70, (v.nodes.length * (2 * r + 20)) / (2 * Math.PI));
  const coords = new Map(
    v.nodes.map((n, i) => {
      if (placed) return [n.id, { x: n.x! * unit + r + 6, y: n.y! * unit + r + 6 }];
      const a = (2 * Math.PI * i) / v.nodes.length - Math.PI / 2;
      return [n.id, { x: ring + r + 6 + ring * Math.cos(a), y: ring + r + 6 + ring * Math.sin(a) }];
    }),
  );
  const xs = [...coords.values()].map((p) => p.x);
  const ys = [...coords.values()].map((p) => p.y);
  const width = Math.max(...xs) + r + 6;
  const height = Math.max(...ys) + r + 6;

  return (
    <Frame width={width} height={height}>
      {v.edges.map(([a, b], k) => {
        const p = coords.get(a);
        const q = coords.get(b);
        if (!p || !q) return null;
        const len = Math.hypot(q.x - p.x, q.y - p.y) || 1;
        const ux = (q.x - p.x) / len;
        const uy = (q.y - p.y) / len;
        const x1 = p.x + ux * r;
        const y1 = p.y + uy * r;
        const x2 = q.x - ux * (r + (v.directed ? 2 : 0));
        const y2 = q.y - uy * (r + (v.directed ? 2 : 0));
        return (
          <g key={k} className={INK.base}>
            <line x1={x1} y1={y1} x2={x2 - (v.directed ? ux * 8 : 0)} y2={y2 - (v.directed ? uy * 8 : 0)} strokeWidth={2} />
            {v.directed && (
              <path
                d={`M${x2} ${y2} L${x2 - ux * 10 - uy * 5} ${y2 - uy * 10 + ux * 5} L${x2 - ux * 10 + uy * 5} ${y2 - uy * 10 - ux * 5} z`}
                strokeWidth={0}
              />
            )}
          </g>
        );
      })}
      {v.nodes.map((n) => {
        const p = coords.get(n.id)!;
        const tone = n.tone ?? "base";
        return (
          <g key={n.id}>
            <circle cx={p.x} cy={p.y} r={r} strokeWidth={2} className={SHAPE[tone]} />
            <text x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central" fontSize={13} fontWeight={700} className={LABEL[tone]}>
              {n.id}
            </text>
          </g>
        );
      })}
    </Frame>
  );
}

function IntervalsVisual({ v }: { v: Extract<VisualSpec, { kind: "intervals" }> }) {
  const lo = Math.min(...v.items.map((i) => i.start));
  const hi = Math.max(...v.items.map((i) => i.end));
  const range = Math.max(1, hi - lo);
  const scale = Math.min(48, Math.max(16, 520 / range));
  const pad = 14;
  const rowH = 30;
  const width = pad * 2 + range * scale;
  const axisY = pad + v.items.length * rowH + 4;
  const height = axisY + 24;
  const xOf = (n: number) => pad + (n - lo) * scale;
  const step = range <= 20 ? 1 : Math.ceil(range / 20);
  const ticks: number[] = [];
  for (let t = lo; t <= hi; t += step) ticks.push(t);

  return (
    <Frame width={width} height={height}>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={xOf(t)} y1={pad - 4} x2={xOf(t)} y2={axisY} strokeWidth={1} strokeDasharray="2 4" className={LINE} />
          <text x={xOf(t)} y={axisY + 14} textAnchor="middle" fontSize={10} className={FAINT}>
            {t}
          </text>
        </g>
      ))}
      <line x1={pad} y1={axisY} x2={width - pad} y2={axisY} strokeWidth={2} className={LINE} />
      {v.items.map((it, k) => {
        const tone = it.tone ?? "accent";
        const w = Math.max(6, (it.end - it.start) * scale);
        const y = pad + k * rowH;
        const label = it.label ?? `[${it.start},${it.end}]`;
        const inside = textWidth(label) * 0.8 + 8 < w;
        return (
          <g key={k}>
            <rect x={xOf(it.start)} y={y} width={w} height={20} rx={10} strokeWidth={2} className={SHAPE[tone]} />
            <text
              x={inside ? xOf(it.start) + w / 2 : xOf(it.start) + w + 6}
              y={y + 10}
              textAnchor={inside ? "middle" : "start"}
              dominantBaseline="central"
              fontSize={11}
              fontWeight={700}
              className={LABEL[tone]}
            >
              {label}
            </text>
          </g>
        );
      })}
    </Frame>
  );
}

function BarsVisual({ v }: { v: Extract<VisualSpec, { kind: "bars" }> }) {
  const totals = v.values.map((b, i) => b + (v.water?.[i] ?? 0));
  const max = Math.max(1, ...totals);
  const unit = Math.min(26, 150 / max);
  const bw = 30;
  const gap = 4;
  const pad = 8;
  const base = pad + max * unit;
  const width = pad * 2 + v.values.length * (bw + gap) - gap;
  const height = base + 18 + pointerDepth(v.pointers) + pad;
  const xOf = (i: number) => pad + i * (bw + gap);

  return (
    <Frame width={width} height={height}>
      {v.values.map((b, i) => {
        const tone = toneOf(v.tones, (t) => t === i);
        const water = v.water?.[i] ?? 0;
        return (
          <g key={i}>
            {water > 0 && (
              <rect x={xOf(i)} y={base - (b + water) * unit} width={bw} height={water * unit} className="fill-sky-300/70 dark:fill-sky-500/50" />
            )}
            {b > 0 && (
              <rect x={xOf(i)} y={base - b * unit} width={bw} height={b * unit} rx={3} strokeWidth={2} className={SHAPE[tone === "base" ? "muted" : tone]} />
            )}
            <text x={xOf(i) + bw / 2} y={base + 13} textAnchor="middle" fontSize={11} fontWeight={700} className={LABEL[tone]}>
              {b}
            </text>
          </g>
        );
      })}
      <line x1={pad - 2} y1={base} x2={width - pad + 2} y2={base} strokeWidth={2} className={LINE} />
      {v.pointers && <Pointers pointers={v.pointers} centerOf={(i) => xOf(i) + bw / 2} y={base + 18} />}
    </Frame>
  );
}

function StackVisual({ v }: { v: Extract<VisualSpec, { kind: "stack" }> }) {
  const bw = Math.max(64, ...v.items.map((s) => textWidth(s) + 20));
  const h = 32;
  const gap = 4;
  const pad = 8;
  const n = Math.max(1, v.items.length);
  const width = pad * 2 + bw + 44;
  const height = pad * 2 + n * (h + gap) + 6;
  const yOf = (i: number) => pad + (n - 1 - i) * (h + gap);

  return (
    <Frame width={width} height={height}>
      <path
        d={`M${pad - 3} ${pad} V${height - pad} H${pad + bw + 3} V${pad}`}
        fill="none"
        strokeWidth={2.5}
        className={LINE}
      />
      {v.items.length === 0 && (
        <text x={pad + bw / 2} y={height / 2} textAnchor="middle" dominantBaseline="central" fontSize={12} className={FAINT}>
          empty
        </text>
      )}
      {v.items.map((item, i) => (
        <Box key={i} x={pad} y={yOf(i)} w={bw} h={h} rx={6} label={item} tone={toneOf(v.tones, (t) => t === i)} />
      ))}
      {v.items.length > 0 && (
        <text x={pad + bw + 10} y={yOf(v.items.length - 1) + h / 2} dominantBaseline="central" fontSize={11} fontWeight={800} className={INK.accent} strokeWidth={0}>
          ← top
        </text>
      )}
    </Frame>
  );
}

export default function Visual({ visual }: { visual: VisualSpec }) {
  let body: React.ReactNode;
  switch (visual.kind) {
    case "array": body = <ArrayVisual v={visual} />; break;
    case "grid": body = <GridVisual v={visual} />; break;
    case "tree": body = <TreeVisual v={visual} />; break;
    case "ntree": body = <NTreeVisual v={visual} />; break;
    case "list": body = <ListVisual v={visual} />; break;
    case "graph": body = <GraphVisual v={visual} />; break;
    case "intervals": body = <IntervalsVisual v={visual} />; break;
    case "bars": body = <BarsVisual v={visual} />; break;
    case "stack": body = <StackVisual v={visual} />; break;
  }
  return (
    <figure className="my-3 rounded-2xl border-2 border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex justify-center overflow-x-auto">{body}</div>
      {visual.caption && (
        <figcaption className="mt-3 text-center text-xs font-semibold text-zinc-500">{visual.caption}</figcaption>
      )}
    </figure>
  );
}
