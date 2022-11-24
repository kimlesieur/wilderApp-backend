const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const Wilder = require('./entity/Wilder');
const Skill = require('./entity/Skill');
const db = require('./db');
const wildersController = require('./controller/wilders');
const skillsController = require('./controller/skills');

const PORT = 4001;
const app = express();
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());


app.get("/", (req, res) => {
    res.send('hello Kim !');
});

//Wilders paths
app.get('/wilders', wildersController.getAll);
app.get('/wilders/read', wildersController.read);
app.post("/wilders", wildersController.create);
app.delete('/wilders/:id', wildersController.delete);
app.get("/wilders/search", wildersController.search);
app.get("/wilders/searchRaw", wildersController.searchRawSQL);
app.get("/wilders/searchLike", wildersController.searchLike);
app.put("/wilders/:id", wildersController.update);
//Manage Skills
app.post("/wilders/:wilderId/skills", wildersController.addSkill);
app.put("/wilders/skill/:wilderId", wildersController.removeSkill);

//Skills paths
app.get('/skills', skillsController.getAll);
app.post('/skills', skillsController.create);
app.delete("/skills/:id", skillsController.delete);



//create a post request path
// app.post("/insert", async (req, res) => {
//     const {name} = req?.body;
//     console.log(`Hello user name is: ${name}`);
//     await db
//         .getRepository(Wilder)
//         .insert([
//             { name: `${name}` },
//         ]);
//     res.sendStatus(200);
// });

app.use((req, res, next) => {
    res.status(404).send("Désolé on n'a pas ça en stock !")
});

const start = async () => {
    await db.initialize();
    // await db.getRepository(Skill).save({name: "PHP"});
    app.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}`);
    });
};

start();