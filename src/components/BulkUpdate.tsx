import React, { useState } from 'react';
import { useProducts } from '../context/ProductContext';

interface BulkUpdateProps {
  onClose: () => void;
}

export const BulkUpdate: React.FC<BulkUpdateProps> = ({ onClose }) => {
  const { categories, bulkUpdatePrices, roundPrices } = useProducts();
  const [percentage, setPercentage] = useState('');
  const [categoryId, setCategoryId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pct = parseFloat(percentage);
    if (isNaN(pct)) return;

    if (window.confirm(`¿Estás seguro de querer cambiar los precios un ${pct}%? Esta acción no se puede deshacer.`)) {
      bulkUpdatePrices(pct, categoryId || undefined);
      onClose();
    }
  };

  const handleRound = () => {
    if (window.confirm('¿Quieres redondear todos los precios al 50 más cercano?')) {
      roundPrices(categoryId || undefined);
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <p style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#666' }}>
        Aumenta o disminuye los precios masivamente. Usa valores negativos para descuentos (ej. -10).
      </p>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Porcentaje (%)</label>
        <input 
          type="number" 
          value={percentage} 
          onChange={(e) => setPercentage(e.target.value)} 
          placeholder="Ej: 15"
          required
          style={{ width: '100%', padding: '0.5rem' }}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Categoría (Opcional)</label>
        <select 
          value={categoryId} 
          onChange={(e) => setCategoryId(e.target.value)} 
          style={{ width: '100%', padding: '0.5rem' }}
        >
          <option value="">Todas las categorías</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' }}>
        <button 
          type="button" 
          onClick={handleRound} 
          className="btn" 
          style={{ background: '#F5EFE6', color: '#4A3B2A', border: '1px solid #4A3B2A' }}
        >
          Redondear al 50
        </button>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button type="button" onClick={onClose} className="btn" style={{ background: '#eee' }}>Cancelar</button>
          <button type="submit" className="btn btn-primary">Aplicar Cambios</button>
        </div>
      </div>
    </form>
  );
};
