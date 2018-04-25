'use strict'
const axios = require('axios')
const Promise = require('bluebird')
var MIC = require('mic-sdk-js').default

var AWSMqtt = require('aws-mqtt-client')
var AWS = require('aws-sdk');

var url = 'https://1u31fuekv5.execute-api.eu-west-1.amazonaws.com/prod/manifest/?hostname=startiot.mic.telenorconnexion.com'
var MANIFEST = {}


const getManifest = async url => {
    try {
      const response = await axios.get(url);
      const data = response.data;
      MANIFEST = data
    } catch (error) {
      console.log(error);
    }
};

async function setUpLamda(){
    // Initialize Cognito by setting the Identity pool from the MANIFEST.
    // This will give us an "unauthenticated" role needed to invoke login.
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: MANIFEST.IdentityPool
    });
    AWS.config.credentials.clearCachedId();
    AWS.config.update({region:MANIFEST.Region});
    // Payload to the Auth API
    var loginPayload = {
        action: 'LOGIN',
        attributes: {
            userName: 'vbe013',
            password: 'GGwpGGwp4567'
        }
    };
    
    // Provide the Auth Lambda function ID and the login payload
    var params = {
        FunctionName: MANIFEST.AuthLambda,
        Payload: JSON.stringify(loginPayload)
    };
    
    // Invoke the Lambda
    var lambda = new AWS.Lambda();
    
    await lambda.invoke(params, function(err, data) {
        if (err) {
            console.log(err, err.stack); // An error occurred
        } else {
            var result = JSON.parse(data.Payload);
            
            // Obtain a Cognito Identy with the returned credentials
            var creds = result.credentials;
            try{
                AWS.config.credentials.params.Logins = {
                    ['cognito-idp.' + MANIFEST.Region + '.amazonaws.com/' + MANIFEST.UserPool]: creds.token
                };
            } catch (err) {
                return "failed"
            }
                AWS.config.credentials.expired = true;
                //console.log("lamda: \n\n", lambda)
            }
        }).promise()

    return lambda
}

// getManifest(url).then(r => {
//     setUpLamda().then(lambda => {
//         console.log(lambda.config.credentials)

//     })
// })

var mqttConnect = function() {
    var api = new MIC; 
    var mqttClient; 
    // Init by providing the endpoint for your app
    api.init('startiot.mic.telenorconnexion.com')
    .then((manifest, credentials) => {
        // Login a user
        api.login('vbe013', 'GGwpGGwp4567')
        .then(user => {
            
            // Init a new MQTT client
            mqttClient = new AWSMqtt({
                region:                 api._AWS.config.region,
                accessKeyId:            api._AWS.config.credentials.accessKeyId,
                secretAccessKey:        api._AWS.config.credentials.secretAccessKey,
                sessionToken:           api._AWS.config.credentials.sessionToken,
                endpointAddress:        api._manifest.IotEndpoint,
                maximumReconnectTimeMs: 8000
            });

            mqttClient.on('connect', () => connect())
            mqttClient.on('message', (topic, message) => message())
        })
    })
    var connect = function() {
        mqttClient.subscribe('thing-update/my/topic/#', {qos: 1}, (err, granted) => {
            if (err)
              console.log(err)
          })
    }
    var message = function(topic, message) {
        console.log("MESSAGE FROM DEVICE: ", topic, message.toString('utf-8'))
    }
}

mqttConnect()