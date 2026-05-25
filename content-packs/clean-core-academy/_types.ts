/* ------------------------------------------------------------------
   Pack-local re-export of the contract types.

   This is the only file in the pack that touches the shell (`@/*`
   alias). Every other pack file imports its types from `./_types`, so
   the whole folder can be lifted into its own repo by replacing just
   this file. See `content-packs/README.md` § "Cross-repo extraction".
------------------------------------------------------------------ */

export type {
  ContentPack,
  PackConfig,
  PackCopy,
  MasteryLevel,
  NavIcon,
  NavItem,
  AskAIConfig,
  PackTheme,
  PackPrerequisites,
  PackPrerequisiteItem,
} from "@/content/pack-types";

export type {
  Curriculum,
  Section,
  Concept,
  CodeExercise,
  Lesson,
  LessonDeeper,
  LessonDepth,
  LessonExample,
  LessonSimplified,
  LessonStatus,
  Quiz,
  Question,
  QuestionBase,
  MCQQuestion,
  TrueFalseQuestion,
  FillInQuestion,
  SectionTest,
  MockExam,
  ReadinessAudit,
  ReadinessAuditQuestion,
  ScoreBand,
  Bloom,
  OptionLetter,
} from "@/content/curriculum-types";
