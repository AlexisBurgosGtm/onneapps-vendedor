let classEmpleados = {
    comboboxVendedores : async(idContainer)=>{
        return new Promise((resolve, reject) => {
            let combobox = document.getElementById(idContainer);
        
            let str = ""; 
            axios.get('/empleados/vendedores?sucursal=' + GlobalCodSucursal)
            .then((response) => {
                const data = response.data;        
                data.recordset.map((rows)=>{
                    str += `<option value="${rows.CODIGO}">${rows.NOMBRE}</option>`
                })            
                combobox.innerHTML = str;
               resolve(); 
            }, (error) => {
                reject();
            });
        });
    },
    updateMyLocation : async ()=>{
        let f = new Date();
        let momento = `${f.getHours()}:${f.getMinutes()}` 
        let gps = new Promise((resolve,reject)=>{
            try {
                navigator.geolocation.getCurrentPosition(function (location) {
                    GlobalGpsLat = Number(location.coords.latitude)
                    GlobalGpsLong = Number(location.coords.longitude);
                })
                resolve();
            } catch (error) {
                console.log("error en gps: " + error)
                GlobalGpsLat = 0;
                GlobalGpsLong = 0;
                reject();
            }
        })
        await gps 
        .then(()=>{
            axios.put('/empleados/location',{
                sucursal : GlobalCodSucursal,
                codven : GlobalCodUsuario,
                lat : GlobalGpsLat,
                long : GlobalGpsLong,
                horamin:momento
            })
            .then((response) => {
                //console.log(response);
            }, (error) => {
               //console.log(error);
            });
        })

    }

}