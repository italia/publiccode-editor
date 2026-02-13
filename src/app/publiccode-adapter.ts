import { format, parseISO } from "date-fns";
import PublicCode from "./contents/publiccode";
import { removeDuplicate } from "./yaml-upload";

const publicCodeAdapter = ({
  defaultValues,
  publicCode,
}: {
  defaultValues: Partial<PublicCode>;
  publicCode: PublicCode | null;
}) => {
  if (!publicCode) {
    throw new Error("Public Code import error");
  }

  const values = { ...defaultValues, ...publicCode } as PublicCode;

  const { usedBy, releaseDate, description, maintenance } = publicCode;

  // automigrate riuso.codiceIPA -> organisation.uri (urn:x-italian-pa:[codiceIPA])
  try {
    const codiceIPA: string | undefined = publicCode?.it?.riuso?.codiceIPA;
    const existingOrgUri: string | undefined = publicCode?.organisation?.uri;
    if (!existingOrgUri && codiceIPA) {
      values.organisation = { uri: `urn:x-italian-pa:${codiceIPA}` } as never;
    }
  } catch {
    // noop
  }

  if (usedBy) {
    values.usedBy = removeDuplicate(usedBy);
  }

  if (description) {
    Object.keys(description).forEach((k) => {
      const currentDescription = description[k];

      if (currentDescription.screenshots) {
        currentDescription.screenshots = removeDuplicate(
          currentDescription.screenshots,
        );
      }

      if (currentDescription.features) {
        currentDescription.features = removeDuplicate(
          currentDescription.features,
        );
      }
    });
  }

  if (releaseDate) {
    if ((releaseDate as unknown) instanceof Date) {
      values.releaseDate = format(releaseDate, "yyyy-MM-dd");
    }

    if (typeof releaseDate === "string") {
      values.releaseDate = format(parseISO(releaseDate), "yyyy-MM-dd");
    }
  }

  if (maintenance) {
    const { type, contractors } = maintenance;

    if (type === "none") {
      maintenance.contacts = undefined;
      maintenance.contractors = undefined;
    }

    // Normalize: only one of contacts/contractors is valid per maintenance.type
    // (see #438 - imported YAML may have both, causing validation to fail)
    if (type === "community" || type === "internal") {
      maintenance.contractors = undefined;
    }
    if (type === "contract") {
      maintenance.contacts = undefined;
    }

    if (contractors && type === "contract") {
      maintenance.contractors = contractors.map((contractor) => {
        if (!contractor.until) {
          return contractor;
        }

        if ((contractor.until as unknown) instanceof Date) {
          return {
            ...contractor,
            until: format(contractor.until as unknown as Date, "yyyy-MM-dd"),
          };
        }

        if (typeof contractor.until === "string") {
          try {
            return {
              ...contractor,
              until: format(parseISO(contractor.until), "yyyy-MM-dd"),
            };
          } catch {
            return contractor;
          }
        }

        return contractor;
      });
    }
  }

  return values;
};

export default publicCodeAdapter;
