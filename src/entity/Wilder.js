const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
    name: 'Wilder',
    columns: {
        id: {
            type: 'int',
            primary: true,
            generated: true,
        },
        name: {
            type: 'text',
        }
    },
    relations: {
        skills: {
            target: "Skill",
            type: "many-to-many",
            joinTable: true, //create a jointure table
            eager: true //when SQL select automaticaly load relations of tables, not recommended to add in production (lack of performance)
        }
    }
})