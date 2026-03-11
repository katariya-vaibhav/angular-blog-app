export interface User {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
  token?: string;
}

export interface CurrentUserData {
  user: User;
  posts_lenght: number;
}

export interface OtherUserData {
  user: User;
  posts_lenght: number;
}

export interface Comment {
  _id: string;
  content: string;
  owner: User;
  blog: string;
  createdAt: string;
}

export interface Blog {
  _id: string;
  title: string;
  category: string;
  description: string;
  image?: string;
  owner: User;
  createdAt: string;
  comments?: Comment[];
}
