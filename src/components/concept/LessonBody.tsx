import { Lightbulb, Terminal, AlertTriangle, BookOpen, Image as ImageIcon } from "lucide-react";
import type { Lesson, LessonExample } from "@/content/curriculum-types";

const VARIANT_STYLES: Record<
  NonNullable<LessonExample["variant"]>,
  { card: string; label: string; badge: string; text: string }
> = {
  before: {
    card: "border-l-4 border-(--bad) bg-(--bad)/5",
    label: "Before",
    badge: "bg-(--bad)/15 text-(--bad)",
    text: "text-(--bad)",
  },
  after: {
    card: "border-l-4 border-(--good) bg-(--good)/5",
    label: "After",
    badge: "bg-(--good)/15 text-(--good)",
    text: "text-(--good)",
  },
  neutral: {
    card: "border border-(--border) bg-(--panel-2)",
    label: "",
    badge: "",
    text: "text-(--accent-2)",
  },
};

/**
 * One worked example. Renders the prose caption (`body`) and, when the
 * curriculum supplies `code`, a monospace block beneath it. `variant`
 * ("before" / "after") frames anti-pattern → remedy pairs with a colored
 * accent + badge. Falls back to the original neutral card when no code or
 * variant is given, so packs that only use {title, body} are unaffected.
 */
function ExampleCard({ ex }: { ex: LessonExample }) {
  const v = VARIANT_STYLES[ex.variant ?? "neutral"];
  return (
    <div className={`my-3 rounded-md p-3 shadow-sm ${v.card}`}>
      <div className="mb-2 flex items-center gap-2">
        {v.label ? (
          <span
            className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${v.badge}`}
          >
            {v.label}
          </span>
        ) : null}
        <span className={`text-xs font-semibold uppercase tracking-wide ${v.text}`}>
          {ex.title}
        </span>
      </div>
      {ex.body ? <p className="whitespace-pre-wrap text-sm">{ex.body}</p> : null}
      {ex.code ? (
        <pre className="mt-2 overflow-x-auto rounded bg-(--ink)/[0.06] p-3 text-xs leading-relaxed dark:bg-black/30">
          {ex.lang ? (
            <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-(--muted)">
              {ex.lang}
            </span>
          ) : null}
          <code className="font-mono text-(--ink)">{ex.code}</code>
        </pre>
      ) : null}
    </div>
  );
}

export function LessonBody({ lesson }: { lesson: Lesson }) {
  return (
    <div className="text-(--ink)">
      {lesson.paragraphs.map((p, i) => (
        <p key={i} className="my-3 text-base leading-relaxed">
          {p}
        </p>
      ))}

      {lesson.keyPoints && lesson.keyPoints.length > 0 ? (
        <section
          id="key-points"
          aria-label="Key points"
          className="mt-6 scroll-mt-24 rounded-lg border border-(--border) bg-(--panel-2) p-4"
        >
          <h2 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-(--accent-2)">
            <Lightbulb className="h-3.5 w-3.5" aria-hidden />
            Key points
          </h2>
          <ul className="my-1 list-disc pl-5">
            {lesson.keyPoints.map((kp, i) => (
              <li key={i} className="my-1">
                {kp}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {lesson.examples && lesson.examples.length > 0 ? (
        <section
          id="examples"
          aria-label="Examples"
          className="mt-6 scroll-mt-24"
        >
          <h2 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-(--accent-2)">
            <Terminal className="h-3.5 w-3.5" aria-hidden />
            Examples
          </h2>
          {lesson.examples.map((ex, i) => (
            <ExampleCard key={i} ex={ex} />
          ))}
        </section>
      ) : null}

      {lesson.pitfalls && lesson.pitfalls.length > 0 ? (
        <section
          id="pitfalls"
          aria-label="Pitfalls"
          className="mt-6 scroll-mt-24 rounded-r-md border-l-4 border-(--bad) bg-(--bad)/8 p-3"
        >
          <h2 className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-(--bad)">
            <AlertTriangle className="h-3.5 w-3.5" aria-hidden />
            Pitfalls
          </h2>
          <ul className="list-disc pl-5">
            {lesson.pitfalls.map((p, i) => (
              <li key={i} className="my-1 text-sm">
                {p}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {lesson.imageDescriptions && lesson.imageDescriptions.length > 0 ? (
        <section
          aria-label="Image descriptions"
          className="mt-6 rounded-md border border-(--border) bg-(--panel-2) p-3"
        >
          <h2 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-(--accent-2)">
            <ImageIcon className="h-3.5 w-3.5" aria-hidden />
            Image descriptions
          </h2>
          <dl className="grid grid-cols-1 gap-2 text-sm">
            {lesson.imageDescriptions.map((d) => (
              <div key={d.ref} id={`img-desc-${d.ref}`} className="flex flex-col gap-0.5">
                <dt className="text-xs font-mono text-(--muted)">{d.ref}</dt>
                <dd className="text-sm text-(--ink)">{d.description}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      {lesson.notesRef ? (
        <p className="mt-6 border-t border-dashed border-(--border) pt-3 text-xs text-(--muted)">
          Source notes: <code>{lesson.notesRef}</code>
        </p>
      ) : null}
    </div>
  );
}

export function SimplifiedBody({
  simplified,
}: {
  simplified: NonNullable<Lesson["simplified"]>;
}) {
  return (
    <div id="lesson-easy-top" className="scroll-mt-24 text-(--ink)">
      {simplified.oneLiner ? (
        <p className="my-2 rounded-r-md border-l-4 border-(--accent) bg-(--panel-2) p-3 text-base leading-relaxed">
          {simplified.oneLiner}
        </p>
      ) : null}
      {simplified.analogy ? (
        <p className="my-3 text-base leading-relaxed">{simplified.analogy}</p>
      ) : null}
      {simplified.paragraphs?.map((p, i) => (
        <p key={i} className="my-3 text-base leading-relaxed">
          {p}
        </p>
      ))}
      {simplified.keyPoints && simplified.keyPoints.length > 0 ? (
        <section
          id="easy-takeaways"
          aria-label="Easy key points"
          className="mt-6 scroll-mt-24 rounded-lg border border-(--border) bg-(--panel-2) p-4"
        >
          <h2 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-(--accent-2)">
            <Lightbulb className="h-3.5 w-3.5" aria-hidden />
            Quick takeaways
          </h2>
          <ul className="my-1 list-disc pl-5">
            {simplified.keyPoints.map((kp, i) => (
              <li key={i} className="my-1">
                {kp}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

export function DeeperBody({
  deeper,
}: {
  deeper: NonNullable<Lesson["deeper"]>;
}) {
  return (
    <div id="lesson-deeper-top" className="scroll-mt-24 text-(--ink)">
      {deeper.oneLiner ? (
        <p className="my-2 rounded-r-md border-l-4 border-(--accent-2) bg-(--panel-2) p-3 text-base leading-relaxed">
          {deeper.oneLiner}
        </p>
      ) : null}

      {deeper.paragraphs?.map((p, i) => (
        <p key={i} className="my-3 text-base leading-relaxed">
          {p}
        </p>
      ))}

      {deeper.keyPoints && deeper.keyPoints.length > 0 ? (
        <section
          id="deeper-key-points"
          aria-label="Deeper key points"
          className="mt-6 scroll-mt-24 rounded-lg border border-(--border) bg-(--panel-2) p-4"
        >
          <h2 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-(--accent-2)">
            <Lightbulb className="h-3.5 w-3.5" aria-hidden />
            Deeper key points
          </h2>
          <ul className="my-1 list-disc pl-5">
            {deeper.keyPoints.map((kp, i) => (
              <li key={i} className="my-1">
                {kp}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {deeper.examples && deeper.examples.length > 0 ? (
        <section id="deeper-examples" aria-label="Advanced examples" className="mt-6 scroll-mt-24">
          <h2 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-(--accent-2)">
            <Terminal className="h-3.5 w-3.5" aria-hidden />
            Advanced examples
          </h2>
          {deeper.examples.map((ex, i) => (
            <ExampleCard key={i} ex={ex} />
          ))}
        </section>
      ) : null}

      {deeper.pitfalls && deeper.pitfalls.length > 0 ? (
        <section
          id="deeper-pitfalls"
          aria-label="Edge-case pitfalls"
          className="mt-6 scroll-mt-24 rounded-r-md border-l-4 border-(--bad) bg-(--bad)/8 p-3"
        >
          <h2 className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-(--bad)">
            <AlertTriangle className="h-3.5 w-3.5" aria-hidden />
            Edge-case pitfalls
          </h2>
          <ul className="list-disc pl-5">
            {deeper.pitfalls.map((p, i) => (
              <li key={i} className="my-1 text-sm">
                {p}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {deeper.furtherReading && deeper.furtherReading.length > 0 ? (
        <section
          id="deeper-reading"
          aria-label="Further reading"
          className="mt-6 scroll-mt-24 rounded-md border border-dashed border-(--border) p-3"
        >
          <h2 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-(--accent-2)">
            <BookOpen className="h-3.5 w-3.5" aria-hidden />
            Further reading
          </h2>
          <ul className="list-disc pl-5 text-sm">
            {deeper.furtherReading.map((link, i) => (
              <li key={i} className="my-1">
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-(--accent-2) underline"
                >
                  {link.title}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
