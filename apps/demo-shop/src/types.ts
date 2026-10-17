export type Category = 'tops' | 'bottoms' | 'dresses' | 'outerwear' | 'shoes';

export type Gender = 'women' | 'men';

export type ProductGender = Gender | 'unisex';

export type Style = 'casual' | 'sporty' | 'formal' | 'streetwear';

export interface Product {
  id: string;
  name: string;
  category: Category;
  gender: ProductGender;
  style: Style;
  /** Price in EUR. */
  price: number;
  colors: string[];
  /** Clothing sizes (XS to XXL) or EU shoe sizes ("36" to "46"). */
  sizes: string[];
  description: string;
  /** Image URL or path to a placeholder image. */
  image: string;
  /** Photographer credit, required by the Unsplash license for hotlinked photos. */
  imageCredit?: ImageCredit;
}

export interface ImageCredit {
  name: string;
  url: string;
}

export interface UserProfile {
  id: string;
  name: string;
  gender: Gender;
  age: number;
  weightKg: number;
  heightCm: number;
  shoeSizeEu: number;
  preferredStyle: Style;
  avatar: string;
}

/**
 * Contract between the shop and the AI search plugin: the classic filter UI
 * and the plugin both produce this exact shape. Empty arrays and null mean
 * "no filter".
 */
export interface Filters {
  /** Free text matched against product name and description. */
  query: string;
  categories: Category[];
  /** Matches products of this gender plus unisex products. */
  gender: Gender | null;
  /** Maximum price in EUR. */
  priceMax: number | null;
  colors: string[];
  sizes: string[];
}
