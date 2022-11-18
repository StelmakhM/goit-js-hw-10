import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import countryInfoMarkUp from './templates/countryInfoMarkUp.hbs';
import countriesListMarkUp from './templates/countriesListMarkUp.hbs';

const DEBOUNCE_DELAY = 300;

const refs = {
    input: document.querySelector('input#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(inputHandler, DEBOUNCE_DELAY));

function inputHandler(e) {
    const inputValue = e.target.value.toLowerCase().trim();
    fetchCountries(inputValue)
        .then(countries => {
            refs.countryList.innerHTML = '';
            refs.countryInfo.innerHTML = '';
            if (!inputValue) {
                throw new Error('Input is empty');
            }
            if (countries.length > 10) {
                Notiflix.Notify.info("Too many matches found. Please enter a more specific name.");
            }
            return countries;
        })
        .then(countries => {
            if (countries.length >= 2 && countries.length <= 10) {
                createCountriesList(countries);
            }
            return countries;
        })
        .then(countries => {
            if (countries.length === 1) {
                createCountryInfo(countries);
            }
        })
        .catch((error) => {
            if (error) {
                console.log(error);
            } else {
                Notiflix.Notify.failure("Oops, there is no country with that name");
            }
        });

}


function createCountriesList(countries) {
    const markUp = countries.map(countriesListMarkUp);
    refs.countryList.innerHTML = markUp.join('');
};


function createCountryInfo(countries) {
    const markUp = countries.map(countryInfoMarkUp);
    refs.countryInfo.innerHTML = markUp.join('');
}