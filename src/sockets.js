const crypto = require('crypto');
const { urlencoded, text } = require('express');
//const { url } = require('inspector');
const { type } = require('os');
const pool = require('./database.js');
const funciones = require('./funciones.js');
var clientes = new Map();
const ffs = require('./ocppFunctions');
const ffsnav = require('./ocppFunctionsServer');
const path = require('path');
const { networkInterfaces } = require('os');

const nets = networkInterfaces();
const results = Object.create(null); // Or just '{}', an empty object





for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
        // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
        if (net.family === 'IPv4' && !net.internal) {
            if (!results[name]) {
                results[name] = [];
            }
            results[name].push(net.address);
        }
    }
}

var miIp = "";
for(const prop in results){
    console.log(prop);
    if(prop=='Wi-Fi'){
        miIp = results[prop][0];
    }else if(prop=='Ethernet'){
        miIp = results[prop][0];
    }
}

console.log('Esta es mi IP: ');
console.log(miIp);

const FtpSrv = require('ftp-srv');


/*const miIp = '192.168.222.201';
const miIpLocal = '192.168.1.20';*/
//miIp = '192.168.222.201';
const uriFTP = 'ftp://'+miIp+':21/';
//const uriFTP = 'ftp://192.168.222.201:21/';
//const uriFTP = 'ftp://192.168.1.10:21/';
const ftpServer = new FtpSrv({'url': uriFTP,
'greeting': 'Saludo de bienvenida desde servidor OCPP'});
const blacklist = [];
const whitelist = ['DIR', 'PWD', 'CWD', 'TYPE', 'PASV', 'PORT', 'LIST', 'STOR'];

ftpServer.on('login', (data, resolve, reject) => {

    console.log('login en servidor FTP')

    console.log(' ha habido un login')
    var username = data.username;
    var password = data.password;
        const rutaFTP = '/src/public/diagnostics/';
        const res = {'cwd': rutaFTP, 'blacklist': blacklist, 'whitelist': whitelist}
        resolve();
    
 });

ftpServer.listen()
.then(() => { console.log('Servidor FTP escuchando') });


var generateAcceptValue = function (acceptKey) {
    return crypto
    .createHash('sha1')
    .update(acceptKey + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11', 'binary')
    .digest('base64');
};


var responseHeaders = function(req){
    const acceptKey = req.headers['sec-websocket-key'];
    const hash = generateAcceptValue(acceptKey);
    const response = [ 
        'HTTP/1.1 101 Switching Protocols', 
        'Upgrade: WebSocket', 
        'Connection: Upgrade', 
        `Sec-WebSocket-Accept: ${hash}`
    ];

    const protocol = req.headers['sec-websocket-protocol'];
    const protocols = !protocol ? [] : protocol.split(',').map(s => s.trim());

    if (protocols.includes('ocpp1.6')) {
        console.log('Ha solicitado el subprotocolo ocpp1.6')
        response.push('Sec-WebSocket-Protocol: ocpp1.6');
    };
    console.log('Respuestas a enviar: ');
    console.log(response.join('\r\n') + '\r\n\r\n');
    return response;
}

var responseHeaders1 = function(acceptKey, protocol){
    const hash = generateAcceptValue(acceptKey);
    const response = [ 
        'HTTP/1.1 101 Switching Protocols', 
        'Upgrade: WebSocket', 
        'Connection: Upgrade', 
        `Sec-WebSocket-Accept: ${hash}`
    ]; 
    const protocols = !protocol ? [] : protocol.split(',').map(s => s.trim());

    if (protocols.includes('ocpp1.6')) {
        console.log('Ha solicitado el subprotocolo ocpp1.6')
        response.push('Sec-WebSocket-Protocol: ocpp1.6');
    };
    console.log('Respuestas a enviar: ');
    console.log(response.join('\r\n') + '\r\n\r\n');
    return response;
}

function getByValue(map, searchValue) {
    for (let [key, value] of map.entries()) {
      if (value === searchValue)
        return key;
    }
}

module.exports = function(server){
    server.on('upgrade',  async(req, socket) => { 
        var url_est = req.url.substring(1,req.url.length);
        console.log('                                           ');
        console.log('------------------------------------------------------');
        console.log('Un cliente quiere establecer un websocket: ');
        console.log('Identidad del cliente: ' + url_est)
        var clave;
        if (req.headers['upgrade'] !== 'websocket') {
            socket.end('HTTP/1.1 400 Bad Request');
            return;
        }; 
        
        
        let query = 'SELECT id_estacion FROM estaciones WHERE codigoEstacion="' + url_est + '";';
        let estaciones = await pool.query(query);
        console.log('resultado sql de estaciones');
        console.log(estaciones)


        if(estaciones.length!=0){
            response = responseHeaders(req);
            clave = estaciones[0].id_estacion;
            socket.write(response.join('\r\n') + '\r\n\r\n' );

        }else{
            console.log('La estacion no ha sido agregada aun');
            //socket.end('HTTP/1.1 400 Bad Request');
            clientes.set('temporal', socket);
            clientenav = clientes.get(0);
            const acceptKey = req.headers['sec-websocket-key'];
            const protocol = req.headers['sec-websocket-protocol'];

            var resp = {'tipo': 'UnautorizedClient', 'element':'firstWsHandshake', 'texto': url_est, 
            'acceptKey': acceptKey, 'protocol': protocol}
            if(clientenav){
                clientenav.write(funciones.constructReply(resp, 0x1));
            }else{
                console.log('Navegador no conectado')
            }

            return;
        }
     
        console.log('Estado del socket: ' + socket.readyState);
        if(socket.readyState=='open'){
            clientes.set(clave, socket);
        };

        socket.on("data", async(buffer) => {
            
            const lista = funciones.parseMessage(buffer);
            //lista = [mensaje, codigo_operacion]
            if (lista==null){
                return;
            };

            var message = lista[0]; 
            
            console.log('                                      ');
            console.log('El servidor ha recibido datos----------------------------------------------------------------------');
            const opCode = lista[1];
            const CallId = 2;
            const CallResultId = 3;
            const CallErrorId = 4;

            if (opCode === 0x1 ) {
                const MessageTypeId = message[0];
                const UniqueId = message[1];
                var PayloadResponse;

                if (MessageTypeId==2){ 
                    /*************Respuesta para punto de carga*************** */
                    Respuestas = await ffs.funcionesnuevas(message);
                    PayloadResponse = Respuestas[0];
                    PayloadResponseNav = Respuestas[1];
                    PayloadResponseApk = Respuestas[2];
                    console.log('                                            ');
                    let CallResult = [CallResultId, UniqueId, PayloadResponse]; 
                    console.log('Respuesta a enviar al punto de carga: ')
                    console.log(CallResult);
                    socket.write(funciones.constructReply(CallResult, opCode));

                    console.log('este es el payload response')
                    console.log(PayloadResponseNav)

                    /*************Respuesta para APK****************/
                    console.log('respuesta para apk: ');
                    console.log(PayloadResponseApk);
                    var clienteApk = clientes.get(2);
                    if(clienteApk && PayloadResponseApk){
                        clienteApk.write(funciones.constructReply(PayloadResponseApk, opCode))
                    }else{
                        console.log('APK no conectado');
                    }

                    /*************Respuesta para navegador****************/
                    if(PayloadResponseNav){ 
                        clientenav = clientes.get(0);
                        if(clientenav){
                            var id_est = getByValue(clientes, socket);
                            PayloadResponseNav.boton = PayloadResponseNav.tipo + id_est;
                            console.log('Respuesta a enviar al navegador: ')
                            console.log(PayloadResponseNav);
                            clientenav.write(funciones.constructReply(PayloadResponseNav, opCode))
                        }else{
                            console.log('Navegador no conectado');
                        } 
                    }

                    
                }else if (MessageTypeId==3){
                    clientenav = clientes.get(0);
                    console.log('Se ha recibido un MessageTypeId igual a 3!')
                    console.log(message[2]);
                    console.log('Este es el uniqueID');
                    console.log(message[1]);
                    var Response = {
                        'texto': message[2],
                        //'texto': JSON.stringify(message[2]),
                        'tipo': 'recibidos',
                        'boton': 'stationResponse',
                        'unid': UniqueId
                    };
                    clientenav.write(funciones.constructReply(Response, opCode));   
                }else if (MessageTypeId==4){
                    clientenav = clientes.get(0);
                    console.log('Se ha recibido un MessageTypeId igual a 4!, que significa algun error')
                    console.log(message[2]);
                    var Response = {
                        'texto': JSON.stringify(message[2]),
                        'tipo': 'recibidos',
                        'boton': 'stationResponse'
                    };
                    clientenav.write(funciones.constructReply(Response, opCode));
                }else{
                    console.log('Se ha recibido un mensaje desde navegador!')
                    console.log(message);
                    var stationId = message.stationId;
                    if(message.auth=='chatapphdfgjd34534hjdfk'){
                        console.log('mensaje desde apk auth chatapphdfgjd34534hjdfk')
                        message.tipo = 'remoteStopTransaction';
                        stationId = 1;
                    }
                    var stationClient = clientes.get(stationId);    

                    if(stationClient!=undefined){

                        if(message.tipo=='acceptWsHandshake'){
                            console.log('navegador solicita aceptar la conexion')
                            var temporalClient = clientes.get('temporal');
                            const acceptKey = message.acceptKey;
                            const protocol = message.protocol;
                            response = responseHeaders1(acceptKey, protocol);
                            temporalClient.write(response.join('\r\n') + '\r\n\r\n' );
                            //temporalClient.write(funciones.constructReply(response, 0x1));
                        }else if(message.tipo=='ReserveNow'){
                            //PayloadRequest = {"connectorId": 1,"expiryDate":"2022-02-28T11:10:00.000Z","idTag":"7240E49A","reservationId":100};
                            PayloadRequest = {"connectorId": message.connectorId,"expiryDate":message.expiryDate,"idTag":message.idTag,"reservationId":message.reservationId};
                            var OIBCS = [2, '10', message.tipo, PayloadRequest];
                            console.log(OIBCS);
                            stationClient.write(funciones.constructReply(OIBCS, 0x1));
                        }else if(message.tipo=='CancelReservation'){
                            PayloadRequest = {"reservationId": 100};
                            var OIBCS = [2, '10', message.tipo, PayloadRequest];
                            stationClient.write(funciones.constructReply(OIBCS, 0x1));
                        }else if(message.tipo=='RemoteStartTransaction'){
                            perfilcarga={
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
                            PayloadRequest = {"connectorId":message.Conector, "idTag":message.idtag};
                            var OIBCS = [2, '10', message.tipo, PayloadRequest];
                            console.log(OIBCS)
                            stationClient.write(funciones.constructReply(OIBCS, 0x1));

                        }else if(message.tipo=='RemoteStopTransaction'){
                            PayloadRequest = {"idTag":message.idtag};
                            var OIBCS = [2, '10', message.tipo, PayloadRequest];
                            stationClient.write(funciones.constructReply(OIBCS, 0x1));

                        }else if(message.tipo=='ChangeAvailability'){
                            PayloadRequest = {"connectorId":message.Conector, "type":message.Estado};
                            var OIBCS = [2, '10', message.tipo, PayloadRequest];
                            stationClient.write(funciones.constructReply(OIBCS, 0x1));
                        }else if(message.tipo=='ClearCache'){
                            
                            PayloadRequest = {};
                            var OIBCS = [2, 'Cl', message.tipo,PayloadRequest];
                            stationClient.write(funciones.constructReply(OIBCS, 0x1));

                        }else if(message.tipo=='ChangeConfiguration'){

                            PayloadRequest = {"key": 
                            [  'AllowOfflineTxForUnknownId', //si contiene
                               'AuthorizationCacheEnabled',
                               'AuthorizeRemoteTxRequests',
                               //'BlinkRepeat',
                               'ClockAlignedDataInterval',
                               'ConnectionTimeOut',
                               'ConnectorPhaseRotation',
                               //'ConnectorPhaseRotationMaxLength',
                               'GetConfigurationMaxKeys',
                               'HeartbeatInterval',
                               //'LightIntensity',
                               'LocalAuthorizeOffline',
                               'LocalPreAuthorize', 
                               //'MaxEnergyOnInvalidId',
                               'MeterValuesAlignedData',
                               //'MeterValuesAlignedDataMaxLength',
                               'MeterValuesSampledData',
                               //'MeterValuesSampledDataMaxLength',
                               'MeterValueSampleInterval',
                               //'MinimumStatusDuration',
                               'NumberOfConnectors',
                               //'ResetRetries',
                               'StopTransactionOnEVSideDisconnect',
                               
                               //'StopTransactionOnInvalidId', //si funciona
                               //'StopTxnAlignedData',
                               //'StopTxnAlignedDataMaxLength',
                              // 'StopTxnSampledData' // si funciona
                               //'StopTxnSampledDataMaxLength',
                               //'SupportedFeatureProfiles'// si funciona
                               //'SupportedFeatureProfilesMaxLength',
                               //'TransactionMessageAttempts' //si funciona

                               //'TransactionMessageRetryInterval', si funciona 

                               //'UnlockConnectorOnEVSideDisconnect', //si funciona
                               //'WebSocketPingInterval' //si funciona
                               //'LocalAuthListEnabled' // si funciona
                               
                               //'LocalAuthListMaxLength' // si funciona
                               //'SendLocalListMaxLength'// si funciona
                               //'ReserveConnectorZeroSupported' //si funciona pero da contradicciones con la pagina
                               //'ChargeProfileMaxStackLevel'//requerido pero no se reconoce por la estacion
                               //'ChargingScheduleAllowedChargingRateUnit'//requerido pero no se reconoce por la estacion
                               //'ChargingScheduleMaxPeriods' //requerido pero no se reconoce por la estacion
                               //'ConnectorSwitch3to1PhaseSupported'
                               //'MaxChargingProfilesInstalled' // si funciona
                               


                               
                                //csEndPoint
                                //isLittleEndian
                                //csVerifyCert
                                //csAcceptUnknownSelfSigned
                                //cbId
                                //cbUseOcppTSync
                                //cbUsePartialEnergy
                                //cbUsePartialEnergyMeterVal
                                //cbUseJson
                                //cbStopIfConcurrentTx
                                //cbConnTimeOut
                                //cbCacheListMaxLength

                                //cbRequireUserConfirmation
                                //PlugAndChargeEnabled
                                //PlugAndChargeUID
                                //MeterValuesOnlyOnChargingStatus
                                //AllowOfflineTxForUnknownId
                                //AuthorizationCacheEnabled
                                //AuthorizeRemoteTxRequests
                                //ConnectionTimeOut
                                //GetConfigurationMaxKeys
                                //HeartbeatInterval
                                //LocalAuthorizeOffline
                                //LocalPreAuthorize
                                
                                //MeterValuesSampledData
                                //MeterValueSampleInterval
                                //StopTxnSampledData
                                //NumberOfConnectors
                                //ConnectorPhaseRotation
                                //StopTransactionOnEVSideDisconnect
                                //StopTransactionOnInvalidId
                                //SupportedFeatureProfiles
                                //TransactionMessageAttempts
                                //TransactionMessageRetryInterval
                                //UnlockConnectorOnEVSideDisconnect
                                //WebSocketPingInterval
                                
                                //LocalAuthListEnabled
                                //LocalAuthListMaxLength
                                //SendLocalListMaxLength
                                //ReserveConnectorZeroSupported
                                //SupportedFileTransferProtocols
                                //MaxChargingProfilesInstalled
                                //pwStdHost
                                //pwStdUser
                                //pwStdPassword
                                //pwStdUserEdit
                                //pwStdPasswordEdit
                                //pwStdPort

                                //psiUser
                                //psiPassword
                                //psiAdminUser"
                                //psiAdminPassword
                                //psiLoglevel
                                //psiPort
                                //ClockAlignedDataInterval
                                //MeterValuesAlignedData
                                

                           ]
                        
                        };

                            var OIBCS = [2, 'CC', 'GetConfiguration', PayloadRequest];
                            //stationClient.write(funciones.constructReply(OIBCS, 0x1));

                       PayloadRequest1={"key":[
                                'csEndPoint',
                                'isLittleEndian',
                                'csVerifyCert',
                                'csAcceptUnknownSelfSigned',
                                'cbId',
                                'cbUseOcppTSync',
                                'cbUsePartialEnergy',
                                'cbUsePartialEnergyMeterVal',
                                'cbUseJson',
                                'cbStopIfConcurrentTx',
                                'cbConnTimeOut',
                                'cbCacheListMaxLength'
                            ]};

                            //var OIBCS = [2, 'CC12', 'GetConfiguration', PayloadRequest];
                            //stationClient.write(funciones.constructReply(OIBCS, 0x1));
                            //console.log(OIBCS)
                            
                           /* const myTimeout =setTimeout(function(){

                                
                            
                                
                            }, 5000);

                            clearTimeout(myTimeout);*/




                           PayloadRequest2={"key":[
                                'cbRequireUserConfirmation',
                                'PlugAndChargeEnabled',
                                'PlugAndChargeUID',
                                'MeterValuesOnlyOnChargingStatus',
                                'AllowOfflineTxForUnknownId',
                                'AuthorizationCacheEnabled',
                                'AuthorizeRemoteTxRequests',
                                'ConnectionTimeOut',
                                'GetConfigurationMaxKeys',
                                'HeartbeatInterval',
                                'LocalAuthorizeOffline',
                                'LocalPreAuthorize'
                            ]};




                            //var OIBCS = [2, 'CC22', 'GetConfiguration', PayloadRequest];
                            //stationClient.write(funciones.constructReply(OIBCS, 0x1));
                            //console.log(OIBCS)

                            /*const myTimeout2 = setTimeout(function(){

                                var OIBCS = [2, 'CC22', 'GetConfiguration', PayloadRequest];
                                stationClient.write(funciones.constructReply(OIBCS, 0x1));
                                console.log(OIBCS)
                            
                            }, 5000);*/

                            PayloadRequest3={"key":[
                                'MeterValuesSampledData',
                                'MeterValueSampleInterval',
                                'StopTxnSampledData',
                                'NumberOfConnectors',
                                'ConnectorPhaseRotation',
                                'StopTransactionOnEVSideDisconnect',
                                'StopTransactionOnInvalidId',
                                'SupportedFeatureProfiles',
                                'TransactionMessageAttempts',
                                'TransactionMessageRetryInterval',
                                'UnlockConnectorOnEVSideDisconnect',
                                'WebSocketPingInterval'
                            ]};


                            //var OIBCS = [2, 'CC32', 'GetConfiguration', PayloadRequest];
                            //stationClient.write(funciones.constructReply(OIBCS, 0x1));
                            
                            //console.log(OIBCS)
                            
                            /*const myTimeout3 = setTimeout(function(){
                            
                                var OIBCS = [2, 'CC32', 'GetConfiguration', PayloadRequest];
                                stationClient.write(funciones.constructReply(OIBCS, 0x1));
                                console.log(OIBCS)
                            
                            }, 5000);*/

                           PayloadRequest4={"key":[
                                'LocalAuthListEnabled',
                                'LocalAuthListMaxLength',
                                'SendLocalListMaxLength',
                                'ReserveConnectorZeroSupported',
                                'SupportedFileTransferProtocols',
                                'MaxChargingProfilesInstalled',
                                'pwStdHost',
                                'pwStdUser',
                                'pwStdPassword',
                                'pwStdUserEdit',
                                'pwStdPasswordEdit',
                                'pwStdPort'
                            ]};

                            //var OIBCS = [2, 'CC42', 'GetConfiguration', PayloadRequest];
                            //stationClient.write(funciones.constructReply(OIBCS, 0x1));
                            //console.log(OIBCS)

                            /*const myTimeout4 = setTimeout(function(){

                            
                                var OIBCS = [2, 'CC42', 'GetConfiguration', PayloadRequest];
                                stationClient.write(funciones.constructReply(OIBCS, 0x1));
                                console.log(OIBCS)
                            
                            }, 5000);*/

                            PayloadRequest5={"key":[
                                'psiUser',
                                'psiPassword',
                                'psiAdminUser',
                                'psiAdminPassword',
                                'psiLoglevel',
                                'psiPort',
                                'ClockAlignedDataInterval',
                                'MeterValuesAlignedData'
                            ]};

                            //PayloadRequest={"key":'csEndPoint',"value":"ws://192.168.222.201:3000"};

                            var OIBCS = [2, 'CC52', 'GetConfiguration', PayloadRequest1];
                            //var OIBCS = [2, 'CC52', 'ChangeConfiguration', PayloadRequest1];
                            
                            stationClient.write(funciones.constructReply(OIBCS, 0x1));
                            console.log(OIBCS)


                            /*const myTimeout5 = setTimeout(function (){

                            
                                var OIBCS = [2, 'CC52', 'GetConfiguration', PayloadRequest];
                                stationClient.write(funciones.constructReply(OIBCS, 0x1));
                                console.log(OIBCS)
                            
                            }, 5000);*/

                            //PayloadRequest = {"key": ["csEndPoint"]};
                            //PayloadRequest = {"key": "AllowOfflineTxForUnknownId", "value": 'true'};
                            
                            //var OIBCS = [2, '10', message.tipo, PayloadRequest];
                            
                            //var OIBCS = [2, 'CC', 'GetConfiguration', PayloadRequest];
                            //stationClient.write(funciones.constructReply(OIBCS, 0x1));

                        }else if(message.tipo=='ChConfiguration'){
                            PayloadRequest = {"key": message.key, "value": message.valor};
                            var OIBCS = [2, '10', 'ChangeConfiguration', PayloadRequest];
                            stationClient.write(funciones.constructReply(OIBCS, 0x1));
                        
                        }else if(message.tipo=='GetCompositeSchedule'){
                            PayloadRequest = {"connectorId": 3, "duration": 3600, 'chargingRateUnit': 'W'};
                            var OIBCS = [2, 'abc', message.tipo, PayloadRequest];
                        }else if(message.tipo=='UnlockConnector'){
                            PayloadRequest = {"connectorId":message.Conector};
                            var OIBCS = [2, 'abc', message.tipo, PayloadRequest];
                            stationClient.write(funciones.constructReply(OIBCS, 0x1));
                        }else if(message.tipo=='SendLocalList'){
                            PayloadRequest = {
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
                            var OIBCS = [2, '10', message.tipo, PayloadRequest];
                            stationClient.write(funciones.constructReply(OIBCS, 0x1));
                        }else if(message.tipo=='GetDiagnostics'){
                            PayloadRequest = {"location": uriFTP};
                            var OIBCS = [2, '10', message.tipo, PayloadRequest];
                            stationClient.write(funciones.constructReply(OIBCS, 0x1));
                        }else if(message.tipo=='ClearChargingProfile'){
                            PayloadRequest = {};
                            var OIBCS = [2, '10', message.tipo, PayloadRequest];
                            stationClient.write(funciones.constructReply(OIBCS, 0x1));
                        }else if(message.tipo=='GetLocalListVersion'){
                            PayloadRequest = {};
                            var OIBCS = [2, '10', message.tipo, PayloadRequest];
                            stationClient.write(funciones.constructReply(OIBCS, 0x1));
                        }else if(message.tipo=='Reset'){

                            PayloadRequest = {'type':message.Type};
                            
                            var OIBCS = [2, '10', message.tipo, PayloadRequest];
                            stationClient.write(funciones.constructReply(OIBCS, 0x1));




                        }else if(message.tipo=='SetChargingProfile'){
                            PayloadRequest = {
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
                            
                            var OIBCS = [2, '10', message.tipo, PayloadRequest];
                            stationClient.write(funciones.constructReply(OIBCS, 0x1));
                        }else if(message.tipo=='GetConfiguration'){
                            /*PayloadRequest = {"key": ['SupportedFileTransferProtocols', 
                            'GetConfigurationMaxKeys',
                            'MeterValuesSampledData',
                            'NumberOfConnectors',
                            'UnlockConnectorOnEVSideDisconnect',
                            'LocalAuthListEnabled', 
                            'ChargeProfileMaxStackLevel',
                            'ChargingScheduleMaxPeriods',
                            'ConnectorSwitch3to1PhaseSupported',
                            'MaxChargingProfilesInstalled'
                            ]};*/

                            //PayloadRequest = {"key": ['LocalPreAuthorize', 
                            //'LocalAuthorizeOffline',
                            //'AuthorizationCacheEnabled'
                            //]}  
                             PayloadRequest = {"key": 
                             [  'AllowOfflineTxForUnknownId', //si contiene
                                'AuthorizationCacheEnabled',
                                'AuthorizeRemoteTxRequests',
                                //'BlinkRepeat',
                                'ClockAlignedDataInterval',
                                'ConnectionTimeOut',
                                'ConnectorPhaseRotation',
                                //'ConnectorPhaseRotationMaxLength',
                                'GetConfigurationMaxKeys',
                                'HeartbeatInterval',
                                //'LightIntensity',
                                'LocalAuthorizeOffline',
                                'LocalPreAuthorize', 
                                //'MaxEnergyOnInvalidId',
                                'MeterValuesAlignedData',
                                //'MeterValuesAlignedDataMaxLength',
                                'MeterValuesSampledData',
                                //'MeterValuesSampledDataMaxLength',
                                'MeterValueSampleInterval',
                                //'MinimumStatusDuration',
                                'NumberOfConnectors',
                                //'ResetRetries',
                                'StopTransactionOnEVSideDisconnect',
                                'StopTransactionOnInvalidId',
                                //'StopTxnAlignedData',
                                //'StopTxnAlignedDataMaxLength',
                                'StopTxnSampledData',
                                //'StopTxnSampledDataMaxLength',
                                //'SupportedFeatureProfiles'//error
                                //'SupportedFeatureProfilesMaxLength',
                                //'TransactionMessageAttempts'
                                'TransactionMessageRetryInterval',
                                //'UnlockConnectorOnEVSideDisconnect', //error
                                //'WebSocketPingInterval' //error
                                //'LocalAuthListEnabled' //error
                                
                                //'LocalAuthListMaxLength' // si funciona
                                //'SendLocalListMaxLength'// si funciona
                                //'ReserveConnectorZeroSupported' //si funciona
                                //'ChargeProfileMaxStackLevel'
                                //'ChargingScheduleAllowedChargingRateUnit'//error
                                //'ChargingScheduleMaxPeriods'
                                //'ConnectorSwitch3to1PhaseSupported' //error
                                //'MaxChargingProfilesInstalled' //error

                            ]}  

                            
                            var OIBCS = [2, 'GC', message.tipo, PayloadRequest];
                            stationClient.write(funciones.constructReply(OIBCS, 0x1));



                        }else{
                            /*clientenav = clientes.get(0);
                            PayloadResponse = await ffsnav.funcionesNuevasNav(message, clientes)
                            console.log('                                            ');
                            console.log('El servidor respondes-------------------')
                            let CallResult = [CallResultId, UniqueId, PayloadResponse]; 
                            console.log(CallResult);
                            socket.write(funciones.constructReply(CallResult, opCode));*/
                            console.log('La operacion OCPP solicitada por el navegador aun no ha sido implementada')
                        }

                    }else{
                        clientenav = clientes.get(0);
                        var Response = {
                            'texto': 'No hay una estacion conectada',
                            'tipo': 'recibidos',
                            'boton': 'stationResponse'
                        };
                        if(clientenav){
                            clientenav.write(funciones.constructReply(Response, opCode));
                        }else{
                            console.log('navegador no conectado');
                        }
                    }
                };

            }else if(opCode === 0x9){
                console.log('Entra a op9')
                console.log('Tipo de dato: ping');
                console.log('Contenido: ');
                console.log(message);
                console.log('                                            ');
                console.log('El servidor responde con un pong: ');
                console.log(message);
                socket.write(funciones.constructReply(message, opCode));
                var textnav;
                var id_est = getByValue(clientes, socket);
                let ide = 'ping'+id_est;
                console.log('id de estacion html ' + ide);
                textnav = {'tipo':'ping', 'boton':ide, 'texto':'Recibiendo Pings'};
                
                cliente = clientes.get(0);
                console.log('este es el cliente: ');
                console.log(clientes.keys());
                
                if (cliente){
                    console.log('Si existe el cliente: ')
                    cliente.write(funciones.constructReply(textnav, 1));
                }
            }
        });
    }); 
};


