export type Category = "email" | "banking" | "social" | "work" | "shopping" | "other";

export type Password = {
  id: string;
  title: string;
  password: string;
  category: Category;
  createdAt: string;
  isFavorite: boolean;   
};