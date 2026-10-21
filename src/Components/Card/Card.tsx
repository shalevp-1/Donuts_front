import { Donut } from "../../Models/Donuts";
import { formatShekel } from '../../Utils/formatShekel';
import './Card.css';

export default function Card(props: {
    theCharacterOfTheCard: Donut,
    bgColor: string,
    setTheClickedCardFunc: Function,
    isSelected?: boolean,
    quantityInCart: number,
    onIncreaseQuantity: () => void,
    onDecreaseQuantity: () => void
}) {
    return (
        <div className={`CharacterCard ${props.isSelected ? 'selected' : ''}`}>
            <div className='mainCardInfo'>
                <button
                    type="button"
                    className="cardImageButton"
                    onClick={() => props.setTheClickedCardFunc(props.theCharacterOfTheCard)}
                    aria-label={`Open details for ${props.theCharacterOfTheCard.name}`}
                >
                    <img src={props.theCharacterOfTheCard.image} alt={props.theCharacterOfTheCard.name} />
                    <div className="infoCard">
                        <div className="infoCardContent">
                            <h2>{props.theCharacterOfTheCard.name}</h2>
                            <p>{props.theCharacterOfTheCard.description}</p>
                            <h3 className="price">{formatShekel(props.theCharacterOfTheCard.price)}</h3>
                        </div>
                    </div>
                </button>

                <div className="cardText">
                    <h2>{props.theCharacterOfTheCard.name}</h2>
                </div>

                <div className="cardMetaRow">
                    <span className="priceTag">{formatShekel(props.theCharacterOfTheCard.price)}</span>
                    <span className="calorieTag">{props.theCharacterOfTheCard.calories} cal</span>
                </div>

                <div className="cardQuickCart">
                    <button
                        type="button"
                        className="quickQtyBtn"
                        onClick={props.onDecreaseQuantity}
                        aria-label={`Decrease ${props.theCharacterOfTheCard.name} quantity`}
                    >
                        -
                    </button>
                    <span className="quickQtyValue">{props.quantityInCart}</span>
                    <button
                        type="button"
                        className="quickQtyBtn"
                        onClick={props.onIncreaseQuantity}
                        aria-label={`Increase ${props.theCharacterOfTheCard.name} quantity`}
                    >
                        +
                    </button>
                </div>

                <div className="inCartLabel">
                    In cart: {props.quantityInCart}
                </div>
            </div>
        </div>
    );
}
