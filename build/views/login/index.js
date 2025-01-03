function getView(){
    let view = {
        login : ()=>{
            return `
        <div class="row">
     
            <div class="col-md-4 col-sm-12 col-lg-4 col-lx-4">
                
            </div>

            <div class="col-md-4 col-sm-12 col-lg-4 col-lx-4">
   
                <div class="card shadow p-2 border-top-rounded border-bottom-rounded">

                    <div class="card-header text-center bg-white">
                        <img src="./favicon.png" width=60 height=60>
                    </div>
                    <div class="card-body">
                            <div class="form-group">
                                
                                <div class="input-group">
                                    <label></label>
                                    <div class="input-group-prepend">
                                        <span class="input-group-text">
                                            <i class="fal fa-globe"></i>
                                        </span>
                                    </div>
                                    <input class="form-control border-secondary border-top-0 border-right-0 border-left-0" type="text" id="txtToken" placeholder="Escriba su token..." required="true">
                                    <div class="input-group-append">
                                        <button class="btn btn-info hand" id="btnGetToken">
                                            <i class="fal fa-arrow-right"></i>
                                        </button>
                                    </div>
                                </div>
                                
                            </div>
                        <form class="" id="frmLogin" autocomplete="off">
                            <div class="form-group">
                                <select class="negrita form-control border-secondary border-top-0 border-right-0 border-left-0" id="cmbSucursal">
                                    
                                </select>
                                
                            </div>
                            <div class="form-group">
                                
                                <div class="input-group">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text">
                                            <i class="fal fa-user"></i>
                                        </span>
                                    </div>
                                    <input class="form-control border-secondary border-top-0 border-right-0 border-left-0" type="text" id="txtUser" placeholder="Escriba su usuario" required="true">
                                </div>
                                
                            </div>
                            <div class="form-group">
                                <div class="input-group">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text">
                                            <i class="fal fa-lock"></i>
                                        </span>
                                    </div>
                                    <input class="form-control border-secondary border-top-0 border-right-0 border-left-0" type="password" id="txtPass" placeholder="Escriba su contraseña" required="true">
                                </div>
                                        
                            </div>
                            <br>
                            <div class="form-group" align="center">
                                <button class="btn btn-secondary btn-lg shadow col-12 btn-rounded"  type="submit" id="btnIniciar">
                                    <i class="fal fa-unlock"></i>
                                    Ingresar
                                </button>
                            </div>
                            <div class="form-group" align="right">
                                <small class=""></small>
                                <br>
                                <small>
                                    <a href="https://apigen.whatsapp.com/send?phone=50257255092&text=Ayudame%20con%20la%20app%20de%20Mercados%20Efectivos...%20">
                                        por Alexis Burgos
                                    </a>
                                </small>
                            </div>
                        </form>
                    </div>

                
    

                </div>
            </div>

            <div class="col-md-4 col-sm-12 col-lg-4 col-lx-4"></div>

            
     
            `
        }
    };

    root.innerHTML = view.login();
};



function addListeners(){
    
    let frmLogin = document.getElementById('frmLogin');
    frmLogin.style = 'visibility:hidden';

    let btnGetToken = document.getElementById('btnGetToken');
    btnGetToken.addEventListener('click',()=>{
        
        btnGetToken.disabled = true;
        btnGetToken.innerHTML = '<i class="fal fa-arrow-right fa-spin"></i>';

        frmLogin.style = 'visibility:hidden';

        let token = document.getElementById('txtToken').value || 'SN';
        if(token=='SN'){
            funciones.AvisoError('Escriba el token de su empresa');
            btnGetToken.disabled = false;
            btnGetToken.innerHTML = '<i class="fal fa-arrow-right"></i>';

            return;
        };

        getEmpresasToken(token)
        .then((data)=>{
            console.log(data);
            let str = '';
            data.recordset.map((rows)=>{
                str += `<option value='${rows.CODSUCURSAL}'>${rows.NOMBRE}</option>`;
            });
            document.getElementById('cmbSucursal').innerHTML = str; 
            frmLogin.style = "visibility:visible"; 
            btnGetToken.disabled = false;
            btnGetToken.innerHTML = '<i class="fal fa-arrow-right"></i>';

        })
        .catch(()=>{
            funciones.AvisoError('Token inválido o error al cargar empresas');
            frmLogin.style = 'visibility:hidden';
            btnGetToken.disabled = false;
            btnGetToken.innerHTML = '<i class="fal fa-arrow-right"></i>';

        })
    });

    
    let btnIniciar = document.getElementById('btnIniciar');
    frmLogin.addEventListener('submit',(e)=>{
        e.preventDefault();

        almacenarCredenciales();

        btnIniciar.innerHTML = '<i class="fal fa-unlock fa-spin"></i>';
        btnIniciar.disabled = true;
        apigen.empleadosLogin(frmLogin.cmbSucursal.value,frmLogin.txtUser.value,frmLogin.txtPass.value)
        .then(()=>{
            //obtiene la fecha de la última actualización de productos
            selectDateDownload();
            //document.body.requestFullscreen();
            //por lo visto se deshabilitan las scroll bars en fullscreen
        })
        .catch(()=>{
            btnIniciar.disabled = false;
            btnIniciar.innerHTML = '<i class="fal fa-unlock"></i>Ingresar'
        });
    });


    
    //carga las sucursales directamente desde código
    //document.getElementById('cmbSucursal').innerHTML = funciones.getComboSucursales();

};


function InicializarVista(){
   getView();
   addListeners();

   //getCredenciales();
  
};


function getEmpresasToken(token){

    return new Promise((resolve,reject)=>{
        axios.post('/usuarios/empresas', {
            token:token
        })
        .then((response) => {
            
            const data = response.data;
            if(Number(data.rowsAffected[0])>0){
                resolve(data);             
            }else{
                reject();
            }
          
        }, (error) => {
            //funciones.AvisoError('Error en la solicitud');
            reject();
        });
    })

};


async function almacenarCredenciales(){
    const cred = new PasswordCredential({
        id: document.getElementById('txtUser').value,
        name: document.getElementById('cmbSucursal').value,
        password: document.getElementById('txtPass').value,
        token: document.getElementById('txtToken').value
    })

    await navigator.credentials.store(cred)

};

function getCredenciales(){
   if ('credentials' in navigator) {
        navigator.credentials.get({password: true})
        .then(function(creds) {
            //Do something with the credentials.
            document.getElementById('txtUser').value = creds.id;
            document.getElementById('cmbSucursal').value = creds.name;
            document.getElementById('txtPass').value = creds.password;
        });
    } else {
    //Handle sign-in the way you did before.
    };
};