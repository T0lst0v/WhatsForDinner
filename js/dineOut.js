let userLocation;
let map;
let mapBounds;
let service;
let marker;
let searchResults = [];
let reviews = [];
let currentReview = 0;
let currentCuisine = "restaurant";
let ulRestaurants = document.getElementById("ulRestaurants");
let wait = true;
let slideIndex = 1;
let imageToggle = false;

let divReview = document.getElementById("divReview");

let selCuisine = document.getElementById("selCuisine");
selCuisine.onchange = () => changeCuisine();

// loads the initial map
function initMap() {
    // don't init map on main menu load, wait for dine out click
    //if (wait) return;

    // Initialize variables
    mapBounds = new google.maps.LatLngBounds();
    let infoWindow = new google.maps.InfoWindow();

    // Try HTML5 geolocation
    if (navigator.geolocation) {
        // get user location
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                map = new google.maps.Map(document.getElementById("divMap"), {
                    center: userLocation,
                    zoom: 13,
                });
                mapBounds.extend(userLocation); // change map focus

                // geolocation supported and user allowed permission
                getNearbyPlaces(userLocation);
            },
            () => {
                // geolocation supported but the user denied permission
                handleLocationError(true, infoWindow);
            }
        );
    } else {
        // Browser doesn't support geolocation
        handleLocationError(false, infoWindow);
    }
}

// handle a geolocation error
// TODO ask user for a zip code
function handleLocationError(browserHasGeolocation, infoWindow) {
    // Set default location to Baltimore, Maryland
    userLocation = {lat: 39.29, lng: -76.609};
    map = new google.maps.Map(document.getElementById("divMap"), {
        center: userLocation,
        zoom: 15,
    });

    // display error to user
    infoWindow.setPosition(userLocation);
    infoWindow.setContent(browserHasGeolocation ? "Geolocation permissions denied. Using default location." : "Error: Your browser doesn't support geolocation.");
    infoWindow.open(map);

    // search Baltimore
    getNearbyPlaces(userLocation);
}

// perform a nearby places search using user position
// and the currently selected cuisine
function getNearbyPlaces(position) {
    let request = {
        location: position,
        rankBy: google.maps.places.RankBy.DISTANCE,
        keyword: currentCuisine,
    };

    // use a service to get more info about a place
    // https://developers.google.com/maps/documentation/javascript/reference/places-service

    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, nearbyPlacesSearchResults);
}

// Handle the results (up to 20) of the Nearby Search
// can do pagination for up to 60 but is slower, would need to be async
// TODO: use the pagination feature to get more results back
function nearbyPlacesSearchResults(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        searchResults.push(...results);
    }
    displayRestaurants();
}

// display the restaurants from the nearby places search
function displayRestaurants() {
    ulRestaurants.innerHTML = "";
    searchResults
        .filter((result) => result.rating)
        .sort((a, b) => (a.rating > b.rating ? -1 : 1))
        .forEach((result) => {
            ulRestaurants.insertAdjacentHTML(
                "beforeEnd",
                `
            <li>
                <a href='javascript:void();' onclick="updateRestaurantDisplay('${result.name}')">
                    ${result.name} (${result.rating} \u272e)</a>
            </li>`
            );
        });
    updateRestaurantDisplay(searchResults[0].name);
}

// updates the info display to whatever restaurant user clicked
function updateRestaurantDisplay(name) {
    let restaurant = searchResults.filter((result) => result.name === name)[0];

    moveMap(restaurant);
    updateInfo(restaurant);
}

// pans map to the restaurant the user selected
function moveMap(restaurant) {
    // remove marker if one is already out
    if (marker) marker.setMap(null);

    // create marker
    marker = new google.maps.Marker({
        position: restaurant.geometry.location,
        map: map,
        title: restaurant.name,
        animation: google.maps.Animation.DROP,
    });

    // place marker and pan map
    map.panTo(restaurant.geometry.location);
    marker.position = restaurant.geometry.location;
}

// update div with new restaurant details
function updateInfo(restaurant) {
    let request = {
        placeId: restaurant.place_id,
        fields: ["name", "formatted_address", "geometry", "rating", "website", "photos", "reviews"],
    };
    service.getDetails(request, (result, status) => displayRestaurantInfo(result, status));
}

// update
function displayRestaurantInfo(result, status) {
    // failed
    if (status !== google.maps.places.PlacesServiceStatus.OK) {
        console.log("showDetails failed: " + status);
        return;
    }

    // html elements
    let divTitle = document.getElementById("divRestaurantTitle");
    let divPhotos = document.getElementById("divPhotos");
    let divAddress = document.getElementById("divAddress");
    let divReviewButtons = document.getElementById("divReviewButtons");

    // expand review objects into array
    reviews = [...result.reviews];

    // make title a website link if they have one
    if (result.website) {
        divTitle.innerHTML = `<p><a href="${result.website}" target="_blank">${result.name} - ${result.rating} \u272e</a></p>`;
    } else {
        divTitle.innerHTML = `<a>${result.name} - ${result.rating} \u272e</a>`;
    }

    // update address and review
    divAddress.innerHTML = `<a>${result.formatted_address}</a>`;
    divReview.innerHTML = `<p>${result.reviews[currentReview].text}</p>`;

    // next and previous buttons
    divReviewButtons.innerHTML = `<a onclick="previousReview()">Previous Review</a> - <a onclick="nextReview()">Next Review</a>`;
    let p = "";
    let numberofPhotos = 0;
    if (result.photos) numberofPhotos = result.photos.length;
    for (let c = 0; c < numberofPhotos; c++) {
        let photo = result.photos[c];

        p += `
        <div class="mySlides fade">
            <img src="${photo.getUrl()}" onclick="slideToggle()" class="foodImage" alt="picture from restaurant"/>                
        </div>`;
    }

    divPhotos.innerHTML = p;
    divPhotos.innerHTML += `
    <a class="prev" onclick="changeSlide(-1)">&#10094;</a>
    <a class="next" onclick="changeSlide(1)">&#10095;</a>`;
}

// scrolls to the next review
// wraps around when it reaches end of reviews
function nextReview() {
    if (currentReview < reviews.length) {
        currentReview++;
    }

    if (currentReview >= reviews.length) {
        currentReview = 0;
    }

    divReview.innerHTML = `<p>${reviews[currentReview].text}</p>`;
}

// scrolls to the previous review
// wraps around when it reachs end of reviews
function previousReview() {
    if (currentReview >= 1) {
        currentReview--;
    }

    if (currentReview === 0) {
        currentReview = reviews.length - 1;
    }

    divReview.innerHTML = `<p>${reviews[currentReview].text}</p>`;
}

// searches nearby places when user changes the cuisine select box
function changeCuisine() {
    let text = selCuisine.value;
    if (text === "Any") text = "Restaurant";
    currentCuisine = text;
    searchResults = [];
    getNearbyPlaces(userLocation);
}

function changeSlide(n) {
    showSlides((slideIndex += n));
}

function currentSlide(n) {
    showSlides((slideIndex = n));
}

function slideToggle() {
    imageToggle = !imageToggle;

    if (imageToggle) {
        showSlides(slideIndex);
    } else {
        let slides = document.getElementsByClassName("mySlides");
        for (let i = 0; i < slides.length; i++)
            slides[i].style.display = "block";
    }
}

function showSlides(n) {
    let slides = document.getElementsByClassName("mySlides");

    // wrap high end
    if (n > slides.length)
        slideIndex = 1;

    // wrap low end
    if (n < 1)
        slideIndex = slides.length;

    // hide all images
    for (let i = 0; i < slides.length; i++)
        slides[i].style.display = "none";

    // display one main image
    slides[slideIndex - 1].style.display = "block";
}