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
function Player(img){
	this.x = 50*rs;
	this.y = height/2;
	this.fly = false;
	this.acc = 0;
	this.vel = 0;
	this.dead = false;
	this.size = 20*rs;
	this.score = 0;
	this.lives = 3;
	this.img = img;
	
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
		//push();
		//fill(255,100);
		//rect(this.x-this.size, this.y-this.size, 4*this.size, 2*this.size);
		//pop();
		image(this.img,this.x-this.size, this.y-this.size, 4*this.size, 2*this.size);
	};
}
function Point(x,y){
	this.x = x;
	this.startX = x;
	this.y = y-(50*rs);
	this.got = false;
	
	this.show = function(){
		push();
		fill(50,255,50,50);
		rect(this.x,this.y,50*rs,50*rs);
		pop();
	};
	this.intersect = function (player){
		if(collideRectRect(this.x,this.y,50*rs,50*rs,player.x-player.size, player.y-player.size, 4*player.size, 2*player.size) && !this.got){
				player.score++;
				this.got = true;
		}
	}
}
function Pipe(x,img){
	this.x = x;
	this.startX = x;
	this.y = height-random(height/4,3*height/4);
	this.point = new Point(this.x, this.y);
	this.speed = 2*rs;
	this.img = img;
	
	this.show = function(){
		push();
		fill(255,100);
		rect(this.x,this.y+10,50*rs,height);
		pop();
		image(this.img,this.x,this.y,50*rs,150*rs);
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
		if(collideRectRect(this.x,this.y+10,50*rs,height,player.x-player.size, player.y-player.size, 4*player.size, 2*player.size)){
				player.dead = true;
		}
		this.point.intersect(player);
	}
}
function Bird(img){
	this.size = 30*rs;
	this.x = width + this.size;
	this.y = random(height);
	this.speed = random(5,7)*rs;
	this.img = img;
	this.hitted = false;
	
	this.show = function (){
		//push();
		//fill(255,100);
		//rect(this.x,this.y,this.size,this.size);
		//pop();
		image(this.img,this.x,this.y,this.size,this.size);
	};
	this.update = function(pipe) {
		this.x -= this.speed;
		if(this.x + this.size < 0){
			this.x = width + this.size;
			this.y = random(height);
			this.speed = random(2*rs+pipe.speed,6*rs+pipe.speed);
			this.hitted = false;
		}
	};
	this.intersect = function (player){
		if(collideRectRect(this.x,this.y,this.size,this.size,player.x-player.size, player.y-player.size, 4*player.size, 2*player.size)&&!this.hitted){
				player.lives--;
				this.hitted = true;
		}
	};
}


let snow = [];
let santa;
let pipe, bird1,bird2;
let started = false;
let rs;
let birdImg, pipeImg, santaImg;

function preload(){
	birdImg = loadImage("img/bird.png");
	pipeImg = loadImage("img/pipe.png");
	santaImg = loadImage("img/santa.png");
}

function setup(){
	createCanvas(windowWidth,windowWidth);
	rs = width/400;
	for(i=0; i<50; i++){
		snow.push(new Snowflake());
	}
	santa = new Player(santaImg);
	pipe = new Pipe(width,pipeImg);
	bird1 = new Bird(birdImg);
	bird2 = new Bird(birdImg);
	bird2.x += width;
}
function draw(){
	background(50);
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
		santa.show();
		push();
		textAlign(CENTER,CENTER);
		stroke(255);
		textSize(32*rs);
		text("Game Over!",width/2,(height/2)-(25*rs));
		text("Score: "+santa.score,width/2,(height/2)+(25*rs));
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
function restartGame(){
	santa = new Player(santaImg);
	pipe = new Pipe(width,pipeImg);
	bird1 = new Bird(birdImg);
	bird2 = new Bird(birdImg);
	bird2.x += width;
	started = false;
}

function touchStarted(){
	if(!started){
		started = true;
	}
	if(santa.dead && santa.y > height){
		restartGame();
	}
	santa.fly = true;
}
function touchEnded(){
	santa.fly = false;
}