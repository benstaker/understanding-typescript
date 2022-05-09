import axios from 'axios';

const form = document.querySelector('form')! as HTMLFormElement;
const addressInput = document.getElementById('address')! as HTMLInputElement;

// NOTE: Add key here
const GOOGLE_API_KEY = '';
const GOOGLE_API_URL = 'https://maps.googleapis.com/maps/api/geocode/json';

type GoogleApiCoords = {
    lat: number;
    lng: number;
};
interface GoogleApiResult {
    geometry: {
        location: GoogleApiCoords;
    };
}
enum GoogleApiStatus {
    OK = 'OK',
    ZERO_RESULTS = 'ZERO_RESULTS'
}
interface GoogleApiResponse {
    results: GoogleApiResult[];
    status: GoogleApiStatus;
}

function searchAddressHandler(event: Event) {
    event.preventDefault();

    const enteredAddress = addressInput.value.trim() + ' UK';

    axios
        .get<GoogleApiResponse>(
            `${GOOGLE_API_URL}?address=${encodeURI(enteredAddress)}&key=${GOOGLE_API_KEY}`
        )
        .then((response) => {
            if (response.data.status !== GoogleApiStatus.OK) {
                throw new Error('Could not fetch location');
            }

            const coords: GoogleApiCoords = response.data.results[0].geometry.location;

            const mapElement = document.getElementById('map')! as HTMLDivElement;
            const map = new google.maps.Map(mapElement, {
                center: coords,
                zoom: 12
            });

            new google.maps.Marker({
                position: coords,
                map: map
            });
        })
        .catch((err) => console.error(err));
}

form.addEventListener('submit', searchAddressHandler);
