import React, { useState } from 'react';
import { useProducts } from '../context/ProductContext';
import { Product } from '../types';
import { Edit2, Trash2, Plus, TrendingUp } from 'lucide-react';
import { Modal } from './Modal';
import { ProductForm } from './ProductForm';
import { BulkUpdate } from './BulkUpdate';

export const ProductList: React.FC = () => {
  const { products, deleteProduct, categories } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory ? p.category === filterCategory : true;
    return matchesSearch && matchesCategory;
  });

  const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || 'Sin Categoría';

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Eliminar este producto?')) {
      deleteProduct(id);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2>Mis Productos</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            className="btn btn-secondary" 
            onClick={() => setIsBulkOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <TrendingUp size={16} /> Actualizar Precios
          </button>
          <button 
            className="btn btn-primary" 
            onClick={() => setIsFormOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Plus size={16} /> Nuevo Producto
          </button>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <input 
            type="text" 
            placeholder="Buscar producto..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
          />
          <select 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
          >
            <option value="">Todas las categorías</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee' }}>
                <th style={{ padding: '1rem' }}>Producto</th>
                <th style={{ padding: '1rem' }}>Categoría</th>
                <th style={{ padding: '1rem' }}>Costo</th>
                <th style={{ padding: '1rem' }}>1 Kg</th>
                <th style={{ padding: '1rem' }}>500 gr</th>
                <th style={{ padding: '1rem' }}>250 gr</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 500 }}>{p.name}</div>
                    {p.description && <div style={{ fontSize: '0.85rem', color: '#666' }}>{p.description}</div>}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      background: '#f0f0f0', 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '12px', 
                      fontSize: '0.85rem' 
                    }}>
                      {getCategoryName(p.category)}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', color: '#666' }}>{p.providerPrice ? `$${p.providerPrice}` : '-'}</td>
                  <td style={{ padding: '1rem' }}>{p.price1kg ? `$${p.price1kg}` : '-'}</td>
                  <td style={{ padding: '1rem' }}>{p.price500g ? `$${p.price500g}` : '-'}</td>
                  <td style={{ padding: '1rem' }}>{p.price250g ? `$${p.price250g}` : '-'}</td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <button 
                      onClick={() => handleEdit(p)}
                      style={{ marginRight: '0.5rem', background: 'none', border: 'none', color: '#2E7D32' }}
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(p.id)}
                      style={{ background: 'none', border: 'none', color: '#d32f2f' }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
                    No se encontraron productos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal 
        isOpen={isFormOpen} 
        onClose={handleCloseForm} 
        title={editingProduct ? "Editar Producto" : "Nuevo Producto"}
      >
        <ProductForm productToEdit={editingProduct} onClose={handleCloseForm} />
      </Modal>

      <Modal
        isOpen={isBulkOpen}
        onClose={() => setIsBulkOpen(false)}
        title="Actualización Masiva de Precios"
      >
        <BulkUpdate onClose={() => setIsBulkOpen(false)} />
      </Modal>
    </div>
  );
};
