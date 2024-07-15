'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

const renderCountry = function (data, className = '') {
  const languages = Object.values(data.languages).join(', ');
  const currencies = Object.values(data.currencies)
    .map(currency => currency.name)
    .join(', ');

  const html = `
      <article class="country ${className}">
      <img class="country__img" src="${data.flags.png}" />
      <div class="country__data">
      <h3 class="country__name">${data.name.common}</h3>
      <h4 class="country__region">${data.region}</h4>
      <p class="country__row"><span>👫</span>${(
        +data.population / 1000000
      ).toFixed(1)} People</p>
      <p class="country__row"><span>🗣️</span>${languages}</p>
      <p class="country__row"><span>💰</span>${currencies}</p>
      </div>
      </article>`;
  countriesContainer.insertAdjacentHTML('beforeend', html);
  //   countriesContainer.style.opacity = 1;
};

const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
  //   countriesContainer.style.opacity = 1;
};
///////////////////////////////////////
// const getCountryData = function (country) {
//   const request = new XMLHttpRequest();
//   request.open('GET', `https://restcountries.com/v3.1/name/${country}`);
//   request.send();

//   request.addEventListener('load', function () {
//     const [data] = JSON.parse(this.responseText);
//     console.log(data);

//     const languages = Object.values(data.languages).join(', ');
//     const currencies = Object.values(data.currencies)
//       .map(currency => currency.name)
//       .join(', ');

//     const html = `
//     <article class="country">
//         <img class="country__img" src="${data.flags.png}" />
//     <div class="country__data">
//         <h3 class="country__name">${data.name.common}</h3>
//         <h4 class="country__region">${data.region}</h4>
//         <p class="country__row"><span>👫</span>${(
//           +data.population / 1000000
//         ).toFixed(1)} People</p>
//         <p class="country__row"><span>🗣️</span>${languages}</p>
//         <p class="country__row"><span>💰</span>${currencies}</p>
//     </div>
//     </article>`;
//     countriesContainer.insertAdjacentHTML('beforeend', html);
//     countriesContainer.style.opacity = 1;
//   });
// };

// getCountryData('nepal');
// // getCountryData('usa');

/*
const getCountryAndNeighbour = function (country) {
    // 1st AJAX call
    const request = new XMLHttpRequest();
    request.open('GET', `https://restcountries.com/v3.1/name/${country}`);
    request.send();
    
    request.addEventListener('load', function () {
        const [data] = JSON.parse(this.responseText);
        console.log(data);
        renderCountry(data);
        
        // get neighbour countery
        const neighbour = data.borders?.[0];
        if (!neighbour) return;
        
        // 2nd AJAX call
        const request2 = new XMLHttpRequest();
        request2.open('GET', `https://restcountries.com/v3.1/alpha/${neighbour}`);
        request2.send();
        
        request2.addEventListener('load', function () {
            const [data2] = JSON.parse(this.responseText);
            console.log(data2);
            renderCountry(data2, 'neighbour');
        });
    });
};

getCountryAndNeighbour('china');
*/

// Promise
// const request = fetch(`https://restcountries.com/v3.1/name/nepal`);
// console.log(request);
const getJSON = function (url, errorMsg = 'something went wrong') {
  return fetch(url).then(response => {
    if (!response.ok) throw new Error(`${errorMsg} (${response.status})`);

    return response.json();
  });
};

const getCountryData = function (country) {
  getJSON(`https://restcountries.com/v3.1/name/${country}`, 'country not found')
    .then(data => {
      console.log('Country data:', data);
      renderCountry(data[0]);

      const neighbour = data[0].borders ? data[0].borders[0] : null;
      if (!neighbour) throw new Error('No neighbour found!');

      return getJSON(
        `https://restcountries.com/v3.1/alpha/${neighbour}`,
        'country not found'
      );
    })
    .then(data => {
      console.log('Neighbour data:', data);
      renderCountry(data[0], 'neighbour');
      //     const neighbour2 = data[0].borders ? data[0].borders[0] : null;
      //     if (!neighbour2) return;

      //     return fetch(`https://restcountries.com/v3.1/alpha/${neighbour2}`);
      //   })
      //   .then(response => {
      //     if (!response) return;
      //     return response.json();
      //   })
      //   .then(data2 => {
      //     console.log('Neighbour data:', data2);
      //     renderCountry(data2[0], 'neighbour');
    })
    .catch(err => {
      console.error(`${err}🚫🚫🚫`);
      renderError(`some thing went wrong ${err.message}. Try again`);
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};
btn.addEventListener('click', function () {
  getCountryData('nepal');
});
