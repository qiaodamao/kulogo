export interface iSVG {
  id: number;
  title: string;
  category: string;
  route: string | { dark: string; light: string };
  wordmark?: string | { dark: string; light: string };
  url: string;
}

export interface CategoryEntry {
  name: string;
  slug: string;
  count: number;
}
