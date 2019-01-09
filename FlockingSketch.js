const flock = [];
let visualize = false

let alignSlider, cohesionSlider, separationSlider;
let quadTree;
let statics = []
let adjustTime = 60
function setup() {
	createCanvas(window.innerWidth - 20, window.innerHeight - 20);
	frameRate(60)
	createBoids(100)
	background(0)
}

function draw() {
	if (frameCount > adjustTime) {
		if (frameRate() > 40) {
			createBoids(10)
			console.log("added 5 boids")
			adjustTime = frameCount + frameRate()
		}
		else if (frameRate() < 30) {
			removeBoids(10)
			console.log("removed 5 boids")
			adjustTime = frameCount + frameRate()
		}
	}
	background(color(0, 0, 0, 15))

	quadTree = new QuadTree(new Rectangle(0, 0, width, height))
	quadTree.visualize = visualize
	quadTree.insertRange(flock)
	for (let boid of flock) {
		c = new Circle(boid.position.x, boid.position.y, 100)
		boid.flock(quadTree.query(c))
		boid.update()
		boid.edges()
		boid.show(8)
	}

	for (var i = 0; i < touches.length; i++) {
		var x = touches[i].x
		var y = touches[i].y
		c = new Circle(x, y, 100)

		var asd = quadTree.query(c)
		for (var j = 0; j < asd.length; j++) {
			let d = dist(x, y, asd[j].position.x, asd[j].position.y);

			let diff = p5.Vector.sub(createVector(x, y), asd[j].position).mult(-1);
			diff.div(d * d);

			asd[j].acceleration.add(diff).mult(100);
		}
	}
	if (mouseIsPressed) {
		if (mouseButton === LEFT) {
			c1 = new Circle(mouseX, mouseY, 120)
			var asd = quadTree.query(c1)
			for (var j = 0; j < asd.length; j++) {
				let d = dist(c1.x, c1.y, asd[j].position.x, asd[j].position.y);

				let diff = p5.Vector.sub(createVector(c1.x, c1.y), asd[j].position).mult(-1);
				diff.div(d * d);

				asd[j].acceleration.add(diff).mult(200);
			}
		}
		if (mouseButton === RIGHT) {
			c1 = new Circle(mouseX, mouseY, 200)
			var asd = quadTree.query(c1)
			for (var j = 0; j < asd.length; j++) {
				let d = dist(c1.x, c1.y, asd[j].position.x, asd[j].position.y);

				let diff = p5.Vector.sub(createVector(c1.x, c1.y), asd[j].position).mult(-1);
				diff.div(d * d);

				asd[j].acceleration.add(diff).mult(-880);
			}
		}
	}
}

function createBoids(num) {
	for (let i = 0; i < num; i++) {
		flock.push(new Boid(createVector(random(40, width - 40), random(40, height - 40))));
	}
}

function removeBoids(num) {
	if (num > flock.length) {
		return
	}
	for (let i = 0; i < num; i++) {
		flock.splice(Math.floor(random(0, flock.length)), 1)
	}
}

