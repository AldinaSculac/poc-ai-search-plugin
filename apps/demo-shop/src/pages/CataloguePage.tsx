import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router';
import { AiSearchBox } from 'ai-search-plugin/react';
import { Sparkles, X } from 'lucide-react';
import { aiSearch } from '../ai/aiSearch';
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
  // Product ids from the last AI search, best match first.
  const [ranking, setRanking] = useState<string[]>([]);
  // The last AI search, shown above the results until it is cleared.
  const [aiSearchState, setAiSearchState] = useState<{ prompt: string; message: string } | null>(
    null,
  );
  // Changing the key remounts the search box, which empties its input.
  const [aiBoxKey, setAiBoxKey] = useState(0);
  const visibleProducts = applyFilters(products, filters, ranking);
  const searchRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const query = filters.query.trim();
  const title = aiSearchState
    ? `Results for “${aiSearchState.prompt}”`
    : query
      ? `Results for “${query}”`
      : 'All products';

  // The header search icon navigates here with `focusSearch` in the router state.
  useEffect(() => {
    if ((location.state as { focusSearch?: boolean } | null)?.focusSearch) {
      searchRef.current?.focus();
    }
  }, [location]);

  /** Back to classic browsing: no filters, no ranking, no AI message. */
  function clearAll() {
    setFilters(emptyFilters);
    setRanking([]);
    setAiSearchState(null);
    setAiBoxKey((key) => key + 1);
  }

  return (
    <div className="catalogue">
      <AiSearchBox
        key={aiBoxKey}
        className="catalogue__ai"
        search={aiSearch}
        // The AI returns a complete Filters object, so it replaces the current filters.
        onResult={(result, prompt) => {
          setFilters(result.filters);
          setRanking(result.rankedIds);
          setAiSearchState({ prompt, message: result.message });
        }}
        placeholder="Describe what you need, e.g. a warm jacket for a city break under €150"
      />

      <div className="catalogue__header">
        <div>
          <h1 className="catalogue__title">{title}</h1>
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

      {aiSearchState && (
        <div className="catalogue__ai-message" role="status">
          <Sparkles className="catalogue__ai-icon" size={20} />
          <p>{aiSearchState.message || 'Here are the best matches for your request.'}</p>
          <button type="button" className="button button--ghost" onClick={clearAll}>
            <X size={16} />
            Clear AI search
          </button>
        </div>
      )}

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
            <button type="button" className="button" onClick={clearAll}>
              Clear search and filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
