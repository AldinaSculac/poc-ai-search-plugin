import type { Product } from '../types';
import productsJson from './products.json';

// JSON imports infer `string` for union fields, so narrow to the domain type.
export const products = productsJson as Product[];
