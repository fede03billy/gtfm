// component to display the cart in the order page, it shows the name, price, quantity and remove button of each item in the cart
// Path: components/cart.js

export default function FoodItemSummary(props) {
  const { item, index } = props;

  return (
    <div key={index} className="mb-4">
      <div className="flex flex-row justify-between">
        <div className="text-sm">
          {item.name} ({item.quantity})
        </div>
        <div className="text-sm">{(item.price * item.quantity) / 100} €</div>
      </div>
    </div>
  );
}
