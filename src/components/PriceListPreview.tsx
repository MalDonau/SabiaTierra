import React, { useRef, useState, useLayoutEffect } from 'react';
import { useProducts } from '../context/ProductContext';
import { FileText, Image as ImageIcon } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const PriceListPreview: React.FC = () => {
  const { products, categories } = useProducts();
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [isExporting, setIsExporting] = useState(false);
  const [title, setTitle] = useState('Lista de Precios');
  const [subtitle, setSubtitle] = useState(`Actualizado: ${new Date().toLocaleDateString()}`);

  const productsByCategory = categories.map(cat => ({
    ...cat,
    items: products.filter(p => p.category === cat.id)
  })).filter(cat => cat.items.length > 0);

  // Auto-scale logic: fit content into 1600px height
  useLayoutEffect(() => {
    if (containerRef.current && contentRef.current) {
      const MAX_HEIGHT = 1600;
      // We need to measure without any scale first
      const originalTransform = contentRef.current.style.transform;
      contentRef.current.style.transform = 'none';
      const contentHeight = contentRef.current.scrollHeight;
      contentRef.current.style.transform = originalTransform;
      
      if (contentHeight > MAX_HEIGHT) {
        const newScale = (MAX_HEIGHT - 40) / contentHeight; // Leave a tiny margin
        setScale(newScale);
      } else {
        setScale(1);
      }
    }
  }, [products, categories, title, subtitle]);

  const handleDownloadImage = async () => {
    if (!containerRef.current) return;
    setIsExporting(true);
    
    try {
      const canvas = await html2canvas(containerRef.current, {
        scale: 2, 
        backgroundColor: '#F5EFE6',
        width: 900,
        height: 1600,
        useCORS: true,
        onclone: (clonedDoc) => {
          const element = clonedDoc.getElementById('price-list-capture-area');
          if (element) {
            element.style.transform = 'none';
            element.style.marginBottom = '0';
          }
        }
      });
      
      const link = document.createElement('a');
      link.download = `sabia-tierra-precios-${new Date().toISOString().split('T')[0]}.jpg`;
      link.href = canvas.toDataURL('image/jpeg', 0.95);
      link.click();
    } catch (err) {
      console.error('Error generating image:', err);
      alert('Hubo un error al generar la imagen.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!containerRef.current) return;
    setIsExporting(true);

    try {
      const canvas = await html2canvas(containerRef.current, {
        scale: 2,
        backgroundColor: '#F5EFE6',
        width: 900,
        height: 1600,
        onclone: (clonedDoc) => {
          const element = clonedDoc.getElementById('price-list-capture-area');
          if (element) {
            element.style.transform = 'none';
            element.style.marginBottom = '0';
          }
        }
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [900, 1600]
      });

      pdf.addImage(imgData, 'JPEG', 0, 0, 900, 1600);
      pdf.save(`sabia-tierra-precios-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (err) {
      console.error('Error generating PDF:', err);
      alert('Hubo un error al generar el PDF.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2>Vista Previa (900 x 1600)</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            className="btn btn-secondary" 
            onClick={handleDownloadImage}
            disabled={isExporting}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <ImageIcon size={16} /> Descargar Imagen
          </button>
          <button 
            className="btn btn-primary" 
            onClick={handleDownloadPDF}
            disabled={isExporting}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <FileText size={16} /> Descargar PDF
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
        <input 
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título del documento"
          style={{ padding: '0.5rem', flex: 1 }}
        />
        <input 
          type="text" 
          value={subtitle} 
          onChange={(e) => setSubtitle(e.target.value)}
          placeholder="Subtítulo / Fecha"
          style={{ padding: '0.5rem', flex: 1 }}
        />
      </div>

      <div style={{ 
        overflow: 'auto', 
        background: '#333', 
        padding: '3rem 2rem', 
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        minHeight: '80vh'
      }}>
        <div 
          ref={containerRef}
          id="price-list-capture-area"
          style={{ 
            width: '900px', 
            height: '1600px',
            background: '#F5EFE6', 
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5), rgba(255,255,255,0.5))',
            boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
            color: '#4A3B2A', 
            fontFamily: "'Playfair Display', serif",
            overflow: 'hidden', 
            position: 'relative',
            flexShrink: 0,
            transform: 'scale(0.45)',
            transformOrigin: 'top center',
            marginBottom: '-880px'
          }}
        >
          <div 
            ref={contentRef}
            style={{
              padding: '2rem 2.5rem',
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              transform: `scale(${scale})`,
              transformOrigin: 'top center',
              width: '100%',
            }}
          >
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '1rem', flexShrink: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.5rem', marginBottom: '0.5rem' }}>
                <img 
                  src="./logo.png" 
                  alt="Sabia Tierra Logo" 
                  style={{ width: '160px', height: 'auto' }} 
                />
                <div style={{ borderLeft: '2px solid #4A3B2A', paddingLeft: '1.5rem', textAlign: 'left' }}>
                  <h1 style={{ 
                    fontSize: '2.5rem', 
                    color: '#4A3B2A',
                    margin: 0,
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    lineHeight: 1
                  }}>
                    Lista de<br/>Precios
                  </h1>
                </div>
              </div>
              
              <div style={{ borderTop: '2px solid #4A3B2A', borderBottom: '2px solid #4A3B2A', padding: '0.4rem 0', margin: '0.4rem 0' }}>
                 <p style={{ fontSize: '0.9rem', color: '#6D5642', margin: 0, fontWeight: 'bold', textTransform: 'uppercase' }}>
                  Consultar por entrega gratis en Maschwitz
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 100px 100px', paddingRight: '1rem', marginTop: '0.5rem', fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '2px solid #4A3B2A', paddingBottom: '0.3rem' }}>
                <div></div>
                <div style={{ textAlign: 'right' }}>1 Kg</div>
                <div style={{ textAlign: 'right' }}>500 gr</div>
                <div style={{ textAlign: 'right' }}>250 gr</div>
              </div>
            </div>

            {/* List */}
            <div style={{ flex: 1 }}>
              {productsByCategory.map((cat, catIndex) => (
                <div key={cat.id} style={{ display: 'flex', borderTop: '1px solid #FFF', minHeight: '3rem' }}>
                  {/* Category Label - Fixed for export compatibility */}
                  <div style={{ 
                    width: '45px', 
                    background: catIndex % 2 === 0 ? '#4A3B2A' : '#6D5642', // Alternating Brown shades
                    color: 'white', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <span style={{
                      transform: 'rotate(-90deg)',
                      whiteSpace: 'nowrap',
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                      letterSpacing: '1px',
                      display: 'block',
                      width: '1000px', // Extra width to allow rotation without wrapping
                      textAlign: 'center'
                    }}>
                      {cat.name.toUpperCase()}
                    </span>
                  </div>

                  <div style={{ 
                    flex: 1,
                    background: catIndex % 2 === 0 ? 'rgba(74, 59, 42, 0.12)' : 'rgba(255, 255, 255, 0.3)' // More marked difference between categories
                  }}>
                    {cat.items.map((p, index) => (
                      <div key={p.id} style={{ 
                        display: 'grid', 
                        gridTemplateColumns: '1fr 100px 100px 100px',
                        padding: '0.35rem 0.8rem',
                        // High contrast stripes for better item separation
                        background: index % 2 === 0 ? 'rgba(255,255,255,0.4)' : 'transparent', 
                        alignItems: 'center',
                        minHeight: '2.6rem',
                        borderBottom: '1px solid rgba(255,255,255,0.2)' // Sutil line between items
                      }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '1.3rem', fontFamily: "'Inter', sans-serif", color: '#4A3B2A', fontWeight: 500, lineHeight: 1.1 }}>
                            {p.name}
                          </span>
                          {p.description && (
                            <span style={{ fontSize: '0.85rem', fontFamily: "'Inter', sans-serif", color: '#6D5642', marginTop: '1px', fontStyle: 'italic' }}>
                              {p.description}
                            </span>
                          )}
                        </div>
                        <span style={{ fontSize: '1.3rem', fontFamily: "'Inter', sans-serif", fontWeight: 'bold', color: '#4A3B2A', textAlign: 'right' }}>
                          {p.price1kg ? `$${p.price1kg.toLocaleString('es-AR')}` : ''}
                        </span>
                        <span style={{ fontSize: '1.3rem', fontFamily: "'Inter', sans-serif", fontWeight: 'bold', color: '#4A3B2A', textAlign: 'right' }}>
                          {p.price500g ? `$${p.price500g.toLocaleString('es-AR')}` : ''}
                        </span>
                        <span style={{ fontSize: '1.3rem', fontFamily: "'Inter', sans-serif", fontWeight: 'bold', color: '#4A3B2A', textAlign: 'right' }}>
                          {p.price250g ? `$${p.price250g.toLocaleString('es-AR')}` : ''}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div style={{ 
              textAlign: 'center', 
              color: 'white', 
              background: '#4A3B2A',
              padding: '1rem',
              fontSize: '1.5rem', 
              fontWeight: 'bold',
              marginTop: '1rem',
              borderRadius: '0 0 8px 8px',
              letterSpacing: '1px',
              flexShrink: 0
            }}>
               11 5737-8570  &nbsp;|&nbsp;  11 4170-3356
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
