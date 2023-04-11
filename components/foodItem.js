// component Food Item to display a card with the food item's name and price, description and image (optional)
// Path: components/foodItem.js
import Add2CartButton from './add2CartButton';

export default function FoodItem(props) {
  const { item } = props;
  const spicy =
    'https://www.svgrepo.com/show/383337/vegetable-food-pepper-chilli-spicy.svg';
  const vegan = 'https://www.svgrepo.com/show/510319/vegan.svg';
  const lactoseFree = 'https://www.svgrepo.com/show/509875/dairy-free.svg';
  const glutenFree = 'https://www.svgrepo.com/show/509969/gluten-free.svg';

  function renderInfo() {
    const info = [];
    if (item.spicy) {
      info.push(<img src={spicy} alt="spicy" className="w-4 h-4" />);
    }
    if (item.vegan) {
      info.push(<img src={vegan} alt="vegan" className="w-4 h-4" />);
    }
    if (item.lactose_free) {
      info.push(
        <img src={lactoseFree} alt="lactose free" className="w-4 h-4" />
      );
    }
    if (item.gluten_free) {
      info.push(<img src={glutenFree} alt="gluten free" className="w-4 h-4" />);
    }
    return info;
  }

  return (
    <div className="food-item flex flex-col justify-center items-center last:mb-4">
      <div className="backdrop-blur-4xl bg-white bg-opacity-30 shadow rounded-lg p-4 mt-4 w-full">
        <div className="flex flex-row justify-between items-center">
          <div className="w-3/4">
            <div className="text-xl font-subtitle flex flex-row">
              {item.name}{' '}
              <span className="mt-1.5 ml-2 flex flex-row">{renderInfo()}</span>
            </div>
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
