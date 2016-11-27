var GEOCODIO_URL = 'https://api.geocod.io/v1/geocode';
var GEOCODIO_API_KEY = "312ec2b523c1523188531c02c5831c44f238214";

var GOVTRACK_URL = 'https://www.govtrack.us/api/v2/role';

var USER_DATA = {};

function populateUserData() {
    USER_DATA.street1 = $('.js-street1').val();
    USER_DATA.street2 = $('.js-street2').val();
    USER_DATA.city = $('.js-city').val();
    USER_DATA.state = $('.js-state').val();
    USER_DATA.zip = $('.js-zip').val();
    USER_DATA.address = USER_DATA.street1 + " " + USER_DATA.street2 + ", " +      USER_DATA.city + " " + USER_DATA.state + ", " + USER_DATA.zip;
}

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
    
    USER_DATA.district = data.results[0].fields.congressional_district.district_number;
    
    searchResult += '<p>District Number: ' + USER_DATA.district + '</p>';
    
    //$('.js-search-results .district').append(searchResult);
    
    getDataFromGovTrack(USER_DATA.state, displayResults2);
}

function displayResults2(data) {
    console.log(data);
    
    var searchResult = '';
    
    var firstName = data.objects[0].person.firstname;
    var lastName = data.objects[0].person.lastname;
    var jobTitle = data.objects[0].description;
    var personID = data.objects[0].person.id;
    
    searchResult += '<div class="rep-info">' +
        '<p>Congress Number: ' + data.objects[0].congress_numbers + '</p>' +
        '<p>Name: ' + firstName + ' ' + lastName + '</p>' +
        '<p>Job Title: ' + jobTitle + '</p>' +
        '</div>' +
        '<div class="rep-pic">' +
        '<img src="https://www.govtrack.us/data/photos/' + personID + '-200px.jpeg">' +
        '</div>';
    
    $('.js-search-results .rep-data').append(searchResult);
}

function formSubmit() {
    $('.js-form').submit(function(event) {
        event.preventDefault();
        // shorten this code
        
        $('.js-search-results').removeClass('hidden');
        
        populateUserData();
        
        // promises
        
        getDataFromGeocodio(USER_DATA.address, displayResults);
        
//        $.when(getDataFromGeocodio(USER_DATA.address, displayResults)).then(getDataFromGovTrack(USER_DATA.state, displayResults2));
        
    });
}

$(function() {
    formSubmit();
});