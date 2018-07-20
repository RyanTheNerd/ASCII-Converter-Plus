document.getElementById('imageUpload').addEventListener('change', readURL, true);
function readURL() {
  var file = document.getElementById("imageUpload").files[0];
  console.log(file.type);
  var reader = new FileReader();
  reader.onloadend = function() {
    if(file.type.slice(0, 5) == "image") {
      image.src = reader.result;
    }
    else if(file.type.slice(0, 5) == "video") {
      video.src = reader.result;
    }
  }
  if (file) {
    reader.readAsDataURL(file);
  }
  else {}
}

var source;
// Character sets used to draw the ascii art, from darkest to lightest
var sets = [["$", "@", "B", "%", "8", "\u0026", "W", "M", "#", "*", "o", "a", "h",
"k", "b", "d", "p", "q", "w", "m", "Z", "O", "0", "Q", "L", "C", "J", "U", "Y",
"X", "z", "c", "v", "u", "n", "x", "r", "j", "f", "t", "/", "\\", "|", "(", ")",
"1", "{", "}", "[", "]", "?", "-", "_", "+", "~", "&lt;", "&gt;", 
"i", "!", "l", "I", ";", ":", ",", "\"", "^", "`", "'", ".", "\u00A0"], 
    ["\u2588", "\u2593", "\u2592", "\u2591", "\u00A0"]];


// Inverse sets go from lightest to darkest, used when ibmMode is true
var inverseSets = [sets[0].slice(), sets[1].slice()];
for(i in inverseSets) {
    inverseSets[i].reverse();
}


// Object containing the aspect ratio of characters and the width and height in 
// characters of the output
var ascii = {
  width: 0,   // How many characters wide the output is
  height: 0,
  charWidth: 9,
  charHeight: 16
}

// Canvas used to scale the image before converting to ascii
var canvas = document.createElement("canvas");
var ctx = canvas.getContext('2d');

element = document.createElement("div");
document.body.appendChild(element);

var image = new Image();
image.onload = function() {
  source = image;
  redraw();
}

var video = document.createElement("video");
video.onloadstart = function() {
  video.autoplay = true;
  video.loop = true;
  source = video;
}
video.addEventListener( "loadedmetadata", function (e) {
  this.width = document.getElementById("columns").value;
  this.height = (this.videoHeight/this.videoWidth)*this.width;
  playVideo();
}, false );



function pixelToChar(set, red, green, blue, isOpaque) {

  // If the pixel has an opacity of zero then the pixel is the brighest character
  if(isOpaque == 0) return set[charsInSet-1];

  block = Math.floor((red + green + blue + brightness)/charStep)-1;
  if(block > charsInSet-1) {block = charsInSet-1}
  if(block < 0) {block = 0}
  return set[block];
}

function drawToCanvas(source) {
  var aspectRatio = source.width/source.height;
  ascii.width = document.getElementById("columns").value;
  ascii.height = Math.round(ascii.width*ascii.charWidth/aspectRatio/ascii.charHeight);
  canvas.width = ascii.width;
  canvas.height = ascii.height;
  ctx.drawImage(source, 0, 0, ascii.width, ascii.height);
}

// This guy insures the ascii art is only drawn on a new frame 
// so resizing is smooth and doesn't use all the cpu
function redraw() {
    window.requestAnimationFrame(main);
}

function main() {
  drawToCanvas(source);
  var debug = true;
  // Get parameters from inputs
  fontSize = Number(document.getElementById("fontSize").value) + "px";
  brightness = Number(document.getElementById("brightness").value);

  // Contrast is a value between 0 and 1, 1 is full contrast
  //contrast = Number(document.getElementById("contrast").value);
  
  ibmMode = Number(document.getElementById("ibmMode").checked);
  setIndex = Number(!document.getElementById("fullCharset").checked);
  // 

  if(ibmMode) {
      set = inverseSets[setIndex];
      document.body.style.backgroundColor = "black";
      document.body.style.color = "#00ff00";
  }
  else {
      set = sets[setIndex];
      document.body.style.backgroundColor = "white";
      document.body.style.color = "black";
  }

  charsInSet = set.length;

  // Ratio of brightest possible value to the number of characters in the set
  // The increase in brightness required to go up a single character
  charStep = (255*3)/charsInSet;

  pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  element.style.fontSize = fontSize;
  pixelCount = 0;
  asciiArt = "";
  for(var y = 0; y < ascii.height; y++) {
    for(var x = 0; x < ascii.width*4; x += 4) {
      asciiArt += pixelToChar(set, 
        pixels[pixelCount++], 
        pixels[pixelCount++], 
        pixels[pixelCount++], 
        pixels[pixelCount++]);   
    }
    asciiArt += "\n";
  }
  element.innerHTML = `<pre>${asciiArt}</pre>`;
}

function playVideo() {
  main();
  window.requestAnimationFrame(playVideo);
}
//function threeD() {
//  if(s == 0) {
//    document.body.style.textShadow = "none";
//    return;
//  }
//  document.body.style.textShadow = `-${s}em -${s}em red, ${s}em ${s}em blue`;
//}
