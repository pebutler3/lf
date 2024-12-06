export interface Post {
  id: number;
  title: string;
  content: string | null;
}

// extend Post by making id optional
export interface NewPost extends Omit<Post, 'id'> {
  id?: number;
}

export interface Product {
  id: string;
  guid: string;
  in_stock: boolean;
  on_sale: boolean;
  name: string;
  picture: string;
  gender: 'male' | 'female';
  categories: string[];
  color: string;
  price: string;
  description: string;
}