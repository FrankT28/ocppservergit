//const ws = new WebSocket('ws://localhost:3000/navegador');
const ws = new WebSocket('ws://serverocpp.herokuapp.com/navegador');

function chconfiguration(stationId, keyOp, boxvalue){    
    var PayloadRequest = JSON.stringify({"tipo": "ChConfiguration", "stationId": stationId, "key":keyOp, "valor":document.getElementById(boxvalue).value});
    ws.send(PayloadRequest);

 }

ws.addEventListener('open', () => {
    console.log('Conectado al servidor')
});

ws.addEventListener('message', event => {
    console.log('Mensaje desde el servidor:', event.data);
    console.log('Tipo de dato: ' + typeof(event.data));
    try {
        var js1 = JSON.parse(event.data);
        console.log('este es js1')
        console.log(js1)
    } catch (error) {
        console.error('No se pudo parsear');
    }


    const boton = js1.boton;
    const texto = js1.texto;
    const tipo = js1.tipo;
    const unID = js1.unid;

    console.log('boton: ' + boton);
    console.log('texto: ' + texto);
    console.log('tipo: ' + tipo);
    console.log('unID: ' + unID);


    if(tipo=='recibido'){
        console.log('Se ha recibido configuración');
        console.log('Esto es el tipo de texto de configuracion: ' + typeof(texto));
        descripcion(8, texto.configurationKey);
        document.getElementById(boton).innerHTML = texto;
    };

    if(tipo=='UnautorizedClient'){
        const acceptKey = js1.acceptKey;
        const protocol = js1.protocol;
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

    /*if(tipo=='recibidos'){
        document.getElementById(boton).innerHTML = 'No hay vehículo eléctrico conectado';
    };*/

    if(tipo=='recibidos'){
        document.getElementById(boton).innerHTML = texto;
        
        if(unID=="GC"){
            console.log('Si ingresa aqui')
            console.log(js1.texto)
            console.log(js1.texto.configurationKey[0].value)

            ventana_configuracion.innerHTML=
                "<div><div class=container_key>AllowOfflineTxForUnknownId</div><div class=container_conf>Value:<br>"+js1.texto.configurationKey[0].value+"</div></div>"+
                "<div><div class=container_key>AuthorizationCacheEnabled</div><div class=container_conf>Value:<br>"+js1.texto.configurationKey[1].value+"</div></div>"+
                "<div><div class=container_key>AuthorizeRemoteTxRequests</div><div class=container_conf>"+js1.texto.configurationKey[2].value+"</div></div>"+
                "<div><div class=container_key>ClockAlignedDataInterval</div><div class=container_conf>"+js1.texto.configurationKey[3].value+"</div></div>"+
                "<div><div class=container_key>ConnectionTimeOut</div><div class=container_conf>"+js1.texto.configurationKey[4].value+"</div></div>"+
                "<div><div class=container_key>ConnectorPhaseRotation</div><div class=container_conf>"+js1.texto.configurationKey[5].value+"</div></div>"+
                "<div><div class=container_key>GetConfigurationMaxKeys</div><div class=container_conf>"+js1.texto.configurationKey[6].value+"</div></div>"+
                "<div><div class=container_key>HeartbeatInterval</div><div class=container_conf>"+js1.texto.configurationKey[7].value+"</div></div>"+
                "<div><div class=container_key>LocalAuthorizeOffline</div><div class=container_conf>"+js1.texto.configurationKey[8].value+"</div></div>"+
                "<div><div class=container_key>LocalPreAuthorize</div><div class=container_conf>"+js1.texto.configurationKey[9].value+"</div></div>"+
                "<div><div class=container_key>MeterValuesAlignedData</div><div class=container_conf>"+js1.texto.configurationKey[10].value+"</div></div>"+
                "<div><div class=container_key>MeterValuesSampledData</div><div class=container_conf>"+js1.texto.configurationKey[11].value+"</div></div>"+
                "<div><div class=container_key>MeterValueSampleInterval</div><div class=container_conf>"+js1.texto.configurationKey[12].value+"</div></div>"+
                "<div><div class=container_key>NumberOfConnectors</div><div class=container_conf>"+js1.texto.configurationKey[13].value+"</div></div>"+
                "<div><div class=container_key>StopTransactionOnEVSideDisconnect</div><div class=container_conf>"+js1.texto.configurationKey[14].value+"</div></div>"
                //"<div><div class=container_key>StopTransactionOnInvalidId</div><div class=container_conf>"+js1.texto.configurationKey[15].value+"</div></div>"+
                //"<div><div class=container_key>StopTxnSampledData</div><div class=container_conf>"+js1.texto.configurationKey[16].value+"</div></div>"+
                //"<div><div class=container_key>TransactionMessageRetryInterval</div><div class=container_conf>"+js1.texto.configurationKey[17].value+"</div></div>"+
                //"<div><div class=container_key>WebSocketPingInterval</div><div class=container_conf></div></div>"+
                //"<div><div class=container_key>LocalAuthListMaxLength</div><div class=container_conf></div></div>"+
                //"<div><div class=container_key>SendLocalListMaxLength</div><div class=container_conf></div></div>"+
                //"<div><div class=container_key>ReserveConnectorZeroSupported</div><div class=container_conf></div></div>";

        }

        else if(unID=="CC"){
            var contenido;
            //var keyOp;
            console.log('asi se ve un true')
            console.log(js1.texto.configurationKey[0].value)
            if(js1.texto.configurationKey[0].value=="true"){
                keyOp="AllowOfflineTxForUnknownId";
                boxkey="box_AllowOfflineTxForUnknownId";
                contenido=                
                "<div><div class=container_key>AllowOfflineTxForUnknownId</div><div class=container_conf>Value:<br>"+
                    "<select id='box_AllowOfflineTxForUnknownId'>"+
                    "<option selected='selected  value='true'>true</option>" +
                    "<option 'value='false'>false</option>"+
                "</select>"+
                "<div><button onclick='chconfiguration(1,\""+keyOp+"\",\""+boxkey+"\")'>Aceptar</button></div>"+
                "</div></div>";
            }
            else{
                keyOp='csAcceptUnknownSelfSigned';
                boxkey="box_AllowOfflineTxForUnknownId";
                contenido=
                "<div><div class=container_key>AllowOfflineTxForUnknownId</div><div class=container_conf>Value:<br>"+
                    "<select id='box_AllowOfflineTxForUnknownId'>"+
                    "<option value='true'>true</option>" +
                    "<option selected='selected 'value='false'>false</option>"+
                "</select>"+
                "<div><button onclick='chconfiguration(1,\""+keyOp+"\",\""+boxkey+"\")'>Aceptar</button></div>"+
                "</div></div>";

            }

            if(js1.texto.configurationKey[1].value=="true"){
                keyOp='AuthorizationCacheEnabled';
                boxkey="box_AuthorizationCacheEnabled";
                contenido+=                
                "<div><div class=container_key>AuthorizationCacheEnabled</div><div class=container_conf>Value:<br>"+
                    "<select id='box_AuthorizationCacheEnabled'>"+
                    "<option selected='selected  value='true'>true</option>" +
                    "<option 'value='false'>false</option>"+
                "</select>"+
                "<div><button onclick='chconfiguration(1,\""+keyOp+"\",\""+boxkey+"\")'>Aceptar</button></div>"+
                "</div></div>";
            }
            else{
                keyOp='AuthorizationCacheEnabled';
                boxkey="box_AuthorizationCacheEnabled";
                contenido+=
                "<div><div class=container_key>AuthorizationCacheEnabled</div><div class=container_conf>Value:<br>"+
                    "<select id='box_AuthorizationCacheEnabled'>"+
                    "<option value='true'>true</option>" +
                    "<option selected='selected 'value='false'>false</option>"+
                "</select>"+
                "<div><button onclick='chconfiguration(1,\""+keyOp+"\",\""+boxkey+"\")'>Aceptar</button></div>"+
                "</div></div>";

            }

            if(js1.texto.configurationKey[2].value=="true"){
                keyOp='AuthorizeRemoteTxRequests';
                boxkey="box_AuthorizeRemoteTxRequests";
                contenido+=                
                "<div><div class=container_key>AuthorizeRemoteTxRequests</div><div class=container_conf>Value:<br>"+
                    "<select id='box_AuthorizeRemoteTxRequests'>"+
                    "<option selected='selected  value='true'>true</option>" +
                    "<option 'value='false'>false</option>"+
                "</select>"+
                "<div><button onclick='chconfiguration(1,\""+keyOp+"\",\""+boxkey+"\")'>Aceptar</button></div>"+
                "</div></div>";
            }
            else{
                keyOp='AuthorizeRemoteTxRequests';
                boxkey="box_AuthorizeRemoteTxRequests";
                contenido+=
                "<div><div class=container_key>AuthorizeRemoteTxRequests</div><div class=container_conf>Value:<br>"+
                    "<select id='box_AuthorizeRemoteTxRequests'>"+
                    "<option value='true'>true</option>" +
                    "<option selected='selected 'value='false'>false</option>"+
                "</select>"+
                "<div><button>Aceptar</button></div>"+
                "</div></div>";

            }
            keyOp='ClockAlignedDataInterval';
            boxkey="box_ClockAlignedDataInterval";
            contenido+= "<div><div class=container_key>ClockAlignedDataInterval</div><div class=container_conf><input type='text' id='box_ClockAlignedDataInterval' value='"+js1.texto.configurationKey[3].value+"'>"+"<div><button onclick='chconfiguration(1,\""+keyOp+"\",\""+boxkey+"\")'>Aceptar</button></div>"+"</div></div>";
            keyOp='ConnectionTimeOut';
            boxkey="box_ConnectionTimeOut";
            contenido+=  "<div><div class=container_key>ConnectionTimeOut</div><div class=container_conf><input type='text' id='box_ConnectionTimeOut' value='"+js1.texto.configurationKey[4].value+"'>"+"<div><button onclick='chconfiguration(1,\""+keyOp+"\",\""+boxkey+"\")'>Aceptar</button></div>"+"</div></div>";
            keyOp='ConnectorPhaseRotation';
            boxkey="box_ConnectorPhaseRotation";
            contenido+=  "<div><div class=container_key>ConnectorPhaseRotation</div><div class=container_conf>"+js1.texto.configurationKey[5].value+"</div></div>"; // conectorphase rotation se debe probar
            keyOp='GetConfigurationMaxKeys';
            boxkey="box_GetConfigurationMaxKeys";
            contenido+=  "<div><div class=container_key>GetConfigurationMaxKeys</div><div class=container_conf>"+js1.texto.configurationKey[6].value+"</div></div>";
            keyOp='HeartbeatInterval';
            boxkey="box_HeartbeatInterval";
            contenido+=  "<div><div class=container_key>HeartbeatInterval</div><div class=container_conf><input type='text' id='box_HeartbeatInterval' value='"+js1.texto.configurationKey[7].value+"'>"+"<div><button onclick='chconfiguration(1,\""+keyOp+"\",\""+boxkey+"\")'>Aceptar</button></div>"+"</div></div>";

            if(js1.texto.configurationKey[8].value=="true"){
                keyOp='LocalAuthorizeOffline';
                boxkey="box_LocalAuthorizeOffline";
                    contenido+=                
                    "<div><div class=container_key>LocalAuthorizeOffline</div><div class=container_conf>Value:<br>"+
                        "<select id='box_LocalAuthorizeOffline'>"+
                        "<option selected='selected  value='true'>True</option>" +
                        "<option 'value='false'>False</option>"+
                    "</select>"+
                    "<div><button onclick='chconfiguration(1,\""+keyOp+"\",\""+boxkey+"\")'>Aceptar</button></div>"+
                    "</div></div>";
                }
            else{
                keyOp='LocalAuthorizeOffline';
                boxkey="box_LocalAuthorizeOffline";
                contenido+=
                    "<div><div class=container_key>LocalAuthorizeOffline</div><div class=container_conf>Value:<br>"+
                        "<select id='box_LocalAuthorizeOffline'>"+
                        "<option value='true'>True</option>" +
                        "<option selected='selected 'value='false'>False</option>"+
                    "</select>"+
                    "<div><button onclick='chconfiguration(1,\""+keyOp+"\",\""+boxkey+"\")'>Aceptar</button></div>"+
                    "</div></div>";
    
                }

            if(js1.texto.configurationKey[9].value=="true"){
                keyOp='LocalPreAuthorize';
                boxkey="box_LocalPreAuthorize";
                    contenido+=                
                    "<div><div class=container_key>LocalPreAuthorize</div><div class=container_conf>Value:<br>"+
                        "<select id='box_LocalPreAuthorize'>"+
                        "<option selected='selected  value='true'>True</option>" +
                        "<option 'value='false'>False</option>"+
                    "</select>"+
                    "<div><button onclick='chconfiguration(1,\""+keyOp+"\",\""+boxkey+"\")'>Aceptar</button></div>"+
                    "</div></div>";
                }
            else{
                keyOp='LocalPreAuthorize';
                boxkey="box_LocalPreAuthorize";
                contenido+=
                    "<div><div class=container_key>LocalPreAuthorize</div><div class=container_conf>Value:<br>"+
                        "<select id='box_LocalPreAuthorize'>"+
                        "<option value='true'>True</option>" +
                        "<option selected='selected 'value='false'>False</option>"+
                    "</select>"+
                    "<div><button onclick='chconfiguration(1,\""+keyOp+"\",\""+boxkey+"\")'>Aceptar</button></div>"+
                    "</div></div>";
    
                }
            keyOp='MeterValuesAlignedData';
            boxkey="box_MeterValuesAlignedData";
            //contenido+= "<div><div class=container_key>MeterValuesAlignedData</div><div class=container_conf><input type='text' id='box_MeterValuesAlignedData' value='"+js1.texto.configurationKey[10].value+"'>"+"<div><button onclick='chconfiguration(1,\""+keyOp+"\",\""+boxkey+"\")'>Aceptar</button></div>"+"</div></div>";
            contenido+= "<div><div class=container_key>MeterValuesAlignedData</div><div class=container_conf>"+js1.texto.configurationKey[10].value+"</div></div>";

            keyOp='MeterValuesSampledData';
            boxkey="box_MeterValuesSampledData";
            //contenido+=  "<div><div class=container_key>MeterValuesSampledData</div><div class=container_conf><input type='text' id='MeterValuesSampledData' value='"+js1.texto.configurationKey[11].value+"'>"+"<div><button onclick='chconfiguration(1,\""+keyOp+"\",\""+boxkey+"\")'>Aceptar</button></div>"+"</div></div>";
            contenido+=  "<div><div class=container_key>MeterValuesSampledData</div><div class=container_conf>"+js1.texto.configurationKey[11].value+"</div></div>";

            keyOp='MeterValueSampleInterval';
            boxkey="box_MeterValueSampleInterval";
            contenido+=  "<div><div class=container_key>MeterValueSampleInterval</div><div class=container_conf><input type='text' id='box_MeterValueSampleInterval' value='"+js1.texto.configurationKey[12].value+"'>"+"<div><button onclick='chconfiguration(1,\""+keyOp+"\",\""+boxkey+"\")'>Aceptar</button></div>"+"</div></div>";
            keyOp='NumberOfConnectors';
            boxkey="box_NumberOfConnectors";
            contenido+=  "<div><div class=container_key>NumberOfConnectors</div><div class=container_conf>"+js1.texto.configurationKey[13].value+"</div></div>";
                
            if(js1.texto.configurationKey[14].value=="true"){
                keyOp='StopTransactionOnEVSideDisconnect';
                boxkey="box_StopTransactionOnEVSideDisconnect";
                    contenido+=                
                    "<div><div class=container_key>StopTransactionOnEVSideDisconnect</div><div class=container_conf>Value:<br>"+
                        "<select id='box_StopTransactionOnEVSideDisconnect'>"+
                        "<option selected='selected  value='true'>True</option>" +
                        "<option 'value='false'>False</option>"+
                    "</select>"+
                    "<div><button onclick='chconfiguration(1,\""+keyOp+"\",\""+boxkey+"\")'>Aceptar</button></div>"+
                    "</div></div>";
                }
            else{
                keyOp='StopTransactionOnEVSideDisconnect';
                boxkey="box_StopTransactionOnEVSideDisconnect";
                contenido+=
                    "<div><div class=container_key>StopTransactionOnEVSideDisconnect</div><div class=container_conf>Value:<br>"+
                        "<select id='box_StopTransactionOnEVSideDisconnect'>"+
                        "<option value='true'>True</option>" +
                        "<option selected='selected 'value='false'>False</option>"+
                    "</select>"+
                    "<div><button onclick='chconfiguration(1,\""+keyOp+"\",\""+boxkey+"\")'>Aceptar</button></div>"+
                    "</div></div>";
    
                }
/*
            if(js1.texto.configurationKey[15].value=="true"){
                    contenido+=                
                    "<div><div class=container_key>StopTransactionOnInvalidId</div><div class=container_conf>Value:<br>"+
                        "<select>"+
                        "<option selected='selected  value='true'>True</option>" +
                        "<option 'value='false'>False</option>"+
                    "</select>"+
                    "<div><button>Aceptar</button></div>"+
                    "</div></div>";
                }
            else{
                contenido+=
                    "<div><div class=container_key>StopTransactionOnInvalidId</div><div class=container_conf>Value:<br>"+
                        "<select>"+
                        "<option value='true'>True</option>" +
                        "<option selected='selected 'value='false'>False</option>"+
                    "</select>"+
                    "<div><button>Aceptar</button></div>"+
                    "</div></div>";
    
                }*/
            //contenido+=                
                //"<div><div class=container_key>StopTxnSampledData</div><div class=container_conf><input type='text' value='"+js1.texto.configurationKey[16].value+"'><div><button>Aceptar</button></div></div></div>";
                //"<div><div class=container_key>TransactionMessageRetryInterval</div><div class=container_conf><input type='text' value='"+js1.texto.configurationKey[17].value+"'><div><button>Aceptar</button></div></div></div>";

                ventana_configuracion.innerHTML=contenido;

               //var configuracion={'key':'AllowOfflineTxForUnknownId', 'value':document.getElementById('box_AllowOfflineTxForUnknownId').value};
               //console.log(configuracion)

 /*
            ventana_configuracion.innerHTML=
                "<div><div class=container_key>AllowOfflineTxForUnknownId</div><div class=container_conf>Value:<br>"+
                "<div><div class=container_key>AuthorizationCacheEnabled</div><div class=container_conf>Value:<br>"+js1.texto.configurationKey[1].value+"</div></div>"+
                "<div><div class=container_key>AuthorizeRemoteTxRequests</div><div class=container_conf>"+js1.texto.configurationKey[2].value+"</div></div>"+
                "<div><div class=container_key>ClockAlignedDataInterval</div><div class=container_conf>"+js1.texto.configurationKey[3].value+"</div></div>"+
                "<div><div class=container_key>ConnectionTimeOut</div><div class=container_conf>"+js1.texto.configurationKey[4].value+"</div></div>"+
                "<div><div class=container_key>ConnectorPhaseRotation</div><div class=container_conf>"+js1.texto.configurationKey[5].value+"</div></div>"+
                "<div><div class=container_key>GetConfigurationMaxKeys</div><div class=container_conf>"+js1.texto.configurationKey[6].value+"</div></div>"+
                "<div><div class=container_key>HeartbeatInterval</div><div class=container_conf>"+js1.texto.configurationKey[7].value+"</div></div>"+
                "<div><div class=container_key>LocalAuthorizeOffline</div><div class=container_conf>"+js1.texto.configurationKey[8].value+"</div></div>"+
                "<div><div class=container_key>LocalPreAuthorize</div><div class=container_conf>"+js1.texto.configurationKey[9].value+"</div></div>"+
                "<div><div class=container_key>MeterValuesAlignedData</div><div class=container_conf>"+js1.texto.configurationKey[10].value+"</div></div>"+
                "<div><div class=container_key>MeterValuesSampledData</div><div class=container_conf>"+js1.texto.configurationKey[11].value+"</div></div>"+
                "<div><div class=container_key>MeterValueSampleInterval</div><div class=container_conf>"+js1.texto.configurationKey[12].value+"</div></div>"+
                "<div><div class=container_key>NumberOfConnectors</div><div class=container_conf>"+js1.texto.configurationKey[13].value+"</div></div>"+
                "<div><div class=container_key>StopTransactionOnEVSideDisconnect</div><div class=container_conf>"+js1.texto.configurationKey[14].value+"</div></div>"+
                "<div><div class=container_key>StopTransactionOnInvalidId</div><div class=container_conf>"+js1.texto.configurationKey[15].value+"</div></div>"+
                "<div><div class=container_key>StopTxnSampledData</div><div class=container_conf>"+js1.texto.configurationKey[16].value+"</div></div>"+
                "<div><div class=container_key>TransactionMessageRetryInterval</div><div class=container_conf>"+js1.texto.configurationKey[17].value+"</div></div>"+
                "<div><div class=container_key>WebSocketPingInterval</div><div class=container_conf></div></div>"+
                "<div><div class=container_key>LocalAuthListMaxLength</div><div class=container_conf></div></div>"+
                "<div><div class=container_key>SendLocalListMaxLength</div><div class=container_conf></div></div>"+
                "<div><div class=container_key>ReserveConnectorZeroSupported</div><div class=container_conf></div></div>"+
                "<div><button onclick='changeConfiguration(1)'>Aceptar</button></div>";
                */

    }



        }
    

    if(tipo == 'metervalues'){
        llenartabla(texto);
        console.log('Estos son los valores medidos-------------------')
        for (const property in texto){
            let sampledValue = texto[property];
            for (const property1 in sampledValue){
                console.log(property1 + ' : ' + sampledValue[property1])
            };
        };
    };

    if(tipo == 'meterValue'){
        console.log('Llegan meter values');
        let values = js1.values;
        let connectorId = values.connectorId;
        element = document.getElementById('connectorId'+connectorId)
        console.log('estos son los values')
        console.log(connectorId);
        let voltage = values.meterValue[0].sampledValue[0].value;
        console.log('voltage de carga')
        console.log(voltage);
        Plotly.plot(element, [{
                y:[voltage],
                type: 'line',
            }], layout
        )
        Plotly.extendTraces(element,{y:[[voltage]]}, [0])
            
    };

    if(tipo == 'estado'){
        document.getElementById(boton).innerHTML = texto;

    }if(tipo == 'ping'){
        element = document.getElementById(boton)
        element.style.color = "green";
    }

    if(tipo == 'status'){
        if(texto=='cargando'){
           console.log('Se esta cargando xdxdxdxd')

        }else{
            console.log('Entra status Notification');
            console.log('boton: ' + boton   )
            element = document.getElementById(boton)
            element.innerHTML = texto;
        }
        
    }


});

const $messageForm1 = $('#acceptWsHandshake');    
$messageForm1.click( e => {
    console.log('Se va a aceptar la conexion:');
    e.preventDefault();
    const jsons = JSON.stringify({"tipo": "acceptWsHandshake", 'text':'conexion aceptada', 'message':'Esto es mensaje'});
    socket.send(jsons);
});

var layout = {
    yaxis: {
        title: 'Voltaje',
        range: [0, 150],
        tickmode: 'array',
        automargin: true,
        titlefont: { size:30 },
    }
};

/*
changeConfiguration(stationId){
    var PayloadRequest = JSON.stringify({"tipo": "ChangeConfiguration", "stationId": stationId});
    ws.send(PayloadRequest);

}
*/