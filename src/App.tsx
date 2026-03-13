import { useState } from 'react';
import { ProductList } from './components/ProductList';
import { PriceListPreview } from './components/PriceListPreview';
import { LayoutList, Eye, Undo2, Redo2 } from 'lucide-react';
import { useProducts } from './context/ProductContext';

function App() {
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const { undo, redo, canUndo, canRedo } = useProducts();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ 
        background: '#2E7D32', 
        color: 'white', 
        padding: '1rem 0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <img src="/logo.png" alt="Sabia Tierra" style={{ height: '40px', background: 'white', padding: '2px', borderRadius: '4px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              <span style={{ fontSize: '0.9rem', opacity: 0.8, background: 'rgba(255,255,255,0.2)', padding: '0.1rem 0.5rem', borderRadius: '4px', width: 'fit-content' }}>
                Gestor de Precios
              </span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={undo} 
                  disabled={!canUndo}
                  title="Deshacer (Ctrl+Z)"
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: 'white', 
                    opacity: canUndo ? 1 : 0.4,
                    cursor: canUndo ? 'pointer' : 'default',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <Undo2 size={18} />
                </button>
                <button 
                  onClick={redo} 
                  disabled={!canRedo}
                  title="Rehacer (Ctrl+Shift+Z)"
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: 'white', 
                    opacity: canRedo ? 1 : 0.4,
                    cursor: canRedo ? 'pointer' : 'default',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <Redo2 size={18} />
                </button>
              </div>
            </div>
          </div>
          
          <nav style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={() => setActiveTab('editor')}
              style={{ 
                background: activeTab === 'editor' ? 'white' : 'transparent',
                color: activeTab === 'editor' ? '#2E7D32' : 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: 500
              }}
            >
              <LayoutList size={18} /> Editor
            </button>
            <button 
              onClick={() => setActiveTab('preview')}
              style={{ 
                background: activeTab === 'preview' ? 'white' : 'transparent',
                color: activeTab === 'preview' ? '#2E7D32' : 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: 500
              }}
            >
              <Eye size={18} /> Vista Previa
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '2rem 0' }}>
        {activeTab === 'editor' ? <ProductList /> : <PriceListPreview />}
      </main>

      {/* Footer */}
      <footer style={{ background: '#1B5E20', color: 'white', padding: '1rem 0', textAlign: 'center', fontSize: '0.9rem' }}>
        <div className="container">
          &copy; {new Date().getFullYear()} Sabia Tierra. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}

export default App;
