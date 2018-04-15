
function fillTable(things) {

        var myTableDiv = document.getElementById("table_div")
        var table = document.getElementById("tracker_table")
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
            var att = document.createAttribute("contenteditable")
            att.value = 'false'
            td.setAttributeNode(att)
            td.appendChild(document.createTextNode(things[key].label));
            tr.appendChild(td)

            var td = document.createElement('TD')
            td.appendChild(document.createTextNode(things[key].description));
            var att = document.createAttribute("contenteditable")
            att.value = 'false'
            td.setAttributeNode(att)            
            tr.appendChild(td)

            var td = document.createElement('TD')
            var att = document.createAttribute("class");
            att.value = "text-right"
            td.setAttributeNode(att)

            td.appendChild(makeEditBtn(key));
            tr.appendChild(td)


            tableBody.appendChild(tr);
        }

        myTableDiv.appendChild(table)
}

function makeEditBtn(id) 
{
    var a = document.createElement('BUTTON')    
    var att = document.createAttribute("class")
    att.value = "btn btn-info btn-xs"
    a.setAttributeNode(att)
    att = document.createAttribute("onclick")
    att.value = "editThing(this)"
    a.setAttributeNode(att)

    att = document.createAttribute("id")
    att.value = id
    a.setAttributeNode(att)
    
    var span = document.createElement("span")
    var att_s = document.createAttribute("class")
    att_s.value = "glyphicon glyphicon-edit"
    span.setAttributeNode(att_s)
    a.appendChild(span)
    a.appendChild(document.createTextNode("Edit"))
    return a
}

function changeSaveBtn(btn) 
{
    var span = document.createElement("span")
    var att_s = document.createAttribute("class")
    att_s.value = "glyphicon glyphicon-save"
    span.setAttributeNode(att_s)
    btn.replaceChild(span, btn.childNodes[0])
    btn.replaceChild(document.createTextNode("Save"), btn.childNodes[1])
}

function changeEditBtn(btn)
{
    var span = document.createElement("span")
    var att_s = document.createAttribute("class")
    att_s.value = "glyphicon glyphicon-edit"
    span.setAttributeNode(att_s)
    btn.replaceChild(span, btn.childNodes[0])
    btn.replaceChild(document.createTextNode("Edit"), btn.childNodes[1])
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
    var host = window.location.host; 
    $.ajax({
        type: 'POST',
        data: JSON.stringify(params),
        contentType: 'application/json',
        url: 'http://' + host + '/things/update',						
        success: function(data) {
            //console.log(JSON.stringify(data));
        }
    });
}

function editThing(btn) 
{
    if (btn.childNodes[1].nodeValue == "Edit") {
        enableEdit(btn)
        changeSaveBtn(btn)
    } else {
        saveEdit(btn)
        changeEditBtn(btn)
    }
    console.log(btn.id, "Clicked", "Row:" , btn.parentNode.parentNode.rowIndex)
    
}

