window.addEventListener('DOMContentLoaded', event => {

	const sidebarWrapper = document.getElementById('sidebar-wrapper');
	let scrollToTopVisible = false;
	// Closes the sidebar menu
	const menuToggle = document.body.querySelector('.menu-toggle');
	menuToggle.addEventListener('click', event => {
		event.preventDefault();
		sidebarWrapper.classList.toggle('active');
		_toggleMenuIcon();
		menuToggle.classList.toggle('active');
	})


	// Closes responsive menu when a scroll trigger link is clicked
	var scrollTriggerList = [].slice.call(document.querySelectorAll('#sidebar-wrapper .js-scroll-trigger'));
	scrollTriggerList.map(scrollTrigger => {
		scrollTrigger.addEventListener('click', () => {
			sidebarWrapper.classList.remove('active');
			menuToggle.classList.remove('active');
			_toggleMenuIcon();
		})
	});

	function _toggleMenuIcon() {
		const menuToggleBars = document.body.querySelector('.menu-toggle > .fa-bars');
		const menuToggleTimes = document.body.querySelector('.menu-toggle > .fa-times');
		if (menuToggleBars) {
			menuToggleBars.classList.remove('fa-bars');
			menuToggleBars.classList.add('fa-times');
		}
		if (menuToggleTimes) {
			menuToggleTimes.classList.remove('fa-times');
			menuToggleTimes.classList.add('fa-bars');
		}
	}

	// Scroll to top button appear
	document.addEventListener('scroll', () => {
		const scrollToTop = document.body.querySelector('.scroll-to-top');
		if (document.documentElement.scrollTop > 100) {
			if (!scrollToTopVisible) {
				fadeIn(scrollToTop);
				scrollToTopVisible = true;
			}
		} else {
			if (scrollToTopVisible) {
				fadeOut(scrollToTop);
				scrollToTopVisible = false;
			}
		}
	})
})

function fadeOut(el) {
	el.style.opacity = 1;
	(function fade() {
		if ((el.style.opacity -= .1) < 0) {
			el.style.display = "none";
		} else {
			requestAnimationFrame(fade);
		}
	})();
};

function fadeIn(el, display) {
	el.style.opacity = 0;
	el.style.display = display || "block";
	(function fade() {
		var val = parseFloat(el.style.opacity);
		if (!((val += .1) > 1)) {
			el.style.opacity = val;
			requestAnimationFrame(fade);
		}
	})();
};

//loading modal for start game; ask for user name
$('#myForm').on('submit', function(e) {
	$('#exampleModal').modal('show');
	e.preventDefault();
});

//loading modal for about game
$('#myForm2').on('submit', function(e) {
	$('#exampleModal2').modal('show');
	e.preventDefault();

});

$("modal2ok").click(function() {
	$("#exampleModal2").modal('hide');
});


//script for start timer
const timerElement = document.getElementById("timer");
const progressBar = document.getElementById("progressBar")
var startbtn = document.getElementById("startgame");
var ourData;
var score = 0;
startbtn.addEventListener("click", function() {
	$('#btnsdiv').show();
	$('#startgame').hide();
	var timerCounter = progressBar.max
	const interval = setInterval(() => {
		if (timerCounter <= 1) {
			var last_user_Request = new XMLHttpRequest();
			last_user_Request.open('GET', 'http://127.0.0.1:5000/api/getlastuser/');
			last_user_Request.send();
			last_user_Request.onload = function() {
				last_user = JSON.parse(last_user_Request.responseText);
			};
			var scoreRequest = new XMLHttpRequest();
			scoreRequest.open('PUT', 'http://127.0.0.1:5000/api/updatescore/' + last_user.id + '/' + score);
			scoreRequest.send();
			window.location.href = '/leaderboard';
			timerElement.innerText = "Time is up!";
			clearInterval(interval);
		}

		timerCounter = timerCounter - 1;

		timerElement.innerText = timerCounter + "s";
		progressBar.value = timerCounter;
	}, 1000);

	AJAXload();

});


//AJAX for loading JSON from API
var personContainer = document.getElementById("person-info");
var idcount = 0;

function AJAXload() {

	var ourRequest = new XMLHttpRequest();
	ourRequest.open('GET', 'http://127.0.0.1:5000/api/getallperson/');
	ourRequest.onload = function() {
		if (ourRequest.status >= 200 && ourRequest.status < 400) {
			ourData = JSON.parse(ourRequest.responseText);
			renderHTML(ourData);
		} else {
			console.log("We connected to the server, but it returned an error.");
		}

	};

	ourRequest.onerror = function() {
		console.log("Connection error");
	};

	ourRequest.send();

}

function renderHTML(data) {
	var htmlString = "";

	htmlString += "<table class='table'>"
	htmlString += "<tr> <th scope='col'>Age: </th>  <td>" + data[idcount].Age + "</td> </tr>"
	htmlString += "<tr> <th scope='col'>Gender: </th>   <td>" + data[idcount].Gender + "</td> </tr>"
	htmlString += "<tr> <th scope='col'>Temperature: </th>   <td>" + data[idcount].Temperature + "</td> </tr>"
	htmlString += "<tr> <th scope='col'>Wearing Mask: </th>   <td>" + data[idcount].WearingMask + "</td> </tr>"
	htmlString += "<tr> <th scope='col'>Wearing Face Shield: </th>   <td>" + data[idcount].WearingFaceShield + "</td> </tr>"
	htmlString += "</table>"

	personContainer.insertAdjacentHTML('beforeend', htmlString);
}



var ansRequest = new XMLHttpRequest();
var allowbtn = document.getElementById("allow");
allowbtn.addEventListener("click", function() {

	ansRequest.open('GET', 'http://127.0.0.1:5000/api/check/person/' + (idcount + 1) + '/Allow');
	ansRequest.onload = function() {
		if (ansRequest.status >= 200 && ansRequest.status < 400) {
			ansRes = JSON.parse(ansRequest.responseText);
			checkresult(ansRes);

		} else {
			console.log("We connected to the server, but it returned an error.");
		}
	};
	ansRequest.send();
	document.getElementById('person-info').innerHTML = "";
	idcount = idcount + 1;
	renderHTML(ourData);
});



var denybtn = document.getElementById("deny");
denybtn.addEventListener("click", function() {

	ansRequest.open('GET', 'http://127.0.0.1:5000/api/check/person/' + (idcount + 1) + '/Deny');
	ansRequest.onload = function() {
		if (ansRequest.status >= 200 && ansRequest.status < 400) {
			ansRes = JSON.parse(ansRequest.responseText);
			console.log(ansRes)
			checkresult(ansRes);

		} else {
			console.log("We connected to the server, but it returned an error.");
		}
	};

	ansRequest.send();
	document.getElementById('person-info').innerHTML = "";
	idcount = idcount + 1;
	renderHTML(ourData);

});


var capturebtn = document.getElementById("capture");
capturebtn.addEventListener("click", function() {
	ansRequest.open('GET', 'http://127.0.0.1:5000/api/check/person/' + (idcount + 1) + '/Capture');
	ansRequest.onload = function() {
		if (ansRequest.status >= 200 && ansRequest.status < 400) {
			ansRes = JSON.parse(ansRequest.responseText);
			console.log(ansRes)
			checkresult(ansRes);

		} else {
			console.log("We connected to the server, but it returned an error.");
		}
	};

	ansRequest.send();
	document.getElementById('person-info').innerHTML = "";
	idcount = idcount + 1;
	renderHTML(ourData);

});


function checkresult(ansRes) {
	if (ansRes.result == 'correct') {
		console.log(ansRes.result)
		score = score + 1;
		document.getElementById('currentscore').innerHTML = score;
	} else if (ansRes.result == 'wrong') {
		console.log(ansRes.result)
	}
}