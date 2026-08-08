import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Zap, Download } from 'lucide-react';

const MarcaChecker = () => {
  const [marca, setMarca] = useState('');
  const [resultados, setResultados] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  
  // ⚠️ CAMBIAR ESTO: reemplaza con tu URL de Vercel después de deployar
  const API_URL = 'https://marca-checker.vercel.app';

  const CLASIFICACION_NIZA = {
    1: { clase: '01', nombre: 'Productos químicos, farmacéuticos', desc: 'Químicos industriales, fitosanitarios' },
    2: { clase: '02', nombre: 'Pinturas, barnices, tintes', desc: 'Pinturas, lacas, preservantes' },
    3: { clase: '03', nombre: 'Cosméticos, productos de limpieza', desc: 'Jabones, champús, dentífricos' },
    4: { clase: '04', nombre: 'Aceites, grasas, combustibles', desc: 'Aceites, gasolina, gas' },
    5: { clase: '05', nombre: 'Farmacéuticos, suplementos', desc: 'Medicinas, vitaminas, desinfectantes' },
    6: { clase: '06', nombre: 'Metales, estructuras', desc: 'Hierro, acero, tuberías' },
    7: { clase: '07', nombre: 'Máquinas, motores', desc: 'Herramientas eléctricas, bombas' },
    8: { clase: '08', nombre: 'Herramientas de mano', desc: 'Cuchillos, destornilladores, sierras' },
    9: { clase: '09', nombre: 'Electrónica, informática', desc: 'Computadoras, teléfonos, software' },
    10: { clase: '10', nombre: 'Aparatos médicos', desc: 'Instrumentos quirúrgicos, prótesis' },
    11: { clase: '11', nombre: 'Iluminación, aparatos de calefacción', desc: 'Lámparas, calefactores, radiadores' },
    12: { clase: '12', nombre: 'Vehículos, transporte', desc: 'Autos, motos, bicicletas' },
    13: { clase: '13', nombre: 'Armas, explosivos', desc: 'Armas de fuego, municiones' },
    14: { clase: '14', nombre: 'Metales preciosos, joyería', desc: 'Oro, plata, relojes, joyas' },
    15: { clase: '15', nombre: 'Instrumentos musicales', desc: 'Guitarras, pianos, violines' },
    16: { clase: '16', nombre: 'Papel, productos de imprenta', desc: 'Libros, folletos, papelería' },
    17: { clase: '17', nombre: 'Caucho, plásticos, materiales', desc: 'Gomas, plásticos, aislantes' },
    18: { clase: '18', nombre: 'Artículos de cuero, equipaje', desc: 'Bolsas, maletas, cinturones' },
    19: { clase: '19', nombre: 'Materiales de construcción', desc: 'Baldosas, tejas, cerámicas' },
    20: { clase: '20', nombre: 'Muebles, accesorios', desc: 'Sillas, mesas, espejos' },
    21: { clase: '21', nombre: 'Utensilios de cocina, hogar', desc: 'Platos, vasos, cubiertos' },
    22: { clase: '22', nombre: 'Cuerdas, redes, textiles', desc: 'Cáñamo, redes de pesca' },
    23: { clase: '23', nombre: 'Fibras textiles', desc: 'Lana, algodón, seda' },
    24: { clase: '24', nombre: 'Textiles, telas', desc: 'Telas, toallas, mantas' },
    25: { clase: '25', nombre: 'Prendas de vestir', desc: 'Ropa, zapatos, sombreros' },
    26: { clase: '26', nombre: 'Encajes, adornos textiles', desc: 'Cintas, encajes, botones' },
    27: { clase: '27', nombre: 'Revestimientos, alfombras', desc: 'Tapetes, alfombras, cortinas' },
    28: { clase: '28', nombre: 'Juegos, juguetes, deportes', desc: 'Juguetes, equipos deportivos' },
    29: { clase: '29', nombre: 'Alimentos de origen animal', desc: 'Carnes, pescado, conservas' },
    30: { clase: '30', nombre: 'Alimentos de origen vegetal', desc: 'Café, pan, azúcar, chocolate' },
    31: { clase: '31', nombre: 'Productos agrícolas', desc: 'Granos, semillas, plantas' },
    32: { clase: '32', nombre: 'Bebidas alcohólicas y no alcohólicas', desc: 'Cerveza, vino, refrescos, agua' },
    33: { clase: '33', nombre: 'Bebidas alcohólicas (destiladas)', desc: 'Licores, whisky, vodka' },
    34: { clase: '34', nombre: 'Tabaco, accesorios', desc: 'Cigarrillos, puros' },
    35: { clase: '35', nombre: 'Publicidad, servicios comerciales', desc: 'Publicidad, marketing, contabilidad' },
    36: { clase: '36', nombre: 'Seguros, servicios financieros', desc: 'Seguros, hipotecas, inversiones' },
    37: { clase: '37', nombre: 'Construcción, reparación', desc: 'Construcción, plomería, electricidad' },
    38: { clase: '38', nombre: 'Telecomunicaciones', desc: 'Telefonía, internet, transmisión' },
    39: { clase: '39', nombre: 'Transporte, logística', desc: 'Transporte, almacenamiento, embalaje' },
    40: { clase: '40', nombre: 'Procesamiento de materiales', desc: 'Impresión, teñido, transformación' },
    41: { clase: '41', nombre: 'Educación, entretenimiento', desc: 'Educación, cine, teatro, deportes' },
    42: { clase: '42', nombre: 'Servicios profesionales y técnicos', desc: 'Consultoría, ingeniería, análisis' },
    43: { clase: '43', nombre: 'Servicios de alimentación y hospedaje', desc: 'Hoteles, restaurantes, bares' },
    44: { clase: '44', nombre: 'Servicios médicos, agrícolas', desc: 'Medicina, veterinaria, agricultura' },
    45: { clase: '45', nombre: 'Servicios legales y personales', desc: 'Asesoría legal, seguridad, adopción' }
  };

  const handleBuscar = async (e) => {
    e.preventDefault();
    if (!marca.trim()) return;

    setCargando(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/buscar-marca`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ marca: marca.trim() })
      });

      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
      }

      const datos = await response.json();
      setResultados(datos);
    } catch (err) {
      setError(`Error al consultar: ${err.message}. Verifica que el servidor esté en línea.`);
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  const descargarExcel = () => {
    if (!resultados) return;

    // CSV simple que Excel abre perfectamente
    const csv = [
      ['VERIFICADOR DE MARCAS - INPI'],
      ['Fecha de consulta', resultados.fechaBusqueda],
      ['Marca consultada', resultados.marca],
      [],
      ['DISPONIBILIDAD'],
      ['Estado', resultados.disponible ? 'Disponible' : 'Conflictos detectados'],
      ['Fuente', resultados.fuente],
      [],
      ['CLASES NIZA RECOMENDADAS'],
      ...resultados.clasesRecomendadas.map(numClase => {
        const c = CLASIFICACION_NIZA[numClase];
        return [c.clase, c.nombre, c.desc];
      }),
      [],
      ['CONFLICTOS DETECTADOS'],
      ['Marca', 'Titular', 'Estado', 'Clase', 'Número'],
      ...resultados.conflictos.map(conf => [
        conf.marca,
        conf.titular,
        conf.estado,
        conf.clase,
        conf.numero
      ]),
      [],
      ['POSICIONES RECOMENDADAS'],
      ...resultados.posiciones.flatMap(pos => [
        [`Clase ${pos.clase.clase} - ${pos.clase.nombre}`],
        ...pos.recomendaciones.map(rec => [`Posición ${rec.posicion}`, rec.desc])
      ]),
      [],
      ['NOTAS LEGALES'],
      ['Esta búsqueda es informativa. Consultar INPI directamente para registro oficial.']
    ];

    const csvString = csv.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `Marca_${resultados.marca}_${resultados.fechaBusqueda}.csv`);
    link.click();
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F7FA' }}>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif;
          color: #1a1a1a;
        }

        .header {
          background: linear-gradient(135deg, #003366 0%, #1976D2 100%);
          color: white;
          padding: 40px 24px;
          text-align: center;
        }

        .header h1 {
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 8px;
          letter-spacing: -0.5px;
        }

        .header p {
          font-size: 14px;
          opacity: 0.9;
          max-width: 600px;
          margin: 0 auto;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 24px;
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 32px;
        }

        @media (max-width: 768px) {
          .container {
            grid-template-columns: 1fr;
          }
        }

        .sidebar {
          position: sticky;
          top: 20px;
          height: fit-content;
        }

        .search-card {
          background: white;
          border-radius: 8px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.08);
          border: 1px solid #E8EAED;
        }

        .search-card h2 {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 16px;
          color: #003366;
        }

        .search-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .search-input {
          padding: 12px;
          border: 2px solid #E8EAED;
          border-radius: 6px;
          font-size: 14px;
          font-family: inherit;
          transition: all 0.2s;
        }

        .search-input:focus {
          outline: none;
          border-color: #1976D2;
          box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
        }

        .search-btn {
          padding: 12px;
          background: #003366;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .search-btn:hover {
          background: #002244;
          box-shadow: 0 4px 12px rgba(0,51,102,0.2);
        }

        .search-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .download-btn {
          padding: 10px;
          background: #4CAF50;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .download-btn:hover {
          background: #388E3C;
        }

        .results {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .result-card {
          background: white;
          border-radius: 8px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.08);
          border-left: 4px solid #1976D2;
        }

        .result-card.warning {
          border-left-color: #D32F2F;
        }

        .result-card h3 {
          font-size: 14px;
          font-weight: 600;
          color: #003366;
          margin-bottom: 16px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          margin-bottom: 16px;
        }

        .status-badge.disponible {
          background: #E8F5E9;
          color: #1B5E20;
        }

        .status-badge.conflicto {
          background: #FFEBEE;
          color: #B71C1C;
        }

        .clases-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 12px;
          margin-top: 12px;
        }

        .clase-badge {
          background: #F0F4FF;
          border: 1px solid #C5D3FF;
          padding: 12px;
          border-radius: 6px;
          font-size: 13px;
          cursor: default;
        }

        .clase-badge strong {
          display: block;
          color: #003366;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .clase-badge small {
          display: block;
          color: #666;
          font-size: 11px;
          line-height: 1.4;
        }

        .conflicto-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .conflicto-item {
          padding: 12px;
          background: #FFF3E0;
          border-left: 3px solid #D32F2F;
          border-radius: 4px;
          font-size: 13px;
        }

        .conflicto-item strong {
          color: #B71C1C;
          display: block;
          margin-bottom: 4px;
        }

        .error-msg {
          padding: 12px;
          background: #FFEBEE;
          color: #B71C1C;
          border-radius: 6px;
          font-size: 13px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .loading {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #666;
          font-size: 13px;
        }

        .spinner {
          display: inline-block;
          width: 14px;
          height: 14px;
          border: 2px solid #E0E0E0;
          border-top-color: #1976D2;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .posiciones-section {
          margin-top: 16px;
        }

        .posicion-card {
          padding: 12px;
          background: #F5F7FA;
          border-radius: 6px;
          margin-bottom: 8px;
          font-size: 12px;
        }

        .posicion-card strong {
          color: #003366;
          display: block;
          margin-bottom: 6px;
        }

        .posicion-list {
          padding-left: 16px;
          color: #555;
        }

        .posicion-list li {
          margin-bottom: 4px;
          line-height: 1.4;
        }

        .empty-state {
          padding: 40px;
          text-align: center;
          color: #999;
        }

        .empty-state p {
          font-size: 14px;
          margin-bottom: 8px;
        }
      `}</style>

      <div className="header">
        <h1>📋 Verificador de Marcas INPI</h1>
        <p>Consulta en tiempo real + clasificación Niza + posiciones recomendadas</p>
      </div>

      <div className="container">
        {/* Sidebar Búsqueda */}
        <aside className="sidebar">
          <div className="search-card">
            <h2>Buscar Marca</h2>
            <form className="search-form" onSubmit={handleBuscar}>
              <input
                type="text"
                className="search-input"
                placeholder="Ej: TecnoNet, Café Premium"
                value={marca}
                onChange={(e) => setMarca(e.target.value)}
                disabled={cargando}
              />
              <button className="search-btn" disabled={cargando}>
                {cargando ? (
                  <><span className="spinner"></span> Consultando INPI...</>
                ) : (
                  <><Zap size={16} style={{ display: 'inline' }} /> Buscar</>
                )}
              </button>
            </form>

            {resultados && (
              <>
                <hr style={{ margin: '16px 0', borderColor: '#E8EAED' }} />
                <button className="download-btn" onClick={descargarExcel}>
                  <Download size={16} />
                  Descargar Excel
                </button>
              </>
            )}
          </div>
        </aside>

        {/* Resultados */}
        <main>
          {error && (
            <div className="error-msg">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          {!resultados && !cargando && !error && (
            <div className="empty-state">
              <p style={{ fontSize: 32, marginBottom: 16 }}>🔍</p>
              <p>Ingresa una marca para consultar su disponibilidad en INPI</p>
            </div>
          )}

          {resultados && (
            <div className="results">
              {/* Estado de Disponibilidad */}
              <div className={`result-card ${!resultados.disponible ? 'warning' : ''}`}>
                <h3>Estado de Disponibilidad</h3>
                <div className={`status-badge ${resultados.disponible ? 'disponible' : 'conflicto'}`}>
                  {resultados.disponible ? (
                    <><CheckCircle size={16} /> Disponible para registro</>
                  ) : (
                    <><AlertCircle size={16} /> Conflictos detectados</>
                  )}
                </div>
                <p style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>
                  Consulta: {resultados.fechaBusqueda} · Marca: <strong>{resultados.marca}</strong>
                </p>
                <p style={{ fontSize: '12px', color: '#999' }}>
                  {resultados.nota || resultados.fuente}
                </p>
              </div>

              {/* Conflictos Detectados */}
              {resultados.conflictos.length > 0 && (
                <div className="result-card warning">
                  <h3>⚠️ Conflictos Detectados</h3>
                  <div className="conflicto-list">
                    {resultados.conflictos.map((conf, i) => (
                      <div key={i} className="conflicto-item">
                        <strong>{conf.marca}</strong>
                        Titular: {conf.titular} · Estado: {conf.estado} · Clase: {conf.clase} · N°: {conf.numero}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Clases Niza Recomendadas */}
              <div className="result-card">
                <h3>Clasificación Niza Sugerida</h3>
                <div className="clases-grid">
                  {resultados.clasesRecomendadas.map(numClase => {
                    const c = CLASIFICACION_NIZA[numClase];
                    return (
                      <div key={numClase} className="clase-badge">
                        <strong>Clase {c.clase}</strong>
                        <small>{c.nombre}</small>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Posiciones y Recomendaciones */}
              <div className="result-card">
                <h3>Posiciones Recomendadas por Clase</h3>
                {resultados.posiciones.map((pos, idx) => (
                  <div key={idx} className="posicion-card">
                    <strong>Clase {pos.clase.clase} — {pos.clase.nombre}</strong>
                    <ul className="posicion-list">
                      {pos.recomendaciones.map((rec, recIdx) => (
                        <li key={recIdx}>
                          <strong>Posición {rec.posicion}:</strong> {rec.desc}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Notas Legales */}
              <div className="result-card">
                <h3>ℹ️ Consideraciones Legales</h3>
                <ul style={{ fontSize: '13px', color: '#555', lineHeight: 1.6, paddingLeft: 16 }}>
                  <li>Esta búsqueda es informativa. Para registro oficial consultar directamente <strong>INPI</strong>.</li>
                  <li>La clasificación Niza sugerida se basa en análisis de keywords de la marca.</li>
                  <li>Se recomienda busca de similitud exacta y conceptual ante INPI antes de proceder.</li>
                  <li>Verificar antecedentes de marcas registradas por terceros en clases relacionadas.</li>
                </ul>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MarcaChecker;
