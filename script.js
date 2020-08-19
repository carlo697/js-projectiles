var gravedad = 20;

function getGravity() {
	return new Vector(0, gravedad);
}

var trailTime = 0.02;
var trailLifeTime = 300;
var spawnTime = 1000;

var minimunSize = 10;
var maximumRandSize = 20;

const main = document.querySelector("main");
var addedSquares = [];

function createBasicSquare() {
	var square = document.createElement("span");

	square.style.top = (Math.random() * innerHeight) + "px";
	square.style.left = "0px";

	square.style.width = (minimunSize + (Math.random() * maximumRandSize)) + "px";
	square.style.height = (minimunSize + (Math.random() * maximumRandSize)) + "px";

	main.appendChild(square);

	return square;
}

function createSquare() {
	var square = document.createElement("span");

	square.style.top = (Math.random() * innerHeight) + "px";
	square.style.left = "0px";

	square.style.width = (10 + (Math.random() * 10)) + "px";
	square.style.height = (10 + (Math.random() * 10)) + "px";

	square.velocidad = new Vector(
		Math.random() * 800,
		-Math.random() * 500);
	square.aceleracion = getGravity();

	main.appendChild(square);
	addedSquares.push(square);

	square.trailTime = 0;

	setTimeout(() => {
		removeSquare(square);
	}, 2000);

	return square;
}

function removeSquare(square) {
	var index = addedSquares.indexOf(square);
	addedSquares.splice(index, 1);
	square.remove();
}

setInterval(createSquare, spawnTime);

function update(deltaTime) {
	const tiempoTranscurrido = document.getElementById("TiempoTranscurrido");
	tiempoTranscurrido.innerHTML = elapsedTime.toFixed(2) + " s";

	for (var i = addedSquares.length - 1; i >= 0; i--) {
		var square = addedSquares[i];
		square.trailTime += deltaTime;

		if (square.trailTime > trailTime) {
			square.trailTime = 0;

			let trail = document.createElement("div");
			trail.className = "trail-cube";

			trail.style.top = square.style.top;
			trail.style.left = square.style.left;
			trail.style.height = square.style.height;
			trail.style.width = square.style.width;

			main.appendChild(trail);

				setTimeout( () => {
					trail.remove();
				}, trailLifeTime);
		}
	}

	for (var i = addedSquares.length - 1; i >= 0; i--) {
		var square = addedSquares[i];

		var currentTop = parseFloat(square.style.top);
		/*
		if (currentTop > (innerHeight - 100)) {
			addedSquares.splice(i, 1);
			square.remove();

			continue;
		}
		*/

		var currentLeft = parseFloat(square.style.left);

		

		square.style.top = (currentTop + (square.velocidad.y * deltaTime)) + "px";
		square.style.left = (currentLeft + (square.velocidad.x * deltaTime)) + "px";

		square.velocidad.y += square.aceleracion.y;
		
	}
}

function loop(timeStamp) {
	var deltaTime = (timeStamp - lastTime) / 1000;
	elapsedTime += deltaTime;

	lastTime = timeStamp;

	update(deltaTime);

	requestAnimationFrame(loop);
}

var lastTime = 0;
var elapsedTime = 0;
requestAnimationFrame(loop);


var addedSquareTrails = [];
var squareBeingAdded = null;
var lastPosition = 0;

function onClick(event) {
	if (squareBeingAdded == null) {
		var square = createBasicSquare();
		lastPosition = new Vector(event.pageX, event.pageY);

		square.style.left = event.pageX + "px";
		square.style.top = event.pageY + "px";

		squareBeingAdded = square;
	}
	else {
		var vel = lastPosition.substract(new Vector(event.pageX, event.pageY));
		squareBeingAdded.velocidad = vel.multiply(4);
		squareBeingAdded.aceleracion = getGravity();

		addedSquares.push(squareBeingAdded);

		for (var i = addedSquareTrails.length - 1; i >= 0; i--) {
			addedSquareTrails[i].remove();
			addedSquareTrails.splice(i, 1);
		}

		squareBeingAdded.trailTime = 0;;

		( function(square) {
			setTimeout( () => {
				removeSquare(square);
			}, 2000)
		})(squareBeingAdded);

		squareBeingAdded = null;
	}
}

function onMouseMove(event) {
	const count = 20;
	var currentPos = new Vector(event.clientX, event.clientY);

	if (squareBeingAdded != null) {
		if (addedSquareTrails.length == 0) {

			for (var i = 0; i < count; i++) {
				var trail = document.createElement("div");
				trail.className = "static-trail";
				addedSquareTrails.push(trail);
				main.appendChild(trail);
			}
		}
		else {
			var initialPos = lastPosition.clone();
			var movement = Vector.substract(currentPos, initialPos).multiply(1/ count);
			var length = movement.length();

			for (var i = 0; i < addedSquareTrails.length; i++) {
				var trail = addedSquareTrails[i];
				
				var desiredPos = Vector.add(movement, initialPos);

				trail.style.top = desiredPos.y + "px";
				trail.style.left = desiredPos.x + "px";

				initialPos = desiredPos.clone();
			}

			squareBeingAdded.style.left = lastPosition.x + "px";
			squareBeingAdded.style.top = lastPosition.y + "px";
		}
	}
}

document.addEventListener("click", onClick);
document.addEventListener("mousemove", onMouseMove);






function Vector(x, y) {
	this.x = x || 0;
	this.y = y || 0;
}

Vector.prototype = {
	clone: function(v) {
		return new Vector(this.x, this.y);
	},
	add: function(v) {
		if (v instanceof Vector) {
			this.x += v.x;
			this.y += v.y;
		} else {

		}
		return this;
	},
	substract: function(v) {
		if (v instanceof Vector) {
			this.x -= v.x;
			this.y -= v.y;
		}
		return this;
	},
	multiply: function(v) {
		if (v instanceof Vector) {

		} else {
			this.x *= v;
			this.y *= v;
		}
		return this;
	},
	length: function(v) {
		return Math.sqrt((this.x * this.x) + (this.y * this.y))
	},
	normalize: function(v) {
		return this.multiply(1 / this.length());
	}
};


Vector.add = function(a, b) {
	return new Vector(a.x + b.x, a.y + b.y);
}

Vector.substract = function(a, b) {
	return new Vector(a.x - b.x, a.y - b.y);
}