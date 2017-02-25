function renderTables(formattedStat) {
    var statTableHTML = "<div class='row'><div class='col s12 card-panel'><h5 class='center-align blue-text'>" + "Vaniday" + "</h5><table class='centered bordered'><thead>" +
    "<tr><th></th><th>13-17</th><th>18-24</th><th>25-34</th><th>35-44</th><th>45-54</th><th>55-64</th><th>65+</th><th>Total</th></tr></thead><tbody>";
    for (var genderKey in formattedStat) {
        statTableHTML += "<tr><td>" + genderKey + "</td>";
        var fansByAgeGroups = formattedStat[genderKey];
        for (var i = 0; i < fansByAgeGroups.length; i++) {
            statTableHTML += "<td>" + fansByAgeGroups[i] + "</td>";
        }
        var totalFans = fansByAgeGroups.reduce(function(a, b) { return Number(a) + Number(b); }, 0);
        statTableHTML += "<td>" + totalFans + "</tr>";
    }
    $('#pagesFanInfoTable')
        .append(statTableHTML + "</tbody></table></div>"); // render the table to the pagep
        .show(500);
}

function renderCharts(formattedStat, totalFans) {
    $('#pagesFanInfoCharts').append("<div class='row'><div class='col s12 card-panel' style='margin-top: 50px;'><h4 class='center-align blue-text'>Vaniday</h4></div></div>");

    var canvasArray = []; // for multiple charts
    var dataArray = []; // for multiple charts
    var count = 0;

    for (var genderKey in formattedStat) {
        var canvasId = pageId + "-canvas-" + (count++); // generate unique id for canvas
        var statChartsHTML = '<div class="col s12 m6 l4"><h5>' + genderKey + '</h5>';
        statChartsHTML += "<canvas id='" + canvasId + "'></canvas></div>";
        $('#pagesFanInfoCharts').append(statChartsHTML);
        var fansByAgeGroups = formattedStat[genderKey];
        canvasArray.push("#" + canvasId);
        dataArray.push(fansByAgeGroups);
    }

    $.each(canvasArray, function(index, value) { // create multiple charts by gender
        var data = {
            labels: ageGroupLabels,
            datasets: [
                {
                    label: "Number of Fans",
                    backgroundColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    data: dataArray[index],
                }
            ]
        };
        createChart($(value), 'pie', data, {});
    });

    var canvasId = pageId + "-canvas-" + (count++); // generate unique id for canvas
    $('#pagesFanInfoCharts').append("<div class='col s12 center' style='margin-top: 20px;'><h5>Number of Fans (Overall)</h5>'<canvas id='" + canvasId + "'></canvas></div>");
    var data = {
        labels: ageGroupLabels,
        datasets: [
            {
                label: "Number of Fans",
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 255, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1,
                data: totalFans,
            }
        ]
    };
    createChart($('#' + canvasId), 'bar', data); // create bar charts showing number of fans by age group
}

function getFullGender(shortForm) {
    if (shortForm == "F") return "Female";
    else if (shortForm == "M") return "Male";
    else return "Unknown";
}

function createChart(ctx, type, data, option) {
    var myChart = new Chart(ctx, {
        type: type,
        data: data,
        options: option
    });
}
