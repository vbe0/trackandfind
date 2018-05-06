"use strict"
let MIC = require('mic-sdk-js').default

const WINDOW = 2000


// Instantiate a new Managed IoT Cloud API object
let api = new MIC

// Init by providing the app endpoint
function getSensorData(time, thingName) {
	
	//console.log("time = ", time)
	var config = getConfig(time, thingName)

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
function getConfig(time, thingName) {
	const DAY = 86400000
	const START = 1522747531024 // Data prior to this timestamp is not interesting at all
	
	/* 'startDate' is used to denote the start of the interval */
	var startDate, userStart, endDate, userEnd
	var today = new Date() * 1
	var absoluteStart = new Date(START) * 1

	/* No data produced before START is useful. Therefore,
	 * avoid reading garbage that is incompatible to the rest of the system
	 */
	if (time.start != null) {		
		userStart = new Date(time.start) * 1
		console.log('Userstart:', userStart)
		/* Don't use garbage historic data */
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
									thingName: [thingName]
								}
							},
							{
								range: {
									timestamp: {
										gte: startDate,
										lte: endDate
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
	for (i = 0; i < arr.length; i++) {
		var vals = arr[i]["_source"]
		var value = {}
		if (vals.state.battery === undefined) {
			continue
		}
		value.date = new Date(Number(vals.timestamp))
		value.name = vals.thingName
		value.lng = vals.state.lng
		value.lat = vals.state.lat
		value.sumAcc = vals.state.sumAcc
		value.battery = vals.state.battery 
		value.temperature = vals.state.temperature

		result.push(value)
	}
	return result
}


// var time = {}
// time.start = '2018-05-04T00:00:00'

// getSensorData(time, '00001416').then(s => {
// 	console.log(s)
// })

/* To be implemented: sliding window if the total amount of data > WINDOW*/
module.exports = {
    getData: function (time, thingName) {
		return getSensorData(time, thingName);
	}
}