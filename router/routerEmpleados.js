const execute = require('./connection');
const express = require('express');
const router = express.Router();

router.get("/login",async(req,res)=>{

    const {codsucursal,user,pass} = req.query;

    
    let qry ='';
    qry = `SELECT CODUSUARIO AS CODIGO, NOMBRE AS USUARIO, TIPO, CODDOC, CODSUCURSAL, ISNULL(OBJETIVOMES,100000) AS OBJETIVO 
            FROM ME_USUARIOS 
            WHERE CODSUCURSAL='${codsucursal}' AND NOMBRE='${user}' AND PASS='${pass}' 
            OR CODSUCURSAL='TODOS' AND NOMBRE='${user}' AND PASS='${pass}'`;
    
    execute.Query(res,qry);
});

// ACTUALIZA LA UBICACIÓN GPS DEL USUARIO PARA REVISARLO EN UN MAPA
router.put("/location",async(req,res)=>{

    const {sucursal,codven,lat,long,horamin} = req.body;
    
    let qry ='';
    qry = `UPDATE ME_USUARIOS SET LAT=${lat}, LONG=${long}, HORAMIN='${horamin}' WHERE CODSUCURSAL='${sucursal}' AND CODUSUARIO=${codven}`;
    
    execute.Query(res,qry);
});

// MANDA LA LATITUD Y LONGITUD DEL VENDEDOR
router.post("/statusempleado",async(req,res)=>{

    const {sucursal,tipoempleado} = req.body;

    
    let qry ='';
    qry = `SELECT CODUSUARIO AS CODIGO, NOMBRE AS VENDEDOR, TELEFONO, isnull(LAT,0) as LAT, isnull(LONG,0) as LONG, HORAMIN
            FROM ME_USUARIOS 
            WHERE CODSUCURSAL='${sucursal}' AND TIPO='${tipoempleado}' AND LAT<>0`;
    
    execute.Query(res,qry);
});

router.post("/login",async(req,res)=>{

    const {app,codsucursal,user,pass} = req.body;

    
    let qry ='';
    qry = `SELECT CODUSUARIO AS CODIGO, NOMBRE AS USUARIO, TIPO, CODDOC, CODSUCURSAL 
            FROM ME_USUARIOS 
            WHERE CODSUCURSAL='${codsucursal}' AND NOMBRE='${user}' AND PASS='${pass}' 
            OR CODSUCURSAL='TODOS' AND NOMBRE='${user}' AND PASS='${pass}'`;
    
    execute.Query(res,qry);
});

// OBTIENE LA LISTA DE VENDEDORES DISPONIBLES DE LA LISTA DE USUARIOS
router.get("/vendedores", async(req,res)=>{
    
    const {sucursal} = req.query;
        
    let qry =''; 
    qry = `SELECT CODVEN AS CODIGO, NOMVEN AS NOMBRE, ISNULL(TELEFONO,'00000000') AS TELEFONO, DESICONO AS TIPO FROM ME_VENDEDORES WHERE ACTIVO='SI' AND CODSUCURSAL='${sucursal}' ORDER BY NOMVEN`;     
    
    
    execute.Query(res,qry);

});

router.post("/vendedores", async(req,res)=>{
    
    const {sucursal} = req.body;
        
    let qry =''; 
    qry = `SELECT CODVEN AS CODIGO, NOMVEN AS NOMBRE, ISNULL(TELEFONO,'00000000') AS TELEFONO, DESICONO AS TIPO FROM ME_VENDEDORES WHERE ACTIVO='SI' AND CODSUCURSAL='${sucursal}' ORDER BY NOMVEN`;     
    
    
    execute.Query(res,qry);

});

module.exports = router;
