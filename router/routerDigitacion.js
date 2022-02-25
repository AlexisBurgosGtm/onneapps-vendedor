const execute = require('./connection');
const express = require('express');
const router = express.Router();

router.put('/pedidobloquear', async(req,res)=>{
    const {sucursal,codven,coddoc,correlativo} = req.body;

    let qry = `UPDATE ME_DOCUMENTOS SET DOC_ESTATUS='A' WHERE CODSUCURSAL='${sucursal}' AND CODVEN=${codven} AND CODDOC='${coddoc}' AND DOC_NUMERO='${correlativo}'`;
    
    execute.Query(res,qry);

});

router.put('/pedidoregresar', async(req,res)=>{
    const {sucursal,codven,coddoc,correlativo} = req.body;

    let qry = `UPDATE ME_DOCUMENTOS SET DOC_ESTATUS='O', DOC_NUMORDEN='' WHERE CODSUCURSAL='${sucursal}' AND CODVEN=${codven} AND CODDOC='${coddoc}' AND DOC_NUMERO='${correlativo}'`;
    
    execute.Query(res,qry);

});

router.put('/pedidoconfirmar', async(req,res)=>{
    const {sucursal,codven,coddoc,correlativo,embarque} = req.body;

    let qry = `UPDATE ME_DOCUMENTOS SET DOC_ESTATUS='I', DOC_NUMORDEN='${embarque}' WHERE CODSUCURSAL='${sucursal}' AND CODVEN=${codven} AND CODDOC='${coddoc}' AND DOC_NUMERO='${correlativo}'`;   

    execute.Query(res,qry);

});

router.post("/pedidostipoprecio", async(req,res)=>{
    const {sucursal,codven}  = req.body;
    
    let qry = '';
    qry = `SELECT ME_Documentos.CODDOC, ME_Documentos.DOC_NUMERO AS CORRELATIVO, ME_Documentos.DOC_FECHA AS FECHA, ME_Documentos.CODVEN, ME_Documentos.CODSUCURSAL, ME_Docproductos.CODPROD, 
            ME_Docproductos.DESCRIPCION AS DESPROD, ME_Docproductos.CODMEDIDA, ME_Docproductos.CANTIDAD, ME_Docproductos.PRECIO, ME_Docproductos.TOTALPRECIO, ME_Docproductos.TIPOPRECIO
            FROM ME_Documentos LEFT OUTER JOIN
                ME_Tipodocumentos ON ME_Documentos.CODSUCURSAL = ME_Tipodocumentos.CODSUCURSAL AND ME_Documentos.CODDOC = ME_Tipodocumentos.CODDOC AND 
                ME_Documentos.EMP_NIT = ME_Tipodocumentos.EMP_NIT LEFT OUTER JOIN
                ME_Docproductos ON ME_Documentos.CODSUCURSAL = ME_Docproductos.CODSUCURSAL AND ME_Documentos.DOC_ANO = ME_Docproductos.DOC_ANO AND 
                ME_Documentos.DOC_NUMERO = ME_Docproductos.DOC_NUMERO AND ME_Documentos.CODDOC = ME_Docproductos.CODDOC AND ME_Documentos.EMP_NIT = ME_Docproductos.EMP_NIT
            WHERE (ME_Documentos.CODVEN = ${codven}) AND (ME_Tipodocumentos.TIPODOC = 'PED') AND (ME_Documentos.CODSUCURSAL = '${sucursal}') AND (ME_Documentos.DOC_ESTATUS = 'O') AND (ME_Docproductos.TIPOPRECIO<>'P')`

    
    execute.Query(res,qry);
});

// LISTA DE PEDIDOS PENDIENTES DEL VENDEDOR
router.post("/pedidospendientes", async(req,res)=>{
    const {sucursal,codven}  = req.body;
    
    let qry = '';
    qry = `SELECT DOC_FECHA AS FECHA, CODDOC, DOC_NUMERO AS CORRELATIVO, DOC_NOMREF AS NOMCLIE, 
            DOC_DIRENTREGA AS DIRCLIE, '' AS DESMUNI, 
            isnull(DOC_TOTALVENTA,0) AS IMPORTE, LAT, LONG, DOC_NUMORDEN AS EMBARQUE, DOC_ESTATUS AS ST, DOC_OBS AS OBS
            FROM ME_Documentos
            WHERE (CODSUCURSAL = '${sucursal}') AND (CODVEN = ${codven}) AND (DOC_ESTATUS='O') AND (ISCENVIADO=0)
            ORDER BY DOC_FECHA,DOC_NUMERO`

    
    execute.Query(res,qry);
});

// LISTA DE PEDIDOS BLOQUEADOS DEL VENDEDOR
router.post("/pedidosbloqueados", async(req,res)=>{
    const {sucursal,codven}  = req.body;
    
    let qry = '';
    qry = `SELECT DOC_FECHA AS FECHA, CODDOC, DOC_NUMERO AS CORRELATIVO, DOC_NOMREF AS NOMCLIE, DOC_DIRENTREGA AS DIRCLIE, '' AS DESMUNI, isnull(DOC_TOTALVENTA,0) AS IMPORTE, LAT, LONG, DOC_NUMORDEN AS EMBARQUE, DOC_ESTATUS AS ST, DOC_OBS AS OBS
            FROM ME_Documentos
            WHERE (CODSUCURSAL = '${sucursal}') AND (CODVEN = ${codven}) AND (DOC_ESTATUS='A') AND (ISCENVIADO=0)
            ORDER BY DOC_FECHA,DOC_NUMERO`

    
    execute.Query(res,qry);
});

router.post("/pedidosgenerados", async(req,res)=>{
    const {sucursal,codven}  = req.body;
    
    let qry = '';
    qry = `SELECT DOC_FECHA AS FECHA, CODDOC, DOC_NUMERO AS CORRELATIVO, DOC_NOMREF AS NOMCLIE, DOC_DIRENTREGA AS DIRCLIE, '' AS DESMUNI, isnull(DOC_TOTALVENTA,0) AS IMPORTE, LAT, LONG, DOC_NUMORDEN AS EMBARQUE, DOC_ESTATUS AS ST
            FROM ME_Documentos
            WHERE (CODSUCURSAL = '${sucursal}') AND (CODVEN = ${codven}) AND (DOC_ESTATUS<>'I') AND (ISCENVIADO=1)
            ORDER BY DOC_FECHA,DOC_NUMERO`

    
    execute.Query(res,qry);
});

router.post("/detallepedido", async(req,res)=>{
    const {sucursal,fecha,coddoc,correlativo}  = req.body;

    let ncorrelativo = correlativo;
    
        
    let qry = '';
    qry = `SELECT ME_Docproductos.CODPROD, ME_Docproductos.DESCRIPCION AS DESPROD, ME_Docproductos.CODMEDIDA, ME_Docproductos.CANTIDAD, ME_Docproductos.PRECIO, ME_Docproductos.TOTALPRECIO AS IMPORTE, ME_Docproductos.DOC_ITEM, ME_Docproductos.TOTALCOSTO
            FROM ME_Documentos LEFT OUTER JOIN
            ME_Docproductos ON ME_Documentos.CODSUCURSAL = ME_Docproductos.CODSUCURSAL AND ME_Documentos.DOC_NUMERO = ME_Docproductos.DOC_NUMERO AND 
            ME_Documentos.CODDOC = ME_Docproductos.CODDOC AND ME_Documentos.EMP_NIT = ME_Docproductos.EMP_NIT
            WHERE  (ME_Documentos.CODSUCURSAL = '${sucursal}') 
            AND (ME_Documentos.DOC_FECHA = '${fecha}') 
            AND (ME_Documentos.CODDOC = '${coddoc}') 
            AND (ME_Documentos.DOC_NUMERO = '${ncorrelativo}')`;

    execute.Query(res,qry);
});

router.put("/pedidoquitaritem", async(req,res)=>{

    const {sucursal,coddoc,correlativo,item,totalprecio,totalcosto} = req.body;

    let qry = `DELETE FROM ME_DOCPRODUCTOS WHERE CODDOC='${coddoc}' AND DOC_NUMERO='${correlativo}' AND DOC_ITEM=${item} AND CODSUCURSAL='${sucursal}';`
    let qryEditDocto = `UPDATE ME_DOCUMENTOS SET DOC_TOTALCOSTO=(DOC_TOTALCOSTO-${totalcosto}), DOC_TOTALVENTA=(DOC_TOTALVENTA-${totalprecio}), DOC_SUBTOTALIVA=(DOC_TOTALVENTA-${totalprecio}), DOC_SUBTOTAL=(DOC_TOTALVENTA-${totalprecio}), DOC_TOTCOSINV=(DOC_TOTALCOSTO-${totalcosto}) WHERE CODDOC='${coddoc}' AND DOC_NUMERO='${correlativo}' AND CODSUCURSAL='${sucursal}';`

        
    execute.Query(res,qry + qryEditDocto);

});


router.post("/embarquespendientes", async(req,res)=>{
     const sucursal = req.body.sucursal;

    let qry = `SELECT CODIGO AS CODEMBARQUE, NOMRUTA AS RUTA FROM ME_EMBARQUES WHERE CODSUCURSAL='${sucursal}'`;
    
    execute.Query(res,qry);
});

router.post("/embarquesrepartidor", async(req,res)=>{
    const {sucursal,codrepartidor} = req.body;

   let qry = `SELECT CODIGO AS CODEMBARQUE, NOMRUTA AS RUTA FROM ME_EMBARQUES 
                WHERE STATUS='PENDIENTE' AND CODSUCURSAL='${sucursal}' AND CODCHOFER=${codrepartidor}`;
   
   execute.Query(res,qry);
});

// ENVIA LOS DOCUMENTOS DE UN PICKING
router.post('/pickingdocumentos',async (req,res)=>{

    const {sucursal,embarque} = req.body;
    
    let qry = `SELECT ME_Documentos.DOC_NUMORDEN AS EMBARQUE, ME_Vendedores.NOMVEN AS VENDEDOR, ME_Documentos.CODDOC, ME_Documentos.DOC_NUMERO AS CORRELATIVO, ME_Documentos.DOC_FECHA AS FECHA, 
    ME_Documentos.DOC_NOMREF AS CLIENTE, ME_Documentos.DOC_TOTALCOSTO AS TOTALCOSTO, ME_Documentos.DOC_TOTALVENTA AS TOTALPRECIO, ME_Documentos.CODVEN
    FROM ME_Documentos LEFT OUTER JOIN
    ME_Vendedores ON ME_Documentos.CODSUCURSAL = ME_Vendedores.CODSUCURSAL AND ME_Documentos.CODVEN = ME_Vendedores.CODVEN LEFT OUTER JOIN
    ME_Tipodocumentos ON ME_Documentos.CODSUCURSAL = ME_Tipodocumentos.CODSUCURSAL AND ME_Documentos.CODDOC = ME_Tipodocumentos.CODDOC AND ME_Documentos.EMP_NIT = ME_Tipodocumentos.EMP_NIT
    WHERE (ME_Documentos.DOC_ESTATUS = 'I') AND (ME_Tipodocumentos.TIPODOC = 'PED') AND (ME_Documentos.DOC_NUMORDEN = '${embarque}') AND (ME_Documentos.CODSUCURSAL = '${sucursal}')
    ORDER BY ME_Vendedores.NOMVEN, ME_Documentos.DOC_FECHA, ME_Documentos.CODDOC, ME_Documentos.DOC_NUMERO`;

  
    execute.Query(res,qry);

});

// ENVIA LOS PRODUCTOS DE UN PICKING
router.post('/pickingproductos', async (req,res)=>{

    const {sucursal,embarque}= req.body;

    let qry = `
    SELECT       ME_Documentos.DOC_NUMORDEN AS EMBARQUE, ME_Embarques.NomRuta AS RUTA, ME_Docproductos.CODPROD, ME_Productos.DESPROD, SUM(ME_Docproductos.CANTIDADINV) AS TOTALUNIDADES, 
                         ME_Productos.EQUIVALEINV AS UXC, SUM(ME_Docproductos.CANTIDADINV) / ME_Productos.EQUIVALEINV AS CAJAS, SUM(ME_Docproductos.TOTALCOSTO) AS TOTALCOSTO, SUM(ME_Docproductos.TOTALPRECIO) 
                         AS TOTALPRECIO
    FROM ME_Embarques RIGHT OUTER JOIN
                         ME_Documentos ON ME_Embarques.Codigo = ME_Documentos.DOC_NUMORDEN AND ME_Embarques.CODSUCURSAL = ME_Documentos.CODSUCURSAL LEFT OUTER JOIN
                         ME_Productos RIGHT OUTER JOIN
                         ME_Docproductos ON ME_Productos.CODSUCURSAL = ME_Docproductos.CODSUCURSAL AND ME_Productos.CODPROD = ME_Docproductos.CODPROD ON 
                         ME_Documentos.CODSUCURSAL = ME_Docproductos.CODSUCURSAL AND ME_Documentos.DOC_ANO = ME_Docproductos.DOC_ANO AND ME_Documentos.DOC_NUMERO = ME_Docproductos.DOC_NUMERO AND 
                         ME_Documentos.CODDOC = ME_Docproductos.CODDOC AND ME_Documentos.EMP_NIT = ME_Docproductos.EMP_NIT
    GROUP BY ME_Documentos.DOC_NUMORDEN, ME_Embarques.NomRuta, ME_Docproductos.CODPROD, ME_Productos.DESPROD, ME_Productos.EQUIVALEINV, ME_Documentos.CODSUCURSAL
    HAVING (ME_Documentos.CODSUCURSAL = '${sucursal}') AND (ME_Documentos.DOC_NUMORDEN = '${embarque}')
    ORDER BY ME_Docproductos.CODPROD, ME_Productos.DESPROD
    `
    execute.Query(res,qry);

});


module.exports = router;