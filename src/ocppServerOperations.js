const { response } = require('express');
const pool = require('./database.js');
const funciones = require('./funciones.js');

/*=============================================================================================*/
//CANCEL RESERVATION
/*=============================================================================================*/
function CancelReservationReques(payload){
    let reservationId = payload.reservationId;
    payloadRequest = {"reservationId": reservationId};
    return [payloadRequest];
}

/*=============================================================================================*/
//CHANGE AVAILAVILITY
/*=============================================================================================*/
function ChangeAvailabilityRequest(payload){
    let connectorId = payload.Conector;
    let type = payload.Estado;
    payloadRequest = {"connectorId": connectorId, "type": type};
    return [payloadRequest];
}

/*=============================================================================================*/
//CHANGE CONFIGURATION
/*=============================================================================================*/
function ChangeConfigurationRequest(payload){
    let key = payload.key;
    let value = payload.value;
    payloadRequest = {'key': key, 'value': value};
    return [payloadRequest];
}

/*=============================================================================================*/
//CLEAR CACHE
/*=============================================================================================*/
function ClearCacheRequest(payload){
    payloadRequest = {};
    return [payloadRequest];
}

/*=============================================================================================*/
//CLEAR CHARGING PROFILE
/*=============================================================================================*/
function ClearChargingProfileRequest(payload){
    payloadRequest = {};
    return [payloadRequest];
}

/*=============================================================================================*/
//DATA TRANSFER
/*=============================================================================================*/
function DataTransferRequest(payload){
    payloadRequest = {};
    return [payloadRequest];
}

/*=============================================================================================*/
//GET COMPOSITE SCHEDULE
/*=============================================================================================*/
function GetCompositeScheduleRequest(payload){
    payloadRequest = {"connectorId": 3, "duration": 3600, 'chargingRateUnit': 'W'};
    return [payloadRequest];
}

/*=============================================================================================*/
//GET CONFIGURATION
/*=============================================================================================*/
function GetConfigurationRequest(payload){
    
    const KeysArray = ['AuthorizationCacheEnabled',
    'AuthorizeRemoteTxRequests',
    'AllowOfflineTxForUnknownId',
    'HeartbeatInterval',
    'MeterValueSampleInterval', 
    'LocalAuthorizeOffline',
    'ConnectionTimeOut',
    'LightIntensity'];

    payloadRequest = [2,'1000', Action, {'key': KeysArray}];
    
    /*for (var i=0; i<len; i++){
        var key = claves.next().value;
        //console.log('Esta es la llave: ' + key)
        if (ide==key){
            cliente = clientes.get(key);
            cliente.write(funciones.constructReply(Request, 1));
        }/*else{
            console.log('No existe el cliente: ')
        };*
    }*/


    /*payloadRequest = {"key": 
        [  'AllowOfflineTxForUnknownId',
           'AuthorizationCacheEnabled',
           'AuthorizeRemoteTxRequests',
           'ClockAlignedDataInterval',
           'ConnectionTimeOut',
           'ConnectorPhaseRotation',
           'GetConfigurationMaxKeys',
           'HeartbeatInterval',
           'LocalAuthorizeOffline',
           'LocalPreAuthorize', 
           'MeterValuesAlignedData',
           'MeterValuesSampledData',
           'MeterValueSampleInterval',
           'NumberOfConnectors',
           'StopTransactionOnEVSideDisconnect',
           'StopTransactionOnInvalidId',
           'StopTxnSampledData',
           'TransactionMessageRetryInterval',
       ]}  */
       return [payloadRequest];
}
/*=============================================================================================*/
//GET DIAGNOSTICS
/*=============================================================================================*/
function GetDiagnosticsRequest(payload){
    payloadRequest = {"location": uriFTP};
    return [payloadRequest];
}

/*=============================================================================================*/
//GET LOCAL LIST VERSION
/*=============================================================================================*/
function GetLocalListVersionRequest(payload){
    payloadRequest = {};
    return [payloadRequest];
}

/*=============================================================================================*/
//REMOTE START TRANSACTION
/*=============================================================================================*/
async function RemoteStartTransactionRequest(payload){
    let connectorId = payload.connectorId;
    let idTag = payload.idTag;

    chargingProfile ={
        "chargingProfileId": 1,
        "stackLevel": 1,
        "chargingProfilePurpose": "TxProfile",
        "chargingProfileKind": "Absolute",
        "recurrencyKind": "Daily",
        //"validFrom": '2022-03-11T13:10:00.000Z',
        //"validTo": '2022-03-11T13:45:00.000Z',
        "chargingSchedule": {
            //"duration": 100,
            "startSchedule": '2022-03-11T13:47:00.000Z',
            "chargingRateUnit": "A",
            "chargingSchedulePeriod": [{"startPeriod": 0, "limit": 18, "numberPhases": 3}]
            //"minChargingRate": 0.4
        }
    }

    //payloadRequest = {'connectorId': connectorId, 'idTag': idTag, 'chargingProfile':{'transactionId':transactionId}};
    payloadRequest = {'connectorId': connectorId, 'idTag': idTag, 'chargingProfile': chargingProfile};

    addTransactionDb();

    return [payloadRequest];
}

/*=============================================================================================*/
async function addTransactionDb(){
    let transactionId;
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
    });
}

/*=============================================================================================*/
//REMOTE STOP TRANSACTION
/*=============================================================================================*/
async function RemoteStopTransactionRequest(payload){
    let sql = 'SELECT id_transaccion FROM transacciones ORDER BY id_transaccion DESC LIMIT 1;';
    var result = await pool.query(sql);
    let transactionId = result[0].id_transaccion;
    console.log('Este es el id de la ultima transaccion: ' + transactionId)
    payloadRequest = {"transactionId": transactionId};
    return [payloadRequest];
}

/*=============================================================================================*/
//RESERVE NOW
/*=============================================================================================*/
function ReserveNowRequest(payload){
    let connectorId = payload.connectorId;
    let expiryDate = payload.expiryDate;
    let idTag = payload.idTag;
    let reservationId = payload.reservationId;
    payloadRequest = {"connectorId": connectorId, "expiryDate": expiryDate, "idTag": idTag, "reservationId": reservationId};
    return [payloadRequest];
}

/*=============================================================================================*/
function agregaMinutos(dt, minutos) {
    const currentDate = new Date();
    return new Date(dt.getTime() + minutos*60000);
}

/*=============================================================================================*/
//RESET
/*=============================================================================================*/
function ResetRequest(payload){
    payloadRequest = {'type':message.Type};
    return [payloadRequest];
}

/*=============================================================================================*/
//SEND LOCAL LIST
/*=============================================================================================*/
function SendLocalListRequest(payload){
    payloadRequest = {
        "listVersion": 1,
        "localAuthorizationList": [
            {
                "idTag": "7240E49A",
                "idTagInfo": 
                    {
                        "expiryDate": "2022-02-29T11:10:00.000Z",
                        "status": "Accepted"
                    }
            }
        ],
        "updateType": "Differential"
    }
    return [payloadRequest];
}

/*=============================================================================================*/
//SET CHARGING PROFILE
/*=============================================================================================*/
function SetChargingProfileRequest(payload){
    payloadRequest = {
        "connectorId": 1,
        "csChargingProfiles": {
            "chargingProfileId": 1,
            "transactionId": 1,
            "stackLevel": 1,
            "chargingProfilePurpose": "TxDefaultProfile",
            "chargingProfileKind": "Absolute",
            "recurrencyKind": "Daily",
            "validFrom": '2022-03-06T17:10:00.000Z',
            "validTo": '2022-03-16T17:20:00.000Z',
            "chargingSchedule": {
                "duration": 100,
                "startSchedule": '2022-03-6T10:00:00.000Z',
                "chargingRateUnit": "A",
                "chargingSchedulePeriod": [
                    {"startPeriod": 0, "limit": 1, "numberPhases": 3},
                    {"startPeriod": 1, "limit": 2, "numberPhases": 3}
                ],
                "minChargingRate": 1
            }
        }
    }
    return [payloadRequest];
}

/*=============================================================================================*/
//TRIGGER MESSAGE
/*=============================================================================================*/
function TriggerMessageRequest(payload){
    payloadRequest = {"connectorId":message.Conector};
    return [payloadRequest];
}

/*=============================================================================================*/
//UNLOCK CONNECTOR
/*=============================================================================================*/
function UnlockConnectorRequest(payload){
    payloadRequest = {"connectorId":message.Conector};
    return [payloadRequest];
}

/*=============================================================================================*/
//UPDATE FIRMWARE
/*=============================================================================================*/
function UpdateFirmwareRequest(payload){
    payloadRequest = {"connectorId":message.Conector};
    return [payloadRequest];
}

/*=============================================================================================*/
//NOT IMPLEMENTED
/*=============================================================================================*/
function NotImplementedRequest(payload){
    payloadRequest = {};
    return [payloadRequest];
}



/*=============================================================================================*/
/*=============================================================================================*/
//FUNCION PRINCIPAL
/*=============================================================================================*/
/*=============================================================================================*/
async function processOcppRequestFromBrowser(ocppMessageFromBrowser){
    var payloadRequest;
    let Action = ocppMessageFromBrowser[2];
    let payload = ocppMessageFromBrowser[3];

    if(message.tipo=='CancelReservation'){
        payloadRequest = CancelReservationRequest(payload);
    }else if(message.tipo=='ChangeAvailability'){
        payloadRequest = ChangeAvailabilityRequest(payload);
    }else if(message.tipo=='ChangeConfiguration'){
        payloadRequest = ChangeConfigurationRequest(payload);
    }else if(message.tipo=='ClearCache'){
        payloadRequest = ClearCache(payload);
    }else if(message.tipo=='ClearChargingProfile'){
        payloadRequest = ClearChargingProfileRequest(payload);
    }else if(Action=='DataTransfer') {
        payloadRequest = DataTransferRequest(payload);
    }else if(message.tipo=='GetCompositeSchedule'){
        payloadRequest = GetCompositeScheduleRequest(payload);
    }else if(message.tipo=='GetConfiguration'){
        payloadRequest = GetConfigurationRequest(payload);
   }else if(message.tipo=='GetDiagnostics'){
        payloadRequest = GetDiagnosticsRequest(payload);
    }else if(message.tipo=='GetLocalListVersion'){
        payloadRequest = GetLocalListVersionRequest(payload);
    }else if(message.tipo=='RemoteStartTransaction'){
        payloadRequest = RemoteStartTransactionRequest(payload);
    }else if(message.tipo=='RemoteStopTransaction'){
        payloadRequest = RemoteStopTransactionRequest(payload);
    }else if(message.tipo=='ReserveNow'){
        payloadRequest = ReserveNowRequest(payload);
    }else if(message.tipo=='Reset'){
        payloadRequest = ResetRequest(payload);
    }else if(message.tipo=='SendLocalList'){
        payloadRequest = SendLocalListRequest(payload);
    }else if(message.tipo=='SetChargingProfile'){
        payloadRequest = SetChargingProfileRequest(payload);
    }else if(message.tipo=='TriggerMessage'){
        payloadRequest = TriggerMessageRequest(payload);
    }else if(message.tipo=='UnlockConnector'){
        payloadRequest = UnlockConnectorRequest(payload);
    }else if(message.tipo=='UpdateFirmware'){
        payloadRequest = UpdateFirmwareRequest(payload);
    }else{
        payloadRequest = NotImplementedRequest(payload);
        console.log('La operacion OCPP solicitada por el navegador aun no ha sido implementada')
    }
    return payloadRequest
}

module.exports.processOcppRequestFromBrowser = processOcppRequestFromBrowser;