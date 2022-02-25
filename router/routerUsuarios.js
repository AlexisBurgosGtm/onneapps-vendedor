const execute = require('./connection');
const express = require('express');
const router = express.Router();

// OBTIENE LOS USUARIOS DE UN DETERMINADO TIPO
router.post("/listado", async(req,res)=>{
    
    const {sucursal,tipo} = req.body;
    
    let qry ='';

    if(tipo=='GERENTE'){
        qry = `SELECT ID,CODUSUARIO as CODIGO,NOMBRE AS USUARIO,PASS AS CLAVE,TELEFONO,CODDOC FROM ME_USUARIOS WHERE CODSUCURSAL='${sucursal}' `;     
    }else{
        qry = `SELECT ID,CODUSUARIO as CODIGO,NOMBRE AS USUARIO,PASS AS CLAVE,TELEFONO,CODDOC FROM ME_USUARIOS WHERE CODSUCURSAL='${sucursal}'AND TIPO='${tipo}'`;     
    }
        
    execute.Query(res,qry);

});

// ELIMINA UN USUARIOS
router.post("/eliminar", async(req,res)=>{
    
    const {sucursal,id, codven,tipo} = req.body;
        
    let qry =''; let qryVendedor = '';

    qry = `DELETE FROM ME_USUARIOS WHERE CODSUCURSAL='${sucursal}'AND ID=${id};`;     
    
    if(tipo=='VENDEDOR'){
        qryVendedor = `DELETE FROM ME_VENDEDORES WHERE CODSUCURSAL='${sucursal}' AND CODVEN=${codven};`
    };
    
    execute.Query(res, qry + qryVendedor);

});

// NUEVO USUARIO
router.post("/nuevo", async(req,res)=>{
    
    const {sucursal,tipo,codusuario,usuario,clave,coddoc,telefono} = req.body;
        
    
    let qry ='';let qryV ='';

    qry = `INSERT INTO ME_USUARIOS 
        (CODUSUARIO,NOMBRE,PASS,TIPO,TELEFONO,CODDOC,CODSUCURSAL) VALUES
        (${codusuario},'${usuario}','${clave}','${tipo}','${telefono}','${coddoc}','${sucursal}');`;     
    
    if(tipo=='VENDEDOR'){
        qryV = `INSERT INTO ME_VENDEDORES 
        (EMP_NIT,CODVEN,NOMVEN,ACTIVO,CODDOC,CODSUCURSAL) VALUES
        ('1034261-3',${codusuario},'${usuario}','SI','${coddoc}','${sucursal}');`;    
    };

    

    execute.Query(res,qry + qryV);

});

// EDITA EL USUARIO
router.post("/editar", async(req,res)=>{
    
    const {id,sucursal,tipo,codusuario,usuario,clave,coddoc,telefono} = req.body;
        
    let qry =''; let qryV ='';

    qry = `UPDATE ME_USUARIOS SET 
            CODUSUARIO=${codusuario},
            NOMBRE='${usuario}',
            PASS='${clave}',
            TIPO='${tipo}',
            TELEFONO='${telefono}',
            CODDOC='${coddoc}'
            WHERE ID=${id} AND CODSUCURSAL='${sucursal}';`;     

            if(tipo=='VENDEDOR'){
                qryV = `UPDATE ME_VENDEDORES SET NOMVEN='${usuario}', CODDOC='${coddoc}' WHERE CODSUCURSAL='${sucursal}' AND CODVEN=${codusuario};`
            }
    
  
    execute.Query(res,qry + qryV);

});


module.exports = router;