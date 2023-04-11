// component Food Item to display a card with the food item's name and price, description and image (optional)
// Path: components/foodItem.js
import Add2CartButton from './add2CartButton';

export default function FoodItem(props) {
  const { item } = props;

  return (
    <div className="food-item flex flex-col justify-center items-center last:mb-4">
      <div className="backdrop-blur-4xl bg-white bg-opacity-30 shadow rounded-lg p-4 mt-4 w-full">
        <div className="flex flex-row justify-between items-center">
          <div className="w-3/4">
            <div className="text-xl font-subtitle">{item.name}</div>
            <div className="text-md">{item.price / 100} €</div>
            <div className="text-xs font-light font-description">
              {item.description}
            </div>
          </div>
          <div className="w-1/4 pl-4 flex justify-end">
            <Add2CartButton item={item} />
          </div>
        </div>
      </div>
    </div>
  );
}
