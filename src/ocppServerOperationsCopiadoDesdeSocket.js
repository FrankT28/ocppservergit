if(message.tipo=='acceptWsHandshake'){
    console.log('navegador solicita aceptar la conexion')
    var temporalClient = clientes.get('temporal');
    const acceptKey = message.acceptKey;
    const protocol = message.protocol;
    response = responseHeaders1(acceptKey, protocol);
    temporalClient.write(response.join('\r\n') + '\r\n\r\n' );
}else if(message.tipo=='ReserveNow'){
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
   ]
};

    var OIBCS = [2, 'CC', 'GetConfiguration', PayloadRequest];

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
    var OIBCS = [2, 'CC52', 'GetConfiguration', PayloadRequest1];
    stationClient.write(funciones.constructReply(OIBCS, 0x1));
    console.log(OIBCS)

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
     
     PayloadRequest = {"key": 
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
    ]}  

    
    var OIBCS = [2, 'GC', message.tipo, PayloadRequest];
    stationClient.write(funciones.constructReply(OIBCS, 0x1));



}else{
    /*clientenav = clientes.get(0);
    PayloadResponse = await ocppClientnav.processOcppRequestNav(message, clientes)
    console.log('                                            ');
    console.log('El servidor respondes-------------------')
    let CallResult = [CallResultId, UniqueId, PayloadResponse]; 
    console.log(CallResult);
    socket.write(funciones.constructReply(CallResult, opCode));*/
    console.log('La operacion OCPP solicitada por el navegador aun no ha sido implementada')
}