import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router';
import { FilterSidebar } from '../components/FilterSidebar';
import { ProductCard } from '../components/ProductCard';
import { SearchInput } from '../components/SearchInput';
import { products } from '../data/products';
import { applyFilters, emptyFilters } from '../filters/applyFilters';
import { getFilterOptions } from '../filters/filterOptions';
import type { Filters } from '../types';
import './CataloguePage.css';

const filterOptions = getFilterOptions(products);

export function CataloguePage() {
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const visibleProducts = applyFilters(products, filters);
  const searchRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const query = filters.query.trim();

  // The header search icon navigates here with `focusSearch` in the router state.
  useEffect(() => {
    if ((location.state as { focusSearch?: boolean } | null)?.focusSearch) {
      searchRef.current?.focus();
    }
  }, [location]);

  return (
    <div className="catalogue">
      <div className="catalogue__header">
        <div>
          <h1 className="catalogue__title">{query ? `Results for “${query}”` : 'All products'}</h1>
          <p className="catalogue__count">
            {visibleProducts.length} of {products.length} items
          </p>
        </div>
        <SearchInput
          ref={searchRef}
          value={filters.query}
          onChange={(value) => setFilters({ ...filters, query: value })}
        />
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
            <h2>No products match your search</h2>
            <p>Try a different search term or remove a filter or two.</p>
            <button type="button" className="button" onClick={() => setFilters(emptyFilters)}>
              Clear search and filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
