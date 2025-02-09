const { Pool } = require("pg");

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

  const obtenerJoyas = async ({ limits = 10}) => {
    let consulta = "SELECT * FROM joyas LIMIT $1"
    const { rows: joyas } = await pool.query(consulta,
    [limits])
    return joyas
    }
    

module.exports = { obtenerJoyas };