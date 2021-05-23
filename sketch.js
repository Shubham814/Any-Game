var PLAY = 1;
var END = 0;
var gameState = PLAY;

var mario, mario_running, mario_collided;
var ground, invisibleGround, groundImage;

var coinGroup, coinImage;
var obstaclesGroup, obstacle2, obstacle1,obstacle3;
var score=0;
var lifevar=5;


var gameOver, restart;

var highscore = 0;

function preload(){
  mario_running = loadAnimation("Capture1.png","Capture3.png","Capture4.png");
  mario_collided = loadAnimation("mariodead.png");
  groundImage = loadImage("backg.jpg");
  
  coinImage = loadImage("coin.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle3 = loadImage("obstacle3.png");
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");

  bg = loadImage("backg.jpg");
  
  coinSound = loadSound("coin.wav");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  mario = createSprite(100,height-100,20,50);
  mario.addAnimation("running", mario_running);
  mario.scale = 1;
  
  ground = createSprite(0,height-100,width,10);
  ground.x = ground.width /2;
  ground.visible = false;
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(width/2,height/2-50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  coinGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  background(bg);
  textSize(20);
  fill(255);
  text("Score: "+ score, width-100,height-height+100);
  text("Life: "+lifevar,width-100,height-height+50);
  text("High Score: "+ highscore,20,40);
  //  text(mouseX + " : " + mouseY,20,20);
//text("life: "+ life , 500,60);
  
  
  
  drawSprites();
  if (gameState===PLAY){
   //score = score + Math.round(getFrameRate()/60);
    if(score >= 0){
      ground.velocityX = -6;
    }else{
      ground.velocityX = -(6 + 3*score/100);
    }
    
    if (mario.isTouching(coinGroup)){
      score = score+1;
      coinGroup[0].destroy();
      coinSound.play();
    }
  
    if((touches.length > 0 || keyDown("space") || keyDown(UP_ARROW)) && mario.y >= height-250) {
      mario.velocityY = -18;
      touches = [];
    }
  
    mario.velocityY = mario.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    mario.collide(ground);
    
    spawnCoin();
    spawnObstacles();
  
        
    if(obstaclesGroup.isTouching(mario)){
      //make life decrease
       lifevar = lifevar-1; 
       if(highscore<score){
        highscore = score;
      } 
       gameState = END;
        
    } 
  }
  
  else if (gameState === END ) {
    gameOver.visible = true;
    restart.visible = true;
    mario.addAnimation("collided", mario_collided);
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    mario.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    coinGroup.setVelocityXEach(0);
    
    //change the trex animation
    mario.changeAnimation("collided",mario_collided);
    mario.scale =0.65;
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    coinGroup.setLifetimeEach(-1);
    
    

    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
}

function spawnCoin() {
  //write code here to spawn the clouds
  if (frameCount % 40 === 0) {
    var coin = createSprite(width,height-400,40,10);
    coin.y = Math.round(random(height-400,height-200));
    coin.addImage(coinImage);
    coin.scale = 0.2;
    coin.velocityX = -(8 + 3*score/100);
    
     //assign lifetime to the variable
    coin.lifetime = 250;
    
    //adjust the depth
    coin.depth = mario.depth;
    mario.depth = mario.depth + 1;
    
    //add each cloud to the group
    coinGroup.add(coin);
  }
  
  coinGroup.depth = gameOver.depth;
  gameOver.depth = gameOver.depth+1;
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(width,height-140,10,40);    
    //generate random obstacles
    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: obstacle.addImage(obstacle2);
              break;
      case 2: obstacle.addImage(obstacle1);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
    }
        
    obstacle.velocityX = -(8 + 3*score/100);
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.3;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  coinGroup.destroyEach();
  
  mario.changeAnimation("running",mario_running);
  mario.scale =1;
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  
  score = 0;
  
}