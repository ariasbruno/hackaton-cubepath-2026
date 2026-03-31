/**
 * A simple manual version of classNames (clsx) to avoid external dependencies
 * while still allowing conditional class grouping.
 */
export function cn(...inputs: any[]) {
  return inputs
    .flat()
    .filter(Boolean)
    .join(' ');
}
