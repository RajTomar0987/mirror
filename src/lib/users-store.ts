export interface StoredUser {
  id: string;
  email: string;
  password?: string;
  fullName: string;
  role: "admin" | "user";
  createdAt: string;
}

class UsersStore {
  private users: StoredUser[] = [
    {
      id: "admin-user-default",
      email: "admin@completeglass.com.au",
      password: process.env.ADMIN_PASSWORD || "adminpass123",
      fullName: "CGI Administrator",
      role: "admin",
      createdAt: new Date().toISOString(),
    },
  ];

  getAll(): StoredUser[] {
    return [...this.users];
  }

  findByEmail(email: string): StoredUser | undefined {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
  }

  findById(id: string): StoredUser | undefined {
    return this.users.find((u) => u.id === id);
  }

  addUser(user: Omit<StoredUser, "id" | "createdAt"> & { id?: string }): StoredUser {
    const existing = this.findByEmail(user.email);
    if (existing) {
      existing.fullName = user.fullName || existing.fullName;
      existing.role = user.role || existing.role;
      if (user.password) existing.password = user.password;
      return existing;
    }

    const newUser: StoredUser = {
      id: user.id || `user-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      email: user.email.toLowerCase().trim(),
      password: user.password,
      fullName: user.fullName || "",
      role: user.role || "user",
      createdAt: new Date().toISOString(),
    };

    this.users.push(newUser);
    return newUser;
  }
}

export const usersStore = new UsersStore();
