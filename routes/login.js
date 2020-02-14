var express = require('express');
var app = express();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

var Usuario = require('../models/usuario');

app.post('/', (req, res) => {

    var body = req.body;

    Usuario.findOne({email:body.email}, (err, usuario) => {

        if(err){
            return res.status(500).json({
                status: false,
                mensaje: 'Error al buscar el usuario',
                errors: err
            });
        } else if(!usuario){
            return res.status(400).json({
                status: false,
                mensaje: `No existe un usuario con ese email`,
                errors: { message: 'No existe un usuario con ese email'}
            });
        } else if( !bcrypt.compareSync( body.password, usuario.password )){
            return res.status(400).json({
                status: false,
                mensaje: `No existe un usuario con ese password`,
                errors: { message: 'No existe un usuario con ese password'}
            });
        }

        // Crear un token!!!
        var token = jwt.sign({ usuario: usuario }, SEED, { expiresIn: 14400 });  // 4 horas
        usuario.password = ':)';

        res.status(200).json({
            status: true,
            usuario,
            token,
            id: usuario._id
        });
    });

});

module.exports = app;