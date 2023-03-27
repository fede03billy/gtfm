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

  return (
    <div className="relative foodListContainer overflow-y-auto overscroll-contain overflow-hidden scroll-smooth px-4">
      {food.map((item, index) => {
        if (item.category === category.category) {
          return <FoodItem item={item} key={index} />;
        }
      })}
      {/* <div className="sticky bottom-0 left-0 w-full h-10 bg-gradient-to-t from-amber-50 z-50 mt-auto"></div> */}
    </div>
  );
}
