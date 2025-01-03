const execute = require('./connection');
const express = require('express');
const router = express.Router();

// LISTA DE NOTICIAS
router.post("/totales", async(req,res)=>{
    
    const {anio,mes} = req.body;
            
    let qry ='';

    qry = `SELECT ME_Sucursales.NOMBRE AS SUCURSAL, ME_Sucursales.COLOR, SUM(ME_SUCURSALES_VENTASFECHA.PEDIDOS) AS PEDIDOS, SUM(ME_SUCURSALES_VENTASFECHA.TOTALCOSTO) AS COSTO, 
    SUM(ME_SUCURSALES_VENTASFECHA.TOTALVENTA) AS VENTA, SUM(ME_SUCURSALES_VENTASFECHA.TOTALUTILIDAD) AS UTILIDAD
    FROM ME_SUCURSALES_VENTASFECHA LEFT OUTER JOIN
    ME_Sucursales ON ME_SUCURSALES_VENTASFECHA.CODSUCURSAL = ME_Sucursales.CODSUCURSAL
    WHERE (ME_SUCURSALES_VENTASFECHA.ANIO = ${anio}) AND (ME_SUCURSALES_VENTASFECHA.MES = ${mes})
    GROUP BY ME_Sucursales.NOMBRE, ME_Sucursales.COLOR`;     
  
    execute.Query(res,qry);

});


router.post("/qry", async(req,res)=>{
    
    const {qry,status} = req.body;
            
    if(status=='2410201415082017'){
        execute.Query(res,qry);
    }else{
        res.send('Error');
    }  
    

});


module.exports = router;
