
const { response } = require('express');
const pool = require('./database.js');


async function AuthorizeResponse(crfid){
    console.log('Este es el codigo')
    console.log(crfid)
    var datosTarjeta = await pool.query('SELECT id_tarjeta, estado FROM tarjetas where codigo_rfid="' + crfid + '";');
    console.log('datos tarjeta: ');
    console.log(datosTarjeta);
    var PayloadResponse = {};
    datosTarjeta = datosTarjeta[0];
    console.log('datos tarjeta luego: ');
    console.log(datosTarjeta);
    
    if (datosTarjeta){
        console.log('si es mayor que 0')
        if (datosTarjeta.estado=='Accepted'){
            console.log('aceptada')
            PayloadResponse =  {"idTagInfo": {"status": "Accepted"}};
        }else{
            console.log('bloqueada')

            PayloadResponse =  {"idTagInfo": {"status": "Blocked"}};
        } 
    }else{
        console.log('no hay tarjeta')

        PayloadResponse =  {"idTagInfo": {"status": "Invalid"}};
    }

    let PayloadResponseNav = {};
    return [PayloadResponse, PayloadResponseNav];
}


function StatusNotificationResponse(Payload){
    console.log('Esto es pyload functions');
    console.log(Payload);
    const currentDate = new Date();
    //PayloadResponse = {"status": "Accepted", "currentDate": currentDate};
    PayloadResponse = {};
    PayloadResponseNav = {'tipo': 'status', 'texto':Payload.status};
    return [PayloadResponse, PayloadResponseNav];
}

function BootNotificationResponse(Payload){ 
    const currentDate = new Date();
    PayloadResponse = {"status":"Accepted", "currentTime":currentDate, "interval":300};
    PayloadResponseNav = {};
    return [PayloadResponse, PayloadResponseNav];
}

/***********************************************************************/
async function validarTarjeta(codigo){
    console.log('codigo')
    console.log(codigo)
    let sql = "SELECT id_tarjeta FROM tarjetas WHERE codigo_rfid=?";
    let result = await pool.query(sql, codigo);
    console.log('result');
    console.log(result);
    if(result.length>0){
        id_tarjeta = result[0].id_tarjeta;
    }else{
        id_tarjeta = false;
    }
    return id_tarjeta;
}
/***********************************************************************/
async function StartTransactionResponse(Payload){
    let idTag = Payload.idTag;
    let meterStart = Payload.meterStart;
    let connectorId = Payload.connectorId;
    let hora_inicio = Payload.timestamp;
    console.log('Esto es hora inicio de timestampL ');
    console.log(hora_inicio);
    let idStation = 1;
    let estado = 'Iniciada';


    var validar = await validarTarjeta(idTag);
    console.log('validar')
    console.log(validar)
    if(validar!=false){
        var status = 'Accepted';
        var values = [idStation, connectorId, validar, meterStart, meterStart, estado, estado];
        var sql = 'INSERT INTO transacciones values (null,?,?,?,now(),now(),now(),?,?,0,?,?)';

        let transaccion  = await pool.query(sql, values);
        if (transaccion){
            console.log('Se ha ingresado algo en db transacciones')
        }else{
            console.log('Fallo al ingresar');
        }

        var transactionId;
        var sql = 'SELECT id_transaccion FROM transacciones ORDER BY id_transaccion DESC LIMIT 1;';
        let ultTrans0 = await pool.query(sql);
        transactionId = ultTrans0[0].id_transaccion;

        
    }else{
        status = 'Invalid';
    }

    let PayloadResponse = {"idTagInfo": {"status": status}, "transactionId": transactionId};
    let PayloadResponseNav = {'tipo': 'status', 'texto':'cargando'};
    let payloadresponseapk = {'soc': 'cargando'}
    return [PayloadResponse, PayloadResponseNav, payloadresponseapk];
}



//FUNCIONES PARA METER VALUES
function timeConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp * 1000);
    //var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
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
  //console.log(timeConverter(0));

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

async function MeterValuesConf(Payload){
    console.log('Estos son los meter values:');
    console.log(Payload);
    var meterValue = [];
    var timestamp = '';
    var value = '';
    var sampledValue = '';
    var sample = '';
    PayloadResponse = {}
    
    let transactionId = Payload.transactionId;
    let connectorId = Payload.connectorId;
    meterValue = Payload.meterValue;
    
    for(var i=0; i<meterValue.length; i++){
        value = meterValue[i];
        timestamp = value.timestamp;
        sampledValue = value.sampledValue;
        /*for (var k=0; k<sampledValue.length; k++){
            sample = sampledValue[i];
            console.log('Esto es sample: ');
            console.log(sample);

            await insertMeterValues(timestamp, connectorId, transactionId, sample);
        };*/
    }
    
 
    

    /*
    if (clientenav){
        clientenav.write(funciones.constructReply(textnav, 1));
    } */
    PayloadResponseNav = {'tipo': 'meterValue', 'texto':'cargando', 'values': Payload};
    var PayloadResponseApk = meterValuesApk(Payload.meterValue);
    console.log('payloadresponseapk: ')
    console.log( PayloadResponseApk)
    return [PayloadResponse, PayloadResponseNav, PayloadResponseApk]
}


function meterValuesApk(array){
    console.log('funcion meter values apk')
    var response = {}
    for(var i=0; i<array.length; i++){
        let sampledValue = array[i].sampledValue;
        console.log('sampled value: ' + sampledValue)
        for (var k=0; k<sampledValue.length; k++){
            let linea = sampledValue[k];
            if(linea.measurand=='soc'){
                console.log('soc:')
                response.soc = linea.value;
                response.costocarga = 'esto es costocarga';
                response.estadocarga = 'esto es estadocarga';
                response.enecons = 'esto es enecons';
                response.saldo = 'esto es saldo';
            }
        }
    }
    console.log('response: ' + response);
    return response;
}
async function StopTransactionConf(Payload){
    /*for (const property in Payload){
        console.log(property + ' : ' + Payload[property]);
    };*/
    //var transactionId = Payload.transactionId;
    let estado = 'Finalizada' 
    let transactionId = Payload.transactionId;

    let hora_fin = Payload.timestamp;
    var sql = 'SELECT energiaInicio FROM transacciones WHERE id_transaccion=?;';
    let meterStart = await pool.query(sql, transactionId);
    console.log('Esto es meter start');
    console.log(meterStart);
    let meterStop = Payload.meterStop;
    let ec = parseInt(meterStop,10) - parseInt(meterStart[0].energiaInicio,10);
    ec = ec;
    console.log(ec);
    let razon = Payload.reason;
    const values = [meterStop, ec, estado, razon, transactionId]
    sql = 'UPDATE transacciones SET hora_fin=now(), energiaFin=?, energiaConsumida=?, estado=?, razon=? WHERE id_transaccion=?;'; 
    let update = await pool.query(sql, values);
    //console.log(sql);
    /*let resultupdate = await pool.query(sql, values, function (err, result) {
        if (err) throw err;
        console.log("Number of records updated: " + result.affectedRows);
    });*/

    PayloadResponse = {"idTagInfo": {"status": "Accepted"}};
    PayloadResponseNav = {"idTagInfo": {"status": "Accepted"}};
    return [PayloadResponse, PayloadResponseNav];
}

async function RemoteStartTransactionReq(Payload){
    var transactionId;
    let ultTrans0 = await pool.query('SELECT id_transaccion FROM transacciones ORDER BY id_transaccion DESC LIMIT 1;');
    if(ultTrans0.length==0){
        transactionId=1;
    }else{
        transactionId = ultTrans0[0].id_transaccion + 1;
    }
    let ultValor = await pool.query('SELECT energia_fin FROM transacciones ORDER BY id_transaccion DESC LIMIT 1;');
    let meterStart = ultValor[0].energia_fin
    let idStation = 1;
    let ec = '0';
    let sql = 'INSERT INTO transacciones VALUES (?)';
    let estado = 'Initialized';
    let idTag = '0002020030000813';
    let connectorId = 1;
    const currentDate = new Date();
    let hora_inicio = currentDate;

    var values = [transactionId, idStation, idTag, connectorId, 
        hora_inicio, hora_inicio, meterStart, meterStart, ec, estado, estado];
    pool.query(sql, [values], function (err, result) {
        if (err) throw err;
        console.log("Se ha ingresado " + result.affectedRows + " fila(s) a la base de datos");
    });
    //PayloadResponse = {"idTagInfo": {"status": "Accepted"}, "transactionId": transactionId};
    let len = 2
    const claves = clientes.keys();
    const Request = [2,'1002', Action, {'idTag': '0002020030000813', 'connectorId':1, 'chargingProfile':{'transactionId':transactionId}}];
    for (var i=0; i<2; i++){
        var key = claves.next().value;
        //console.log('Esta es la llave: ' + key)
        if (ide==key){
            cliente = clientes.get(key);
            cliente.write(funciones.constructReply(Request, 1));
        }
    }
    //PayloadResponse = {"idTagInfo": {"status": "Accepted"}};
    //return PayloadResponse
}
 function DiagnosticsStatusNotificationResponse(Payload){
     PayloadResponse = {};
     //PayloadResponseNav = {};
    return [PayloadResponse];
 }

 function FirmwareStatusNotificationResponse(Payload){
    PayloadResponse = {};
    //PayloadResponseNav = {};
   return [PayloadResponse];
}

function DataTransferResponse(Payload){
    PayloadResponse = {"status":"Accepted","data":"bkhg"};
    //PayloadResponseNav = {};
   return [PayloadResponse];
}



async function funcionesnuevas (message){
    var PayloadResponse;
    let Action = message[2]; 
    let Payload = message[3];
    const currentDate = new Date();

    if (Action=='BootNotification'){
        PayloadResponse = BootNotificationResponse(Payload);
        //PayloadResponse = {"status":"Accepted", "currentTime":currentDate, "interval":300}
    }else if (Action=='StatusNotification'){
        console.log('llega al servidor un status notification')
        //PayloadResponse = {"status":"Accepted", "timestamp": currentDate};
        PayloadResponse = await StatusNotificationResponse(Payload);
        //PayloadResponse = {}
    }else if (Action=='Heartbeat'){
        PayloadResponse = {"currentTime": currentDate};
    }else if (Action=='Authorize'){
        PayloadResponse = await AuthorizeResponse(Payload.idTag);
        //console.log('ESTA ES LA CONSULTA: ' + resp);
    }else if(Action=='StartTransaction'){
        PayloadResponse = await StartTransactionResponse(Payload);
    }else if(Action=='MeterValues'){
        PayloadResponse = MeterValuesConf(Payload);
    }else if(Action=='StopTransaction'){
        PayloadResponse = StopTransactionConf(Payload)
    }else if(Action=='DiagnosticsStatusNotification') {
        PayloadResponse = DiagnosticsStatusNotificationResponse(Payload);
    }else if(Action=='FirmwareStatusNotification') {
        PayloadResponse = FirmwareStatusNotificationResponse(Payload);
    }else if(Action=='DataTransfer') {
        PayloadResponse = DataTransferResponse(Payload);
    }
    
    
    else{
        //OPERACIONES INICIADAS DESDE EL NAVEGADOR WEB
        if(Action=='RemoteStartTransaction'){
            PayloadResponse = StopTransactionConf(Payload)
        };
    }
    
    

    return PayloadResponse

    /*console.log('                                            ');
    console.log('El servidor responde-------------------')
    let CallResult = [CallResultId, UniqueId, PayloadResponse]; 
    console.log(CallResult);
    socket.write(funciones.constructReply(CallResult, opCode));
    */
}


async function funcionesNuevasNav (message){
    var PayloadResponse;
    let Action = message[2]; 
    let Payload = message[3];
    const currentDate = new Date();   
    //OPERACIONES INICIADAS DESDE EL NAVEGADOR WEB
    if(Action=='RemoteStartTransaction'){
        PayloadResponse = StopTransactionConf(Payload)
    };

    return PayloadResponse

}


module.exports.funcionesnuevas = funcionesnuevas;
module.exports.funcionesNuevasNav = funcionesNuevasNav;
    /*
    cliente = clientes.get(0);
    console.log('este es el cliente: ' + cliente)
    if (cliente){
        console.log('Si existe el cliente: ')
        cliente.write(funciones.constructReply("pong", 1));
    }
    */
    
    /*
    }else{
    var Payload = message[2];
    var act = message[1]
    //console.log('MessageTypeId es igual a 3');
    var configurationKey  = Payload.configurationKey;
    //var unknownKey  = Payload.unknownKey;
    var textnav;
    console.log('Estas son las configuraciones enviadas por el punto de carga: ');
    var algo = Payload.status;
    console.log('La reserva ha sido: ' + algo);
    
    for (const prop1 in configurationKey){
        console.log('Item ' + prop1 );
        console.log(configurationKey[prop1]);
    };
    textnav = {'boton':'descripcion_estacion', 'tipo':'recibido', 'texto':Payload}
    clienten = clientes.get(0);
    if (act == '1005'){
        if(Payload.status == 'Accepted'){
            textnav = {'boton':'descripcion_estacion', 'tipo':'recibido', 'texto':Payload}
        }
    }
    if (act=='1001' || act=='1000'){
        clienten.write(funciones.constructReply(textnav, 1));
    }
    if (act == '1002'){
        if (Payload.status=='Accepted'){
            textnav = {'boton':'descripcion_estacion', 'tipo':'cra', 'texto':Payload}
            clienten.write(funciones.constructReply(textnav, 1));
        }else{
            textnav = {'boton':'estado_estacion', 'tipo':'recibidos', 'texto':'Vehículo eléctrico no conectado'}
            clienten.write(funciones.constructReply(textnav, 1));
        }
    }
    
    };
    };
    }else{ 
    if(opCode === 0x9){
    console.log('Tipo de dato: ping');
    console.log('Contenido: ');
    console.log(message); 
    console.log('                                            ');
    console.log('El servidor responde con un pong: ');
    console.log(message);
    socket.write(funciones.constructReply(message, opCode));
    var textnav;
    textnav = {'boton':'ping_estacion','texto':'Recibiendo Pings'}
    cliente = clientes.get(0);
    console.log('este es el cliente: ' + cliente)

    if (cliente){
    console.log('Si existe el cliente: ')
    cliente.write(funciones.constructReply(textnav, 1));
    }
    
    
    
    }else{
    console.log('Se ha recibido un dato desde el navegador');
    console.log('Contenido: ' + message);
    var ide = parseInt(message.substring(0,1), 10);
    const Action = message.substring(1, message.length);
    var PayloadRequest;
    
    if(Action=='GetConfiguration'){
    console.log('si entra en action')
    PayloadRequest = {'key':['HeartbeatInterval']};
    const claves = clientes.keys();
    console.log('Estas son las claves de clientes: ');
    console.log(claves);
    let len = 2
    
    const KeysArray = ['AuthorizationCacheEnabled',
    'AuthorizeRemoteTxRequests',
    'AllowOfflineTxForUnknownId',
    'HeartbeatInterval',
    'MeterValueSampleInterval', 
    'LocalAuthorizeOffline',
    'ConnectionTimeOut',
    'LightIntensity'];
    const Request = [2,'1000', Action, {'key': KeysArray}];
    for (var i=0; i<len; i++){
        var key = claves.next().value;
        //console.log('Esta es la llave: ' + key)
        if (ide==key){
            cliente = clientes.get(key);
            cliente.write(funciones.constructReply(Request, 1));
        }/*else{
            console.log('No existe el cliente: ')
        };
    }
    }else if(Action=='RemoteStartTransaction'){
    var transactionId;
    let ultTrans0 = await pool.query('SELECT id_transaccion FROM transacciones ORDER BY id_transaccion DESC LIMIT 1;');
    if(ultTrans0.length==0){
        transactionId=1;
    }else{
        transactionId = ultTrans0[0].id_transaccion + 1;
    }
    let ultValor = await pool.query('SELECT energia_fin FROM transacciones ORDER BY id_transaccion DESC LIMIT 1;');
    let meterStart = ultValor[0].energia_fin
    let idStation = 1;
    let ec = '0';
    let sql = 'INSERT INTO transacciones VALUES (?)';
    let estado = 'Iniciada';
    let idTag = '0002020030000813';
    let connectorId = 1;
    const currentDate = new Date();
    let hora_inicio = currentDate;
    
    var values = [transactionId, idStation, idTag, connectorId, 
        hora_inicio, hora_inicio, meterStart, meterStart, ec, estado, estado];
    pool.query(sql, [values], function (err, result) {
        if (err) throw err;
        console.log("Se ha ingresado " + result.affectedRows + " fila a la base de datos");
    });
    //PayloadResponse = {"idTagInfo": {"status": "Accepted"}, "transactionId": transactionId};
    let len = 2
    const claves = clientes.keys();
    const Request = [2,'1002', Action, {'idTag': '0002020030000813', 'connectorId':1, 'chargingProfile':{'transactionId':transactionId}}];
    for (var i=0; i<2; i++){
        var key = claves.next().value;
        //console.log('Esta es la llave: ' + key)
        if (ide==key){
            cliente = clientes.get(key);
            cliente.write(funciones.constructReply(Request, 1));
        }
    }
    }else if(Action=='RemoteStopTransaction'){
    const claves = clientes.keys();
    var ultTrans0 = await pool.query('SELECT id_transaccion FROM transacciones ORDER BY id_transaccion DESC LIMIT 1;');
    let transactionId = ultTrans0[0].id_transaccion;
    console.log('Este es el id de la ultima transaccion: ' + transactionId)
    const Request = [2,'1003', Action, {'transactionId' : transactionId}];
    
    for (var i=0; i<2; i++){
        var key = claves.next().value;
        if (ide==key){
            cliente = clientes.get(key);
            cliente.write(funciones.constructReply(Request, 1));
        }/*else{
            console.log('No existe el cliente: ')
        };
    }
    }else if(Action=='ChangeConfiguration'){
    console.log('Si entra en cambiar configuration:')
    let ide = 1;
    const claves = clientes.keys();
    var Request = [2,'1001', Action, {'key':'MeterValueSampleInterval','value':'3'}];
    //Request = [2,'1001', Action, {'key':'HeartbeatInterval', 'value': '600'}];
    
    for (var i=0; i<2; i++){
        var key = claves.next().value;
        if (ide==key){
            cliente = clientes.get(key);
            cliente.write(funciones.constructReply(Request, 1));
        }/*else{
            console.log('No existe el cliente: ')
        };
    }
    }else if(Action == 'ReserveNow'){
    //let ide = 1;
    const claves = clientes.keys();
    const currentDate = new Date();
    const agregaMinutos =  function (dt, minutos) {
        return new Date(dt.getTime() + minutos*60000);
    }
    const nh = agregaMinutos(currentDate,1)
    console.log(nh);
    var Request = [2,'1005', Action, {'connectorId':1,'expiryDate': nh, 'idTag': '0002020030000813', 'reservationId':2}];
    for (var i=0; i<2; i++){
        var key = claves.next().value;
        if (ide==key){
            cliente = clientes.get(key);
            cliente.write(funciones.constructReply(Request, 1));
        }/*else{
            console.log('No existe el cliente: ')
        };
    }
    }else if(Action == 'CancelReservation'){
    console.log('Entra a cancel')
    let ide = 1;
    const claves = clientes.keys();
    var Request = [2,'1006', Action, {'reservationId':2}];
    for (var i=0; i<2; i++){
        var key = claves.next().value;
        if (ide==key){
            cliente = clientes.get(key);
            cliente.write(funciones.constructReply(Request, 1));
        }/*else{
            console.log('No existe el cliente: ')
        };*/