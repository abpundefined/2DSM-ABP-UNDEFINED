import { apiRequest } from "./apiClient";

export type ManagedUser = {
  id: string;
  name: string;
  email: string;
  role: "SECRETARIA";
  created_at?: string;
  updated_at?: string;
};

export const userAdminService = {
  list() {
    return apiRequest<ManagedUser[]>("/auth/users", { auth: true });
  },

  create(payload: { name: string; email: string; password: string }) {
    return apiRequest<ManagedUser>("/auth/register", {
      method: "POST",
      auth: true,
      body: JSON.stringify({
        ...payload,
        role: "SECRETARIA",
      }),
    });
  },

  update(id: string, payload: { name: string; email: string }) {
    return apiRequest<ManagedUser>(`/auth/users/${id}`, {
      method: "PUT",
      auth: true,
      body: JSON.stringify(payload),
    });
  },

  remove(id: string) {
    return apiRequest<void>(`/auth/users/${id}`, {
      method: "DELETE",
      auth: true,
    });
  },
};
