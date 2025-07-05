import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';

function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [loadingMarkets, setLoadingMarkets] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [errorMarkets, setErrorMarkets] = useState(null);
  const [errorProducts, setErrorProducts] = useState(null);

  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    marketId: '',
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchMarkets();
    fetchProducts();
  }, []);

  const fetchMarkets = async () => {
    setLoadingMarkets(true);
    setErrorMarkets(null);
    try {
      const res = await axios.get('http://localhost:8090/api/markets');
      const marketsArray = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.data)
        ? res.data.data
        : null;

      if (marketsArray) {
        const cleanedMarkets = marketsArray.map(({ id, name, location }) => ({
          id,
          name,
          location,
        }));
        setMarkets(cleanedMarkets);
      } else {
        setMarkets([]);
        setErrorMarkets('Markets data format is invalid');
      }
    } catch (err) {
      setErrorMarkets('Failed to fetch markets');
      setMarkets([]);
      console.error('Error fetching markets:', err);
    } finally {
      setLoadingMarkets(false);
    }
  };

  const fetchProducts = async () => {
    setLoadingProducts(true);
    setErrorProducts(null);
    try {
      const res = await axios.get('http://localhost:8090/api/products');
      if (Array.isArray(res.data)) {
        setProducts(res.data);
      } else {
        setProducts([]);
        setErrorProducts('Products data format is invalid');
      }
    } catch (err) {
      setErrorProducts('Failed to fetch products');
      setProducts([]);
      console.error('Error fetching products:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const resetForm = () => {
    setNewProduct({ name: '', description: '', price: '', marketId: '' });
    setEditId(null);
  };

  const handleAddOrUpdateProduct = async (e) => {
    e.preventDefault();

    const { name, description, price, marketId } = newProduct;

    // Validate all fields including marketId as a number
    if (
      !name.trim() ||
      !description.trim() ||
      !price ||
      !marketId ||
      isNaN(Number(marketId))
    ) {
      alert('Please fill in all fields and select a valid market');
      return;
    }

    const payload = {
      name: name.trim(),
      description: description.trim(),
      price: parseFloat(price),
      market: { id: Number(marketId) },
    };

    console.log('Sending payload:', payload);

    try {
      if (editId) {
        await axios.put(`http://localhost:8090/api/products/${editId}`, payload);
      } else {
        await axios.post('http://localhost:8090/api/products', payload);
      }
      fetchProducts();
      resetForm();
    } catch (err) {
      console.error('Failed to save product:', err.response?.data || err.message);
      alert('Failed to save product');
    }
  };

  const handleEdit = (product) => {
    setNewProduct({
      name: product.name,
      description: product.description || '',
      price: product.price?.toString() || '',
      marketId: product.market?.id?.toString() || '',
    });
    setEditId(product.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`http://localhost:8090/api/products/${id}`);
        fetchProducts();
      } catch {
        alert('Failed to delete product');
      }
    }
  };

  return (
    <DashboardLayout>
      <h2>Manage Products</h2>

      {loadingMarkets && <p>Loading markets...</p>}
      {errorMarkets && <p style={{ color: 'red' }}>{errorMarkets}</p>}

      <form onSubmit={handleAddOrUpdateProduct} style={{ marginBottom: '2rem' }}>
        <input
          type="text"
          placeholder="Product Name"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          style={inputStyle}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={newProduct.description}
          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
          style={inputStyle}
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          style={inputStyle}
          step="0.01"
          min="0"
          required
        />
        <select
          value={newProduct.marketId}
          onChange={(e) => setNewProduct({ ...newProduct, marketId: e.target.value })}
          style={inputStyle}
          required
        >
          <option value="">Select Market</option>
          {markets.map((market) => (
            <option key={market.id} value={market.id.toString()}>
              {market.name}
            </option>
          ))}
        </select>

        <button type="submit" style={buttonStyle}>
          {editId ? 'Update Product' : 'Add Product'}
        </button>
        {editId && (
          <button
            type="button"
            onClick={resetForm}
            style={{ ...buttonStyle, backgroundColor: '#999', marginLeft: 10 }}
          >
            Cancel
          </button>
        )}
      </form>

      {loadingProducts && <p>Loading products...</p>}
      {errorProducts && <p style={{ color: 'red' }}>{errorProducts}</p>}

      <div>
        <h3>Available Products:</h3>
        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {products.map((product) => (
              <li key={product.id} style={listItemStyle}>
                <span>
                  <strong>{product.name}</strong> - {product.description} -{' '}
                  {new Intl.NumberFormat('en-TZ', {
                    style: 'currency',
                    currency: 'TZS',
                  }).format(product.price)}{' '}
                  - Market: {product.market?.name || 'N/A'}
                </span>
                <div>
                  <button
                    style={editBtn}
                    onClick={() => handleEdit(product)}
                    aria-label={`Edit ${product.name}`}
                  >
                    Edit
                  </button>
                  <button
                    style={deleteBtn}
                    onClick={() => handleDelete(product.id)}
                    aria-label={`Delete ${product.name}`}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </DashboardLayout>
  );
}

const inputStyle = {
  padding: 10,
  marginRight: 10,
  marginBottom: 10,
  width: 200,
  borderRadius: 4,
  border: '1px solid #ccc',
};

const buttonStyle = {
  padding: '10px 20px',
  backgroundColor: '#1e88e5',
  color: 'white',
  border: 'none',
  borderRadius: 4,
  cursor: 'pointer',
};

const listItemStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  padding: 10,
  marginBottom: 10,
  border: '1px solid #ccc',
  borderRadius: 4,
  backgroundColor: '#f9f9f9',
  alignItems: 'center',
};

const editBtn = {
  padding: '6px 12px',
  marginRight: 8,
  backgroundColor: '#ffb300',
  border: 'none',
  color: 'white',
  borderRadius: 4,
  cursor: 'pointer',
};

const deleteBtn = {
  padding: '6px 12px',
  backgroundColor: '#e53935',
  border: 'none',
  color: 'white',
  borderRadius: 4,
  cursor: 'pointer',
};

export default ManageProducts;
