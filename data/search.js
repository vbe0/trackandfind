"use strict"
let MIC = require('mic-sdk-js').default

const WINDOW = 2000


// Instantiate a new Managed IoT Cloud API object
let api = new MIC

// Init by providing the app endpoint
function getSensorData(start, stop, thing) {
	var time = {
		start: start, 
		stop: stop
	}
	console.log("thing = " + thing)
	var config = getParams(time, thing)

	// The manifest is fetched and a 'unauthorized'
	// Cognito identity is created
	return api.init(config.app).then((manifest, credentials) => {

		// Login the Cognito user
		return api.login(config.username, config.password).then(user => {
					
			// Invoke ObservationLambda FIND with a query payload
			return api.invoke('ObservationLambda', { action: 'FIND', query: config.query }).then(res => {
				return purifyData(res);
			})
		})
	}).catch(err => console.error(err));
}

/* Returns the configuration parameters body used in Elastic search */
function getParams(timeP, thing) {
	var time = {
		start: timeP.start, 
		stop: timeP.stop
	}

	const DAY = 86400000
	const START = 1525478400000 // Data prior to this timestamp is not interesting at all
	
	/* 'startDate' is used to denote the start of the interval */
	var startDate, userStart, endDate, userEnd
	var today = new Date() * 1
	var absoluteStart = new Date(START) * 1

	/* No data produced before START is useful. Therefore,
	 * avoid reading garbage that is incompatible to the rest of the system
	 */
	if (time.start != null) {		
		userStart = new Date(time.start) * 1
		
		/* Don't use historical garbage data */
		if (userStart < absoluteStart) {
			startDate = absoluteStart
		} else {
			startDate = userStart
		}
	} else {
		startDate = absoluteStart
	}

	if (time.stop != null) {
		userEnd = new Date(time.stop) * 1

		/* Cannot look into the future */
		if (userEnd > today) {
			endDate = today
		} else {
			endDate = userEnd
		}
	} else {
		endDate = today
	}

	var body = {
	
		// Username of the Cognito user
		username: 'thomasbn94',
		
		// Password of the Cognito user
		password: 'Kake1234',
		
		// The application endpoint
		app: 'startiot.mic.telenorconnexion.com',
	
		// Elasticsearch query
		query: {
			size: WINDOW,
			query: {
				bool: {
					filter: {
						bool: {
							minimum_should_match: 1,
							must: [{
								terms: {
									thingName: [thing]
								}
							},
							{
								range: {
									timestamp: {
										gte: + startDate,
										lte: + endDate
									}
								}
							}],
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
	return body
}


/* Remove garbage and purify the dataset */
function purifyData(data) {

	var arr = data.hits.hits, i
	var result = []
	for (i = 0; i < data.hits.hits.length; i++) {
		//console.log(arr[i])
		var data_i = {timestamp: arr[i]["_source"]['timestamp'],
			pos: {
				lon: arr[i]["_source"]["state"]["payload"].split(",")[0],
				lat: arr[i]["_source"]["state"]["payload"].split(",")[1]
			},
			battery: arr[i]["_source"]["state"]["payload"].split(",")[2],
			temperature: arr[i]["_source"]["state"]["payload"].split(",")[3],
			accSum: arr[i]["_source"]["state"]["payload"].split(",")[4]
		}

		result.push(data_i)
	}
	return result
}

var packData = function(start, stop, thing) {
	var k = 0, result = []
	return new Promise(
		function (resolve, reject) {
			//console.log(start, stop, thing)
			var res = getSensorData(start, stop, thing).then(data => {
				//console.log("Finished getting data from " + thing)
				resolve(data)
				return data
			})
		}
	)
}



/* To be implemented: sliding window if the total amount of data > WINDOW*/
module.exports = {
    getData: function (params) {
		return new Promise(
			function(resolve, reject) {
				var result = []
				params.things.reduce(
					(p, x) => 
						p.then(result => packData(params.start, params.stop, x)).then( r => {
							result.push(r)
						}),
						Promise.resolve(),
				).then(_ => {
					resolve(result)
					//console.log(result)
					return result
				})
			}
		)
	}
}