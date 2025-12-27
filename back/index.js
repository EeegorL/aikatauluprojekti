const express = require("express");
const cors = require("cors");
const mariadb = require("mariadb");
require("dotenv").config({quiet: true});
const port = process.env.PORT;
const {DB_USER, DB_PASSWORD, DB_NAME} = process.env;

const app = express();

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());

const pool = mariadb.createPool({
    host: "localhost",
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
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
        const queryStr = `SELECT V.id AS id, V.pv, V.vuoro, VT.nimi AS vuoronimi, V.note AS note, aika, V.henkilo as henkilo, H.nimi, H.lyhenne 
                        FROM vuoro V 
                        INNER JOIN henkilo H ON V.henkilo = H.id 
                        INNER JOIN vuorotyyppi VT ON V.vuoro = VT.id
                        WHERE pv = ?
                        ;`;
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
        await pool.query(queryStr, [day, shift, hour, henkilo, note]);

        res.status(200).end();
    }
    catch(err) {
        res.status(500).json({err: err});
    }
});

app.post("/api/canAdd", async (req, res) => {
    try {
        const {movedData, day, hour, vuoro} = req.body;
        const henkilo = movedData.id;

        const shiftsAtSameTimeQueryStr = "SELECT (SELECT COUNT(*) FROM vuoro WHERE henkilo = ? AND pv = ? AND aika = ?) > 0 as res;";
        const alreadyShiftOnHour = (await pool.query(shiftsAtSameTimeQueryStr, [henkilo, day, hour]))[0].res === 1;

        if(alreadyShiftOnHour) {
            if(movedData.vuoro) { // if shift has data, i.e. is being dragged from the schedule, not from the sidebar
                const v = movedData.vuoro;
                if(v.pv === day && v.aika === hour) {
                    res.status(409).json({canBeResolvedByDeletingOrigin: true});
                    return;
                }
                res.status(409).json({canBeResolvedByDeletingOrigin: false});
                return;
            }
            else {
                res.status(409).json({canBeResolvedByDeletingOrigin: false}).end();
                return;
            }
        }
        else { // no conflicts
            res.status(200).end();
            return;
        }
    }
    catch(err) {
        res.status(500).end();
    }
});

app.delete("/api/vuorot", async (req, res) => {
    try {
        const {id} = req.body;
        const queryStr = "DELETE FROM vuoro WHERE id = ?;";
        await pool.query(queryStr, [id]);

        res.status(204).end();
    }
    catch(err) {
        
    }
});

app.put("/api/note", async (req, res) => {
    try {
        const {id, note} = req.body;
        if(!id) { 
            res.status(400).end();
        }

        const queryStr = "UPDATE vuoro SET note = ? WHERE id = ?;";
        await pool.query(queryStr, [note, id]);

        res.status(200).end();
    }
    catch(err) {
        res.status(500).end();
    }
});

app.listen(port, () => {
    console.log(`localhost:${port}`);
});