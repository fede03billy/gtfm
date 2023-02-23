// component Food Item to display a card with the food item's name and price, description and image (optional)
// Path: components/foodItem.js
import Add2CartButton from './add2CartButton';

export default function FoodItem(props) {
  const { item } = props;

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-4 m-4 w-64">
        <div className="flex flex-col justify-center items-center">
          <div className="text-xl font-bold">{item.name}</div>
          <div className="text-lg font-medium">{item.price / 100} €</div>
          <div className="text-sm font-light">{item.description}</div>
          <Add2CartButton item={item} />
        </div>
      </div>
    </div>
  );
}
