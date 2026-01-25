const express = require("express");
const cors = require("cors");
const mariadb = require("mariadb");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

require("dotenv").config({quiet: true});
const port = process.env.PORT;
const {DB_USER, DB_PASSWORD, DB_NAME, JWT_SECRET} = process.env;

const app = express();

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());

const pool = mariadb.createPool({
    host: "localhost",
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    connectionLimit: 100
});

const destroyCookie = (res) => {
    res.cookie("aikatauluToken", "anInvalidCookie", { // ylikirjoitetaan varmuuden vuoksi virheellisellä & heti poistuvalla ennen varsinaista poistoa
        expires: new Date(0),
        maxAge: 1
    });
    res.clearCookie("aikatauluToken");
}

const checkSessionValidity = async (req, res) => {
    try {
        if(!req.cookies.aikatauluToken) {
            return {code: 401, err: "Not authenticated"};
        }

        const verifiedUser = jwt.verify(req.cookies.aikatauluToken, JWT_SECRET);
        if(!(verifiedUser.userId && verifiedUser.iat)) {
            destroyCookie(res);
            return {code: 401, err: "Invalid token"};
        }

        const issuedAtSec = verifiedUser.iat;
        const nowSec = Math.round(Date.now() / 1000); // ms to s
        const timeDiffMinutes = (nowSec - issuedAtSec) / 60;

        if(timeDiffMinutes > 30) { // token is older than half an hour
            destroyCookie(res);
            return {code: 401, err: "Expired token"};
        }

        const userToSend = {
            id: verifiedUser.userId,
            username: verifiedUser.username,
            role: verifiedUser.role
        }

        return {code: 200, userToSend};
    }
    catch(err) {
        destroyCookie(req);
        return {code: 401, err: "Invalid token"};
    }
}

app.use("/", async (req, res, next) => { // db connection middleware
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

app.post("/api/login", async (req, res) => {
    try {
        const {username, password} = req.body;
        if(!username || !password) {
            res.status(401).json({err: "Username or password missing"});
            return;
        }

        const foundUserQueryStr = "SELECT id, kayttajanimi, rooli, pwdHash FROM kayttaja WHERE kayttajanimi = ?;";
        const foundUserQuery = await pool.query(foundUserQueryStr, [username]);

        const user = foundUserQuery[0];
        if(!user) {
            res.status(404).json({err: "Username is not associated with a user"});
            return;
        }

        if(!await bcrypt.compare(password, user.pwdHash)) {
            res.status(401).json({err: "Incorrect password"});
            return;
        }

        const dataForToken = {
            userId: user.id,
            username: user.kayttajanimi,
            role: user.rooli,
        }

        const signedToken = jwt.sign(dataForToken, JWT_SECRET);
        
        res.cookie("aikatauluToken", signedToken, {
            maxAge: 1000 * 60 * 30 // 30 min,
        });

        res.status(200).json({
            data: dataForToken
        });
    }
    catch(err) {
        res.status(500).end();
    }
});

app.get("/api/test", async (req, res) => {
    try {
        res.status(200).end();
    }
    catch(err) {
        res.status(500).end();
    }
});

app.post("/api/register", async (req, res) => {
    try {
        const {username, password} = req.body;
        if(!username || !password) {
            res.status(400).json({err: "Username of password missing"});
            return;
        }
        
        let passwordHash = await bcrypt.hash(password, 12);
        const queryStr = "INSERT INTO kayttaja(kayttajanimi, pwdHash) VALUES(?, ?);";
        await pool.query(queryStr, [username, passwordHash]);
        res.status(200).end();
    }
    catch(err) {
        res.status(500).json({err: err});
    }
});

app.use("/", async (req, res, next) => { // this middleware after paths that should work regardless of login
    if(req.path === "/api/login") return next();

    const validity = await checkSessionValidity(req, res);
    if(validity.code === 401) {
        return res.status(401).json({err: "Not authorized"});
    }

    return next();
});

app.post("/api/logout", async (req, res) => {
    res.cookie("aikatauluToken", "anInvalidCookie", { // ylikirjoitetaan varmuuden vuoksi virheellisellä & heti poistuvalla ennen varsinaista poistoa
        expires: new Date(0),
        maxAge: 1
    });
    res.clearCookie("aikatauluToken");
    
    res.status(200).end();
});

app.get("/api/getLogin", async (req, res) => {
    const validity = await checkSessionValidity(req);
    
    if(validity.code === 401) {
        return res.status(validity.code).json({err: validity.err});
    }

    res.status(200).json(validity.userToSend);
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
        const {movedData, day, hour} = req.body;
        const henkilo = movedData.id;

        const shiftsAtSameTimeQueryStr = "SELECT (SELECT COUNT(*) FROM vuoro WHERE henkilo = ? AND pv = ? AND aika = ?) > 0 as res;";
        const alreadyShiftOnHour = (await pool.query(shiftsAtSameTimeQueryStr, [henkilo, day, hour]))[0].res === 1; // true/false whether there is a shift for the person at the given time

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
