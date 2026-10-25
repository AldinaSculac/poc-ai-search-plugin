import { colorHex } from '../data/colors';
import { emptyFilters, hasActiveFilters } from '../filters/applyFilters';
import type { FilterOptions } from '../filters/filterOptions';
import type { Filters, Gender } from '../types';
import { capitalize, formatPrice } from '../utils/format';
import './FilterSidebar.css';

interface FilterSidebarProps {
  filters: Filters;
  options: FilterOptions;
  onChange: (filters: Filters) => void;
  /** Replaces the default "Clear all", which clears every filter but keeps the text search. */
  onClearAll?: () => void;
}

const genderOptions: { value: Gender | null; label: string }[] = [
  { value: null, label: 'All' },
  { value: 'women', label: 'Women' },
  { value: 'men', label: 'Men' },
];

const toggle = <T,>(values: T[], value: T) =>
  values.includes(value) ? values.filter((item) => item !== value) : [...values, value];

export function FilterSidebar({ filters, options, onChange, onClearAll }: FilterSidebarProps) {
  const update = (patch: Partial<Filters>) => onChange({ ...filters, ...patch });
  const clearAll = onClearAll ?? (() => onChange({ ...emptyFilters, query: filters.query }));
  const priceValue = filters.priceMax ?? options.maxPrice;

  return (
    <aside className="filters">
      <div className="filters__header">
        <h2 className="filters__title">Filters</h2>
        {hasActiveFilters(filters) && (
          <button type="button" className="filters__clear" onClick={clearAll}>
            Clear all
          </button>
        )}
      </div>

      <fieldset className="filters__group">
        <legend className="filters__legend">Category</legend>
        {options.categories.map((category) => (
          <label key={category} className="filters__check">
            <input
              type="checkbox"
              checked={filters.categories.includes(category)}
              onChange={() => update({ categories: toggle(filters.categories, category) })}
            />
            {capitalize(category)}
          </label>
        ))}
      </fieldset>

      <fieldset className="filters__group">
        <legend className="filters__legend">Gender</legend>
        <div className="filters__segmented">
          {genderOptions.map(({ value, label }) => (
            <button
              key={label}
              type="button"
              className="filters__segment"
              aria-pressed={filters.gender === value}
              onClick={() => update({ gender: value })}
            >
              {label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="filters__group">
        <legend className="filters__legend">Max price</legend>
        <input
          type="range"
          className="filters__range"
          min={options.minPrice}
          max={options.maxPrice}
          // Steps of 1 so the slider can show any price the AI search sets, e.g. 149.
          step={1}
          value={priceValue}
          onChange={(event) => {
            const value = Number(event.target.value);
            update({ priceMax: value >= options.maxPrice ? null : value });
          }}
        />
        <div className="filters__range-label">
          {filters.priceMax === null ? 'Any price' : `Up to ${formatPrice(filters.priceMax)}`}
        </div>
      </fieldset>

      <fieldset className="filters__group">
        <legend className="filters__legend">Color</legend>
        <div className="filters__swatches">
          {options.colors.map((color) => (
            <button
              key={color}
              type="button"
              className="filters__swatch"
              style={{ background: colorHex[color] ?? color }}
              aria-pressed={filters.colors.includes(color)}
              aria-label={capitalize(color)}
              title={capitalize(color)}
              onClick={() => update({ colors: toggle(filters.colors, color) })}
            />
          ))}
        </div>
      </fieldset>

      <fieldset className="filters__group">
        <legend className="filters__legend">Size</legend>
        {[
          { label: 'Clothing', sizes: options.clothingSizes },
          { label: 'Shoes (EU)', sizes: options.shoeSizes },
        ].map(({ label, sizes }) => (
          <div key={label} className="filters__size-group">
            <div className="filters__sublabel">{label}</div>
            <div className="filters__chips">
              {sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  className="filters__chip"
                  aria-pressed={filters.sizes.includes(size)}
                  onClick={() => update({ sizes: toggle(filters.sizes, size) })}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        ))}
      </fieldset>
    </aside>
  );
}
