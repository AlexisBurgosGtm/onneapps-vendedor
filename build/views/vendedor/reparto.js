function getView(){
    let view = {
        encabezado: ()=>{
            return `
            <div class="row">
                <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                    <div class="card">
                        <div class="form-group">
                            <select class="form-control" id="cmbEmbarques">
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            `
        },
        detalle: ()=>{
            return `
            <div class="row">
                <div class="card">
                    <div class="form-group">
                        <select class="form-control" id="cmbTipo">
                            <option value="pendiente">PENDIENTES</option>
                            <option value="rechazado">RECHAZADOS</option>
                            <option value="parcial">DEV PARCIAL</option>
                            <option value="entregado">ENTREGADOS</option>
                        </select>
                    </div>
                    <div class="table-responsive" id="containerRepartidor">

                    </div>
                </div>
            </div>
            `
        },
        tabsClientes :()=>{
            return `
        <div class="row">
            <div class="panel-container show">
                <div class="panel-content">
                    <ul class="nav nav-pills nav-justified" role="tablist">
                        <li class="nav-item"><a class="nav-link active" data-toggle="tab" href="#panelPendientes">Pendientes</a></li>
                        <li class="nav-item"><a class="nav-link" data-toggle="tab" href="#panelRechazados">Rechazados</a></li>
                        <li class="nav-item"><a class="nav-link" data-toggle="tab" href="#panelParciales">Parciales</a></li>
                        <li class="nav-item"><a class="nav-link" data-toggle="tab" href="#panelEntregados">Entregados</a></li>
                    </ul>
                    <div class="tab-content py-3">

                        <div class="tab-pane fade active show" id="panelPendientes" role="tabpanel">
                            <div class="table-responsive">
                                <table class="table table-responsive table-hover table-striped" id="">
                                        <thead class="bg-trans-gradient text-white">
                                            <tr>
                                                <td>Pedido</td>
                                                <td>Cliente</td>
                                                <td>Importe</td>
                                                <td></td>
                                            </tr>
                                        </thead>
                                    <tbody id="tblPendientes">

                                    </tbody>
                                </table>
                            </div>
                        </div>
                        
                        <div class="tab-pane fade" id="panelRechazados" role="tabpanel">
                            <div class="table-responsive">
                                <table class="table table-responsive table-hover table-striped" id="">
                                    <thead class="bg-trans-gradient text-white">
                                        <tr>
                                            <td>Pedido</td>
                                            <td>Cliente</td>
                                            <td>Importe</td>
                                            <td></td>
                                        </tr>
                                    </thead>                                    
                                    <tbody id="tblRechazados">

                                    </tbody>
                                </table>
                            </div>

                        </div>

                        <div class="tab-pane fade" id="panelParciales" role="tabpanel">
                            
                            <div class="table-responsive">
                                <table class="table table-responsive table-hover table-striped" id="">
                                    <thead class="bg-trans-gradient text-white">
                                        <tr>
                                            <td>Pedido</td>
                                            <td>Cliente</td>
                                            <td>Importe</td>
                                            <td></td>
                                        </tr>
                                    </thead>
                                    <tbody id="tblParciales">

                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div class="tab-pane fade" id="panelEntregados" role="tabpanel">
                            
                            <div class="table-responsive">
                                <table class="table table-responsive table-hover table-striped" id="">
                                    <thead class="bg-trans-gradient text-white">
                                        <tr>
                                            <td>Pedido</td>
                                            <td>Cliente</td>
                                            <td>Importe</td>
                                            <td></td>
                                        </tr>
                                    </thead>
                                    <tbody id="tblEntregados">

                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        </div>
            `
        },
        modalDetallePedido : ()=>{
            return `    
        <div class="card">
            <br>
            <br>
            <div class="table-responsive">
                <table class="table table-responsive table-hover table-striped table-bordered">
                    <thead class="bg-trans-gradient text-white">
                        <tr>
                            <td>Producto</td>
                            <td>Cant</td>
                            <td>Subtotal</td>
                        </tr>
                    </thead>
                    <tbody id="tblDetallePedido"></tbody>
                    
                </table>
            </div>
            <br>
            <div class="">
                <div class="col-1"></div>
                <div class="col-5">
                    <label>Total Pedido : </label>
                    <h2 class="text-danger" id="lbTotalDetallePedido"></h2>
                </div>
                
            </div>
        </div>
            `
        }
    };

    root.innerHTML = view.encabezado() + view.tabsClientes();
    rootMenuLateral.innerHTML = view.modalDetallePedido();
    
}

async function addListeners(){
    
    let cmbEmbarques = document.getElementById('cmbEmbarques');
    cmbEmbarques.addEventListener('change',async ()=>{
        GlobalSelectedCodEmbarque = cmbEmbarques.value;
        await api.vendedorRepartoPicking(cmbEmbarques.value,'tblPendientes','tblParciales','tblRechazados','tblEntregados')
    })

    await api.vendedorEmbarques('cmbEmbarques');

    /* 
    let cmbTipo = document.getElementById('cmbTipo');
    cmbTipo.addEventListener('change',()=>{
        getTipoLista(cmbTipo.value);
    })
    getTipoLista(cmbTipo.value);
    */
};


function iniciarVistaVendedorReparto(){
    
    getView();
    addListeners();

};


function getDetalleFactura(coddoc,correlativo,cliente){
    GlobalSelectedCoddoc = coddoc;
    GlobalSelectedCorrelativo = correlativo;

    api.vendedorDetallePedido(coddoc,correlativo,'tblDetallePedido','lbTotalDetallePedido')
    showMenuLateral('CLIENTE: ' + cliente);

};

function getTipoLista(tipo){
    //pendiente,entregado,parcial,rechazado
    switch (tipo) {
        
        case 'pendiente':
            console.log(tipo)    
            var divsToHide = document.getElementsByClassName(tipo); //divsToHide is an array
            for(var i = 0; i < divsToHide.length; i++){
                //divsToHide[i].style.visibility = "hidden"; // or
                divsToHide[i].style.visibility = "visible"; // depending on what you're doing
            }
            var divsToHide = document.getElementsByClassName('entregado parcial rechazado'); //divsToHide is an array
            for(var i = 0; i < divsToHide.length; i++){
                divsToHide[i].style.visibility = "hidden"; // or
              //divsToHide[i].style.display = "none"; // depending on what you're doing
            }        
            break;
        case 'entregado':
            console.log(tipo)
            var divsToHide = document.getElementsByClassName(tipo); //divsToHide is an array
            for(var i = 0; i < divsToHide.length; i++){
                //divsToHide[i].style.visibility = "hidden"; // or
                divsToHide[i].style.visibility = "visible"; // depending on what you're doing
            }
            var divsToHide = document.getElementsByClassName('pendiente parcial rechazado'); //divsToHide is an array
            for(var i = 0; i < divsToHide.length; i++){
                divsToHide[i].style.visibility = "hidden"; // or
                //divsToHide[i].style.display = "none"; // depending on what you're doing
            }        
            break;
        case 'parcial':
            console.log(tipo)
            var divsToHide = document.getElementsByClassName(tipo); //divsToHide is an array
            for(var i = 0; i < divsToHide.length; i++){
                //divsToHide[i].style.visibility = "hidden"; // or
                divsToHide[i].style.visibility = "visible"; // depending on what you're doing
            }
            var divsToHide = document.getElementsByClassName('pendiente entregado rechazado'); //divsToHide is an array
            for(var i = 0; i < divsToHide.length; i++){
                divsToHide[i].style.visibility = "hidden"; // or
                //divsToHide[i].style.display = "none"; // depending on what you're doing
            }        
            break;
        case 'rechazado':
            console.log(tipo)
            var divsToHide = document.getElementsByClassName(tipo); //divsToHide is an array
            for(var i = 0; i < divsToHide.length; i++){
                //divsToHide[i].style.visibility = "hidden"; // or
                divsToHide[i].style.visibility = "visible"; // depending on what you're doing
            }
            var divsToHide = document.getElementsByClassName('pendiente entregado parcial'); //divsToHide is an array
            for(var i = 0; i < divsToHide.length; i++){
                divsToHide[i].style.visibility = "hidden"; // or
                //divsToHide[i].style.display = "none"; // depending on what you're doing
            }        
            break;
    }
    
    

}

function getTipoLista2(tipo){
    let tableReg = document.getElementById('tblListadoPedidos')
    



    console.log('tabla.. tabla .. tabla.. ')
   for (var i = 1; i < tableReg.rows.length; i++)
        {
                  if(tableReg[i].className == tipo)
                  {
                        tableReg.rows[i].style.display = '';
                  } else {
                      // si no ha encontrado ninguna coincidencia, esconde la
                      // fila de la tabla
                      tableReg.rows[i].style.display = 'none';
                  }
        }

   // document.getElementsByClassName(tipo).style.display = '';

}