import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './MemberPage.css';

type PurchaseItem = {
    donutId: number;
    name: string;
    image: string;
    quantity: number;
    priceEach: number;
    lineTotal: number;
};

type PurchaseRow = {
    id: number;
    itemCount: number;
    total: number;
    pointsEarned: number;
    createdAt: string;
    items: PurchaseItem[];
};

type Coupon = {
    id: string;
    title: string;
    details: string;
    code: string;
};

const coupons: Coupon[] = [
    {
        id: 'glaze10',
        title: '10% Off Your Next Box',
        details: 'Use this on your next order of 6 donuts or more.',
        code: 'GLAZE10'
    },
    {
        id: 'coffeecombo',
        title: 'Free Coffee Pairing',
        details: 'Add any hot drink and pair it with one donut for free.',
        code: 'BREWFREE'
    },
    {
        id: 'sweetsunday',
        title: 'Sunday Sweet Deal',
        details: 'Get 2 extra classic donuts when you order a dozen.',
        code: 'SWEETSUNDAY'
    }
];

export default function MemberPage() {
    const [accountName, setAccountName] = useState('');
    const [points, setPoints] = useState(0);
    const [purchaseCount, setPurchaseCount] = useState(0);
    const [totalSpent, setTotalSpent] = useState(0);
    const [purchases, setPurchases] = useState<PurchaseRow[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    axios.defaults.withCredentials = true;

    useEffect(() => {
        let isMounted = true;

        async function loadMemberPage() {
            try {
                setIsLoading(true);
                setErrorMessage('');

                const [authRes, purchasesRes] = await Promise.all([
                    axios.get('http://localhost:8800/me'),
                    axios.get('http://localhost:8800/my-purchases')
                ]);

                if (!isMounted) {
                    return;
                }

                setAccountName(authRes.data.name || 'Member');
                setPoints(Number(authRes.data.points) || 0);
                setPurchaseCount(Number(authRes.data.purchaseCount) || 0);
                setTotalSpent(Number(authRes.data.totalSpent) || 0);
                setPurchases(purchasesRes.data.purchases || []);
            } catch (error: any) {
                if (!isMounted) {
                    return;
                }

                setErrorMessage(
                    error?.response?.data?.error || 'You need to be logged in to view your member page.'
                );
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        loadMemberPage();

        return () => {
            isMounted = false;
        };
    }, []);

    const latestPurchaseRows = useMemo(() => purchases.slice(0, 6), [purchases]);

    if (isLoading) {
        return (
            <div className="MemberPage">
                <div className="memberCard">
                    <h1>Loading your member space...</h1>
                    <p>Pulling together your perks, coupons, and current donut picks.</p>
                </div>
            </div>
        );
    }

    if (errorMessage) {
        return (
            <div className="MemberPage">
                <div className="memberCard">
                    <h1>This page is for logged-in members</h1>
                    <p>{errorMessage}</p>
                    <Link to="/login" className="memberPrimaryLink">Go to login</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="MemberPage">
            <div className="memberShell">
                <section className="memberHero">
                    <div>
                        <p className="memberEyebrow">My perks</p>
                        <h1>Hi {accountName}, here are your coupons and purchase picks.</h1>
                        <p className="memberLead">
                            This space is just for signed-in members, so you can quickly check your current deals and the donuts you have lined up.
                        </p>
                    </div>
                    <div className="memberTotalCard">
                        <span>Rewards points</span>
                        <strong>{points}</strong>
                    </div>
                </section>

                <section className="memberStatsGrid">
                    <article className="memberStatCard">
                        <span>Total purchases</span>
                        <strong>{purchaseCount}</strong>
                    </article>
                    <article className="memberStatCard">
                        <span>Total spent</span>
                        <strong>${totalSpent.toFixed(2)}</strong>
                    </article>
                    <article className="memberStatCard">
                        <span>Latest points drop</span>
                        <strong>{latestPurchaseRows[0]?.pointsEarned ?? 0}</strong>
                    </article>
                </section>

                <section className="memberSection">
                    <div className="memberSectionHead">
                        <h2>My coupons</h2>
                        <span>{coupons.length} ready to use</span>
                    </div>
                    <div className="couponGrid">
                        {coupons.map((coupon) => (
                            <article className="couponCard" key={coupon.id}>
                                <p className="couponCode">{coupon.code}</p>
                                <h3>{coupon.title}</h3>
                                <p>{coupon.details}</p>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="memberSection">
                    <div className="memberSectionHead">
                        <h2>My purchases</h2>
                        <span>{purchaseCount} completed purchases</span>
                    </div>

                    {latestPurchaseRows.length === 0 ? (
                        <div className="memberEmptyState">
                            <h3>No purchases yet</h3>
                            <p>Your completed orders will show up here after you pay from the cart.</p>
                            <Link to="/donuts" className="memberPrimaryLink">Browse donuts</Link>
                        </div>
                    ) : (
                        <div className="purchaseList">
                            {latestPurchaseRows.map((purchase) => (
                                <article className="purchaseCard purchaseOrderCard" key={purchase.id}>
                                    <div className="purchaseOrderHead">
                                        <div>
                                            <h3>Order #{purchase.id}</h3>
                                            <p>{new Date(purchase.createdAt).toLocaleString()}</p>
                                        </div>
                                        <strong>${purchase.total.toFixed(2)}</strong>
                                    </div>
                                    <div className="purchaseOrderMeta">
                                        <span>{purchase.itemCount} donuts</span>
                                        <span>{purchase.pointsEarned} points earned</span>
                                    </div>
                                    <div className="purchaseItemsList">
                                        {purchase.items.map((item) => (
                                            <div className="purchaseItemRow" key={`${purchase.id}-${item.donutId}`}>
                                                <img src={item.image} alt={item.name} />
                                                <div className="purchaseCopy">
                                                    <h3>{item.name}</h3>
                                                    <p>{item.quantity} x ${item.priceEach.toFixed(2)}</p>
                                                </div>
                                                <strong>${item.lineTotal.toFixed(2)}</strong>
                                            </div>
                                        ))}
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
