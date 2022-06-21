const crypto = require('crypto');
const { urlencoded, text } = require('express');
//const { url } = require('inspector');
const { type } = require('os');
const pool = require('./database.js');
const funciones = require('./funciones1.js');
var clientes = new Map();
const ffs = require('./ocppFunctions');
const ffsnav = require('./ocppFunctionsServer');
const path = require('path');
const { networkInterfaces } = require('os');

const nets = networkInterfaces();
const results = Object.create(null); // Or just '{}', an empty object




/*
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
*/
/*console.log('Esta es mi IP: ');
console.log(miIp);

const FtpSrv = require('ftp-srv');
*/

/*const miIp = '192.168.222.201';
const miIpLocal = '192.168.1.20';*/
//miIp = '192.168.222.201';
/*const uriFTP = 'ftp://'+miIp+':21/';
//const uriFTP = 'ftp://192.168.222.201:21/';
//const uriFTP = 'ftp://192.168.1.10:21/';
const ftpServer = new FtpSrv({'url': uriFTP,
'greeting': 'Saludo de bienvenida desde servidor OCPP'});
const blacklist = [];
const whitelist = ['DIR', 'PWD', 'CWD', 'TYPE', 'PASV', 'PORT', 'LIST', 'STOR'];*/

/*
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
*/

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

const getParsedBuffer = buffer => {
    const firstByte = buffer.readUInt8(0);
    const opCode = firstByte & 0xF;
    const fin = (firstByte >>> 7) & 0x1;

    const secondByte = buffer.readUInt8(1); 
    const isMasked = Boolean((secondByte >>> 7) & 0x1);
    console.log('ismkased');
    console.log(isMasked)
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
        console.log('entra a ismasked')
      // ......... I skip masked code as it's too long and not masked shows the idea same way
      for (let i = 0, j = 0; i < payloadLength; ++i, j = i % 4) {
          const shift = j == 3 ? 0 : (3 - j) << 3; 
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
  
    

    return { payload, bufferRemainingBytes };
  }


const debugBuffer = (bufferName, buffer) => {
    const length = buffer ? buffer.length : '---';
  
    //console.log(`:: DEBUG - ${bufferName} | ${length} | `, buffer, '\n');
  };

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
        console.log('resultado sql de estaciones');
        console.log(estaciones)


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
        }
     
        console.log('Estado del socket: ' + socket.readyState);
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
                    //return [cadena, opCode]

                    console.log('Esto es parsedbuffer');
                    console.log(cadena);
                  // .........
                  // handle the payload as you like, for example send to other sockets
                }
              } while (parsedBuffer.payload && parsedBuffer.bufferRemainingBytes.length);
          
              console.log('----------------------------------------------------------------\n');
            

            
        });
    }); 
};


