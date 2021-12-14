//flappy bird-like
//mouse click or x to flap



// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
Sound classification using SpeechCommands18w and p5.js
This example uses a callback pattern to create the classifier
=== */

// Initialize a sound classifier method with SpeechCommands18w model. A callback needs to be passed.
// Classifier Variable
let classifier;
// Model URL
let imageModelURL = 'https://teachablemachine.withgoogle.com/models/9iTmtF5_x/';

// Video
let video;
let flippedVideo;
// To store the classification
let label = "";
let div;

let score = 0;

function preload() {
  // Load teachable sound classifier model
  classifier = ml5.imageClassifier(imageModelURL + 'model.json');
  console.log("loaded!")
}

var GRAVITY = 0.25;
var FLAP = -3;
var GROUND_Y = 600;
var MIN_OPENING = 300;
var bird, ground;
var pipes;
var gameOver;
var birdImg, pipeImg, groundImg, bgImg;


function setup() {
  createCanvas(700, 600);
  
  
  
  birdImg = loadImage('assets/flappy_bird.png');
  pipeImg = loadImage('assets/flappy_pipe.png');
  groundImg = loadImage('assets/flappy_ground.png');
  bgImg = loadImage('assets/flappy_bg.png');

  bird = createSprite(width/2, height/2, 40, 40);
  bird.rotateToDirection = true;
  bird.velocity.x = 4;
  bird.setCollider('circle', 0, 0, 20);
  bird.addImage(birdImg);

  ground = createSprite(800/2, GROUND_Y+100); //image 800x200
  ground.addImage(groundImg);

  pipes = new Group();
  gameOver = true;
  updateSprites(false);

  camera.position.y = height/2;
  
  video = createCapture(VIDEO);
  video.size(320, 240);
  //video.hide();

  flippedVideo = ml5.flipImage(video)
  // Start classifying
  //flippedVideo = ml5.flipImage(video)
  // Start classifying
  classifyVideo();
  
  //noCanvas();
  // Classify the sound from microphone in real time
  // classifier.classify(gotResult);
  image(flippedVideo, 800, 700);
  console.log("got res")
  div = createDiv("score: ")
  div.style('font-size', '30px');
  div.style('color', '#21130d')
  
  
}


// Get a prediction for the current video frame
function classifyVideo() {
  flippedVideo = ml5.flipImage(video)
  classifier.classify(flippedVideo, gotResult);
}


function draw() {
  //console.log(bird.position.y)
  
  
  if(gameOver && keyWentDown('x'))
    newGame();

  if(!gameOver) {

    if(keyWentDown('x'))
      bird.velocity.y = FLAP;

    bird.velocity.y += GRAVITY;

    if(bird.position.y<0)
      bird.position.y = 0;

    if(bird.position.y+bird.height/2 > GROUND_Y){
      frameRate(0);
      die();
      console.log("the bird is dead")
    }

    if(bird.overlap(pipes)){
      frameRate(0);
      die();
      
    }

    //spawn pipes
    if(frameCount%30 == 0) {
      var pipeH = random(50, 300);
      var pipe = createSprite(bird.position.x + width, GROUND_Y-pipeH/2+1+100, 80, pipeH);
      pipe.addImage(pipeImg);
      console.log("pipe created!")
      pipes.add(pipe);

      //top pipe
      if(pipeH<200) {
        pipeH = height - (height-GROUND_Y)-(pipeH+MIN_OPENING);
        pipe = createSprite(bird.position.x + width, pipeH/2-100, 80, pipeH);
        pipe.mirrorY(-1);
        pipe.addImage(pipeImg);
        pipes.add(pipe);
      }
    }

    //get rid of passed pipes
    for(var i = 0; i<pipes.length; i++)
      if(pipes[i].position.x < bird.position.x-width/2){
        pipes[i].remove();
        score++;
      }
    
        
  }

  camera.position.x = bird.position.x + width/4;

  //wrap ground
  if(camera.position.x > ground.position.x-ground.width+width/2)
    ground.position.x+=ground.width;

  background(247, 134, 131);
  camera.off();
  image(bgImg, 0, GROUND_Y-190);
  camera.on();
  
  // Draw the label
  // fill(255);
  // textSize(20);
  // textAlign(CENTER);
  // text("score: ", 400, 400);
  // text(score, 400, 400);
  
  drawSprites(pipes);
  drawSprite(ground);
  drawSprite(bird);
  
  // Draw the label
  // fill(255);
  // textSize(16);
  // textAlign(CENTER);
  // text(label, 400, 400);
  
  // Draw the score
  let sc = "score: " + str(score);
  div.html(sc) 
 // div.style('font-size', '16px');
  //div.position(width-50, height-50);
}

function die() {
  updateSprites(false);
  gameOver = true;
  score = 0;
  gameOver1.visible = true;
  div.html("GAME OVER!!!")
}

function newGame() {
  frameRate(60);
  pipes.removeSprites();
  gameOver = false;
  updateSprites(true);
  bird.position.x = width/2;
  bird.position.y = height/2;
  bird.velocity.y = 0;
  ground.position.x = 800/2;
  ground.position.y = GROUND_Y;
  gameOver1.visible = false;
  
}


// A function to run when we get any errors and the results
function gotResult(error, results) {
  // Display error in the console
  if (error) {
    console.error(error);
  }
  // The results are in an array ordered by confidence.
  // console.log("these are the results: ", results[0].label)
  // if (results[0].label==="up"){
  //   bird.velocity.y = FLAP;
  //   results[0].label = "nada!";
  // }
   label = results[0].label;
  if(label==="UP"){
    bird.velocity.y = FLAP;
  }
  console.log(label)
  // Classifiy again!
  label = results[0].label;
  //createDiv(label)
  //div.text = label;
  classifyVideo();
  
  bird.velocity.y += GRAVITY;
  // Show the first label and confidence
  //createDiv('this says yes');
  //div.html(label, true)
}

function mousePressed() {
  if(gameOver)
    newGame();
  bird.velocity.y = FLAP;
}
