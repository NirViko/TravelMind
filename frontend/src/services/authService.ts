import { User } from "../types";
import { apiClient } from "../api/client";

interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
  session?: any;
  needsEmailConfirmation?: boolean;
  needsEmailVerification?: boolean;
}

export class AuthService {
  /**
   * Login with email and password
   */
  static async loginWithEmail(
    email: string,
    password: string
  ): Promise<AuthResult> {
    try {
      const response = await apiClient.post<{
        success: boolean;
        user?: User;
        error?: string;
        session?: any;
        needsEmailVerification?: boolean;
      }>("/auth/login", {
        email,
        password,
      });

      if (response.success && response.user) {
        return { 
          success: true, 
          user: response.user,
          session: response.session,
        };
      } else {
        // Check if email verification is needed
        const needsVerification = (response as any).needsEmailVerification || false;
        return {
          success: false,
          error: response.error || "Invalid credentials",
          needsEmailVerification: needsVerification,
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to login with email",
      };
    }
  }

  /**
   * Sign up with email and password
   */
  static async signUpWithEmail(
    email: string,
    password: string,
    name?: string,
    firstName?: string,
    lastName?: string,
    dateOfBirth?: string
  ): Promise<AuthResult> {
    try {
      const response = await apiClient.post<{
        success: boolean;
        user?: User;
        error?: string;
        session?: any;
        needsEmailConfirmation?: boolean;
      }>("/auth/signup", {
        email,
        password,
        name,
        firstName,
        lastName,
        dateOfBirth,
      });

      if (response.success && response.user) {
        return { 
          success: true, 
          user: response.user,
          session: response.session,
          needsEmailConfirmation: response.needsEmailConfirmation,
        };
      } else {
        return {
          success: false,
          error: response.error || "Failed to sign up",
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to sign up with email",
      };
    }
  }

  /**
   * Check if email is verified
   */
  static async checkEmailVerification(): Promise<{
    verified: boolean;
    error?: string;
  }> {
    try {
      const response = await apiClient.get<{
        verified: boolean;
        error?: string;
      }>("/auth/verify-status");

      return {
        verified: response.verified || false,
        error: response.error,
      };
    } catch (error: any) {
      return {
        verified: false,
        error: error.message || "Failed to check verification status",
      };
    }
  }

  /**
   * Resend verification email
   * @param email Optional email address. If not provided, uses token from store
   */
  static async resendVerificationEmail(email?: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const response = await apiClient.post<{
        success: boolean;
        error?: string;
      }>("/auth/resend-verification", email ? { email } : {});

      return {
        success: response.success || false,
        error: response.error,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to resend verification email",
      };
    }
  }

  /**
   * Send password reset email
   */
  static async sendPasswordResetEmail(email: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const response = await apiClient.post<{
        success: boolean;
        error?: string;
      }>("/auth/forgot-password", { email });

      return {
        success: response.success || false,
        error: response.error,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to send password reset email",
      };
    }
  }

  /**
   * Reset password with token
   */
  static async resetPassword(
    token: string,
    newPassword: string
  ): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const response = await apiClient.post<{
        success: boolean;
        error?: string;
      }>("/auth/reset-password", {
        token,
        password: newPassword,
      });

      return {
        success: response.success || false,
        error: response.error,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to reset password",
      };
    }
  }
}

