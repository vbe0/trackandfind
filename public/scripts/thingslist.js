

var allThings = {}

function requestAllThings() {
    $.ajax({
        url: '/things/all',
        data: " ",
        success: function (data) {
            console.log(data)
            allThings = data
            fillTable(data)
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
        changeBtn(btn, "Show")
    }
    else if (btn.innerHTML == "Show") {
        changeBtn(btn, "Hide", 'btn-primary')
    }
    else if (btn.innerHTML == "View History") {
        changeBtn(btn, "Hide History", 'btn-primary')
    }
    else if (btn.innerHTML == "Hide History") {
        changeBtn(btn, "View History")
    }
    else if (btn.innerHTML == "Hide All") {
        changeAllBtn('Show', 'Hide')
        changeAllBtn('View History', 'View History')
    }
    else if (btn.innerHTML == "Show All") {
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

function enableEdit(btn)
{
    btn.parentNode.parentNode.childNodes[1].setAttribute("contenteditable", "true")
    btn.parentNode.parentNode.childNodes[2].setAttribute("contenteditable", "true")
    btn.parentNode.parentNode.childNodes[1].focus()    
}
function saveEdit(btn)
{
    btn.parentNode.parentNode.childNodes[1].setAttribute("contenteditable", "false")
    btn.parentNode.parentNode.childNodes[2].setAttribute("contenteditable", "false")
    var params = {}
    params.id = btn.id

    params.label = btn.parentNode.parentNode.childNodes[1].innerHTML
    params.description = btn.parentNode.parentNode.childNodes[2].innerHTML
     
    $.ajax({
        type: 'POST',
        data: JSON.stringify(params),
        contentType: 'application/json',
        url: '/things/update',						
        success: function(data) {
            //console.log(JSON.stringify(data));
        }
    });
}


