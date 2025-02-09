const { obtenerJoyas, obtenerJoyasPorFiltros, prepararHATEOAS } = require('./consultas')

const express = require('express');
const cors = require("cors");
const morgan = require("morgan");


const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.listen(3000, console.log('Server ON'));

app.get("/joyas", async (req, res) => {
    const queryStrings = req.query;
    try {
        const joyas = await obtenerJoyas(queryStrings);
        const HATEOAS = prepararHATEOAS(joyas)
        res.json(HATEOAS);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener joyas."});
    }
});

app.get('/joyas/filtros', async (req, res) => {
    const queryStrings = req.query;
    try {
        const joyas = await obtenerJoyasPorFiltros(queryStrings);
        res.json(joyas);
    } catch (error) {
        res.status(500).json({ error: "Error en la consulta de filtro."});
    }
});

app.get("*", (req, res) => {
    res.status(404).send("Esta ruta no existe");
});
        