class Boid {
	constructor(pos) {
		this.position = pos;
		this.velocity = p5.Vector.random2D().setMag(5);
		this.acceleration = createVector();
		this.maxForce = 1;
		this.maxSpeed = 4;
		//this.color = color(Math.round(random(0,255)), Math.round(random(0,255)), Math.round(random(0,255)))
		this.color = color(this.position.x / width * 255, this.position.y / height * 255, 255 - (this.position.x / width * 255 + this.position.y / height * 255))
		this.static = false
		this.deflect = false
		this.lastPos = pos
		this.deflectRange = 100
	}

	edges() {
		if (this.position.x > width) {
			this.position.x = 0;
		} else if (this.position.x < 0) {
			this.position.x = width;
		}
		if (this.position.y > height) {
			this.position.y = 0;
		} else if (this.position.y < 0) {
			this.position.y = height;
		}
	}

	combined(boids) {
		let alignV = createVector();
		let separationV = createVector();
		let cohesionV = createVector();
		let total = 0;

		for (var i = 0; i < boids.length; i++) {
			var other = boids[i]
			if (other != this) {
				let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
				//alignif(other.type == this.type)
				if (!other.deflect)
					alignV.add(other.velocity);

				//separation
				let diff = p5.Vector.sub(this.position, other.position);

				diff.div(d * d);
				if (other.deflect && d < other.deflectForce) {
					separationV.add(diff).mult(other.deflectForce);
					total++
				}
				else {
					separationV.add(diff);
				}
				//cohesion
				if (!other.deflect)
					cohesionV.add(other.position);
			}
		}
		if (boids.length > 1) {
			alignV.div(boids.length - 1 - total);
			alignV.setMag(this.maxSpeed);

			alignV.sub(this.velocity);
			alignV.limit(this.maxForce);


			separationV.div(boids.length - 1 - total);
			separationV.setMag(this.maxSpeed);

			separationV.sub(this.velocity);
			separationV.limit(this.maxForce * 1.2);


			cohesionV.div(boids.length - 1 - total);
			cohesionV.sub(this.position);

			cohesionV.setMag(this.maxSpeed);

			cohesionV.sub(this.velocity);
			cohesionV.limit(this.maxForce);
		}
		return [alignV, separationV, cohesionV]
	}

	flock(boids) {
		if (this.static) return
		var combined = this.combined(boids)
		let alignment = combined[0];
		let cohesion = combined[1];
		let separation = combined[2];

		this.acceleration.add(alignment);
		this.acceleration.add(cohesion);
		this.acceleration.add(separation);
	}

	update() {
		if (this.static) return
		this.position.add(this.velocity);
		this.velocity.add(this.acceleration);
		this.velocity.limit(this.maxSpeed);
		this.acceleration.mult(0);
	}

	show(st = 8) {
		strokeWeight(st);
		stroke(this.color)
		//stroke()
		//point(this.position.x, this.position.y);
		line(this.position.x, this.position.y, this.lastPos.x, this.lastPos.y)
		this.lastPos = this.position
	}
}
