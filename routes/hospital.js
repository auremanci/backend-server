var express = require('express');
var app = express();
var mdAutenticacion = require('../middlewares/autenticacion');

var Hospital = require('../models/hospital');

// ===================================================
//  Obtener todos los hospitales
// ===================================================
app.get('/', (req,res,next) => {

    Hospital.find({}).exec(
        (err,hospitales) => {
            if(err){
                return res.status(500).json({
                    status: false,
                    mensaje: 'Error cargando los hospitales',
                    errors: err
                });
            }

            res.status(200).json({
                status: true,
                hospitales
            });

        }
    )
});


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


// ===================================================
//  Crear un nuevo hospital
// ===================================================
app.post('/', mdAutenticacion.verificaToken, (req,res) => {

    var body = req.body;

    var hospital = new Hospital({
        nombre: body.nombre,
        img: body.img,
        usuario: req.usuario._id
    });


    hospital.save( ( err, hospitalGuardado) => {
        if(err){
            return res.status(400).json({
                status: false,
                mensaje: 'Error al crear hospital',
                errors: err
            });
        }

        res.status(201).json({
            status: true,
            hospital: hospitalGuardado
        });

    });
    
});

// ===================================================
//  Borrar un hospital
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