function getPeople() {
  $.ajax({
      url: 'http://namegame.willowtreemobile.com:2000',
      success: function(people) {
        var img = document.getElementById('personImg'),
        button = document.getElementById('theButton'),
        guess = document.getElementById('nameGuess');
        mainGameLoop(people, img, button, guess);
      }
    });
}

function mainGameLoop(people, img, button, guess) {
  var rand = getRand(people.length), name, url;
  name = people[rand].name;
  url = people[rand].url;
  render(img, url, guess);
  $('#theButton').off().on('click', function(event) {
    event.preventDefault();
    parseGuess(guess.value, name);
    mainGameLoop(people, img, button, guess);
  });
  $('#mattButton').off().on('click', function(event) {
    event.preventDefault();
    mattGameInit(people);
  });
}

function mattGameInit(people) {
  var i, matts = [], main = document.getElementById('mainContainer'),
      matt = document.getElementById('mattContainer'),
      mainImg = document.getElementById('personImg');
  main.style.display = "none";
  matt.style.display = "";
  mainImg.style.display = "none";
  for (i = 0; i < people.length; i++) {
    if (people[i].name.slice(0, 3) === "Mat") {
      matts.push(people[i]);
    }
  }
  mattGameLoop(matts);
}

function mattGameLoop(matts) {
  shuffle(matts);
  populateMatts(matts);
  var question = document.getElementById('mattQuestion'),
      thisMatt = matts[getRand(5)],
      main = document.getElementById('mainButton'),
      secret = document.getElementById('secretButton'),
      mattContainer = document.getElementById('mattContainer'),
      mainContainer = document.getElementById('mainContainer'),
      mysterious = [];
  question.innerHTML = "<h1>Which one is " + thisMatt.name + "?</h1>";
  $('.mattImg').off().on('click', function(event) {
    event.preventDefault();
    if (event.target.id === thisMatt.name) {
      rightMatt(event.target, matts);
    } else {
      wrongMatt(event.target);
    }
  });
  $(main).off().on('click', function(event) {
    event.preventDefault();
    mattContainer.style.display = "none";
    mainContainer.style.display = "";
    $(this).off();
    getPeople();
  });
  $(secret).off().on('click', function(event) {
    event.preventDefault();
    matts.forEach(function(matt) {
      if (matt.name === "Matt Dawson") {
        for (var i = 1; i < 6; i++) {
          mysterious.push(matt);
        }
      }
    });
    mattGameLoop(mysterious);
  });
}

function populateMatts(matts) {
  for (var i = 0; i < 5; i++) {
    container = document.getElementById('matt' + i);
    container.innerHTML = '<img src="' + matts[i].url + '" id="' +
      matts[i].name + '" class="mattImg">';
  }
}

function render(img, url, guess) {
  form = document.getElementById('input');
  img.src = url;
  img.style.display = "";
  input.style.display = "";
  guess.value = "";
}

function parseGuess(guess, name) {
  var i, greater, wrong = 0, nameLen = name.length,
      guessLen = guess.length,
      span = document.getElementById('answer');
  greater = guessLen > nameLen ? guessLen : nameLen;
  for (i = 0; i < greater; i++) {
    if (name[i] !== guess[i]) {
      wrong += 1;
    }
  }
  if (wrong > 5) {
    wrongGuess(span, name);
  } else {
    rightGuess(span, name);
  }
}

function wrongGuess(span, name) {
  span.innerHTML = "WRONG!!!! That was " + name + "!";
  adjustScore(-1);
}

function rightGuess(span, name) {
  span.innerHTML = "RIGHT!!!! That was " + name + "!";
  adjustScore(1);
}

function wrongMatt(matt) {
  $(matt).fadeOut(1000, function() {
    matt.parentNode.innerHTML = "<h3 class='mattImg wrong'>Wrong!! That was " +
                                matt.id + "!</h3>";
  });
}

function rightMatt(matt, matts) {
  var collection = document.getElementsByClassName('mattImg'),
      container = document.getElementById('mattContainer'),
      question = document.getElementById('mattQuestion');
  collection = $(collection).not(matt);
  collection.fadeOut(1000, function() {
    question.innerHTML = "<h1 class='correct'>Yep! That's " +
                          matt.id + " alright!</h1>";
    setTimeout(function() { mattGameLoop(matts); }, 2700);
  });
}

function adjustScore(adj) {
  var score, scoreEl = document.getElementById('score');
  if (scoreEl.textContent) {
    score = parseInt(scoreEl.textContent.slice(12));
    score += adj;
  } else {
    score = adj;
  }
  scoreEl.innerHTML = "Your Score: " + score;
}

function shuffle(arr) {
  for (var j, x, i = arr.length; i; j = getRand(i), x = arr[--i],
        arr[i] = arr[j], arr[j] = x);
  return arr;
}

function getRand(num) {
  return Math.floor(Math.random() * num);
}

getPeople();

var isPushEnabled = false;

window.addEventListener('load', function() {
  var pushButton = document.querySelector('#js-push-button');
  pushButton.addEventListener('click', function() {
    if (isPushEnabled) {
      unsubscribe();
    } else {
      subscribe();
    }
  });

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
    .then(initializeState);
  } else {
    alert('Service workers aren\'t supported in this browser.');
  }
});

window.initializeState = function() {
  console.log("hello");
};
