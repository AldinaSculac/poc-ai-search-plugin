import { Search, X } from 'lucide-react';
import type { Ref } from 'react';
import './SearchInput.css';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  ref?: Ref<HTMLInputElement>;
}

export function SearchInput({ value, onChange, ref }: SearchInputProps) {
  return (
    <div className="search-input">
      <Search className="search-input__icon" size={18} />
      <input
        ref={ref}
        type="search"
        className="search-input__field"
        placeholder="Search products…"
        aria-label="Search products"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      {value && (
        <button
          type="button"
          className="search-input__clear"
          aria-label="Clear search"
          onClick={() => onChange('')}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
