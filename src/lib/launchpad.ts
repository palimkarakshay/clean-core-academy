/* ------------------------------------------------------------------
   Launchpad — the once-off "make your own copy and run it" actions
   surfaced on the Start page: get the code, deploy, create the accounts
   you need, and wire up an AI assistant to drive the repo.

   Pure + data-driven so the Start page stays declarative and the URL
   building is unit-testable (external links can't be exercised in CI).
   Icon names are resolved to components in the renderer, keeping this
   module free of React / lucide.
------------------------------------------------------------------ */

export type LaunchIcon =
  | "vercel"
  | "git-fork"
  | "github"
  | "user-plus"
  | "sparkles"
  | "workflow"
  | "star"
  | "book";

export interface LaunchLink {
  label: string;
  href: string;
  desc: string;
  icon: LaunchIcon;
  /** Visually emphasise this as the group's main action. */
  primary?: boolean;
}

export interface LaunchGroup {
  id: string;
  title: string;
  blurb: string;
  links: LaunchLink[];
}

/** Normalise a GitHub repo URL (drop a trailing slash or `.git`). */
export function repoBase(repoUrl: string): string {
  return repoUrl.trim().replace(/\.git$/i, "").replace(/\/+$/, "");
}

/** One-click "clone this repo into your GitHub and deploy" URL. */
export function vercelDeployUrl(repoUrl: string): string {
  return `https://vercel.com/new/clone?repository-url=${encodeURIComponent(repoBase(repoUrl))}`;
}

export interface LaunchpadOptions {
  /** The template repository to fork / deploy (e.g. pack.config.repoUrl). */
  repoUrl?: string;
  /** The learner's preferred AI hand-off URL (e.g. pack.config.askAI). */
  aiUrl?: string;
}

/**
 * Build the grouped launchpad actions. Repo-specific links are included
 * only when a `repoUrl` is supplied, so a pack without a repo still gets
 * the account + AI actions.
 */
export function buildLaunchpad(opts: LaunchpadOptions = {}): LaunchGroup[] {
  const repo = opts.repoUrl ? repoBase(opts.repoUrl) : null;
  const aiUrl = opts.aiUrl || "https://claude.ai/new";

  const getCode: LaunchLink[] = [];
  if (repo) {
    getCode.push({
      label: "Deploy to Vercel",
      desc: "Clone this template into your GitHub and deploy it live in one flow.",
      href: vercelDeployUrl(repo),
      icon: "vercel",
      primary: true,
    });
    getCode.push({
      label: "Fork on GitHub",
      desc: "Make your own copy of the repository to edit.",
      href: `${repo}/fork`,
      icon: "git-fork",
    });
  }
  getCode.push({
    label: "New empty repo",
    desc: "Start a fresh GitHub repository from scratch.",
    href: "https://github.com/new",
    icon: "github",
  });

  const ai: LaunchLink[] = [
    {
      label: "Open Claude",
      desc: "Let Claude manage your repo — edits, commits, and pull requests.",
      href: aiUrl,
      icon: "sparkles",
      primary: true,
    },
    {
      label: "ChatGPT",
      desc: "Use your own ChatGPT login to plan and review changes.",
      href: "https://chatgpt.com",
      icon: "sparkles",
    },
    {
      label: "Gemini",
      desc: "Use your own Gemini login as a coding assistant.",
      href: "https://gemini.google.com",
      icon: "sparkles",
    },
  ];
  if (repo) {
    ai.push({
      label: "GitHub Actions",
      desc: "Wire CI/CD pipelines so your assistant ships through automation.",
      href: `${repo}/actions`,
      icon: "workflow",
    });
  }

  const groups: LaunchGroup[] = [
    {
      id: "get-code",
      title: "Get the code & deploy",
      blurb: "Spin up your own copy and put it on the web.",
      links: getCode,
    },
    {
      id: "accounts",
      title: "Need an account?",
      blurb: "Both are free, and enough to host and deploy.",
      links: [
        {
          label: "Create a GitHub account",
          desc: "Host your code and run Actions.",
          href: "https://github.com/signup",
          icon: "user-plus",
        },
        {
          label: "Create a Vercel account",
          desc: "Deploy and get a live URL in minutes.",
          href: "https://vercel.com/signup",
          icon: "user-plus",
        },
      ],
    },
    {
      id: "automate",
      title: "Automate with AI",
      blurb: "Bring your own assistant to drive the repo through pipelines.",
      links: ai,
    },
  ];

  if (repo) {
    groups.push({
      id: "make-yours",
      title: "Make it your own",
      blurb: "Customise the template and keep exploring the source.",
      links: [
        {
          label: "Star the repo",
          desc: "Bookmark it and follow updates.",
          href: repo,
          icon: "star",
        },
        {
          label: "Read the README",
          desc: "Run locally, set the content-pack, and customise branding.",
          href: `${repo}#readme`,
          icon: "book",
        },
      ],
    });
  }

  return groups;
}
