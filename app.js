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
        state: 'NJ',
        district: '11'
    }
    $.getJSON(GOVTRACK_URL, query, callback);
}

function displayResults(data) {
    var searchResult = '';
    
    var districtNumber = data.results[0].fields.congressional_district.district_number;
    
    USER_DATA.district = districtNumber;
    
    searchResult += '<p>District Number: ' + districtNumber + '</p>';
    
    $('.js-search-results').html(searchResult);
}

function displayResults2(data) {
    console.log(data);
}

function formSubmit() {
    $('.js-form').submit(function(event) {
        event.preventDefault();
        
        var street = $(this).find('.js-street').val();
        var city = $(this).find('.js-city').val();
        var state = $(this).find('.js-state').val();
        var zip = $(this).find('.js-zip').val();
        
        var userAddress = street + ", " + zip;
        
        USER_DATA.state = state;
        
        getDataFromGeocodio(userAddress, displayResults);
        getDataFromGovTrack(state, displayResults2);
    });
}

$(function() {
    formSubmit();
});