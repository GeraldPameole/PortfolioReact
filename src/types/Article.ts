export interface Article {
  id: string;
  title: string;
  description: string;
  content: string;
  publishDate: string;
  author: string;
  image?: string;
  tags?: string[];
}
