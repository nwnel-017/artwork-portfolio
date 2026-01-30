/**
 * Format a monetary amount according to project rules.
 *
 * - Input is a number. By default `amount` is treated as cents (e.g. 400000 -> $4,000).
 * - If `isCents` is false, the value is treated as dollars (e.g. 4000 -> $4,000).
 *
 * Output rules:
 * - 0 - 999.99 -> "$xxx" (no decimals)
 * - >= 1,000 -> "$Xk" (thousand, no decimals)
 * - >= 1,000,000 -> "$Xm" (million, no decimals)
 */
export function formatFunds(amount: number, isCents = true): string {
	const dollars = isCents ? amount / 100 : amount;

	if (!Number.isFinite(dollars) || isNaN(dollars)) return "$0";

	const abs = Math.abs(dollars);

	if (abs < 1000) {
		return `$${Math.floor(dollars)}`;
	}

	if (abs < 1_000_000) {
		const k = Math.floor(dollars / 1000);
		return `$${k}k`;
	}

	const m = Math.floor(dollars / 1_000_000);
	return `$${m}m`;
}

export default formatFunds;

