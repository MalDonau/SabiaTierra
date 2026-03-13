import React, { useState, useEffect } from 'react';
import { useProducts } from '../context/ProductContext';
import { Product } from '../types';

interface ProductFormProps {
  productToEdit?: Product | null;
  onClose: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({ productToEdit, onClose }) => {
  const { addProduct, updateProduct, categories, addCategory } = useProducts();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [providerPrice, setProviderPrice] = useState('');
  const [price1kg, setPrice1kg] = useState('');
  const [price500g, setPrice500g] = useState('');
  const [price250g, setPrice250g] = useState('');
  const [category, setCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setDescription(productToEdit.description || '');
      setProviderPrice(productToEdit.providerPrice?.toString() || '');
      setPrice1kg(productToEdit.price1kg?.toString() || '');
      setPrice500g(productToEdit.price500g?.toString() || '');
      setPrice250g(productToEdit.price250g?.toString() || '');
      setCategory(productToEdit.category);
    } else {
      if (categories.length > 0) setCategory(categories[0].id);
    }
  }, [productToEdit, categories]);

  const roundTo50 = (num: number) => Math.round(num / 50) * 50;

  const handleProviderPriceChange = (val: string) => {
    setProviderPrice(val);
    const base = parseFloat(val);
    if (!isNaN(base)) {
      // Logic: 1kg + 40%, 500g (base/2) + 45%, 250g (base/4) + 50%
      // Automatically rounding to 50 as requested
      const p1 = roundTo50(base * 1.40);
      const p500 = roundTo50((base / 2) * 1.45);
      const p250 = roundTo50((base / 4) * 1.50);
      
      setPrice1kg(p1.toString());
      setPrice500g(p500.toString());
      setPrice250g(p250.toString());
    }
  };

  const handleManualRound = () => {
    if (price1kg) setPrice1kg(roundTo50(parseFloat(price1kg)).toString());
    if (price500g) setPrice500g(roundTo50(parseFloat(price500g)).toString());
    if (price250g) setPrice250g(roundTo50(parseFloat(price250g)).toString());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let finalCategoryId = category;

    if (showNewCategoryInput && newCategory.trim()) {
      addCategory(newCategory);
      const existing = categories.find(c => c.name.toLowerCase() === newCategory.toLowerCase());
      if (existing) finalCategoryId = existing.id;
    }

    const productData = {
      name,
      description,
      providerPrice: providerPrice ? parseFloat(providerPrice) : undefined,
      price1kg: price1kg ? parseFloat(price1kg) : undefined,
      price500g: price500g ? parseFloat(price500g) : undefined,
      price250g: price250g ? parseFloat(price250g) : undefined,
      category: finalCategoryId
    };

    if (productToEdit) {
      updateProduct(productToEdit.id, productData);
    } else {
      addProduct(productData);
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Nombre del Producto</label>
        <input 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
          style={{ width: '100%', padding: '0.5rem' }}
        />
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Descripción (Ingredientes/Detalles)</label>
        <input 
          type="text" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          placeholder="Ej: Nuez, almendra, maní..."
          style={{ width: '100%', padding: '0.5rem' }}
        />
      </div>

      <div style={{ background: '#f0f7f0', padding: '1rem', borderRadius: '8px', border: '1px solid #2E7D32' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#1B5E20' }}>
          Precio de Proveedor (Costo base)
        </label>
        <input 
          type="number" 
          step="0.01" 
          value={providerPrice} 
          onChange={(e) => handleProviderPriceChange(e.target.value)} 
          placeholder="Introduce el costo para calcular automáticamente"
          style={{ width: '100%', padding: '0.6rem', border: '2px solid #2E7D32', borderRadius: '4px' }}
        />
        <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.5rem' }}>
          * Calcula: 1kg (+40%), 500g (+45%), 250g (+50%)
        </p>
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Precio 1 Kg</label>
          <input 
            type="number" 
            step="0.01" 
            value={price1kg} 
            onChange={(e) => setPrice1kg(e.target.value)} 
            placeholder="$"
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Precio 500 gr</label>
          <input 
            type="number" 
            step="0.01" 
            value={price500g} 
            onChange={(e) => setPrice500g(e.target.value)} 
            placeholder="$"
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Precio 250 gr</label>
          <input 
            type="number" 
            step="0.01" 
            value={price250g} 
            onChange={(e) => setPrice250g(e.target.value)} 
            placeholder="$"
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Categoría</label>
        {!showNewCategoryInput ? (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)} 
              style={{ flex: 1, padding: '0.5rem' }}
            >
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <button 
              type="button" 
              onClick={() => setShowNewCategoryInput(true)}
              className="btn btn-secondary"
            >
              +
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input 
              type="text" 
              value={newCategory} 
              onChange={(e) => setNewCategory(e.target.value)} 
              placeholder="Nueva Categoría"
              style={{ flex: 1, padding: '0.5rem' }}
            />
            <button 
              type="button" 
              onClick={() => setShowNewCategoryInput(false)}
              className="btn btn-secondary"
            >
              X
            </button>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
        <button 
          type="button" 
          onClick={handleManualRound} 
          className="btn" 
          style={{ background: '#F5EFE6', color: '#4A3B2A', border: '1px solid #4A3B2A' }}
        >
          Redondear a 00/50
        </button>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button type="button" onClick={onClose} className="btn" style={{ background: '#eee' }}>Cancelar</button>
          <button type="submit" className="btn btn-primary">{productToEdit ? 'Guardar Cambios' : 'Agregar Producto'}</button>
        </div>
      </div>
    </form>
  );
};
