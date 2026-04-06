import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { readCartCookie, saveCartCookie } from '../../Utils/cartCookie';
import { fetchDonuts } from '../../Utils/donutsApi';
import { Donut } from '../../Models/Donuts';
import axios from 'axios';
import './CartPage.css';

export default function CartPage() {
    const navigate = useNavigate();
    const [donuts, setDonuts] = useState<Donut[]>([]);
    const [cartItems, setCartItems] = useState<Record<number, number>>(() => readCartCookie());
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [isPurchasing, setIsPurchasing] = useState(false);
    const [checkoutMessage, setCheckoutMessage] = useState('');

    const cartDonuts = useMemo(
        () => donuts.filter((donut) => (cartItems[donut.id] ?? 0) > 0),
        [cartItems, donuts]
    );

    const subtotal = cartDonuts.reduce((sum, donut) => sum + donut.price * (cartItems[donut.id] ?? 0), 0);
    const serviceFee = cartDonuts.length > 0 ? 3.5 : 0;
    const total = subtotal + serviceFee;

    const updateQuantity = (donutId: number, nextQuantity: number) => {
        setCartItems((prev) => {
            const updated = { ...prev };

            if (nextQuantity <= 0) {
                delete updated[donutId];
            } else {
                updated[donutId] = nextQuantity;
            }

            saveCartCookie(updated);
            return updated;
        });
    };

    const clearCart = () => {
        saveCartCookie({});
        setCartItems({});
    };

    const handleCheckout = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        if (cartDonuts.length === 0) {
            setCheckoutMessage('Add at least one donut before checking out.');
            return;
        }

        try {
            setIsPurchasing(true);
            setCheckoutMessage('');

            const payload = {
                items: cartDonuts.map((donut) => ({
                    donutId: donut.id,
                    quantity: cartItems[donut.id] ?? 0
                }))
            };

            const res = await axios.post('http://localhost:8800/checkout', payload, {
                withCredentials: true
            });

            clearCart();
            navigate('/thank-you', {
                state: {
                    orderId: res.data.orderId,
                    itemCount: res.data.itemCount,
                    total: res.data.total,
                    pointsEarned: res.data.pointsEarned
                }
            });
        } catch (error: any) {
            setCheckoutMessage(
                error?.response?.data?.error || 'We could not complete your purchase right now.'
            );
        } finally {
            setIsPurchasing(false);
        }
    };

    useEffect(() => {
        let isMounted = true;

        async function loadDonuts() {
            try {
                setIsLoading(true);
                setLoadError('');
                const loadedDonuts = await fetchDonuts();
                if (isMounted) {
                    setDonuts(loadedDonuts);
                }
            } catch (error) {
                if (isMounted) {
                    setLoadError('Could not load cart details from the database right now.');
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        loadDonuts();

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        let isMounted = true;

        async function checkAuthState() {
            try {
                setIsCheckingAuth(true);
                const res = await axios.get('http://localhost:8800/me', { withCredentials: true });

                if (!isMounted) {
                    return;
                }

                setIsAuthenticated(res.data.status === 'Success');
            } catch {
                if (isMounted) {
                    setIsAuthenticated(false);
                }
            } finally {
                if (isMounted) {
                    setIsCheckingAuth(false);
                }
            }
        }

        checkAuthState();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <div className="CartPage">
            <section className="cartHero">
                <div>
                    <p className="cartEyebrow">Your Order</p>
                    <h1>Review every donut before checkout.</h1>
                    <p className="cartLead">
                        A full-page cart with clearer quantities, images, totals, and room to adjust everything comfortably.
                    </p>
                </div>
                <button type="button" className="cartBackBtn" onClick={() => navigate('/donuts')}>
                    Back to donuts
                </button>
            </section>

            <section className="cartLayout">
                <div className="cartItemsPanel">
                    {loadError ? (
                        <div className="cartEmptyState">
                            <h2>Cart details are unavailable.</h2>
                            <p>{loadError}</p>
                        </div>
                    ) : isLoading ? (
                        <div className="cartEmptyState">
                            <h2>Loading your cart...</h2>
                            <p>Please wait while we bring in the donuts from your database.</p>
                        </div>
                    ) : cartDonuts.length === 0 ? (
                        <div className="cartEmptyState">
                            <h2>Your cart is empty.</h2>
                            <p>Pick a few donuts first, then come back here to review your order.</p>
                            <button type="button" className="cartBrowseBtn" onClick={() => navigate('/donuts')}>
                                Browse donuts
                            </button>
                        </div>
                    ) : (
                        cartDonuts.map((donut) => (
                            <article className="checkoutRow" key={donut.id}>
                                <img src={donut.image} alt={donut.name} className="checkoutThumb" />
                                <div className="checkoutInfo">
                                    <div className="checkoutTitleRow">
                                        <div>
                                            <h2>{donut.name}</h2>
                                            <p>{donut.description}</p>
                                        </div>
                                        <strong>${(donut.price * (cartItems[donut.id] ?? 0)).toFixed(2)}</strong>
                                    </div>
                                    <div className="checkoutMetaRow">
                                        <span>${donut.price.toFixed(2)} each</span>
                                        <span>{donut.calories} cal</span>
                                    </div>
                                    <div className="checkoutActions">
                                        <div className="checkoutQty">
                                            <button type="button" onClick={() => updateQuantity(donut.id, (cartItems[donut.id] ?? 0) - 1)}>-</button>
                                            <span>{cartItems[donut.id]}</span>
                                            <button type="button" onClick={() => updateQuantity(donut.id, (cartItems[donut.id] ?? 0) + 1)}>+</button>
                                        </div>
                                        <button type="button" className="checkoutRemoveBtn" onClick={() => updateQuantity(donut.id, 0)}>
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))
                    )}
                </div>

                <aside className="cartSummaryPanel">
                    <div className="summaryCard">
                        <p className="summaryLabel">Order summary</p>
                        <div className="summaryRow">
                            <span>Items</span>
                            <strong>{cartDonuts.reduce((sum, donut) => sum + (cartItems[donut.id] ?? 0), 0)}</strong>
                        </div>
                        <div className="summaryRow">
                            <span>Subtotal</span>
                            <strong>${subtotal.toFixed(2)}</strong>
                        </div>
                        <div className="summaryRow">
                            <span>Service fee</span>
                            <strong>${serviceFee.toFixed(2)}</strong>
                        </div>
                        <div className="summaryTotal">
                            <span>Total</span>
                            <strong>${total.toFixed(2)}</strong>
                        </div>
                        {checkoutMessage && <p className="summaryMessage">{checkoutMessage}</p>}
                        <button
                            type="button"
                            className="summaryCheckoutBtn"
                            onClick={handleCheckout}
                            disabled={isPurchasing || isCheckingAuth}
                        >
                            {isCheckingAuth
                                ? 'Checking your account...'
                                : isPurchasing
                                    ? 'Processing payment...'
                                    : isAuthenticated
                                        ? 'Pay now'
                                        : 'Continue to login'}
                        </button>
                        <button type="button" className="summaryClearBtn" onClick={clearCart}>
                            Clear cart
                        </button>
                    </div>
                </aside>
            </section>
        </div>
    );
}
