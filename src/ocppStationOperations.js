const { response } = require('express');
const pool = require('./database.js');
const fs = require('fs');

/*=============================================================================================*/
//AUTHORIZE
/*=============================================================================================*/
async function authorizeResponse(payload){
    crfid = payload.idTag;
    var datosTarjeta = await pool.query('SELECT id_tarjeta, estado FROM tarjetas where codigo_rfid="' + crfid + '";');
    var payloadResponse = {};
    datosTarjeta = datosTarjeta[0];
    
    if (datosTarjeta){
        if (datosTarjeta.estado=='Accepted'){
            payloadResponse =  {"idTagInfo": {"status": "Accepted"}};
        }else{

            payloadResponse =  {"idTagInfo": {"status": "Blocked"}};
        } 
    }else{

        payloadResponse =  {"idTagInfo": {"status": "Invalid"}};
    }

    let payloadResponseNav = {};
    return [payloadResponse, payloadResponseNav];
}

/*=============================================================================================*/
//BOOT NOTIFICATION
/*=============================================================================================*/
function bootNotificationResponse(payload){
    const currentDate = new Date();
    payloadResponse = {"status":"Accepted", "currentTime":currentDate, "interval":300};
    payloadResponseNav = {};
    return [payloadResponse, payloadResponseNav];
}

/*=============================================================================================*/
//DATA TRANSFER
/*=============================================================================================*/
function dataTransferResponse(payload){
    payloadResponse = {"status":"Accepted","data":"bkhg"};
   return [payloadResponse];
}

/*=============================================================================================*/
//DIAGNOSTIC STATUS NOTIFICATION
/*=============================================================================================*/
function diagnosticsStatusNotificationResponse(payload){
    payloadResponse = {};
    return [payloadResponse];
 }

/*=============================================================================================*/
//FIRMWARE STATUS NOTIFICATION
/*=============================================================================================*/
function firmwareStatusNotificationResponse(payload){
    payloadResponse = {};
    return [payloadResponse];
}

/*=============================================================================================*/
//HEARTBEAT
/*=============================================================================================*/
function heartbeatResponse(payload){
    const currentDate = new Date();
    payloadResponse = {"currentTime": currentDate};
    return [payloadResponse];
}

/*=============================================================================================*/
//METER VALUES
/*=============================================================================================*/
async function meterValuesResponse(payload){
    console.log('payload');
    console.log(payload);

    let timest=new Date();

    console.log('Este es el transactionID')
    let transaccionID=payload.transactionId;
    let conectorID =payload.connectorId;
    console.log(transaccionID)
    
    let ultTrans0 = await pool.query('SELECT *, date(fecha) FROM transacciones WHERE id_transaccion="'+ transaccionID + '" ORDER BY id_transaccion DESC LIMIT 1;');
    var energia_inicial=ultTrans0[0].energiaInicio;
    console.log('ultima transaccion');
    console.log(ultTrans0[0])
    //let fecha_hora_inicio=new Date(ultTrans0[0].fecha + 'T' + ultTrans0[0].hora_inicio);
    let fecha_hora_inicio = ultTrans0[0].fecha;
    console.log('Esta es la hora de inicio: ' + fecha_hora_inicio)
   

    let date = fecha_hora_inicio.getDate();
    let month = fecha_hora_inicio.getMonth() + 1;
    let year = fecha_hora_inicio.getFullYear();
    let hour = fecha_hora_inicio.getHours()-5;
    let minute = fecha_hora_inicio.getMinutes();
    let second = fecha_hora_inicio.getSeconds();
    let mili= fecha_hora_inicio.getMilliseconds();

    //let nombre_archivo=year + "_" + month + "_" + date+"_"+hour+"_"+minute+"_"+second + "_conector_" + conectorID+"_transaccionID_"+transaccionID;
    let hora_inicio = ultTrans0[0].hora_inicio.replace(':', '_');
    hora_inicio = hora_inicio.replace(':', '_');
    let nombre_archivo = hora_inicio;
    let archivo_potencia=nombre_archivo + "_potencia.txt";
    let archivo_energia= nombre_archivo + "_energia.txt";

    console.log('nombres archivos');
    console.log(archivo_potencia);
    console.log(archivo_energia);

    var energia1;
    var potencia1;

    var meterValue = [];
    var timestamp = '';
    var value = '';
    var sampledValue = '';
    var sample = '';
    payloadResponse = {}
    
    meterValue = payload.meterValue;
    
    for(var i=0; i<meterValue.length; i++){
        value = meterValue[i];
        timestamp = value.timestamp;
        sampledValue = value.sampledValue;
        
        for (var k=0; k<sampledValue.length; k++){
            let linea = sampledValue[k];
            if(linea.measurand=='soc'){
                response.soc = linea.value;
                response.costocarga = 'esto es costocarga';
                response.estadocarga = 'esto es estadocarga';
                response.enecons = 'esto es enecons';
                response.saldo = 'esto es saldo';
            }

            if(linea.measurand=='Energy.Active.Import.Register'){
                console.log('energia:' + linea.value)
                energia1 = linea.value;
                //if(energia1==null){
                    energia1 = 63000;
                //}
            }

            if(linea.measurand=='Power.Active.Import'){
                console.log('Power:' + linea.value)
                potencia1 = linea.value;
            }
        }
    }

    let valores = [transaccionID, 1, conectorID, 'now()', timest, energia1];
    addPowerDb(valores);

    valores = [transaccionID, 1, conectorID, 'now()', timest, potencia1];
    addEnergyDb(valores);

    //*************************************************************************************
    //Registro de potencia
    /***************************************************************************************
    var potencia_registro=timest.toISOString() + " " + potencia1 +' \n';

    fs.appendFile(archivo_potencia , potencia_registro, function (err) {
        if (err){
            console.log(err)
        }else{
            console.log('no hay error en archivo de potencia')
        }
    });
    //************************************************************************************

    //*************************************************************************************
    //Registro de energia
    /****************************************************************************************
    var energiaconsumida=(energia1-energia_inicial)/1000;
    var energia_registro=timest.toISOString() + " " + energiaconsumida +' \n';

    fs.appendFile(archivo_energia , energia_registro, function (err) {
        console.log('Entra a archivo de energia')
        if (err){
            console.log(err)
        }else{
            console.log('No hay eror en archivo de energia')
        }
    });
    //****************************************************************************************/


    payloadResponseNav = {'tipo': 'meterValue', 'texto':'cargando', 'values': payload};
    var payloadResponseApk = meterValuesApk(payload.meterValue);
    return [payloadResponse, payloadResponseNav, payloadResponseApk]
}

/***********************************************************************/
async function addPowerDb(valores){
    let sql = "INSERT INTO potencia_transacciones VALUES(null,?,?,?,?,?,?)";
    console.log('sql');
    console.log(sql);
    result = await pool.query(sql,valores);
    if (result){
        console.log('Ingresado correctamente potencia');
    }else{
        console.log('Error al ingresar db potencia');
    }
}
/***********************************************************************/
async function addEnergyDb(valores){
    let sql = "INSERT INTO energia_transacciones VALUES(null,?,?,?,?,?,?)"
    result = await pool.query(sql,valores);
    if (result){
        console.log('Ingresado correctamente energia');
    }else{
        console.log('Error al ingresar db energia');
    }
}
/***********************************************************************/
function timeConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp * 1000);
    var year = a.getFullYear();
    var month = a.getMonth();
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var msec = a.getMilliseconds();
    var time = year + '-' + month + '-' + date + 'T' + hour + ':' + min + ':' + sec + '.' + msec + 'Z';
    return time;
  }

/***********************************************************************/
function insertCurrent(fase, transactionId, connectorId, sample){
    let contexto = sample.context;
    let unidad = sample.unit;
    let valor = sample.value;
    let formato = sample.format;
    let ubicacion = sample.location;
    
    let sql = 
        "INSERT INTO transacciones_ci_" + fase
        " VALUES (" + 
        " null," + 
        transactionId + "," +
        "1" + "," + 
        connectorId + ",'" + 
        timestamp + "','" + 
        contexto + "','" +
        unidad + "'," +
        valor + ",'" +
        formato + "','" +
        ubicacion +
        "')";
        pool.query(sql);
}

/***********************************************************************/
function insertCurrent(fase, transactionId, connectorId, sample){
    let contexto = sample.context;
    let unidad = sample.unit;
    let valor = sample.value;
    let formato = sample.format;
    let ubicacion = sample.location;

    let sql = 
        "INSERT INTO transacciones_ci_" + fase
        " VALUES (" + 
        " null," + 
        transactionId + "," +
        "1" + "," + 
        connectorId + ",'" + 
        timestamp + "','" + 
        contexto + "','" +
        unidad + "'," +
        valor + ",'" +
        formato + "','" +
        ubicacion +
        "')";
        pool.query(sql);
}

/***********************************************************************/
function insertMeterValues(timestamp, transactionId, connectorId, sample){
    timestamp = timeConverter(timestamp);
    let measurand = sample.measurand;
    let fase = sample.phase;

    if(measurand=='Current.Import'){
        insertCurrent(fase, transactionId, timestamp, connectorId, sample);
    }else if(measurand=='Current.Export'){
        insertExport(fase, transactionId, timestamp, connectorId, sample);
    }else if(measurand=='Current.Offered'){
        insertCurrentOffered(fase, transactionId, timestamp, connectorId, sample);
    }
}

/***********************************************************************/
function meterValuesApk(array){

    var response = {}
    for(var i=0; i<array.length; i++){
        let sampledValue = array[i].sampledValue;
        for (var k=0; k<sampledValue.length; k++){
            let linea = sampledValue[k];
            if(linea.measurand=='soc'){
                response.soc = linea.value;
                response.costocarga = 'esto es costocarga';
                response.estadocarga = 'esto es estadocarga';
                response.enecons = 'esto es enecons';
                response.saldo = 'esto es saldo';
            }
        }
    }
    return response;
}

/*=============================================================================================*/
//START TRANSACTION
/*=============================================================================================*/
async function startTransactionResponse(payload){
    let idTag = payload.idTag;
    let meterStart = payload.meterStart;
    let connectorId = payload.connectorId;
    let hora_inicio = payload.timestamp;
    let idStation = 1;
    let estado = 'Iniciada';

    var validar = await validarTarjeta(idTag);
    if(validar!=false){
        var status = 'Accepted';
        var values = [idStation, connectorId, validar, meterStart, meterStart, estado, estado];
        var sql = 'INSERT INTO transacciones values (null,?,?,?,now(),now(),now(),?,?,0,?,?)';

        let transaccion  = await pool.query(sql, values);
        if (transaccion){
        }else{
        }

        var transactionId;
        var sql = 'SELECT id_transaccion FROM transacciones ORDER BY id_transaccion DESC LIMIT 1;';
        let ultTrans0 = await pool.query(sql);
        transactionId = ultTrans0[0].id_transaccion;

        
    }else{
        status = 'Invalid';
    }

    let payloadResponse = {"idTagInfo": {"status": status}, "transactionId": transactionId};
    let payloadResponseNav = {'tipo': 'status', 'texto':'cargando'};
    let payloadresponseapk = {'soc': 'cargando'}
    return [payloadResponse, payloadResponseNav, payloadresponseapk];
}
/*=============================================================================================*/
async function validarTarjeta(codigo){
    let sql = "SELECT id_tarjeta FROM tarjetas WHERE codigo_rfid=?";
    let result = await pool.query(sql, codigo);
    if(result.length>0){
        id_tarjeta = result[0].id_tarjeta;
    }else{
        id_tarjeta = false;
    }
    return id_tarjeta;
}

/*=============================================================================================*/
//STATUS NOTIFICATION
/*=============================================================================================*/
async function statusNotificationResponse(payload){
    let status = payload.status;
    const currentDate = new Date();
    payloadResponse = {};
    let estado = await updateStateStation(1, status)
    payloadResponseNav = {'tipo': 'status', 'texto': estado};
    return [payloadResponse, payloadResponseNav];
}
/***********************************************************************/
async function updateStateStation(id, estadoIngles){
    let sql = "SELECT id_estado_est, estado_est_espanol FROM estados_estaciones WHERE estado_est_ingles=?";
    let result = await pool.query(sql, [estadoIngles]);
    let id_estado_est = result[0].id_estado_est;
    let estado_est_espanol = result[0].estado_est_espanol;
    
    sql = "UPDATE estado_estacion SET id_estado_est=? WHERE id_estacion=?";
    result = await pool.query(sql, [id_estado_est, id]);
    return estado_est_espanol;
}

/*=============================================================================================*/
//STOP TRANSACTION
/*=============================================================================================*/
async function stopTransactionResponse(payload){
    let estado = 'Finalizada' 
    let transactionId = payload.transactionId;
    let hora_fin = payload.timestamp;
    var sql = 'SELECT energiaInicio FROM transacciones WHERE id_transaccion=?;';
    let meterStart = await pool.query(sql, transactionId);
    console.log('energia inicio');
    console.log(meterStart[0].energiaInicio);
    let meterStop = payload.meterStop;
    let ec;
    if(meterStart.length>0){
        console.log('si pasa')
        ec = meterStop - meterStart[0].energiaInicio;
    }else{
        ec = meterStop;
    }

    console.log('ec: ');
    console.log(ec);
            
    let razon = payload.reason;
    const values = [meterStop, ec, estado, razon, transactionId]
    sql = 'UPDATE transacciones SET hora_fin=now(), energiaFin=?, energiaConsumida=?, estado=?, razon=? WHERE id_transaccion=?;'; 
    let update = await pool.query(sql, values);

    payloadResponse = {"idTagInfo": {"status": "Accepted"}};
    payloadResponseNav = {"idTagInfo": {"status": "Accepted"}};
    return [payloadResponse, payloadResponseNav];
}






async function processOcppRequest(ocppMessage){
    var payloadResponse;
    let action = ocppMessage[2];
    let payload = ocppMessage[3];

    if (action=='Authorize'){
        payloadResponse = await authorizeResponse(payload);
    }else if (action=='BootNotification'){
        payloadResponse = bootNotificationResponse(payload);
    }else if(action=='DataTransfer') {
        payloadResponse = dataTransferResponse(payload);
    }else if(action=='DiagnosticsStatusNotification') {
        payloadResponse = diagnosticsStatusNotificationResponse(payload);
    }else if(action=='FirmwareStatusNotification') {
        payloadResponse = firmwareStatusNotificationResponse(payload);
    }else if (action=='Heartbeat'){
        payloadResponse = heartbeatResponse(payload)
    }else if(action=='MeterValues'){
        payloadResponse = meterValuesResponse(payload);
    }else if(action=='StartTransaction'){
        payloadResponse = await startTransactionResponse(payload);
    }else if (action=='StatusNotification'){
        payloadResponse = await statusNotificationResponse(payload);
    }else if(action=='StopTransaction'){
        payloadResponse = stopTransactionResponse(payload)
    }else{
        payloadResponse = notImplementedResponse(payload)
    }
    return payloadResponse
}

module.exports.processOcppRequest = processOcppRequest;