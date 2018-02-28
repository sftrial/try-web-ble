document.querySelector('#connect').addEventListener('click', event => {
  document.querySelector('#state').classList.add('connecting');
  playbulb.connect()
  .then(() => {
    console.log(playbulb.device);
    document.querySelector('#state').classList.remove('connecting');
    document.querySelector('#state').classList.add('connected');
  })
  .catch(error => {
    console.error('Argh!', error);
  });
});


function changeColor() {
  var effect = document.querySelector('[name="lightSwitch"]:checked').id;
  switch(effect) {
    case 'Light0':
      playbulb.setColor(0x00, r, g, b).then(onColorChanged);
      break;
    case 'Light1':
      playbulb.setColor(0x01, r, g, b).then(onColorChanged);
      break;
    case 'Light2':
      playbulb.setColor(0x02, r, g, b).then(onColorChanged);
      break;
    case 'Light3':
      playbulb.setColor(0x03, r, g, b).then(onColorChanged);
      break;
    case 'Light4':
      playbulb.setColor(0x04, r, g, b).then(onColorChanged);
      break;
    case 'Light5':
      playbulb.setColor(0x05, r, g, b).then(onColorChanged);
      break;
    case 'Group1':
      playbulb.setColor(0x0b, r, g, b).then(onColorChanged);
      break;
    case 'Group2':
      playbulb.setColor(0x0c, r, g, b).then(onColorChanged);
      break;
    case 'All':
      playbulb.setColor(0x0a, r, g, b).then(onColorChanged);
      break;
  }
}

var r = g = b = 255;

function onColorChanged(rgb) {
  if (rgb) {
    console.log('Color changed to ' + rgb);
    r = rgb[0]; g = rgb[1]; b = rgb[2];
  } else {
    console.log('Color changed');
  }
}

var img = new Image();
img.src = 'color-wheel.png';
img.onload = function() {
  var canvas = document.querySelector('canvas');
  var context = canvas.getContext('2d');

  canvas.width = 300 * devicePixelRatio;
  canvas.height = 300 * devicePixelRatio;
  canvas.style.width = "300px";
  canvas.style.height = "300px";
  canvas.addEventListener('click', function(evt) {
    // Refresh canvas in case user zooms and devicePixelRatio changes.
    canvas.width = 300 * devicePixelRatio;
    canvas.height = 300 * devicePixelRatio;
    context.drawImage(img, 0, 0, canvas.width, canvas.height);

    var rect = canvas.getBoundingClientRect();
    var x = Math.round((evt.clientX - rect.left) * devicePixelRatio);
    var y = Math.round((evt.clientY - rect.top) * devicePixelRatio);
    var data = context.getImageData(0, 0, canvas.width, canvas.height).data;

    r = data[((canvas.width * y) + x) * 4];
    g = data[((canvas.width * y) + x) * 4 + 1];
    b = data[((canvas.width * y) + x) * 4 + 2];

    changeColor();

    context.beginPath();
    //context.arc(x, y + 2, 10 * devicePixelRatio, 0, 2 * Math.PI, false);
    context.arc(x, y + 2, 5 * devicePixelRatio, 0, 2 * Math.PI, false);
    //context.shadowColor = '#333';
    //context.shadowBlur = 4 * devicePixelRatio;
    context.lineWidth = 0.5;
    context.fillStyle = 'white';
    context.fill();
  });

  context.drawImage(img, 0, 0, canvas.width, canvas.height);
}

/*
document.querySelector('#All').addEventListener('click', changeColor);
document.querySelector('#Group1').addEventListener('click', changeColor);
document.querySelector('#Group2').addEventListener('click', changeColor);
document.querySelector('#Light0').addEventListener('click', changeColor);
document.querySelector('#Light1').addEventListener('click', changeColor);
document.querySelector('#Light2').addEventListener('click', changeColor);
document.querySelector('#Light3').addEventListener('click', changeColor);
document.querySelector('#Light4').addEventListener('click', changeColor);
document.querySelector('#Light5').addEventListener('click', changeColor);
*/
