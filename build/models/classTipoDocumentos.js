let classTipoDocumentos = {
    comboboxTipodoc : async(tipo,idContainer)=>{

        return new Promise((resolve, reject) => {
            let combobox = document.getElementById(idContainer);
        
            let str = ""; 
            axios.get('/tipodocumentos/tipo?empnit=' + GlobalEmpnit + '&tipo=' + tipo + '&app=' + GlobalSistema)
            .then((response) => {
                const data = response.data;        
                data.recordset.map((rows)=>{
                    str += `<option value="${rows.CODDOC}">${rows.CODDOC}</option>`
                })            
                combobox.innerHTML = str;
                resolve();
                //document.getElementById('txtCorrelativo').value = combobox.value;
            }, (error) => {
                
                str = '';
                reject();
            });
               
            }, (error) => {
                console.log(error);
                reject();
            });

       
        
    },
    fcnCorrelativoDocumento: async(tipodoc,coddoc,idContainerCorrelativo)=>{
        
        let correlativo = document.getElementById(idContainerCorrelativo);
    
        axios.get('/tipodocumentos/correlativodoc?empnit=' + GlobalEmpnit + '&tipo=' + tipodoc + '&coddoc=' + coddoc  + '&app=' + GlobalSistema)
        .then((response) => {
            const data = response.data;        
            data.recordset.map((rows)=>{
                correlativo.value = `${rows.CORRELATIVO}`
            })            
        }, (error) => {
            correlativo.value = 0;
            console.log(error);
        });
    },
    getSucursales: async(idContainer)=>{
        let container = document.getElementById(idContainer);
        return new Promise((resolve, reject) => {
            
            let str = '';
            axios.get('/tipodocumentos/sucursales')
            .then((response) => {
                const data = response.data;        
                data.recordset.map((rows)=>{
                    str = str + `<option value=${rows.CODSUCURSAL}>${rows.NOMBRE}</option>`;
                })
                container.innerHTML = str;
                resolve();            
            }, (error) => {
                container.innerHTML = '';
                console.log(error);
                reject();
            });
               
        }, (error) => {
            container.innerHTML = '';
            console.log(error);
            reject();
        });

        
    },
    getCorrelativoDocumento: (tipodoc,coddoc)=>{
        
        return new Promise((resolve,reject)=>{
            let correlativo = '0';
            axios.get('/tipodocumentos/correlativodoc?empnit=' + GlobalEmpnit + '&tipo=' + tipodoc + '&coddoc=' + coddoc  + '&app=' + GlobalSistema)
            .then((response) => {
                const data = response.data;        
                data.recordset.map((rows)=>{
                    correlativo = `${rows.CORRELATIVO}`
                })
                resolve(correlativo.toString());            
            }, (error) => {
                console.log(error);
                reject('0');
            });
        })
        
    }
}