

function newChart(id) {
    var options = {
        height: '200px',
        width: '1900px',
        showGrid: false,
        axisX: {
            labelFontSize: 30
        },
        axisy: {
            labelFontSize: 30
        }
    }

    var data = {}
    return new Chartist.Line("#theChart", data, options);
}


function setChartData(chart, data, idx, granularity) {
    var labels = [], accs = [], i
    for (var i = idx; i < Number(idx + Number(granularity)); i++) {
        if (data[i].sumAcc != undefined) {
            accs.push(Number(data[i].sumAcc))
            labels.push([datedate(new Date(Number(data[i].date)))])
        } else {
            return
        }
    }

    chart.update({labels: labels, series: [accs]})
}