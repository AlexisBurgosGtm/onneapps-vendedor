let apigen = {
    empleadosLogin : (sucursal,user,pass)=>{
        return new Promise((resolve,reject)=>{
            axios.get(`/empleados/login?codsucursal=${sucursal}&user=${user}&pass=${pass}`)
            .then((response) => {
                const data = response.data.recordset;
                if(response.data.rowsAffected[0]==1){
                    data.map((rows)=>{
                        if(rows.USUARIO==user){
                            GlobalCodUsuario = rows.CODIGO;
                            GlobalUsuario = rows.USUARIO;
                            GlobalPassUsuario = pass;
                            GlobalTipoUsuario = rows.TIPO;
                            GlobalCoddoc= rows.CODDOC;
                            GlobalCodSucursal = sucursal;
                            GlobalEmpnit= sucursal
                            GlobalSistema = sucursal;
                            GlobalObjetivoVenta = Number(rows.OBJETIVO);
                              

                            classNavegar.inicioVendedor();   
                        }        
                    })
                    resolve();
                }else{
                    GlobalCodUsuario = 9999
                    GlobalUsuario = '';
                    GlobalTipoUsuario = '';
                    GlobalCoddoc= '';
                    GlobalObjetivoVenta =0;
                    GlobalEmpnit = '';
                    funciones.AvisoError('Usuario o Contraseña incorrectos, intente seleccionando la sucursal a la que pertenece');
                    reject();
                }
            }, (error) => {
                funciones.AvisoError('Error en la solicitud');
                reject();
            });

        })
        

    },
    empleadosLogin_ONLINE : (sucursal,user,pass)=>{
        return new Promise((resolve,reject)=>{
            axios.post('/empleados/login', {
                app:GlobalSistema,
                codsucursal: sucursal,
                user:user,
                pass:pass       
            })
            .then((response) => {
                const data = response.data.recordset;
                if(response.data.rowsAffected[0]==1){
                    data.map((rows)=>{
                        if(rows.USUARIO==user){
                            GlobalCodUsuario = rows.CODIGO;
                            GlobalUsuario = rows.USUARIO;
                            GlobalPassUsuario = pass;
                            GlobalTipoUsuario = rows.TIPO;
                            GlobalCoddoc= rows.CODDOC;
                            GlobalCodSucursal = sucursal;
                            GlobalSistema = sucursal;
                            
                            //classNavegar.inicio(GlobalTipoUsuario);     
                            classNavegar.inicioVendedor();   
                        }        
                    })
                    resolve();
                }else{
                    GlobalCodUsuario = 9999
                    GlobalUsuario = '';
                    GlobalTipoUsuario = '';
                    GlobalCoddoc= '';
                    funciones.AvisoError('Usuario o Contraseña incorrectos, intente seleccionando la sucursal a la que pertenece');
                    reject();
                }
            }, (error) => {
                funciones.AvisoError('Error en la solicitud');
                reject();
            });

        })
        

    },
    clientesVendedor: async(sucursal,codven,dia,idContenedor,idContenedorVisitados)=>{
    
        let container = document.getElementById(idContenedor);
        container.innerHTML = GlobalLoader;

        let containerVisitados = document.getElementById(idContenedorVisitados);
        
        let strdata = ''; let strdataVisitados = '';

        selectCliente(dia)
        .then((response) => {
            const data = response;
            
            data.map((rows)=>{
                    let f = rows.LASTSALE.toString().replace('T00:00:00.000Z','');
                    let stClassClie = ''; let stNomStatus='';
                    if(f==funciones.getFecha()){
                        
                        switch (rows.STVISITA) {
                            case 'VENTA':
                                stClassClie='bg-success text-white';
                                stNomStatus= 'VENDIDO';
                                break;
                            case 'CERRADO':
                                stClassClie='bg-warning';
                                stNomStatus= 'CERRADO';        
                                break;
                            case 'NODINERO':
                                stClassClie='bg-secondary text-white';
                                stNomStatus= 'SIN DINERO';
                                break;
                        
                            default:
                                
                                break;
                        };

                        strdataVisitados = strdataVisitados + `
                    <tr class='${stClassClie}'>
                        <td>${rows.NOMCLIE}
                            <br>
                            <div class="row">
                                <div class="col-6">
                                    <small>Cod: ${rows.CODIGO} - St:${stNomStatus}</small>    
                                </div>
                                <div class="col-6">
                                    <small>Tel:${rows.TELEFONO}</small>
                                </div>
                            </div>
                            
                            <small>${rows.DIRCLIE}, <b>${rows.DESMUNI}</b></small>
                            <br>
                            <small class="text-info">Ref:${rows.REFERENCIA}</small>

                            <div class="row">
                                <div class="col-4">
                                    <button class="btn btn-success btn-sm" onclick="funciones.gotoGoogleMaps('${rows.LAT}','${rows.LONG}');">
                                        <i class="fal fa-map-marker"></i>Ubicac
                                    </button>
                                </div>
                                <div class="col-4">
                                    <button class="btn btn-warning btn-sm" onclick="getHistorialCliente('${rows.CODIGO}','${rows.NIT}','${rows.NOMCLIE}');">
                                        <i class="fal fa-book"></i>Historial
                                    </button>
                                </div>
                                <div class="col-4">
                                    <button class="btn btn-info btn-sm" onclick="getMenuCliente('${rows.CODIGO}','${rows.NOMCLIE}','${rows.DIRCLIE}','${rows.TELEFONO}','${rows.LAT}','${rows.LONG}','${rows.NIT}');">
                                        <i class="fal fa-shopping-cart"></i>Vender
                                    </button>
                                </div>
                            </div>

                        </td>
                       
                    </tr>` 

                    }else{
                        strdata = strdata + `
                            <tr class='col-12 border-bottom border-info'>
                                <td>${rows.NOMCLIE}
                                    <br>
                                    <div class="row">
                                        <div class="col-6">
                                            <small>Cod: ${rows.CODIGO}</small>
                                        </div>
                                        <div class="col-6">
                                            <small>Tel:${rows.TELEFONO}</small>
                                        </div>
                                    </div>
                                    
                                    <small>${rows.DIRCLIE}, <b>${rows.DESMUNI}</b></small>
                                    
                                    <br>
                                    <small class="text-info">Ref:${rows.REFERENCIA}</small>
                                    <div class="row">
                                        
                                        <div class="col-4">
                                            <button class="btn btn-outline-primary btn-sm shadow" onclick="funciones.gotoGoogleMaps('${rows.LAT}','${rows.LONG}');">
                                                <i class="fal fa-map-marker"></i>Ubicac
                                            </button>
                                        </div>  
                                        <div class="col-4">
                                            <button class="btn btn-outline-warning shadow btn-sm" onclick="getHistorialCliente('${rows.CODIGO}','${rows.NIT}','${rows.NOMCLIE}');">
                                                <i class="fal fa-book"></i>Historial
                                            </button>   
                                        </div>
                                    
                                        <div class="col-4">
                                            <button class="btn btn-info btn-sm" onclick="getMenuCliente('${rows.CODIGO}','${rows.NOMCLIE}','${rows.DIRCLIE}','${rows.TELEFONO}','${rows.LAT}','${rows.LONG}','${rows.NIT}');">
                                                <i class="fal fa-shopping-cart"></i>Vender
                                            </button>
                                        </div>
                                    </div>
                                </td>
                               `
                    }
                    
                    
            })
            container.innerHTML = strdata;
            containerVisitados.innerHTML = strdataVisitados;

        }, (error) => {
            funciones.AvisoError('Error en la solicitud');
            strdata = '';
            containerVisitados.innerHTML = 'No se pudo cargar la lista';
            container.innerHTML = 'No se pudo cargar la lista';
        });
        
        
    },
    clientesVendedorMapa: async(sucursal,codven,dia,idContenedor, lt, lg)=>{

        let container = document.getElementById(idContenedor);
        container.innerHTML = GlobalLoader;
        
        let tbl = `<div class="mapcontainer4" id="mapcontainer"></div>`;        
        
        container.innerHTML = tbl;
        
        let mapcargado = 0;
        var map;
        map = Lmap(lt, lg);

        selectCliente(dia)
        .then((response) => {
            const data = response;

            data.map((rows)=>{
                let f = rows.LASTSALE.toString().replace('T00:00:00.000Z','');
                if(f==funciones.getFecha()){}else{
                    L.marker([rows.LAT, rows.LONG])
                    .addTo(map)
                    .bindPopup(`${rows.NOMCLIE} <br><small>${rows.DIRCLIE}-Tel:${rows.TELEFONO}</small>`, {closeOnClick: true, autoClose: true})   
                    .on('click', function(e){
                        //console.log(e.sourceTarget._leaflet_id);
                        GlobalMarkerId = Number(e.sourceTarget._leaflet_id);
                        getMenuCliente(rows.CODIGO,rows.NOMCLIE,rows.DIRCLIE,rows.TELEFONO,rows.LAT,rows.LONG,rows.NIT);
                    })
                }
            })

            //RE-AJUSTA EL MAPA A LA PANTALLA
            setTimeout(function () {
                try {
                    map.invalidateSize();    
                } catch (error) {
                    
                }
            }, 500);

        }, (error) => {
            funciones.AvisoError('Error en la solicitud');
            container.innerHTML = '';
        });
           
    },
    clientesAjenosVendedor: async(sucursal,filtro,idContenedor)=>{
    
        let container = document.getElementById(idContenedor);
        container.innerHTML = GlobalLoader;
                
        let strdata = ''; 

        axios.post('/clientes/listaajenosvendedor', {
            app:GlobalSistema,
            sucursal: sucursal,
            filtro: filtro
        })
        .then((response) => {
            const data = response.data.recordset;
            
            data.map((rows)=>{                    
                        strdata = strdata + `
                    <tr class=''>
                        <td>${rows.NOMCLIE}
                            <br>
                            <div class="row">
                                <div class="col-6">
                                    <small>Cod: ${rows.CODIGO}</small>    
                                </div>
                                <div class="col-6">
                                    <small>Tel: ${rows.TELEFONO}</small>    
                                </div>
                            </div>
                            <small>${rows.DIRCLIE}, ${rows.DESMUNI}<b></b></small>
                            <br>
                            <small class="text-info">Ref:${rows.REFERENCIA}</small>
                            
                            <div class="row">
                                
                                <div class="col-4">
                                    <button class="btn btn-outline-primary btn-sm shadow" onclick="funciones.gotoGoogleMaps('${rows.LAT}','${rows.LONG}');">
                                        <i class="fal fa-map-marker"></i>Ubicac
                                    </button>
                                </div>
                                                                        
                                <div class="col-4">
                                    <button class="btn btn-outline-warning btn-sm shadow" onclick="getHistorialCliente('${rows.CODIGO}','${rows.NIT}','${rows.NOMCLIE}');">
                                        <i class="fal fa-book"></i>Historial
                                    </button>
                                </div>
                                
                                <div class="col-4">
                                    <button class="btn btn-info btn-sm shadow" onclick="getMenuCliente('${rows.CODIGO}','${rows.NOMCLIE}','${rows.DIRCLIE}','${rows.TELEFONO}','${rows.LAT}','${rows.LONG}','${rows.NIT}');">
                                        <i class="fal fa-shopping-cart"></i>Vender
                                    </button>
                                </div>
                                
                            </div>
                            
                        </td>
                    </tr>`    
                    
                    
                    
            })
            container.innerHTML = strdata;
            

        }, (error) => {
            funciones.AvisoError('Error en la solicitud');
            strdata = '';
            container.innerHTML = 'No se pudo cargar la lista';
        });
        
        
    },
    clientesSetReminder: async (codclie,nit,nombre, direccion,recordatorio,hora,minuto,fecha)=>{

        return new Promise((resolve,reject)=>{
            axios.post('/clientes/setreminder',{
                sucursal:GlobalCodSucursal,
                codclie:codclie,
                nit:nit,
                nombre:nombre,
                direccion:direccion,
                fecha:fecha,
                minuto:minuto,
                hora:hora,
                recordatorio:recordatorio,
                codven:GlobalCodUsuario
            })
            .then((response) => {
                let data = response.data;
                if(Number(data.rowsAffected[0])>0){
                    resolve();             
                }else{
                    reject();
                }     
            }, (error) => {
                reject();
            });

        })

    },
    vendedorHistorialCliente: async(codcliente,idContenedor)=>{
    
        let container = document.getElementById(idContenedor);
        container.innerHTML = GlobalLoader;
                
        let strdata = ''; 

        axios.post('/ventas/historialcliente', {
            sucursal:GlobalSistema,
            codcliente: codcliente
        })
        .then((response) => {
            const data = response.data.recordset;
            
            data.map((rows)=>{                    
                        strdata = strdata + `
                        <tr>
                        <td class="text-danger">${rows.FECHA.toString().replace('T00:00:00.000Z','')}</td>
                        <td>${rows.DESPROD}<br>
                            <small><b>${rows.CODMEDIDA} - ${rows.CANTIDAD}</b></small>
                        </td>
                        <td>${funciones.setMoneda(rows.TOTALPRECIO,'Q')}</td>
                        </tr>
                        `    
            })
            
            container.innerHTML = strdata;
            
        }, (error) => {
            funciones.AvisoError('Error en la solicitud');
            strdata = '';
            container.innerHTML = 'No se pudo cargar la lista';
        });
        
        
    },
    vendedorTotalDia: async(sucursal,codven,fecha,idLbTotal)=>{

        let lbTotal = document.getElementById(idLbTotal);
        lbTotal.innerText = '---';

        let strdata = '';
        
        axios.post('/ventas/totalventadia', {
            app:GlobalSistema,
            sucursal: sucursal,
            codven:codven,
            fecha:fecha   
        })
        .then((response) => {
            const data = response.data.recordset;
            data.map((rows)=>{
                    strdata = `Venta Día: ${funciones.setMoneda(rows.IMPORTE,'Q')} Pedidos: ${rows.PEDIDOS}`
            })
            
            lbTotal.innerText = strdata;
        }, (error) => {
            lbTotal.innerText = '--';
        });
           
    },
    deletePedidoVendedor: async(sucursal,codven,fecha,coddoc,correlativo)=>{
        return new Promise((resolve,reject)=>{
            axios.post('/ventas/deletepedidovendedor',{
               sucursal:sucursal,
               codven:codven,
               fecha:fecha,
               coddoc:coddoc,
               correlativo:correlativo
            })
            .then((response) => {
               resolve();             
            }, (error) => {
                reject();
            });
        })
    },
    pedidosVendedor: async(sucursal,codven,fecha,idContenedor,idLbTotal)=>{

        let container = document.getElementById(idContenedor);
        container.innerHTML = GlobalLoader;
        
        let lbTotal = document.getElementById(idLbTotal);
        lbTotal.innerText = '---';

        let tableheader = `<table class="table table-responsive table-hover table-striped table-bordered">
                            <thead class="bg-trans-gradient text-white">
                                <tr>
                                    <td>Documento</td>
                                    <td>Cliente</td>
                                    <td>Importe</td>
                                </tr>
                            </thead>
                            <tbody id="tblListaPedidos">`;
        let tablefoooter ='</tbody></table>';

        let strdata = '';
        let totalpedidos = 0;
        axios.post('/ventas/listapedidos', {
            app:GlobalSistema,
            sucursal: sucursal,
            codven:codven,
            fecha:fecha   
        })
        .then((response) => {
            const data = response.data.recordset;
            let total =0;
            data.map((rows)=>{
                    total = total + Number(rows.IMPORTE);
                    totalpedidos = totalpedidos + 1;
                    strdata = strdata + `<tr>
                                <td colspan="2">
                                        <b class="text-danger">${rows.CODDOC + '-' + rows.CORRELATIVO}</b>
                                    <br>
                                        ${rows.NOMCLIE}
                                    <br>
                                        <small class="text-secondary">${rows.DIRCLIE + ', ' + rows.DESMUNI}</small>
                                    <br>
                                        <small class="text-white bg-secondary">${rows.OBS}</small>
                                    <br>
                                    <div class="row">
                                        <div class="col-3">
                                        </div>
                                        <div class="col-3">
                                            <button class="btn btn-info btn-sm btn-circle"
                                                onclick="getDetallePedido('${rows.FECHA.toString().replace('T00:00:00.000Z','')}','${rows.CODDOC}','${rows.CORRELATIVO}','${rows.CODCLIE}','${rows.NOMCLIE}','${rows.DIRCLIE}','${rows.ST}');">
                                                <i class="fal fa-edit"></i>
                                            </button>    
                                        </div>
                                        <div class="col-3">
                                            <button class="btn btn-danger btn-sm btn-circle"
                                                onclick="deletePedidoVendedor('${rows.FECHA.toString().replace('T00:00:00.000Z','')}','${rows.CODDOC}','${rows.CORRELATIVO}','${rows.ST}');">
                                                <i class="fal fa-trash"></i>
                                            </button>    
                                        </div>
                                        <div class="col-3">
                                            <button class="btn btn-outline-success btn-sm btn-circle"
                                                onclick="funciones.enviarPedidoWhatsapp2('${rows.FECHA.toString().replace('T00:00:00.000Z','')}','${rows.CODDOC}','${rows.CORRELATIVO}');">
                                                w
                                            </button>    
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <b>${funciones.setMoneda(rows.IMPORTE,'Q')}</b>
                                </td>
                            </tr>`
            })
            container.innerHTML = tableheader + strdata + tablefoooter;
            lbTotal.innerText = `${funciones.setMoneda(total,'Q ')} - Pedidos: ${totalpedidos} - Promedio:${funciones.setMoneda((Number(total)/Number(totalpedidos)),'Q')}`;
        }, (error) => {
            funciones.AvisoError('Error en la solicitud');
            strdata = '';
            container.innerHTML = '';
            lbTotal.innerText = 'Q 0.00';
        });
           
    },
    preciosListado: async(sucursal,idContenedor)=>{
        let container = document.getElementById(idContenedor);
        container.innerHTML = GlobalLoader;
        
        let strdata = '';
        let tbl = `     <table class="table table-responsive table-hover table-striped"  id="tblPrecios">
                            <thead class="bg-trans-gradient text-white">
                                <tr>
                                    <td>Producto</td>
                                    <td>Medida</td>
                                    <td>Equivale</td>
                                    <td>Público</td>
                                    <td>Mayorista C</td>
                                    <td>Mayorista B</td>
                                    <td>Mayorista A</td>
                                    <td></td>
                                </tr>
                            </thead>
                            <tbody></tbody>`;

        let tblfoot = `</tbody></table>`;

        axios.post('/productos/listaprecios', {
            sucursal: sucursal
        })
        .then((response) => {
            const data = response.data.recordset;
            let total =0;
            data.map((rows)=>{
                    
                    strdata = strdata + `<tr>
                                            <td>
                                                ${rows.DESPROD}
                                                <br>
                                                <small><b>${rows.CODPROD}</b></small>
                                            </td>
                                            <td>${rows.CODMEDIDA}</td>
                                            <td>${rows.EQUIVALE}</td>
                                            <td>${funciones.setMoneda(rows.PUBLICO,'Q')}</td>
                                            <td>${funciones.setMoneda(rows.MAYOREOC,'Q')}</td>
                                            <td>${funciones.setMoneda(rows.MAYOREOB,'Q')}</td>
                                            <td>${funciones.setMoneda(rows.MAYOREOA,'Q')}</td>
                                        </tr>`
            })
            container.innerHTML = tbl + strdata + tblfoot;
        
        }, (error) => {
            funciones.AvisoError('Error en la solicitud');
            strdata = '';
            container.innerHTML = '';
        });


    },
    reporteDiaMarcas: async(sucursal,codven,fecha,idContenedor,idLbTotal)=>{

        let container = document.getElementById(idContenedor);
        container.innerHTML = GlobalLoader;
        
        let lbTotal = document.getElementById(idLbTotal);
        lbTotal.innerText = '---';

        let strdata = '';
        let tbl = `<table class="table table-responsive table-hover table-striped table-bordered">
                    <thead class="bg-trans-gradient text-white"><tr>
                        <td>Marca</td>
                        <td>Importe</td></tr>
                    <tbody>`;

        let tblfoot = `</tbody></table>`;

        axios.post('/ventas/reportemarcasdia', {
            app:GlobalSistema,
            sucursal: sucursal,
            codven:codven,
            fecha:fecha
        })
        .then((response) => {
            const data = response.data.recordset;
            let total =0;
            data.map((rows)=>{
                    total = total + Number(rows.TOTALPRECIO);
                    strdata = strdata + `<tr>
                                            <td>
                                                ${rows.DESMARCA}
                                            </td>
                                            <td>
                                                ${funciones.setMoneda(rows.TOTALPRECIO,'Q')}
                                            </td>
                                        </tr>`
            })
            container.innerHTML = tbl + strdata + tblfoot;
            lbTotal.innerText = funciones.setMoneda(total,'Q ');
        }, (error) => {
            funciones.AvisoError('Error en la solicitud');
            strdata = '';
            container.innerHTML = '';
            lbTotal.innerText = 'Q 0.00';
        });
           
    },
    reporteDiaProductos: async(sucursal,codven,fecha,idContenedor,idLbTotal)=>{

        let container = document.getElementById(idContenedor);
        container.innerHTML = GlobalLoader;
        
        let lbTotal = document.getElementById(idLbTotal);
        lbTotal.innerText = '---';

        let strdata = '';
        let tbl = `<table class="table table-responsive table-hover table-striped table-bordered">
                    <thead class="bg-trans-gradient text-white"><tr>
                        <td>Producto</td>
                        <td>Unidades</td>
                        <td>Importe</td>
                        </tr>
                    <tbody>`;

        let tblfoot = `</tbody></table>`;

        axios.post('/ventas/reporteproductosdia', {
            app:GlobalSistema,
            sucursal: sucursal,
            codven:codven,
            fecha:fecha   
        })
        .then((response) => {
            const data = response.data.recordset;
            let total =0;
            data.map((rows)=>{
                    total = total + Number(rows.TOTALPRECIO);
                    strdata = strdata + `<tr>
                                            <td>
                                                ${rows.DESPROD}
                                                <br>
                                                <small class="text-danger">${rows.CODPROD}</small>
                                            </td>
                                            <td>${rows.TOTALUNIDADES}</td>
                                            <td>
                                                ${funciones.setMoneda(rows.TOTALPRECIO,'Q')}
                                            </td>
                                        </tr>`
            })
            container.innerHTML = tbl + strdata + tblfoot;
            lbTotal.innerText = funciones.setMoneda(total,'Q ');
        }, (error) => {
            funciones.AvisoError('Error en la solicitud');
            strdata = '';
            container.innerHTML = '';
            lbTotal.innerText = 'Q 0.00';
        });
           
    },
    reporteDinero: async(sucursal,codven,anio,mes,idContenedor,idLbTotal)=>{

        let container = document.getElementById(idContenedor);
        container.innerHTML = GlobalLoader;
        
        let lbTotal = document.getElementById(idLbTotal);
        lbTotal.innerText = '---';

        let strdata = ''; let strdatadev = '';
        let tbl = `<table class="table table-bordered">
                    <thead class="bg-success text-white"><tr>
                        <td>Fecha</td>
                        <td>Importe</td>
                        </tr>
                    <tbody>`;

        let tblDev = `<table class="table table-bordered">
        <thead class="bg-danger text-white"><tr>
            <td>Fecha</td>
            <td>Importe</td>
            </tr>
        <tbody>`;

        let tblfoot = `</tbody></table>`;

        axios.post('/ventas/rptventas_vendedor', {
            sucursal: sucursal,
            codven:codven,
            anio:anio,
            mes:mes   
        })
        .then((response) => {
            const data = response.data.recordset;
            let total =0; let pedidos = 0;
            let totalventa = 0; let totaldevolucion = 0;
            data.map((rows)=>{
                    total = total + Number(rows.TOTALPRECIO);
                   
                    if(rows.TIPO=='FAC'){
                        totalventa = totalventa + Number(rows.TOTALPRECIO);
                        strdata = strdata + `<tr>
                            <td>
                                ${rows.FECHA.toString().replace('T00:00:00.000Z','')}
                            </td>
                            <td>
                                ${funciones.setMoneda(rows.TOTALPRECIO,'Q')}
                            </td>
                        </tr>`
                    }else{
                        totaldevolucion = totaldevolucion + Number(rows.TOTALPRECIO);
                        strdatadev = strdatadev + `<tr>
                            <td>
                                ${rows.FECHA.toString().replace('T00:00:00.000Z','')}
                            </td>
                            <td>
                                ${funciones.setMoneda(rows.TOTALPRECIO,'Q')}
                            </td>
                        </tr>`
                    }
            })
            let faltan = Number(GlobalObjetivoVenta)-Number(total);
            let logro = total / GlobalObjetivoVenta;
            container.innerHTML =`<div class="row">
                                    <div class="col-6">
                                        <label>Facturado: <b class="text-success">${funciones.setMoneda(totalventa,'Q')}</b></label>
                                        ${tbl + strdata + tblfoot}
                                    </div>
                                    <div class="col-6">
                                        <label>Devuelto: <b class="text-danger">${funciones.setMoneda(totaldevolucion,'Q')}</b></label>
                                        ${tblDev + strdatadev + tblfoot}
                                    </div>
                                </div>`;
            lbTotal.innerHTML = `Vendido:${funciones.setMoneda(total,'Q ')}
            <br>Objetivo: ${funciones.setMoneda(GlobalObjetivoVenta,'Q')}
            <br>Faltan: ${funciones.setMoneda(faltan,'Q')}
            <br>Logro:${funciones.setMargen((logro*100),'%')}
            <br>Total Facturado=${funciones.setMoneda(totalventa,'Q')}
            <br>Total Devolución=${funciones.setMoneda(totaldevolucion,'Q')}`;
        }, (error) => {
            funciones.AvisoError('Error en la solicitud');
            strdata = '';
            container.innerHTML = '';
            lbTotal.innerText = 'Q 0.00';
        });
           
    },
    reporteProductos: async(sucursal,codven,anio,mes,idContenedor,idLbTotal)=>{

        let container = document.getElementById(idContenedor);
        container.innerHTML = GlobalLoader;
        
        let lbTotal = document.getElementById(idLbTotal);
        lbTotal.innerText = '---';

        let strdata = '';
        let tbl = `<table class="table-responsive table-hover table-striped">
                    <thead class="bg-trans-gradient text-white"><tr>
                        <td>Producto</td>
                        <td>Unidades</td>
                        <td>Importe</td>
                        </tr>
                    <tbody>`;

        let tblfoot = `</tbody></table>`;

        axios.post('/ventas/reporteproductos', {
            app:GlobalSistema,
            sucursal: sucursal,
            codven:codven,
            anio:anio,
            mes:mes   
        })
        .then((response) => {
            const data = response.data.recordset;
            let total =0;
            data.map((rows)=>{
                    total = total + Number(rows.TOTALPRECIO);
                    strdata = strdata + `<tr>
                                            <td>
                                                ${rows.DESPROD}
                                                <br>
                                                <small class="text-danger">${rows.CODPROD}</small>
                                            </td>
                                            <td>${rows.TOTALUNIDADES}</td>
                                            <td>
                                                ${funciones.setMoneda(rows.TOTALPRECIO,'Q')}
                                            </td>
                                        </tr>`
            })
            container.innerHTML = tbl + strdata + tblfoot;
            lbTotal.innerText = funciones.setMoneda(total,'Q ');
        }, (error) => {
            funciones.AvisoError('Error en la solicitud');
            strdata = '';
            container.innerHTML = '';
            lbTotal.innerText = 'Q 0.00';
        });
           
    },
    reporteMarcas: async(sucursal,codven,anio,mes,idContenedor,idLbTotal)=>{

        let container = document.getElementById(idContenedor);
        container.innerHTML = GlobalLoader;
        
        let lbTotal = document.getElementById(idLbTotal);
        lbTotal.innerText = '---';

        let strdata = '';
        let tbl = `<table class="table-responsive table-hover table-striped">
                    <thead class="bg-trans-gradient text-white"><tr>
                        <td>Marca</td>
                        <td>Importe</td></tr>
                    <tbody>`;

        let tblfoot = `</tbody></table>`;

        axios.post('/ventas/reportemarcas', {
            app:GlobalSistema,
            sucursal: sucursal,
            codven:codven,
            anio:anio,
            mes:mes   
        })
        .then((response) => {
            const data = response.data.recordset;
            let total =0;
            data.map((rows)=>{
                    total = total + Number(rows.TOTALPRECIO);
                    strdata = strdata + `<tr>
                                            <td>
                                                ${rows.DESMARCA}
                                            </td>
                                            <td>
                                                ${funciones.setMoneda(rows.TOTALPRECIO,'Q')}
                                            </td>
                                        </tr>`
            })
            container.innerHTML = tbl + strdata + tblfoot;
            lbTotal.innerText = funciones.setMoneda(total,'Q ');
        }, (error) => {
            funciones.AvisoError('Error en la solicitud');
            strdata = '';
            container.innerHTML = '';
            lbTotal.innerText = 'Q 0.00';
        });
           
    },
    reporteLocaciones: async(sucursal,codven,anio,mes,idContenedor,idLbTotal)=>{

        let container = document.getElementById(idContenedor);
        container.innerHTML = GlobalLoader;
        
        let lbTotal = document.getElementById(idLbTotal);
        lbTotal.innerText = '---';

        let tbl = `<div class="mapcontainer" id="mapcontainer"></div>`;        
        
        container.innerHTML = tbl;
        
        let mapcargado = 0;

        axios.post('/ventas/reportelocaciones', {
            app:GlobalSistema,
            sucursal: sucursal,
            codven:codven,
            anio:anio,
            mes:mes   
        })
        .then((response) => {
            const data = response.data.recordset;
            let total =0;
            data.map((rows)=>{
                total = total + Number(rows.TOTALVENTA);
                    if(mapcargado==0){
                        map = Lmap(rows.LAT, rows.LONG, rows.CLIENTE, rows.TOTALVENTA);
                        mapcargado = 1;
                    }else{
                        L.marker([rows.LAT, rows.LONG])
                        .addTo(map)
                        .bindPopup(rows.CLIENTE + ' - '  + rows.TOTALVENTA)   
                    }
            })
            //container.innerHTML = tbl;
            lbTotal.innerText = funciones.setMoneda(total,'Q ');
        }, (error) => {
            funciones.AvisoError('Error en la solicitud');
            container.innerHTML = '';
            lbTotal.innerText = 'Q 0.00';
        });
           
    },
    vendedorEmbarques : async(idContainer)=>{
        
        let container = document.getElementById(idContainer);
            
        let strdata = '<option value="">SELECCIONE EMBARQUE</option>';

        axios.post('/repartidor/embarquesvendedor', {
            sucursal: GlobalCodSucursal,
            codvendedor:GlobalCodUsuario
        })
        .then((response) => {
            const data = response.data.recordset;
            data.map((rows)=>{
                strdata = strdata + `
                            <option value='${rows.CODIGO}'>
                                ${rows.CODIGO}-${rows.RUTA}-${rows.FECHA.toString().replace('T00:00:00.000Z','')}
                            </option>
                            `
            })
            container.innerHTML = strdata;
    
        }, (error) => {
            funciones.AvisoError('Error en la solicitud');
            container.innerHTML = '';            
    
        });

    
    },
    vendedorRepartoPicking : async(embarque,idPendientes,idParciales,idRechazados,idEntregados)=>{
        
        let containerPendientes = document.getElementById(idPendientes);
        let containerParciales = document.getElementById(idParciales);
        let containerRechazados = document.getElementById(idRechazados);
        let containerEntregados = document.getElementById(idEntregados);

        containerPendientes.innerHTML= GlobalLoader;
        containerParciales.innerHTML = '';
        containerRechazados.innerHTML = '';
        containerEntregados.innerHTML = '';
                
        let strdataPend = ''; let strdataParc =''; let strdataRech =''; let strdataEntr='';
        
        let totalpedidos = 0;
        axios.post('/repartidor/facturasvendedor', {
            sucursal: GlobalCodSucursal,
            codembarque:embarque,
            codven:GlobalCodUsuario
        })
        .then((response) => {
            const data = response.data.recordset;
            let strC ='';
            let total =0;
            data.map((rows)=>{
                    total = total + Number(rows.IMPORTE);
                    totalpedidos = totalpedidos + 1;
                    switch (rows.ST) {
                        case 'A': //ACTIVO O PENDIENTE
                        strdataPend = strdataPend + `
                        <tr class=''>
                            <td>
                                ${rows.CODDOC + '-' + rows.CORRELATIVO}
                                <br>
                                <small class="text-danger">${rows.FECHA.toString().replace('T00:00:00.000Z','')}</small>
                            </td>
                            <td>${rows.CLIENTE}
                                <br>
                                <small>${rows.DIRECCION + ',' + rows.MUNICIPIO}</small>
                            </td>
                            <td>
                                <b>${funciones.setMoneda(rows.IMPORTE,'Q')}</b>
                            </td>
                            <td>
                                <button class="btn btn-info btn-sm btn-circle" onclick="getDetalleFactura('${rows.CODDOC}','${rows.CORRELATIVO}','${rows.CLIENTE}')">
                                    <i class="fal fa-book"></i>
                                </button>
                            </td>
                        </tr>`
                            break;

                        case 'E': //ENTREGADO
                        strdataEntr = strdataEntr + `
                        <tr class=''>
                            <td>
                                ${rows.CODDOC + '-' + rows.CORRELATIVO}
                                <br>
                                <small class="text-danger">${rows.FECHA.toString().replace('T00:00:00.000Z','')}</small>
                            </td>
                            <td>${rows.CLIENTE}
                                <br>
                                <small>${rows.DIRECCION + ',' + rows.MUNICIPIO}</small>
                            </td>
                            <td>
                                <b>${funciones.setMoneda(rows.IMPORTE,'Q')}</b>
                            </td>
                            <td>
                                <button class="btn btn-info btn-sm btn-circle" onclick="getDetalleFactura('${rows.CODDOC}','${rows.CORRELATIVO}','${rows.CLIENTE}')">
                                    <i class="fal fa-book"></i>
                                </button>
                            </td>
                        </tr>`
                            break;
                        case 'P': // PARCIAL
                        strdataParc = strdataParc + `
                        <tr class=''>
                            <td>
                                ${rows.CODDOC + '-' + rows.CORRELATIVO}
                                <br>
                                <small class="text-danger">${rows.FECHA.toString().replace('T00:00:00.000Z','')}</small>
                            </td>
                            <td>${rows.CLIENTE}
                                <br>
                                <small>${rows.DIRECCION + ',' + rows.MUNICIPIO}</small>
                            </td>
                            <td>
                                <b>${funciones.setMoneda(rows.IMPORTE,'Q')}</b>
                            </td>
                            <td>
                                <button class="btn btn-info btn-sm btn-circle" onclick="getDetalleFactura('${rows.CODDOC}','${rows.CORRELATIVO}','${rows.CLIENTE}')">
                                    <i class="fal fa-book"></i>
                                </button>
                            </td>
                        </tr>`
                            break;
                        case 'R': //RECHAZADO
                        strdataRech = strdataRech + `
                        <tr class=''>
                            <td>
                                ${rows.CODDOC + '-' + rows.CORRELATIVO}
                                <br>
                                <small class="text-danger">${rows.FECHA.toString().replace('T00:00:00.000Z','')}</small>
                            </td>
                            <td>${rows.CLIENTE}
                                <br>
                                <small>${rows.DIRECCION + ',' + rows.MUNICIPIO}</small>
                            </td>
                            <td>
                                <b>${funciones.setMoneda(rows.IMPORTE,'Q')}</b>
                            </td>
                            <td>
                                <button class="btn btn-info btn-sm btn-circle" onclick="getDetalleFactura('${rows.CODDOC}','${rows.CORRELATIVO}','${rows.CLIENTE}')">
                                    <i class="fal fa-book"></i>
                                </button>
                            </td>
                        </tr>`
                            break;
                    }

                    
            })
            containerPendientes.innerHTML = strdataPend;
            containerRechazados.innerHTML = strdataRech;
            containerParciales.innerHTML = strdataParc;
            containerEntregados.innerHTML = strdataEntr;
        }, (error) => {
            funciones.AvisoError('Error en la solicitud');
            strdata = '';
            containerPendientes.innerHTML= '';
            containerParciales.innerHTML = '';
            containerRechazados.innerHTML = '';
            containerEntregados.innerHTML = '';
        });
    },
    vendedorDetallePedido: async(coddoc,correlativo,idContenedor,idLbTotal)=>{

        let container = document.getElementById(idContenedor);
        container.innerHTML = GlobalLoader;
        
        let lbTotal = document.getElementById(idLbTotal);
        lbTotal.innerText = '---';
        
        let strdata = '';

        GlobalSelectedCoddoc = coddoc;
        GlobalSelectedCorrelativo = correlativo;

        axios.post('/repartidor/detallepedido', {
            sucursal: GlobalCodSucursal,
            coddoc:coddoc,
            correlativo:correlativo
        })
        .then((response) => {
            const data = response.data.recordset;
            let total =0;
            data.map((rows)=>{
                    total = total + Number(rows.IMPORTE);
                    strdata = strdata + `
                            <tr id='${rows.DOC_ITEM}'>
                                <td>${rows.DESPROD}
                                    <br>
                                    <small class="text-danger">${rows.CODPROD} - ${rows.CODMEDIDA}</small>
                                </td>
                                <td>${rows.CANTIDAD}
                                    <br>
                                    <small>${rows.PRECIO}</small>
                                </td>
                                <td>${funciones.setMoneda(rows.IMPORTE,'Q')}</td>
                            </tr>
                            `
            })
            container.innerHTML = strdata;
            lbTotal.innerText = `${funciones.setMoneda(total,'Q')}`;
        }, (error) => {
            funciones.AvisoError('Error en la solicitud');
            strdata = '';
            container.innerHTML = '';
            lbTotal.innerText = 'Q0.00';
        });
           
    },
    noticiaslistado : (sucursal,user,idContenedor)=>{

        let container = document.getElementById(idContenedor);
        container.innerHTML = GlobalLoader;

        let str = '';

        axios.get('/noticias/listado', {
            sucursal: sucursal,
            user:user
        })
        .then((response) => {
            const data = response.data.recordset;
            data.map((rows)=>{
                let classprioridad ='';
                switch (rows.PRIORIDAD) {
                    case 'ALTA':
                        classprioridad = 'bg-danger';
                        break;
                    case 'MEDIA':
                        classprioridad = 'bg-warning';
                        break;
                    case 'BAJA':
                        classprioridad = 'bg-info';
                         break;               
                    default:
                        break;
                }
                str = str + `
                    <div class="row">
                        <div class="card col-12">
                            <div class="card-header ${classprioridad}">
                                <label class="text-white">${rows.FECHA.toString().replace('T00:00:00.000Z','')}</label>
                            </div>
                            <div class="card-body">
                                <label>${rows.NOTICIA}</label>
                            </div>
                            <div class="card-footer text-right">
                                <label><i>${rows.USUARIO}</i></label>
                            </div>
                        </div>
                    </div>`        
            })
            container.innerHTML = str;

        }, (error) => {
            funciones.AvisoError('Error en la solicitud');
            container.innerHTML = 'No se pudo cargar la lista';
        });

    },
    tblVendedores : (sucursal,idContainer)=>{
        let container = document.getElementById(idContainer);
        container.innerHTML = GlobalLoader;
        
        let strHead = `<div class="table-responsive">
                            <table class="table table-responsive table-striped table-hover table-bordered">
                                <thead class=" bg-trans-gradient text-white">
                                    <tr>
                                        <td>Vendedor</td>
                                        <td></td>
                                    </tr>
                                </thead>
                                <tbody></tbody>
                            </table>
                        </div>`
        let str = '';

        axios.post('/empleados/vendedores', {
            sucursal: sucursal,
            user:GlobalUsuario
        })
        .then((response) => {
            //style="width: 15rem;"
            const data = response.data.recordset;
            data.map((rows)=>{
                str = str + `
                        <div class="card col-sm-12 col-md-3 col-lg-3 col-xl-3" >
                            <div class="card-header bg-trans-gradient text-white text-center">
                                <h5 class="text-center">${rows.NOMBRE}</h5>
                            </div>        
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-6">
                                        <div class="form-group">
                                            <label>Teléfono:</label>
                                            <h5 class="text-info">
                                                <a href="https://api.whatsapp.com/send?phone=502${rows.TELEFONO}&text=${rows.NOMBRE.replace(' ','%20')}" target="blank">${rows.TELEFONO}</a>
                                            </h5>        
                                        </div>    
                                    </div>
                                    <div class="col-6" align="right">
                                        <button class="btn btn-info btn-circle btn-lg" onclick="getGerenciaVendedorLogro(${rows.CODIGO},'${rows.NOMBRE}');">
                                        +
                                        </button>    
                                    </div>
                                
                                </div>
                                
                            </div>
                            
                        </div>`        
            })
            container.innerHTML = str;

        }, (error) => {
            funciones.AvisoError('Error en la solicitud');
            container.innerHTML = 'No se pudo cargar la lista';
        });

    },
    clientesListadoVendedor:(sucursal, codven, idContainer)=>{
        let container = document.getElementById(idContainer);
        container.innerHTML = GlobalLoader;
        
        
        let strdata = '';
        let tbl = `<table class="table table-hover table-striped" id="tblClientesVendedor">
                    <thead  class="bg-trans-gradient text-white"> 
                        <tr>
                            <td>Cliente</td>
                            <td>Dirección</td>
                            <td>Telefono</td>
                            <td>Visita</td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>`;

        let tblfoot = `</tbody></table>`;

        axios.post('/clientes/clientesvendedor', {
            sucursal: sucursal,
            codven:codven
        })
        .then((response) => {
            const data = response.data.recordset;
            
            data.map((rows)=>{
                    let strClass = '';
                    if(rows.ACTIVO==1){strClass='bg-danger text-white'}else{strClass=''};
                    strdata = strdata + `<tr class="${strClass}">
                                            <td>${rows.NOMCLIE}
                                                <br>
                                                <small>Código:<b>${rows.CODIGO}</b>  NIT:<b>${rows.NIT}</b></small>
                                            </td>
                                            <td>${rows.DIRCLIE}
                                                <br>
                                                <small>${rows.DESMUNI},${rows.DESDEPTO}</small>
                                            </td>
                                            <td>${rows.TELEFONO}</td>
                                            <td>${rows.VISITA}</td>
                                            
                                            <td>
                                                <button class="btn btn-md btn-circle btn-info" onclick="getMenuCliente('${rows.CODIGO}','${rows.NOMCLIE}','${rows.DIRCLIE}','${rows.VISITA}','${rows.CODVEN}','${rows.ACTIVO}');">+</button>
                                            </td>
                                        </tr>`
            })
            container.innerHTML = tbl + strdata + tblfoot;
            
        }, (error) => {
            funciones.AvisoError('Error en la solicitud');
            strdata = '';
            container.innerHTML = '';
        });

    },
    clientesListadoDesactivar : (sucursal,nitclie)=>{
        return new Promise((resolve,reject)=>{
            axios.put('/clientes/desactivar',{
                sucursal:sucursal,
                nitclie:nitclie
            })
            .then((response) => {
                
               resolve(response);             
            }, (error) => {
                
                reject(error);
            });
        });

    },
    clientesListadoActivar : (sucursal,nitclie)=>{
        return new Promise((resolve,reject)=>{
            axios.put('/clientes/reactivar',{
                sucursal:sucursal,
                nitclie:nitclie
            })
            .then((response) => {
                
               resolve(response);             
            }, (error) => {
                
                reject(error);
            });
        });

    },
    clientesCensoVendedor:(sucursal, codven, visita, idContainer)=>{
        
        let container = document.getElementById(idContainer);
        container.innerHTML = GlobalLoader;
        
        let strdata = '';
        let tbl = `<table class="table table-hover table-striped table-border" id="tblClientesVendedor">
                    <thead  class="bg-trans-gradient text-white"> 
                        <tr>
                            <td>Cliente</td>
                            <td>Dirección</td>
                            <td>Telefono</td>
                            <td>Visita</td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>`;

        let tblfoot = `</tbody></table>`;

        axios.post('/clientes/censovendedor', {
            sucursal: sucursal,
            codven:codven,
            visita:visita
        })
        .then((response) => {
            const data = response.data.recordset;
            
            data.map((rows)=>{
                    let strClass = 'border-bottom';
                    strdata = strdata + `<tr class="${strClass}">
                                            <td>${rows.NOMCLIE}
                                                    <br>
                                                <small><b>${rows.TIPONEGOCIO} - ${rows.NEGOCIO}</b> </small>
                                                    <br>
                                                <small>Id:<b>${rows.ID}</b>  NIT:<b>${rows.NITCLIE}</b></small>
                                            </td>
                                            <td>${rows.DIRCLIE}
                                                <br>
                                                <small>Ref: ${rows.REFERENCIA}</small>
                                                <br>
                                                <small>${rows.DESMUNI},${rows.DESDEPTO}</small>
                                            </td>
                                            <td>${rows.TELEFONO}
                                                <br>
                                                <small>${rows.FECHA.replace('T00:00:00.000Z','')}</small>
                                            </td>
                                            <td>${rows.VISITA}</td>
                                            <td>
                                                <button class="btn btn-md btn-circle btn-info" 
                                                onclick="getMenuCliente(${rows.ID},'${rows.NITCLIE}','${rows.TIPONEGOCIO}','${rows.NEGOCIO}','${rows.NOMCLIE}','${rows.DIRCLIE}','${rows.REFERENCIA}','${rows.OBS}','${rows.FECHA}','${rows.CODMUNI}','${rows.CODDEPTO}','${rows.TELEFONO}','${rows.VISITA}','${rows.LAT}','${rows.LONG}');">
                                                    <i class="fal fa-bullet"></i>
                                                </button>
                                            </td>
                                        </tr>`
            })
            container.innerHTML = tbl + strdata + tblfoot;
            
        }, (error) => {
            funciones.AvisoError('Error en la solicitud');
            strdata = '';
            container.innerHTML = '';
        });

    },
    clientesCensoVendedorMapa:(sucursal, codven, visita, idContainer)=>{
        
        let container = document.getElementById(idContainer);
        container.innerHTML = GlobalLoader;
        
        let tbl = `<div class="mapcontainer4" id="mapcontainer"></div>`;        
        
        container.innerHTML = tbl;
        
        let mapcargado = 0;
        

        axios.post('/clientes/censovendedor', {
            sucursal: sucursal,
            codven:codven,
            visita:visita
        })
        .then((response) => {
            const data = response.data.recordset;

            data.map((rows)=>{
                    if(mapcargado==0){
                        map = Lmap(rows.LAT, rows.LONG, funciones.quitarCaracteres(rows.NOMCLIE,'"'," plg",true), funciones.quitarCaracteres(rows.DIRCLIE,'"'," plg",true));
                        mapcargado = 1;

                    }else{
                        L.marker([rows.LAT, rows.LONG])
                        .addTo(map)
                        .bindPopup(`${rows.NOMCLIE} <br><small>${rows.DIRCLIE}</small>`, {closeOnClick: false, autoClose: false})   
                        //.openPopup();
                    }
            })
            
        }, (error) => {
            funciones.AvisoError('Error en la solicitud');
            container.innerHTML = '';
        });

    },
    gerenciaSucursalesTotales: (mes,anio,idContenedor,idLbTotal)=>{
        
        let container = document.getElementById(idContenedor);
        container.innerHTML = GlobalLoader;
        
        let lbTotal = document.getElementById(idLbTotal);
        lbTotal.innerText = '---';
        
        let strdata = '';

        axios.post('/sucursales/totales', {
            mes:mes,
            anio: anio
        })
        .then((response) => {
            const data = response.data.recordset;
            let total =0; let utilidad = 0;
            data.map((rows)=>{
                    total = total + Number(rows.VENTA);
                    utilidad = utilidad + Number(rows.UTILIDAD);
                    strdata = strdata + `
                    <div class="col-sm-6 col-xl-3">
                        <div class="p-3 bg-${rows.COLOR}-300 rounded overflow-hidden position-relative text-white mb-g">
                            <div class="">
                                <h3 class="display-4 d-block l-h-n m-0 fw-500">
                                            ${funciones.setMoneda(rows.VENTA,'Q')}
                                    <small class="m-0 l-h-n">${rows.SUCURSAL}</small>
                                </h3>
                                <small>Utilidad Bruta: ${funciones.setMoneda(rows.UTILIDAD)}</small>
                            </div>
                                <i class="fal fa-lightbulb position-absolute pos-right pos-bottom opacity-15 mb-n5 mr-n6" style="font-size:6rem"></i>
                            </div>
                        </div>
                    </div>
                    `
            })
            container.innerHTML = strdata;
            lbTotal.innerHTML = `Total Ventas: ${funciones.setMoneda(total,'Q')} - Total Utilidad: ${funciones.setMoneda(utilidad,'Q')}`;
        }, (error) => {
            funciones.AvisoError('Error en la solicitud');
            strdata = '';
            container.innerHTML = '';
            lbTotal.innerHTML = '-';
        });
    },
    gerenciaResumenSucursal: (mes,anio,idContenedor,idLbTotal)=>{
        
        let container = document.getElementById(idContenedor);
        container.innerHTML = GlobalLoader;
        
        let lbTotal = document.getElementById(idLbTotal);
        lbTotal.innerText = '---';
        
        let strdata = '';

        axios.post('/ventas/rptsucursalesventas', {
            mes:mes,
            anio: anio
        })
        .then((response) => {
            const data = response.data.recordset;
            let total =0;
            data.map((rows)=>{
                    total = total + Number(rows.IMPORTE);
                    strdata = strdata + `
                    <div class="col-sm-6 col-xl-3">
                        <div class="p-3 bg-${rows.COLOR}-300 rounded overflow-hidden position-relative text-white mb-g">
                            <div class="">
                                <h3 class="display-4 d-block l-h-n m-0 fw-500">
                                            ${funciones.setMoneda(rows.IMPORTE,'Q')}
                                    <small class="m-0 l-h-n">${rows.SUCURSAL}</small>
                                </h3>
                            </div>
                                <i class="fal fa-lightbulb position-absolute pos-right pos-bottom opacity-15 mb-n5 mr-n6" style="font-size:6rem"></i>
                            </div>
                        </div>
                    </div>
                    `
            })
            container.innerHTML = strdata;
            lbTotal.innerText = funciones.setMoneda(total,'Q ');
        }, (error) => {
            funciones.AvisoError('Error en la solicitud');
            strdata = '';
            container.innerHTML = '';
            lbTotal.innerText = 'Q 0.00';
        });
    },
    gerenciaResumenSucursalSucursales: (mes,anio,idContenedor,idLbTotal)=>{
        
        let container = document.getElementById(idContenedor);
        container.innerHTML = GlobalLoader;
        
        let lbTotal = document.getElementById(idLbTotal);
        lbTotal.innerText = '---';
        
        let strdata = '';

        axios.post('/ventas/rptsucursalesventassucursales', {
            mes:mes,
            anio: anio
        })
        .then((response) => {
            const data = response.data.recordset;
            let total =0;
            data.map((rows)=>{
                    total = total + Number(rows.IMPORTE);
                    strdata = strdata + `
                    <div class="col-sm-6 col-xl-3">
                        <div class="p-3 bg-${rows.COLOR}-300 rounded overflow-hidden position-relative text-white mb-g">
                            <div class="">
                                <h3 class="display-4 d-block l-h-n m-0 fw-500">
                                            ${funciones.setMoneda(rows.IMPORTE,'Q')}
                                    <small class="m-0 l-h-n">${rows.SUCURSAL}</small>
                                </h3>
                            </div>
                                <i class="fal fa-lightbulb position-absolute pos-right pos-bottom opacity-15 mb-n5 mr-n6" style="font-size:6rem"></i>
                            </div>
                        </div>
                    </div>
                    `
            })
            container.innerHTML = strdata;
            lbTotal.innerText = funciones.setMoneda(total,'Q ');
        }, (error) => {
            funciones.AvisoError('Error en la solicitud');
            strdata = '';
            container.innerHTML = '';
            lbTotal.innerText = 'Q 0.00';
        });
    },
    gerenciaRankingVendedores: (mes,anio,idContenedor)=>{
        
        let container = document.getElementById(idContenedor);
        container.innerHTML = GlobalLoader;
            
        let strdata = '';
        let tblHead = `<table class="table table-responsive table-striped table-hover table-bordered">
                        <thead class="bg-trans-gradient text-white">
                            <tr>
                                <td>Vendedor</td>
                                <td>Venta</td>
                                <td>Sucursal</td>
                            </tr>
                        </thead>
                        <tbody>`;
        let tblFoot = `</tbody></table>`;

        axios.post('/ventas/rptrankingvendedores', {
            mes:mes,
            anio: anio
        })
        .then((response) => {
            const data = response.data.recordset;
            data.map((rows)=>{
                    strdata = strdata + `
                    <tr>
                        <td>${rows.NOMVEN}</td>
                        <td>${funciones.setMoneda(rows.TOTALPRECIO,'Q')}</td>
                        <td>${rows.SUCURSAL}</td>
                    </tr>
                    `
            })
            container.innerHTML = tblHead + strdata + tblFoot;
            
        }, (error) => {
            funciones.AvisoError('Error en la solicitud');
            strdata = '';
            container.innerHTML = '';
        });
    },
    gerenciaRankingVendedoresSucursales: (mes,anio,idContenedor)=>{
        
        let container = document.getElementById(idContenedor);
        container.innerHTML = GlobalLoader;
            
        let strdata = '';
        let tblHead = `<table class="table table-responsive table-striped table-hover table-bordered">
                        <thead class="bg-trans-gradient text-white">
                            <tr>
                                <td>Vendedor</td>
                                <td>Venta</td>
                                <td>Sucursal</td>
                            </tr>
                        </thead>
                        <tbody>`;
        let tblFoot = `</tbody></table>`;

        axios.post('/ventas/rptrankingvendedoressucursal', {
            mes:mes,
            anio: anio
        })
        .then((response) => {
            const data = response.data.recordset;
            data.map((rows)=>{
                    strdata = strdata + `
                    <tr>
                        <td>${rows.NOMVEN}</td>
                        <td>${funciones.setMoneda(rows.TOTALPRECIO,'Q')}</td>
                        <td>${rows.SUCURSAL}</td>
                    </tr>
                    `
            })
            container.innerHTML = tblHead + strdata + tblFoot;
            
        }, (error) => {
            funciones.AvisoError('Error en la solicitud');
            strdata = '';
            container.innerHTML = '';
        });
    },
    gerenciaMarcas: (idContenedor, idContenedorProductos)=>{
        
        let container = document.getElementById(idContenedor);
        container.innerHTML = GlobalLoader;
            
        let strdata = '';
        
        axios.post('/productos/marcas')
        .then((response) => {
            const data = response.data.recordset;
            data.map((rows)=>{
                    strdata = strdata + `
                    <div class="card">
                        <div class="row">
                            <div class="col-10">
                                <h3 class="text-info">${rows.DESMARCA}</h3>    
                            </div>
                            <div class="col-1 text-right">
                                <button class="btn btn-info btn-circle btn-md" onclick="getProductosMarca('${rows.CODMARCA}','${idContenedorProductos}');">
                                    +
                                </button>    
                            </div>
                        </div>
                    </div>
                    `
            })
            container.innerHTML = strdata;
            
        }, (error) => {
            funciones.AvisoError('Error en la solicitud');
            strdata = '';
            container.innerHTML = '';
        });
    },
    gerenciaProductos: (filtro, idContenedor)=>{
        
        let container = document.getElementById(idContenedor);
        container.innerHTML = GlobalLoader;
            
        let strdata = '';
        
        axios.post('/productos/listado',{filtro:filtro})
        .then((response) => {
            const data = response.data.recordset;
            data.map((rows)=>{
                let classHabilitado = '';
                if(rows.NOHABILITADO==0){classHabilitado=''}else{classHabilitado='bg-warning'}
                    strdata = strdata + `
                    <tr class='${classHabilitado}'>
                        <td>${rows.DESPROD}
                            <br>
                            <small>Cod:<b>${rows.CODPROD}</b> - uxc:${rows.EQUIVALEINV}</small>
                            <br>
                            <small>Costo:<b>${funciones.setMoneda(rows.COSTO,'Q')}</b> - UF:<b>${rows.LASTUPDATE.replace('T00:00:00.000Z','')}</b></small>
                        </td>
                        <td>
                            <button class="btn btn-info btn-sm btn-circle" onclick="getOpcionesProducto('${rows.CODPROD}','${rows.DESPROD}',${rows.NOHABILITADO});">
                                +
                            </button>
                        </td>
                    </tr>
                    `
            })
            container.innerHTML = strdata;
            
        }, (error) => {
            funciones.AvisoError('Error en la solicitud');
            strdata = '';
            container.innerHTML = '';
        });
    },
    gerenteRankingVendedores: (fecha,idContenedor, idLbTotal)=>{
        
        let container = document.getElementById(idContenedor);
        container.innerHTML = GlobalLoader;

        let lbTotal = document.getElementById(idLbTotal);
        lbTotal.innerText = '---';
            
        let strdata = '';
        let tblHead = `<table class="table table-responsive table-striped table-hover table-bordered">
                        <thead class="bg-trans-gradient text-white">
                            <tr>
                                <td>Vendedor</td>
                                <td>Venta</td>
                                <td>Pedidos</td>
                                <td>Promedio</td>
                            </tr>
                        </thead>
                        <tbody>`;
        let tblFoot = `</tbody></table>`;

        axios.post('/ventas/rptrankingvendedoressucursal', {
            fecha:fecha,
            sucursal: GlobalCodSucursal
        })
        .then((response) => {
            const data = response.data.recordset;
            let total =0;
            data.map((rows)=>{
                    total = total + Number(rows.TOTALPRECIO);
                    let promedio = Number(rows.TOTALPRECIO) / Number(rows.PEDIDOS);
                    strdata = strdata + `
                    <tr>
                        <td>${rows.NOMVEN}</td>
                        <td>${funciones.setMoneda(rows.TOTALPRECIO,'Q')}</td>
                        <td>${rows.PEDIDOS}</td>
                        <td>${funciones.setMoneda(promedio,'Q')}</td>
                    </tr>
                    `
            })
            container.innerHTML = tblHead + strdata + tblFoot;
            lbTotal.innerText = funciones.setMoneda(total,'Q ');
        }, (error) => {
            funciones.AvisoError('Error en la solicitud');
            lbTotal.innerText = 'Q 0.00'
            strdata = '';
            container.innerHTML = '';
        });
    },
    gerenteRankingVendedoresMes: (anio,mes,idContenedor, idLbTotal)=>{
        
        let container = document.getElementById(idContenedor);
        container.innerHTML = GlobalLoader;

        let lbTotal = document.getElementById(idLbTotal);
        lbTotal.innerText = '---';
            
        let strdata = '';
        let tblHead = `<table class="table table-responsive table-striped table-hover table-bordered">
                        <thead class="bg-trans-gradient text-white">
                            <tr>
                                <td>Vendedor</td>
                                <td>Venta</td>
                                <td>Pedidos</td>
                                <td>Promedio</td>
                            </tr>
                        </thead>
                        <tbody>`;
        let tblFoot = `</tbody></table>`;

        axios.post('/ventas/rptrankingvendedoressucursalmes', {
            anio:anio,
            mes:mes,
            sucursal: GlobalCodSucursal
        })
        .then((response) => {
            const data = response.data.recordset;
            let total =0;
            data.map((rows)=>{
                    total = total + Number(rows.TOTALPRECIO);
                    let promedio = Number(rows.TOTALPRECIO) / Number(rows.PEDIDOS);
                    strdata = strdata + `
                    <tr>
                        <td>${rows.NOMVEN}</td>
                        <td>${funciones.setMoneda(rows.TOTALPRECIO,'Q')}</td>
                        <td>${rows.PEDIDOS}</td>
                        <td>${funciones.setMoneda(promedio,'Q')}</td>
                    </tr>
                    `
            })
            container.innerHTML = tblHead + strdata + tblFoot;
            lbTotal.innerText = funciones.setMoneda(total,'Q ');
        }, (error) => {
            funciones.AvisoError('Error en la solicitud');
            lbTotal.innerText = 'Q 0.00'
            strdata = '';
            container.innerHTML = '';
        });
    },
    gerenteMarcas: async(fecha,idContenedor,idLbTotal)=>{

        let container = document.getElementById(idContenedor);
        container.innerHTML = GlobalLoader;
        
        let lbTotal = document.getElementById(idLbTotal);
        lbTotal.innerText = '---';

        let strdata = '';
        let tbl = `<table class="table table-responsive table-striped table-hover table-bordered">
                        <thead class="bg-trans-gradient text-white">
                        <tr>
                            <td>Marca</td>
                            <td>Costo</td>
                            <td>Precio</td>
                            <td>Utilidad</td>
                            <td>Margen</td>
                        </tr>
                        </thead>
                        <tbody>`;

        let tblfoot = `</tbody></table>`;

        axios.post('/ventas/reportemarcasfecha', {
            sucursal: GlobalCodSucursal,
            fecha:fecha
        })
        .then((response) => {
            const data = response.data.recordset;
            let total =0;
            data.map((rows)=>{
                let utilidad = 0; let margen = 0;
                utilidad = Number(rows.TOTALPRECIO) - Number(rows.TOTALCOSTO);
                margen = (Number(utilidad) / Number(rows.TOTALCOSTO))*100;
                total = total + Number(rows.TOTALPRECIO);
                strdata = strdata + `<tr>
                                        <td>
                                            ${rows.DESMARCA}
                                        </td>
                                        <td>
                                            ${funciones.setMoneda(rows.TOTALCOSTO,'Q')}
                                        </td>
                                        <td>
                                            ${funciones.setMoneda(rows.TOTALPRECIO,'Q')}
                                        </td>
                                        <td>
                                            ${funciones.setMoneda(utilidad,'Q')}
                                        </td>
                                        <td>
                                            ${funciones.setMargen(margen,' %')}
                                        </td>
                                    </tr>`
            })
            container.innerHTML = tbl + strdata + tblfoot;
            lbTotal.innerText = funciones.setMoneda(total,'Q ');
        }, (error) => {
            funciones.AvisoError('Error en la solicitud');
            strdata = '';
            container.innerHTML = '';
            lbTotal.innerText = 'Q 0.00';
        });
           
    },
    gerenteMarcasMes: async(anio,mes,idContenedor,idLbTotal)=>{

        let container = document.getElementById(idContenedor);
        container.innerHTML = GlobalLoader;
        
        let lbTotal = document.getElementById(idLbTotal);
        lbTotal.innerText = '---';

        let strdata = '';
        let tbl = `<table class="table table-responsive table-striped table-hover table-bordered">
                        <thead class="bg-trans-gradient text-white">
                            <tr>
                                <td>Marca</td>
                                <td>Costo</td>
                                <td>Precio</td>
                                <td>Utilidad</td>
                                <td>Margen</td>
                            </tr>
                        </thead>
                        <tbody>`;

        let tblfoot = `</tbody></table>`;

        axios.post('/ventas/reportemarcasmes', {
            sucursal: GlobalCodSucursal,
            anio:anio,
            mes:mes   
        })
        .then((response) => {
            const data = response.data.recordset;
            let total =0;
            data.map((rows)=>{
                    let utilidad = 0; let margen = 0;
                    utilidad = Number(rows.TOTALPRECIO) - Number(rows.TOTALCOSTO);
                    margen = (Number(utilidad) / Number(rows.TOTALCOSTO))*100;
                    total = total + Number(rows.TOTALPRECIO);
                    strdata = strdata + `<tr>
                                            <td>
                                                ${rows.DESMARCA}
                                            </td>
                                            <td>
                                                ${funciones.setMoneda(rows.TOTALCOSTO,'Q')}
                                            </td>
                                            <td>
                                                ${funciones.setMoneda(rows.TOTALPRECIO,'Q')}
                                            </td>
                                            <td>
                                                ${funciones.setMoneda(utilidad,'Q')}
                                            </td>
                                            <td>
                                                ${funciones.setMargen(margen,' %')}
                                            </td>
                                        </tr>`
            })
            container.innerHTML = tbl + strdata + tblfoot;
            lbTotal.innerText = funciones.setMoneda(total,'Q ');
        }, (error) => {
            funciones.AvisoError('Error en la solicitud');
            strdata = '';
            container.innerHTML = '';
            lbTotal.innerText = 'Q 0.00';
        });
           
    },
    gerenteStatusGpsVentas: async(idContenedor,tipoempleado)=>{

        let container = document.getElementById(idContenedor);
        container.innerHTML = GlobalLoader;
        
    
        let tbl = `<div class="mapcontainer2" id="mapcontainer"></div>`;        
        
        container.innerHTML = tbl;
        
        let mapcargado = 0;

        axios.post('/empleados/statusempleado', {
            sucursal: GlobalCodSucursal,
            tipoempleado:tipoempleado
        })
        .then((response) => {
            const data = response.data.recordset;
            data.map((rows)=>{
                    if(mapcargado==0){
                        map = Lmap(rows.LAT, rows.LONG, rows.VENDEDOR, rows.TELEFONO,rows.HORAMIN);
                        mapcargado = 1;
                    }else{
                        L.marker([rows.LAT, rows.LONG])
                        .addTo(map)
                        .bindPopup(`${rows.VENDEDOR} - <br>Tel:${rows.TELEFONO} - Updated:${rows.HORAMIN} hrs`, {closeOnClick: false, autoClose: false})
                        .openPopup()   
                    }
            })
          
        }, (error) => {
            funciones.AvisoError('Error en la solicitud');
            container.innerHTML = '';
        });
    },
    supervisorRankingVendedores: (fecha,idContenedor, idLbTotal)=>{
        
        let container = document.getElementById(idContenedor);
        container.innerHTML = GlobalLoader;

        let lbTotal = document.getElementById(idLbTotal);
        lbTotal.innerText = '---';
            
        let strdata = '';
        let tblHead = `<table class="table table-responsive table-striped table-hover table-bordered">
                        <thead class="bg-trans-gradient text-white">
                            <tr>
                                <td>Vendedor</td>
                                <td>Venta</td>
                                <td>Pedidos</td>
                                <td>Promedio</td>
                            </tr>
                        </thead>
                        <tbody>`;
        let tblFoot = `</tbody></table>`;

        axios.post('/ventas/rptrankingvendedoressucursal2', {
            fecha:fecha,
            sucursal: GlobalCodSucursal
        })
        .then((response) => {
            const data = response.data.recordset;
            let total =0;
            data.map((rows)=>{
                    total = total + Number(rows.TOTALPRECIO);
                    let promedio = Number(rows.TOTALPRECIO) / Number(rows.PEDIDOS);
                    strdata = strdata + `
                    <tr>
                        <td>${rows.NOMVEN}</td>
                        <td>${funciones.setMoneda(rows.TOTALPRECIO,'Q')}</td>
                        <td>${rows.PEDIDOS}</td>
                        <td>${funciones.setMoneda(promedio,'Q')}</td>
                    </tr>
                    `
            })
            container.innerHTML = tblHead + strdata + tblFoot;
            lbTotal.innerText = funciones.setMoneda(total,'Q ');
        }, (error) => {
            funciones.AvisoError('Error en la solicitud');
            lbTotal.innerText = 'Q 0.00'
            strdata = '';
            container.innerHTML = '';
        });
    },
    supervisorRankingVendedoresMes: (anio,mes,idContenedor, idLbTotal)=>{
        
        let container = document.getElementById(idContenedor);
        container.innerHTML = GlobalLoader;

        let lbTotal = document.getElementById(idLbTotal);
        lbTotal.innerText = '---';
            
        let strdata = '';
        let tblHead = `<table class="table table-responsive table-striped table-hover table-bordered">
                        <thead class="bg-trans-gradient text-white">
                            <tr>
                                <td>Vendedor</td>
                                <td>Venta</td>
                                <td>Pedidos</td>
                                <td>Promedio</td>
                            </tr>
                        </thead>
                        <tbody>`;
        let tblFoot = `</tbody></table>`;

        axios.post('/ventas/rptrankingvendedoressucursalmes', {
            anio:anio,
            mes:mes,
            sucursal: GlobalCodSucursal
        })
        .then((response) => {
            const data = response.data.recordset;
            let total =0;
            data.map((rows)=>{
                    total = total + Number(rows.TOTALPRECIO);
                    let promedio = Number(rows.TOTALPRECIO) / Number(rows.PEDIDOS);
                    strdata = strdata + `
                    <tr>
                        <td>${rows.NOMVEN}</td>
                        <td>${funciones.setMoneda(rows.TOTALPRECIO,'Q')}</td>
                        <td>${rows.PEDIDOS}</td>
                        <td>${funciones.setMoneda(promedio,'Q')}</td>
                    </tr>
                    `
            })
            container.innerHTML = tblHead + strdata + tblFoot;
            lbTotal.innerText = funciones.setMoneda(total,'Q ');
        }, (error) => {
            funciones.AvisoError('Error en la solicitud');
            lbTotal.innerText = 'Q 0.00'
            strdata = '';
            container.innerHTML = '';
        });
    },
    supervisorMarcas: async(fecha,idContenedor,idLbTotal)=>{

        let container = document.getElementById(idContenedor);
        container.innerHTML = GlobalLoader;
        
        let lbTotal = document.getElementById(idLbTotal);
        lbTotal.innerText = '---';

        let strdata = '';
        let tbl = `<table class="table table-responsive table-striped table-hover table-bordered">
                        <thead class="bg-trans-gradient text-white">
                        <tr>
                            <td>Marca</td>
                            <td>Importe</td>
                        </tr>
                        </thead>
                        <tbody>`;

        let tblfoot = `</tbody></table>`;

        axios.post('/ventas/reportemarcasfecha', {
            sucursal: GlobalCodSucursal,
            fecha:fecha
        })
        .then((response) => {
            const data = response.data.recordset;
            let total =0;
            data.map((rows)=>{
                    total = total + Number(rows.TOTALPRECIO);
                    strdata = strdata + `<tr>
                                            <td>${rows.DESMARCA}</td>
                                            <td>${funciones.setMoneda(rows.TOTALPRECIO,'Q')}</td>
                                        </tr>`
            })
            container.innerHTML = tbl + strdata + tblfoot;
            lbTotal.innerText = funciones.setMoneda(total,'Q ');
        }, (error) => {
            funciones.AvisoError('Error en la solicitud');
            strdata = '';
            container.innerHTML = '';
            lbTotal.innerText = 'Q 0.00';
        });
           
    },
    supervisorMarcasMes: async(anio,mes,idContenedor,idLbTotal)=>{

        let container = document.getElementById(idContenedor);
        container.innerHTML = GlobalLoader;
        
        let lbTotal = document.getElementById(idLbTotal);
        lbTotal.innerText = '---';

        let strdata = '';
        let tbl = `<table class="table table-responsive table-striped table-hover table-bordered">
                        <thead class="bg-trans-gradient text-white">
                            <tr>
                                <td>Marca</td>
                                <td>Importe</td>
                            </tr>
                        </thead>
                        <tbody>`;

        let tblfoot = `</tbody></table>`;

        axios.post('/ventas/reportemarcasmes', {
            sucursal: GlobalCodSucursal,
            anio:anio,
            mes:mes   
        })
        .then((response) => {
            const data = response.data.recordset;
            let total =0;
            data.map((rows)=>{
                    total = total + Number(rows.TOTALPRECIO);
                    strdata = strdata + `<tr>
                                            <td>
                                                ${rows.DESMARCA}
                                            </td>
                                            <td>
                                                ${funciones.setMoneda(rows.TOTALPRECIO,'Q')}
                                            </td>
                                        </tr>`
            })
            container.innerHTML = tbl + strdata + tblfoot;
            lbTotal.innerText = funciones.setMoneda(total,'Q ');
        }, (error) => {
            funciones.AvisoError('Error en la solicitud');
            strdata = '';
            container.innerHTML = '';
            lbTotal.innerText = 'Q 0.00';
        });
           
    },
    supervisorStatusGpsVentas: async(idContenedor)=>{

        let container = document.getElementById(idContenedor);
        container.innerHTML = GlobalLoader;
        
    
        let tbl = `<div class="mapcontainer2" id="mapcontainer"></div>`;        
        
        container.innerHTML = tbl;
        
        let mapcargado = 0;

        axios.post('/empleados/statusempleado', {
            sucursal: GlobalCodSucursal,
            tipoempleado:'VENDEDOR'
        })
        .then((response) => {
            const data = response.data.recordset;
            data.map((rows)=>{
                    if(mapcargado==0){
                        map = Lmap(rows.LAT, rows.LONG, rows.VENDEDOR, rows.TELEFONO,rows.HORAMIN);
                        mapcargado = 1;
                    }else{
                        L.marker([rows.LAT, rows.LONG])
                        .addTo(map)
                        .bindPopup(`${rows.VENDEDOR} - Tel:${rows.TELEFONO} - Updated:${rows.HORAMIN}`, {closeOnClick: false, autoClose: false})
                        .openPopup()   
                    }
            })
          
        }, (error) => {
            funciones.AvisoError('Error en la solicitud');
            container.innerHTML = '';
        });
    },
    productosSetStatus: (codprod,st)=>{
        return new Promise((resolve,reject)=>{
            axios.put('/productos/status',{codprod:codprod,status:st})
            .then((response) => {
                console.log(response);
               resolve();             
            }, (error) => {
                reject();
            });


        })
        
    },
    productosEditDetalle : (data)=>{
        return new Promise((resolve,reject)=>{
            axios.put('/productos/detalles',data)
            .then((response) => {
                console.log(response);
               resolve();             
            }, (error) => {
                reject();
            });


        })
    },
    productosGetDetalle: (codprod,idDesprod,idUxc,idMarca,idClaseUno,idClaseDos,idClaseTres)=>{
        axios.post('/productos/detalles',{codprod:codprod})
        .then((response) => {
            const data = response.data.recordset;
            data.map((rows)=>{
                document.getElementById(idDesprod).value = rows.DESPROD;
                document.getElementById(idUxc).value = rows.EQUIVALEINV;
                document.getElementById(idMarca).value = rows.CODMARCA;
                document.getElementById(idClaseUno).value = rows.CODCLAUNO;
                document.getElementById(idClaseDos).value = rows.CODCLADOS;
                document.getElementById(idClaseTres).value = rows.CODCLATRES;
            })
                        
        }, (error) => {
            funciones.AvisoError('Error en la solicitud');
        });
    },
    productosComboMarcas: (idContainer)=>{
        let container = document.getElementById(idContainer);
        let strdata = '';
        axios.post('/productos/marcas')
        .then((response) => {
            const data = response.data.recordset;
            data.map((rows)=>{
                    strdata = strdata + `
                    <option value="${rows.CODMARCA}">${rows.DESMARCA}</option>
                    `
            })
            container.innerHTML = strdata;
            
        }, (error) => {
            funciones.AvisoError('Error en la solicitud');
            strdata = '';
            container.innerHTML = '';
        });
    },
    productosComboClaseUno: (idContainer)=>{
        let container = document.getElementById(idContainer);
        let strdata = '';
        axios.post('/productos/claseuno')
        .then((response) => {
            const data = response.data.recordset;
            data.map((rows)=>{
                    strdata = strdata + `
                    <option value="${rows.COD}">${rows.DES}</option>
                    `
            })
            container.innerHTML =  strdata;
            
        }, (error) => {
            funciones.AvisoError('Error en la solicitud');
            strdata = '';
            container.innerHTML = '';
        });
    },
    productosComboClaseDos: (idContainer)=>{
        let container = document.getElementById(idContainer);
        let strdata = '';
        axios.post('/productos/clasedos')
        .then((response) => {
            const data = response.data.recordset;
            data.map((rows)=>{
                    strdata = strdata + `
                    <option value="${rows.COD}">${rows.DES}</option>
                    `
            })
            container.innerHTML =  strdata;
            
        }, (error) => {
            funciones.AvisoError('Error en la solicitud');
            strdata = '';
            container.innerHTML = '';
        });
    },
    productosComboClaseTres: (idContainer)=>{
        let container = document.getElementById(idContainer);
        let strdata = '';
        axios.post('/productos/clasetres')
        .then((response) => {
            const data = response.data.recordset;
            data.map((rows)=>{
                    strdata = strdata + `
                    <option value="${rows.COD}">${rows.DES}</option>
                    `
            })
            container.innerHTML = strdata;
            
        }, (error) => {
            funciones.AvisoError('Error en la solicitud');
            strdata = '';
            container.innerHTML = strdata;
        });
    },
    productosGetPrecios: (codprod,idContainer)=>{
        let container = document.getElementById(idContainer);
        container.innerHTML = GlobalLoader;
        let str = '';

        axios.post('/productos/preciosproducto',{codprod:codprod})
        .then((response) => {
            const data = response.data.recordset;
            data.map((rows)=>{
                str = str + `
                    <tr>
                        <td>${rows.CODMEDIDA}</td>
                        <td>${rows.EQUIVALE}</td>
                        <td>${rows.COSTO}</td>
                        <td>${rows.PPUBLICO}</td>
                        <td>${rows.PMAYOREOC}</td>
                        <td>${rows.PMAYOREOB}</td>
                        <td>${rows.PMAYOREOA}</td>
                        <td>
                            <button class="btn btn-warning btn-circle" 
                            onclick="getPrecioEditar('${rows.CODPROD}','${rows.CODMEDIDA}',${rows.COSTO},${rows.EQUIVALE},${rows.PPUBLICO},${rows.PMAYOREOC},${rows.PMAYOREOB},${rows.PMAYOREOA});">
                                <i class="fa fa-check"></i>
                            </button>
                        </td>
                    </tr>
                `
            })
            container.innerHTML = str;  
        }, (error) => {
            funciones.AvisoError('Error en la solicitud');
            container.innerHTML = '';
        });
    },
    productosSetPrecio: (codprod,codmedida,costo,equivale,ppublico,pmayoreoc,pmayoreob,pmayoreoa)=>{
        return new Promise((resolve,reject)=>{
            axios.put('/productos/precio',{
                codprod:codprod,
                codmedida:codmedida,
                costo:costo,
                equivale:equivale,
                ppublico:ppublico,
                pmayoreoc: pmayoreoc,
                pmayoreob:pmayoreob,
                pmayoreoa:pmayoreoa
            })
            .then((response) => {
                
               resolve();             
            }, (error) => {
                reject();
            });


        })
        
    },
    digitadorPedidosVendedor: async(sucursal,codven,idContenedor,idLbTotal,st)=>{

        let container = document.getElementById(idContenedor);
        container.innerHTML = GlobalLoader;
        
        let lbTotal = document.getElementById(idLbTotal);
        lbTotal.innerText = '---';
        
        let strdata = '';
        let totalpedidos = 0;
        let strApicall= '';

        switch (st) {
            case "O":
                strApicall = '/digitacion/pedidospendientes';
                break;
            case "A":
                strApicall = '/digitacion/pedidosbloqueados';
                break;
        
            default:
                break;
        }
        axios.post(strApicall, {
            app:GlobalSistema,
            sucursal: sucursal,
            codven:codven
        })
        .then((response) => {
            const data = response.data.recordset;
            let total =0;
            let strClassStatus = '';
            let strClassRowSt = '';
            data.map((rows)=>{
                    if(rows.ST=='A'){strClassStatus='bg-danger text-white'}else{strClassStatus='bg-info text-white'}
                    if(rows.ST=='A'){strClassRowSt='bg-danger text-white'}else{strClassRowSt=''}
                    total = total + Number(rows.IMPORTE);
                    totalpedidos = totalpedidos + 1;
                    let f = rows.FECHA.toString().replace('T00:00:00.000Z','');
                    strdata = strdata + `
                            <tr>
                                <td>${f}</td>
                                <td>
                                    ${rows.CODDOC + '-' + rows.CORRELATIVO}
                                    <br>
                                    <small class="${strClassStatus}">Status:${rows.ST}</small>
                                </td>
                                <td class="${strClassRowSt}">${rows.NOMCLIE}
                                    <br>
                                    <small>${rows.DIRCLIE + ',' + rows.DESMUNI}</small>
                                    <br>
                                    <small class="text-white bg-secondary">${rows.OBS}</small>
                                </td>
                                <td>
                                    ${funciones.setMoneda(rows.IMPORTE,'Q')}
                                </td>
                                
                                <td>
                                    <button class="btn btn-info btn-sm btn-circle" onclick="getDetallePedido('${f}','${rows.CODDOC}','${rows.CORRELATIVO}','${rows.ST}')">
                                        +
                                    </button>
                                </td>
                            </tr>`
            })
            container.innerHTML = strdata;
            lbTotal.innerText = `${funciones.setMoneda(total,'Q ')} - Peds:${totalpedidos} - Prom:${funciones.setMoneda((Number(total)/Number(totalpedidos)),'Q')}`;
        }, (error) => {
            funciones.AvisoError('Error en la solicitud');
            strdata = '';
            container.innerHTML = '';
            lbTotal.innerText = 'Q 0.00';
        });
           
    },
    digitadorDetallePedido: async(fecha,coddoc,correlativo,idContenedor,idLbTotal)=>{

        let container = document.getElementById(idContenedor);
        container.innerHTML = GlobalLoader;
        
        let lbTotal = document.getElementById(idLbTotal);
        lbTotal.innerText = '---';
        
        let strdata = '';

        GlobalSelectedCoddoc = coddoc;
        GlobalSelectedCorrelativo = correlativo;

        axios.post('/digitacion/detallepedido', {
            sucursal: GlobalCodSucursal,
            fecha:fecha,
            coddoc:coddoc,
            correlativo:correlativo
        })
        .then((response) => {
            const data = response.data.recordset;
            let total =0;
            data.map((rows)=>{
                    total = total + Number(rows.IMPORTE);
                    strdata = strdata + `
                            <tr id='${rows.DOC_ITEM}'>
                                <td colspan="3">${rows.DESPROD}
                                    <br>
                                    <small class="text-danger">${rows.CODPROD}</small>
                                    <br>
                                    <b class="text-info">${rows.CODMEDIDA}</b>-<b>Cant: ${rows.CANTIDAD}</b>
                                </td>
                                <td>${funciones.setMoneda(rows.PRECIO,"")}</td>
                                <td>${funciones.setMoneda(rows.IMPORTE,"")}
                                    <div class="row">
                                        <div class="col-6">
                                            <button class="btn btn-danger btn-md btn-circle"
                                                onclick="deleteProductoPedido('${rows.DOC_ITEM}','${GlobalSelectedCoddoc}','${GlobalSelectedCorrelativo}',${rows.IMPORTE},${rows.TOTALCOSTO})">
                                                <i class="fal fa-trash"></i>
                                            </button>              
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            `
            })
            container.innerHTML = strdata;
            lbTotal.innerText = `${funciones.setMoneda(total,'Q')}`;
        }, (error) => {
            funciones.AvisoError('Error en la solicitud');
            strdata = '';
            container.innerHTML = '';
            lbTotal.innerText = 'Q0.00';
        });
           
    },
    digitadorDetallePedidoWhatsapp: async(fecha,coddoc,correlativo,numero)=>{


        
        let strEncabezado = `DISTRIBUIDORA ${GlobalEmpNombre} \n Recordatorio de Pedido \n --------------------------------- \n`;

        let strdata = '';

        let footer = '';
        let msg = '';

        GlobalSelectedCoddoc = coddoc;
        GlobalSelectedCorrelativo = correlativo;

        axios.post('/digitacion/detallepedido', {
            sucursal: GlobalCodSucursal,
            fecha:fecha,
            coddoc:coddoc,
            correlativo:correlativo
        })
        .then((response) => {
            const data = response.data.recordset;
            let total =0;
            data.map((rows)=>{
                    total = total + Number(rows.IMPORTE);
                    strdata += '* ' + rows.DESPROD + "-"  + rows.CODMEDIDA + " Cant: " + rows.CANTIDAD.toString() + " - " + funciones.setMoneda(rows.IMPORTE,'Q').toString() + "\n";
            })
            footer = `--------------------------------- \n Total a Pagar: ${funciones.setMoneda(total,'Q')}`
            msg = strEncabezado + strdata + footer;
            msg = encodeURIComponent(msg);
            window.open('https://api.whatsapp.com/send?phone='+numero+'&text='+msg);
        }, (error) => {
            funciones.AvisoError('Error en la solicitud');
            strdata = '';
        });
           
    },
    digitadorDetallePedido_BACKUP: async(fecha,coddoc,correlativo,idContenedor,idLbTotal)=>{

        let container = document.getElementById(idContenedor);
        container.innerHTML = GlobalLoader;
        
        let lbTotal = document.getElementById(idLbTotal);
        lbTotal.innerText = '---';
        
        let strdata = '';

        GlobalSelectedCoddoc = coddoc;
        GlobalSelectedCorrelativo = correlativo;

        axios.post('/digitacion/detallepedido', {
            sucursal: GlobalCodSucursal,
            fecha:fecha,
            coddoc:coddoc,
            correlativo:correlativo
        })
        .then((response) => {
            const data = response.data.recordset;
            let total =0;
            data.map((rows)=>{
                    total = total + Number(rows.IMPORTE);
                    strdata = strdata + `
                            <tr id='${rows.DOC_ITEM}'>
                                <td colspan="3">${rows.DESPROD}
                                    <br>
                                    <small class="text-danger">${rows.CODPROD}</small>
                                    <br>
                                    <b class="text-info">${rows.CODMEDIDA}</b>-<b>Cant: ${rows.CANTIDAD}</b>
                                </td>
                                <td>${rows.PRECIO}</td>
                                <td>${rows.IMPORTE}
                                    <div class="row">
                                        <div class="col-6">
                                            <button class="btn btn-danger btn-md btn-circle"
                                                onclick="deleteProductoPedido('${rows.DOC_ITEM}','${GlobalSelectedCoddoc}','${GlobalSelectedCorrelativo}',${rows.IMPORTE},${rows.TOTALCOSTO})">
                                                <i class="fal fa-trash"></i>
                                            </button>              
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            `
            })
            container.innerHTML = strdata;
            lbTotal.innerText = `${funciones.setMoneda(total,'Q')}`;
        }, (error) => {
            funciones.AvisoError('Error en la solicitud');
            strdata = '';
            container.innerHTML = '';
            lbTotal.innerText = 'Q0.00';
        });
           
    },
    digitadorPedidosTipoprecio: async(sucursal,codven,idContenedor)=>{

        let container = document.getElementById(idContenedor);
        container.innerHTML = GlobalLoader;
                
        let strdata = '';
     
        axios.post('/digitacion/pedidostipoprecio', {
            sucursal: sucursal,
            codven:codven
        })
        .then((response) => {
            const data = response.data.recordset;
            data.map((rows)=>{
                    strdata = strdata + `
                            <tr>
                                <td><b class="text-danger">${rows.CODDOC + '-' + rows.CORRELATIVO}<b>
                                    <br>
                                    <small>${rows.FECHA.toString().replace('T00:00:00.000Z','')}</small>
                                </td>
                                <td>${rows.DESPROD}
                                    <br>
                                    <small class="text-info">${rows.CODPROD}</small>
                                </td>
                                <td>${rows.CODMEDIDA}
                                    <br>
                                    TipoP:<b class="text-danger">${funciones.getTipoPrecio(rows.TIPOPRECIO.toString())}</b>
                                </td>
                                <td>${rows.CANTIDAD}</td>
                                <td>
                                    <small>${funciones.setMoneda(rows.PRECIO,'Q')}</small>    
                                </td>
                                <td>
                                    ${funciones.setMoneda(rows.TOTALPRECIO,'Q')}    
                                </td>
                            </tr>`
            })
            container.innerHTML = strdata;
            
        }, (error) => {
            funciones.AvisoError('Error en la solicitud');
            strdata = '';
            container.innerHTML = '';
        });
           
    },
    digitadorBloquearPedido: async(sucursal,codven,coddoc,correlativo)=>{
        
        return new Promise((resolve,reject)=>{
            axios.put('/digitacion/pedidobloquear',{
                sucursal:sucursal,
                coddoc:coddoc,
                correlativo:correlativo,
                codven:codven
            })
            .then((response) => {
                
               resolve();             
            }, (error) => {
                
                reject();
            });


        })
    },
    digitadorQuitarRowPedido: async(item,coddoc,correlativo,totalprecio,totalcosto)=>{
        console.log(item)
        console.log(coddoc)
        console.log(correlativo)
        console.log(totalprecio)
        console.log(totalcosto)

        return new Promise((resolve,reject)=>{
            axios.put('/digitacion/pedidoquitaritem',{
                sucursal:GlobalCodSucursal,
                coddoc:coddoc,
                correlativo:correlativo,
                item:item,
                totalprecio:totalprecio,
                totalcosto:totalcosto
            })
            .then((response) => {
                
               resolve();             
            }, (error) => {
                console.log(error);        
                reject(error);
            });


        })
    },
    digitadorConfirmarPedido: async(sucursal,codven,coddoc,correlativo,embarque)=>{
        return new Promise((resolve,reject)=>{
            axios.put('/digitacion/pedidoconfirmar',{
                sucursal:sucursal,
                coddoc:coddoc,
                correlativo:correlativo,
                codven:codven,
                embarque:embarque
            })
            .then((response) => {
                
               resolve();             
            }, (error) => {
                
                reject();
            });

        })
    },
    digitadorComboEmbarques : async(idContainer)=>{
        
        let container = document.getElementById(idContainer);
                
        let strdata = '';  //'<option value="">SELECCIONE EMBARQUE</option>';

        axios.post('/digitacion/embarquespendientes', {
            sucursal: GlobalCodSucursal
        })
        .then((response) => {
            const data = response.data.recordset;
            data.map((rows)=>{
                strdata = strdata + `
                            <option value='${rows.CODEMBARQUE}'>
                                ${rows.CODEMBARQUE}-${rows.RUTA}
                            </option>
                            `
            })
            container.innerHTML = strdata;
            
        }, (error) => {
            funciones.AvisoError('Error en la solicitud');
            container.innerHTML = '';            
        });
    },
    digitadorPicking : async(embarque,idContenedor,idLbTotal)=>{
        
        let container = document.getElementById(idContenedor);
        container.innerHTML = GlobalLoader;
        
        let lbTotal = document.getElementById(idLbTotal);
        lbTotal.innerText = '---';
        
        let strdata = '';
        let tblhead = `
                <thead class="bg-trans-gradient text-white">
                    <tr>
                        <td>Vendedor</td>
                        <td>Pedido</td>
                        <td>Cliente</td>
                        <td>Importe</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>`;

        let totalpedidos = 0;
        axios.post('/digitacion/pickingdocumentos', {
            sucursal: GlobalCodSucursal,
            embarque:embarque
        })
        .then((response) => {
            const data = response.data.recordset;
            let total =0;
            data.map((rows)=>{
                    total = total + Number(rows.TOTALPRECIO);
                    totalpedidos = totalpedidos + 1;
                    
                    strdata = strdata + `
                            <tr>
                                <td>${rows.VENDEDOR}</td>
                                <td>
                                    ${rows.CODDOC + '-' + rows.CORRELATIVO}
                                    <br>
                                    <small class="text-danger">${rows.FECHA.toString().replace('T00:00:00.000Z','')}</small>
                                </td>
                                <td>${rows.CLIENTE}</td>
                                <td>
                                    <b>${funciones.setMoneda(rows.TOTALPRECIO,'Q')}</b>
                                </td>
                                <td>
                                    <button class="btn btn-danger btn-sm btn-circle" onclick="QuitarPedidoPicking('${rows.CODDOC}','${rows.CORRELATIVO}',${rows.CODVEN})">
                                        x
                                    </button>
                                </td>
                            </tr>`
            })
            container.innerHTML = tblhead + strdata + '</tbody>';
            lbTotal.innerText = `${funciones.setMoneda(total,'Q ')} - Peds:${totalpedidos} - Prom:${funciones.setMoneda((Number(total)/Number(totalpedidos)),'Q')}`;
        }, (error) => {
            funciones.AvisoError('Error en la solicitud');
            strdata = '';
            container.innerHTML = '';
            lbTotal.innerText = 'Q 0.00';
        });
    },
    digitadorPickingProductos : async(embarque,idContenedor,idLbTotal)=>{
        
        let container = document.getElementById(idContenedor);
        container.innerHTML = GlobalLoader;
        
        let lbTotal = document.getElementById(idLbTotal);
        lbTotal.innerText = '---';
        
        let strdata = '';
        let tblhead = `
                <thead class="bg-trans-gradient text-white">
                    <tr>
                        <td>Código</td>
                        <td>Producto</td>
                        <td>uxc</td>
                        <td>Cajas</td>
                        <td>Unidades</td>
                        <td>Importe</td>
                    </tr>
                </thead>
                <tbody>`;

        let totalpedidos = 0;
        axios.post('/digitacion/pickingproductos', {
            sucursal: GlobalCodSucursal,
            embarque:embarque
        })
        .then((response) => {
            const data = response.data.recordset;
            let total =0;
            data.map((rows)=>{
                    total = total + Number(rows.TOTALPRECIO);
                    totalpedidos = totalpedidos + 1;
                    
                    strdata = strdata + `
                            <tr>
                                <td>${rows.CODPROD}</td>
                                <td>${rows.DESPROD}</td>
                                <td>${rows.UXC}</td>
                                <td>${Math.floor(rows.CAJAS)}</td>
                                <td>${ Math.floor((Number(rows.CAJAS)- Math.floor(rows.CAJAS)) * Number(rows.UXC)) }</td>
                                <td>
                                    <b class="text-danger">${funciones.setMoneda(rows.TOTALPRECIO,'Q')}</b>
                                </td>
                            </tr>`
            })
            container.innerHTML = tblhead + strdata + '</tbody>';
            lbTotal.innerText = `${funciones.setMoneda(total,'Q ')} - Items:${totalpedidos}`;
        }, (error) => {
            funciones.AvisoError('Error en la solicitud');
            strdata = '';
            container.innerHTML = '';
            lbTotal.innerText = 'Q 0.00';
        });
    },
    digitadorQuitarPedidoPicking : async (coddoc,correlativo,codven)=>{
        
                return new Promise((resolve,reject)=>{
                    axios.put('/digitacion/pedidoregresar',{
                        sucursal:GlobalCodSucursal,
                        coddoc:coddoc,
                        correlativo:correlativo,
                        codven:codven
                    })
                    .then((response) => {
                        
                        resolve();             
                    }, (error) => {
                        
                        reject();
                    });
        
                })
    },
    repartidorComboEmbarques : async(idContainer)=>{
        
            let container = document.getElementById(idContainer);
                
            let strdata = ''; //'<option value="">SELECCIONE EMBARQUE</option>';
    
            axios.post('/repartidor/embarquesrepartidor', {
                sucursal: GlobalCodSucursal,
                codrepartidor:GlobalCodUsuario
            })
            .then((response) => {
                const data = response.data.recordset;
                data.map((rows)=>{
                    strdata = strdata + `
                                <option value='${rows.CODIGO}'>
                                    ${rows.CODIGO}-${rows.RUTA}-${rows.FECHA.toString().replace('T00:00:00.000Z','')}
                                </option>
                                `
                })
                container.innerHTML = strdata;
        
            }, (error) => {
                funciones.AvisoError('Error en la solicitud');
                container.innerHTML = '';            
        
            });

        
    },
    repartidorComboEmbarquesRep : async(idContainer)=>{
        
        let container = document.getElementById(idContainer);
            
        let strdata = ''; //'<option value="">SELECCIONE EMBARQUE</option>';

        axios.post('/repartidor/embarquesrepartidor', {
            sucursal: GlobalCodSucursal,
            codrepartidor:GlobalCodUsuario
        })
        .then((response) => {
            const data = response.data.recordset;
            data.map((rows)=>{
                strdata = strdata + `
                            <option value='${rows.CODIGO}'>
                                ${rows.CODIGO}-${rows.RUTA}-${rows.FECHA.toString().replace('T00:00:00.000Z','')}
                            </option>
                            `
            })
            container.innerHTML = strdata;
            try {
                fcnCargarGrid();    
            } catch (error) {
                
            }
            
        }, (error) => {
            funciones.AvisoError('Error en la solicitud');
            container.innerHTML = '';            
        });

    
    },//Listado de facturas a entregar en el picking
    repartidorPicking : async(embarque,idContenedor,idLbTotal)=>{
        
        let container = document.getElementById(idContenedor);
        container.innerHTML = GlobalLoader;
        
        let lbTotal = document.getElementById(idLbTotal);
        lbTotal.innerText = '---';
        
        let strdata = '';
        let tblhead = `
            <table class="table table-responsive table-hover table-striped" id="tblListado">
                <thead class="bg-trans-gradient text-white">
                    <tr>
                        <td>Cliente</td>
                        <td>Importe</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>`;

        let totalpedidos = 0;
        axios.post('/repartidor/embarque', {
            sucursal: GlobalCodSucursal,
            codembarque:embarque
        })
        .then((response) => {
            const data = response.data.recordset;
            let strC ='';
            let total =0;
            data.map((rows)=>{
                    total = total + Number(rows.IMPORTE);
                    totalpedidos = totalpedidos + 1;
                    switch (rows.ST) {
                        case 'A': //ACTIVO O PENDIENTE
                            strC='';            
                            break;

                        case 'E': //ENTREGADO
                            strC='bg-success text-white';
                            break;
                        case 'P': // PARCIAL
                            strC='bg-warning';
                            break;
                        case 'R': //RECHAZADO
                            strC='bg-danger text-white';
                            break;
                        default:
                            strC='';
                            break;
                    }

                    strdata = strdata + `
                            <tr class='${strC} border-bottom'>
                                <td>${rows.CLIENTE}
                                    <br>
                                    <small>${rows.DIRECCION + ',' + rows.MUNICIPIO}</small>
                                    <br>
                                    <br>
                                    <small><b>${rows.CODDOC + '-' + rows.CORRELATIVO}</b></small>
                                    <br>
                                    <small class="">${rows.FECHA.toString().replace('T00:00:00.000Z','')}</small>
                                    <br>
                                    <br>
                                    <small>${rows.VENDEDOR}</small>
                                </td>
                                <td>
                                    <b>${funciones.setMoneda(rows.IMPORTE,'Q')}</b>
                                </td>
                                <td>
                                    <button class="btn btn-info btn-sm btn-circle" 
                                        onclick="getDetalleFactura('${rows.CODDOC}','${rows.CORRELATIVO}','${rows.CLIENTE}','${rows.CODVEN}')">
                                        <i class="fal fa-book"></i>
                                    </button>
                                </td>
                            </tr>`
            })
            container.innerHTML = tblhead + strdata + '</tbody></table>';
            lbTotal.innerText = `${funciones.setMoneda(total,'Q ')} - Peds:${totalpedidos} - Prom:${funciones.setMoneda((Number(total)/Number(totalpedidos)),'Q')}`;
        }, (error) => {
            funciones.AvisoError('Error en la solicitud');
            strdata = '';
            container.innerHTML = '';
            lbTotal.innerText = 'Q 0.00';
        });
    },
    repartidorDetallePedido: async(coddoc,correlativo,idContenedor,idLbTotal)=>{

        let container = document.getElementById(idContenedor);
        container.innerHTML = GlobalLoader;
        
        let lbTotal = document.getElementById(idLbTotal);
        lbTotal.innerText = '---';
        
        let strdata = '';

        GlobalSelectedCoddoc = coddoc;
        GlobalSelectedCorrelativo = correlativo;

        axios.post('/repartidor/detallepedido', {
            sucursal: GlobalCodSucursal,
            coddoc:coddoc,
            correlativo:correlativo
        })
        .then((response) => {
            const data = response.data.recordset;
            let total =0;
            data.map((rows)=>{
                    total = total + Number(rows.IMPORTE);
                    strdata = strdata + `
                            <tr id='${rows.DOC_ITEM}'>
                                <td>${rows.DESPROD}
                                    <br>
                                    <small class="text-danger">${rows.CODPROD}</small>
                                </td>
                                <td>${rows.CODMEDIDA}</td>
                                <td>${rows.CANTIDAD}</td>
                                <td>${rows.PRECIO}</td>
                                <td>${rows.IMPORTE}</td>
                       
                            </tr>
                            `
            })
            container.innerHTML = strdata;
            lbTotal.innerText = `${funciones.setMoneda(total,'Q')}`;
        }, (error) => {
            funciones.AvisoError('Error en la solicitud');
            strdata = '';
            container.innerHTML = '';
            lbTotal.innerText = 'Q0.00';
        });
           
    },
    repartidorMapaEmbarque: async(embarque,idContenedor,idLbTotal)=>{

        let container = document.getElementById(idContenedor);
        container.innerHTML = GlobalLoader;
        
        let lbTotal = document.getElementById(idLbTotal);
        lbTotal.innerText = '---';

        let tbl = `<div class="mapcontainer" id="mapcontainer"></div>`;        
        
        container.innerHTML = tbl;
        
        let mapcargado = 0;

        axios.post('/repartidor/mapaembarque', {
            sucursal: GlobalCodSucursal,
            embarque:embarque
        })
        .then((response) => {
            const data = response.data.recordset;
            let total =0;
            data.map((rows)=>{
                total = total + Number(rows.IMPORTE);
                    if(mapcargado==0){
                        map = Lmap(rows.LAT, rows.LONG, rows.CLIENTE, rows.IMPORTE);
                        mapcargado = 1;
                    }else{
                        L.marker([rows.LAT, rows.LONG])
                        .addTo(map)
                        .bindPopup(`<div  onclick="getDetalleFactura('${rows.CODDOC}','${rows.CORRELATIVO}','${rows.CLIENTE}','${rows.CODVEN}')">${rows.CLIENTE} - ${funciones.setMoneda(rows.IMPORTE,'Q ')}<br>
                        <small>${rows.DIRECCION},${rows.MUNICIPIO}</small><br><small>${rows.VENDEDOR}</small></div>` )   
                    }
            })
            //container.innerHTML = tbl;
            lbTotal.innerText = funciones.setMoneda(total,'Q ');
        }, (error) => {
            funciones.AvisoError('Error en la solicitud');
            container.innerHTML = '';
            lbTotal.innerText = 'Q 0.00';
        });
           
    },
    repartidorMarcarPedido: async(st,coddoc,correlativo,embarque)=>{
        return new Promise((resolve,reject)=>{
            axios.post('/repartidor/marcarpedido',{
                sucursal:GlobalCodSucursal,
                coddoc:coddoc,
                correlativo:correlativo,
                st:st,
                embarque:embarque
            })
            .then((response) => {
                
               resolve(response);             
            }, (error) => {
                
                reject(error);
            });

        })
    },
    updateClientesLastSale:(nitclie,visita)=>{
        return new Promise((resolve,reject)=>{
            updateSaleCliente(GlobalSelectedCodCliente)
            axios.post('/clientes/lastsale',{
                sucursal:GlobalCodSucursal,
                nitclie:nitclie,
                fecha:funciones.getFecha(),
                visita:visita
            })
            .then((response) => {               
                //socket.emit('clientes ultimaventa',GlobalCodSucursal, GlobalSelectedForm);
                resolve();             
            }, (error) => {
                reject();
            });
        });
    },
    updateCorrelativo:(correlativo)=>{
        return new Promise((resolve,reject)=>{
            axios.post('/ventas/updatecorrelativo',{
                sucursal:GlobalCodSucursal,
                coddoc:GlobalCoddoc,
                correlativo:correlativo
            })
            .then((response) => {   
                console.log(response)            
                resolve();             
            }, (error) => {
                reject();
            });
        });
    }
    
}
