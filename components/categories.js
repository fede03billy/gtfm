/** This is a component that gets the food array as props, isolates the
 * categroies in a set and map all the categories in an array of buttons **/
// Path: components/categories.js

import { useEffect } from 'react';
import { useCategories, useCategoriesUpdate } from './categoriesContext';

export default function Categories(props) {
  const { food } = props;
  const changeCategory = useCategoriesUpdate();
  const currentCategory = useCategories();

  // Isolate the categories in a set
  const categories = new Set();
  food.forEach((item) => {
    categories.add(item.category);
  });

  useEffect(() => {
    // add a class to the selected category
    const buttons = document.getElementsByClassName('category');
    // cycle through the buttons and add the class to the selected category
    for (let i = 0; i < buttons.length; i++) {
      if (buttons[i].innerText === currentCategory.category) {
        buttons[i].classList.add('border-b-2');
      } else {
        buttons[i].classList.remove('border-b-2');
      }
    }
  }, [categories]);

  return (
    <div className="scrollbar-hide flex w-100 overflow-x-auto overflow-hidden scroll-smooth h-10">
      {Array.from(categories).map((item, index) => (
        <button
          className="category bg-amber-50 py-2 px-4 hover:bg-amber-100 border-amber-600"
          onClick={() => {
            changeCategory(item);
          }}
          key={index}
        >
          {' '}
          {item}{' '}
        </button>
      ))}
    </div>
  );
}
