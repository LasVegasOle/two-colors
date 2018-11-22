var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

function draw_color_circle(colors, color) {

	let mult = 2.5;

	for (var i = 0; i < colors.length; i++) {
		//console.log("x = " + colors.A[i].x + ", y = " + colors.A[i].y );
 		draw_point(mult * colors[i].x, mult * colors[i].y, color);
	}

}

function draw_point(x, y, color) {

	ctx.beginPath();
	ctx.arc(c.width/2 + x, c.height/2 + y , 5, 0, 2 * Math.PI);
	ctx.fillStyle = color;
	ctx.fill();
	ctx.strokeStyle = color;
	ctx.stroke();

}

function draw_line(x,y,xx,yy,color) {

	let mult = 2.5;

	draw_point(mult*x, mult*y, color);
	draw_point(mult*xx, mult*yy, color);

	ctx.beginPath();

	ctx.moveTo(mult * x + c.width/2, mult * y + c.height/2 );
	ctx.lineTo(mult * xx + c.width/2, mult * yy + c.height/2);
	
	ctx.fillStyle = color;
	ctx.fill();
	ctx.lineWidth=10;
	ctx.strokeStyle = color;
	ctx.stroke();

}

function drawing_matrix() {

	ctx.clearRect(0, 0, c.width, c.height);

	//console.log("color A lenght = " + colors.A.length);

	draw_color_circle(colors.A, "blue");
	draw_color_circle(colors.B, "yellow");
	//draw_line(0, 0, 100, 100, "red");

	console.log("drag length = " + colors.drag.length);
	for(var i = 0; i < colors.drag.length; i++) {

		console.log("i = " +i);
		draw_line(colors.drag[i].x, colors.drag[i].y, colors.drag[i].xx, colors.drag[i].yy, "lightgreen");

	}

}