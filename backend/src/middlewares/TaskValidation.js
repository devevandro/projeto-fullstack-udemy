const TaskModel = require('../model/TaskModel.js');
const { isPast } = require('date-fns')

const TaskValidation = async (req, res, next) => {
    const { macaddress, type, title, description, when } = req.body;

    if (!macaddress) {
        return res.status(400).json({ error: "macaddress obrogatório" });
    } else if (!type) {
        return res.status(400).json({ error: "tipo obrogatório" });
    } else if (!title) {
        return res.status(400).json({ error: "title obrogatório" });
    } else if (!description) {
        return res.status(400).json({ error: "descrição obrogatória" });
    } else if (!when) {
        return res.status(400).json({ error: "data e hora obrogatórios" });
    } else if (isPast(new Date(when))) {
        return res.status(400).json({ error: "escolha uma data e hora futura" });
    } else {
        let exists;

        if (req.params.id) {
            exists = await TaskModel.findOne({
                '_id': {
                    '$ne': req.params.id
                },

                'when': {
                    '$eq': new Date(when)
                },

                'macaddress': {
                    '$in': macaddress
                }
            });
        } else {
            exists = await TaskModel.findOne({
                'when': {
                    '$eq': new Date(when)
                },

                'macaddress': {
                    '$in': macaddress
                },
            });
        }

        if (exists) {
            return res.status(400).json({ error: "já existe uma tarefa neste dia e horario" });
        }

        next();
    }
}

module.exports = TaskValidation;
