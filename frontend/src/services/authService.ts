import { User } from "../types";
import { apiClient } from "../api/client";

interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
  session?: any;
  needsEmailConfirmation?: boolean;
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
        return {
          success: false,
          error: response.error || "Invalid credentials",
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
   */
  static async resendVerificationEmail(): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const response = await apiClient.post<{
        success: boolean;
        error?: string;
      }>("/auth/resend-verification");

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
}

