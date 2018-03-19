let MIC = require('mic-sdk-js').default

const CONFIG = {
  // Username of the Cognito user
  username: 'thomasbn94',
  // Password of the Cognito user
  password: 'Kake1234',
  // The application endpoint
  app:      'startiot.mic.telenorconnexion.com',
  // Elasticsearch query
  query: {
    size: 100,
    query: {
      bool: {
        filter: {
          bool: {
            minimum_should_match: 1,
            must: [
              {
                terms: {
                  thingName: ['00001319']
                }
              },
              {
                range: {
                  timestamp: {
                    gte: + new Date() - (60 * 60 * 24 * 3), // 1 = days
                    lte: + new Date()
                  }
                }
              }
            ],
            should: [{
              exists: {
                field: 'state.payload'
              }
            }]
          }
        },
        sort: {
          timestamp: {
            order: 'desc'
          }
        },
        _source: ['state.payload', 'timestamp']
      }
    }
  }
}

// Instantiate a new Managed IoT Cloud API object
let api = new MIC

// Init by providing the app endpoint
api.init(CONFIG.app)

  // The manifest is fetched and a 'unauthorized'
  // Cognito identity is created
  .then((manifest, credentials) => {

    // Login the Cognito user
    return api.login(CONFIG.username, CONFIG.password)
      .then(user => {
                
        // Invoke ObservationLambda FIND with a query payload
        api.invoke('ObservationLambda', { action: 'FIND', query: CONFIG.query })
        .then(res => {
          //console.log('Result: ', JSON.stringify(res.hits));
          console.log(new Date());  
        })

      })
  })
  .catch(err => console.error(err))