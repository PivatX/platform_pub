/**
 * User API Service
 * Example service demonstrating how to use the API client
 */

import { apiClient } from "../client";

// Type definitions
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
}

export interface CreateUserRequest {
  email: string;
  name: string;
  password: string;
}

export interface UpdateUserRequest {
  name?: string;
  avatar?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

/**
 * User Service Class
 */
class UserService {
  private readonly basePath = "/users";

  /**
   * Get all users
   */
  async getUsers(): Promise<User[]> {
    return apiClient.get<User[]>(this.basePath);
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<User> {
    return apiClient.get<User>(`${this.basePath}/${userId}`);
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<User> {
    return apiClient.get<User>(`${this.basePath}/me`);
  }

  /**
   * Create new user
   */
  async createUser(data: CreateUserRequest): Promise<User> {
    return apiClient.post<User>(this.basePath, data);
  }

  /**
   * Update user
   */
  async updateUser(userId: string, data: UpdateUserRequest): Promise<User> {
    return apiClient.patch<User>(`${this.basePath}/${userId}`, data);
  }

  /**
   * Delete user
   */
  async deleteUser(userId: string): Promise<void> {
    return apiClient.delete<void>(`${this.basePath}/${userId}`);
  }

  /**
   * Login user
   */
  async login(data: LoginRequest): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>("/auth/login", data);
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    return apiClient.post<void>("/auth/logout");
  }
}

// Export singleton instance
export const userService = new UserService();
export default userService;
