const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const CLASIFICACION_NIZA = {
  1: { clase: '01', nombre: 'Productos quimicos' },
  2: { clase: '02', nombre: 'Pinturas, barnices' },
  3: { clase: '03', nombre: 'Cosmeticos, limpieza' },
  4: { clase: '04', nombre: 'Aceites, grasas' },
  5: { clase: '05', nombre: 'Farmaceuticos' },
  6: { clase: '06', nombre: 'Metales, estructuras' },
  7: { clase: '07', nombre: 'Maquinas, motores' },
  8: { clase: '08', nombre: 'Herramientas de mano' },
  9: { clase: '09', nombre: 'Electronica, informatica' },
  10: { clase: '10', nombre: 'Aparatos medicos' },
  11: { clase: '11', nombre: 'Iluminacion, calefaccion' },
  12: { clase: '12', nombre: 'Vehiculos, transporte' },
  13: { clase: '13', nombre: 'Armas, explosivos' },
  14: { clase: '14', nombre: 'Metales preciosos, joyeria' },
  15: { clase: '15', nombre: 'Instrumentos musicales' },
  16: { clase: '16', nombre: 'Papel, productos de imprenta' },
  17: { clase: '17', nombre: 'Caucho, plasticos' },
  18: { clase: '18', nombre: 'Articulos de cuero' },
  19: { clase: '19', nombre: 'Materiales de construccion' },
  20: { clase: '20', nombre: 'Muebles, accesorios' },
  21: { clase: '21', nombre: 'Utensilios de cocina' },
  22: { clase: '22', nombre: 'Cuerdas, redes, textiles' },
  23: { clase: '23', nombre: 'Fibras textiles' },
  24: { clase: '24', nombre: 'Textiles, telas' },
  25: { clase: '25', nombre: 'Prendas de vestir' },
  26: { clase: '26', nombre: 'Encajes, adornos textiles' },
  27: { clase: '27', nombre: 'Revestimientos, alfombras' },
  28: { clase: '28', nombre: 'Juegos, juguetes, deportes' },
  29: { clase: '29', nombre: 'Alimentos de origen animal' },
  30: { clase: '30', nombre: 'Alimentos de origen vegetal' },
  31: { clase: '31', nombre: 'Productos agricolas' },
  32: { clase: '32', nombre: 'Bebidas no alcoholicas' },
  33: { clase: '33', nombre: 'Bebidas alcoholicas' },
  34: { clase: '34', nombre: 'Tabaco, accesorios' },
  35: { clase: '35', nombre: 'Publicidad, servicios comerciales' },
  36: { clase: '36', nombre: 'Seguros, servicios financieros' },
  37: { clase: '37', nombre: 'Construccion, reparacion' },
  38: { clase: '38', nombre: 'Telecomunicaciones' },
  39: { clase: '39', nombre: 'Transporte, logistica' },
  40: { clase: '40', nombre: 'Procesamiento de materiales' },
  41: { clase: '41', nombre: 'Educacion, entretenimiento' },
  42: { clase: '42', nombre: 'Servicios profesionales' },
  43: { clase: '43', nombre: 'Servicios de alimentacion' },
  44: { clase: '44', nombre: 'Servicios medicos, agricolas' },
  45: { clase: '45', nombre: 'Servicios legales y personales' }
};

const KEYWORDS_NIZA = {
  'tecnologia|software|app|digital|internet|web|online|computadora|telefono|smart|data|cloud': [9, 42],
  'alimento|comida|bebida|cafe|pan|chocolate|refrescos|agua|cerveza|vino': [30, 32, 33, 34],
  'ropa|vestir|zapato|calzado|prenda|textil|tela|moda|fashion|adidas|nike': [25, 24],
  'medicina|farmaceutico|medicamento|salud|doctor|hospital|farmacia': [5, 44],
  'transporte|auto|moto|bicicleta|vehiculo|movilidad': [12, 39],
  'hotel|restaurante|bar|cafe|hospedaje|alojamiento': [43],
  'comercio|venta|tienda|mercado|shopping|retail': [35],
  'construccion|edificio|obra|inmueble': [37, 19],
  'educacion|escuela|universidad|curso|formacion': [41],
  'finanzas|banco|dinero|inversion|seguros': [36],
  'belleza|cosmeticos|perfume|maquillaje': [3],
  'deporte|fitness|gym|entrenamiento': [28, 41],
  'musica|instrumento|audio': [15, 41],
  'joyeria|oro|plata|reloj|diamante': [14],
  'mueble|decoracion|hogar|casa|diseno': [20, 21],
  'agencia|consultoria|servicios|asesoria': [35, 42],
  'energia|electricidad|gas|combustible': [4, 11]
};

const sugerirClases = (textoBusqueda) => {
  const texto = textoBusqueda.toLowerCase();
  const clasesSet = new Set();

  Object.entries(KEYWORDS_NIZA).forEach(([keywords, clases]) => {
    const regex = new RegExp(keywords, 'i');
    if (regex.test(texto)) {
      clases.forEach(c => clasesSet.add(c));
    }
  });

  if (clasesSet.size === 0) {
    clasesSet.add(35);
    clasesSet.add(42);
  }

  return Array.from(clasesSet).sort((a, b) => a - b).slice(0, 6);
};

app.post('/api/buscar-marca', (req, res) => {
  try {
    const { marca } = req.body;

    if (!marca || marca.trim().length === 0) {
      return res.status(400).json({ error: 'Marca requerida' });
    }

    const marcaLimpia = marca.trim();
    const clasesRecomendadas = sugerirClases(marcaLimpia);
    const disponible = Math.random() > 0.35;
    
    const conflictos = !disponible ? [
      {
        marca: marcaLimpia + ' Plus',
        titular: 'Distribuidor S.A.',
        estado: 'Vigente',
        clase: clasesRecomendadas[0] || 35,
        numero: Math.floor(Math.random() * 2000000 + 1000000)
      },
      {
        marca: marcaLimpia + ' Argentina',
        titular: 'Empresa XYZ',
        estado: 'En Tramite',
        clase: clasesRecomendadas[0] || 35,
        numero: Math.floor(Math.random() * 2000000 + 1000000)
      }
    ] : [];

    res.json({
      marca: marcaLimpia,
      disponible: disponible,
      conflictos: conflictos,
      clasesRecomendadas: clasesRecomendadas,
      fechaBusqueda: new Date().toLocaleDateString('es-AR'),
      fuente: 'INPI - Datos Simulados',
      nota: 'Para consultas definitivas: https://portaltramites.inpi.gob.ar'
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al procesar' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/', (req, res) => {
  res.json({ nombre: 'API Verificador de Marcas', version: '1.0.0' });
});

module.exports = app;

if (require.main === module) {
  app.listen(process.env.PORT || 3000);
}
