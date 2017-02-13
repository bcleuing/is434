window.fbAsyncInit = function() {
    FB.init({
        appId      : '1232876953416441',
        xfbml      : true,
        version    : 'v2.8'
    });
    FB.AppEvents.logPageView();

    FB.getLoginStatus(function(response) {
        if (response.status === 'connected') {
            // user is logged in and has authenticated your app
            $('#loginBtn').hide(); // hide the login button
            FB.api('/me', function(response) {
                $('#greetings').html('<h2 class="header">Good to see you, ' + response.name + '.</h2>');
            });
            var uid = response.authResponse.userID;
            var accessToken = response.authResponse.accessToken;
            getPages(accessToken);
        } else if (response.status === 'not_authorized') {
            // user is logged in to Facebook but has not authenticated your app
        }
    });
};

(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function _promptLogin() {
    FB.login(function(response) {
        if (response.authResponse) {
            // user authorized the app
            $('#loginBtn').hide(); // hide the login button
            $('#greetings').html('<h2 class="header">Welcome! Fetching your information....</h2>');
            FB.api('/me', function(response) {
                $('#greetings').html('<h2 class="header">Good to see you, ' + response.name + '.</h2>');
            });
            getPages(response.authResponse.accessToken);
        } else {
            // user cancelled login or did not fully authorize.
            console.log('User cancelled login or did not fully authorize.');
        }
    }); // {scope: 'manage_pages,read_insight'}
}

function getPages(accessToken) {
    console.log(accessToken);
    FB.api("/me/accounts", {access_token: accessToken}, function(response) {
        var pages = response.data;
        var numOfPage = pages.length;
        if (numOfPage <= 0) $('#pages').html("<h5>No pages found in your accounts.</h5>");
        else { // list out the information of all pages in which user is the admin
            var pageListHTML = '<h5>List of your pages</h5><div class="collection">';
            for (var i = 0; i < pages.length; i++) {
                // loop through array of pages and show information for each page
                var page = pages[i];
                pageListHTML += "<a href='https://www.facebook.com/" + page.id + "' class='collection-item' target='_blank'>" + page.name + "</a>";
                getPageFanInfo(page.name, page.id, accessToken);
            }
            $('#pages').append(pageListHTML + '</div>');
            $('#pagesFanInfo').show(500);
        }
    });
}
function getPageFanInfo(pageName, pageId, accessToken) {
    FB.api("/" + pageId + "/insights/page_fans_gender_age", {access_token: accessToken}, function(response) {
        var values = (response.data[0] == null) ? null : response.data[0].values;
        if (values != null) {
            var stat = values[values.length-1].value; // get the latest statistic
            var statTableHTML = "<div class='row'><div class='col s12 card-panel'><h5 class='center-align blue-text'>" + pageName + "</h5><table class='centered bordered'><thead>" +
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
    });
}
function getFullGender(shortForm) {
    if (shortForm == "F") return "Female";
    else if (shortForm == "M") return "Male";
    else return "Unknown";
}
