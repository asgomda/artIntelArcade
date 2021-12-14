var PLAY = 1;
var END = 0;
var gameState = PLAY;

var Ninja, Ninja_running, Ninja_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var reset;
var score;
var restart,restartImg;
var gameOver,gamOverImg;

let classifier;
// Label (start by showing listening)
let label = "listening";

// Teachable Machine model URL:
const soundModelURL = 'https://teachablemachine.withgoogle.com/models/-Z1bDnshO/';



function preload()
 {
  classifier = ml5.soundClassifier(soundModelURL + 'model.json');
  Ninja_running = loadAnimation("tile000.png","tile001.png","tile002.png","tile003.png","tile004.png","tile005.png","tile006.png","tile007.png","tile008.png","tile009.png");
  Ninja_collided = loadAnimation("tile001.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("1.png");
  obstacle2 = loadImage("2.png");
  obstacle3 = loadImage("3.png");
  obstacle4 = loadImage("4.png");
  obstacle5 = loadImage("5.png");
  obstacle6 = loadImage("6.png");
   
   
   
  restartImg = loadImage("restart.png");
  gameOverImg = loadImage("gameOver.png");
 }

function setup() 
 {
  
  let canv = createCanvas(600, 400);
  console.log(canv);
  
  Ninja = createSprite(50,180,90,90);
  Ninja.addAnimation("running", Ninja_running);
  Ninja.addAnimation("collided" , Ninja_collided)
  Ninja.scale = 0.5;
  
  ground = createSprite(200,370,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
   
  classifier.classify(gotResult);
  
  invisibleGround = createSprite(200,375,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
  restart = createSprite(300,350,5,5);
  restart.addImage("restart",restartImg);
  restart.visible = false;
  restart.scale = 0.5;
  
  
  Ninja.setCollider("circle",0,0,40);
  Ninja.debug = false;
  
  gameOver = createSprite(300,175,100,100);
  gameOver.addImage("gameOver",gameOverImg);
  gameOver.visible = false;

  video = createCapture(VIDEO);
  video.size(320, 240);
  
  
  score = 0;
   //Model = createP("Model has detected ");
 }

function draw() 
 {
 
   //Model.html("Model has detected " + label);
   if (score <= 500){
     background("pink");
     //displaying score
  textSize(20);
  textStyle(BOLD);
  textFont('Helvetica');
  text("Score: "+ score, 480,25);
     
   }else if (score >= 500 && score <1000){
     background('hsl(160, 100%, 50%)');
     //displaying score
  textSize(20);
  textStyle(BOLD);
  textFont('Helvetica');
  text("Score: "+ score, 480,25);
     
   }else if (score >= 1005 && score < 1500){
     background('hsl(60, 90%, 70%)');
     //displaying score
  textSize(20);
  textStyle(BOLD);
  textFont('Helvetica');
  text("Score: "+ score, 480,25);
   }else if (score >= 1505){
     background('black');
     //displaying score
  textSize(20);
  textStyle(BOLD);
  textFont('Helvetica');
  text("Score: "+ score, 480,25);
   }
  
  
  console.log("control is ",label)
  
  
  if(gameState === PLAY)
  {
    //move the ground
    ground.velocityX = -5;
    //scoring
    score = score + Math.round(frameCount/500);
    
    if (ground.x < 0)
    {
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(label == "Up"&& Ninja.y >=259) 
    {
        Ninja.velocityY = -7.5;
    }
    
    //add gravity
    Ninja.velocityY = Ninja.velocityY + 0.7;
  
    //spawn the clouds
    spawnClouds();
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(Ninja))
    {
        gameState = END;
    }
    
  
    }
  
   
   else if (gameState === END) 
    {
      ground.velocityX = 0;
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
     Ninja.changeAnimation("collided",Ninja_collided);
     obstaclesGroup.setLifetimeEach(-1);
     cloudsGroup.setLifetimeEach(-1);
     restart.visible = true;
     gameOver.visible = true;
     
     
     if(mousePressedOver(restart)) 
     {
       reset();
     }
     
   
    }
  
 
  //stop Ninja from falling down
  Ninja.collide(invisibleGround);
  
  drawSprites();
   
   
}

function spawnObstacles()
  {
 if (frameCount % 60 === 0)
  {
   var obstacle = createSprite(600,355,20,60);
   obstacle.velocityX = -7;
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
  
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
   }
   }

function spawnClouds() 
  {
  //write code here to spawn the clouds
   if (frameCount % 50 === 0) {
     cloud = createSprite(580,100,40,10);
    cloud.y = Math.round(random(60,100));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -7;
    
     //assign lifetime to the variable
    cloud.lifetime = 500;
    
    //adjust the depth
    cloud.depth = Ninja.depth;
    Ninja.depth = Ninja.depth + 1;
    
    //adding cloud to the group
   cloudsGroup.add(cloud);
   }
   }

function reset()                                                          
  {
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  Ninja.changeAnimation("running",Ninja_running);
    
  score = 0;
  }
function gotResult(error, results) {
  if (error) {
    console.error(error);
    return;
  }
  // The results are in an array ordered by confidence.
  // console.log(results[0]);
  label = results[0].label;
}