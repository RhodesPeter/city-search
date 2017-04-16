(function () {
  var searchInput = document.getElementsByClassName('search-input')[0];
  var searchForm = document.getElementsByClassName('search-form')[0];
  var mapContainer = document.getElementsByClassName('map-container')[0];
  var suggestionsDiv = document.getElementsByClassName('suggestions')[0];
  var suggestions = document.getElementsByClassName('suggestions')[0];

  var xmlhttp = new XMLHttpRequest();

  searchInput.addEventListener('keyup', displayMatches);

  var endpoint = 'https://gist.githubusercontent.com/' +
    'Miserlou/c5cd8364bf9b2420bb29/raw/' +
    '2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json';

  xmlhttp.open("GET", endpoint, true);
  xmlhttp.send();

  var data = {};
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      data = JSON.parse(this.responseText);
    }
  }

  function findMatches(searchedStr, data){
    return data.filter(function(place){
      var regex = new RegExp(searchedStr, 'gi');
      return place.city.match(regex) || place.state.match(regex);
    });
  }

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function displayMatches(){
    var searchedStr = this.value;

    if (searchedStr === ''){
      suggestionsDiv.innerHTML = '';
      return
    }

    var matchArray = findMatches(searchedStr, data);
    var index = window.innerWidth < 1160 ? 20 : 8;
    var html = matchArray.slice(0,index).map(function(place){
      var regex = new RegExp(searchedStr, 'gi');
      var cityName = place.city.replace(regex, `<span id=${states[place.state]} class="matchedString">${searchedStr}</span>`);
      var stateName = place.state.replace(regex, `<span id=${states[place.state]} class="matchedString">${searchedStr}</span>`);

      return `
        <li id=${states[place.state]} class="suggestions-list">
          <span id=${states[place.state]} class="name">${cityName}, ${stateName}</span>
          <span id=${states[place.state]} class="population">${numberWithCommas(place.population)}</span>
        </li>
      `;
    }).join('');

    suggestionsDiv.innerHTML = html;
  }

  var lineDrawing = anime({
    targets: `#MA, #MN, #MT, #ND, #HI, #ID, #WA, #AZ, #CA, #CO, #NV, #NM, #OR,
    #UT, #WY, #AR, #IA, #KS, #MO, #NE, #SD, #OK, #LA, #TX, #CT, #NH, #RI, #VT,
    #AL, #FL, #GA, #MS, #SC, #IL, #IN, #KY, #NC, #OH, #TN, #VA, #WI, #WV, #DE,
    #DC, #MD, #NJ, #NY, #PA, #MI, #ME, #AK`,
    strokeDashoffset: [anime.setDashoffset, 0],
    easing: 'easeInOutSine',
    duration: 650,
    delay: function(el, i) { return i * 100 },
    direction: 'alternate',
    loop: false
  });

  addListenerToSuggestionsDiv();

  var prev = null;
  function addListenerToSuggestionsDiv(){
    suggestions.addEventListener('click', function(){
      if(prev){ prev.setAttribute("style", "fill: transparent; stroke: black; \
        transition: fill 1s, stroke 1s;"); }
      var element = document.getElementById(event.target.id);
      element.setAttribute("style", "fill: red; stroke: red;");
      prev = element;
    });
  }

})();
