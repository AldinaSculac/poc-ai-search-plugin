import { ProductCard } from '../components/ProductCard';
import { products } from '../data/products';
import './CataloguePage.css';

export function CataloguePage() {
  return (
    <div className="catalogue">
      <div className="catalogue__header">
        <h1 className="catalogue__title">All products</h1>
        <p className="catalogue__count">{products.length} items</p>
      </div>
      <div className="catalogue__grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
