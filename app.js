document.querySelector('#connect').addEventListener('click', event => {
  document.querySelector('#state').classList.add('connecting');
  playbulb.connect()
  .then(() => {
    console.log(playbulb.device);
    document.querySelector('#state').classList.remove('connecting');
    document.querySelector('#state').classList.add('connected');
    return playbulb.getDeviceName().then(handleDeviceName)
  })
  .catch(error => {
    console.error('Argh!', error);
  });
});

function handleDeviceName(deviceName) {
  document.querySelector('#deviceName').value = deviceName;
}


function changeColor() {
  var effect = document.querySelector('[name="effectSwitch"]:checked').id;
  switch(effect) {
    case 'noEffect':
      playbulb.setColor(r, g, b).then(onColorChanged);
      break;
  }
}

document.querySelector('#deviceName').addEventListener('input', event => {
  playbulb.setDeviceName(event.target.value)
  .then(() => {
    console.log('Device name changed to ' + event.target.value);
  })
  .catch(error => {
    console.error('Argh!', error);
  });
});

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
    context.arc(x, y + 2, 10 * devicePixelRatio, 0, 2 * Math.PI, false);
    context.shadowColor = '#333';
    context.shadowBlur = 4 * devicePixelRatio;
    context.fillStyle = 'white';
    context.fill();
  });

  context.drawImage(img, 0, 0, canvas.width, canvas.height);
}

document.querySelector('#noEffect').addEventListener('click', changeColor);
