var GEOCODIO_URL = 'https://api.geocod.io/v1/geocode';
var GEOCODIO_API_KEY = "312ec2b523c1523188531c02c5831c44f238214";

var GOVTRACK_URL = 'https://www.govtrack.us/api/v2/role';

var USER_DATA = {};

function getDataFromGeocodio(userAddress, callback) {
    var query = {
        q: userAddress,
        fields: 'cd114',
        api_key: GEOCODIO_API_KEY
    }
    $.getJSON(GEOCODIO_URL, query, callback);
}

function getDataFromGovTrack(userState, callback) {
    var query = {
        current: true,
        state: USER_DATA.state,
        district: USER_DATA.district
    }
    $.getJSON(GOVTRACK_URL, query, callback);
}

function displayResults(data) {
    var searchResult = '';
    
    var districtNumber = data.results[0].fields.congressional_district.district_number;
    
    USER_DATA.district = districtNumber;
    
    searchResult += '<p>District Number: ' + districtNumber + '</p>';
    
    $('.js-search-results .district').append(searchResult);
}

function displayResults2(data) {
    console.log(data);
    
    var searchResult = '';
    
    var firstName = data.objects[0].person.firstname;
    var lastName = data.objects[0].person.lastname;
    var jobTitle = data.objects[0].description;
    var personID = data.objects[0].person.id;
    
    searchResult += '<p>Congress Number: ' + data.objects[0].congress_numbers + '</p>' +
        '<p>Name: ' + firstName + ' ' + lastName + '</p>' +
        '<p>Job Title: ' + jobTitle + '</p>' +
        '<img src="https://www.govtrack.us/data/photos/' + personID + '-200px.jpeg">';
    
    $('.js-search-results .bio-data').append(searchResult);
}

function formSubmit() {
    $('.js-form').submit(function(event) {
        event.preventDefault();
        // shorten this code
        
        $('.js-search-results').removeClass('hidden');
        
        var street = $('.js-street').val(); 
        var city = $('.js-city').val();
        var state = $('.js-state').val();
        var zip = $('.js-zip').val();
        
        var userAddress = street + ", " + zip;
        
        USER_DATA.state = state;
        
//        getDataFromGeocodio(userAddress, displayResults);
////        alert('about to run next line of code')
//        getDataFromGovTrack(state, displayResults2);
        // promises
        $.when(getDataFromGeocodio(userAddress, displayResults)).then(getDataFromGovTrack(state, displayResults2));
        
    });
}

$(function() {
    formSubmit();
});