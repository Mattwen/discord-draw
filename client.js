document.addEventListener("DOMContentLoaded", function () {
      var mouse = {
            click: false,
            move: false,
            pos: { x: 0, y: 0 },
            pos_prev: false
      };
      // get canvas element and create context
      var canvas = document.getElementById('drawing');
      var context = canvas.getContext('2d');
      var width = window.innerWidth;
      var height = window.innerHeight;
      var socket = io.connect();
      var mode = '';
      // set canvas to full browser width/height
      canvas.width = width;
      canvas.height = height;

      // register mouse event handlers
      canvas.onmousedown = function (e) { mouse.click = true; };
      canvas.onmouseup = function (e) { mouse.click = false; };

      canvas.onmousemove = function (e) {
            // normalize mouse position to range 0.0 - 1.0
            mouse.pos.x = e.clientX / width;
            mouse.pos.y = e.clientY / height;
            mouse.move = true;


      };

      socket.on('draw_line', function (data) {

            //var mode = option[Math.floor(Math.random() * option.length)];            
            context.beginPath();
            var line = data.line;
            var color = data.color;
            var size = data.size;

            console.log(data);

            if (mode == 'pen') {
                  var color = '#000000'
                  var size = 1;
            }
            if (mode == 'eraser') {
                  var color = '#ffffff'
                  var size = 25;
            }

            context.lineWidth = size;
            

            context.fillStyle = color;
            context.strokeStyle = color;


            context.lineJoin = context.lineCap = 'round';
            context.moveTo(line[0].x * width, line[0].y * height);
            context.lineTo(line[1].x * width, line[1].y * height);

            
            context.stroke();
            context.closePath();

      });


      // main loop, running every 25ms
      function mainLoop() {

            $("#pen").click(function () { mode = "pen"; });
            $("#eraser").click(function () { mode = "eraser"; });
            // check if the user is drawing
            if (mouse.click && mouse.move && mouse.pos_prev) {
                  // send line to to the server
                  var color = "#000000";
                  var size = 1;

                  if (mode == 'pen') {
                        color = '#000000';
                        size = 1;
                  }
                  if (mode == 'eraser') {
                        color = '#ffffff';
                        size = 25;
                  }
                  socket.emit('draw_line', {size: size, color: color, line: [mouse.pos, mouse.pos_prev]});
                  mouse.move = false;
            }
            mouse.pos_prev = { x: mouse.pos.x, y: mouse.pos.y };
            setTimeout(mainLoop, 25);
      }
      mainLoop();
});




