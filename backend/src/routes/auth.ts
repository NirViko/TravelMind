import { Router, Request, Response } from "express";
import { supabaseAdmin } from "../services/supabase";

const router = Router();

/**
 * POST /api/auth/signup
 * Create a new user account
 */
router.post("/signup", async (req: Request, res: Response) => {
  try {
    const { email, password, name, firstName, lastName, dateOfBirth } =
      req.body;

    console.log("Signup request received:", {
      email,
      hasPassword: !!password,
      name,
      firstName,
      lastName,
      dateOfBirth,
    });

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required",
      });
    }

    if (!firstName || !lastName) {
      return res.status(400).json({
        success: false,
        error: "First name and last name are required",
      });
    }

    if (!dateOfBirth) {
      return res.status(400).json({
        success: false,
        error: "Date of birth is required",
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        error: "Please enter a valid email address",
      });
    }

    // Password validation
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        error: "Password must be at least 8 characters",
      });
    }

    // Create user in Supabase Auth
    // Note: In Supabase, signUp might require email confirmation
    // If email confirmation is enabled, the user will be created but session will be null
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.signUp({
        email: email.toLowerCase().trim(),
        password,
        options: {
          data: {
            name: name || `${firstName} ${lastName}`.trim(),
            firstName,
            lastName,
            dateOfBirth,
          },
          emailRedirectTo: undefined, // Disable email redirect for API
        },
      });

    if (authError) {
      console.error("Supabase auth error:", authError);
      // Handle specific Supabase errors
      let errorMessage = authError.message;
      if (authError.message.includes("already registered")) {
        errorMessage =
          "This email is already registered. Please sign in instead.";
      } else if (authError.message.includes("invalid")) {
        errorMessage = "Please enter a valid email address.";
      } else if (
        authError.message.includes("confirmation email") ||
        authError.message.includes("Error sending")
      ) {
        errorMessage =
          "Failed to send confirmation email. Please check SMTP settings in Supabase Dashboard → Settings → Auth → SMTP Settings, or disable email confirmations temporarily for development.";
      }
      return res.status(400).json({
        success: false,
        error: errorMessage,
      });
    }

    if (!authData.user) {
      console.error("No user returned from Supabase");
      return res.status(400).json({
        success: false,
        error: "Failed to create user",
      });
    }

    console.log("User created successfully:", authData.user?.id);

    // Note: If email confirmation is required, authData.session might be null
    // The user will be created but needs to confirm email first
    if (!authData.user) {
      return res.status(400).json({
        success: false,
        error: "Failed to create user. Please try again.",
      });
    }

    // Profile is created automatically by trigger
    // Wait a bit for the trigger to complete, then get the profile
    await new Promise((resolve) => setTimeout(resolve, 500));

    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", authData.user.id)
      .single();

    // If profile doesn't exist, create it manually
    if (!profile) {
      const { error: insertError } = await supabaseAdmin
        .from("profiles")
        .insert({
          id: authData.user.id,
          email: authData.user.email,
          name: name || `${firstName} ${lastName}`.trim(),
          firstName,
          lastName,
          dateOfBirth,
        });

      if (insertError) {
        console.error("Error creating profile:", insertError);
      }
    } else {
      // Update profile with additional info if needed
      if (firstName || lastName || dateOfBirth) {
        await supabaseAdmin
          .from("profiles")
          .update({
            firstName: firstName || profile.firstName,
            lastName: lastName || profile.lastName,
            dateOfBirth: dateOfBirth || profile.dateOfBirth,
          })
          .eq("id", authData.user.id);
      }
    }

    // Check if email confirmation is required
    const needsEmailConfirmation = !authData.session && authData.user;

    const { data: finalProfile } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", authData.user.id)
      .single();

    res.json({
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        name: finalProfile?.name || name || `${firstName} ${lastName}`.trim(),
        firstName: finalProfile?.firstName || firstName,
        lastName: finalProfile?.lastName || lastName,
        dateOfBirth: finalProfile?.dateOfBirth || dateOfBirth,
        emailVerified: !needsEmailConfirmation,
      },
      session: authData.session,
      needsEmailConfirmation: needsEmailConfirmation,
      message: needsEmailConfirmation
        ? "Account created! Please check your email to confirm your account."
        : "Account created successfully!",
    });
  } catch (error: any) {
    console.error("Signup error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to sign up",
    });
  }
});

/**
 * POST /api/auth/login
 * Login with email and password
 */
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required",
      });
    }

    // Sign in with Supabase Auth
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.signInWithPassword({
        email,
        password,
      });

    if (authError) {
      return res.status(401).json({
        success: false,
        error: authError.message || "Invalid credentials",
      });
    }

    if (!authData.user) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    // Check if email is verified - BLOCK login if not verified
    const isEmailVerified = authData.user.email_confirmed_at !== null;

    if (!isEmailVerified) {
      return res.status(403).json({
        success: false,
        error:
          "Please verify your email address before logging in. Check your inbox for the verification email.",
        needsEmailVerification: true,
      });
    }

    // Get user profile
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", authData.user.id)
      .single();

    res.json({
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        name: profile?.name || authData.user.email?.split("@")[0] || "User",
        firstName: profile?.firstName,
        lastName: profile?.lastName,
        dateOfBirth: profile?.dateOfBirth,
        emailVerified: true, // We know it's verified because we checked above
      },
      session: authData.session,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || "Failed to login",
    });
  }
});

/**
 * POST /api/auth/logout
 * Logout user
 */
router.post("/logout", async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (token) {
      await supabaseAdmin.auth.signOut();
    }

    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || "Failed to logout",
    });
  }
});

/**
 * GET /api/auth/me
 * Get current user
 */
/**
 * GET /api/auth/verify-status
 * Check if the current user's email is verified
 */
router.get("/verify-status", async (req: Request, res: Response) => {
  try {
    // Get authorization token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        verified: false,
        error: "Authorization token required",
      });
    }

    const token = authHeader.split(" ")[1];

    // Verify token and get user
    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.getUser(token);

    if (userError || !user) {
      return res.status(401).json({
        verified: false,
        error: "Invalid token",
      });
    }

    res.json({
      verified: user.email_confirmed_at !== null,
    });
  } catch (error: any) {
    res.status(500).json({
      verified: false,
      error: error.message || "Failed to check verification status",
    });
  }
});

/**
 * POST /api/auth/resend-verification
 * Resend verification email to the current user
 * Can use either token (from header) or email (from body)
 */
router.post("/resend-verification", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // Get authorization token from header (optional)
    const authHeader = req.headers.authorization;
    let user = null;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      // Method 1: Use token if provided
      const token = authHeader.split(" ")[1];
      const {
        data: { user: tokenUser },
        error: userError,
      } = await supabaseAdmin.auth.getUser(token);

      if (!userError && tokenUser) {
        user = tokenUser;
      }
    }

    // Method 2: Use email from body if no token or token failed
    if (!user && email) {
      // Find user by email
      const { data: users, error: findError } =
        await supabaseAdmin.auth.admin.listUsers();

      if (!findError && users) {
        user = users.users.find((u) => u.email === email.toLowerCase().trim());
      }
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        error: email
          ? "No account found with this email address"
          : "Authorization token or email required",
      });
    }

    // Check if already verified
    if (user.email_confirmed_at) {
      return res.json({
        success: true,
        message: "Email is already verified",
      });
    }

    // Resend verification email
    const { error: resendError } = await supabaseAdmin.auth.resend({
      type: "signup",
      email: user.email!,
      options: {
        emailRedirectTo: undefined, // Disable redirect for API
      },
    });

    if (resendError) {
      return res.status(400).json({
        success: false,
        error: resendError.message || "Failed to resend verification email",
      });
    }

    res.json({
      success: true,
      message: "Verification email sent successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || "Failed to resend verification email",
    });
  }
});

/**
 * POST /api/auth/forgot-password
 * Send password reset email
 */
router.post("/forgot-password", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: "Email is required",
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        error: "Please enter a valid email address",
      });
    }

    // Send password reset email using Supabase
    // Note: Supabase will send an email with a reset link
    // The link will contain a token that can be used to reset the password
    const { data, error: resetError } =
      await supabaseAdmin.auth.resetPasswordForEmail(
        email.toLowerCase().trim(),
        {
          redirectTo: `${
            process.env.FRONTEND_URL || "travelmind://reset-password"
          }`,
        }
      );

    if (resetError) {
      console.error("Password reset error:", resetError);
      // Don't reveal if email exists or not for security
      // Always return success to prevent email enumeration
      return res.json({
        success: true,
        message:
          "If an account exists with this email, a password reset link has been sent.",
      });
    }

    res.json({
      success: true,
      message:
        "If an account exists with this email, a password reset link has been sent.",
    });
  } catch (error: any) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to send password reset email",
    });
  }
});

/**
 * POST /api/auth/reset-password
 * Reset password with recovery token (from email link)
 * In Supabase, the recovery token is passed in the URL hash when user clicks the email link
 */
router.post("/reset-password", async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        error: "Token and password are required",
      });
    }

    // Password validation
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        error: "Password must be at least 8 characters",
      });
    }

    // In Supabase, password reset uses updateUser with the recovery token
    // The token from the email link needs to be used with updateUser
    // First, verify the token and get the user
    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.getUser(token);

    if (userError || !user) {
      return res.status(401).json({
        success: false,
        error:
          "Invalid or expired reset token. Please request a new password reset.",
      });
    }

    // Update password using Supabase Admin API
    // Note: For password reset, we use the recovery token session
    // The token from the email is a recovery token, not a regular access token
    const { error: updateError } =
      await supabaseAdmin.auth.admin.updateUserById(user.id, { password });

    if (updateError) {
      console.error("Password update error:", updateError);
      return res.status(400).json({
        success: false,
        error: updateError.message || "Failed to reset password",
      });
    }

    res.json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (error: any) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to reset password",
    });
  }
});

router.get("/me", async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "No token provided",
      });
    }

    // Verify token and get user
    const {
      data: { user },
      error,
    } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        success: false,
        error: "Invalid token",
      });
    }

    // Get user profile
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: profile?.name || user.email?.split("@")[0] || "User",
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || "Failed to get user",
    });
  }
});

export default router;
