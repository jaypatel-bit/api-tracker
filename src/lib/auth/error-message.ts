type AuthFlow = "login" | "signup" | "social";

function readString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function extractAuthErrorDetails(error: unknown): { code: string | null; message: string | null } {
  if (!error) {
    return { code: null, message: null };
  }

  if (error instanceof Error) {
    const cause = extractAuthErrorDetails((error as Error & { cause?: unknown }).cause);
    return {
      code: cause.code,
      message: readString(error.message) || cause.message,
    };
  }

  if (typeof error === "object") {
    const objectError = error as Record<string, unknown>;
    const nested = extractAuthErrorDetails(objectError.error);

    return {
      code: readString(objectError.code) || nested.code,
      message:
        readString(objectError.message) ||
        readString(objectError.statusText) ||
        nested.message,
    };
  }

  return { code: null, message: readString(error) };
}

export function getAuthErrorMessage(error: unknown, flow: AuthFlow) {
  const { code, message } = extractAuthErrorDetails(error);

  if (flow === "login") {
    if (code === "INVALID_EMAIL_OR_PASSWORD") {
      return "Incorrect email or password. If you do not have an account yet, create one first on the sign up page.";
    }
  }

  if (flow === "signup") {
    if (code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL") {
      return "An account with this email already exists. Sign in instead, or use a different email address.";
    }
  }

  if (flow === "social") {
    if (code === "SOCIAL_ACCOUNT_NOT_FOUND") {
      return "No Google sign-in account was found for this email yet. Create an account first, or use email and password.";
    }

    return "Google sign-in is not available right now. Use email and password instead.";
  }

  if (code === "INVALID_ORIGIN" || code === "MISSING_OR_NULL_ORIGIN") {
    return "Authentication is temporarily unavailable. Refresh the page and try again.";
  }

  if (message && message !== "Something went wrong. Please try again.") {
    return message;
  }

  if (flow === "login") {
    return "We could not sign you in. Check your email and APIRadar password, or create an account first.";
  }

  if (flow === "signup") {
    return "We could not create your account. Try again, or use a different email address.";
  }

  return "Authentication is unavailable right now. Please try again.";
}
