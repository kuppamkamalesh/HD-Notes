// import { api } from "../lib/api";

// export interface Note {
//   _id: string;
//   title: string;
//   content: string;
//   createdAt: string;
//   updatedAt: string;
// }

// export const fetchNotes = async (): Promise<Note[]> => {
//   return api("/notes", { method: "GET" });
// };

// export const createNote = async (
//   title: string,
//   content: string = ""
// ): Promise<Note> => {
//   return api("/notes", {
//     method: "POST",
//     json: { title, content },
//   });
// };

// export const deleteNote = async (id: string): Promise<{ message: string }> => {
//   return api(`/notes/${id}`, { method: "DELETE" });
// };

import { api } from "../lib/api";

export interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export const fetchNotes = async (): Promise<Note[]> => {
  return api("/notes", { method: "GET" });
};

export const createNote = async (
  title: string,
  content: string = ""
): Promise<Note> => {
  return api("/notes", {
    method: "POST",
    json: { title, content },
  });
};

export const deleteNote = async (id: string): Promise<{ message: string }> => {
  return api(`/notes/${id}`, { method: "DELETE" });
};
