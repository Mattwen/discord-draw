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

      // GLOBAL vars that change with button click controls
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

            document.getElementById("size").innerHTML = globalSize + 'px';
      };

      socket.on('draw_line', function (data) {

            // Begin path for line and initilize context      
            context.beginPath();

            // initilize the client side context variables
            var line = data.line;
            var color = data.color;
            var size = data.size;
            var adjustedSize = size;

            // set the canvas context color to context variables
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
            //console.log(mode);
            
            //set the global size and update the innerHTML every 25 ms
            globalSize = adjustedSize;
	    globalColor = adjustedColor;
            document.getElementById("size").innerHTML = globalSize + 'px';
	    document.getElementById("current-color").style.backgroundColor = globalColor;
	    // check if the user is drawing
            if (mouse.click && mouse.move && mouse.pos_prev) {
                  // Update globalSize on mouse down & move -- might be redundant
                  document.getElementById("size").innerHTML = globalSize + 'px';
                  document.getElementById("current-color").style.backgroundColor = globalColor;
		  // set the size and color to adjustedValues on every mouse event
                  var size = adjustedSize;
                  var color = adjustedColor;
		  // emit to all users
                  socket.emit('draw_line', { size: size, color: color, line: [mouse.pos, mouse.pos_prev] });
                  globalSize = size;
                  mouse.move = false;
                  // console.log(globalSize);
            }
            mouse.pos_prev = { x: mouse.pos.x, y: mouse.pos.y };
            setTimeout(mainLoop, 25);
      }
      mainLoop();

      // client side loading
      $(document).ready(function () {

            // arrows
            $("#smaller").click(function () { if (adjustedSize >= 7) adjustedSize -= 7; });
            $("#larger").click(function () { if (adjustedSize <= 150) adjustedSize += 7; });
	    
	    // Min and max buttons
	    $("#min").click(function () { adjustedSize = 1; });
            $("#max").click(function () { adjustedSize = 155; });
	    // pen and eraser
            $("#pen").click(function () { adjustedColor = "#000000"});
            $("#eraser").click(function () {adjustedColor = "#ffffff"});
	    $("#current-color").click(function () {adjustedColor});
            // colors change to adjustedColor global variable to prevent client side fuckery
            $("#red").click(function () { adjustedColor = "#ff4d4d"});
            $("#green").click(function () {adjustedColor = "#5cd65c"});
            $("#blue").click(function () {  adjustedColor = "#4295f4"});
            $("#orange").click(function () { adjustedColor = "#ff6600"});
            $("#yellow").click(function () { adjustedColor = "#ffff33"});
            $("#purple").click(function () { adjustedColor = "#9966ff"});
            $("#cyan").click(function () {  adjustedColor = "#70dbdb"});
            $("#pink").click(function () {  adjustedColor = "#ff66cc"});
            $("#brown").click(function () {  adjustedColor = "#ac7339"});
            $("#grey").click(function () {  adjustedColor = "#a6a6a6"});
      });
});







