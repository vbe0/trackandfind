var Connection = require('tedious').Connection;
var Request = require('tedious').Request;

// Create connection to database
var config = 
   {
     userName: 'tni068', // update me
     password: 'Kake1234', // update me
     server: 'animaltest.database.windows.net', // update me
     options: 
        {
           database: 'test_db' //update me
           , encrypt: true
        }
   }


var connection = new Connection(config);

module.exports = {
    // Attempt to connect and execute queries if connection goes through
    db_query: function() {
        connection.on('connect', function(err) {
            if (err) {
                console.log(err)
            } else {
                queryDatabase()
            }
        });
    },

    db_insert: function(foo) {
        insert_into_table(foo);
    }
}


function insert_into_table(dataPoint) {
    id = dataPoint.id;
    animal_id = dataPoint.animal_id;
    longitude = dataPoint.longitude;
    latitude = dataPoint.latitude;
    time_stamp = dataPoint.time_stamp;

    // Insert into table
    request = new Request(
        "INSERT INTO DataPoints (id, animal_id, longitude, laditude, time_stamp) VALUES (?, ?, ?, ?, ?);", 
        [id, animal_id, longitude, latitude, time_stamp], 
            function (err, results, fields) {
                if (err) {
                    throw err;
                } else { 
                    console.log('Inserted ' + results.affectedRows + ' row(s).');
                }
            }
    );

    connection.execSql(request);
}



function queryDatabase() { 
    console.log('Reading rows from the Table...');

    // Read all rows from table
    request = new Request(
        "SELECT * from DataPoints",
            function(err, rowCount, rows) {
                console.log(rowCount + ' row(s) returned');
                process.exit();
            }
    );

    request.on('row', function(columns) {
        columns.forEach(function(column) {
            console.log("%s\t%s", column.metadata.colName, column.value);
        });
    });

    connection.execSql(request);
   }