function getPageFanInfo(values) {
    if (values != null) {
        var stat = values[values.length-1].value; // get the latest statistic
        var statTableHTML = "<div class='row'><div class='col s12 card-panel'><h5 class='center-align blue-text'>" + "Vaniday" + "</h5><table class='centered bordered'><thead>" +
            "<tr><th></th><th>13-17</th><th>18-24</th><th>25-34</th><th>35-44</th><th>45-54</th><th>55-64</th><th>65+</th><th>Total</th></tr></thead><tbody>";
        var formattedStat = {
            "Female": [0,0,0,0,0,0,0],
            "Male": [0,0,0,0,0,0,0],
            "Unknown": [0,0,0,0,0,0,0]
        }; // declare an object to store the number of fans by gender by age groups
        var ageGroupPos = ["13-17", "18-24", "25-34", "35-44", "45-54", "55-64", "65+"];
        for (var key in stat) {
            if (stat.hasOwnProperty(key)) {
                var gender = getFullGender(key.split(".")[0]);
                var ageGroup = key.split(".")[1];
                var numOfFans = stat[key];
                formattedStat[gender][ageGroupPos.indexOf(ageGroup)] = numOfFans;
            }
        }
        for (var genderKey in formattedStat) {
            statTableHTML += "<tr><td>" + genderKey + "</td>";
            var fansByAgeGroups = formattedStat[genderKey];
            for (var i = 0; i < fansByAgeGroups.length; i++) {
                statTableHTML += "<td>" + fansByAgeGroups[i] + "</td>";
            }
            var totalFans = fansByAgeGroups.reduce(function(a, b) { return a + b; }, 0);
            statTableHTML += "<td>" + totalFans + "</tr>";
        }
        $('#pagesFanInfo').append(statTableHTML + "</tbody></table></div>"); // render the table to the page
    }
}

function getFullGender(shortForm) {
    if (shortForm == "F") return "Female";
    else if (shortForm == "M") return "Male";
    else return "Unknown";
}
