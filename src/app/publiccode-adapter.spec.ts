import PublicCode from "./contents/publiccode";
import publicCodeAdapter from "./publiccode-adapter";

const minimalDefaultValues: Partial<PublicCode> = {
  maintenance: { type: "internal" },
};

describe("publiccode-adapter", () => {
  describe("maintenance normalization (issue #438)", () => {
    it("should clear contractors when maintenance.type is internal", () => {
      const publicCode = {
        maintenance: {
          type: "internal",
          contacts: [{ name: "Team" }],
          contractors: [{ name: "Acme", until: "2025-12-31" }],
        },
      } as unknown as PublicCode;

      const result = publicCodeAdapter({
        defaultValues: minimalDefaultValues,
        publicCode,
      });

      expect(result.maintenance?.type).toBe("internal");
      expect(result.maintenance?.contacts).toHaveLength(1);
      expect(result.maintenance?.contractors).toBeUndefined();
    });

    it("should clear contractors when maintenance.type is community", () => {
      const publicCode = {
        maintenance: {
          type: "community",
          contacts: [{ name: "Community" }],
          contractors: [{ name: "Acme" }],
        },
      } as unknown as PublicCode;

      const result = publicCodeAdapter({
        defaultValues: minimalDefaultValues,
        publicCode,
      });

      expect(result.maintenance?.contractors).toBeUndefined();
      expect(result.maintenance?.contacts).toHaveLength(1);
    });

    it("should keep contacts when maintenance.type is contract (contacts optional)", () => {
      const publicCode = {
        maintenance: {
          type: "contract",
          contacts: [{ name: "Internal" }],
          contractors: [{ name: "Acme", until: "2025-12-31" }],
        },
      } as unknown as PublicCode;

      const result = publicCodeAdapter({
        defaultValues: minimalDefaultValues,
        publicCode,
      });

      expect(result.maintenance?.contacts).toHaveLength(1);
      expect(result.maintenance?.contacts?.[0].name).toBe("Internal");
      expect(result.maintenance?.contractors).toHaveLength(1);
    });

    it("should clear both when maintenance.type is none", () => {
      const publicCode = {
        maintenance: {
          type: "none",
          contacts: [{ name: "X" }],
          contractors: [{ name: "Y" }],
        },
      } as unknown as PublicCode;

      const result = publicCodeAdapter({
        defaultValues: minimalDefaultValues,
        publicCode,
      });

      expect(result.maintenance?.contacts).toBeUndefined();
      expect(result.maintenance?.contractors).toBeUndefined();
    });
  });
});
