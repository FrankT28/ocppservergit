const pool = require('./database.js');

/*=============================================================================================*/
//RESERVE NOW
/*=============================================================================================*/
async function confirmReserveNow(id_registro, payload){
    let status = payload.status;
    let sql = "UPDATE reservaciones SET reservation_status=? WHERE id_reservacion=?;";
    await pool.query(sql, [status, id_registro]);
}


/*=============================================================================================*/
/*=============================================================================================*/
//FUNCION PRINCIPAL
/*=============================================================================================*/
/*=============================================================================================*/
async function update(response, payload){
    console.log('response');
    console.log(response);
    let operacion = response.operacion;
    let id_registro = response.id_registro;

    if(operacion=='ReserveNow'){
        await confirmReserveNow(id_registro, payload);
    }
}

module.exports.update = update;