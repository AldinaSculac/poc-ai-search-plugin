import { useState } from 'react';
import { FilterSidebar } from '../components/FilterSidebar';
import { ProductCard } from '../components/ProductCard';
import { products } from '../data/products';
import { applyFilters, emptyFilters } from '../filters/applyFilters';
import { getFilterOptions } from '../filters/filterOptions';
import type { Filters } from '../types';
import './CataloguePage.css';

const filterOptions = getFilterOptions(products);

export function CataloguePage() {
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const visibleProducts = applyFilters(products, filters);

  return (
    <div className="catalogue">
      <div className="catalogue__header">
        <h1 className="catalogue__title">All products</h1>
        <p className="catalogue__count">
          {visibleProducts.length} of {products.length} items
        </p>
      </div>

      <div className="catalogue__layout">
        <FilterSidebar filters={filters} options={filterOptions} onChange={setFilters} />

        {visibleProducts.length > 0 ? (
          <div className="catalogue__grid">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="catalogue__empty">
            <h2>No products match your filters</h2>
            <p>Try removing a filter or two.</p>
            <button type="button" className="button" onClick={() => setFilters(emptyFilters)}>
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
