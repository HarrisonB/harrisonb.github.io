var origin = view.center + new Point(0, -100);
var reachedEndState = false;
var flowerStore = [];
var petals = [];
var shareSetUp = false;
var instructions = document.getElementById("instructions");
var message = document.getElementById("message");
var resetLink = document.getElementById("reset");
if (window.location.hash) {
	reachedEndState = true;
	flowerStore = JSON.parse(decodeURIComponent(window.location.hash.substring(1)));
	flowerStore.forEach(function(a) {
		drawFlower.apply(undefined, a);
		message.style.display = "block";
		instructions.style.display = "none";
	});
	resetLink.innerHTML = "Make your own";
	resetLink.style.width 
} else {
	message.style.display = "none";
	instructions.style.display = "block";
}
function setUpShare() {
	window.location.hash = "#" + encodeURIComponent(JSON.stringify(flowerStore));
	// shareText = new PointText(new Point(0, 400) + origin);
	// shareText.justification = 'center';
	// shareText.fillColor = 'black';
	// shareText.content = "Share your flower:\n " + window.location;
	shareSetUp = true;
	var button = document.getElementById("btn");
	button.style.display = "block";
	button.setAttribute("data-clipboard-text", window.location.href);
}
function drawFlower(r, n, c, w) {
	var p = new Point(r, 0);
	if  (c === undefined)  {
		c = new Color({
			hue: Math.random() * 360,
			saturation: .3,
			brightness: .9 
		});
	}
	if (w === undefined) {
		var w = Math.random();
	}
	function drawPetal(tip) {
		var path = new Path();
		path.add(origin);
		var diff = tip;
		var spread = diff / n;
		spread.angle += 90;
		diff.middlePoint = diff * w;
		var top = diff.middlePoint + spread;
		var bottom = diff.middlePoint - spread;
		path.add(top + origin);
		path.insert(0, bottom + origin);
		path.add(tip + origin);
		path.fillColor = c;
		path.closed = true;
		path.smooth();
		petals.push(path);
	}
	for (var i = 0; i < n; i++) {
		drawPetal(p);
		p.angle += 360 / n;
	}
	if (!reachedEndState) {
		flowerStore.push([r, n, c.toCSS(true), w]);
	}
}
function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
}
var circ = new Shape.Circle({
	center: origin,
	radius: 40,
	strokeColor: '#777777',
	dashArray: [3, 4],
	name: 'circ'
});
var originalRadius = circ.radius;
var orignalDash = circ.dashArray.slice()
var rising = true;
var maxRadius = 300;
var minRadius = 60;
var count = 5;
var i = 0;
function onFrame(event) {
	if (!reachedEndState) {
		inc = 1;
		if (rising) {
			circ.radius += inc;
		} else {
			circ.radius -= inc;
		}
		circ.dashArray = orignalDash.map(function(c) {
			return c * (circ.radius / originalRadius);
		}); 
		if (circ.radius > maxRadius) {
			rising = false;
		}
		else if (circ.radius < minRadius) {
			rising = true;
		}
	} else {
		circ.remove();
	}
}
function onMouseDown(event) {
	if (i < count && !reachedEndState) {
		drawFlower(circ.radius, getRandomInt(4,12));
		maxRadius = circ.radius;
		circ.radius = originalRadius;
		rising = true;
		project.activeLayer.children['circ'].bringToFront();
		i++;
	}
	if (i >= count && !shareSetUp) {
		reachedEndState = true;
		setUpShare();
	}
}
function onResize(event) {
	// Whenever the window is resized, recenter the path:
	origin = view.center + new Point(0, -100);
	if (circ !==  undefined)
		circ.position = origin;
	petals.forEach(function(p) {
		p.remove();
	});
	petals = [];
	flowerStore.forEach(function(a) {
		drawFlower.apply(undefined, a);
	});
}
