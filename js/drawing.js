var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

function draw_color_circle(colors, color) {

	let mult= 2.5;

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
	ctx.strokeStyle=color;
	ctx.stroke();
}

function drawing_matrix() {

	ctx.clearRect(0, 0, c.width, c.height);

	//console.log("color A lenght = " + colors.A.length);

	draw_color_circle(colors.A, "blue");
	draw_color_circle(colors.B, "yellow");


}