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
      var adjustedSize = 1;
      var globalSize = 1;

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

            document.getElementById("size").innerHTML = 'Brush size: ' + globalSize + 'px';
      };

      socket.on('draw_line', function (data) {

            // Begin path for line and initilize context      
            context.beginPath();

            var line = data.line;
            var color = data.color;
            var size = data.size;
            var adjustedSize = size;


            //console.log(data);

            if (mode == 'pen') {
                  var color = '#000000';
                  var size = adjustedSize;
            }
            else if (mode == 'eraser') {
                  var color = '#ffffff';
                  var size = adjustedSize;
            }

            // Colors
            else if (mode == 'red') {
                  var color = '#ff4d4d';
                  var size = adjustedSize;
            }
            else if (mode == 'green') {
                  var color = '#5cd65c';
                  var size = adjustedSize;
            }
            else if (mode == 'blue') {
                  var color = '#66a3ff';
                  var size = adjustedSize;
            }

            else if (mode == 'orange') {
                  var color = '#ff6600';
                  var size = adjustedSize;
            }
            else if (mode == 'purple') {
                  var color = '#9966ff';
                  var size = adjustedSize;
            }
            else if (mode == 'cyan') {
                  var color = '#70dbdb';
                  var size = adjustedSize;
            }
            else if (mode == 'pink') {
                  var color = '#ff66cc';
                  var size = adjustedSize;
            }
            else if (mode == 'brown') {
                  var color = '#ac7339';
                  var size = adjustedSize;
            }
            else if (mode == 'grey') {
                  var color = '#a6a6a6';
                  var size = adjustedSize;
            }
            else if (mode == 'yellow') {
                  var color = '#ffff33';
                  var size = adjustedSize;
            }
            else {
                  var size = adjustedSize;
            }

            // set the context color to context variables
            context.lineWidth = size;
            context.fillStyle = color;
            context.strokeStyle = color;

            // round the lines
            context.lineJoin = context.lineCap = 'round';

            globalSize = size;
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

            //console.log(mode);

            //set the global size and update the innerHTML every 25 ms
            globalSize = adjustedSize;
            document.getElementById("size").innerHTML = 'Brush size: ' + globalSize + 'px';
            // check if the user is drawing
            if (mouse.click && mouse.move && mouse.pos_prev) {

                  document.getElementById("size").innerHTML = 'Brush size: ' + globalSize + 'px';
                  // send line to to the server
                  var color = "#000000";

                  //switch statements for colors, pen & eraser
                  if (mode == 'pen') {
                        var color = '#000000';
                        var size = adjustedSize;
                  }
                  else if (mode == 'eraser') {
                        var color = '#ffffff';
                        var size = adjustedSize;
                  }

                  // Colors
                  else if (mode == 'red') {
                        var color = '#ff4d4d';
                        var size = adjustedSize;
                  }
                  else if (mode == 'green') {
                        var color = '#5cd65c';
                        var size = adjustedSize;
                  }
                  else if (mode == 'blue') {
                        var color = '#66a3ff';
                        var size = adjustedSize;
                  }
                  else if (mode == 'orange') {
                        var color = '#ff6600';
                        var size = adjustedSize;
                  }
                  else if (mode == 'purple') {
                        var color = '#9966ff';
                        var size = adjustedSize;
                  }
                  else if (mode == 'cyan') {
                        var color = '#70dbdb';
                        var size = adjustedSize;
                  }
                  else if (mode == 'pink') {
                        var color = '#ff66cc';
                        var size = adjustedSize;
                  }
                  else if (mode == 'brown') {
                        var color = '#ac7339';
                        var size = adjustedSize;
                  }
                  else if (mode == 'grey') {
                        var color = '#a6a6a6';
                        var size = adjustedSize;
                  }
                  else if (mode == 'yellow') {
                  var color = '#ffff33';
                  var size = adjustedSize;
            }
                  else {
                        var size = adjustedSize;
                  }
                  
                  // emit to all users
                  socket.emit('draw_line', { size: size, color: color, line: [mouse.pos, mouse.pos_prev] });
                  globalSize = size;
                  mouse.move = false;
                  console.log(globalSize);
            }
            mouse.pos_prev = { x: mouse.pos.x, y: mouse.pos.y };
            setTimeout(mainLoop, 25);
      }
      mainLoop();

      $(document).ready(function () {
            $("#pen").click(function () { adjustedSize = 1; mode = "pen"; });
            $("#eraser").click(function () { adjustedSize = 1; mode = "eraser"; });

            // colors
            $("#red").click(function () { adjustedSize = 1; mode = "red"; });
            $("#green").click(function () { mode = "green"; });
            $("#blue").click(function () { mode = "blue"; });
            $("#orange").click(function () { mode = "orange"; });
            $("#yellow").click(function () { mode = "yellow"; });
            $("#purple").click(function () { mode = "purple"; });
            $("#cyan").click(function () { mode = "cyan"; });
            $("#pink").click(function () { mode = "pink"; });
            $("#brown").click(function () { mode = "brown"; });
            $("#grey").click(function () { mode = "grey"; });

            // arrows
            $("#smaller").click(function () {if(adjustedSize >=5 ) adjustedSize -= 5; });
            $("#larger").click(function () {if(adjustedSize <= 150) adjustedSize += 5; });




      });
});







