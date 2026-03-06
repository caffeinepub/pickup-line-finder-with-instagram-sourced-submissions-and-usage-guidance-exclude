export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

const MAX_LENGTH = 500;

export function validatePickupLine(text: string): ValidationResult {
  const trimmed = text.trim();

  if (trimmed.length === 0) {
    return {
      isValid: false,
      error: "Pickup line cannot be empty.",
    };
  }

  if (trimmed.length > MAX_LENGTH) {
    return {
      isValid: false,
      error: `Pickup line must be less than ${MAX_LENGTH} characters.`,
    };
  }

  const lines = trimmed.split("\n");
  const nonEmptyLines = lines.filter((line) => line.trim().length > 0);

  if (nonEmptyLines.length < 3) {
    return {
      isValid: false,
      error:
        "Pickup line must have at least 3 non-empty lines. One-liners are not allowed!",
    };
  }

  return { isValid: true };
}
