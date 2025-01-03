let btnListaP = document.getElementById('btnListaP');
btnListaP.addEventListener('click',()=>{
    $('#modalListaPrecios').modal('show');
})

let txtBProducto = document.getElementById('txtBProducto');
txtBProducto.addEventListener('keydown',(e)=>{
    if(e.code=='Enter'){
        fcnBusquedaProducto2('txtBProducto','tblPre');
        //$('#modalListaPrecios').modal('show');
    }
    if(e.code=='NumpadEnter'){
        fcnBusquedaProducto2('txtBProducto','tblPre');
        //$('#modalListaPrecios').modal('show');
    }
});

let btnBProducto = document.getElementById('btnBProducto');
btnBProducto.addEventListener('click',()=>{
    fcnBusquedaProducto2('txtBProducto','tblPre');
    //$('#modalListaPrecios').modal('show');
})


function fcnBusquedaProducto2(idFiltro,idTablaResultado){
    
    let filtro = document.getElementById(idFiltro).value;
    
    if(filtro==''){
        funciones.showToast('Escriba una descripción para buscar');
        //$('#modalListaPrecios').modal('hide');
        return;
    };

    let tabla = document.getElementById(idTablaResultado);
    tabla.innerHTML = GlobalLoader;


    let str = ""; 

    selectProducto(filtro)
    .then((response) => {
        const data = response;
        //con esta variable determino el tipo de precio a usar            
        let pre = 0;
            
            data.map((rows)=>{
                let exist = Number(rows.EXISTENCIA)/Number(rows.EQUIVALE); let strC = '';
                if(Number(rows.EXISTENCIA<=0)){strC='bg-danger text-white'}else{strC='bg-success text-white'};
                let totalexento = 0;
                if (rows.EXENTO==1){totalexento=Number(rows.PRECIO)}
                pre = Number(rows.PRECIO)
                
                str += `<tr id="${rows.CODPROD}"  class="border-bottom">
                <td >
                    ${funciones.quitarCaracteres(rows.DESPROD,'"'," pulg",true)}
                    <br>
                    <small class="text-danger"><b>${rows.CODPROD}</b></small><small class="text-info">//Escala:${rows.DESPROD3}</small>
                    <br>
                    <b class"bg-danger text-white">${rows.CODMEDIDA}</b>
                    <small>(${rows.EQUIVALE})</small>
                </td>
                <td>${funciones.setMoneda(pre || 0,'Q ')}
                    <br>
                    <small class="${strC}">Inv:${funciones.setMoneda(exist,'')}</small>
                </td>
                
            </tr>`
            })
            tabla.innerHTML= str;
        
    }, (error) => {
        console.log(error);
    })
    .catch((error)=>{
        tabla.innerHTML = '<h3>No hay datos para mostrar, intente descargar su catálogo de productos nuevamente</h3>';
        funciones.AvisoError(error);
    })

};
