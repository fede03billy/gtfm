/** This is a component that gets the food array as props, isolates the
 * categroies in a set and map all the categories in an array of buttons **/
// Path: components/categories.js

import { useState } from 'react';

export default function Categories(props) {
  const { food } = props;
  const [categories, setCategories] = useState(
    new Set(food.map((item) => item.category))
  ); // We can use it as a filter for the food array

  return (
    <div>
      {Array.from(categories).map((item, index) => (
        <button
          className="bg-gray-300 py-2 px-4 rounded shadow hover:bg-gray-400 mr-1"
          key={index}
        >
          {' '}
          {item}{' '}
        </button>
      ))}
    </div>
  );
}
