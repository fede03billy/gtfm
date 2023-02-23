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
    <div>
      {food.map((item, index) => {
        if (item.category === category.category) {
          return <FoodItem item={item} key={index} />;
        }
      })}
    </div>
  );
}
