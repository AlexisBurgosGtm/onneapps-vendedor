const execute = require('./connection');
const express = require('express');
const router = express.Router();


//REPORTE DE VENTAS Y DEVOLUCIONES
router.post('/rptventas_vendedor',async(req,res)=>{

    const{sucursal, codven, mes, anio} = req.body;

    let qry = `SELECT DISTINCT       NOMVEN,FECHA, TIPO, SUM(TOTALPRECIO)  AS TOTALPRECIO, LASTUPDATE
    FROM            ME_RPT_VENTAS
    GROUP BY NOMVEN,FECHA, TIPO, LASTUPDATE, CODSUCURSAL, ANIO, MES, CODVEN
    HAVING        (ANIO = ${anio}) AND (MES = ${mes}) AND (CODSUCURSAL = '${sucursal}') AND (CODVEN=${codven})
    ORDER BY FECHA
    `;

    execute.Query(res,qry);
});


//EDICION DEL PEDIDO
router.post('/loadpedido',async(req,res)=>{

    const {sucursal, usuario, coddoc, correlativo} = req.body;
    
    let qry='';
    qry = `SELECT EMP_NIT AS EMPNIT, CODPROD, DESCRIPCION AS DESPROD, 
        CODMEDIDA, CANTIDAD, EQUIVALE, CANTIDADINV AS TOTALUNIDADES, 
        COSTO, PRECIO, TOTALCOSTO, TOTALPRECIO, 0 AS EXENTO, 
        '${usuario}' AS USUARIO, TIPOPRECIO, '${sucursal}' AS CODSUCURSAL 
        FROM ME_DOCPRODUCTOS
        WHERE CODSUCURSAL='${sucursal}' 
        AND CODDOC='${coddoc}' 
        AND DOC_NUMERO='${correlativo}'; `

    execute.Query(res, qry);

})

router.post('/loadpedido_original',async(req,res)=>{

    const {sucursal, usuario, coddoc, correlativo} = req.body;

    let qrydel = `DELETE FROM ME_TEMP_VENTAS 
            WHERE CODSUCURSAL='${sucursal}' 
            AND USUARIO='${usuario}'; `

    let qry='';
    qry = `INSERT INTO ME_TEMP_VENTAS 
            (EMPNIT,CODPROD,DESPROD,CODMEDIDA,CANTIDAD,EQUIVALE,TOTALUNIDADES,COSTO,PRECIO,TOTALCOSTO,TOTALPRECIO,EXENTO,USUARIO,TIPOPRECIO,CODSUCURSAL) 
        SELECT EMP_NIT AS EMPNIT, CODPROD, DESCRIPCION AS DESPROD, 
        CODMEDIDA, CANTIDAD, EQUIVALE, CANTIDADINV AS TOTALUNIDADES, 
        COSTO, PRECIO, TOTALCOSTO, TOTALPRECIO, 0 AS EXENTO, '${usuario}' AS USUARIO, TIPOPRECIO, '${sucursal}' AS CODSUCURSAL 
        FROM ME_DOCPRODUCTOS
        WHERE CODSUCURSAL='${sucursal}' 
        AND CODDOC='${coddoc}' 
        AND DOC_NUMERO='${correlativo}'; `

    execute.Query(res,qrydel + qry);

})


router.post('/eliminarpedidocargado',async(req,res)=>{

    const {sucursal,coddoc,correlativo} = req.body;

    let qry = `DELETE FROM ME_DOCUMENTOS 
    WHERE CODSUCURSAL='${sucursal}' 
    AND CODDOC='${coddoc}' AND DOC_NUMERO='${correlativo}'
    AND DOC_ESTATUS='O'; `
    let qryprods = `DELETE FROM ME_DOCPRODUCTOS 
        WHERE CODSUCURSAL='${sucursal}' AND CODDOC='${coddoc}' 
        AND DOC_NUMERO='${correlativo}' ;`

    execute.Query(res, qry + qryprods);

})


// VENTANA DE VENTAS
///////////////////////////////////////
router.get("/json", async(req,res)=>{
    let qry = `SELECT       ME_Productos.CODPROD, ME_Productos.DESPROD, ME_Precios.CODMEDIDA, ME_Precios.EQUIVALE, ME_Precios.COSTO, ME_Precios.PRECIO
    FROM            ME_Productos INNER JOIN
                             ME_Precios ON ME_Productos.EMP_NIT = ME_Precios.EMP_NIT AND ME_Productos.CODPROD = ME_Precios.CODPROD AND ME_Productos.CODSUCURSAL = ME_Precios.CODSUCURSAL
    WHERE        (ME_Productos.CODSUCURSAL = 'ME-IZABAL') FOR XML AUTO`
    execute.Query(res,qry);

})

// VENTAS BUSCAR PRODUCTO POR DESCRIPCION
router.get("/buscarproducto", async(req,res)=>{
    
    const {empnit,filtro,app,tipoprecio} = req.query;
    // app= sucusal
    // K= CAMBIO DE PRODUCTO

    let qry ='';

    let campoprecio = '';
    let equ = '<>0'; //equivalente diferente a cero para que jale todos
    switch (tipoprecio) {
        case 'P':
            campoprecio = 'ME_PRECIOS.PRECIO';        
            break;
        case 'C':
            campoprecio = 'ME_PRECIOS.MAYORISTA';
            break;
        case 'B':
            campoprecio = 'ME_PRECIOS.ESCALA';
            break;
        case 'A':
            campoprecio = 'ME_PRECIOS.OFERTA';
            break;
        case 'K':
            campoprecio = '0.01';
            equ = '=1'; //equivalente =1 para que solo me jale las unidades

            break;
        default:
            campoprecio = 'ME_PRECIOS.PRECIO';
            break;
    }
    
    
    qry = `SELECT TOP 20 ME_Productos.CODPROD, ME_Productos.DESPROD, ME_Precios.CODMEDIDA, 
                ME_Precios.EQUIVALE, ME_Precios.COSTO, ${campoprecio} AS PRECIO, 
                ME_Marcas.DESMARCA, 0 AS EXENTO, ISNULL(ME_PRODUCTOS.EXISTENCIA,0) AS EXISTENCIA,
                ME_Productos.DESPROD3
            FROM ME_Productos LEFT OUTER JOIN
                ME_Marcas ON ME_Productos.CODSUCURSAL = ME_Marcas.CODSUCURSAL AND ME_Productos.CODMARCA = ME_Marcas.CODMARCA LEFT OUTER JOIN
                ME_Precios ON ME_Productos.CODSUCURSAL = ME_Precios.CODSUCURSAL AND ME_Productos.CODPROD = ME_Precios.CODPROD
            WHERE (ME_Productos.DESPROD LIKE '%${filtro}%') AND (ME_Productos.CODSUCURSAL = '${app}') AND (ME_Precios.EQUIVALE ${equ}) 
                OR (ME_Productos.CODPROD = '${filtro}') AND (ME_Productos.CODSUCURSAL = '${app}') AND (ME_Precios.EQUIVALE ${equ})
            ORDER BY ME_Precios.CODPROD, ME_Precios.CODMEDIDA` 
    
        
    execute.Query(res,qry);

})


// VENTAS BUSCAR PRODUCTO POR DESCRIPCION
router.post("/buscarproductotodos", async(req,res)=>{
    
    const {sucursal} = req.body;
    // app= sucusal
    // K= CAMBIO DE PRODUCTO

    let qry ='';

     
    qry = `SELECT ME_Productos.CODSUCURSAL, ME_Productos.CODPROD, ME_Productos.DESPROD, ME_Precios.CODMEDIDA, 
                ME_Precios.EQUIVALE, 
                ME_Precios.COSTO, 
                ME_PRECIOS.PRECIO AS PRECIO,
                ME_PRECIOS.OFERTA AS PRECIOA,
                ME_PRECIOS.ESCALA AS PRECIOB,
                ME_PRECIOS.MAYORISTA AS PRECIOC,
                0.01 AS CAMBIO, 
                ME_Marcas.DESMARCA, 
                0 AS EXENTO, 
                ISNULL(ME_PRODUCTOS.EXISTENCIA,0) AS EXISTENCIA,
                ME_Productos.DESPROD3
            FROM ME_Productos LEFT OUTER JOIN
                ME_Marcas ON ME_Productos.CODSUCURSAL = ME_Marcas.CODSUCURSAL AND ME_Productos.CODMARCA = ME_Marcas.CODMARCA LEFT OUTER JOIN
                ME_Precios ON ME_Productos.CODSUCURSAL = ME_Precios.CODSUCURSAL AND ME_Productos.CODPROD = ME_Precios.CODPROD
            WHERE (ME_Productos.CODSUCURSAL = '${sucursal}') 
            ORDER BY ME_Precios.CODPROD, ME_Precios.CODMEDIDA` 
            
    execute.Query(res,qry);

})

// obtiene el total de temp ventas según sea el usuario
router.get("/tempVentastotal", async(req,res)=>{
    let empnit = req.query.empnit;
    let usuario = req.query.usuario;
    let token = req.query.token;
    let app = req.query.app;

    let qry = '';


            qry = `SELECT COUNT(CODPROD) AS TOTALITEMS, SUM(TOTALCOSTO) AS TOTALCOSTO, SUM(TOTALPRECIO) AS TOTALPRECIO, SUM(EXENTO) AS TOTALEXENTO
            FROM ME_TEMP_VENTAS
            WHERE (CODSUCURSAL = '${app}') AND (USUARIO = '${usuario}')`        

    execute.Query(res,qry);
    
});

// obtiene el grid de temp ventas
router.get("/tempVentas", async(req,res)=>{
    let empnit = req.query.empnit;
    let coddoc = req.query.coddoc;
    let usuario = req.query.usuario;
    let token = req.query.token;
    let app = req.query.app;

    let qry = '';

    qry = `SELECT 
            ME_TEMP_VENTAS.ID,ME_TEMP_VENTAS.CODPROD, 
            ME_TEMP_VENTAS.DESPROD, 
            ME_TEMP_VENTAS.CODMEDIDA, 
            ME_TEMP_VENTAS.CANTIDAD, 
            ME_TEMP_VENTAS.EQUIVALE,
            ME_TEMP_VENTAS.COSTO,
            ME_TEMP_VENTAS.TOTALCOSTO,  
            ME_TEMP_VENTAS.PRECIO, 
            ME_TEMP_VENTAS.TOTALPRECIO
                FROM ME_TEMP_VENTAS 
            WHERE (ME_TEMP_VENTAS.CODSUCURSAL = '${app}') AND (ME_TEMP_VENTAS.USUARIO = '${usuario}')
            ORDER BY ME_TEMP_VENTAS.ID DESC`

       
    execute.Query(res,qry);
    
});

// obtiene row de temp ventas
router.post("/tempVentasRow", async(req,res)=>{
    
    const {id,app} = req.body;

    let qry = '';
    
    qry = `SELECT ID,CODPROD,DESPROD,CODMEDIDA,CANTIDAD,EQUIVALE,COSTO,PRECIO,EXENTO FROM ME_TEMP_VENTAS WHERE ID=${id}`
  
    execute.Query(res,qry);
    
});

// ACTUALIZA el grid de temp ventas
router.put("/tempVentasRow", async(req,res)=>{
    
    const {app,id,totalcosto,totalprecio,cantidad,totalunidades,exento} = req.body;
    
    let qry = '';
    
    qry = `UPDATE ME_TEMP_VENTAS SET CANTIDAD=${cantidad},TOTALCOSTO=${totalcosto},TOTALPRECIO=${totalprecio},TOTALUNIDADES=${totalunidades},EXENTO=${exento} WHERE ID=${id}`
    
    
    execute.Query(res,qry);
    
});

// inserta un nuevo registro en temp ventas   
router.post("/tempVentas", async(req,res)=>{
        
    let empnit = req.body.empnit;
    let usuario = req.body.usuario;
    let token = req.body.token;

    let tipoprecio = req.body.tipoprecio;

    let codprod = req.body.codprod;
    let desprod = req.body.desprod;
    let codmedida= req.body.codmedida;
    let cantidad=Number(req.body.cantidad);
    let equivale = Number(req.body.equivale);
    let totalunidades = Number(req.body.totalunidades);
    let costo = Number(req.body.costo);
    let precio=Number(req.body.precio);
    let totalcosto =Number(req.body.totalcosto);
    let totalprecio=Number(req.body.totalprecio);
    let exento=Number(req.body.exento);

    let coddoc = req.body.coddoc;


    let app = req.body.app;
    let qry = '';

    qry = `INSERT INTO ME_TEMP_VENTAS 
            (EMPNIT,CODPROD,DESPROD,CODMEDIDA,CANTIDAD,EQUIVALE,TOTALUNIDADES,COSTO,PRECIO,TOTALCOSTO,TOTALPRECIO,EXENTO,USUARIO,TIPOPRECIO,CODSUCURSAL) 
    VALUES ('${empnit}','${codprod}','${desprod}','${codmedida}',${cantidad},${equivale},${totalunidades},${costo},${precio},${totalcosto},${totalprecio},${exento},'${usuario}','${tipoprecio}','${app}')`        
     
        
   execute.Query(res,qry);

});

// elimina un item de la venta
router.delete("/tempVentas", async(req,res)=>{
    let id=Number(req.body.id);
    

      let qry = `DELETE FROM ME_TEMP_VENTAS WHERE ID=${id}`
    
   execute.Query(res,qry);

});

// elimina un item de la venta todos 
router.post("/tempVentastodos", async(req,res)=>{
    const{empnit,usuario,app} = req.body;
    let qry = "";
   
    qry = `DELETE FROM ME_TEMP_VENTAS WHERE CODSUCURSAL='${app}' AND USUARIO='${usuario}'`

    execute.Query(res,qry);

});

// SIN USAR
// VENTAS BUSCAR CLIENTE POR NIT O CODIGO
router.get("/buscarcliente", async(req,res)=>{
    
    const {empnit,nit, app} = req.query;
    
    let qry = '';

    qry = `SELECT NITCLIE AS CODCLIENTE,NITFACTURA AS NIT,NOMCLIE AS NOMCLIENTE,DIRCLIE AS DIRCLIENTE,TIPOCLIE AS CATEGORIA FROM ME_CLIENTES WHERE NITCLIE='${nit}' AND CODSUCURSAL='${app}'`         

    execute.Query(res,qry);

});

// INSERTA UN PEDIDO EN LAS TABLAS DE DOCUMENTOS Y DOCPRODUCTOS
router.post("/documentos", async (req,res)=>{
    
    const {app,empnit,anio,mes,dia,coddoc,fecha,fechaentrega,formaentrega,codcliente,nomclie,codbodega,totalcosto,totalprecio,nitclie,dirclie,obs,direntrega,usuario,codven,lat,long} = req.body;
    

    let correlativo = req.body.correlativo;
    let ncorrelativo = correlativo;

    //variables sin asignar
    let concre = 'CRE';
    let abono = totalprecio; 
    let saldo = totalprecio;
    let pagotarjeta = 0; let recargotarjeta = 0;
    let codrep = 0;
    let totalexento=0;

    switch (correlativo.toString().length) {
        case 1:
            correlativo = '         ' + correlativo;
        break;
        case 2:
            correlativo = '        ' + correlativo;
        break;
        case 3:
            correlativo = '       ' + correlativo;
            
        break;
        case 4:
            correlativo = '      ' + correlativo;
            break;
        case 5:
            correlativo = '     ' + correlativo;
            break;
        case 6:
            correlativo = '    ' + correlativo;
            break;
        case 7:
            correlativo = '   ' + correlativo;
            break;
        case 8:
            correlativo = '  ' + correlativo;
        break;
        case 9:
            correlativo = ' ' + correlativo;
        break;
        case 10:
            correlativo = correlativo;
        break;
        default:
            break;
    };
    
    let nuevocorrelativo = Number(ncorrelativo) + 1;


    let qry = ''; // inserta los datos en la tabla documentos
    let qrydoc = ''; // inserta los datos de la tabla docproductos
    let qrycorrelativo = ''; //actualiza el correlativo del documento

            qry = `INSERT INTO ME_DOCUMENTOS (
                EMP_NIT, DOC_ANO, DOC_MES, CODDOC, DOC_NUMERO, 
                CODCAJA, DOC_FECHA, DOC_NUMREF, DOC_NOMREF, BODEGAENTRADA,
                BODEGASALIDA, USUARIO, DOC_ESTATUS, DOC_TOTALCOSTO, DOC_TOTALVENTA,
                DOC_HORA, DOC_FVENCE, DOC_DIASCREDITO, DOC_CONTADOCREDITO, DOC_DESCUENTOTOTAL,
                DOC_DESCUENTOPROD, DOC_PORDESCUTOTAL, DOC_IVA, DOC_SUBTOTALIVA, DOC_SUBTOTAL,
                NITCLIE, DOC_PORDESCUFAC, CODVEN, DOC_ABONOS, DOC_SALDO,
                DOC_VUELTO, DOC_NIT, DOC_PAGO, DOC_CODREF, DOC_TIPOCAMBIO,
                DOC_PARCIAL, DOC_ANTICIPO, ANT_CODDOC, ANT_DOCNUMERO, DOC_OBS,
                DOC_PORCENTAJEIVA, DOC_ENVIO, DOC_CUOTAS, DOC_TIPOCUOTA, 
                DIVA_NUMINT, FRT_CODIGO, TRANSPORTE, DOC_REFPEDIDO, DOC_REFFACTURA,
                CODPROV, DOC_TOTALOTROS, DOC_RECIBO, DOC_MATSOLI, DOC_REFERENCIA, 
                DOC_LUGAR, DOC_ANOMBREDE, DOC_IVAEXO, DOC_VALOREXO, DOC_SECTOR,
                DOC_DIRENTREGA, DOC_CANTENV, DOC_EXP, DOC_FECHAENT, TIPOPRODUCCION,
                DOC_TOTCOSINV, DOC_TOTALFIN, USUARIOENUSO, DOC_IMPUESTO1, DOC_TOTALIMPU1,
                DOC_PORCOMI, DOC_DOLARES, CODMESA, DOC_TIPOOPE, USUARIOAUTORIZA, 
                NUMAUTORIZA, DOC_TEMPORADA, DOC_INGUAT,
                CODVENBOD,
                CODHABI, DOC_SERIE,
                CTABAN, NUMINTBAN, 
                CODVENEMP,
                DOC_TOTCOSDOL, DOC_TOTCOSINVDOL, CODUNIDAD,
                TOTCOMBUSTIBLE, DOC_CODCONTRA, DOC_NUMCONTRA, INTERES, ABONOINTERES,
                SALDOINTERES, NUMEROCORTE, DOC_PORLOCAL, DOC_NUMORDEN, DOC_FENTREGA,
                DOC_INTERESADO, DOC_RECIBE, NUMEROROLLO, COD_CENTRO, GENCUOTA,
                DOC_PORINGUAT, DOC_INGUATEXENTO, DOC_TIPOTRANIVA, DOC_PORTIMBREPRE, DOC_TIMBREPRENSA,
                ABONOSANTICIPO, SALDOANTICIPO, DOC_PRODEXENTO, PUNTOSGANADOS, PUNTOSUSADOS,
                APL_ANTICIPO, COD_DEPARTA, FIRMAELECTRONICA, DOC_CODDOCRETENCION, DOC_SERIERETENCION,
                DOC_NUMRETENCION, FIRMAISC, ISCENVIADO, LAT, LONG, CODSUCURSAL
                ) 
                VALUES (
                '${empnit}', ${anio}, ${mes}, '${coddoc}', '${correlativo}',
                '', '${fecha}', '', '${nomclie}', '',
                '${codbodega}', '${usuario}', 'O', ${totalcosto}, ${totalprecio},
                0, '${fecha}', 0, '${concre}', 0,
                0, 0, 0, ${totalprecio}, ${totalprecio},
                '${nitclie}', 0, '${codven}', 0, ${saldo}, 
                0, '${nitclie}', 0, '', 1, 
                0, 0, '', '', '${obs}',
                0, 0, 0, 0, 
                0, '', '${formaentrega}', '', '',
                '', 0, 0, '${direntrega}', '', 
                '', '', '', 0, '', 
                '${dirclie}', '', '', '${fechaentrega}', '',
                ${totalcosto}, 0, '', 0, 0,
                0, 0, '', 0,'',
                0, 0, 0,
                0,
                '', '', 
                0, 0, 
                0,
                0, 0, '',
                0, '', '', 0, 0, 
                0, 0, 0, '','NO',
                '', '', 0, '', '',
                0, 'N', 'C', 0, 0,
                0, 0, 0, 0, 0,
                '', '', '', '', '',
                '', '', 0, ${lat},${long},'${app}'
                );`
                  //GETANSINULL()
            qrydoc = `INSERT INTO ME_DOCPRODUCTOS 
                  (EMP_NIT,DOC_ANO,DOC_MES,CODDOC,DOC_NUMERO,
                  DOC_ITEM,CODPROD,CODMEDIDA,CANTIDAD,EQUIVALE,
                  CANTIDADINV,COSTO,PRECIO,TOTALCOSTO,TOTALPRECIO,
                  BODEGAENTRADA,BODEGASALIDA,SUBTOTAL,DESCUENTOPROD,PORDESCUPROD,
                  DESCUENTOFAC,PORDESCUFAC,TOTALDESCUENTO,DESCRIPCION,SUBTOTALPROD,
                  TIPOCAMBIO,PRODPRECIO,CANTIDADENVIADA,CODFAC,NUMFAC,
                  ITEMFAC,NOAFECTAINV, DOCPESO,COSTOINV,FLETE,TOTALPRECIOFIN,PRECIOFIN,TOTALCOSTOINV,CANTIDADBONI,CODOPR,NUMOPR,
                  ITEMOPR,CODINV,NUMINV,ITEMINV,TIPOCLIE,LISTA,PORIVA,VALORIVA,NOLOTE,VALORIMPU1,DESEMPAQUE,
                  SALDOINVANTCOM,NCUENTAMESA,CUENTACERRADA,COSTODOL,COSTOINVDOL,TOTALCOSTODOL,TOTALCOSTOINVDOL,
                  IMPCOMBUSTIBLE,CODVENPROD,COMIVEN,SOBREPRECIO,CODREG,NUMREG,ITEMREG,CANTIDADORIGINAL,CANTIDADMODIFICADA,NSERIETARJETA,
                  CODOC,NUMOC,PORTIMBREPRENSA,VALORTIMBREPRENSA,CODTIPODESCU,TOTALPUNTOS,ITEMOC,CODPRODORIGEN,CODMEDIDAORIGEN,
                  CANTIDADDEVUELTA,CODARANCEL,TIPOPRECIO,CODSUCURSAL) 
                  SELECT 
                  EMPNIT,${anio} as DOC_ANO,${mes} AS DOC_MES,'${coddoc}' AS CODDOC,'${correlativo}' AS DOC_NUMERO,
                  ID AS DOC_ITEM,CODPROD,CODMEDIDA,CANTIDAD, EQUIVALE,
                  TOTALUNIDADES AS CANTIDADINV,COSTO,PRECIO,TOTALCOSTO,TOTALPRECIO,
                  '','${codbodega}',
                  TOTALPRECIO,0,0,0,0,0,DESPROD,TOTALPRECIO,1,PRECIO,0,'','',0,0,
                  0,COSTO,0,TOTALPRECIO,
                  PRECIO,TOTALCOSTO,0,'','',0,'','',0,
                  'P',
                  '',
                  0,0,'SN',0,'',0,'',0,0,COSTO,0,TOTALCOSTO,0,0,0,0,'','',0,0,0,'','','',0,0,'',0,0,'','',0,'',TIPOPRECIO,'${app}'
                  FROM ME_TEMP_VENTAS   
                  WHERE EMPNIT='${empnit}' AND USUARIO='${usuario}';`
            qrycorrelativo =`UPDATE ME_TIPODOCUMENTOS SET CORRELATIVO=${nuevocorrelativo} WHERE CODSUCURSAL='${app}' AND CODDOC='${coddoc}';`
            
 
    execute.Query(res,qrycorrelativo + qry + qrydoc);
    
});





//******************************* */
// REPORTES DE VENDEDORES
//******************************* */

router.post('/historialcliente',async (req,res)=>{
    const {sucursal,codcliente} = req.body;
    let qry = `
    SELECT ME_Documentos.CODDOC, ME_Documentos.DOC_NUMERO AS CORRELATIVO, ME_Documentos.DOC_FECHA AS FECHA, ME_Documentos.NITCLIE, ME_Docproductos.CODPROD, ME_Docproductos.DESCRIPCION AS DESPROD,
                          ME_Docproductos.CODMEDIDA, ME_Docproductos.CANTIDAD, ME_Docproductos.PRECIO, ME_Docproductos.TOTALPRECIO
    FROM ME_Documentos LEFT OUTER JOIN
                         ME_Docproductos ON ME_Documentos.DOC_NUMERO = ME_Docproductos.DOC_NUMERO AND ME_Documentos.CODDOC = ME_Docproductos.CODDOC AND 
                         ME_Documentos.CODSUCURSAL = ME_Docproductos.CODSUCURSAL AND ME_Documentos.EMP_NIT = ME_Docproductos.EMP_NIT LEFT OUTER JOIN
                         ME_Tipodocumentos ON ME_Documentos.CODSUCURSAL = ME_Tipodocumentos.CODSUCURSAL AND ME_Documentos.CODDOC = ME_Tipodocumentos.CODDOC AND 
                         ME_Documentos.EMP_NIT = ME_Tipodocumentos.EMP_NIT
    WHERE (ME_Tipodocumentos.TIPODOC = 'PED') AND (ME_Documentos.CODSUCURSAL = '${sucursal}') AND (ME_Documentos.NITCLIE = '${codcliente}') ORDER BY ME_Documentos.DOC_FECHA DESC
    `;

    execute.Query(res,qry);
})

// UNA FECHA (DIA)

//Elimina un pedido, desde el vendedor
router.post("/deletepedidovendedor",async(req,res)=>{
    const {sucursal,fecha,codven,coddoc,correlativo} = req.body;

    let qry = `DELETE FROM ME_DOCUMENTOS WHERE CODSUCURSAL='${sucursal}' AND CODDOC='${coddoc}' AND DOC_FECHA='${fecha}' AND DOC_NUMERO='${correlativo}' AND DOC_ESTATUS='O'; `
    let qryprods = `DELETE FROM ME_DOCPRODUCTOS WHERE CODSUCURSAL='${sucursal}' AND CODDOC='${coddoc}' AND DOC_NUMERO='${correlativo}' ;`
    execute.Query(res, qry + qryprods);

})


//LOGRO MES
router.post("/logromesvendedor", async(req,res)=>{
    const {sucursal,codven,mes,anio}  = req.body;
    
    let qry = '';
    
    qry = `
    SELECT  COUNT(ME_Documentos.DOC_NUMERO) AS PEDIDOS, ISNULL(SUM(ME_Documentos.DOC_TOTALVENTA), 0) AS IMPORTE, ME_USUARIOS.OBJETIVOMES AS OBJETIVO
    FROM  ME_Documentos LEFT OUTER JOIN
                             ME_USUARIOS ON ME_Documentos.CODVEN = ME_USUARIOS.CODUSUARIO AND ME_Documentos.CODSUCURSAL = ME_USUARIOS.CODSUCURSAL
    WHERE (ME_Documentos.CODSUCURSAL = '${sucursal}') AND (ME_Documentos.CODVEN = 1) AND (ME_Documentos.DOC_ESTATUS <> 'A')
    GROUP BY ME_USUARIOS.OBJETIVOMES, ME_USUARIOS.TIPO, ME_Documentos.DOC_ANO, ME_Documentos.DOC_MES
    HAVING  (ME_USUARIOS.TIPO = 'VENDEDOR') AND (ME_Documentos.DOC_ANO = ${anio}) AND (ME_Documentos.DOC_MES = ${mes})
    `

    execute.Query(res,qry);
});


// TOTAL VENTAS Y TOTAL PEDIDOS POR FECHA
router.post("/totalventadia", async(req,res)=>{
    const {sucursal,codven,fecha}  = req.body;
    
    let qry = '';
    qry = `SELECT COUNT(DOC_NUMERO) AS PEDIDOS, ISNULL(SUM(DOC_TOTALVENTA),0) AS IMPORTE
            FROM ME_Documentos
            WHERE (CODSUCURSAL ='${sucursal}') AND (DOC_FECHA = '${fecha}') AND (CODVEN = ${codven}) AND (DOC_ESTATUS<>'A')`
        
    execute.Query(res,qry);
});

// LISTA DE PEDIDOS POR UNA FECHA
router.post("/listapedidos", async(req,res)=>{
    const {sucursal,codven,fecha}  = req.body;
    
    let qry = '';
    qry = `SELECT CODDOC, DOC_NUMERO AS CORRELATIVO, NITCLIE AS CODCLIE, DOC_NOMREF AS NOMCLIE, DOC_DIRENTREGA AS DIRCLIE, '' AS DESMUNI, ISNULL(DOC_TOTALVENTA,0) AS IMPORTE, DOC_FECHA AS FECHA, LAT, LONG, DOC_OBS AS OBS, DOC_MATSOLI AS DIRENTREGA, DOC_ESTATUS AS ST
            FROM ME_Documentos
            WHERE (CODSUCURSAL = '${sucursal}') AND (DOC_FECHA = '${fecha}') AND (CODVEN = ${codven}) AND (DOC_ESTATUS<>'A')`

    
    execute.Query(res,qry);
});

//reporte de productos del dia y vendedor
router.post('/reporteproductosdia', async(req,res)=>{
    
    const {fecha,sucursal,codven} = req.body;

    let qry = `SELECT ISNULL(ME_Docproductos.CODPROD,'SN') AS CODPROD, ISNULL(ME_Productos.DESPROD, 'SN') AS DESPROD, SUM(ISNULL(ME_Docproductos.CANTIDADINV,0)) AS TOTALUNIDADES, SUM(ISNULL(ME_Docproductos.TOTALCOSTO,0)) AS TOTALCOSTO, SUM(ISNULL(ME_Docproductos.TOTALPRECIO,0)) 
    AS TOTALPRECIO
    FROM ME_Docproductos LEFT OUTER JOIN
    ME_Productos ON ME_Docproductos.CODSUCURSAL = ME_Productos.CODSUCURSAL AND ME_Docproductos.CODPROD = ME_Productos.CODPROD RIGHT OUTER JOIN
    ME_Documentos ON ME_Docproductos.DOC_NUMERO = ME_Documentos.DOC_NUMERO AND ME_Docproductos.CODDOC = ME_Documentos.CODDOC AND 
    ME_Docproductos.CODSUCURSAL = ME_Documentos.CODSUCURSAL AND ME_Docproductos.DOC_ANO = ME_Documentos.DOC_ANO AND ME_Docproductos.EMP_NIT = ME_Documentos.EMP_NIT LEFT OUTER JOIN
    ME_Tipodocumentos ON ME_Documentos.CODSUCURSAL = ME_Tipodocumentos.CODSUCURSAL AND ME_Documentos.CODDOC = ME_Tipodocumentos.CODDOC AND ME_Documentos.EMP_NIT = ME_Tipodocumentos.EMP_NIT
    WHERE (ME_Tipodocumentos.TIPODOC = 'PED') AND (ME_Documentos.DOC_FECHA = '${fecha}') AND (ME_Documentos.CODSUCURSAL = '${sucursal}') AND (ME_Documentos.CODVEN = ${codven}) AND (ME_Documentos.DOC_ESTATUS<>'A')
    GROUP BY ME_Docproductos.CODPROD, ME_Productos.DESPROD`;
    
    execute.Query(res,qry);

});

// reporte de marcas por vendedor y dia
router.post('/reportemarcasdia',async(req,res)=>{

    const {fecha,sucursal,codven} = req.body;

    let qry = `SELECT  ISNULL(ME_Marcas.DESMARCA, 'SN') AS DESMARCA, 
    ISNULL(SUM(ME_Docproductos.TOTALCOSTO),0) AS TOTALCOSTO, 
    ISNULL(SUM(ME_Docproductos.TOTALPRECIO),0) AS TOTALPRECIO
    FROM            ME_Productos LEFT OUTER JOIN
                             ME_Marcas ON ME_Productos.CODSUCURSAL = ME_Marcas.CODSUCURSAL AND ME_Productos.CODMARCA = ME_Marcas.CODMARCA RIGHT OUTER JOIN
                             ME_Docproductos ON ME_Productos.CODSUCURSAL = ME_Docproductos.CODSUCURSAL AND ME_Productos.CODPROD = ME_Docproductos.CODPROD RIGHT OUTER JOIN
                             ME_Documentos ON ME_Docproductos.DOC_MES = ME_Documentos.DOC_MES AND ME_Docproductos.DOC_ANO = ME_Documentos.DOC_ANO AND ME_Docproductos.EMP_NIT = ME_Documentos.EMP_NIT AND 
                             ME_Docproductos.CODDOC = ME_Documentos.CODDOC AND ME_Docproductos.DOC_NUMERO = ME_Documentos.DOC_NUMERO LEFT OUTER JOIN
                             ME_Tipodocumentos ON ME_Documentos.CODSUCURSAL = ME_Tipodocumentos.CODSUCURSAL AND ME_Documentos.CODDOC = ME_Tipodocumentos.CODDOC AND ME_Documentos.EMP_NIT = ME_Tipodocumentos.EMP_NIT
                WHERE (ME_Tipodocumentos.TIPODOC = 'PED') AND (ME_Documentos.DOC_ESTATUS <> 'A') AND (ME_Documentos.CODVEN = ${codven}) AND (ME_Documentos.DOC_FECHA = '${fecha}') AND 
                             (ME_Documentos.CODSUCURSAL = '${sucursal}')
                GROUP BY ME_Marcas.DESMARCA`;

    execute.Query(res,qry);

});

// MENSUALES
//reporte de fechas por vendedor y mes
router.post("/reportedinero", async (req,res)=>{

    const {anio,mes,sucursal,codven} = req.body;

    let qry = `SELECT       ME_Documentos.DOC_FECHA AS FECHA, COUNT(ME_Documentos.DOC_FECHA) AS PEDIDOS, SUM(ISNULL(ME_Documentos.DOC_TOTALVENTA,0)) AS TOTALVENTA
    FROM            ME_Documentos LEFT OUTER JOIN
                             ME_Tipodocumentos ON ME_Documentos.CODSUCURSAL = ME_Tipodocumentos.CODSUCURSAL AND ME_Documentos.CODDOC = ME_Tipodocumentos.CODDOC AND ME_Documentos.EMP_NIT = ME_Tipodocumentos.EMP_NIT
                WHERE (ME_Documentos.DOC_ANO = ${anio}) AND (ME_Documentos.DOC_MES = ${mes}) AND (ME_Documentos.CODVEN = ${codven}) AND (ME_Documentos.CODSUCURSAL = '${sucursal}') AND (ME_Tipodocumentos.TIPODOC = 'PED') AND 
                             (ME_Documentos.DOC_ESTATUS <> 'A')
                GROUP BY ME_Documentos.DOC_FECHA`;
    
    execute.Query(res,qry);
                             
});

//reporte de productos por mes y vendedo
router.post('/reporteproductos', async(req,res)=>{
    
    const {anio,mes,sucursal,codven} = req.body;

    let qry = `SELECT ISNULL(ME_Docproductos.CODPROD,'SN') AS CODPROD, ISNULL(ME_Productos.DESPROD,'SN') AS DESPROD, SUM(ISNULL(ME_Docproductos.CANTIDADINV,0)) AS TOTALUNIDADES, SUM(ISNULL(ME_Docproductos.TOTALCOSTO,0)) AS TOTALCOSTO, SUM(ISNULL(ME_Docproductos.TOTALPRECIO,0)) 
    AS TOTALPRECIO
FROM            ME_Docproductos LEFT OUTER JOIN
    ME_Productos ON ME_Docproductos.CODSUCURSAL = ME_Productos.CODSUCURSAL AND ME_Docproductos.CODPROD = ME_Productos.CODPROD RIGHT OUTER JOIN
    ME_Documentos ON ME_Docproductos.DOC_NUMERO = ME_Documentos.DOC_NUMERO AND ME_Docproductos.CODDOC = ME_Documentos.CODDOC AND 
    ME_Docproductos.CODSUCURSAL = ME_Documentos.CODSUCURSAL AND ME_Docproductos.DOC_ANO = ME_Documentos.DOC_ANO AND ME_Docproductos.EMP_NIT = ME_Documentos.EMP_NIT LEFT OUTER JOIN
    ME_Tipodocumentos ON ME_Documentos.CODSUCURSAL = ME_Tipodocumentos.CODSUCURSAL AND ME_Documentos.CODDOC = ME_Tipodocumentos.CODDOC AND ME_Documentos.EMP_NIT = ME_Tipodocumentos.EMP_NIT
            WHERE (ME_Documentos.DOC_ESTATUS<>'A') AND (ME_Tipodocumentos.TIPODOC = 'PED') AND (ME_Documentos.DOC_MES = ${mes}) AND (ME_Documentos.DOC_ANO = ${anio}) AND (ME_Documentos.CODSUCURSAL = '${sucursal}') AND (ME_Documentos.CODVEN = ${codven})
            GROUP BY ME_Docproductos.CODPROD, ME_Productos.DESPROD`;
    
    execute.Query(res,qry);

});


// reporte de marcas por vendedor y mes
router.post('/reportemarcas',async(req,res)=>{

    const {anio,mes,sucursal,codven} = req.body;

    let qry = `SELECT ISNULL(ME_Marcas.DESMARCA,0) AS DESMARCA, 
        ISNULL(SUM(ME_Docproductos.TOTALCOSTO),0) AS TOTALCOSTO, 
        ISNULL(SUM(ME_Docproductos.TOTALPRECIO),0) AS TOTALPRECIO
    FROM            ME_Marcas RIGHT OUTER JOIN
                             ME_Productos ON ME_Marcas.CODSUCURSAL = ME_Productos.CODSUCURSAL AND ME_Marcas.CODMARCA = ME_Productos.CODMARCA RIGHT OUTER JOIN
                             ME_Documentos LEFT OUTER JOIN
                             ME_Docproductos ON ME_Documentos.CODSUCURSAL = ME_Docproductos.CODSUCURSAL AND ME_Documentos.DOC_MES = ME_Docproductos.DOC_MES AND ME_Documentos.DOC_ANO = ME_Docproductos.DOC_ANO AND 
                             ME_Documentos.EMP_NIT = ME_Docproductos.EMP_NIT AND ME_Documentos.CODDOC = ME_Docproductos.CODDOC AND ME_Documentos.DOC_NUMERO = ME_Docproductos.DOC_NUMERO ON 
                             ME_Productos.CODSUCURSAL = ME_Docproductos.CODSUCURSAL AND ME_Productos.CODPROD = ME_Docproductos.CODPROD LEFT OUTER JOIN
                             ME_Tipodocumentos ON ME_Documentos.CODSUCURSAL = ME_Tipodocumentos.CODSUCURSAL AND ME_Documentos.CODDOC = ME_Tipodocumentos.CODDOC AND ME_Documentos.EMP_NIT = ME_Tipodocumentos.EMP_NIT
                WHERE (ME_Tipodocumentos.TIPODOC = 'PED') AND (ME_Documentos.DOC_ESTATUS <> 'A') AND (ME_Documentos.CODVEN = ${codven}) AND (ME_Documentos.DOC_MES = ${mes}) AND (ME_Documentos.DOC_ANO = ${anio}) AND 
                             (ME_Documentos.CODSUCURSAL = '${sucursal}')
                GROUP BY ME_Marcas.DESMARCA`;

                

    execute.Query(res,qry);


});

// reporte de locaciones por vendedor y mes
router.post('/reportelocaciones',async(req,res)=>{

    const {anio,mes,sucursal,codven} = req.body;

    let qry = `
    SELECT ME_Documentos.DOC_FECHA AS FECHA, ME_Documentos.DOC_NOMREF AS CLIENTE, COUNT(ME_Documentos.DOC_FECHA) AS PEDIDOS, SUM(ME_Documentos.DOC_TOTALVENTA) AS TOTALVENTA, ME_Documentos.LAT, ME_Documentos.LONG
    FROM ME_Documentos LEFT OUTER JOIN ME_Tipodocumentos ON ME_Documentos.CODDOC = ME_Tipodocumentos.CODDOC AND ME_Documentos.EMP_NIT = ME_Tipodocumentos.EMP_NIT
    WHERE (ME_Documentos.DOC_ANO = ${anio}) 
            AND (ME_Documentos.DOC_MES = ${mes}) 
            AND (ME_Documentos.CODVEN = ${codven}) 
            AND (ME_Documentos.CODSUCURSAL = '${sucursal}') 
            AND (ME_Tipodocumentos.TIPODOC = 'PED') 
            AND (ME_Documentos.DOC_ESTATUS <> 'A')
    GROUP BY ME_Documentos.DOC_FECHA, ME_Documentos.DOC_NOMREF, ME_Documentos.LAT, ME_Documentos.LONG`;

    execute.Query(res,qry);

});


//******************************* */
// REPORTES DE GERENCIA
//******************************* */

// reporte de sucursales ventas
router.post('/rptsucursalesventas',async(req,res)=>{

    const {anio,mes} = req.body;

    let qry = `SELECT ME_Sucursales.NOMBRE AS SUCURSAL, SUM(ME_Documentos.DOC_TOTALCOSTO) AS COSTO, SUM(ME_Documentos.DOC_TOTALVENTA) AS IMPORTE, Me_Sucursales.COLOR
                    FROM     ME_Documentos LEFT OUTER JOIN
                             ME_Tipodocumentos ON ME_Documentos.CODSUCURSAL = ME_Tipodocumentos.CODSUCURSAL AND ME_Documentos.CODDOC = ME_Tipodocumentos.CODDOC AND 
                             ME_Documentos.EMP_NIT = ME_Tipodocumentos.EMP_NIT LEFT OUTER JOIN
                             ME_Sucursales ON ME_Documentos.CODSUCURSAL = ME_Sucursales.CODSUCURSAL
                    WHERE   (ME_Documentos.DOC_ANO = ${anio}) AND (ME_Documentos.DOC_MES = ${mes}) AND (ME_Documentos.DOC_ESTATUS <> 'A') AND (ME_Tipodocumentos.TIPODOC = 'PED')
                    GROUP BY ME_Sucursales.NOMBRE, ME_Sucursales.COLOR`;

    execute.Query(res,qry);

});

// ranking de vendedores / datos del host
router.post('/rptrankingvendedores', async(req,res)=>{
    const {anio,mes} = req.body;
    let qry = `SELECT ME_Vendedores.NOMVEN, ME_Sucursales.NOMBRE AS SUCURSAL, SUM(ME_Documentos.DOC_TOTALCOSTO) AS TOTALCOSTO, SUM(ME_Documentos.DOC_TOTALVENTA) AS TOTALPRECIO
                FROM ME_Documentos LEFT OUTER JOIN
                ME_Vendedores ON ME_Documentos.CODVEN = ME_Vendedores.CODVEN AND ME_Documentos.CODSUCURSAL = ME_Vendedores.CODSUCURSAL LEFT OUTER JOIN
                ME_Sucursales ON ME_Vendedores.CODSUCURSAL = ME_Sucursales.CODSUCURSAL
                WHERE (ME_Documentos.DOC_ESTATUS <> 'A') AND (ME_Documentos.DOC_ANO = ${anio}) AND (ME_Documentos.DOC_MES = ${mes})
                GROUP BY ME_Vendedores.NOMVEN, ME_Sucursales.NOMBRE
                ORDER BY TOTALPRECIO DESC`;
    
    execute.Query(res,qry);
});


// reporte de sucursales ventas - DATOS DE LA SUCURSAL
router.post('/rptsucursalesventassucursales',async(req,res)=>{

    const {anio,mes} = req.body;

    let qry = `SELECT ME_Sucursales.COLOR, ME_RPT_VENTAS.CODSUCURSAL AS SUCURSAL, ME_Sucursales.NOMBRE AS NOMSUCURSAL, SUM(ME_RPT_VENTAS.TOTALPRECIO) AS IMPORTE
    FROM            ME_RPT_VENTAS LEFT OUTER JOIN
                             ME_Sucursales ON ME_RPT_VENTAS.CODSUCURSAL = ME_Sucursales.CODSUCURSAL
    WHERE        (ME_RPT_VENTAS.ANIO =${anio}) AND (ME_RPT_VENTAS.MES = ${mes})
    GROUP BY ME_Sucursales.COLOR, ME_RPT_VENTAS.CODSUCURSAL, ME_Sucursales.NOMBRE`;

    execute.Query(res,qry);

});
// ranking de vendedores / datos de la sucursal
router.post('/rptrankingvendedoressucursal', async(req,res)=>{
    const {anio,mes} = req.body;
    let qry = `SELECT        NOMVEN, SUM(TOTALPRECIO) AS TOTALPRECIO, CODSUCURSAL AS SUCURSAL
    FROM            ME_RPT_VENTAS
    WHERE        (ANIO = ${anio}) AND (MES = ${mes})
    GROUP BY NOMVEN, CODSUCURSAL
    ORDER BY TOTALPRECIO DESC`;
    
    execute.Query(res,qry);
});




//******************************* */
// REPORTES DE SUPERVISOR
//******************************* */


// ranking de vendedores por sucursal y fecha
router.post('/rptrankingvendedoressucursal2', async(req,res)=>{
    const {fecha,sucursal} = req.body;
    let qry = `SELECT       ME_Vendedores.NOMVEN, COUNT(ME_Documentos.CODDOC) AS PEDIDOS, SUM(ME_Documentos.DOC_TOTALVENTA) AS TOTALPRECIO
    FROM            ME_Documentos LEFT OUTER JOIN
                             ME_Vendedores ON ME_Documentos.CODVEN = ME_Vendedores.CODVEN AND ME_Documentos.CODSUCURSAL = ME_Vendedores.CODSUCURSAL
                WHERE (ME_Documentos.DOC_ESTATUS <> 'A') AND (ME_Documentos.CODSUCURSAL = '${sucursal}') AND (ME_Documentos.DOC_FECHA = '${fecha}')
                GROUP BY ME_Vendedores.NOMVEN
                ORDER BY TOTALPRECIO DESC`;
    
    execute.Query(res,qry);
});

// ranking de vendedores por sucursal y fecha
router.post('/rptrankingvendedoressucursalmes', async(req,res)=>{
    const {anio,mes,sucursal} = req.body;
    let qry = `SELECT       ME_Vendedores.NOMVEN, COUNT(ME_Documentos.CODDOC) AS PEDIDOS, SUM(ME_Documentos.DOC_TOTALVENTA) AS TOTALPRECIO
    FROM            ME_Documentos LEFT OUTER JOIN
                             ME_Vendedores ON ME_Documentos.CODVEN = ME_Vendedores.CODVEN AND ME_Documentos.CODSUCURSAL = ME_Vendedores.CODSUCURSAL
                WHERE (ME_Documentos.DOC_ESTATUS <> 'A') AND (ME_Documentos.CODSUCURSAL = '${sucursal}') AND (ME_Documentos.DOC_ANO = ${anio}) AND (ME_Documentos.DOC_MES = ${mes})
                GROUP BY ME_Vendedores.NOMVEN
                ORDER BY TOTALPRECIO DESC`;
    
    execute.Query(res,qry);
});

// reporte de marcas por fecha
router.post('/reportemarcasfecha',async(req,res)=>{

    const {sucursal,fecha} = req.body;

    let qry = `SELECT       ME_Marcas.DESMARCA, SUM(ME_Docproductos.TOTALCOSTO) AS TOTALCOSTO, SUM(ME_Docproductos.TOTALPRECIO) AS TOTALPRECIO
    FROM            ME_Documentos LEFT OUTER JOIN
                             ME_Docproductos LEFT OUTER JOIN
                             ME_Productos LEFT OUTER JOIN
                             ME_Marcas ON ME_Productos.CODSUCURSAL = ME_Marcas.CODSUCURSAL AND ME_Productos.CODMARCA = ME_Marcas.CODMARCA ON ME_Docproductos.CODSUCURSAL = ME_Productos.CODSUCURSAL AND 
                             ME_Docproductos.CODPROD = ME_Productos.CODPROD ON ME_Documentos.CODSUCURSAL = ME_Docproductos.CODSUCURSAL AND ME_Documentos.DOC_MES = ME_Docproductos.DOC_MES AND 
                             ME_Documentos.DOC_ANO = ME_Docproductos.DOC_ANO AND ME_Documentos.EMP_NIT = ME_Docproductos.EMP_NIT AND ME_Documentos.CODDOC = ME_Docproductos.CODDOC AND 
                             ME_Documentos.DOC_NUMERO = ME_Docproductos.DOC_NUMERO LEFT OUTER JOIN
                             ME_Tipodocumentos ON ME_Documentos.CODSUCURSAL = ME_Tipodocumentos.CODSUCURSAL AND ME_Documentos.CODDOC = ME_Tipodocumentos.CODDOC AND ME_Documentos.EMP_NIT = ME_Tipodocumentos.EMP_NIT
                WHERE (ME_Tipodocumentos.TIPODOC = 'PED') AND (ME_Documentos.DOC_ESTATUS <> 'A') AND (ME_Documentos.CODSUCURSAL = '${sucursal}') AND (ME_Documentos.DOC_FECHA = '${fecha}')
                GROUP BY ME_Marcas.DESMARCA`;

                

    execute.Query(res,qry);


});

// reporte de marcas por mes
router.post('/reportemarcasmes',async(req,res)=>{

    const {anio,mes,sucursal} = req.body;

    let qry = `SELECT ISNULL(ME_Marcas.DESMARCA,'SN') AS DESMARCA, SUM(ISNULL(ME_Docproductos.TOTALCOSTO,0)) AS TOTALCOSTO, SUM(ISNULL(ME_Docproductos.TOTALPRECIO,0)) AS TOTALPRECIO
    FROM            ME_Documentos LEFT OUTER JOIN
                             ME_Docproductos LEFT OUTER JOIN
                             ME_Productos LEFT OUTER JOIN
                             ME_Marcas ON ME_Productos.CODSUCURSAL = ME_Marcas.CODSUCURSAL AND ME_Productos.CODMARCA = ME_Marcas.CODMARCA ON ME_Docproductos.CODSUCURSAL = ME_Productos.CODSUCURSAL AND 
                             ME_Docproductos.CODPROD = ME_Productos.CODPROD ON ME_Documentos.CODSUCURSAL = ME_Docproductos.CODSUCURSAL AND ME_Documentos.DOC_MES = ME_Docproductos.DOC_MES AND 
                             ME_Documentos.DOC_ANO = ME_Docproductos.DOC_ANO AND ME_Documentos.EMP_NIT = ME_Docproductos.EMP_NIT AND ME_Documentos.CODDOC = ME_Docproductos.CODDOC AND 
                             ME_Documentos.DOC_NUMERO = ME_Docproductos.DOC_NUMERO LEFT OUTER JOIN
                             ME_Tipodocumentos ON ME_Documentos.CODSUCURSAL = ME_Tipodocumentos.CODSUCURSAL AND ME_Documentos.CODDOC = ME_Tipodocumentos.CODDOC AND ME_Documentos.EMP_NIT = ME_Tipodocumentos.EMP_NIT
                WHERE (ME_Tipodocumentos.TIPODOC = 'PED') AND (ME_Documentos.DOC_ESTATUS <> 'A') AND (ME_Documentos.DOC_MES = ${mes}) AND (ME_Documentos.DOC_ANO = ${anio}) AND 
                             (ME_Documentos.CODSUCURSAL = '${sucursal}')
                GROUP BY ME_Marcas.DESMARCA`;

                

    execute.Query(res,qry);


});


// INSERTA UN PEDIDO EN LAS TABLAS DE DOCUMENTOS Y DOCPRODUCTOS
router.post("/insertventa", async (req,res)=>{
    
    const {jsondocproductos,codsucursal,empnit,anio,mes,dia,coddoc,correl,fecha,fechaentrega,formaentrega,codcliente,nomclie,codbodega,totalcosto,totalprecio,nitclie,dirclie,obs,direntrega,usuario,codven,lat,long} = req.body;
  
    
    let app = codsucursal;
  
    let tblDocproductos = JSON.parse(jsondocproductos);
   
    let qry = ''; // inserta los datos en la tabla documentos
    let qrydoc = ''; // inserta los datos de la tabla docproductos
    let qrycorrelativo = ''; //actualiza el correlativo del documento

    let correlativo = correl;
      //carga los espacios en blanco en el correlativo actual
      correlativo = getCorrelativo(correlativo);

    tblDocproductos.map((p)=>{
        qrydoc = qrydoc + `INSERT INTO ME_DOCPRODUCTOS 
        (EMP_NIT,DOC_ANO,DOC_MES,CODDOC,DOC_NUMERO,
        DOC_ITEM,CODPROD,CODMEDIDA,CANTIDAD,EQUIVALE,
        CANTIDADINV,COSTO,PRECIO,TOTALCOSTO,TOTALPRECIO,
        BODEGAENTRADA,BODEGASALIDA,SUBTOTAL,DESCUENTOPROD,PORDESCUPROD,
        DESCUENTOFAC,PORDESCUFAC,TOTALDESCUENTO,DESCRIPCION,SUBTOTALPROD,
        TIPOCAMBIO,PRODPRECIO,CANTIDADENVIADA,CODFAC,NUMFAC,
        ITEMFAC,NOAFECTAINV, DOCPESO,COSTOINV,FLETE,TOTALPRECIOFIN,PRECIOFIN,TOTALCOSTOINV,CANTIDADBONI,CODOPR,NUMOPR,
        ITEMOPR,CODINV,NUMINV,ITEMINV,TIPOCLIE,LISTA,PORIVA,VALORIVA,NOLOTE,VALORIMPU1,DESEMPAQUE,
        SALDOINVANTCOM,NCUENTAMESA,CUENTACERRADA,COSTODOL,COSTOINVDOL,TOTALCOSTODOL,TOTALCOSTOINVDOL,
        IMPCOMBUSTIBLE,CODVENPROD,COMIVEN,SOBREPRECIO,CODREG,NUMREG,ITEMREG,CANTIDADORIGINAL,CANTIDADMODIFICADA,NSERIETARJETA,
        CODOC,NUMOC,PORTIMBREPRENSA,VALORTIMBREPRENSA,CODTIPODESCU,TOTALPUNTOS,ITEMOC,CODPRODORIGEN,CODMEDIDAORIGEN,
        CANTIDADDEVUELTA,CODARANCEL,TIPOPRECIO,CODSUCURSAL) 
        VALUES ('${p.EMPNIT}',${anio},${mes},'${coddoc}','${correlativo}',
        ${p.ID},'${p.CODPROD}','${p.CODMEDIDA}',${p.CANTIDAD},${p.EQUIVALE},
        ${p.TOTALUNIDADES},${p.COSTO},${p.PRECIO},${p.TOTALCOSTO},${p.TOTALPRECIO},
        '','${codbodega}',${p.TOTALPRECIO},0,0,
        0,0,0,'${p.DESPROD}',${p.TOTALPRECIO},
        1,${p.PRECIO},0,'','',
        0,0,0,${p.COSTO},0,${p.TOTALPRECIO},
        ${p.PRECIO},${p.TOTALCOSTO},0,'','',0,'','',0,'P','',
         0,0,'SN',0,'',0,'',0,0,${p.COSTO},0,${p.TOTALCOSTO},0,0,0,0,'','',0,0,0,'','','',0,0,'',0,0,'','',0,'','${p.TIPOPRECIO}','${codsucursal}' 
        );`
    });


    //obtiene el número del correlativo actual para actualizar luego
    let ncorrelativo = correl;

  

    //variables sin asignar
    let concre = 'CRE';
    let abono = totalprecio; 
    let saldo = totalprecio;
    let pagotarjeta = 0; let recargotarjeta = 0;
    let codrep = 0;
    let totalexento=0;

  
    let nuevocorrelativo = Number(ncorrelativo) + 1;


            qry = `INSERT INTO ME_DOCUMENTOS (
                EMP_NIT, DOC_ANO, DOC_MES, CODDOC, DOC_NUMERO, 
                CODCAJA, DOC_FECHA, DOC_NUMREF, DOC_NOMREF, BODEGAENTRADA,
                BODEGASALIDA, USUARIO, DOC_ESTATUS, DOC_TOTALCOSTO, DOC_TOTALVENTA,
                DOC_HORA, DOC_FVENCE, DOC_DIASCREDITO, DOC_CONTADOCREDITO, DOC_DESCUENTOTOTAL,
                DOC_DESCUENTOPROD, DOC_PORDESCUTOTAL, DOC_IVA, DOC_SUBTOTALIVA, DOC_SUBTOTAL,
                NITCLIE, DOC_PORDESCUFAC, CODVEN, DOC_ABONOS, DOC_SALDO,
                DOC_VUELTO, DOC_NIT, DOC_PAGO, DOC_CODREF, DOC_TIPOCAMBIO,
                DOC_PARCIAL, DOC_ANTICIPO, ANT_CODDOC, ANT_DOCNUMERO, DOC_OBS,
                DOC_PORCENTAJEIVA, DOC_ENVIO, DOC_CUOTAS, DOC_TIPOCUOTA, 
                DIVA_NUMINT, FRT_CODIGO, TRANSPORTE, DOC_REFPEDIDO, DOC_REFFACTURA,
                CODPROV, DOC_TOTALOTROS, DOC_RECIBO, DOC_MATSOLI, DOC_REFERENCIA, 
                DOC_LUGAR, DOC_ANOMBREDE, DOC_IVAEXO, DOC_VALOREXO, DOC_SECTOR,
                DOC_DIRENTREGA, DOC_CANTENV, DOC_EXP, DOC_FECHAENT, TIPOPRODUCCION,
                DOC_TOTCOSINV, DOC_TOTALFIN, USUARIOENUSO, DOC_IMPUESTO1, DOC_TOTALIMPU1,
                DOC_PORCOMI, DOC_DOLARES, CODMESA, DOC_TIPOOPE, USUARIOAUTORIZA, 
                NUMAUTORIZA, DOC_TEMPORADA, DOC_INGUAT,
                CODVENBOD,
                CODHABI, DOC_SERIE,
                CTABAN, NUMINTBAN, 
                CODVENEMP,
                DOC_TOTCOSDOL, DOC_TOTCOSINVDOL, CODUNIDAD,
                TOTCOMBUSTIBLE, DOC_CODCONTRA, DOC_NUMCONTRA, INTERES, ABONOINTERES,
                SALDOINTERES, NUMEROCORTE, DOC_PORLOCAL, DOC_NUMORDEN, DOC_FENTREGA,
                DOC_INTERESADO, DOC_RECIBE, NUMEROROLLO, COD_CENTRO, GENCUOTA,
                DOC_PORINGUAT, DOC_INGUATEXENTO, DOC_TIPOTRANIVA, DOC_PORTIMBREPRE, DOC_TIMBREPRENSA,
                ABONOSANTICIPO, SALDOANTICIPO, DOC_PRODEXENTO, PUNTOSGANADOS, PUNTOSUSADOS,
                APL_ANTICIPO, COD_DEPARTA, FIRMAELECTRONICA, DOC_CODDOCRETENCION, DOC_SERIERETENCION,
                DOC_NUMRETENCION, FIRMAISC, ISCENVIADO, LAT, LONG, CODSUCURSAL
                ) 
                VALUES (
                '${empnit}', ${anio}, ${mes}, '${coddoc}', '${correlativo}',
                '', '${fecha}', '', '${nomclie}', '',
                '${codbodega}', '${usuario}', 'O', ${totalcosto}, ${totalprecio},
                0, '${fecha}', 0, '${concre}', 0,
                0, 0, 0, ${totalprecio}, ${totalprecio},
                '${nitclie}', 0, '${codven}', 0, ${saldo}, 
                0, '${nitclie}', 0, '', 1, 
                0, 0, '', '', '${obs}',
                0, 0, 0, 0, 
                0, '', '${formaentrega}', '', '',
                '', 0, 0, '${direntrega}', '', 
                '', '', '', 0, '', 
                '${dirclie}', '', '', '${fechaentrega}', '',
                ${totalcosto}, 0, '', 0, 0,
                0, 0, '', 0,'',
                0, 0, 0,
                0,
                '', '', 
                0, 0, 
                0,
                0, 0, '',
                0, '', '', 0, 0, 
                0, 0, 0, '','NO',
                '', '', 0, '', '',
                0, 'N', 'C', 0, 0,
                0, 0, 0, 0, 0,
                '', '', '', '', '',
                '', '', 0, ${lat},${long},'${app}'
                );`
                   
                qrycorrelativo =`   UPDATE ME_TIPODOCUMENTOS 
                                        SET CORRELATIVO=${nuevocorrelativo} 
                                        WHERE CODSUCURSAL='${codsucursal}' AND CODDOC='${coddoc}';
                                    UPDATE ME_USUARIOS 
                                        SET CORRELATIVO=${nuevocorrelativo} 
                                        WHERE CODSUCURSAL='${codsucursal}' AND CODDOC='${coddoc}';`
      
    execute.Query(res, qrycorrelativo + qry + qrydoc);
    
});

router.post("/updatecorrelativo", async (req,res)=>{

    const {codsucursal,coddoc,correlativo} = req.body;

    let nuevocorrelativo = Number(correlativo) + 1;

    let qrycorrelativo =`UPDATE ME_TIPODOCUMENTOS 
                            SET CORRELATIVO=${nuevocorrelativo} 
                            WHERE CODSUCURSAL='${codsucursal}' AND CODDOC='${coddoc}';
                        UPDATE ME_USUARIOS 
                            SET CORRELATIVO=${nuevocorrelativo} 
                            WHERE CODSUCURSAL='${codsucursal}' AND CODDOC='${coddoc}';`
    execute.Query(res,qrycorrelativo);

});

function getCorrelativo(correlativo){
    let numdoc = '';

    switch (correlativo.toString().length) {
        case 1:
            numdoc = '         ' + correlativo;
        break;
        case 2:
            numdoc = '        ' + correlativo;
        break;
        case 3:
            numdoc = '       ' + correlativo;
        break;
        case 4:
            numdoc = '      ' + correlativo;
            break;
        case 5:
            numdoc = '     ' + correlativo;
            break;
        case 6:
            numdoc = '    ' + correlativo;
            break;
        case 7:
            numdoc = '   ' + correlativo;
            break;
        case 8:
            numdoc = '  ' + correlativo;
        break;
        case 9:
            numdoc = ' ' + correlativo;
        break;
        case 10:
            numdoc = correlativo;
        break;
        default:
            break;
    };

    return numdoc;

};



module.exports = router;