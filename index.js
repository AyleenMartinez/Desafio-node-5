const { obtenerJoyas } = require('./consultas')

const express = require('express');
const cors = require("cors");
const morgan = require("morgan");


const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.listen(3000, console.log('Server ON'));


app.get("/joyas", async (req, res) => {
    const queryStrings = req.query
    const joyas = await obtenerJoyas(queryStrings)
    res.json(joyas)
    });

