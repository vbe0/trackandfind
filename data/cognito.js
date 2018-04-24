'use strict'
var AWS = require('aws-sdk');
const axios = require('axios')


var url = 'https://1u31fuekv5.execute-api.eu-west-1.amazonaws.com/prod/manifest/?hostname=startiot.mic.telenorconnexion.com'

const getManifest = async url => {
    try {
      const response = await axios.get(url);
      const data = response.data;
      return data
    } catch (error) {
      console.log(error);
    }
  };
function setUpLamda(){
    return getManifest(url)
    .then (manifest => {

        // Initialize Cognito by setting the Identity pool from the manifest.
        // This will give us an "unauthenticated" role needed to invoke login.
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: manifest.IdentityPool
        });
        AWS.config.credentials.clearCachedId();
        AWS.config.update({region:manifest.Region});
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
            FunctionName: manifest.AuthLambda,
            Payload: JSON.stringify(loginPayload)
        };
        
        // Invoke the Lambda
        var lambda = new AWS.Lambda();
        lambda.invoke(params, function(err, data) {
            if (err) {
                console.log("manifest: ", manifest.IdentityPool)
                console.log(err, err.stack); // An error occurred
            } else {
                var result = JSON.parse(data.Payload);
                
                // Obtain a Cognito Identy with the returned credentials
                var creds = result.credentials;
                AWS.config.credentials.params.Logins = {
                    ['cognito-idp.' + manifest.Region + '.amazonaws.com/' + manifest.UserPool]: creds.token
                };
                AWS.config.credentials.expired = true;
            }
        });
        return lambda
    })
}


setUpLamda().then( lambda => {
    console.log(lambda)
})