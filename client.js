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
      var adjustedColor = '';
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


            //var size = adjustedSize;
            //var color = adjustedColor;

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
                  // var color = "#000000";

                  //switch statements for colors, pen & eraser
                  var size = adjustedSize;
                  var color = adjustedColor;

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

      // client side loading
      $(document).ready(function () {

            // arrows
            $("#smaller").click(function () { if (adjustedSize >= 5) adjustedSize -= 5; });
            $("#larger").click(function () { if (adjustedSize <= 150) adjustedSize += 5; });

            // pen and eraser init
            $("#pen").click(function () { mode = "pen"; adjustedColor = "#000000"});
            $("#eraser").click(function () { mode = "eraser"; adjustedColor = "#ffffff"});

            // colors change to adjustedColor global variable to prevent client side fuckery
            $("#red").click(function () { mode = "red"; adjustedColor = "#ff4d4d"});
            $("#green").click(function () { mode = "green"; adjustedColor = "#5cd65c"});
            $("#blue").click(function () { mode = "blue"; adjustedColor = "#ff4d4d"});
            $("#orange").click(function () { mode = "orange"; adjustedColor = "#ff6600"});
            $("#yellow").click(function () { mode = "yellow"; adjustedColor = "#ffff33"});
            $("#purple").click(function () { mode = "purple"; adjustedColor = "#9966ff"});
            $("#cyan").click(function () { mode = "cyan"; adjustedColor = "#70dbdb"});
            $("#pink").click(function () { mode = "pink"; adjustedColor = "#ff66cc"});
            $("#brown").click(function () { mode = "brown"; adjustedColor = "#ac7339"});
            $("#grey").click(function () { mode = "grey"; adjustedColor = "#a6a6a6"});
      });
});







