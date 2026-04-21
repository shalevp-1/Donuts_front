import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './DountsGallery.css'
import { Donut } from '../../Models/Donuts';
import Card from '../Card/Card';
import DetailedView from '../DetailedView/DetailedView';
import { readCartCookie, saveCartCookie } from '../../Utils/cartCookie';
import { fetchDonuts } from '../../Utils/donutsApi';

const DONUTS_BATCH_SIZE = 6;

function FloatingCartIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="floatingCartIcon">
            <path d="M3 4h2l2.1 9.2a1 1 0 0 0 1 .8h8.7a1 1 0 0 0 1-.8L21 7H7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="10" cy="19" r="1.5" fill="currentColor" />
            <circle cx="18" cy="19" r="1.5" fill="currentColor" />
        </svg>
    );
}

function SelectedDonutIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="selectedDonutIcon">
            <path d="M12 4.5c4.4 0 8 3.1 8 7s-3.6 7-8 7-8-3.1-8-7 3.6-7 8-7Z" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <circle cx="12" cy="11.5" r="2.1" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <circle cx="8.3" cy="9" r="0.6" fill="currentColor" />
            <circle cx="15.7" cy="9.2" r="0.6" fill="currentColor" />
            <circle cx="16.3" cy="13.7" r="0.6" fill="currentColor" />
            <circle cx="8.1" cy="14.1" r="0.6" fill="currentColor" />
        </svg>
    );
}

export default function DonutsGallery() {
    const [donuts, setDonuts] = useState<Donut[]>([]);
    const [theClickedCard, setTheClickedCard] = useState<Donut | null>(null);
    const [activeDonut, setActiveDonut] = useState<Donut | null>(null);
    const [visibleCount, setVisibleCount] = useState(DONUTS_BATCH_SIZE);
    const [cartItems, setCartItems] = useState<Record<number, number>>(() => readCartCookie());
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState('');
    const [theColor] = useState("white");
    const loadMoreRef = useRef<HTMLDivElement | null>(null);
    const navigate = useNavigate();

    const visibleDonuts = useMemo(() => donuts.slice(0, visibleCount), [donuts, visibleCount]);
    const averagePrice = donuts.length > 0
        ? donuts.reduce((sum, donut) => sum + donut.price, 0) / donuts.length
        : 0;
    const gallerySummary = donuts.length > 0
        ? `${donuts.length} donuts loaded from your live bakery menu`
        : 'Fresh donuts are loading in.';
    const hasMoreDonuts = visibleCount < donuts.length;
    const activeDonutQuantity = activeDonut ? (cartItems[activeDonut.id] ?? 0) : 0;
    const cartDonuts = donuts.filter((donut) => (cartItems[donut.id] ?? 0) > 0);
    const cartCount = Object.values(cartItems).reduce((sum, qty) => sum + qty, 0);
    const cartTotal = cartDonuts.reduce((sum, donut) => sum + donut.price * (cartItems[donut.id] ?? 0), 0);
    const addToCart = (donutId: number, amount = 1, closePopup = false) => {
        setCartItems((prev) => ({
            ...prev,
            [donutId]: (prev[donutId] ?? 0) + amount
        }));

        if (closePopup) {
            setActiveDonut(null);
        }
    };

    const removeFromCart = (donutId: number) => {
        setCartItems((prev) => {
            const currentQty = prev[donutId] ?? 0;
            if (currentQty <= 1) {
                const updated = { ...prev };
                delete updated[donutId];
                return updated;
            }

            return {
                ...prev,
                [donutId]: currentQty - 1
            };
        });
    };

    const setCardQuantity = (donutId: number, nextQuantity: number) => {
        setCartItems((prev) => {
            if (nextQuantity <= 0) {
                const updated = { ...prev };
                delete updated[donutId];
                return updated;
            }

            return {
                ...prev,
                [donutId]: nextQuantity
            };
        });
    };

    const clearCart = () => {
        setCartItems({});
    };

    const removeItemCompletely = (donutId: number) => {
        setCartItems((prev) => {
            const updated = { ...prev };
            delete updated[donutId];
            return updated;
        });
    };

    const handleSelectDonut = (donut: Donut) => {
        if (theClickedCard?.id === donut.id) {
            setActiveDonut(donut);
            return;
        }

        setTheClickedCard(donut);
    };

    useEffect(() => {
        saveCartCookie(cartItems);
    }, [cartItems]);

    useEffect(() => {
        let isMounted = true;

        async function loadDonuts() {
            try {
                setIsLoading(true);
                setLoadError('');
                const loadedDonuts = await fetchDonuts();

                if (!isMounted) {
                    return;
                }

                setDonuts(loadedDonuts);
                setTheClickedCard((prev) => {
                    if (prev) {
                        return loadedDonuts.find((donut) => donut.id === prev.id) ?? loadedDonuts[0] ?? null;
                    }

                    return loadedDonuts[0] ?? null;
                });
            } catch (error) {
                if (!isMounted) {
                    return;
                }

                setLoadError('Could not load donuts from the database right now.');
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
        if (!hasMoreDonuts || !loadMoreRef.current) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (entry.isIntersecting) {
                    setVisibleCount((prev) => Math.min(prev + DONUTS_BATCH_SIZE, donuts.length));
                }
            },
            { rootMargin: '0px 0px 320px 0px' }
        );

        observer.observe(loadMoreRef.current);
        return () => observer.disconnect();
    }, [donuts.length, hasMoreDonuts]);

    useEffect(() => {
        if (!activeDonut) {
            return;
        }

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setActiveDonut(null);
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [activeDonut]);

    return (
        <div className='DonutsGallery'>
            <div className="floatingCartArea">
                <div className="cartPanelWrap">
                    <div className="cartSummaryPill">${cartTotal.toFixed(2)}</div>
                    <button
                        type="button"
                        className="cartToggleBtn"
                        onClick={() => setIsCartOpen((prev) => !prev)}
                        aria-label="Show my cart"
                    >
                        <FloatingCartIcon />
                        <strong>{cartCount}</strong>
                    </button>

                    {isCartOpen && (
                        <div className="cartPanel">
                            {cartDonuts.length === 0 ? (
                                <p className="cartEmpty">Your cart is empty.</p>
                            ) : (
                                <>
                                    <div className="cartList">
                                        {cartDonuts.map((donut) => (
                                            <div className="cartRow" key={donut.id}>
                                                <div className="cartRowInfo">
                                                    <img
                                                        src={donut.image}
                                                        alt={donut.name}
                                                        className="cartRowThumb"
                                                    />
                                                    <div className="cartRowCopy">
                                                        <h4>{donut.name}</h4>
                                                        <p>{cartItems[donut.id]} x ${donut.price.toFixed(2)}</p>
                                                    </div>
                                                </div>
                                                <div className="cartRowActions">
                                                    <button
                                                        type="button"
                                                        className="cartRemoveItemBtn"
                                                        onClick={() => removeItemCompletely(donut.id)}
                                                        aria-label={`Remove ${donut.name} from cart`}
                                                    >
                                                        X
                                                    </button>
                                                    <div className="cartQtyControls">
                                                        <button type="button" className="removeCartBtn" onClick={() => removeFromCart(donut.id)}>-</button>
                                                        <span>{cartItems[donut.id]}</span>
                                                        <button type="button" className="removeCartBtn" onClick={() => addToCart(donut.id)}>+</button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="cartFooter">
                                        <div className="cartTotalBlock">
                                            <span>Total</span>
                                            <strong>${cartTotal.toFixed(2)}</strong>
                                        </div>
                                        <div className="cartFooterActions">
                                            <button type="button" className="cartClearBtn" onClick={clearCart}>Clear all</button>
                                            <button type="button" className="cartBuyBtn" onClick={() => navigate('/cart')}>Buy now</button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {theClickedCard && (
                <button
                    type="button"
                    className="floatingSelectedDonut"
                    onClick={() => setActiveDonut(theClickedCard)}
                    aria-label={`Open ${theClickedCard.name} details`}
                >
                    <SelectedDonutIcon />
                    <img src={theClickedCard.image} alt={theClickedCard.name} />
                </button>
            )}

            <div className="donutsOne">
                <div className="donutsOneCopy">
                    <p className="oneTitle">Our donuts, your SQL menu.</p>
                    <h1>Donuts made with data.</h1>
                    <p className="oneText">
                        Have a suggestion for a new flavor? Want to see the nutritional info for your favorites? Our menu is powered by a live connection to your database so it's always up to date and open to your input!
                    </p>
                    <p className="oneContact">Contact us at <a href="mailto:shalevpecksp@hotmail.com">shalevpecksp@hotmail.com</a></p>
                    <p className="oneSummary">{gallerySummary}</p>
                    <div className="oneStatRow">
                        <div className="oneStatCard">
                            <span>Live menu</span>
                            <strong>{donuts.length}</strong>
                        </div>
                        <div className="oneStatCard">
                            <span>Average price</span>
                            <strong>${averagePrice.toFixed(2)}</strong>
                        </div>
                        <div className="oneStatCard">
                            <span>Spotlight now</span>
                            <strong>{theClickedCard?.name ?? 'No pick yet'}</strong>
                        </div>
                    </div>
                </div>
            </div>

            <div className="galleryShell">
                <div className="theGallery">
                    {loadError && <p className="loadStateMessage">{loadError}</p>}
                    {!loadError && !isLoading && donuts.length === 0 && (
                        <p className="loadStateMessage">No donuts were found in the database yet.</p>
                    )}

                    {visibleDonuts.map((donut) => (
                        <Card
                            key={donut.id}
                            theCharacterOfTheCard={donut}
                            bgColor={theColor}
                            setTheClickedCardFunc={handleSelectDonut}
                            isSelected={theClickedCard?.id === donut.id}
                            quantityInCart={cartItems[donut.id] ?? 0}
                            onIncreaseQuantity={() => setCardQuantity(donut.id, (cartItems[donut.id] ?? 0) + 1)}
                            onDecreaseQuantity={() => setCardQuantity(donut.id, (cartItems[donut.id] ?? 0) - 1)}
                        />
                    ))}

                    {hasMoreDonuts && (
                        <div className="loadMoreSentinel" ref={loadMoreRef}>
                            <p>Loading more donuts...</p>
                        </div>
                    )}
                </div>
            </div>

            {activeDonut && (
                <div className="donutModalOverlay" onClick={() => setActiveDonut(null)}>
                    <div className="donutModalCard" onClick={(event) => event.stopPropagation()}>
                        <DetailedView
                            theCharacterToShow={activeDonut}
                            quantityInCart={activeDonutQuantity}
                            onIncreaseQuantity={() => addToCart(activeDonut.id)}
                            onDecreaseQuantity={() => removeFromCart(activeDonut.id)}
                            onClose={() => setActiveDonut(null)}
                            onBuyNow={() => addToCart(activeDonut.id, 1, true)}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}
