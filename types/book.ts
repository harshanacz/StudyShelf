export interface Book {
  key: string;
  title: string;
  author_name?: string[];
  cover_i?: number;
  first_publish_year?: number;
  isbn?: string[];
}

export interface OpenLibraryResponse {
  docs: Book[];
  numFound: number;
}
