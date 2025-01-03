let GlobalToken = '';
let GlobalEmpnit = '';
let GlobalEmpNombre = '';
let dataEmpresas = [
                        {codsucursal:"",nomsucursal:"",color:"success"}
                    ];

let root = document.getElementById('root');
let rootMenu = document.getElementById('rootMenu');
let rootMenuFooter = document.getElementById('rootMenuFooter');

let lbMenuTitulo = document.getElementById('lbMenuTitulo');
let rootMenuLateral = document.getElementById('rootMenuLateral');
const showMenuLateral =(titulo)=>{ $("#modalMenu").modal('show'); lbMenuTitulo.innerText = titulo;};
const hideMenuLateral =()=>{ $("#modalMenu").modal('hide'); lbMenuTitulo.innerText = '';};

let divUsuario = document.getElementById('divUsuario');
let lbTipo = document.getElementById('lbTipo');

divUsuario.innerText = "DESCONECTADO";
lbTipo.innerText = "Inicie sesión";

let GlobalCodSucursal = '';

let GlobalObjetivoVenta = 0;
let GlobalCodUsuario = 99999;
let GlobalUsuario = 'ONNE';
let GlobalPassUsuario = '';
let GlobalNivelUser = 0;
let GlobalTipoUsuario ='';
let GlobalSelectedDia ='';
let GlobalBool = false;

let GlobalSelectedDiaUpdated = 0;

let GlobalSelectedForm = '';

let map; //mapa de leaflet
let GlobalGpsLat = 0;
let GlobalGpsLong = 0;
let GlobalMarkerId = 0;
let GlobalSelectedId;
let GlobalSelectedCodigo;
let GlobalSelectedFecha;
let GlobalCoddoc = 'PED01';
let GlobalTotalDocumento = 0;
let GlobalTotalCostoDocumento = 0;
let GlobalCodBodega = '01';
let GlobalTipoCobro = 'TERMINAR';

let GlobalSelectedCodven = 0;



let GlobalSelectedCodCliente;
let GlobalSelectedNomCliente;
let GlobalSelectedDirCliente;

// global vars para cantidad producto
let GlobalSelectedCodprod = '';
let GlobalSelectedDesprod = '';
let GlobalSelectedCodmedida = '';
let GlobalSelectedEquivale = 0;
let GlobalSelectedCantidad = 0;
let GlobalSelectedExento = 0;
let GlobalSelectedCosto = 0;
let GlobalSelectedPrecio = 0;
let GlobalSelectedExistencia = 0;
// global vars para cantidad producto

let GlobalSelectedCodEmbarque ='';
let GlobalSelectedStatus=0;
let GlobalSelectedSt = 'O';
let GlobalSelectedCoddoc = '';
let GlobalSelectedCorrelativo = '';

let GlobalSelectedApp = '';

let GlobalSistema = 'ISC';

let GlobalVentaMinima = 1;

let GlobalLoaderMini = `<div class="spinner-border text-primary" role="status"><span class="sr-only">Loading...</span></div>`;

let GlobalLoader = `
                <div>
                    <div class="spinner-border text-primary" role="status"><span class="sr-only">Loading...</span></div>
                    <div class="spinner-grow text-info" role="status"><span class="sr-only">Loading...</span></div>
                    <div class="spinner-grow text-danger" role="status"><span class="sr-only">Loading...</span></div>
                    <div class="spinner-grow text-warning" role="status"><span class="sr-only">Loading...</span></div>
                </div>
                `

//'<div class="spinner-grow text-info" role="status"><span class="sr-only">Loading...</span></div>'


//'<div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div>';

let GlobalUrl = document.location.origin.toString();

let nowhatsapp = '50257255092';


function showWaitForm(){
    $('#modalWait').modal('show');
};


function hideWaitForm(){
    //esta linea ayuda a que las modales cierren
    if ($('.modal-backdrop').is(':visible')) {
        $('body').removeClass('modal-open'); 
        $('.modal-backdrop').remove(); 
    };

    //$('#modalWait').modal('hide');
    document.getElementById('btnCerrarModalWait').click();

};


//elimina los mensajes de console (  logger.disableLogger()  )
var logger = function()
{
    var oldConsoleLog = null;
    var pub = {};

    pub.enableLogger =  function enableLogger() 
                        {
                            if(oldConsoleLog == null)
                                return;

                            window['console']['log'] = oldConsoleLog;
                        };

    pub.disableLogger = function disableLogger()
                        {
                            oldConsoleLog = console.log;
                            window['console']['log'] = function() {};
                        };

    return pub;
}();


