import type { Lesson, LessonDepth } from "@/content/curriculum-types";

export interface TocItem {
  id: string;
  label: string;
}

/**
 * The table-of-contents anchors for a lesson at a given depth. Each
 * depth's body emits matching `id`s (see LessonBody): the conceptual
 * body anchors key-points / examples / pitfalls; the easy and deeper
 * bodies anchor a top "Overview" plus whatever sections they populate.
 * Easy and deeper always return at least the Overview anchor so the
 * rail stays present when the learner switches depth.
 */
export function lessonTocItems(lesson: Lesson, depth: LessonDepth): TocItem[] {
  if (depth === "easy") {
    const items: TocItem[] = [{ id: "lesson-easy-top", label: "Overview" }];
    if (lesson.simplified?.keyPoints && lesson.simplified.keyPoints.length > 0) {
      items.push({ id: "easy-takeaways", label: "Quick takeaways" });
    }
    return items;
  }

  if (depth === "deeper") {
    const d = lesson.deeper;
    const items: TocItem[] = [{ id: "lesson-deeper-top", label: "Overview" }];
    if (d?.keyPoints && d.keyPoints.length > 0) {
      items.push({ id: "deeper-key-points", label: "Key points" });
    }
    if (d?.examples && d.examples.length > 0) {
      items.push({ id: "deeper-examples", label: "Examples" });
    }
    if (d?.pitfalls && d.pitfalls.length > 0) {
      items.push({ id: "deeper-pitfalls", label: "Edge cases" });
    }
    if (d?.furtherReading && d.furtherReading.length > 0) {
      items.push({ id: "deeper-reading", label: "Further reading" });
    }
    return items;
  }

  const items: TocItem[] = [];
  if (lesson.keyPoints && lesson.keyPoints.length > 0) {
    items.push({ id: "key-points", label: "Key points" });
  }
  if (lesson.examples && lesson.examples.length > 0) {
    items.push({ id: "examples", label: "Examples" });
  }
  if (lesson.pitfalls && lesson.pitfalls.length > 0) {
    items.push({ id: "pitfalls", label: "Pitfalls" });
  }
  return items;
}

/**
 * Lesson table-of-contents rail. Renders for every depth (the anchors
 * are depth-specific, so switching to Easy or Deeper keeps the left
 * panel in place rather than collapsing the layout). Renders nothing
 * only when there are genuinely no anchored sections.
 */
export function LessonTOC({
  lesson,
  depth,
}: {
  lesson: Lesson;
  depth: LessonDepth;
}) {
  const items = lessonTocItems(lesson, depth);
  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Lesson contents"
      className="hidden text-xs lg:block lg:sticky lg:top-6"
    >
      <h2 className="mb-2 font-semibold uppercase tracking-wide text-(--muted)">
        On this page
      </h2>
      <ol className="flex flex-col gap-1">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="block rounded-md px-2 py-1 text-(--muted) no-underline transition-colors hover:bg-(--panel-2) hover:text-(--ink)"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
