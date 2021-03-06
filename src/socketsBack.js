const crypto = require('crypto');
const { urlencoded, text } = require('express');
const { type } = require('os');
const pool = require('./database.js');
const funciones = require('./funciones.js');
var clientes = new Map();
const ocppClient = require('./ocppStationOperations');
const ocppServer = require('./ocppServerOperations');
const path = require('path');
const { networkInterfaces } = require('os');

const nets = networkInterfaces();
const results = Object.create(null);

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

function getByValue(map, searchValue) {
    for (let [key, value] of map.entries()) {
      if (value === searchValue)
        return key;
    }
}

const getParsedBuffer = buffer => {
    const firstByte = buffer.readUInt8(0);
    const opCode = firstByte & 0xF;
    const fin = (firstByte >>> 7) & 0x1;

    const secondByte = buffer.readUInt8(1); 
    const isMasked = Boolean((secondByte >>> 7) & 0x1);
    let currentOffset = 2; let payloadLength = secondByte & 0x7F; 
    
    if (payloadLength > 125) {
        if (payloadLength === 126) {
            // whenever I want to read X bytes I simply check if I really can read X bytes
            if (currentOffset + 2 > buffer.length) {
                return { payload: null, bufferRemainingBytes: buffer };
            }
            payloadLength = buffer.readUInt16BE(currentOffset);
            currentOffset += 2;
        }
    }
    
    let maskingKey;
    if (isMasked) {
      maskingKey = buffer.readUInt32BE(currentOffset);
      currentOffset += 4;
    } 
    
    // in 99% of cases this will prevent the ERR_OUT_OF_RANGE error to happen
    if (currentOffset + payloadLength > buffer.length) {
      console.log('[misalignment between WebSocket frame and NodeJs Buffer]\n');
      return { payload: null, bufferRemainingBytes: buffer };
    }
  
    payload = Buffer.alloc(payloadLength);
  
    if (isMasked) {
      // ......... I skip masked code as it's too long and not masked shows the idea same way
      for (let i = 0, j = 0; i < payloadLength; ++i, j = i % 4) {
          const shift = j == 3 ? 0 : (3???-???j) << 3; 
          const mask = (shift == 0 ? maskingKey : (maskingKey >>> shift)) & 0xFF;
          const source = buffer.readUInt8(currentOffset++);
          payload.writeUInt8(mask ^ source, i);  
      }
    } else {
      for (let i = 0; i < payloadLength; i++) {
        payload.writeUInt8(buffer.readUInt8(currentOffset++), i);
      }
    }
  
    // it could also happen at this point that we already have a valid WebSocket payload
    // but there are still some bytes remaining in the buffer
    // we need to copy all unused bytes and return them as bufferRemainingBytes
    bufferRemainingBytes = Buffer.alloc(buffer.length - currentOffset);
    //                                  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ this value could be >= 0
    for (let i = 0; i < bufferRemainingBytes.length; i++) {
      bufferRemainingBytes.writeUInt8(buffer.readUInt8(currentOffset++), i);
    }
    return { payload, bufferRemainingBytes, opCode };
}


const debugBuffer = (bufferName, buffer) => {
    const length = buffer ? buffer.length : '---';
    //console.log(`:: DEBUG - ${bufferName} | ${length} | `, buffer, '\n');
};

/*=============================================================================================*/
//UNIQUE ID: ESTA FUNCION GENERA EL UNIQUEID DEL MENSAJE ENVIADO A LA ESTACION
/*=============================================================================================*/
async function getUniqueId(){
    let sql = "SELECT id_mensaje_servidor FROM mensajes_desde_servidor DESC LIMIT 1";
    let result = await pool.query(sql);
    let id = result[0].id_mensaje_servidor;
    return id;
}

/*=============================================================================================*/
//AQUI SE EXPORTA EL MODULO SOCKET
/*=============================================================================================*/
module.exports = function(server){
    server.on('upgrade',  async(req, socket) => { 
        let bufferToParse = Buffer.alloc(0); // at the beginning we just start with 0 bytes
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

        if(estaciones.length!=0){
            response = responseHeaders(req);
            clave = estaciones[0].id_estacion;
            socket.write(response.join('\r\n') + '\r\n\r\n' );
        }else{
            if(url_est=='navegador'){
                console.log('El navegador quiere conectarse')
                response = responseHeaders(req);
                clave = 0;
                socket.write(response.join('\r\n') + '\r\n\r\n' );
            }
        }
     
        if(socket.readyState=='open'){
            clientes.set(clave, socket);
        };

        socket.on("data", async(buffer) => {
            /*==========================================================================*/
            //INICIA CODIGO NUEVO
            /*==========================================================================*/
            let parsedBuffer;

            // concat 'past' bytes with the 'current' bytes
            bufferToParse = Buffer.concat([bufferToParse, buffer]);

            do {
                parsedBuffer = getParsedBuffer(bufferToParse);
          
                // the output of the debugBuffer calls will be on the screenshot later
                debugBuffer('buffer', buffer);
                debugBuffer('bufferToParse', bufferToParse);
                debugBuffer('parsedBuffer.payload', parsedBuffer.payload);
                debugBuffer('parsedBuffer.bufferRemainingBytes', parsedBuffer.bufferRemainingBytes);
          
                bufferToParse = parsedBuffer.bufferRemainingBytes;
          
                if (parsedBuffer.payload) {

                    const json = parsedBuffer.payload.toString('utf8'); 
                    function IsJsonString(str) {
                        var cad;
                        try {
                            cad = JSON.parse(str);
                        } catch (e) {
                            cad = str;
                        }
                        return cad;
                    };

                    var cadena = IsJsonString(json);
                    if (cadena==null){
                        return;
                    };

                    var message = cadena; 
                    console.log('                                      ');
                    console.log('El servidor ha recibido datos----------------------------------------------------------------------');
                    const opCode = parsedBuffer.opCode;
                    const CallId = 2;
                    const CallResultId = 3;
                    const CallErrorId = 4;

                    //AQUI SE VAN A MANEJAR LOS CASOS EN LOS QUE EL SEVIDOR RECIBA MENSAJES DE TEXTO DESDE WEBSOCKET
                    if (opCode === 0x1) {
                        const MessageTypeId = message[0];
                        const UniqueId = message[1];
                        var PayloadResponse;

                        if (MessageTypeId==2){

                            //AQUI FALTA IMPLEMENTAR EL CASO CallErrorId = 4, QUE ES CUANDO 
                            //EL REQUEST HECHO DESDE UNA ESTACION DA UN ERROR
                            /*************Respuesta para punto de carga*************** */
                            Respuestas = await ocppClient.processOcppRequest(message);
                            PayloadResponse = Respuestas[0];
                            PayloadResponseNav = Respuestas[1];
                            PayloadResponseApk = Respuestas[2];
                            console.log('                                            ');
                            let CallResult = [CallResultId, UniqueId, PayloadResponse]; 
                            console.log('Respuesta a enviar al punto de carga: ')
                            console.log(CallResult);
                            socket.write(funciones.constructReply(CallResult, opCode));
                            /*************Respuesta para APK****************/
                            console.log('respuesta para apk: ');
                            console.log(PayloadResponseApk);
                            var clienteApk = clientes.get(2);
                            if(clienteApk && PayloadResponseApk){
                                clienteApk.write(funciones.constructReply(PayloadResponseApk, opCode))
                            }else{
                                console.log('APK no conectado');
                            }
                            console.log('clientes: ');
                            console.log(clientes.keys())
                            /*************Respuesta para navegador****************/
                            if(PayloadResponseNav){
                                clientenav = clientes.get(0);
                                if(clientenav){
                                    var id_est = getByValue(clientes, socket);
                                    PayloadResponseNav.boton = PayloadResponseNav.tipo + id_est;
                                    clientenav.write(funciones.constructReply(PayloadResponseNav, opCode))
                                }else{

                                } 
                            }
                        }
                        /***********************************************************/
                        //ESTE CASO SE DA CUANDO LA ESTACION RESPONDE A UN CALL REALIZADO DESDE EL SERVIDOR.
                        else if (MessageTypeId==3){
                            clientenav = clientes.get(0);
                            console.log('Se ha recibido un MessageTypeId igual a 3!')
                            console.log(message[2]);
                            console.log('Este es el uniqueID');
                            console.log(message[1]);
                            var Response = {
                                'texto': message[2],
                                'tipo': 'recibidos',
                                'boton': 'stationResponse',
                                'unid': UniqueId
                            };
                            clientenav.write(funciones.constructReply(Response, opCode));   
                        }

                        /***********************************************************/
                        //ESTE CASO SE DA CUANDO EL SERVIDOR HACE UN REQUEST A LA ESTACION
                        //Y SE DA UN ERROR
                        else if (MessageTypeId==4){
                            clientenav = clientes.get(0);
                            console.log('Se ha recibido un MessageTypeId igual a 4!, que significa algun error')
                            console.log(message[2]);
                            var Response = {
                                'texto': JSON.stringify(message[2]),
                                'tipo': 'recibidos',
                                'boton': 'stationResponse'
                            };
                            clientenav.write(funciones.constructReply(Response, opCode));
                        }

                        /*******************************************************************/
                        //AQUI VAMOS A MANEJAR LOS MENSAJES OCPP QUE SE ENVIAN DESDE LA INTERFAZ WEB
                        else{
                            console.log('Se ha recibido un mensaje desde navegador!')
                            console.log(message);
                            var stationId = message.stationId;
                            var stationClient = clientes.get(stationId);    
                            CallResultId = 2;
                            if(stationClient!=undefined){

                                let uniqueId = getUniqueId();

                                Respuestas = await ocppServer.processOcppRequestFromBrowser(message);
                                PayloadResponse = Respuestas[0];
                                PayloadResponseNav = Respuestas[1];
                                PayloadResponseApk = Respuestas[2]; 

                                //stationClient.write(funciones.constructReply(OIBCS, 0x1));

                                console.log('                                            ');
                                let CallResult = [CallResultId, uniqueId, PayloadResponse]; 
                                console.log('Respuesta a enviar al punto de carga: ');
                                console.log(CallResult);
                                stationClient.write(funciones.constructReply(CallResult, opCode));
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
                    }
                
                    //AQUI SE VAN A MANEJAR LOS MENSAJES ENVIADOS AL SERVIDOR DEL TIPO PING, YA SEA DESDE UNA ESTACION O UN NAVEGADOR
                    else if(opCode === 0x9){
                        console.log('Entra a op9')
                        console.log('Tipo de dato: ping');
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
                }
            } while (parsedBuffer.payload && parsedBuffer.bufferRemainingBytes.length);
            console.log('----------------------------------------------------------------\n');
        });
    }); 
};