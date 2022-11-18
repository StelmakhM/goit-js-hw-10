import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import countryInfoMarkUp from './templates/countryInfoMarkUp.hbs';
import countriesListMarkUp from './templates/countriesListMarkUp.hbs';

const DEBOUNCE_DELAY = 300;
const refs = {
    input: document.querySelector('input#search-box'),
    countriesList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(inputHandler, DEBOUNCE_DELAY));

function inputHandler(e) {
    const inputValue = e.target.value.trim();
    clearMarkUp();
    if (!inputValue) {
        return;
    }

    fetchCountries(inputValue)
        .then(renderCountries)
        .catch((error) => {
            console.log(error);
            Notiflix.Notify.failure("Oops, there is no country with that name");
        });
}

function renderCountries(countries) {
    if (countries.length > 10) {
        Notiflix.Notify.info("Too many matches found. Please enter a more specific name.");
    }
    if (countries.length >= 2 && countries.length <= 10) {
        createCountriesList(countries);
    }
    if (countries.length === 1) {
        createCountryInfo(countries);
    }

}

function createCountriesList(countries) {
    refs.countriesList.innerHTML = countriesListMarkUp(countries);
};

function createCountryInfo(countries) {
    refs.countryInfo.innerHTML = countryInfoMarkUp(countries);
}

function clearMarkUp() {
    refs.countriesList.innerHTML = '';
    refs.countryInfo.innerHTML = '';
}