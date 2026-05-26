import { describe, expect, it } from "vitest";
import { CURRICULUM } from "@/content/curriculum";
import { pack } from "../../content-packs/clean-core-academy";

const POLLINATIONS = /^https:\/\/image\.pollinations\.ai\/prompt\/.+seed=\d+/;

describe("module + hero imagery", () => {
  it("every section has a deterministic Pollinations thumbnail URL", () => {
    for (const s of CURRICULUM.sections) {
      expect(s.iconImagePath, `iconImagePath for ${s.id}`).toBeDefined();
      expect(s.iconImagePath as string).toMatch(POLLINATIONS);
    }
  });

  it("the pack config carries a Pollinations hero image", () => {
    expect(pack.config.heroImagePath).toBeDefined();
    expect(pack.config.heroImagePath as string).toMatch(POLLINATIONS);
  });

  it("thumbnail URLs are unique per section (distinct seeds/prompts)", () => {
    const urls = CURRICULUM.sections.map((s) => s.iconImagePath as string);
    expect(new Set(urls).size).toBe(urls.length);
  });
});
