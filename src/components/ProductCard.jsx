// function ProductCard({ product }) {
//   return (
//     <div>
//       <h3>{product.name}</h3>
//       <p>₹{product.price}</p>
//     </div>
//   );
// }

// export default ProductCard;

import React from "react";

const ProductCard = React.memo(function ProductCard({
  product,
  onDelete,
  onEdit,
}) {
  return (
    <div>
      <h3>{product.name}</h3>
      <p>₹{product.price}</p>

      <button
        onClick={() =>
          onEdit(product.id, {
            name: `${product.name} Updated`,
          })
        }
      >
        Edit
      </button>

      <button onClick={() => onDelete(product.id)}>
        Delete
      </button>
    </div>
  );
});

export default ProductCard;