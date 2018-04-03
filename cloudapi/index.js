var MIC = require('mic-sdk-js').default;
var api = new MIC;
 
 
// Init by providing the endpoint for your app
api.init('startiot.mic.telenorconnexion.com')
.then((manifest, credentials) => {
  // Login a user
  api.login('vbe013', 'GGwpGGwp4567')
  .then(user => {
    // Invoke ObservationLambda FIND with a query payload
    api.invoke('ThingLambda', {
      action: 'FIND',
      query: {
        size: 1000,
        query: {
          bool: {
            filter: {
              term: {
                thingType: "477"
              }
            }
          }
        }
      },
      type: 'thing,sub_thing'
    }
    )
    .then(res => {
      console.log('Result: ', res)
      for (var i = 0; i < res.hits.total; i++) {
        console.log('Thing id: ', res.hits.hits[i]._id)
      }
    })
  });
})
.catch(err => console.log('Error: ', err));