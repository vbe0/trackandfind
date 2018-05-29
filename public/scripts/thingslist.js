

var allThings = {}

var allHistory = {}

function requestAllThings(source) {
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

    if (source == "profile") {
        myTableDiv = document.getElementById("profile_table_div")
        table = document.getElementById("profile_things_table")
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
            td.appendChild(makeBtn(key, "View Path"));
            
            tr.appendChild(td)
        } else if (source == "profile") {
            td.appendChild(makeBtn(key, "Include"));
            tr.appendChild(td)
            var td_temp = document.createElement('TD')
            var td_accs = document.createElement('TD')
            var td_time = document.createElement('TD')
            td_temp.id = key + "temp"
            td_accs.id = key + "accs"
            td_time.id = key + "timestamp"
            tr.appendChild(td_temp)
            tr.appendChild(td_accs)
            tr.appendChild(td_time)
        }
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

function insertSensorData(mapData) {
    for (var i = 0; i < mapData.length; i++) {
        try {
            var key = mapData[i].name
            var tempCell = document.getElementById(key + "temp")
            var accsCell = document.getElementById(key + "accs")
            tempCell.innerHTML = mapData[i].temperature
            accsCell.innerHTML = mapData[i].sumAcc
        } catch (err) {
            continue
        }
    }
}


function makeBtn(id, label, btntype='btn-info') {
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

function buttonEvent(btn) {   
    console.log("kek")
    if (btn.innerHTML == "Hide") {
        removeMarker(btn.id.replace('Hide', ''))
        changeBtn(btn, "Show")
    } else if (btn.innerHTML == "Show") {
        addMarkerWithId(btn.id.replace('Hide', ''))
        changeBtn(btn, "Hide", 'btn-primary')
    }
    else if (btn.innerHTML == "View Path") {
        addTrackerPathToMap(btn.id.replace('View Path', ''))        
        changeBtn(btn, "Hide Path", 'btn-primary')
    }
    else if (btn.innerHTML == "Hide Path") {
        removePath(btn.id.replace('View Path', ''))                
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

getHistoryData = function () {
    var i 
    for (x in allThings) {
        $.ajax({
            url: '/data/'+ x,
            data: " ",
            success: function (data) {
                addToHistory(data)
                addLastToMap(data)
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
            coords.push([allHistory[thingName][x].lat, allHistory[thingName][x].lng])
        }
    }
    console.log("Adding path for ", thingName)
    addPath(thingName, coords)
}