const express = require("express");
const cors = require("cors");
const mariadb = require("mariadb");
require("dotenv").config();
const port = process.env.PORT;

const app = express();

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());

const pool = mariadb.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "aikataulu",
    connectionLimit: 100
});

app.use("/", async (req, res, next) => {
    try {
        const connection = await pool.getConnection();

        res.on("finish", () => {
            connection.end();
        });
    }
    catch(err) {
        res.status(500).end();
    }
    next();
});

app.get("/api/test", async (req, res) => {
    try {
        res.status(200).end();
    }
    catch(err) {
        res.status(500).end();
    }
});

app.get("/api/ihmiset", async (req, res) => {
    try {
        const queryStr = "SELECT id AS henkilo, nimi, lyhenne FROM henkilo ORDER BY nimi;";
        const query = await pool.query(queryStr);

        res.status(200).json(query);
    }
    catch(err) {
        res.status(500).end();
    }
});

app.get("/api/vuorotyypit", async (req, res) => {
    try {
        const queryStr = "SELECT * FROM vuorotyyppi ORDER BY nro";
        const query = await pool.query(queryStr);

        res.status(200).json(query);
    }
    catch(err) {
        res.status(500).end();
    }
});

app.get("/api/vuorot/:pv", async (req, res) => {
    try {
        const queryStr = "SELECT V.id AS id, V.pv, V.vuoro, V.note AS note, aika, V.henkilo as henkilo, H.nimi, H.lyhenne FROM vuoro V INNER JOIN henkilo H ON V.henkilo = H.id WHERE pv = ?";
        const query = await pool.query(queryStr, [req.params.pv]);

        res.status(200).json(query);
    }
    catch(err) {
        res.status(500).json({err: err});
    }
});

app.post("/api/vuorot", async (req, res) => {
    try {
        const {day, hour, shift, henkilo, note} = req.body;

        const queryStr = "INSERT INTO vuoro(pv, vuoro, aika, henkilo, note) VALUES(?, ?, ?, ?, ?);";
        const query = await pool.query(queryStr, [day, shift, hour, henkilo, note]);

        res.status(200).end();
    }
    catch(err) {
        res.status(500).json({err: err});
    }
});

app.listen(port, () => {
    console.log(`localhost:${port}`);
});