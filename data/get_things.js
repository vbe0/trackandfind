var MIC = require('mic-sdk-js').default;


var foo = function (params) {
    var api = new MIC;
    var things = {}
     
    // Init by providing the endpoint for your app
    return ret = api.init('startiot.mic.telenorconnexion.com').then((manifest, credentials) => {
      // Login a user
      
      return api.login('vbe013', 'GGwpGGwp4567').then(user => {
        // Invoke ObservationLambda FIND with a query payload
    
        return api.invoke('ThingLambda', {
            action: 'FIND', query: {
                size: 1000, query: {
                    bool: {
                        filter: {
                            term: {
                                thingType: "479" // Thing type id 
                            }
                        }
                    }
                }
            },
            type: 'thing,sub_thing'
        }).then(res => {
                //console.log('Result: ', res)
                for (var i = 0; i < res.hits.total; i++) {
                    var thing = res.hits.hits[i]
                    things[thing._id] = {label: thing._source.label, description: thing._source.description}
                    //console.log('Thing id: ', res.hits.hits[i]._id)
                }
                return things
            })

        });
    })
    .catch(err => console.log('Error: ', err)); 
}


var updateThing = function (params) {
    var api = new MIC;
    //console.log('Params: ', params)
    // Init by providing the endpoint for your app
    return api.init('startiot.mic.telenorconnexion.com').then((manifest, credentials) => {
      // Login a user
      
      return api.login('vbe013', 'GGwpGGwp4567').then(user => {
        // Invoke ObservationLambda FIND with a query payload
    
        return api.invoke('ThingLambda', {
            action: 'UPDATE',   attributes: {
                thingName: params.id,
                domain: "animal_tracker",
                label: params.label,
                description: params.description
              }
            }).then(res => {
                return res
            })
            .catch(err => console.log('Error in request to iot server: ', err));

        });
    })
    .catch(err => console.log('Error in request to iot server: ', err));    
}

module.exports = {
    fetchThings: function (params) {
        return foo(params)
    },
    updateThing: function (params) {
        return updateThing(params)
    }
}