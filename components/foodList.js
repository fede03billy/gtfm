// export Food List component made of Food Item components
// Path: components/foodList.js
import { useCategories, useCategoriesUpdate } from './categoriesContext';
import FoodItem from './foodItem';
import { useEffect } from 'react';

export default function FoodList(props) {
  const { food } = props;

  // initialize the category to the first category in the food array
  const category = useCategories();
  const changeCategory = useCategoriesUpdate();
  useEffect(() => {
    changeCategory(food[0].category);
  }, []);

  function specialCategory(item, index) {
    // // switch case for the special categories *** DIDN'T WORK ***
    // switch (category.category) {
    //   // find the various case in components/categories.js
    //   case 'Senza lattosio':
    //     if (item.lactose_free) {
    //       return <FoodItem item={item} key={index} />;
    //     }
    //   case 'Senza glutine':
    //     if (item.gluten_free) {
    //       return <FoodItem item={item} key={index} />;
    //     }
    //   case 'Vegano':
    //     if (item.vegan) {
    //       return <FoodItem item={item} key={index} />;
    //     }
    //   default:
    //     return null;
    // }
    if (category.category === 'Senza lattosio') {
      if (item.lactose_free) {
        return <FoodItem item={item} key={index} />;
      }
    } else if (category.category === 'Senza glutine') {
      if (item.gluten_free) {
        return <FoodItem item={item} key={index} />;
      }
    } else if (category.category === 'Vegano') {
      if (item.vegan) {
        return <FoodItem item={item} key={index} />;
      }
    } else {
      return null;
    }
  }

  return (
    <div
      id="foodListContainer"
      className="relative foodListContainer overflow-y-auto overscroll-contain overflow-hidden scroll-smooth px-4"
    >
      {food.map((item, index) => {
        // if the category is one of the special categories, call the specialCategory function
        if (
          category.category === 'Senza lattosio' ||
          category.category === 'Senza glutine' ||
          category.category === 'Vegano'
        ) {
          return specialCategory(item, index);
        } else if (item.category === category.category) {
          return <FoodItem item={item} key={index} />;
        }
      })}
      {food.filter((item) => {
        if (
          category.category === 'Senza lattosio' ||
          category.category === 'Senza glutine' ||
          category.category === 'Vegano'
        ) {
          return specialCategory(item);
        } else {
          return item.category === category.category;
        }
      }).length === 0 && (
        <p className="text-md text-black opacity-30 mt-[40vh] w-full text-center font-thin">
          Non c&apos;è nulla in questa categoria.
        </p>
      )}
    </div>
  );
}
