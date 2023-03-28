// export Food List component made of Food Item components
// Path: components/foodList.js
import FoodItemCart from './foodItemCart';

export default function FoodList(props) {
  const { cart } = props;

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
    <div className="need-interaction relative overflow-y-auto overscroll-contain overflow-hidden scroll-smooth max-h-[290px]">
      {modifiedCart.map((item, index) => {
        return <FoodItemCart item={item} key={index} />;
      })}
    </div>
  );
}
