import React, { useState, useEffect } from 'react';
import { User, ShoppingBag, Plus, LogOut } from 'lucide-react';
import AuthScreen from './components/AuthScreen';
import ProductCard from './components/ProductCard';
import ProductFormModal from './components/ProductFormModal';
import ProductDetailModal from './components/ProductDetailModal';

const API_BASE = 'http://localhost:3000';

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const savedUser = sessionStorage.getItem('currentUser');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        sessionStorage.removeItem('currentUser');
      }
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchProducts();
    }
  }, [currentUser]);

  const handleUserLogin = (userData) => {
    setCurrentUser(userData);
    sessionStorage.setItem('currentUser', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('currentUser');
    setProducts([]);
    setSelectedProduct(null);
    closeModal();
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE}/products`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchProductReviews = async (productId) => {
    try {
      const response = await fetch(`${API_BASE}/reviews/${productId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching product reviews:', error);
      return [];
    }
  };

  const fetchAverageRating = async (productId) => {
    try {
      const response = await fetch(`${API_BASE}/reviews/${productId}`);
      if (response.ok) {
        const data = await response.json();
        return data.averageRating || 0;
      }
      return 0;
    } catch (error) {
      console.error('Error fetching average rating:', error);
      return 0;
    }
  };

  const openModal = (type, data = {}) => {
    setModalType(type);
    setFormData(data);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setModalType('');
    setFormData({});
    setIsModalOpen(false);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = formData.id ? 'PUT' : 'POST';
      const endpoint = formData.id 
        ? `${API_BASE}/products/${formData.id}` 
        : `${API_BASE}/products`;
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        closeModal();
        await fetchProducts();
      } else {
        throw new Error('Failed to save product');
      }
    } catch (error) {
      console.error('Error submitting product:', error);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product? This will also delete all its reviews.')) {
      return;
    }
    try {
      const response = await fetch(`${API_BASE}/products/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        await fetchProducts();
        if (selectedProduct && selectedProduct.id === id) {
          setSelectedProduct(null);
        }
      } else {
        throw new Error('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  if (!currentUser) {
    return <AuthScreen onUserLogin={handleUserLogin} />;
  }

  return (
    <div className="min-h-screen  bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 ">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Welcome , {currentUser.first_name}!
            </h1>
            <p className="text-gray-600">Discover and review amazing products</p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
            <div className="flex items-center space-x-2 bg-white rounded-lg px-3 py-2 shadow-sm">
              <User size={20} className="text-gray-600" />
              <span className="text-sm text-gray-700">{currentUser.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 px-3 py-2 rounded-lg bg-white text-gray-800 shadow"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Products</h2>
          <button
            onClick={() => openModal('products')}
            className="bg-blue-600 text-gray-800 px-6 py-3 rounded-lg hover:bg-blue-700 bg-white flex items-center space-x-2 shadow-lg"
          >
            <Plus size={20} />
            <span>Add Product</span>
          </button>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag size={64} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No products yet</h3>
            <p className="text-gray-500 mb-4">Start by adding your first product!</p>
            <button
              onClick={() => openModal('products')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add First Product
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard 
                key={product.id} 
                product={product}
                onEdit={(product) => openModal('products', product)}
                onDelete={handleDeleteProduct}
                onView={setSelectedProduct}
                fetchAverageRating={fetchAverageRating}
                fetchProductReviews={fetchProductReviews}
              />
            ))}
          </div>
        )}
      </div>

      <ProductFormModal 
        isOpen={isModalOpen && modalType === 'products'}
        formData={formData}
        setFormData={setFormData}
        onClose={closeModal}
        onSubmit={handleProductSubmit}
      />
      
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          currentUser={currentUser}
          onClose={() => setSelectedProduct(null)}
          fetchProductReviews={fetchProductReviews}
          fetchAverageRating={fetchAverageRating}
          apiBase={API_BASE}
        />
      )}
    </div>
  );
};

export default App;
