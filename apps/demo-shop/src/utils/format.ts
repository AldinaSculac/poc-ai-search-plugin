const priceFormatter = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' });

export function formatPrice(price: number): string {
  return priceFormatter.format(price);
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
