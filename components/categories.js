/** This is a component that gets the food array as props, isolates the
 * categroies in a set and map all the categories in an array of buttons **/
// Path: components/categories.js

import { useCategoriesUpdate } from './categoriesContext';

export default function Categories(props) {
  const { food } = props;
  const changeCategory = useCategoriesUpdate();

  // Isolate the categories in a set
  const categories = new Set();
  food.forEach((item) => {
    categories.add(item.category);
  });

  return (
    <div>
      {Array.from(categories).map((item, index) => (
        <button
          className="bg-gray-300 py-2 px-4 rounded shadow hover:bg-gray-400 mr-1"
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
