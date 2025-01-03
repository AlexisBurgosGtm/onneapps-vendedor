function getView(){
    let view = {
        encabezado : ()=>{
            return `
                    <div class="card border-top-rounded">
                        <div class="card-header bg-white">
                            <h4 class="negrita" id="lbTotalDia">Seleccione Dia</h4>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-sm-12 col-md-3 col-lg-3 col-xl-3">   
                                    <select class="negrita form-control border-secondary border-top-0 border-right-0 border-left-0" id="cmbDiaVisita"></select>                                          
                                </div>
                            </div> 
                        </div>

                    </div>
            `
        },
        listaclientes: ()=>{
            return `
                    <div class="card">
                        <div class="card-header">
                            <h5>Lista de Clientes</h5>
                        </div>
                        <div class="card-body">
                            <div class="table-responsive">
                                <table class="table table-responsive table-striped table-hover table-bordered" id="tblLista">
                                    <thead class="bg-trans-gradient text-white">
                                        <tr>
                                            <td>Nombre/Código</td>
                                            <td>Dirección</td>
                                            <td>
                                                <i class="fal fa-shopping-car"></i>
                                            </td>
                                            <td>
                                                
                                            </td>
                                        </tr>
                                    </thead>
                                    <tbody id="tblClientes">

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
            `
        },
        tabsClientes :()=>{
            return `
            <div class="panel-container show">
                <div class="panel-content bg-white">
                    <ul class="nav nav-pills nav-justified" role="tablist">
                        <li class="nav-item"><a class="nav-link nav-link-custom active" data-toggle="tab" href="#panelNoVisitados">No Visit</a></li>
                        <li class="nav-item"><a class="nav-link nav-link-custom " data-toggle="tab" href="#panelVisitados">Visitados</a></li>
                        <li class="nav-item"><a class="nav-link nav-link-custom " data-toggle="tab" href="#panelAjenos">Ajenos</a></li>
                    </ul>
                    <div class="tab-content py-3">

                        <div class="tab-pane fade active show" id="panelNoVisitados" role="tabpanel">
                            <div class="table-responsive">
                                
                                <input type="text" id="txtFiltrarCliente" class="form-control border-secondary border-top-0 border-right-0 border-left-0" placeholder="Buscar en la lista...">

                                <table class="table table-responsive table-hover table-bordered col-12 p-0" id="tblLista">
                                    <thead class="bg-secondary text-white">
                                        <tr>
                                            <td class="negrita">Cliente <small class="text-secondary">---------</small>Dirección</td>
                                          
                                        </tr>
                                    </thead>
                                    <tbody id="tblClientes">

                                    </tbody>
                                </table>
                            </div>
                        </div>
                        
                        <div class="tab-pane fade" id="panelVisitados" role="tabpanel">
                            <div class="table-responsive">
                                <table class="table table-responsive table-striped table-hover table-bordered" id="tblLista">
                                    <thead class="bg-warning">
                                        <tr>
                                            <td class="negrita">Cliente / Dirección</td>
                                        </tr>
                                    </thead>
                                    <tbody id="tblClientesVisitados">

                                    </tbody>
                                </table>
                            </div>

                        </div>

                        <div class="tab-pane fade" id="panelAjenos" role="tabpanel">
                            
                            <div class="form-group">
                                <div class="input-group">               
                                    <input type="text" class="form-control border-secondary border-top-0 border-right-0 border-left-0" id="txtClientesAjenosBuscar" placeholder="Escriba para buscar cliente...">    
                                    <div class="input-group-append">
                                        <button class="btn btn-md btn-icon btn-round" id="btnClientesAjenosBuscar">
                                            <i class="fal fa-search"></i>
                                        </button>    
                                    </div>
                                </div>                            
                            </div>

                            <div class="table-responsive">
                                <table class="table table-responsive table-striped table-hover table-bordered" id="">
                                    <thead class="bg-trans-gradient text-white">
                                        <tr>
                                            <td class="negrita">Cliente / Dirección</td>
                                        </tr>
                                    </thead>
                                    <tbody id="tblClientesAjenos">

                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            `
        },
        modalMenuCliente: ()=>{
            return `<div class="card">
                        <div class="card-header bg-trans-gradient text-white text-center">
                            <label id="lbNombreCliente"></label>
                        </div>
                        
                        <div class="card-body">
                            <div class="form-group">
                                <div class="row">
                                    <div class="col-2">
                                        <label>Código:<label>    
                                    </div>
                                    <div class="col-3">
                                        <input type="text" id="txtCodClie" class="form-control">    
                                    </div>
                                    <div class="col-3">
                                        <input type="text" id="txtNitClie" class="form-control">
                                    </div>
                                </div>      
                            </div>
                            <div class="form-group">
                                <div class="row">
                                    <div class="col-2">
                                        <label>Dirección:<label>
                                    </div>
                                    <div class="col-9">
                                        <input type="text" id="txtDirClie" class="form-control">
                                    </div>
                                </div>                                
                            </div>
                            <div class="form-group">
                                <div class="row">
                                    <div class="col-2">
                                        <label>Teléfono:<label>    
                                    </div>
                                    <div class="col-9">
                                        <input type="text" id="txtTelClie" class="form-control">
                                    </div>
                                </div>                               
                            </div>

                        </div>    
                        
                    </div>

                    <div class="col-10" align="right"> 
                        <div class="row">
                            <button class="btn btn-lg btn-danger btn-round col-12" id="btnCerrarModalCliente">
                                <i class="fal fa-times"></i>
                                CANCELAR
                            </button>
                        </div> 
                        
                        <br>
                        <div class="row">
                            <button class="btn btn-lg btn-warning btn-rounded col-12" id="btnTiendaCerrada">
                                <i class="fal fa-credit-card-front"></i>
                                TIENDA CERRADA
                            </button>
                        </div>
                        <br>
                        <div class="row">
                            <button class="btn btn-lg btn-secondary col-12" id="btnNoDinero">
                                <i class="fal fa-credit-card-front"></i>
                                NO DINERO
                            </button>
                        </div>
                        <br>
                        
                        <div class="row">
                            <button class="btn btn-lg btn-success col-12" id="btnVenderCliente">
                                <i class="fal fa-tag"></i>
                                VENDER
                            </button>
                        </div>          

                    </div>
                            `
        },
        modalHistorialCliente: ()=>{
            return `
            <div class="modal fade" id="ModalHistorialCliente" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg modal-dialog-right" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <label class="modal-title text-danger h3" id="">Historial de Compras del Cliente</label>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true"><i class="fal fa-times"></i></span>
                            </button>
                        </div>

                        <div class="modal-body">
                            <div class="table-reponsive">
                                <table class="table table-responsive table-hover table-striped table-bordered">
                                    <thead>
                                        <td>Fecha</td>
                                        <td>Producto</td>
                                        <td>Importe</td>
                                    </thead>
                                    <tbody id="tblHistorial"></tbody>
                                </table>
                            </div>
                        </div>

                    
                    </div>
                </div>
            </div>
            `
        },
        modalPedidosPendientes: ()=>{
            return `
            <div class="modal fade" id="ModalPendientes" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg modal-dialog-right" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <label class="modal-title text-info h3" id="">Pedidos Pendientes de Enviar</label>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true"><i class="fal fa-times"></i></span>
                            </button>
                        </div>

                        <div class="modal-body">
                            <div class="table-reponsive">
                                <table class="table table-responsive table-hover table-striped table-bordered shadow">
                                    <thead class="bg-info text-white">
                                        <td>Fecha</td>
                                        <td>Cliente</td>
                                        <td>Importe</td>
                                        <td></td>
                                    </thead>
                                    <tbody id="tblPedidosPendientes"></tbody>
                                </table>
                            </div>
                        </div>

                    
                    </div>
                </div>
            </div>
            `
        }
    }

    root.innerHTML = view.encabezado() + view.tabsClientes() + view.modalHistorialCliente(); //+ view.modalPedidosPendientes(); // view.listaclientes();
    rootMenuLateral.innerHTML = view.modalMenuCliente();
};

function Lmap(lat,long,nombre,telefono){
    //INICIALIZACION DEL MAPA
                     
          var osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          osmAttrib = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          osm = L.tileLayer(osmUrl, {center: [lat, long],maxZoom: 20, attribution: osmAttrib});    
          map = L.map('mapcontainer').setView([lat, long], 18).addLayer(osm);

          L.marker([lat, long])
            .addTo(map)
            .bindPopup(nombre + ' - ' + telefono)

          return map;
};

function getMenuCliente(codigo,nombre,direccion,telefono,lat,long,nit){
    
    
    //map.remove()
    //map = Lmap(lat,long,nombre,telefono);

    document.getElementById('lbNombreCliente').innerHTML = nombre;
    document.getElementById('txtCodClie').value = codigo;
    document.getElementById('txtNitClie').value = nit;
    document.getElementById('txtDirClie').value = direccion;
    document.getElementById('txtTelClie').value = telefono;
    
    GlobalSelectedCodCliente = codigo;
    GlobalSelectedNomCliente = nombre;
    GlobalSelectedDirCliente = direccion;
    
    showMenuLateral('Opciones del Cliente');

};

async function getHistorialCliente(codigo,nit,nombre){
    
    await apigen.vendedorHistorialCliente(codigo,'tblHistorial');

    $('#ModalHistorialCliente').modal('show')

};


async function setRecordatorioVisita(codigo, nit, nombre, direccion){
    
    await funciones.hablar(`¿Quieres establecer el recordatorio de visita a ${nombre}`);
    
    let recordatorio = 'Retomar visita';

    funciones.Confirmacion(`¿Quieres establecer el recordatorio de visita a ${nombre}`)
    .then((value)=>{
        if (value==true){

            apigen.clientesSetReminder(codigo,nit,nombre,direccion,recordatorio,0,0,funciones.getFecha())
            .then(()=>{
                funciones.Aviso('Recordatorio establecido exitosamente');
            })
            .catch(()=>{
                funciones.AvisoError('No se pudo establecer el recordatorio');
            })
            //funciones.setReminder(`Visitar a ${nombre}, ubicado en ${direccion}`, 60);
            
        }
    })
    
};

async function addListeners(){

    //handler del dia de la semana
    let cmbDiaVisita = document.getElementById('cmbDiaVisita');
    cmbDiaVisita.innerHTML = funciones.ComboSemana("LETRAS");
       
    cmbDiaVisita.addEventListener('change',async()=>{
        await apigen.clientesVendedor(GlobalCodSucursal,GlobalCodUsuario,cmbDiaVisita.value,'tblClientes','tblClientesVisitados')
    })
    
    let f = new Date();
    cmbDiaVisita.value = funciones.getDiaSemana(f.getDay());

    
    let btnCerrarModalCliente = document.getElementById('btnCerrarModalCliente');
    btnCerrarModalCliente.addEventListener('click',()=>{
        hideMenuLateral()
    });

    let btnTiendaCerrada = document.getElementById('btnTiendaCerrada');
    btnTiendaCerrada.addEventListener('click',()=>{
        funciones.Confirmacion('Se marcará este cliente como CERRADA. ¿Está seguro?')
        .then((value)=>{
            if(value==true){
                apigen.updateClientesLastSale(GlobalSelectedCodCliente,'CERRADO')
                .then(async()=>{
                    funciones.Aviso('TIENDA CERRADA');
                    await apigen.clientesVendedor(GlobalCodSucursal,GlobalCodUsuario,cmbDiaVisita.value,'tblClientes','tblClientesVisitados')
                })
                .catch(()=>{
                    funciones.AvisoError('No se marcar esta tienda. Inténtelo de nuevo')
                })
                
                hideMenuLateral();
            }
        })
        
        
    });

    let btnNoDinero = document.getElementById('btnNoDinero');
    btnNoDinero.addEventListener('click',()=>{
        funciones.Confirmacion('Se marcará este cliente como SIN DINERO. ¿Está seguro?')
        .then(async(value)=>{
            if(value==true){
                apigen.updateClientesLastSale(GlobalSelectedCodCliente,'NODINERO')
                .then(async()=>{
                    funciones.Aviso('TIENDA SIN DINERO');
                    await apigen.clientesVendedor(GlobalCodSucursal,GlobalCodUsuario,cmbDiaVisita.value,'tblClientes','tblClientesVisitados')
                })
                .catch(()=>{
                    funciones.AvisoError('No se marcar esta tienda. Inténtelo de nuevo')
                })

                hideMenuLateral();
            }
        })
        
        
    });


    let btnVenderCliente = document.getElementById('btnVenderCliente');
    btnVenderCliente.addEventListener('click',()=>{
        hideMenuLateral();
        classNavegar.ventas(GlobalSelectedCodCliente,GlobalSelectedNomCliente,GlobalSelectedDirCliente);
    });

    let txtFiltrarCliente = document.getElementById('txtFiltrarCliente');
    txtFiltrarCliente.addEventListener('keyup',(e)=>{
        funciones.FiltrarTabla('tblLista','txtFiltrarCliente');
    });

    await apigen.clientesVendedor(GlobalCodSucursal,GlobalCodUsuario,cmbDiaVisita.value,'tblClientes','tblClientesVisitados')

    let btnClientesAjenosBuscar = document.getElementById('btnClientesAjenosBuscar');
    btnClientesAjenosBuscar.addEventListener('click', async ()=>{
        let txtClientesAjenosBuscar = document.getElementById('txtClientesAjenosBuscar');
        await apigen.clientesAjenosVendedor(GlobalCodSucursal,txtClientesAjenosBuscar.value,'tblClientesAjenos')
    })
    
    await apigen.vendedorTotalDia(GlobalCodSucursal,GlobalCodUsuario,funciones.getFecha(),'lbTotalDia');

    //verifica si hay pedidos pendientes
    dbCargarPedidosPendientes();

    funciones.slideAnimationTabs();
    
};

function inicializarVista(){
    getView();
    addListeners();
};

