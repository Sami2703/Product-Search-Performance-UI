# Product Search Performance UI

## 1. Component Structure

```
App
├── SearchBar
├── ProductList
│   └── ProductCard
└── ProductDetails
```
### The data flow will be:
```
products
   ↓
search
   ↓
useMemo()
   ↓
filteredProducts
   ↓
ProductList
   ↓
React.memo(ProductCard)
```

## Part 1 — Search
```
Product list
     ↓
Search input
     ↓
Filtered products
```

#### Use:
filter()

App.jsx

SearchBar.jsx

ProductList.jsx

ProductCard.jsx

### Flow

```
User types "lap"
       ↓
search state updates
       ↓
App re-renders
       ↓
products.filter()
       ↓
filteredProducts
       ↓
ProductList
       ↓
ProductCard
```

# Part 2 — Optimize search
### Use:
useMemo()
for the filtered product calculation.

Currently, filter() runs every time App renders.
We can memoize the filtered result:

```
import { useMemo, useState } from "react";

const filteredProducts = useMemo(() => {
  return products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );
}, [products, search]);

```

Now the complete relevant part becomes:

```
const [search, setSearch] = useState("");

const filteredProducts = useMemo(() => {
  return products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );
}, [products, search]);

```
const [search, setSearch] = useState("");

const filteredProducts = useMemo(() => {
  return products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );
}, [products, search]);

```

### What happens?

```
App renders
     ↓
useMemo checks dependencies
     ↓
products/search changed?
     ↓
YES → calculate filter()
NO  → reuse previous result

```

## Interview answer

```
"useMemo memoizes the result of the filtering calculation. The filtering runs only when products or search changes, which can reduce unnecessary calculations, especially with a large product list."
```

### Important: useMemo does not stop App from re-rendering.


Part 3 — Optimize ProductCard
Use:
React.memo()

```
import React from "react";

const ProductCard = React.memo(function ProductCard({ product }) {
  console.log("ProductCard rendered:", product.name);

  return (
    <div>
      <h3>{product.name}</h3>
      <p>₹{product.price}</p>
    </div>
  );
});

export default ProductCard;

```
Now React can skip rendering ProductCard when its props haven't changed.

## Example
Suppose:
```
Product 1 → Laptop
Product 2 → Mobile
Product 3 → Keyboard

```
If the parent re-renders but the Mobile product prop is unchanged:

```Parent re-render
       ↓
ProductCard
       ↓
Props unchanged?
       ↓
YES
       ↓
Skip unnecessary render

```
## Interview answer

"React.memo memoizes a functional component and can prevent unnecessary child re-renders when its props haven't changed based on shallow comparison."

# Part 4 — Optimize event handler
## Use:
useCallback()

for:
handleDelete
handleEdit

### Without useCallback

```
const handleDelete = (id) => {
  setProducts((prevProducts) =>
    prevProducts.filter((product) => product.id !== id)
  );
};

```

Every render creates a new function reference.
For example:

```
Render 1
handleDelete → function A

Render 2
handleDelete → function B

```

Even though the function does the same thing, the reference is different.

### With useCallback

```
const handleDelete = useCallback((id) => {
  setProducts((prevProducts) =>
    prevProducts.filter((product) => product.id !== id)
  );
}, []);

```
Now React can preserve the function reference between renders until dependencies change.

## Optimize handleEdit

```
const handleEdit = useCallback((id, updatedProduct) => {
  setProducts((prevProducts) =>
    prevProducts.map((product) =>
      product.id === id
        ? { ...product, ...updatedProduct }
        : product
    )
  );
}, []);

```
Then pass them to the child:
```
<ProductCard
  key={product.id}
  product={product}
  onDelete={handleDelete}
  onEdit={handleEdit}
/>

```

And ProductCard:
```
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

      <button onClick={() => onEdit(product.id, {
        name: "Updated Product",
      })}>
        Edit
      </button>

      <button onClick={() => onDelete(product.id)}>
        Delete
      </button>
    </div>
  );
});

export default ProductCard;

```

### Why useCallback matters here

```
React.memo
     +
stable props
     ↓
useCallback
     ↓
stable function reference
     ↓
fewer unnecessary ProductCard renders

```

Without useCallback, this:
```
onDelete={handleDelete}

```
could receive a new function reference after the parent renders.

# Part 6 — Understand the Optimization

### Without optimization

```
State changes
     ↓
Parent re-renders
     ↓
filter() runs again
     ↓
ProductList re-renders
     ↓
ProductCard children may re-render
     ↓
New callback functions are created

```

### With optimization

```
State changes
     ↓
Parent re-renders
     ↓
useMemo
     ↓
Reuse calculation if dependencies unchanged
     ↓
useCallback
     ↓
Stable function references
     ↓
React.memo
     ↓
Skip ProductCard when props are unchanged

```



Part 5 — Explain the optimization
Be able to explain:
Normal rendering
       ↓
Parent re-renders
       ↓
Children may re-render
 
Optimization
       ↓
React.memo
useMemo
useCallback
       ↓
Reduce unnecessary work

## The 3 Most Important Concepts

```
| Tool          | What it optimizes   | Remember      |
|---            |---                  |---            |
| `useMemo`     | Calculated value    | **Value**     |
| `useCallback` | Function reference  | **Function**  |
| `React.memo`  | Component re-render | **Component** |

```

###  Easy memory trick

```
React.memo  → Component
useMemo     → Value
useCallback → Function

```
# 🎤 Interview question
### "How would you optimize a React application if unnecessary re-renders were causing performance issues?"

### 60-second interview answer
"First, I would identify the actual source of unnecessary re-renders using React DevTools Profiler rather than optimizing everything blindly. I would check whether components are re-rendering because of state, props, parent renders, or Context changes. For expensive child components, I can use React.memo when their props remain stable. For expensive calculations like filtering or sorting a large list, I can use useMemo. If I pass callbacks to memoized children, I can use useCallback to maintain stable function references. I would also keep state colocated, split large Contexts when appropriate, and use lazy loading for heavy components. Finally, I would measure the improvement with profiling."

### Short interview version
"I first identify the unnecessary renders using React DevTools Profiler. Then I use React.memo for suitable child components, useMemo for expensive calculations, and useCallback for stable callback references. I also colocate state, optimize Context usage, and lazy-load heavy components where needed."

### 🎯 Follow-up Questions You Should Prepare
1. Does React.memo completely prevent re-renders?
2. Does useMemo prevent a component from re-rendering?
3. Why do we need useCallback with React.memo?
4. What happens if we use useCallback everywhere?
5. What is shallow comparison in React.memo?
6. When should you NOT use useMemo?
7. How do you identify unnecessary re-renders?
8. What is React DevTools Profiler?
9. Can Context cause unnecessary re-renders?
10. How would you optimize a list containing 10,000 products?

## ⭐ One important interview correction
### Don't say:
### "useMemo prevents re-rendering."

### Say:
### "useMemo prevents unnecessary recalculation of a value; React.memo can prevent an unnecessary child component render when its props are unchanged."
