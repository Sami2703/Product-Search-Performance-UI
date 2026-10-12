// import { useState } from "react";
// import SearchBar from "./components/SearchBar";
// import ProductList from "./components/ProductList";

// function App() {
//   const [products, setProducts] = useState([
//     { id: 1, name: "Laptop", price: 50000 },
//     { id: 2, name: "Mobile", price: 25000 },
//     { id: 3, name: "Headphones", price: 3000 },
//     { id: 4, name: "Keyboard", price: 1500 },
//   ]);

//   const [search, setSearch] = useState("");

//   const filteredProducts = products.filter((product) =>
//     product.name.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <div>
//       <h1>Product Search</h1>

//       <SearchBar
//         search={search}
//         setSearch={setSearch}
//       />

//       <ProductList products={filteredProducts} />
//     </div>
//   );
// }

// export default App;

import  {
  useCallback,
  useMemo,
  useState,
} from "react";

import SearchBar from "./components/SearchBar";
import ProductList from "./components/ProductList";

function App() {
  const [products, setProducts] = useState([
    { id: 1, name: "Laptop", price: 50000 },
    { id: 2, name: "Mobile", price: 25000 },
    { id: 3, name: "Headphones", price: 3000 },
    { id: 4, name: "Keyboard", price: 1500 },
  ]);

  const [search, setSearch] = useState("");

  // 1. Memoized filtering
  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

  // 2. Stable delete function
  const handleDelete = useCallback((id) => {
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== id)
    );
  }, []);

  // 3. Stable edit function
  const handleEdit = useCallback((id, updatedProduct) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id
          ? { ...product, ...updatedProduct }
          : product
      )
    );
  }, []);

  return (
    <div>
      <h1>Product Search Performance UI</h1>

      <SearchBar
        search={search}
        setSearch={setSearch}
      />

      <ProductList
        products={filteredProducts}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
    </div>
  );
}

export default App;