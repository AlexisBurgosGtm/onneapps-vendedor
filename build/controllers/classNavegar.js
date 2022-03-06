let classNavegar = {
    login : async(historial)=>{
        divUsuario.innerText = 'DESCONECTADO';
        lbTipo.innerText = "Inicie sesión";
        rootMenu.innerHTML = '';
        GlobalCoddoc = '';
        GlobalCodUsuario=99999;
        GlobalUsuario = '';
        GlobalPassUsuario = '';
        GlobalTipoUsuario ='';
            funciones.loadScript('../views/login/index.js','root')
            .then(()=>{
                GlobalSelectedForm='LOGIN';
                InicializarVista();
                rootMenuFooter.innerHTML = '<b class="text-white">Onne Business</b>';
                if(historial=='SI'){

                }else{
                    window.history.pushState({"page":0}, "login", GlobalUrl + '/login')
                }
                
            })
        
            
    },
    inicio : async(tipousuario)=>{
        divUsuario.innerText = GlobalUsuario;
        lbTipo.innerText = GlobalTipoUsuario;

        switch (tipousuario) {
            case 'VENDEDOR':
                classNavegar.inicioVendedor();
                break;
            default:
                funciones.AvisoError('Esta aplicación es solo para VENTAS');
                break;
        };
    },
    inicioProgramador: ()=>{
        funciones.loadScript('../views/programador.js','root')
        .then(async()=>{
            GlobalSelectedForm='DEVELOPER';
            InicializarVista();
        })
    },
    inicioVendedor : async ()=>{
        let strFooter =    `
                            <button class="btn btn-sm "  id="btnMenu2VendedorClientes">
                                <i class="fal fa-shopping-cart"></i>
                                Clientes
                            </button>
                            <button class="btn btn-sm " id="btnMenu2VendedorPedidos">
                                <i class="fal fa-chart-line"></i>
                                Logro
                            </button>
                            <button class="btn btn-sm " id="btnMenu2VendedorLogro">
                                <i class="fal fa-chart-pie"></i>
                                Estadística
                            </button>
                            <button class="btn btn-sm "  id="btnMenu2VendedorSync">
                                <i class="fal fa-sync"></i>
                                Sincronizar
                            </button>
        `
        let strMenu =   ``
                    rootMenu.innerHTML = strMenu;
                    //rootMenuFooter.innerHTML = strFooter;
           
                     // handlers del menu
                   
                    let btnMenu2VendedorClientes = document.getElementById('btnMenu2VendedorClientes');
                    btnMenu2VendedorClientes.addEventListener('click',()=>{
                        classNavegar.inicioVendedorListado();
                    });

                 
                    /*
                    let btnMenuVendedorReparto = document.getElementById('btnMenuVendedorReparto');
                    btnMenuVendedorReparto.addEventListener('click',()=>{
                        classNavegar.vendedorReparto();
                    });
                    let btnMenuVendedorCenso = document.getElementById('btnMenuVendedorCenso');
                    btnMenuVendedorCenso.addEventListener('click',()=>{
                        classNavegar.vendedorCenso();
                    });
                    */

              
                    let btnMenu2VendedorPedidos = document.getElementById('btnMenu2VendedorPedidos');
                    btnMenu2VendedorPedidos.addEventListener('click',()=>{
                        classNavegar.pedidos();
                    });

                    let btnMenu2VendedorLogro = document.getElementById('btnMenu2VendedorLogro');
                    btnMenu2VendedorLogro.addEventListener('click',()=>{
                        classNavegar.logrovendedor();
                    });

              
                    let btnMenu2VendedorSync = document.getElementById('btnMenu2VendedorSync');
                    btnMenu2VendedorSync.addEventListener('click',()=>{
                        $('#modalSync').modal('show');
                    });
                    //actualiza la ubicación del empleado
                    await classEmpleados.updateMyLocation();

                    //classNavegar.ventasMapaClientes();
                    classNavegar.inicioVendedorListado();

                    btnMenuVendedor.style = 'visibility:visible';

             
    },
    inicioVendedorListado :async ()=>{
        funciones.loadScript('../views/vendedor/vendedor.js','root')
        .then(async()=>{
            GlobalSelectedForm='INICIO';
            InicializarVista();
            window.history.pushState({"page":1}, "clientes", '/clientes');
        })
    },
    inicioGerente: ()=>{
                let strMenu =  `
                            <a class="dropdown-item" data-toggle="dropdown" id="btnMenuGerenteSucursales">
                                <span>Dashboard Sucursales</span>
                            </a>
                            <a class="dropdown-item" data-toggle="dropdown" id="btnMenuGerenteInicio">
                                <span>Dashboard App</span>
                            </a>
                            <a class="dropdown-item" data-toggle="dropdown" id="btnMenuGerenteTracking">
                                <span>Tracking de Personal</span>
                            </a>
                            <a class="dropdown-item" data-toggle="dropdown" id="btnMenuGerenteVendedores">
                                <span>Vendedores</span>
                            </a>
                            <a class="dropdown-item" data-toggle="dropdown" id="btnMenuGerenteProductos">
                                <span>Productos</span>
                            </a>
                            
                            <a class="dropdown-item hidden" data-toggle="dropdown" id="btnMenuGerenteUsuarios">
                                <span>Usuarios</span>
                            </a>
                            <a class="dropdown-item hidden" data-toggle="dropdown" id="btnMenuGerenteNoticias">
                                <span>Noticias</span>
                            </a>
                            `
                    rootMenu.innerHTML = strMenu;
                       
                     // handlers del menu
                     let btnMenuGerenteSucursales = document.getElementById('btnMenuGerenteSucursales');
                     btnMenuGerenteSucursales.addEventListener('click',()=>{
                        classNavegar.gerenteInicioSucursales();
                    });
                    let btnMenuGerenteInicio = document.getElementById('btnMenuGerenteInicio');
                    btnMenuGerenteInicio.addEventListener('click',()=>{
                        classNavegar.gerenteIniciar();
                    });
                    let btnMenuGerenteTracking = document.getElementById('btnMenuGerenteTracking');
                    btnMenuGerenteTracking.addEventListener('click',()=>{
                       classNavegar.gerenteTracking(); 
                    });
                    let btnMenuGerenteVendedores = document.getElementById('btnMenuGerenteVendedores');
                    btnMenuGerenteVendedores.addEventListener('click',()=>{
                        classNavegar.gerenteVendedores();
                    });
                    let btnMenuGerenteProductos = document.getElementById('btnMenuGerenteProductos');
                    btnMenuGerenteProductos.addEventListener('click',()=>{
                       classNavegar.gerenteProducto(); 
                    });
                    let btnMenuGerenteUsuarios = document.getElementById('btnMenuGerenteUsuarios');
                    btnMenuGerenteUsuarios.addEventListener('click',()=>{
                        
                    });
                    
                    let btnMenuGerenteNoticias = document.getElementById('btnMenuGerenteNoticias');
                    btnMenuGerenteNoticias.addEventListener('click',()=>{
                        
                    });

                    //classNavegar.gerenteIniciar(); 
                    classNavegar.gerenteInicioSucursales();
        
    },
    inicioDigitador : ()=>{
        console.log('inicio digitador');
          let strMenu =   `
                            <a class="dropdown-item" data-toggle="dropdown" id="btnMenuDigitadorPendientes">
                                <span>PEDIDOS PENDIENTES</span>
                            </a>
                            <a class="dropdown-item" data-toggle="dropdown" id="btnMenuDigitadorEmbarques">
                                <span>EMBARQUES/PICKING</span>
                            </a>
                            <a class="dropdown-item" data-toggle="dropdown" id="btnMenuDigitadorUsuarios">
                                <span>GESTION DE USUARIOS</span>
                            </a>
                            <a class="dropdown-item" data-toggle="dropdown" id="btnMenuDigitadorClientes">
                                <span>GESTION DE CLIENTES</span>
                            </a>
                            <a class="dropdown-item" data-toggle="dropdown" id="btnMenuDigitadorNoticias">
                                <span>NOTICIAS</span>
                            </a>
                            `
                rootMenu.innerHTML = strMenu;

                funciones.loadScript('../views/digitador/inicio.js','root')
                .then(()=>{
                    GlobalSelectedForm='DIGITACION';
                    iniciarVistaDigitador();
                    
                      // handlers del menu
                    let btnMenuDigitadorPendientes = document.getElementById('btnMenuDigitadorPendientes');
                    btnMenuDigitadorPendientes.addEventListener('click',()=>{
                        classNavegar.inicioDigitador();
                    });
                    
                    let btnMenuDigitadorEmbarques = document.getElementById('btnMenuDigitadorEmbarques');
                    btnMenuDigitadorEmbarques.addEventListener('click',()=>{
                        classNavegar.digitadorEmbarques();                  
                    });

                    let btnMenuDigitadorUsuarios = document.getElementById('btnMenuDigitadorUsuarios');
                    btnMenuDigitadorUsuarios.addEventListener('click',()=>{
                        classNavegar.gerenteUsuarios('VENDEDOR');
                    });

                    let btnMenuDigitadorClientes = document.getElementById('btnMenuDigitadorClientes');
                    btnMenuDigitadorClientes.addEventListener('click',()=>{
                        classNavegar.supervisorClientes();
                    });

                    let btnMenuDigitadorNoticias = document.getElementById('btnMenuDigitadorNoticias');
                    btnMenuDigitadorNoticias.addEventListener('click',()=>{
                        classNavegar.noticias();
                    });
                })            
    },
    inicioRepartidor : async()=>{
        let strMenu =  `
                            <a class="dropdown-item" data-toggle="dropdown" id="btnMenuGerenteInicio">
                                <span>Pickings</span>
                            </a>
                            
                            <a class="dropdown-item hidden" data-toggle="dropdown" id="btnMenuGerenteNoticias">
                                <span>Noticias</span>
                            </a>
                            `
                    rootMenu.innerHTML = strMenu;
                       
                     // handlers del menu
                    let btnMenuGerenteInicio = document.getElementById('btnMenuGerenteInicio');
                    btnMenuGerenteInicio.addEventListener('click',()=>{
                        classNavegar.inicioGerente();
                    });
                    
                    
                    let btnMenuGerenteNoticias = document.getElementById('btnMenuGerenteNoticias');
                    btnMenuGerenteNoticias.addEventListener('click',()=>{
                        

                    });

                    //actualiza la ubicación del empleado
                    await classEmpleados.updateMyLocation();

                    classNavegar.repartidorIniciar();

    },
    inicioSupervisor : async()=>{
        let strMenu =  `
                            <a class="dropdown-item" data-toggle="dropdown" id="btnMenuSupervisorDashboard">
                                <span>Dashboard</span>
                            </a>
                            <a class="dropdown-item" data-toggle="dropdown" id="btnMenuSupervisorVendedores">
                                <span>Vendedores</span>
                            </a>
                            <a class="dropdown-item" data-toggle="dropdown" id="btnMenuSupervisorClientes">
                                <span>Censo Clientes</span>
                            </a>
                            <a class="dropdown-item" data-toggle="dropdown" id="btnMenuSupervisorPrecios">
                                <span>Precios</span>
                            </a>
                            <a class="dropdown-item" data-toggle="dropdown" id="btnMenuSupervisorNoticias">
                                <span>Noticias</span>
                            </a>
                            `
                    rootMenu.innerHTML = strMenu;

                     // handlers del menu
                     let btnMenuSupervisorDashboard = document.getElementById('btnMenuSupervisorDashboard');
                     btnMenuSupervisorDashboard.addEventListener('click',()=>{
                         classNavegar.supervisorDashboard();
                     });

                     let btnMenuSupervisorVendedores = document.getElementById('btnMenuSupervisorVendedores');
                     btnMenuSupervisorVendedores.addEventListener('click',()=>{
                         classNavegar.supervisorVendedores();
                     });
                     let btnMenuSupervisorClientes = document.getElementById('btnMenuSupervisorClientes');
                     btnMenuSupervisorClientes.addEventListener('click',()=>{
                         classNavegar.supervisorClientes();
                     });
                     
                     let btnMenuSupervisorPrecios = document.getElementById('btnMenuSupervisorPrecios');
                     btnMenuSupervisorPrecios.addEventListener('click',()=>{
                        classNavegar.supervisorPrecios(); 
                     });
                     
                     let btnMenuSupervisorNoticias = document.getElementById('btnMenuSupervisorNoticias');
                     btnMenuSupervisorNoticias.addEventListener('click',()=>{
                        classNavegar.noticias();     
                     });

                     //actualiza la ubicación del empleado
                    await classEmpleados.updateMyLocation();
                    //carga el inicio del supervisor
                    classNavegar.supervisorDashboard();
    },
    supervisorDashboard:()=>{
        funciones.loadScript('../views/supervisor/dashboard.js','root')
        .then(()=>{
            GlobalSelectedForm='SUPERVISORDASHBOARD';
            InicializarVistaSupervisorDashboard();
        });          
    },
    supervisorVendedores:()=>{
        funciones.loadScript('../views/supervisor/vendedores.js','root')
        .then(()=>{
            GlobalSelectedForm='SUPERVISORVENDEDOR';
            InicializarVistaSupervisorVendedores();
        });          
    },
    supervisorPrecios: ()=>{
        funciones.loadScript('../views/supervisor/precios.js','root')
        .then(()=>{
            GlobalSelectedForm='SUPERVISORPRECIOS';
            inicializarVistaPrecios();
        })
    },
    supervisorClientes: ()=>{
        funciones.loadScript('../views/supervisor/censo.js','root')
        .then(()=>{
            GlobalSelectedForm='SUPERVISORCENSO';
            inicializarVistaCensoSupervisor();
        })
    },
    repartidorIniciar:()=>{
        funciones.loadScript('../views/repartidor/inicio.js','root')
        .then(()=>{
            GlobalSelectedForm='REPARTIDORINICIO';
            iniciarVistaRepartidor();
        });            
    },
    ventas: async(nit,nombre,direccion)=>{
        
            funciones.loadScript('./views/vendedor/facturacion.js','root')
            .then(()=>{
                GlobalSelectedForm ='VENTAS';
                iniciarVistaVentas(nit,nombre,direccion);
                window.history.pushState({"page":2}, "facturacion", GlobalUrl + '/facturacion')
            })
          
    },
    vendedorCenso: async()=>{
        
        funciones.loadScript('./views/vendedor/censo.js','root')
        .then(()=>{
            GlobalSelectedForm ='VENDEDORCENSO';
            iniciarVistaVendedorCenso();
        })
      
    },
    ventasMapaClientes: async(historial)=>{
        funciones.loadScript('./views/vendedor/mapaclientes.js','root')
        .then(()=>{
            GlobalSelectedForm ='VENDEDORMAPACLIENTES';
            iniciarVistaVendedorMapaClientes();
            if(historial=='SI'){

            }else{
            window.history.pushState({"page":3}, "mapaclientes", GlobalUrl + '/mapaclientes')
            }
        })
    },
    vendedorReparto: async()=>{
        
        funciones.loadScript('./views/vendedor/reparto.js','root')
        .then(()=>{
            GlobalSelectedForm ='VENDEDORREPARTO';
            iniciarVistaVendedorReparto();
        })
      
    },
    pedidos: async (historial)=>{
        funciones.loadScript('../views/pedidos/vendedor.js','root')
        .then(()=>{
            GlobalSelectedForm='PEDIDOS';
            inicializarVistaPedidos();
            if(historial=='SI'){

            }else{
            window.history.pushState({"page":4}, "logro", GlobalUrl + '/logro')
            }
        })             
    },
    logrovendedor: (historial)=>{
        funciones.loadScript('../views/pedidos/vendedorlogro.js','root')
            .then(()=>{
                GlobalSelectedForm='LOGROVENDEDOR';
                inicializarVistaLogro();
                if(historial=='SI'){

                }else{
                window.history.pushState({"page":5}, "logromes", GlobalUrl + '/logromes')
                }
        })
    },
    despacho: async()=>{
        funciones.loadView('../views/despacho/index.html','root')
        .then(()=>{
            funciones.loadScript('./views/despacho/controller.js','root')
            .then(()=>{
                GlobalSelectedForm ='DESPACHO';
                controllerdespacho.iniciarVistaDespacho();

            })
        })
    },
    noticias: ()=>{
        funciones.loadScript('../views/noticias/index.js','root')
        .then(()=>{
            GlobalSelectedForm='NOTICIAS';
            inicializarVistaNoticias();
        })
    },
    gerenteInicioSucursales: ()=>{
        funciones.loadScript('../views/gerente/iniciosucursales.js','root')
        .then(()=>{
            GlobalSelectedForm='DASHBOARD';
            InicializarVistaGerenteSucursales();
        });
    },
    gerenteIniciar: ()=>{
        funciones.loadScript('../views/gerente/inicioapp.js','root')
        .then(()=>{
            GlobalSelectedForm='GERENTE';
            InicializarVistaGerente();
        });
    },
    gerenteTracking: ()=>{
        funciones.loadScript('../views/gerente/tracking.js','root')
        .then(()=>{
            GlobalSelectedForm='GERENTETRACKING';
            InicializarVistaGerenteTracking();
        })
    },
    gerenteVendedores: ()=>{
        funciones.loadScript('../views/gerente/vendedores.js','root')
        .then(()=>{
            GlobalSelectedForm='GERENTEVENDEDORES';
            InicializarVistaGerenteVendedores();
        })
    },
    gerenteProducto: ()=>{
        funciones.loadScript('../views/gerente/productos.js','root')
        .then(()=>{
            GlobalSelectedForm='GERENTEPRODUCTOS';
            inicializarVistaGerenteProductos();
        })
    },
    digitadorEmbarques : ()=>{
        funciones.loadScript('../views/digitador/embarques.js','root')
        .then(()=>{
            GlobalSelectedForm='DIGITADOREMBARQUES';
            iniciarVistaEmbarques();
        })
    },
    gerenteUsuarios:(tipo)=>{
        funciones.loadScript('../views/usuarios/inicio.js','root')
        .then(()=>{
            GlobalSelectedForm='USUARIOS';
            inicializarVistaUsuarios(tipo);
        })          
    }
}