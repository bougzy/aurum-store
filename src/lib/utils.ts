export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function generateOrderMessage(
  storeName: string,
  items: { name: string; quantity: number; price: number }[],
  total: number
): string {
  let message = `🛍 *New Order from ${storeName}*\n\n`;
  items.forEach((item, i) => {
    message += `${i + 1}. ${item.name} x${item.quantity} - $${item.price.toFixed(2)}\n`;
  });
  message += `\n💰 *Total: $${total.toFixed(2)}*`;
  message += `\n\nPlease confirm my order. Thank you!`;
  return encodeURIComponent(message);
}

export function btcConversion(usdAmount: number, btcRate: number = 60000): number {
  return parseFloat((usdAmount / btcRate).toFixed(8));
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}
