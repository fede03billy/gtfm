// export Food List component made of Food Item components
// Path: components/foodList.js
import FoodItemSummary from './foodItemSummary.js';

export default function FoodListSummary({ cart }) {
  // function to modify the cart array to add the quantity of each item and removing the duplicates
  function prepareCart(cart) {
    const modifiedCart = [];
    cart.forEach((item) => {
      const index = modifiedCart.findIndex(
        (cartItem) => cartItem._id === item._id
      );
      if (index === -1) {
        modifiedCart.push({ ...item, quantity: 1 });
      } else {
        modifiedCart[index].quantity++;
      }
    });
    return modifiedCart;
  }

  const modifiedCart = prepareCart(cart);

  return (
    <div>
      {modifiedCart.map((item, index) => {
        return <FoodItemSummary item={item} key={index} />;
      })}
    </div>
  );
}
