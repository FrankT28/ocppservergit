const getParsedBuffer = buffer => {
  // .........
  
  // whenever I want to read X bytes I simply check if I really can read X bytes
  if (currentOffset + 2 > buffer.length) {
    return { payload: null, bufferRemainingBytes: buffer };
  }
  payloadLength = buffer.readUInt16BE(currentOffset);
  currentOffset += 2;
  
  // .........
  
  // in 99% of cases this will prevent the ERR_OUT_OF_RANGE error to happen
  if (currentOffset + payloadLength > buffer.length) {
    console.log('[misalignment between WebSocket frame and NodeJs Buffer]\n');
    return { payload: null, bufferRemainingBytes: buffer };
  }

  payload = Buffer.alloc(payloadLength);

  if (isMasked) {
    // ......... I skip masked code as it's too long and not masked shows the idea same way
    for (let i = 0, j = 0; i < payloadLength && i<Buffer.byteLength(buffer); ++i, j = i % 4) {
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