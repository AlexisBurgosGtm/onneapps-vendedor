const execute = require('./connection');
const express = require('express');
const router = express.Router();

// PPUBLICO= PRECIO, PMAYOREOA=OFERTA,PMAYOREOB=ESCALA, PMAYOREOC=MAYORISTA

// OBTIENE LISTADO DE PRECIOS
router.post('/listaprecios',async(req,res)=>{
    const {sucursal} = req.body;
    let qry = `SELECT ME_Productos.CODPROD, ME_Productos.DESPROD, ME_Precios.CODMEDIDA, ME_Precios.EQUIVALE, ME_Precios.COSTO, ME_Precios.PRECIO AS PUBLICO, ME_Precios.MAYORISTA AS MAYOREOC, 
                ME_Precios.ESCALA AS MAYOREOB, ME_Precios.OFERTA AS MAYOREOA, ME_Productos.LASTUPDATE
                FROM ME_Productos LEFT OUTER JOIN
                ME_Precios ON ME_Productos.CODPROD = ME_Precios.CODPROD AND ME_Productos.CODSUCURSAL = ME_Precios.CODSUCURSAL AND ME_Productos.EMP_NIT = ME_Precios.EMP_NIT
                WHERE (ME_Productos.CODSUCURSAL = 'GENERAL')`;

    execute.Query(res,qry);
});

// OBTIENE LOS PRECIOS DE UN PRODUCTO
router.post('/preciosproducto',async(req,res)=>{

    const {codprod} = req.body;

    let qry = `SELECT CODPROD, CODMEDIDA, EQUIVALE, COSTO, PRECIO AS PPUBLICO, MAYORISTA AS PMAYOREOC, ESCALA AS PMAYOREOB, OFERTA AS PMAYOREOA, LASTUPDATE FROM ME_PRECIOS WHERE CODPROD='${codprod}' AND CODSUCURSAL='GENERAL'`;
    execute.Query(res,qry);

});

// ACTUALIZA UN PRECIO
router.put('/precio', async(req,res)=>{

    const { codprod,codmedida,equivale,costo,ppublico,pmayoreoa,pmayoreob,pmayoreoc} = req.body;

    let qry = `UPDATE ME_PRECIOS SET 
    EQUIVALE=${equivale},COSTO=${costo},
    PRECIO=${ppublico},MAYORISTA=${pmayoreoc},
    ESCALA=${pmayoreob},OFERTA=${pmayoreoa},
    ESPECIAL=${ppublico},PRECIOFIN=${ppublico} 
    WHERE CODPROD='${codprod}' AND CODMEDIDA='${codmedida}' AND CODSUCURSAL='GENERAL'`

    execute.Query(res,qry);
});


// QUITA UN PRECIO
router.delete('/precio', async(req,res)=>{
    
    const { codprod,codmedida} = req.body;

    let qry = `DELETE FROM ME_PRECIOS 
    WHERE CODPROD='${codprod}' AND CODMEDIDA='${codmedida}' AND CODSUCURSAL='GENERAL'`

    execute.Query(res,qry);
});

//LISTADO MARCAS
router.post('/marcas', async(req,res)=>{
    
    let qry = `SELECT CODMARCA, DESMARCA FROM ME_MARCAS WHERE CODSUCURSAL='GENERAL' ORDER BY DESMARCA`;

    execute.Query(res,qry);
});

//LISTADO CLASE UNO
router.post('/claseuno', async(req,res)=>{
    
    let qry = `SELECT CODCLAUNO AS COD, DESCLAUNO AS DES FROM ME_CLASEUNO ORDER BY DESCLAUNO`;

    execute.Query(res,qry);
});

//LISTADO CLASE DOS
router.post('/clasedos', async(req,res)=>{
    
    let qry = `SELECT CODCLADOS AS COD, DESCLADOS AS DES FROM ME_CLASEDOS ORDER BY DESCLADOS`;

    execute.Query(res,qry);
});

//LISTADO CLASE TRES
router.post('/clasetres', async(req,res)=>{
    
    let qry = `SELECT CODCLATRES AS COD, DESCLATRES AS DES FROM ME_CLASETRES ORDER BY DESCLATRES`;

    execute.Query(res,qry);
});

//LISTADO PRODUCTOS
router.post('/listado', async(req,res)=>{
    
    const filtro = req.body.filtro;

    let qry = `SELECT ME_Productos.CODPROD, ME_Productos.DESPROD, ME_Productos.EQUIVALEINV, isnull(ME_Productos.PRECIOMONEDA,0) AS COSTO, ME_Productos.NOHABILITADO, ME_Marcas.DESMARCA, ME_Productos.LASTUPDATE
                FROM ME_Productos LEFT OUTER JOIN ME_Marcas ON ME_Productos.CODSUCURSAL = ME_Marcas.CODSUCURSAL AND ME_Productos.CODMARCA = ME_Marcas.CODMARCA AND ME_Productos.EMP_NIT = ME_Marcas.EMP_NIT
                WHERE (ME_Productos.DESPROD LIKE '%${filtro}%') AND (ME_PRODUCTOS.CODSUCURSAL='GENERAL')`;


    
    execute.Query(res,qry);
});

// ACTUALIZA DETALLE DEL PRODUCTO
router.put('/detalles',async(req,res)=>{
    const {codprod,desprod,uxc,codmarca,codclaseuno,codclasedos,codclasetres,lastupdate} = req.body;
    
    let qry = `
    UPDATE ME_PRODUCTOS SET 
    DESPROD='${desprod}', EQUIVALEINV=${uxc},CODCLAUNO='${codclaseuno}',CODCLADOS='${codclasedos}',CODCLATRES='${codclasetres}',CODMARCA='${codmarca}',LASTUPDATE='${lastupdate}' 
    WHERE CODPROD='${codprod}' AND (ME_PRODUCTOS.CODSUCURSAL='GENERAL')`;

    execute.Query(res,qry);
    
}); 

// OBTIENE EL DETALLE DEL PRODUCTO
router.post('/detalles',async(req,res)=>{
    const {codprod} = req.body;
    
    let qry = `
    SELECT DESPROD, EQUIVALEINV,CODMARCA,CODCLAUNO,CODCLADOS,CODCLATRES FROM ME_PRODUCTOS
    WHERE CODPROD='${codprod}' AND CODSUCURSAL='GENERAL'`;

    execute.Query(res,qry);
    
}); 

// HABILITA O DESHABILITA EL PRODUCTO
router.put('/status',async(req,res)=>{
    const {codprod,status} = req.body;
    let st;
    if(status==0){
        st =1;
    }else{
        st=0;
    }

    let qry = `UPDATE ME_PRODUCTOS SET NOHABILITADO=${st} WHERE CODPROD='${codprod}' AND CODSUCURSAL='GENERAL'`;
    execute.Query(res,qry);
    
}); 

module.exports = router;
