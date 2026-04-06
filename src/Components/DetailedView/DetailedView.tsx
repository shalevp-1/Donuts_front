import { Donut } from "../../Models/Donuts";
import './DetailedView.css';

function CartIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="actionIcon">
            <path d="M3 5h2l2.1 8.8a1 1 0 0 0 1 .8h8.5a1 1 0 0 0 1-.8L21 8H7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="10" cy="18.5" r="1.4" fill="currentColor" />
            <circle cx="18" cy="18.5" r="1.4" fill="currentColor" />
        </svg>
    );
}

function CloseIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="closeIcon">
            <path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
    );
}

export default function DetailedView(props: {
    theCharacterToShow: Donut,
    quantityInCart: number,
    onIncreaseQuantity: () => void,
    onDecreaseQuantity: () => void,
    onClose?: () => void,
    onBuyNow?: () => void
}) {
    return (
        <div className="DetailedView">
            {props.onClose && (
                <button type="button" className="detailCloseBtn" onClick={props.onClose} aria-label="Close donut details">
                    <CloseIcon />
                </button>
            )}
            <div className="detailImageWrap">
                <img
                    src={props.theCharacterToShow.image}
                    alt={props.theCharacterToShow.name}
                    className="detailImage"
                />
            </div>
            <div className="detailContent">
                <div className="detailHeader">
                    <div>
                        <h2>{props.theCharacterToShow.name}</h2>
                    </div>
                    <span className="detailPrice">${props.theCharacterToShow.price.toFixed(2)}</span>
                </div>
                <p className="detailDescription">{props.theCharacterToShow.description}</p>
                <div className="detailActions">
                    <div className="detailCounter">
                        <button type="button" className="detailQtyBtn" onClick={props.onDecreaseQuantity} aria-label={`Decrease ${props.theCharacterToShow.name} quantity`}>-</button>
                        <span className="detailQtyValue">{props.quantityInCart}</span>
                        <button type="button" className="detailQtyBtn" onClick={props.onIncreaseQuantity} aria-label={`Increase ${props.theCharacterToShow.name} quantity`}>+</button>
                    </div>
                    <button type="button" className="detailAction buyAction" onClick={props.onBuyNow}>
                        <CartIcon />
                        <span>Add to cart</span>
                    </button>
                </div>
                <div className="detailFacts">
                    <div>
                        <span>Calories</span>
                        <strong>{props.theCharacterToShow.calories}</strong>
                    </div>
                    <div>
                        <span>Ingredients</span>
                        <strong>{props.theCharacterToShow.ingredients.length}</strong>
                    </div>
                </div>
                <div className="ingredientList">
                    {props.theCharacterToShow.ingredients.map((ingredient) => (
                        <span key={ingredient}>{ingredient}</span>
                    ))}
                </div>
            </div>
        </div>
    )
}
