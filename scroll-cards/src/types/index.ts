export interface Post {
  id: number;
  title: string;
  content: string | null;
}

// extend Post by making id optional
export interface NewPost extends Omit<Post, 'id'> {
  id?: number;
}

