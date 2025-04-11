declare module "astro:content" {
  export interface CollectionEntry<T> {
    id: string;
    slug: string;
    body: string;
    collection: T;
    data: {
      title: string;
      description: string;
      publishDate: Date;
      author?: string;
      image?: string;
      tags?: string[];
    };
    render: () => Promise<{ Content: any }>;
  }

  export function getCollection<T extends string>(
    collection: T
  ): Promise<CollectionEntry<T>[]>;
}
