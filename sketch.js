//Snowflake class
function Snowflake(){
	this.x = random(width);
	this.y = random(-30,-200)*rs;
	this.size = random(5,8)*rs;
	this.speedY = random(0.5,1.5)*rs;
	this.speedX = random(1,10)*rs;
	
	this.show = function (){
		circle(this.x,this.y,this.size);
	};
	this.update = function (){
		this.y += this.speedY;
		this.x += sin(this.y*PI/180)/this.speedX;
	};
	this.restart =function (){
		this.x = random(width);
		this.y = random(-30,-100)*rs;
		this.size = random(5,8)*rs;
		this.speedY = random(0.5,1.5)*rs;
		this.speedX = random(1,10)*rs;
	}
}
function Player(){
	this.x = 50*rs;
	this.y = height/2;
	this.fly = false;
	this.acc = 0;
	this.vel = 0;
	this.dead = false;
	this.size = 10*rs;
	this.score = 0;
	this.lives = 3;
	
	this.update = function (){
		if(this.lives <= 0){
			this.dead = true;
		}
		if(!this.dead){
			if(this.fly){
				this.acc = -0.3*rs;
			}
			else{
				this.acc = 0.3*rs;
			}
			this.vel += this.acc;
			this.vel = constrain(this.vel, -5*rs, 5*rs);
			this.y += this.vel;
			this.y = constrain(this.y,0,height);
			if (this.y > height - this.size){
				this.dead = true;
			}
		}
		else{
			this.acc = 0.3*rs;
			this.vel += this.acc;
			this.y += this.vel;
			this.lives = 0;
		}
	};
	this.show = function (){
		rect(this.x-this.size, this.y-this.size, 2*this.size, 2*this.size);
	};
}
function Point(x,y){
	this.x = x;
	this.startX = x;
	this.y = y-(50*rs);
	this.got = false;
	
	this.show = function(){
		push();
		fill(50,255,50,80);
		rect(this.x,this.y,50*rs,50*rs);
		pop();
	};
	this.intersect = function (player){
		if(player.x + player.size > this.x && player.y + player.size > this.y && !this.got){
			if(player.x - player.size < this.x+50*rs && player.y - player.size < this.y + 50*rs){
				player.score++;
				this.got = true;
			}
		}
	}
}
function Pipe(x){
	this.x = x;
	this.startX = x;
	this.y = height-random(height/4,3*height/4);
	this.point = new Point(this.x, this.y);
	this.speed = 2*rs;
	
	this.show = function(){
		rect(this.x,this.y,50*rs,height);
	};
	
	this.update = function (player){
		this.x -= this.speed;
		this.point.x -= this.speed;
		this.point.show();
		if(this.x + 60*rs < 0){
			this.x = this.startX;
			this.y = height-random(height/4,3*height/4);
			if(!this.point.got){
				player.lives--;
			}
			this.speed += 0.1;
			this.speed = constrain(this.speed, 2, 10);
			this.point = new Point(this.x, this.y);
		}
	};
	this.intersect = function (player){
		if(player.x + player.size > this.x && player.y + player.size > this.y){
			if(player.x < this.x+50*rs){
				player.dead = true;
			}
		}
		this.point.intersect(player);
	}
}
function Bird(){
	this.size = 15*rs;
	this.x = width + this.size;
	this.y = random(height);
	this.speed = random(5,7)*rs;
	
	this.show = function (){
		circle(this.x,this.y,this.size);
	};
	this.update = function(pipe) {
		this.x -= this.speed;
		if(this.x + this.size < 0){
			this.x = width + this.size;
			this.y = random(height);
			this.speed = random(2*rs+pipe.speed,6*rs+pipe.speed);
		}
	};
	this.intersect = function (player){
		if(player.x + player.size > this.x - this.size && player.y + player.size > this.y - this.size && player.x - player.size < this.x + this.size && this.y + this.size > player.y - player.size){
				player.dead = true;
		}
	};
}


let snow = [];
let santa;
let pipe, bird1,bird2;
let started = false;
let rs;

function setup(){
	createCanvas(windowWidth,windowWidth);
	rs = width/400;
	for(i=0; i<50; i++){
		snow.push(new Snowflake());
	}
	santa = new Player();
	pipe = new Pipe(width);
	bird1 = new Bird();
	bird2 = new Bird();
	bird2.x += width;
}
function draw(){
	background(30);
	noStroke();
	//Drawing snow in background
	snow.forEach(function(flake){
		flake.update();
		flake.show();
		if(flake.y-flake.size > height){
			flake.restart();
		}
	});
	//Actual game stuff here))
	if(started){
	santa.update();
	pipe.update(santa);
	pipe.show();
	pipe.intersect(santa);
	bird1.update(pipe);
	bird1.show();
	bird2.update(pipe);
	bird2.show();
	bird1.intersect(santa);
	bird2.intersect(santa);
	if(santa.dead){
		push();
		fill(255,0,0);
		santa.show();
		pop();
	}
	else{
		santa.show();
	}
	}
	else{
		santa.show();
	}
	l = width/8;
	push();
	textSize(24*rs);
	fill(255);
	text(santa.score, 2*width/25,2*width/25);
	pop();
	for(i = 0; i < santa.lives; i++){
		circle(i*l+ 5*l, 2*width/25, 2*width/25);
	}
}

function touchStarted(){
	started = true;
	santa.fly = true;
}
function touchEnded(){
	santa.fly = false;
}