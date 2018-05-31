

var allThings = {}

var allHistory = {}

var globalMapData = {}

var accKeys = []

function requestAllThings(source="live") {
    $.ajax({
        url: '/things/all',
        data: " ",
        success: function (data) {
            allThings = data
            fillTable(data, source)
            if (source == "live") {
                getHistoryData()
            }
        }
    });
    
}

function fillTable(things, source) {
    var myTableDiv, table

    if (source == "history") {
        myTableDiv = document.getElementById("history_table_div")
        table = document.getElementById("history_things_table")
    } else {
        myTableDiv = document.getElementById("table_div")
        table = document.getElementById("things_table")
    }

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

        if (source == "live") {
            td.appendChild(makeBtn(key, "Hide", 'btn-primary'));
            td.appendChild(makeBtn(key, "View Path"))
            tr.appendChild(td)
        } else if (source == "history") {
            td.appendChild(makeBtn(key, "Include"));
            tr.appendChild(td)
        }
        var td_temp = document.createElement('TD')
        var td_time = document.createElement('TD')
        var accKey = makeBtn(key, "View Accs")
        td_temp.id = key + "temp"
        td_time.id = key + "timestamp"
        tr.appendChild(td_temp)
        td.appendChild(accKey)
        accKeys.push(accKey)
        tr.appendChild(td_time)
        tableBody.appendChild(tr);
    }

    myTableDiv.appendChild(table)
}


function setValidCellStyle(element) {
    element.style.color = "black"
    element.style.textDecoration = "none"
}

function setInvalidCellStyle(element) {
    element.style.color = "red"
    element.style.textDecoration = "underline"
}

function insertSensorData(thing, mapData) {
    for (var i = 0; i < mapData.length; i++) {
        try {
            var key = thing
            var tempCell = document.getElementById(key + "temp")
            var timeCell = document.getElementById(key + "timestamp")
            tempCell.innerHTML = mapData[i].temperature
            timeCell.innerHTML = datedate(mapData[i].date)
            console.log(mapData[i].temperature, mapData[i].sumAcc)
            return
        } catch (err) {
            continue
        }
    }
}


function toggleAccButton(btn) {
    if (btn.innerHTML == "View Accs") {
        changeBtn(btn, "Hide Accs", 'btn-primary')
        for (var i = 0; i < accKeys.length; i++) {
            if (btn != accKeys[i]) {  
                changeBtn(accKeys[i], "View Accs")
            }
        }
    } else if (btn.innerHTML == "Hide Accs") {
        changeBtn(btn, "View Accs")
    }
}


function insertDeviceSensorData(thing, data, old=false) {
    try {
        var key = thing
        var tempCell = document.getElementById(key + "temp")
        var accsCell = document.getElementById(key + "accs")
        var timeCell = document.getElementById(key + "timestamp")
        
        tempCell.innerHTML = data.temperature
        accsCell.innerHTML = data.battery
        timeCell.innerHTML = datedate(data.date)
        if (old) {
            setInvalidCellStyle(tempCell)
            setInvalidCellStyle(accsCell)
            setInvalidCellStyle(timeCell)
        } else {
            setValidCellStyle(tempCell)
            setValidCellStyle(accsCell)
            setValidCellStyle(timeCell)
        }
    } catch (err) {
        console.log("Error in insertDeviceSensorData: ", err)
    }
}
function datedate(date) {
    var d = new Date(date)
    d = String(d).replace("GMT+0200 (CEST)", "")
    return d
}


function makeBtn(id, label, btntype='btn-info') {
    var a = document.createElement('BUTTON')    
    var att = document.createAttribute("class")
    att.value = 'btn ' + btntype + ' btn-xs'
    a.setAttributeNode(att)
    att = document.createAttribute("onclick")
    if (label == "View Accs") {
        att.value = "toggleAccButton(this)"
    } else {
        att.value = "buttonEvent(this)"
    }
    a.setAttributeNode(att)
    att = document.createAttribute("id")
    att.value = id + label
    a.setAttributeNode(att)
    
    a.appendChild(document.createTextNode(label))
    return a
}

function buttonEvent(btn) {   
    if (btn.innerHTML == "Hide") {
        removeMarker(btn.id.replace('Hide', ''))
        changeBtn(btn, "Show")
    } else if (btn.innerHTML == "Show") {
        addMarkerWithId(btn.id.replace('Hide', ''))
        changeBtn(btn, "Hide", 'btn-primary')
    }
    else if (btn.innerHTML == "View Path") {
        if (btn.id.includes("historic")) {
            addHistoricPathToMap(btn.id.replace('View Path' + 'historic', ''))
        } else {
            addTrackerPathToMap(btn.id.replace('View Path', ''))        
        }
        changeBtn(btn, "Hide Path", 'btn-primary')
    }
    else if (btn.innerHTML == "Hide Path") {
        if (btn.id.includes("historic")) {
            console.log("removing historic")
            removePath(btn.id.replace('View Path' + 'historic', ''))
        } else {
            removePath(btn.id.replace('View Path', ''))
        }
        changeBtn(btn, "View Path")
    }
    else if (btn.innerHTML == "Hide All") {
        removeMarkers()
        changeAllBtn('Show', 'Hide')
        changeAllBtn('View Path', 'View Path')
    }
    else if (btn.innerHTML == "Show All") {
        addAllMarkers()
        changeAllBtn('Hide', 'Hide', 'btn-primary')
    }
    else if (btn.innerHTML == "Include") {
        changeBtn(btn, "Exclude", 'btn-primary')
    } else if (btn.innerHTML == "Exclude") {
        changeBtn(btn, "Include")
    }
}

function getSelectedBtns() {
    var selectedKeys = []
    for (var key in allThings) {
        var btn = document.getElementById(key + "Include")
        if (btn.innerHTML == "Exclude") {
            selectedKeys.push(key)
        }
    }
    return selectedKeys
}
getSelectedHideBtns = function () {
    var selected = []
    for (var key in allThings) {
        var btn = document.getElementById(key + 'Hide')
        if (btn.innerHTML == "Show") {
            selected.push(key)
        }
    }
    return selected
}

function changeBtn(btn, label, btntype="btn-info") {
    btn.innerHTML = label 
    btn.setAttribute('class', 'btn ' + btntype + ' btn-xs')
}

changeAllBtn = function (label, type, btntype='btn-info') {
    for (var key in allThings) {
        btn = document.getElementById(key + type)
        changeBtn(btn, label, btntype)
    }
}

getHistoryData = function (things=Object.keys(allThings)) {
    for (var i = 0; i < things.length; i++) {
        $.ajax({
            url: '/data/'+ things[i],
            data: " ",
            success: function (data) {
                if (data[0] == undefined) {
                    console.log("Failed to get data for ", things[i])
                } else {
                    addToHistory(data)
                    addLastToMap(data)
                }
            }
        });

    }
}


addToHistory = function (data) {
    allHistory[data[0].name] = data
}

addToDeviceHistory = function (device, data) {
    allHistory[device].push(data) 
}
addLastToMap = function (thingdata) {
    try {
        var thingName = thingdata[0].name
        var i, data
        if (thingdata === undefined) {
            console.log("Data for ", thingName, " is undefined.")
            return
        }
        data = thingdata[thingdata.length - 1]
        insertDeviceSensorData(data.name, data, true)
        for (i = 1; i <= thingdata.length; i++){
            data = thingdata[thingdata.length - i]
            if (data.lng === "None"){
                continue 
            } else {
                break
            }
        }
        if (data.lat === 'None') {
            console.log("Data.lat is none for thing ", thingName)
            return
        }
        
        var date = String(new Date(Number(data.date))).replace('GMT+0200 (CEST)', '')        
        console.log("Adding last received to map: ", data, "with date ", date)
        addPastMarker(data.name, data.lat, data.lng, markerText="Temp: "+ data.temperature + ", Battery: "+ data.battery, time=date)
    } catch (err) {
        console.log("Error parsing data from history last received with", thingName, err)
    }
}


addTrackerPathToMap = function (thingName) {
    var x, prev_lat = 0.0, prev_lng = 0.0
    var coords = []
    //console.log(allHistory[thingName])
    var x = allHistory[thingName].length - 1, i = 0
    for (i = 0; i <= 100 && x >= 0; x--) {
        var lat = allHistory[thingName][x].lat
        var lng = allHistory[thingName][x].lng
        if (lat != 'None' && lng != undefined) {
            if (Math.abs(lat - prev_lat) < 0.002163 && Math.abs(lng - prev_lng) < 0.00217) {
                continue
            }
            prev_lat = lat
            prev_lng = lng
            i++
            console.log([allHistory[thingName][x].lat, allHistory[thingName][x].lng])
            coords.push([allHistory[thingName][x].lat, allHistory[thingName][x].lng])
        }
    }
    console.log("Adding path for ", thingName)
    addPath(thingName, coords)
}



function addHistoricPathToMap(thingName, mapData = undefined) {
    var i, coords = [], tmp = [2]


    if (globalMapData.length == undefined) {
        console.log("First time")
        globalMapData = mapData
    } else {
        return
    }

    for (i = 0; i < globalMapData.length; i++) {
        tmp[0] = String(globalMapData[i].lat)
        tmp[1] = String(globalMapData[i].lng) 
        var lat = globalMapData[i].lat
        var lng = globalMapData[i].lng
        // ["69.37439", "18.30176"]
        if (lat != 'None' && lng != "None" && lat != undefined && lng != undefined) {
            coords.push([String(globalMapData[i].lat), String(globalMapData[i].lng)])
            console.log([String(globalMapData[i].lat), String(globalMapData[i].lng)])
        }
    }
    console.log(thingName)
    addPath(thingName, coords)
}