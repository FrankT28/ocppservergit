const { response } = require('express');
const pool = require('./database.js');

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
    var meterValue = [];
    var timestamp = '';
    var value = '';
    var sampledValue = '';
    var sample = '';
    payloadResponse = {}
    
    let transactionId = payload.transactionId;
    let connectorId = payload.connectorId;
    meterValue = payload.meterValue;
    
    for(var i=0; i<meterValue.length; i++){
        value = meterValue[i];
        timestamp = value.timestamp;
        sampledValue = value.sampledValue;
    }
    payloadResponseNav = {'tipo': 'meterValue', 'texto':'cargando', 'values': payload};
    var payloadResponseApk = meterValuesApk(payload.meterValue);
    return [payloadResponse, payloadResponseNav, payloadResponseApk]
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