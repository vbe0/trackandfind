

var allThings = {}

var allHistory = {}

function requestAllThings() {
    $.ajax({
        url: '/things/all',
        data: " ",
        success: function (data) {
            console.log(data)
            allThings = data
            fillTable(data)
            getHistoryData()
        }
    });
}

function fillTable(things) {

        var myTableDiv = document.getElementById("table_div")
        var table = document.getElementById("things_table")
        var tableBody = document.createElement('TBODY')

        table.appendChild(tableBody);

        //TABLE ROWS
        var tr = document.createElement('TR');
        tableBody.appendChild(tr);
        for (var key in things) {
            var tr = document.createElement('TR');

            var td = document.createElement('TD')
            td.appendChild(document.createTextNode(key));
            tr.appendChild(td)

            var td = document.createElement('TD')
            td.appendChild(document.createTextNode(things[key].label));
            tr.appendChild(td)

            var td = document.createElement('TD')
            td.appendChild(document.createTextNode(things[key].description));         
            tr.appendChild(td)

            var td = document.createElement('TD')
            var att = document.createAttribute("class");
            att.value = "text-right"
            td.setAttributeNode(att)

            td.appendChild(makeBtn(key, "Hide", 'btn-primary'));
            td.appendChild(makeBtn(key, "View History"));
            
            tr.appendChild(td)


            tableBody.appendChild(tr);
        }

        myTableDiv.appendChild(table)
}

function makeBtn(id, label, btntype='btn-info') 
{
    var a = document.createElement('BUTTON')    
    var att = document.createAttribute("class")
    att.value = 'btn ' + btntype + ' btn-xs'
    a.setAttributeNode(att)
    att = document.createAttribute("onclick")
    att.value = "buttonEvent(this)"
    a.setAttributeNode(att)

    att = document.createAttribute("id")
    att.value = id + label
    a.setAttributeNode(att)
    
    a.appendChild(document.createTextNode(label))
    return a
}

function buttonEvent(btn) 
{   
    console.log(btn)
    if (btn.innerHTML == "Hide") {
        removeMarker(btn.id.replace('Hide', ''))
        changeBtn(btn, "Show")
    }
    else if (btn.innerHTML == "Show") {
        addMarkerWithId(btn.id.replace('Hide', ''))
        changeBtn(btn, "Hide", 'btn-primary')
    }
    else if (btn.innerHTML == "View History") {
        changeBtn(btn, "Hide History", 'btn-primary')
    }
    else if (btn.innerHTML == "Hide History") {
        changeBtn(btn, "View History")
    }
    else if (btn.innerHTML == "Hide All") {
        removeMarkers()
        changeAllBtn('Show', 'Hide')
        changeAllBtn('View History', 'View History')
    }
    else if (btn.innerHTML == "Show All") {
        addAllMarkers()
        changeAllBtn('Hide', 'Hide', 'btn-primary')
    }
    
}

function changeBtn(btn, label, btntype="btn-info") 
{
    btn.innerHTML = label 
    btn.setAttribute('class', 'btn ' + btntype + ' btn-xs')
}

changeAllBtn = function (label, type, btntype='btn-info')
{
    for (var key in allThings) {
        btn = document.getElementById(key + type)
        changeBtn(btn, label, btntype)
    }
}

getHistoryData = function () {

    var i 
    for (x in allThings) {
        $.ajax({
            url: '/data/'+ x,
            data: " ",
            success: function (data) {
                allHistory[x] = data
                console.log(data)
                addLastToMap(x, data)
            }
        });
    }
}

addLastToMap = function (thingName, thingdata) {
    try {
        var i, data
        if (thingdata === undefined) {
            console.log("Data for ", thingName, " is undefined.")
            return
        }
        for (i = 1; i <= thingdata.length; i++){
            data = thingdata[thingdata.length - i]
            if (data.lng === "None"){
                continue 
            } else {
                break
            }
        }
        if (data === undefined) {
            console.log("Data is undefined for thing ", thingName, ". All data is: ", thingdata)
            return
        }
        console.log("Adding last received to map: ", data)
        addPastMarker(data.name, data.lat, data.lng, markerText="Temp: "+ data.temperature + ", Battery: "+ data.battery, time=data.date)
    }
    catch (err) {
        console.log("Error parsing data from history last received with", thingName, err)
    }
}

