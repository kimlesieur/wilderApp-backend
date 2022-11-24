const {DataSource} = require("typeorm");
const Wilder = require('./entity/Wilder');
const Skill = require('./entity/Skill');

const dataSource = new DataSource({
    type: "sqlite",
    database: "./wildersdb.sqlite",
    synchronize: true,
    entities: [Wilder, Skill],
});

//export by default
module.exports = dataSource; //to import use the variable name you want like this: const db = require('./db');

//Named export 
// If you use a named export : 
// module.exports = {dataSource: dataSource}; 
//To import, you have to use destructuration: const {dataSource} = require('./db')
