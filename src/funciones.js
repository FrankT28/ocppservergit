function parseMessage (buffer) {
  const firstByte = buffer.readUInt8(0);
  const opCode = firstByte & 0xF;
  const fin = (firstByte >>> 7) & 0x1;
  console.log('bit fin: ' + fin)
  console.log('opcode: ' + opCode)

  if (opCode === 0x8) 
     return null; 
  if (opCode === 0x1 || opCode === 0x9) {
    const secondByte = buffer.readUInt8(1); 
    const isMasked = Boolean((secondByte >>> 7) & 0x1);
    let currentOffset = 2; let payloadLength = secondByte & 0x7F; 
    
    if (payloadLength > 125) { 
      if (payloadLength === 126) { 
        payloadLength = buffer.readUInt16BE(currentOffset);
        currentOffset += 2; 
      } else {  
        throw new Error('Large payloads not currently implemented'); 
      } 
    }

    let maskingKey;
    if (isMasked) {
      maskingKey = buffer.readUInt32BE(currentOffset);
      currentOffset += 4;
    }
    console.log('payloadlength');
    console.log(payloadLength);

    console.log('buffer size');
    console.log(Buffer.byteLength(buffer));

 
    const data = Buffer.alloc(payloadLength);
    if (isMasked) {
      for (let i = 0, j = 0; i < payloadLength && i<8; ++i, j = i % 4) {
        const shift = j == 3 ? 0 : (3 - j) << 3; 
        const mask = (shift == 0 ? maskingKey : (maskingKey >>> shift)) & 0xFF;
        try {
          const source = buffer.readUInt8(currentOffset++);
        } catch (error) {
          const source = '';
          console.log('El error es el siguiente')
          console.error(error);
        }
        data.writeUInt8(mask ^ source, i); 
      }
    } else {        
      buffer.copy(data, 0, currentOffset++);
    }

    const json = data.toString('utf8'); 
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
    return [cadena, opCode]
  }
}; 

function constructReply (data, opc) {
  const json = JSON.stringify(data)
  const jsonByteLength = Buffer.byteLength(json);
  const lengthByteCount = jsonByteLength < 126 ? 0 : 2; 
  const payloadLength = lengthByteCount === 0 ? jsonByteLength : 126; 
  const buffer = Buffer.alloc(2 + lengthByteCount + jsonByteLength);
  if (opc === 1){
    buffer.writeUInt8(0b10000001, 0); 
  } else if(opc === 9){
    buffer.writeUInt8(0b10001010, 0); 
  }
  buffer.writeUInt8(payloadLength, 1); 
  let payloadOffset = 2; 
  if (lengthByteCount > 0) { 
      buffer.writeUInt16BE(jsonByteLength, 2); payloadOffset += lengthByteCount; 
  } 
  buffer.write(json, payloadOffset); 
  return buffer;
};

module.exports.constructReply = constructReply;
module.exports.parseMessage = parseMessage;