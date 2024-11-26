const { get } = require('mongoose');
const Alert = require('../models/alerts.model');
const Filter = require('../models/filters.model');
const { getAll } = require('./devices.controller');


const compare = async function(data, device, module) {
    try {
        const filtros = await Filter.find({ device, module });
        if (!filtros || filtros.length === 0) return "No hay filtros para este dispositivo y módulo";

        const alerts = [];

        for (const atributo in data) {
            const value = getNestedValue(data, atributo);
            const filtro = filtros.find(f => f.field === atributo);

            if (filtro) {
                for (const condition of filtro.conditions) {
                    let description = null;

                    switch (condition.condition) {
                        case "<":
                            if (value >= condition.threshold) description = `Alerta de ${module}: ${atributo} mayor a ${condition.threshold}`;
                            break;
                        case "<=":
                            if (value > condition.threshold) description = `Alerta de ${module}: ${atributo} mayor o igual a ${condition.threshold}`;
                            break;
                        case "=":
                            if (value !== condition.threshold) description = `Alerta de ${module}: ${atributo} distinto de ${condition.threshold}`;
                            break;
                        case ">=":
                            if (value < condition.threshold) description = `Alerta de ${module}: ${atributo} menor a ${condition.threshold}`;
                            break;
                        case ">":
                            if (value <= condition.threshold) description = `Alerta de ${module}: ${atributo} menor o igual a ${condition.threshold}`;
                            break;
                    }

                    if (description) {
                        const alert = await crearAlerta(description, device, module);
                        alerts.push(alert);
                    }
                }
            }
        }

        return alerts;
    } catch (err) {
        throw new Error(err.message || "Ocurrió un error al crear la alerta.");
    }
};

const crearAlerta = async function(description, device, module) {
    const alert = new Alert({
        description,
        device,
        module
    });
    try {
        return await alert.save();
    } catch (err) {
        throw new Error("Error creating alert: " + err.message);
    }
};



const AlertsController = {
    
    getbyModule: function(req, res){
        Alert.find({module: req.body.module})
            .then(alerts => {
                res.send(alerts);
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while retrieving alerts."
                });
            });
    },
    getNotSeen: function(req, res){
        Alert.find({seen: false})
            .then(alerts => {
                res.send(alerts);
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while retrieving alerts."
                });
            });
    },
    addSeen: function(req, res){
        Alert.findByIdAndUpdate(req.body.id, {seen: true}, { useFindAndModify: false })
            .then(alert => {
                if (!alert) {
                    return res.status(404).send({
                        message: "Alert not found with id " + req.body.id
                    });
                }
                res.send(alert);
            })
            .catch(err => {
                if (err.kind === 'ObjectId') {
                    return res.status(404).send({
                        message: "Alert not found with id " + req.body.id
                    });
                }
                return res.status(500).send({
                    message: "Error updating alert with id " + req.body.id
                });
            });
        },
    addResolved: function(req, res){
        Alert.findByIdAndUpdate(req.params.id, {resolved: true}, { useFindAndModify: false })
            .then(alert => {
                if (!alert) {
                    return res.status(404).send({
                        message: "Alert not found with id " + req.body.id
                    });
                }
                res.send(alert);
            })
            .catch(err => {
                if (err.kind === 'ObjectId') {
                    return res.status(404).send({
                        message: "Alert not found with id " + req.body.id
                    });
                }
                return res.status(500).send({
                    message: "Error updating alert with id " + req.body.id
                });
            });
        },
        getbyDevice: function(req, res){
            Alert.find({device: req.body.device})
                .then(alerts => {
                    res.send(alerts);
                })
                .catch(err => {
                    res.status(500).send({
                        message: err.message || "Some error occurred while retrieving alerts."
                    });
                });
        },
        getAll: function(req, res){ 
            Alert.find()
                .then(alerts => {
                    res.send(alerts);
                })
                .catch(err => {
                    res.status(500).send({
                        message: err.message || "Some error occurred while retrieving alerts."
                    });
                });
        },
        getNotResolved: function(req, res){
            Alert.find({resolved: false})
                .then(alerts => {
                    res.send(alerts);
                })
                .catch(err => {
                    res.status(500).send({
                        message: err.message || "Some error occurred while retrieving alerts."
                    });
                });
        }
        


}
        

const filtersController ={
    create: function(req, res){
        const filter = new Filter({
            field: req.body.field,
            conditions: req.body.conditions,
            device: req.body.device,
            module: req.body.module
        });
        filter
            .save(filter)
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while creating the filter."
                });
            });
    },
    getAll: function(req, res){
        Filter.find()
            .then(filters => {
                res.send(filters);
            }
            )
            .catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while retrieving filters."
                });
            });
    },
    getbyModule: function(req, res){
        Filter.find({module: req.body.module})
            .then(filters => {
                res.send(filters);
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while retrieving filters."
                });
            });
    },

    getbyDevice: function(req, res){
        Filter.find({device: req.body.device})
            .then(filters => {
                res.send(filters);
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while retrieving filters."
                });
            });
    },
    modify: function(req, res){
        Filter.findByIdAndUpdate(req.body.id, req.body.filter, { useFindAndModify: false })
            .then(filter => {
                if (!filter) {
                    return res.status(404).send({
                        message: "Filter not found with id " + req.body.id
                    });
                }
                res.send(filter);
            })
            .catch(err => {
                if (err.kind === 'ObjectId') {
                    return res.status(404).send({
                        message: "Filter not found with id " + req.body.id
                    });
                }
                return res.status(500).send({
                    message: "Error updating filter with id " + req.body.id
                });
            });
        },
    getFilterbyDeviceandModule: function(req, res){
        Filter.find({device: req.body.device, module: req.body.module})
            .then(filters => {
                res.send(filters);
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while retrieving filters."
                });
            });
    }
    

}
function getNestedValue(obj, path) {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

module.exports = {filtersController, AlertsController, compare};
