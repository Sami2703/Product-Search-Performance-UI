// import ProductCard from "./ProductCard";

// function ProductList({ products }) {
//   return (
//     <div>
//       {products.map((product) => (
//         <ProductCard
//           key={product.id}
//           product={product}
//         />
//       ))}
//     </div>
//   );
// }

// export default ProductList;

import ProductCard from "./ProductCard";

function ProductList({
  products,
  onDelete,
  onEdit,
}) {
  return (
    <div>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}

export default ProductList;