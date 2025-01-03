const execute = require('./connection');
const express = require('express');
const router = express.Router();

router.post("/setreminder", async(req,res)=>{

    const{sucursal,codclie,nit,nombre,direccion,fecha,hora,minuto,recordatorio} = req.body;

    let qry = `INSERT INTO ME_RECORDATORIOS (CODSUCURSAL,CODCLIE,NIT,NOMCLIE,DIRECCION,HORA,MINUTO,FECHA,RECORDATORIO)
     VALUES ('${sucursal}',${codclie},'${nit}','${nombre}','${direccion}',${hora},${minuto},'${fecha}','${recordatorio}');`

     execute.Query(res,qry);
     
});

//CENSO
router.post('/censovendedor',async(req,res)=>{

    const {sucursal,codven,visita} = req.body;
    
    let qry = `SELECT ME_CENSO.ID, ME_CENSO.FECHA, ME_CENSO.CODCLIE, ME_CENSO.NITCLIE, ME_CENSO.TIPONEGOCIO, ME_CENSO.NEGOCIO, ME_CENSO.NOMCLIE, ME_CENSO.DIRCLIE, ISNULL(ME_CENSO.REFERENCIA, 'SN') AS REFERENCIA, ME_CENSO.CODMUN, 
    ME_Municipios.DESMUNI, ME_CENSO.CODDEPTO, ME_Departamentos.DESDEPTO, ISNULL(ME_CENSO.OBS,'SN') AS OBS, ISNULL(ME_CENSO.TELEFONO,'SN') AS TELEFONO, ME_CENSO.VISITA, ME_CENSO.LAT, ME_CENSO.LONG
    FROM ME_CENSO LEFT OUTER JOIN
    ME_Departamentos ON ME_CENSO.CODDEPTO = ME_Departamentos.CODDEPTO AND ME_CENSO.CODSUCURSAL = ME_Departamentos.CODSUCURSAL LEFT OUTER JOIN
    ME_Municipios ON ME_CENSO.CODMUN = ME_Municipios.CODMUNI AND ME_CENSO.CODSUCURSAL = ME_Municipios.CODSUCURSAL
    WHERE (ME_CENSO.CODSUCURSAL = '${sucursal}') AND (ME_CENSO.CODVEN = ${codven}) AND (ME_CENSO.VISITA='${visita}')
    ORDER BY ME_CENSO.ID`;

    execute.Query(res,qry);
    
})

router.post("/listavendedortodos", async(req,res)=>{

    const {app,sucursal,codven}  = req.body;
    
    let qry = '';

       let qry2 = `SELECT ME_Clientes.NITCLIE AS CODIGO, ME_Clientes.NITFACTURA AS NIT, ME_Clientes.NOMCLIE, ME_Clientes.DIRCLIE, ME_Municipios.DESMUNI, ME_Clientes.TELCLIE AS TELEFONO, ISNULL(ME_Clientes.LATITUD, 0) AS LAT, 
        ISNULL(ME_Clientes.LONGITUD, 0) AS LONG, ISNULL(ME_Clientes.FECHAINGRESO,'2020-04-15') AS LASTSALE, ME_Clientes.FAXCLIE AS STVISITA, ME_Clientes.REFERENCIA
                FROM ME_Clientes LEFT OUTER JOIN
        ME_Municipios ON ME_Clientes.CODSUCURSAL = ME_Municipios.CODSUCURSAL AND ME_Clientes.CODMUNI = ME_Municipios.CODMUNI
                WHERE (ME_Clientes.CODSUCURSAL = '${sucursal}')  
                AND (ME_Clientes.CODVEN = ${codven})
                AND (ME_Clientes.CODCLIE=0)
                ORDER BY ME_Clientes.FECHAINGRESO,ME_Clientes.NOMCLIE`;
    
        qry = `SELECT '${sucursal}' AS CODSUCURSAL, ME_Clientes.NITCLIE AS CODIGO, ME_Clientes.NITFACTURA AS NIT, ME_Clientes.NOMCLIE, ME_Clientes.DIRCLIE, ME_Municipios.DESMUNI, ME_Clientes.TELCLIE AS TELEFONO, ISNULL(ME_Clientes.LATITUD, 0) AS LAT, 
        ISNULL(ME_Clientes.LONGITUD, 0) AS LONG, ISNULL(ME_Clientes.FECHAINGRESO,'2020-04-15') AS LASTSALE, 
        ME_Clientes.FAXCLIE AS STVISITA, ME_Clientes.REFERENCIA, ME_Clientes.VISITA
                FROM ME_Clientes LEFT OUTER JOIN
        ME_Municipios ON ME_Clientes.CODSUCURSAL = ME_Municipios.CODSUCURSAL AND ME_Clientes.CODMUNI = ME_Municipios.CODMUNI
                WHERE (ME_Clientes.CODSUCURSAL = '${sucursal}') 
                AND (ME_Clientes.CODVEN = ${codven})
                AND (ME_Clientes.CODCLIE=0)
                ORDER BY ME_Clientes.FECHAINGRESO,ME_Clientes.NOMCLIE`;
       
    
    execute.Query(res,qry);

})

router.post("/listavendedor", async(req,res)=>{

    const {app,sucursal,codven,dia}  = req.body;
    let qry = '';

    if (dia=='OTROS'){
        qry = `SELECT ME_Clientes.NITCLIE AS CODIGO, ME_Clientes.NITFACTURA AS NIT, ME_Clientes.NOMCLIE, ME_Clientes.DIRCLIE, ME_Municipios.DESMUNI, ME_Clientes.TELCLIE AS TELEFONO, ISNULL(ME_Clientes.LATITUD, 0) AS LAT, 
        ISNULL(ME_Clientes.LONGITUD, 0) AS LONG, ISNULL(ME_Clientes.FECHAINGRESO,'2020-04-15') AS LASTSALE, ME_Clientes.FAXCLIE AS STVISITA, ME_Clientes.REFERENCIA
                FROM ME_Clientes LEFT OUTER JOIN
        ME_Municipios ON ME_Clientes.CODSUCURSAL = ME_Municipios.CODSUCURSAL AND ME_Clientes.CODMUNI = ME_Municipios.CODMUNI
                WHERE (ME_Clientes.CODSUCURSAL = '${sucursal}')  
                AND (ME_Clientes.CODVEN = ${codven})
                AND (ME_Clientes.CODCLIE=0)
                ORDER BY ME_Clientes.FECHAINGRESO,ME_Clientes.NOMCLIE`;
    
    }else{
        qry = `SELECT ME_Clientes.NITCLIE AS CODIGO, ME_Clientes.NITFACTURA AS NIT, ME_Clientes.NOMCLIE, ME_Clientes.DIRCLIE, ME_Municipios.DESMUNI, ME_Clientes.TELCLIE AS TELEFONO, ISNULL(ME_Clientes.LATITUD, 0) AS LAT, 
        ISNULL(ME_Clientes.LONGITUD, 0) AS LONG, ISNULL(ME_Clientes.FECHAINGRESO,'2020-04-15') AS LASTSALE, ME_Clientes.FAXCLIE AS STVISITA, ME_Clientes.REFERENCIA
                FROM ME_Clientes LEFT OUTER JOIN
        ME_Municipios ON ME_Clientes.CODSUCURSAL = ME_Municipios.CODSUCURSAL AND ME_Clientes.CODMUNI = ME_Municipios.CODMUNI
                WHERE (ME_Clientes.CODSUCURSAL = '${sucursal}') 
                AND (ME_Clientes.VISITA = '${dia}') 
                AND (ME_Clientes.CODVEN = ${codven})
                AND (ME_Clientes.CODCLIE=0)
                ORDER BY ME_Clientes.FECHAINGRESO,ME_Clientes.NOMCLIE`;
    
    }

    
    
    execute.Query(res,qry);

})

router.post("/listaajenosvendedor", async(req,res)=>{

    const {app,sucursal,filtro}  = req.body;

    let qry = '';
    qry = `SELECT TOP 30 ME_Clientes.NITCLIE AS CODIGO, ME_Clientes.NITFACTURA AS NIT, ME_Clientes.NOMCLIE, ME_Clientes.DIRCLIE, ME_Municipios.DESMUNI, ME_Clientes.TELCLIE AS TELEFONO, ISNULL(ME_Clientes.LATITUD, 0) AS LAT, 
    ISNULL(ME_Clientes.LONGITUD, 0) AS LONG, ISNULL(ME_Clientes.FECHAINGRESO,'2020-04-15') AS LASTSALE, ME_Clientes.FAXCLIE AS STVISITA, ME_Clientes.REFERENCIA
            FROM ME_Clientes LEFT OUTER JOIN
    ME_Municipios ON ME_Clientes.CODSUCURSAL = ME_Municipios.CODSUCURSAL AND ME_Clientes.CODMUNI = ME_Municipios.CODMUNI
            WHERE (ME_Clientes.CODSUCURSAL = '${sucursal}') 
            AND (ME_Clientes.NOMCLIE LIKE '%${filtro}%') 
            AND (ME_Clientes.CODCLIE=0) 
            OR
            (ME_Clientes.CODSUCURSAL = '${sucursal}') 
            AND (ME_Clientes.NITCLIE= '${filtro}') 
            AND (ME_Clientes.CODCLIE=0)
            ORDER BY ME_Clientes.FECHAINGRESO,ME_Clientes.NOMCLIE`
    
    execute.Query(res,qry);

})

//LISTADO DE CLIENTES POR SUCURSAL
router.post('/clientesvendedor',async(req,res)=>{

    const {sucursal,codven} = req.body;
    
    let qry = `SELECT ME_Clientes.NITCLIE AS CODIGO, ME_Clientes.NITFACTURA AS NIT, ME_Clientes.NOMCLIE, ME_Clientes.DIRCLIE, ME_Clientes.CODMUNI, ME_Municipios.DESMUNI, ME_Clientes.CODDEPTO, ME_Departamentos.DESDEPTO, 
    ME_Clientes.TELCLIE AS TELEFONO, ME_Clientes.CODVEN, ME_Vendedores.NOMVEN, ME_Clientes.LATITUD AS LAT, ME_Clientes.LONGITUD AS LONG, ME_Clientes.VISITA, ME_Clientes.CODCLIE AS ACTIVO, 
    ME_Clientes.CODSUCURSAL, ME_Clientes.FECHAINGRESO AS LASTSALE
        FROM            ME_Clientes LEFT OUTER JOIN
    ME_Vendedores ON ME_Clientes.CODVEN = ME_Vendedores.CODVEN AND ME_Clientes.CODSUCURSAL = ME_Vendedores.CODSUCURSAL LEFT OUTER JOIN
    ME_Departamentos ON ME_Clientes.CODSUCURSAL = ME_Departamentos.CODSUCURSAL AND ME_Clientes.CODDEPTO = ME_Departamentos.CODDEPTO LEFT OUTER JOIN
    ME_Municipios ON ME_Clientes.CODSUCURSAL = ME_Municipios.CODSUCURSAL AND ME_Clientes.CODMUNI = ME_Municipios.CODMUNI
    WHERE (ME_Clientes.CODSUCURSAL = '${sucursal}') AND (ME_Clientes.CODVEN=${codven})
    ORDER BY ME_Clientes.FECHAINGRESO,ME_Clientes.VISITA,ME_Clientes.NOMCLIE`;

    execute.Query(res,qry);
    
})

//ESTABLECE LA FECHA DE ULTIMA VENTA DEL CLIENTE
router.post('/lastsale',async(req,res)=>{
    const {sucursal,nitclie,fecha,visita} = req.body;

    //FAXCLIE= SERÁ USADO PARA INDICAR EL RESULTADO DE LA VISITA: VENTA,NODINERO,CERRADO
    let qry = `UPDATE ME_CLIENTES SET FECHAINGRESO='${fecha}',FAXCLIE='${visita}' WHERE CODSUCURSAL='${sucursal}' AND NITCLIE='${nitclie}' `;

    execute.Query(res,qry);

})

//DESACTIVA EL CLIENTE CAMBIANDO EL CAMPO CODCLIE DE 0 A 1
router.put('/desactivar',async(req,res)=>{
    const {sucursal,nitclie} = req.body;
    
    let qry = `UPDATE ME_CLIENTES SET CODCLIE=1 WHERE CODSUCURSAL='${sucursal}' AND NITCLIE='${nitclie}' `;

    execute.Query(res,qry);

})

//RE-ACTIVA EL CLIENTE CAMBIANDO EL CAMPO CODCLIE DE 1 A 0
router.put('/reactivar',async(req,res)=>{
    const {sucursal,nitclie} = req.body;
    
    let qry = `UPDATE ME_CLIENTES SET CODCLIE=0 WHERE CODSUCURSAL='${sucursal}' AND NITCLIE='${nitclie}' `;

    execute.Query(res,qry);

})


// BUSCA CLIENTE POR NOMBRE
router.get("/buscarcliente", async(req,res)=>{
    const {app,empnit,filtro} = req.query;
        
    let qry ='';

            qry = `SELECT ME_Clientes.NITCLIE AS CODCLIE, ME_Clientes.NITFACTURA AS NIT, ME_Clientes.NOMCLIE, ME_Clientes.DIRCLIE, ME_Clientes.CODMUNI AS CODMUNICIPIO, ME_Municipios.DESMUNI AS DESMUNICIPIO, 
            ME_Clientes.CODDEPTO, ME_Departamentos.DESDEPTO, ME_Clientes.LISTA AS PRECIO, 0 AS SALDO, ISNULL(ME_Clientes.LATITUD, 0) AS LAT, ISNULL(ME_Clientes.LONGITUD, 0) AS LONG
            FROM ME_Clientes LEFT OUTER JOIN
            ME_Municipios ON ME_Clientes.CODSUCURSAL = ME_Municipios.CODSUCURSAL AND ME_Clientes.CODMUNI = ME_Municipios.CODMUNI LEFT OUTER JOIN
            ME_Departamentos ON ME_Clientes.CODSUCURSAL = ME_Departamentos.CODSUCURSAL AND ME_Clientes.CODDEPTO = ME_Departamentos.CODDEPTO
        WHERE (ME_Clientes.CODSUCURSAL = '${app}') 
        AND (ME_Clientes.NOMCLIE LIKE '%${filtro}%')
        `     
    
    execute.Query(res,qry);

});

// AGREGA UN NUEVO CLIENTE
router.post("/clientenuevo", async(req,res)=>{
    const {app,fecha,codven,empnit,codclie,nitclie,nomclie,nomfac,dirclie,coddepto,codmunicipio,codpais,telclie,emailclie,codbodega,tipoprecio,lat,long} = req.body;
    
    let qry ='';

    
            qry = `INSERT INTO ME_CLIENTES (
                EMP_NIT, NITCLIE, CODCLIE, NOMCLIE, DIRCLIE,
                CODDEPTO, CODMUNI, TELCLIE, EMAILCLIE, TIPOCLIE,
                ACEPTACHEQUE, FECHAINGRESO, NITFACTURA, CODVEN, LIMITECREDITO,
                DIASCREDITO, CODPAIS, NOMFAC, CODBODEGA, DESCUENTO,
                CODTIPOCLIE, COMISION, IMPUESTO1, TEMPORADACREDITO, TEMPORADADIAS,
                VENTADOLARES, VENTAEXPORTA, MONTOIVARET, PORIVARET, CODTIPOFP,
                UTILIZAPUNTOS, TIPOPUNTOS, NCUOTAS, VARIASLISTAS, DIASPRIMERCUOTA,
                DIASCUOTAS, CALCULOCUOTAS, CLIE_CARGOAUT, TIPO_CARGOAUT, LATITUDCLIE, LONGITUDCLIE,
                LATITUD, LONGITUD
            )VALUES(
                '${empnit}','${codclie}',0,'${nomclie}','${dirclie}',
                '${coddepto}','${codmunicipio}','${telclie}','${emailclie}','${tipoprecio}',
                0,'${fecha}','${nitclie}','${codven}',0,
                30,'${codpais}','${nomfac}','${codbodega}',0,
                'A',0,0,0,0,
                0,0,0,0,0,
                0,'NUNCA',0,0,0,
                0,0,0,0,0,0,
                '${lat}','${long}'
            )`         
    
    execute.Query(res,qry);

});

//LISTADO DE MUNICIPIOS EN EL SISTEMA
router.get("/municipios", async(req,res)=>{
    const {app,empnit} = req.query;
    let qry ='';

    qry = `SELECT CODMUNI AS CODMUNICIPIO, DESMUNI AS DESMUNICIPIO FROM ME_MUNICIPIOS WHERE CODSUCURSAL='${app}' ORDER BY PRIMERO DESC`         

    execute.Query(res,qry);
});

//LISTADO DE MUNICIPIOS EN EL SISTEMA
router.get("/departamentos", async(req,res)=>{
    const {app,empnit} = req.query;
    let qry ='';

    qry = `SELECT CODDEPTO, DESDEPTO FROM ME_DEPARTAMENTOS WHERE CODSUCURSAL='${app}' ORDER BY PRIMERO DESC`         

    execute.Query(res,qry);
    
});



module.exports = router;
