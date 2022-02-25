function getView(){

    let str = ` 
                <div class="card">
                    <input type="text" class="form-control border-info shadow" id="txtQry">
                    <br>
                    <button class="btn btn-danger btn-md" id="btnQry">Run</button>
                </div>
                <div class="row">
                    <button class="btn btn-success" id="btnContactos" onclick="funciones.readContacts('rootQry')">
                        Contactos
                    </button>
                </div>
                <div class="card">
                    <div class="table-responsive">
                        <table class="table table-responsive table-hover table-striped">
                            <thead class="bg-trans-gradient text-white">
                                <tr>
                                    <td>Vendedor</td>
                                    <td>Coddoc</td>
                                    <td>Correlativo</td>
                                    <td></td>
                                </tr>
                            </thead>
                            <tbody id="tblTipodocumento">
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="card">
                    <div id="rootQry"></div>
                </div>`;

    let strModalCorrelativo = `
                    <div class="modal fade" id="modalCorrelativo" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div class="modal-dialog modal-md" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <label class="modal-title h3" id="">Nuevo correlativo</label>
                                </div>
        
                                <div class="modal-body">
                                    <div class="col-6">
                                        <div class="form-group">
                                            <input type="text" class="form-control" id="txtCoddoc">
                                        </div>
                                        <div class="form-group">
                                            <input type="number" class="form-control" id="txtCorrelativo">
                                        </div>
                                    </div>
                                    <button class="btn btn-outline-success btn-lg" id="btnActualizar">
                                        <i class="fal fa-save"></i>
                                        Actualizar
                                    </button>
                                    
                                </div>
                                
                            </div>
                        </div>
                    </div>
                    `

    root.innerHTML = str + strModalCorrelativo;

};


function addListener(){

    getTipodocumentos('tblTipodocumento');

    let txtQry = document.getElementById('txtQry');
    let rootQry = document.getElementById('rootQry');
    let btnQry = document.getElementById('btnQry');
    btnQry.addEventListener('click',()=>{
        funciones.Confirmacion('¿Está a punto de ejecutar una consulta sql')
        .then((value)=>{
            if(value==true){
                api.runqry(txtQry.value,'2410201415082017')
                .then((response)=>{
                    let str = 'filas afectadas: ' + response.rowsAffected[0].toString();
                    funciones.Aviso(str);
                    rootQry.innerHTML = str + '<br><br>' + JSON.stringify(response.recordset);
                })
                .catch(()=>{
                    funciones.AvisoError('Error')
                })
            }
        })
        

    });

    let btnActualizar = document.getElementById('btnActualizar');
    btnActualizar.addEventListener('click',()=>{
        funciones.Confirmacion('¿Actualizar el correlativo?')
        .then((value)=>{

            if(value==true){
                let d = document.getElementById('txtCoddoc').value;
                let n = document.getElementById('txtCorrelativo').value;
              updateCorrelativo(d,n)
              .then(()=>{
                    funciones.Aviso('Correlativo actualizado exitosamente !!');
                    $('#modalCorrelativo').modal('hide');            
                    getTipodocumentos('tblTipodocumento');
              })  
              .catch(()=>{
                funciones.AvisoError('No se pudo actualizar el correlativo')  
                })  
            }
        })
    })
};

function InicializarVista(){
    getView();
    addListener();
};

function getTipodocumentos(idContainer){
    
    let container = document.getElementById(idContainer);
    container.innerHTML = GlobalLoader;

    let strdata = ''; 

    axios.post('/tipodocumentos/documentosvendedores', {
        sucursal: GlobalCodSucursal
    })
    .then((response) => {
        const data = response.data.recordset;
        data.map((rows)=>{
            strdata = strdata + `
                        <tr>
                            <td>${rows.NOMBRE}</td>
                            <td>${rows.CODDOC}</td>
                            <td>${rows.CORRELATIVO}</td>
                            <td>
                                <button class="btn btn-md btn-info btn-circle shadow" onclick="getModalCorrelativo('${rows.CODDOC}',${rows.CORRELATIVO})">
                                    <i class="fal fa-edit"></i>
                                </button>
                            </td>
                        </tr>
                        `
        })
        container.innerHTML = strdata;

    }, (error) => {
        funciones.AvisoError('Error en la solicitud');
        container.innerHTML = '';            

    });
};



function getModalCorrelativo(coddoc,correlativo){
    document.getElementById('txtCoddoc').value = coddoc;
    document.getElementById('txtCorrelativo').value = correlativo;

    $('#modalCorrelativo').modal('show');

};

function updateCorrelativo(coddoc,correlativo){
    
    return new Promise((resolve,reject)=>{
        axios.post('/tipodocumentos/updatecorrelativo',{
            sucursal:GlobalCodSucursal,
            coddoc:coddoc,
            correlativo:correlativo
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
    });

};
