const db = require('../db');
const Skill = require('../entity/Skill');

module.exports = {
    async getAll(req, res) {
        try {
            const skills = await db
            .getRepository(Skill)
            .find();
            res.send(skills);
        } catch(err) {
            res.status(500).send(err);
        }
    },
    create(req, res) {
        const {name} = req.body;
        //validating data
        if(name === "" || typeof name === "undefined" ) return res.status(422).send("please provide a valid name");
        db.getRepository(Skill)
        .save({name})
        .then((createdSkill) => {
            console.log(createdSkill);
            res.send(createdSkill);
        })
        .catch((err) => {
            res.status(400).send(err);
        });
    },
    async delete(req, res) {
        try {
            const {id} = req.params;
            console.log(id);
            const result = await db.getRepository(Skill).delete(id);
            if(result.affected === 0) return res.status(404).send("Pas de Skill pour cet id");
            return res.send("Delete ok");
        } catch(err) {
            console.log(err);
            res.status(500).send("Erreur lors de la supression d'une Skill");
        }
    }
}