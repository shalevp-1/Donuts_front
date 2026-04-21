import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import './MemberPage.css';
import api from '../../Utils/apiClient';
import { fetchAuthStatus } from '../../Utils/authStatus';

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

export default function MemberPage() {
    const [accountName, setAccountName] = useState('');
    const [points, setPoints] = useState(0);
    const [purchaseCount, setPurchaseCount] = useState(0);
    const [totalSpent, setTotalSpent] = useState(0);
    const [purchases, setPurchases] = useState<PurchaseRow[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        let isMounted = true;

        async function loadMemberPage() {
            try {
                setIsLoading(true);
                setErrorMessage('');

                const authRes = await fetchAuthStatus();

                if (!isMounted) {
                    return;
                }

                if (!authRes.authenticated) {
                    setErrorMessage('You need to be logged in to view your member page.');
                    return;
                }

                const purchasesRes = await api.get('/my-purchases');

                if (!isMounted) {
                    return;
                }

                setAccountName(authRes.name || 'Member');
                setPoints(Number(authRes.points) || 0);
                setPurchaseCount(Number(authRes.purchaseCount) || 0);
                setTotalSpent(Number(authRes.totalSpent) || 0);
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
                    <p>Pulling together your account snapshot and recent donut picks.</p>
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
                <section className="memberOne">
                    <div>
                        <p className="memberTitle">My perks</p>
                        <h1>Hi {accountName}, here is your account snapshot and purchase history.</h1>
                        <p className="memberLead">
                            This space is just for signed-in members, so you can quickly check your rewards, total orders, and the donuts you already picked up.
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
