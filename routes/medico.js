var express = require('express');
var app = express();
var mdAutenticacion = require('../middlewares/autenticacion');

var Medico = require('../models/medico');

// ===================================================
//  Obtener todos los medicos
// ===================================================
app.get('/', (req,res,next) => {

    Medico.find({}).exec(
        (err,medicos) => {
            if(err){
                return res.status(500).json({
                    status: false,
                    mensaje: 'Error cargando los medicos',
                    errors: err
                });
            }

            res.status(200).json({
                status: true,
                medicos
            });

        }
    )
});

/*
// ===================================================
//  Actualizar un hospital
// ===================================================
app.put('/:id', mdAutenticacion.verificaToken, (req,res) => {

    var id = req.params.id;
    var body = req.body;

    Hospital.findById( id, (err, hospital) => {
        if(err){
            return res.status(500).json({
                status: false,
                mensaje: 'Error al buscar hospital',
                errors: err
            });
        }

        if(!hospital){
            return res.status(400).json({
                status: false,
                mensaje: `El hospital con el id:${id} no existe`,
                errors: { message: 'No existe un hospital con ese ID'}
            });
        }

        hospital.nombre = body.nombre;
        hospital.usuario = req.usuario._id;
        hospital.hospital = body.hospital;

        hospital.save( (err, hospitalGuardado) => {
            if(err){
                return res.status(400).json({
                    status: false,
                    mensaje: 'Error al actualizar hospital',
                    errors: err
                });
            }

            res.status(200).json({
                status: true,
                hospital: hospitalGuardado
            });
        });

    });
});
*/

// ===================================================
//  Crear un nuevo médico
// ===================================================
app.post('/', mdAutenticacion.verificaToken, (req,res) => {

    var body = req.body;

    var medico = new Medico({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital
    });


    medico.save( ( err, medicoGuardado) => {
        if(err){
            return res.status(400).json({
                status: false,
                mensaje: 'Error al crear medico',
                errors: err
            });
        }

        res.status(201).json({
            status: true,
            medico: medicoGuardado
        });

    });
    
});

// ===================================================
//  Borrar un medico
// ===================================================
app.delete('/:id', mdAutenticacion.verificaToken, (req,res) => {

    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {
        if(err){
            return res.status(500).json({
                status: false,
                mensaje: 'Error al borrar hospital',
                errors: err
            });
        } else if( !hospitalBorrado ){
            return res.status(400).json({
                status: false,
                mensaje: 'No existe un hospital con ese ID',
                errors: { message: 'No existe un hospital con ese ID' }
            });
        }

        res.status(200).json({
            status: true,
            hospital: hospitalBorrado
        });
    });
});

module.exports = app;