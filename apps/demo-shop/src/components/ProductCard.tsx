import { Heart } from 'lucide-react';
import type { SyntheticEvent } from 'react';
import { colorHex } from '../data/colors';
import type { Product } from '../types';
import { capitalize, formatPrice } from '../utils/format';
import './ProductCard.css';

const PLACEHOLDER_IMAGE = '/images/placeholder.svg';
const MAX_SWATCHES = 5;
const UNSPLASH_URL = 'https://unsplash.com/?utm_source=ai_search_poc&utm_medium=referral';

function showPlaceholder(event: SyntheticEvent<HTMLImageElement>) {
  const image = event.currentTarget;
  if (!image.src.endsWith(PLACEHOLDER_IMAGE)) image.src = PLACEHOLDER_IMAGE;
}

export function ProductCard({ product }: { product: Product }) {
  const swatches = product.colors.slice(0, MAX_SWATCHES);
  const hiddenColors = product.colors.length - swatches.length;

  return (
    <article className="product-card">
      <div className="product-card__media">
        <img
          className="product-card__image"
          src={product.image}
          alt={product.name}
          loading="lazy"
          onError={showPlaceholder}
        />
        <span className="product-card__badge">{capitalize(product.style)}</span>
        <button type="button" className="product-card__wishlist" aria-label="Add to wishlist">
          <Heart size={18} />
        </button>
        {product.imageCredit && (
          <p className="product-card__credit">
            Photo by{' '}
            <a href={product.imageCredit.url} target="_blank" rel="noreferrer">
              {product.imageCredit.name}
            </a>{' '}
            on{' '}
            <a href={UNSPLASH_URL} target="_blank" rel="noreferrer">
              Unsplash
            </a>
          </p>
        )}
      </div>

      <div className="product-card__body">
        <p className="product-card__meta">
          {capitalize(product.category)} · {capitalize(product.gender)}
        </p>
        <h3 className="product-card__name">{product.name}</h3>
        <p className="product-card__price">{formatPrice(product.price)}</p>
        <ul className="product-card__swatches" aria-label={`Colors: ${product.colors.join(', ')}`}>
          {swatches.map((color) => (
            <li
              key={color}
              className="product-card__swatch"
              style={{ background: colorHex[color] ?? color }}
              title={capitalize(color)}
            />
          ))}
          {hiddenColors > 0 && <li className="product-card__more">+{hiddenColors}</li>}
        </ul>
      </div>
    </article>
  );
}
