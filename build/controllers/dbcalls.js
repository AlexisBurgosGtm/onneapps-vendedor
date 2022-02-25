document.getElementById('btnDownloadProductos').addEventListener('click',()=>{
    funciones.Confirmacion('¿Está seguro que desea Descargar el catálogo de Productos?')
    .then((value)=>{
        if(value==true){

            setLog(`<label>Intentando conectarse y descargar los productos y precios</label>`,'rootWait')
            $('#modalWait').modal('show');
            
            downloadProductos()
            .then((data)=>{
                setLog(`<label>Productos descargados, guardándolos localmente</label>`,'rootWait')
                deleteProductos()
                .then(()=>{
                    let contador = 1;
                    let totalrows = Number(data.rowsAffected[0]);
                      
                    data.recordset.map(async(rows)=>{
                        var datosdb = {
                            CODSUCURSAL:rows.CODSUCURSAL,
                            CODPROD:rows.CODPROD,
                            DESPROD:rows.DESPROD,
                            CODMEDIDA:rows.CODMEDIDA,
                            EQUIVALE:rows.EQUIVALE,
                            COSTO:rows.COSTO,
                            PRECIO:rows.PRECIO,
                            PRECIOA:rows.PRECIOA,
                            PRECIOB:rows.PRECIOB,
                            PRECIOC:rows.PRECIOC,
                            DESMARCA:rows.DESMARCA,
                            EXENTO:rows.EXENTO,
                            EXISTENCIA:rows.EXISTENCIA,
                            DESPROD3:rows.DESPROD3
                        }                
                        var noOfRowsInserted = await connection.insert({
                            into: "productos",
                            values: [datosdb], //you can insert multiple values at a time
                        });
                        if (noOfRowsInserted > 0) {
                            let porc = (Number(contador) / Number(totalrows)) * 100;
                            setLog(`<label>Productos agregados: ${contador} de ${totalrows} (${porc.toFixed(2)}%)</label>`,'rootWait')
                            contador += 1;
                            if(totalrows==contador){
                                $('#modalWait').modal('hide');
                                funciones.Aviso('Productos descargados exitosamente!!')
                            }
                        }
                    });
                })
                .catch(()=>{
                    //$('#modalWait').modal('hide');
                    hideWaitForm();
                   funciones.AvisoError('No se pudieron eliminar los productos previos')       
                })
            })
            .catch(()=>{
                console.log('no se descargó naa.')
                hideWaitForm();
                //$('#modalWait').modal('hide');
                funciones.AvisoError('No se pudieron descargar los productos')
            })

            
            
        }
    })
});

document.getElementById('btnDownloadClientes').addEventListener('click',()=>{
    funciones.Confirmacion('¿Está seguro que desea Descargar el catálogo de Clientes?')
    .then((value)=>{
        if(value==true){

            setLog(`<label>Intentando descargar su lista de clientes</label>`,'rootWait')
            $('#modalWait').modal('show');

            downloadClientes()
            .then((data)=>{
                setLog(`<label>Clientes descargados, ahora se guardarán localmente</label>`,'rootWait')
                deleteClientes()
                .then(()=>{
                    let totalrows = Number(data.rowsAffected[0]);
                    let contador = 1;

                    data.recordset.map(async(rows)=>{
                        var datosdb = {
                            CODSUCURSAL:rows.CODSUCURSAL,
                            CODIGO:rows.CODIGO,
                            DESMUNI:rows.DESMUNI,
                            DIRCLIE:rows.DIRCLIE,
                            LASTSALE:rows.LASTSALE,
                            LAT:rows.LAT,
                            LONG:rows.LONG,
                            NIT:rows.NIT,
                            NOMCLIE:rows.NOMCLIE,
                            REFERENCIA:rows.REFERENCIA,
                            STVISITA:rows.STVISITA,
                            VISITA:rows.VISITA,
                            TELEFONO:rows.TELEFONO
                        }                
                        var noOfRowsInserted = await connection.insert({
                            into: "clientes",
                            values: [datosdb], //you can insert multiple values at a time
                        });
                        if (noOfRowsInserted > 0) {
                            let porc = (Number(contador)/Number(totalrows))*100;
                            setLog(`<label>Clientes agregados: ${contador} de ${totalrows} (${porc.toFixed(2)} %)</label>`,'rootWait')
                            contador += 1;
                            if(totalrows==contador){
                                hideWaitForm();
                                //$('#modalWait').modal('hide');
                                funciones.Aviso('Clientes descargados exitosamente!!')
                            }
                        }
                    });
                })
                .catch(()=>{
                    hideWaitForm();
                    //$('#modalWait').modal('hide');
                    funciones.AvisoError('No se pudieron eliminar los Clientes previos')
                })
            })
            .catch(()=>{
                hideWaitForm();
                //$('#modalWait').modal('hide');
                funciones.AvisoError('No se pudieron descargar los clientes')
            })
                  
            
        }
    })
});


//CREDENCIALES
function deleteDateDownload(){
    return new Promise(async(resolve,reject)=>{
        var rowsDeleted = await connection.remove({
            from: "credenciales"
        });
        if(rowsDeleted>0){
            resolve();
        }else{
            resolve();
        }
    })            
};

function updateDateDownload() {
    let f = new Date();
    return new Promise((resolve,reject)=>{
        connection.insert({
            into: "credenciales",
            values: [{  DAYUPDATED:Number(f.getDate()),
                        USUARIO:GlobalUsuario,
                        CODSUCURSAL:GlobalCodSucursal
                    }] 
        })
        .then(()=>{
            GlobalSelectedDiaUpdated=Number(f.getDate());
            resolve();
        })
        .catch(()=>{
            GlobalSelectedDiaUpdated=0;
            reject();
        })
    }) 
};

function selectDateDownload() {

    return new Promise(async(resolve,reject)=>{
        var response = await connection.select({
            from: "credenciales",
            limit: 1,
           
        });
        response.map((r)=>{
            GlobalSelectedDiaUpdated = Number(r.DAYUPDATED)
        })
        resolve(GlobalSelectedDiaUpdated)
    });
};


function downloadProductos (){

    return new Promise((resolve,reject)=>{

        axios.post('/ventas/buscarproductotodos', {sucursal:GlobalCodSucursal})  
        .then(async(response) => {
            console.log(response);
            const data = response.data;
            if(data.rowsAffected[0]==0){
                reject();
            }else{
                deleteDateDownload().then(()=>{updateDateDownload()})  
                resolve(data);                         
            }
        }, (error) => {
           reject();
        });

        
    })
  
 
   
};

function deleteProductos(){
    return new Promise((resolve,reject)=>{
        setLog(`<label class="text-danger">Eliminando productos...</label>`,'rootWait');
        let del = connection.clear('productos');
        if(del){
            resolve();
        }else{
            reject();
        }
    })            
};

function selectProducto(filtro) {

    return new Promise(async(resolve,reject)=>{
        let f = new Date();
        if(GlobalSelectedDiaUpdated.toString()==f.getDate().toString()){
            var response = await connection.select({
                from: "productos",
                limit: 50,
                where: {
                    CODPROD: filtro,
                    or: {
                        DESPROD: {
                            like: '%' + filtro + '%'
                        }   
                    }
                }
               
            });
            resolve(response)
        }else{
            reject('Debe actualizar su catálogo de productos...');
        }
        
    });
};

function downloadClientes (){
    return new Promise((resolve,reject)=>{

        axios.post('/clientes/listavendedortodos', {
            sucursal: GlobalCodSucursal,
            codven:GlobalCodUsuario
        })  
        .then(async(response) => {
            const data = response.data;
            if(data.rowsAffected[0]==0){
                reject();
            }else{  
                resolve(data);
            }
        }, (error) => {
           reject();
        });

    })   
 
   
};

function deleteClientes(){
    return new Promise((resolve,reject)=>{
        setLog(`<label class="text-danger">Eliminando Clientes...</label>`,'rootWait');
        let del = connection.clear('clientes');
        if(del){
            resolve();
        }else{
            reject();
        }
    })            
};

function selectCliente(dia) {

    return new Promise(async(resolve,reject)=>{
        var response = await connection.select({
            from: "clientes",
            limit: 200,
            where: {
                VISITA: dia
                }
           
        });
        resolve(response)
    });
};

async function updateSaleCliente(codigo) {

    var noOfRowsUpdated = await connection.update({ 
            in: "clientes",
          set: {
              LASTSALE:funciones.getFecha()
          },
          where: {
              CODIGO:codigo.toString()
          }
    });
    console.log('Cliente actualizado, rows: ' + noOfRowsUpdated.toString())

};

function insertTempVentas(datos){
    return new Promise((resolve,reject)=>{
        connection.insert({
            into: "tempventa",
            values: [datos], //you can insert multiple values at a time
        })
        .then(()=>{
            resolve();
        })
        .catch(()=>{
            reject();
        })
    }) 

};

function deleteItemVenta(id){
    return new Promise(async(resolve,reject)=>{
        var rowsDeleted = await connection.remove({
            from: "tempventa",
            where: {
                ID: id
            }
        });
        if(rowsDeleted>0){resolve()}else{reject()}
    })            
};

function selectTempventas(usuario) {

    return new Promise(async(resolve,reject)=>{
        var response = await connection.select({
            from: "tempventa",
            where: {
                    USUARIO: usuario
                },
            order: { by: 'ID', type: 'asc' }
        });
        resolve(response)
    });
};

function selectDataRowVenta(id,nuevacantidad) {
    let costo = 0; let precio = 0; let equivale =0; let exento=0; let cantidad= nuevacantidad;
    return new Promise(async(resolve,reject)=>{
        var response = await connection.select({
            from: "tempventa",
            where: {
                    ID: id
                }
        });
        response.map((rows)=>{
            costo = rows.COSTO;
            precio = rows.PRECIO;
            equivale = rows.EQUIVALE;
            exento = rows.EXENTO;
        });
        let totalcosto = Number(costo) * Number(cantidad);
        let totalprecio = Number(precio) * Number(cantidad);
        let totalexento = Number(exento) * Number(cantidad);
        let totalunidades = Number(equivale) * Number(cantidad);
        //actualiza la fila
        let updatedrow = await connection.update({
            in: "tempventa",
            set: {
                CANTIDAD:Number(nuevacantidad),
                TOTALUNIDADES:totalunidades,
                TOTALCOSTO:totalcosto,
                TOTALPRECIO:totalprecio,
                EXENTO:totalexento
            },
            where: {
                ID: id
            }
        })
        if(updatedrow>0){
            resolve();
        }else{
            reject();
        }

    });
};


function gettempDocproductos(usuario){
    
    return new Promise(async(resolve,reject)=>{
        var response = await connection.select({
            from: "tempventa",
            where: {
                    USUARIO: usuario
                },
            order: { by: 'ID', type: 'asc' }
        })
        if(Number(response.length)>0){
            resolve(response);
        }else{
            reject('No hay productos agregados');
        }
    })
    


    

}

function deleteTempVenta(usuario){
    return new Promise(async(resolve,reject)=>{
        var rowsDeleted = await connection.remove({
            from: "tempventa",
            where: {
                USUARIO: usuario
            }
        });
        if(rowsDeleted>0){resolve()}else{resolve()}
    })            
};


//PEDIDOS GUARDADOS EN EL CEL

//INSERTA LOCALMENTE UN PEDIDO
function insertVenta(datos){
    console.log('intentando ingresar en tabla documentos')
    return new Promise((resolve,reject)=>{
        connection.insert({
            into: "documentos",
            values: [datos], //you can insert multiple values at a time
        })
        .then(()=>{
            resolve();
        })
        .catch(()=>{
            reject();
        })
    }) 

};

//carga el json con la lista de pedidos pendientes
function selectVentasPendientes(usuario) {
    
    return new Promise(async(resolve,reject)=>{
        var response = await connection.select({

            from: "documentos",
            where: {
                    USUARIO: usuario
                },
            order: { by: 'ID', type: 'asc' }
        });
        resolve(response)
    });
};

//carga la lista de pedidos
function dbCargarPedidosPendientes(){
    
    selectVentasPendientes(GlobalUsuario)
    .then((response)=>{
        let container = document.getElementById('tblPedidosPendientes');
        container.innerHTML = GlobalLoader;
        
        let str = '';
        let contador = 0;

        response.map((rs)=>{
            contador = contador + 1;
            str = str + `<tr class="border-bottom">
                            <td>${rs.FECHA}
                                <br>
                                <small class="negrita">${rs.CODDOC}-${rs.ID}</small>
                            </td>
                            <td>${rs.NOMCLIE}
                                <br>
                                <small>${rs.DIRCLIE}</small>
                            </td>
                            <td>${funciones.setMoneda(rs.TOTALPRECIO,'Q')}
                            </td>
                            <td>
                                <button class="btn btn-success btn-circle" onclick="dbSendPedido(${rs.ID});">
                                    <i class="fal fa-paper-plane"></i>
                                </button>
                            </td>
                        </tr>`    
        })
        container.innerHTML = str;
        if(Number(contador)>0){
            btnPedidosPend.className = 'btn btn-danger btn-lg btn-icon rounded-circle shadow';
        }else{
            btnPedidosPend.className = 'btn btn-outline-secondary btn-lg btn-icon rounded-circle shadow';
        }
        
        btnPedidosPend.innerHTML = `<i class="fal fa-bell"></i>${contador}`;
        

    });
};

function deletePedidoEnviado(id){
    return new Promise(async(resolve,reject)=>{
        var rowsDeleted = await connection.remove({
            from: "documentos",
            where: {
                ID: Number(id)
            }
        });
        if(rowsDeleted>0){resolve()}else{resolve()}
    })            
};

function getPedidoEnviar(id){

    return new Promise(async(resolve,reject)=>{
        var response = await connection.select({
            
            from: "documentos",
            where: {
                    ID: Number(id)
                }
        });
        resolve(response)
    });
}

function dbSendPedido(id){
   
        funciones.Confirmacion('¿Está seguro que desea Enviar este Pedido')
        .then((value)=>{
            if(value==true){
                
                setLog(`<label class="text-danger">Intentando obtener el correlativo de documentos...</label>`,'rootWait');
                $('#modalWait').modal('show');

                classTipoDocumentos.getCorrelativoDocumento('PED',GlobalCoddoc)
                .then((correlativo)=>{
                    //lee el documento de la base de datos local y lo intenta enviar
                    setLog(`<label class="text-danger">Cargando los datos del documento para intentarlo enviar...</label>`,'rootWait');
                        
                    let data; 
                    let nit;
                    getPedidoEnviar(id)
                    .then((response)=>{
                        response.map((rs)=>{
                            nit = rs.NITCLIE;
                            GlobalSelectedCodCliente = rs.CODCLIE;
                            data = {
                                jsondocproductos:rs.JSONPRODUCTOS,
                                codsucursal:rs.CODSUCURSAL,
                                empnit: rs.EMPNIT,
                                coddoc:rs.CODDOC,
                                correl: correlativo.toString(),
                                anio:rs.ANIO,
                                mes:rs.MES,
                                dia:rs.DIA,
                                fecha:rs.FECHA,
                                fechaentrega:rs.FECHAENTREGA,
                                formaentrega:rs.FORMAENTREGA,
                                codbodega:GlobalCodBodega,
                                codcliente: rs.CODCLIE,
                                nomclie:rs.NOMCLIE,
                                totalcosto:rs.TOTALCOSTO,
                                totalprecio:rs.TOTALPRECIO,
                                nitclie:rs.NITCLIE,
                                dirclie:rs.DIRCLIE,
                                obs:rs.OBS,
                                direntrega:rs.DIRENTREGA,
                                usuario:rs.USUARIO,
                                codven:rs.CODVEN,
                                lat:rs.LAT,
                                long:rs.LONG
                            }
                        })
                        
                        setLog(`<label class="text-info">Intentando enviar el pedido...</label>`,'rootWait');
                
                        axios.post('/ventas/insertventa', data)
                        .then(async(response) => {
                            const data = response.data;
                            if (data.rowsAffected[0]==0){
                                hideWaitForm();
                                funciones.AvisoError('No se logró Enviar este pedido, se intentará guardarlo en el teléfono');   
                            }else{
                                hideWaitForm();
                                funciones.Aviso('Pedido Enviado Exitosamente !!!')
                            
                                //actualiza la ubicación del empleado
                                await classEmpleados.updateMyLocation();
                                //actualiza la última venta del cliente
                                await apigen.updateClientesLastSale(nit,'VENTA');
                                deletePedidoEnviado(id)
                                .then(()=>{
                                    dbCargarPedidosPendientes();
                                })
                                                                                
                            }
                            //$('#modalWait').modal('hide');
                        }, (error) => {
                            //$('#modalWait').modal('hide'); 
                            hideWaitForm();
                            funciones.AvisoError('Ha ocurrido un error y no se pudo enviar');
                           
                        })
                        .catch((error)=>{
                            //$('#modalWait').modal('hide');
                            hideWaitForm();
                            funciones.AvisoError('Error: ' + error);
                           
                        })
        
                    })


                })
                .catch(()=>{
                    //$('#modalWait').modal('hide');
                    hideWaitForm();
                    funciones.AvisoError('No se pudo obtener el correlativo del documento a generar, revise su conexión a internet')
                })
                
                            
                
          

            }
        })
};


function dbSendPedidosBackground(usuario){
    return new Promise((resolve,reject)=>{
        resolve();
    })
    
};

