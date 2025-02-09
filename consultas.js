const { Pool } = require("pg");
const format = require('pg-format');

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    password: "4324",
    database: "joyas",
    port: 5432,
    allowExitOnIdle: true
});

const getDate = async () => {
    try {
      const result = await pool.query("SELECT NOW()");
      console.log(result);
    } catch (error) {
      console.error("error al obtener fecha:", error);
    }
};

const obtenerJoyas = async ({ limits = 10, page = 1, order_by="id_ASC"}) => {
  const [nombreColumna, tipoOrden] = order_by.split("_");
  const offset = (page - 1) * limits;
  const formattedQuery = format('SELECT * FROM inventario ORDER BY %s %s LIMIT %s OFFSET %s',
    nombreColumna, tipoOrden, limits, offset);
  const { rows: joyas } = await pool.query(formattedQuery);
  return joyas;
};

const obtenerJoyasPorFiltros = async ({ precio_max, precio_min, categoria, metal }) => {
  let filtros = [];
  const values = [];
  const agregarFiltro = (nombreColumna, comparador, valor) => {
    values.push(valor);
    const { length } = filtros;
    filtros.push(`${nombreColumna} ${comparador} $${length + 1}`);
  }

  if (precio_max) {
    agregarFiltro('precio', '<=', precio_max);
  };
  if (precio_min) {
    agregarFiltro('precio', '>=', precio_min);
  };
  if (categoria) {
    agregarFiltro('categoria', '=', categoria);
  };
  if (metal) {
    agregarFiltro('metal', '=', metal);
  };

  let consulta = "SELECT * FROM inventario";
  if (filtros.length > 0) {
    filtros = filtros.join(" AND ");
    consulta += ` WHERE ${filtros}`;
  }
  const { rows: joyas } = await pool.query(consulta, values);
  return joyas;
};

const prepararHATEOAS = (joyas) => {
  const results = joyas.map((joya) => {
    return {
      name: joya.nombre,
      href: `/joyas/joya/${joya.id}`,
    };
  });
  const total = joyas.length;
  const HATEOAS = {
    total,
    results
  }
  return HATEOAS
}
    

module.exports = { obtenerJoyas, obtenerJoyasPorFiltros, prepararHATEOAS };
