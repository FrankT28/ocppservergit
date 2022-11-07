//const ws = new WebSocket('ws://localhost:3000/navegador');
const ws = new WebSocket('ws://serverocpp.herokuapp.com/navegador');

/*=============================================================================================*/
ws.addEventListener('open', () => {
    console.log('Conectado al servidor a traves de ws')
});

/*=============================================================================================*/
ws.addEventListener('message', event => {
    let message = event.data;
    console.log('Mensaje desde el servidor:', message);
    try {
        var parsedMessage = JSON.parse(message);
    } catch (error) {
        console.error('No se pudo parsear a JSON el mensaje');
    }

    var boton = parsedMessage.boton;
    var texto = parsedMessage.texto;
    var tipo = parsedMessage.tipo;
    var unID = parsedMessage.unid; 

    if(tipo=='recibido'){
        recibidoAction(boton, texto);
    }else if(tipo=='unathorized'){
        unathorizedAction(boton);
    }else if(tipo=='meterValues'){
        meterValuesAction(boton);
    }else if(tipo=='estado'){
        estadoAction(boton);
    }else if(tipo=='ping'){
        pingAction(boton);
    }else if(tipo=='status'){
        statusAction(boton, texto);
    }else{
        notImplementedAction();
    }
});

/*=============================================================================================*/
function recibidoAction(boton, texto){
    console.log('Se ha recibido configuración');
    console.log('Esto es el tipo de texto de configuracion: ' + typeof(texto));
    descripcion(8, texto.configurationKey);
    document.getElementById(boton).innerHTML = texto;
};

/*=============================================================================================*/
function unathorizedAction(boton){
    const acceptKey = parsedMessage.acceptKey;
    const protocol = parsedMessage.protocol;
    document.getElementById('firstWSHandshake').style.display = 'block';
    document.getElementById('waitingHS').style.display = 'none';
    var storedValueCode = localStorage.getItem("stationCode");
    var storedValueName = localStorage.getItem("stationName");
    var storedValueConnector = localStorage.getItem("connectorNumber");
    console.log('Estos son los valores guardados: ');
    console.log(storedValueCode);
    console.log(storedValueName);
    console.log(storedValueConnector);
    console.log('Este es el texto url: ');
    console.log(texto);

    console.log('Este es el accept: ');
    console.log(acceptKey);
    console.log('Este es el protocol: ');
    console.log(protocol);
    localStorage.setItem("acceptKey", acceptKey);
    localStorage.setItem("protocol", protocol);

    if(texto==storedValueCode){
        console.log('Los codigos coinciden');
    }else{
        console.log('Se debe rechazar la conexion')
    }
}

/*=============================================================================================*/
function meterValuesAction(boton){
    llenartabla(texto);
    console.log('Estos son los valores medidos-------------------')
    for (const property in texto){
        let sampledValue = texto[property];
        for (const property1 in sampledValue){
            console.log(property1 + ' : ' + sampledValue[property1])
        };
    };
};

/*=============================================================================================*/
function estadoAction(boton){
    document.getElementById(boton).innerHTML = texto;
}

/*=============================================================================================*/
function pingAction(boton){
    element = document.getElementById(boton)
    element.style.color = "green";
}

/*=============================================================================================*/
function statusAction(boton, texto){
    if(texto=='cargando'){
       console.log('Se esta cargando xdxdxdxd')
    }else{
        console.log('Entra status Notification');
        console.log('boton: ' + boton   )
        element = document.getElementById(boton)
        element.innerHTML = texto;
    }
}

/*=============================================================================================*/
function chconfiguration(stationId, keyOp, boxvalue){    
    var PayloadRequest = JSON.stringify({"tipo": "ChConfiguration", "stationId": stationId, "key":keyOp, "valor":document.getElementById(boxvalue).value});
    ws.send(PayloadRequest);

}

/*=============================================================================================*/
function notImplementedAction(){
    return '';
}

/*=============================================================================================*/
const $messageForm1 = $('#acceptWsHandshake');    
$messageForm1.click( e => {
    console.log('Se va a aceptar la conexion:');
    e.preventDefault();
    const jsons = JSON.stringify({"tipo": "acceptWsHandshake", 'text':'conexion aceptada', 'message':'Esto es mensaje'});
    socket.send(jsons);
});