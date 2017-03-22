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

            // Begin path for line and initilize context      
            context.beginPath();
            var line = data.line;
            var color = data.color;
            var size = data.size;

            //console.log(data);

            if (mode == 'pen') {
                  var color = '#000000';
                  var size = 1;
            }
            else if (mode == 'eraser') {
                  var color = '#ffffff';
                  var size = 25;
            }

            // Colors
            else if (mode == 'red') {
                  var color = '#ff4d4d';
            }
            else if (mode == 'green') {
                  var color = '#5cd65c';
            }
            else if (mode == 'blue') {
                  var color = '#66a3ff';
            }

            else if (mode == 'orange') {
                  var color = '#ff9933';
            }
            else if (mode == 'purple') {
                  var color = '#9966ff';
            }
            else if (mode == 'cyan') {
                  var color = '#70dbdb';
            }

            // set the context color to context variables
            context.lineWidth = size;
            context.fillStyle = color;
            context.strokeStyle = color;

            // round the lines
            context.lineJoin = context.lineCap = 'round';

            // draw the line at the mouse curser points
            context.moveTo(line[0].x * width, line[0].y * height);
            context.lineTo(line[1].x * width, line[1].y * height);

            // draw and close
            context.stroke();
            context.closePath();

      });


      // main loop, running every 25ms
      function mainLoop() {

            // pen and eraser

            console.log(mode);

            // check if the user is drawing
            if (mouse.click && mouse.move && mouse.pos_prev) {
                  // send line to to the server
                  var color = "#000000";
                  var size = 1;
                  //switch statements for colors, pen & eraser
                  if (mode == 'pen') {
                        var color = '#000000';
                        var size = 1;
                  }
                  else if (mode == 'eraser') {
                        var color = '#ffffff';
                        var size = 25;
                  }

                  // Colors
                  else if (mode == 'red') {
                        var color = '#ff4d4d';
                  }
                  else if (mode == 'green') {
                        var color = '#5cd65c';
                  }
                  else if (mode == 'blue') {
                        var color = '#66a3ff';
                  }
                  else if (mode == 'orange') {
                        var color = '#ff9933';
                  }
                  else if (mode == 'purple') {
                        var color = '#9966ff';
                  }
                  else if (mode == 'cyan') {
                        var color = '#70dbdb';
                  }
                  socket.emit('draw_line', { size: size, color: color, line: [mouse.pos, mouse.pos_prev] });
                  mouse.move = false;
            }
            mouse.pos_prev = { x: mouse.pos.x, y: mouse.pos.y };
            setTimeout(mainLoop, 25);
      }
      mainLoop();

      $(document).ready(function () {
            $("#pen").click(function () { mode = "pen"; });
            $("#eraser").click(function () { mode = "eraser"; });

            // colors
            $("#red").click(function () { mode = "red"; });
            $("#green").click(function () { mode = "green"; });
            $("#blue").click(function () { mode = "blue"; });
            $("#orange").click(function () { mode = "orange"; });
            $("#purple").click(function () { mode = "purple"; });
            $("#cyan").click(function () { mode = "cyan"; });
      });
});






