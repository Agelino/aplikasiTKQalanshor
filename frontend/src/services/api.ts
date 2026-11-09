import { Student, Teacher, User } from '../types';

const browserApiUrl = typeof window !== 'undefined'
  ? `http://${window.location.hostname}:8000/api/v1`
  : 'http://127.0.0.1:8000/api/v1';
const API_URL = (import.meta.env.VITE_API_URL || browserApiUrl).replace(/\/$/, '');

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', Accept: 'application/json', ...(options.headers || {}) },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || `API request failed (${response.status})`);
  }
  return response.status === 204 ? (undefined as T) : response.json();
}

export interface BootstrapData {
  teachers: Teacher[];
  students: Student[];
  classes: unknown[];
  rombels: unknown[];
}

export const api = {
  resources: () => request<Record<string, unknown[]>>('/resources'),
  resource: (resource: string) => request<unknown[]>(`/resources/${encodeURIComponent(resource)}`),
  replaceResource: (resource: string, items: unknown[]) =>
    request<unknown[]>(`/resources/${encodeURIComponent(resource)}`, {
      method: 'PUT',
      body: JSON.stringify({ items }),
    }),
  createResourceItem: <T>(resource: string, item: T) =>
    request<T>(`/resources/${encodeURIComponent(resource)}/items`, {
      method: 'POST',
      body: JSON.stringify(item),
    }),
  updateResourceItem: <T extends { id: string }>(resource: string, item: T) =>
    request<T>(`/resources/${encodeURIComponent(resource)}/items/${encodeURIComponent(item.id)}`, {
      method: 'PUT',
      body: JSON.stringify(item),
    }),
  deleteResourceItem: (resource: string, id: string) =>
    request<void>(`/resources/${encodeURIComponent(resource)}/items/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  state: () => request<Record<string, unknown>>('/state'),
  saveState: (key: string, value: unknown) =>
    request<{ key: string; value: unknown }>(`/state/${encodeURIComponent(key)}`, {
      method: 'PUT',
      body: JSON.stringify({ value }),
    }),
  deleteState: (key: string) =>
    request<void>(`/state/${encodeURIComponent(key)}`, { method: 'DELETE' }),
  bootstrap: () => request<BootstrapData>('/bootstrap'),
  login: async (username: string, password: string) => {
    const result = await request<{ user: User & { teacher_id?: string; student_id?: string } }>('/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    return {
      user: {
        ...result.user,
        teacherId: result.user.teacherId || result.user.teacher_id,
        studentId: result.user.studentId || result.user.student_id,
      },
    };
  },
  createTeacher: (teacher: Omit<Teacher, 'id'>) =>
    request<Teacher>('/teachers', { method: 'POST', body: JSON.stringify(teacher) }),
  updateTeacher: (teacher: Teacher) =>
    request<Teacher>(`/teachers/${encodeURIComponent(teacher.id)}`, { method: 'PUT', body: JSON.stringify(teacher) }),
  deleteTeacher: (id: string) =>
    request<void>(`/teachers/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  createStudent: (student: Omit<Student, 'id'>) =>
    request<Student>('/students', { method: 'POST', body: JSON.stringify(student) }),
  updateStudent: (student: Student) =>
    request<Student>(`/students/${encodeURIComponent(student.id)}`, { method: 'PUT', body: JSON.stringify(student) }),
  deleteStudent: (id: string) =>
    request<void>(`/students/${encodeURIComponent(id)}`, { method: 'DELETE' }),
};
