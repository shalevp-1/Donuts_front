export const CART_COOKIE_NAME = 'donuts_cart';

export type CartItems = Record<number, number>;

export function readCartCookie(): CartItems {
    if (typeof document === 'undefined') {
        return {};
    }

    const cookieEntry = document.cookie
        .split('; ')
        .find((entry) => entry.startsWith(`${CART_COOKIE_NAME}=`));

    if (!cookieEntry) {
        return {};
    }

    try {
        const rawValue = decodeURIComponent(cookieEntry.split('=').slice(1).join('='));
        const parsed = JSON.parse(rawValue) as Record<string, number>;

        return Object.entries(parsed).reduce<CartItems>((acc, [key, value]) => {
            const donutId = Number(key);
            if (Number.isInteger(donutId) && typeof value === 'number' && value > 0) {
                acc[donutId] = value;
            }
            return acc;
        }, {});
    } catch {
        return {};
    }
}

export function saveCartCookie(cartItems: CartItems) {
    if (typeof document === 'undefined') {
        return;
    }

    const cookieValue = encodeURIComponent(JSON.stringify(cartItems));
    document.cookie = `${CART_COOKIE_NAME}=${cookieValue}; path=/; max-age=${60 * 60}; SameSite=Lax`;
}

export function clearCartCookie() {
    if (typeof document === 'undefined') {
        return;
    }

    document.cookie = `${CART_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
}
