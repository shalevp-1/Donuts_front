import { Link, useLocation } from 'react-router-dom';
import './ThankYouPage.css';

type ThankYouState = {
    orderId?: number;
    itemCount?: number;
    total?: number;
    pointsEarned?: number;
};

export default function ThankYouPage() {
    const location = useLocation();
    const state = (location.state || {}) as ThankYouState;

    return (
        <div className="ThankYouPage">
            <div className="thankYouCard">
                <p className="thankYouEyebrow">Purchase complete</p>
                <h1>Thank you for your purchase.</h1>
                <p className="thankYouLead">
                    Your donuts are officially on the way. We saved the order to your account and updated your rewards automatically.
                </p>

                <div className="thankYouStats">
                    <article>
                        <span>Order</span>
                        <strong>{state.orderId ? `#${state.orderId}` : 'Saved'}</strong>
                    </article>
                    <article>
                        <span>Items</span>
                        <strong>{state.itemCount ?? 0}</strong>
                    </article>
                    <article>
                        <span>Total</span>
                        <strong>${Number(state.total || 0).toFixed(2)}</strong>
                    </article>
                    <article>
                        <span>Points earned</span>
                        <strong>{state.pointsEarned ?? 0}</strong>
                    </article>
                </div>

                <div className="thankYouActions">
                    <Link to="/my-perks" className="thankYouPrimary">View my perks</Link>
                    <Link to="/donuts" className="thankYouSecondary">Order more donuts</Link>
                </div>
            </div>
        </div>
    );
}
