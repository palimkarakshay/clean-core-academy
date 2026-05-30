import { describe, expect, it } from "vitest";
import { CURRICULUM } from "@/content/curriculum";

/**
 * Module artwork is now themed Lucide icon *names* (resolved to crisp
 * vector icons in the shell) rather than runtime-fetched AI images, so
 * a slow/blocked CDN can never blank a module tile. The contract: every
 * section carries an icon name and no remote image URL.
 */
describe("module imagery (themed icons)", () => {
  it("every section has a themed icon name", () => {
    for (const s of CURRICULUM.sections) {
      expect(s.icon, `icon for ${s.id}`).toBeTruthy();
      expect(typeof s.icon).toBe("string");
    }
  });

  it("ships no runtime external image URLs on sections", () => {
    for (const s of CURRICULUM.sections) {
      expect(
        s.iconImagePath,
        `${s.id} should not carry a remote iconImagePath`
      ).toBeUndefined();
    }
  });
});
