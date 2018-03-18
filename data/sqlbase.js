var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;  

// Create connection to database
var config = {
    userName: 'tni068', // update me
    password: 'Kake1234', // update me
    server: 'animaltest.database.windows.net', // update me
    options: { 
        database: 'test_db', 
        encrypt: true 
    }
}


module.exports = {
    // Attempt to connect and execute queries if connection goes through
    db_query: function() {
        var connection = new Connection(config);
        connection.on('connect', function(err) {
            queryDatabase(connection);
        });
    },

    getHighestID: function() {
        var connection = new Connection(config);
        connection.on('connect', function(err) {
            return db_getHighestID(connection);
        });
    }
}


var db_getHighestID = function(connection) {
    var id = 0;

    request = new Request(
        "SELECT max(id) from DataPoints", 
            function(err, rowCount, rows) {
                console.log(rowCount + ' row(s) returned');
            }
    );

    request.on('row', function(columns) {
        columns.forEach(function(column) {
            id = column.value;
            //console.log("%s\t%s", column.metadata.colName, column.value);
        });
        console.log("id1 = ", id);
        return id;
    });

    
    connection.execSql(request)
    //return id;
}




var queryDatabase = function(connection) { 


    console.log('Reading rows from the Table...');

    // Read all rows from table
    request = new Request(
        "SELECT * from DataPoints", 
            function(err, rowCount, rows) {
                console.log(rowCount + ' row(s) returned');
            }
    );

    request.on('row', function(columns) {
        columns.forEach(function(column) {
            console.log("%s\t%s", column.metadata.colName, column.value);
        });
    });

    connection.execSql(request);

   }



/*
   function insert_into_table() {
    console.log("Inserting into db...");
    
    id = dataPoint.id;
    animal_id = dataPoint.animal_id;
    longitude = dataPoint.longitude;
    latitude = dataPoint.latitude;
    time_stamp = dataPoint.time_stamp;

    // Insert into table
    request = new Request(
        "INSERT DataPoints (id, animal_id, longitude, laditude, time_stamp) VALUES (@id, @animal_id, @longitude, @laditude, CURRENT_TIMESTAMP);", function (err) {
        if (err) {  
            console.log(err);}
        });
        
    request.addParameter('id', TYPES.Int, id);
    request.addParameter('animal_id', TYPES.int, animal_id);
    request.addParameter('longitude', TYPES.Int, longitude); 
    request.addParameter('latitude', TYPES.Int, latitude);  
    request.addParameter('time_stamp', TYPES.Text, time_stamp);  
    request.on('row', function(columns) {  
        columns.forEach(function(column) {  
            if (column.value === null) {  
                console.log('NULL');  
            } else {  
                console.log("Product id of inserted item is " + column.value);  
            }  
        });  
    });       
    
    connection.execSql(request);
    
}
*/