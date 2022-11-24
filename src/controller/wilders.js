const { Like } = require('typeorm');
const dataSource = require('../db');
const db = require('../db');
const Skill = require('../entity/Skill');
const Wilder = require('../entity/Wilder');

module.exports = {
    create(req, res) {
        const {name} = req.body;
        //validating data
        if(name === "" || typeof name === "undefined" ) return res.status(422).send("please provide a valid name");
        db.getRepository(Wilder)
        .save({name})
        .then((createdWilder) => {
            res.send(createdWilder);
        })
        .catch((err) => {
            res.status(400).send(err);
        });
    },
    // async create2(req, res) {
    //     console.log(req.body);
    //     const {name} = req.body;
    //     try {
    //         const createdWilder = await db.getRepository(Wilder).save({name});
    //         res.send(createdWilder);
    //     } catch (err) {
    //         res.status(500).send(err);
    //     };
    // },
    async read(req, res) {
        const { search } = req.query;
        try {
          const wilders = await db.getRepository(Wilder).find({
            where: { name: search ? Like(`%${search}%`) : undefined },
          });
          res.send(wilders);
        } catch (err) {
          res.status(500).send(err);
        }
    },
    async getAll(req, res) {
        try {
            const wilders = await db.getRepository(Wilder)
            .find();
            res.send(wilders);
        } catch(err) {
            res.status(500).send(err);
        }
    },
    async delete(req, res) {
        try {
            const {id} = req.params;
            console.log(id);
            const result = await db.getRepository(Wilder).delete(id);
            if(result.affected === 0) return res.status(404).send("Wilder not found");
            return res.send("Delete ok");
        } catch(err) {
            res.status(500).send(err);
        }
    },
    async update(req, res) {
        try {
            const {id} = req.params;
            const {name} = req.body;
            const response = await db
                .createQueryBuilder()
                .update(Wilder)
                .set({ name: name})
                .where("id = :id", { id: id })
                .execute();
            res.status(200).send("Update ok");
        } catch(err) {
            res.status(500).send(err);
        }
    },
    async search(req, res) {
        try {
            const name = req.query.name;
            const wilders = await db.getRepository(Wilder)
            .createQueryBuilder('wilder')
            .where("wilder.name = :name", {name: name})
            .getMany();
            res.send(wilders);

        } catch(err) {
            res.status(500).send(err);
        }
    },
    async searchRawSQL(req, res) {
        //partial search function with raw SQL query
        try {
            const searchString = req.query.searchString;
            const wilders = await db.getRepository(Wilder)
                            .query(`SELECT * FROM Wilder WHERE name LIKE '${searchString}%' `);
            res.send(wilders);

        } catch(err) {
            res.status(500).send(err);
        }
    },
    async searchLike(req, res) {
        try {
            const searchString = req.query.searchString;
            const wilders = await db.getRepository(Wilder)
                            .findBy({name: Like(`${searchString}%`)})
            res.send(wilders);

        } catch(err) {
            res.status(500).send(err);
        }
    },
    async addSkill(req, res) {
        const {wilderId} = req.params;
        const {skillId} = req.body;
        try {
            const wilderToUpdate = await db
            .getRepository(Wilder)
            .findOneBy({id: wilderId});

            if(wilderToUpdate === null) return res.sendStatus(404);

            const skillToAdd = await db
            .getRepository(Skill)
            .findOneBy({id: skillId});

            wilderToUpdate.skills = [...wilderToUpdate.skills, skillToAdd];
            await dataSource.getRepository(Wilder).save(wilderToUpdate);

            res.send("Skill ajouté au Wilder");
        } catch(err) {
            console.log(err);
            res.status(500).send("Erreur avec ajout de Skill sur un Wilder");
        }
    },
    async removeSkill (req, res) {
        const {wilderId} = req.params;
        const {skillId} = req.body;
        try {
            const wilderToUpdate = await db
            .getRepository(Wilder)
            .findOneBy({id: wilderId});

            if(wilderToUpdate === null) return res.sendStatus(404);

            const foundSkill = wilderToUpdate.skills.find(skill => skill.id === skillId);
            if(!foundSkill) return res.status(404).send("Skill pas trouvée");

            wilderToUpdate.skills = wilderToUpdate.skills.filter(skill => skill.id !== skillId);

            await dataSource.getRepository(Wilder).save(wilderToUpdate);
            res.send(wilderToUpdate);
            // res.send("Skill supprimé du Wilder");
        } catch(err) {
            console.log(err);
            res.status(500).send("Erreur avec suppression de Skill sur un Wilder");
        }

    }


}