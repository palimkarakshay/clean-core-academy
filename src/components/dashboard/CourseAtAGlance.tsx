import type { Curriculum } from "@/content/curriculum-types";
import { courseStats } from "@/lib/course-stats";
import { formatMinutes } from "@/content/curriculum-loader";

/** Refined metric tile — uppercase tracked label + large mono value. */
function Metric({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-lg border border-(--border) bg-(--panel-2) p-4">
      <div className="text-[11px] font-medium uppercase tracking-[0.1em] text-(--muted)">
        {label}
      </div>
      <div className="mt-1.5 font-mono text-2xl font-medium tracking-tight text-(--ink) tabular-nums">
        {value}
      </div>
      {sub ? (
        <div className="mt-1 font-mono text-[11px] text-(--muted)">{sub}</div>
      ) : null}
    </div>
  );
}

/**
 * Static overview of the whole course's scope, shown on the Start page.
 * Server component — purely derived from the curriculum.
 */
export function CourseAtAGlance({
  curriculum,
  totalMinutes,
}: {
  curriculum: Curriculum;
  totalMinutes: number;
}) {
  const s = courseStats(curriculum);
  const metrics: { label: string; value: string; sub?: string }[] = [
    { label: "Modules", value: String(s.modules) },
    { label: "Lessons", value: String(s.lessons) },
    {
      label: "Hands-on",
      value: String(s.exercises),
      sub: s.exercises === 1 ? "exercise" : "exercises",
    },
    { label: "Quiz questions", value: String(s.quizQuestions) },
    {
      label: "Practice exam",
      value: String(s.mockExams),
      sub: s.mockExams === 1 ? "timed mock" : "timed mocks",
    },
    s.hasAudit
      ? { label: "Readiness audit", value: String(s.auditQuestions), sub: "checks" }
      : { label: "Practice", value: String(s.quizQuestions), sub: "questions" },
    totalMinutes > 0
      ? { label: "Est. time", value: formatMinutes(totalMinutes), sub: "read & try" }
      : { label: "Self-paced", value: "—" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {metrics.map((m) => (
        <Metric key={m.label} {...m} />
      ))}
    </div>
  );
}
