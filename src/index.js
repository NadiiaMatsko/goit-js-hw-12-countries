'use strict';

import './sass/main.scss';

import fetchCountries from './js/fetchCountries';
import coutryListMarkup from './templates/countries.hbs';
import coutryInfoMarkup from './templates/info.hbs';
import { refs } from './js/refs';

import { error } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import { defaults } from '@pnotify/core';
defaults.delay = '1500';
import '@pnotify/core/dist/BrightTheme.css';

const debounce = require('lodash.debounce');
const URL_BASE = 'https://restcountries.eu/rest/v2/name';

const clearRender = () => {
  refs.list.innerHTML = '';
  refs.info.innerHTML = '';
};

const countryRender = countries => {
  if (countries.length === 1) {
    clearRender();
    refs.info.innerHTML = coutryInfoMarkup(countries);
  } else if (countries.length >= 2 && countries.length <= 10) {
    clearRender();
    refs.list.innerHTML = coutryListMarkup(countries);
  } else {
    clearRender();
    error({
      text: 'Too many matches found. Please enter a more specific query!',
    });
  }
};

function onInput(e) {
  const searchQuery = e.target.value;
  fetchCountries(searchQuery)
    .then(countryRender)
    .catch(err => {
      clearRender();
      error({
        text: 'Please enter a valid country name!',
      });
    });
}
refs.input.addEventListener('input', debounce(onInput, 500));
