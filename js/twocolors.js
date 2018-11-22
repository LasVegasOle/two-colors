init_globals();


// This calculates all the points for colors A and B
function two_colors_matrix() {
	// reset matrices before calculations
	colors.A = [];
	colors.B = [];

	// -1 to avoid measuring last point spacing to non existing "next"
	let delta_x = (design_params.row_num - 1) * design_params.spacing;
	let delta_y = (design_params.column_num - 1) * design_params.spacing;

	//console.log("delta X = " + delta_x + ", delta Y = " + delta_y);

	let p = {x: -delta_x/2, y: -delta_y/2};

	//console.log("initial point x = " + p.x + ", y = " + p.y);

	let change_color = true;
	for(let i = 0; i < design_params.row_num; i++) {

		for(let j = 0; j < design_params.column_num; j++) {
			//console.log( "row = " + i + ", column =" + j + "Point x = " + p.x + ", y = " + p.y);

			// Safe one point to A next to B
			if (change_color) {
				colors.A.push({x: p.x, y: p.y});
				change_color = false;
			} else {
				colors.B.push({x: p.x, y: p.y});				
				change_color = true;
			}

			p.y += design_params.spacing; 

		}
		p.y = -delta_y/2;
		p.x += design_params.spacing;

	}

}

function random_drag() {
	colors.drag = [];

	let drag_num = Math.floor(Math.random() * (design_params.row_num + design_params.column_num - 1)) ;
	
	//console.log("Colors length = " +colors.A.length + ", Drag num = " + drag_num);
	
	let xmin = colors.A[0].x;
	let xmax = colors.A[0].x + design_params.spacing * (design_params.row_num-1);
	let ymin = colors.A[0].y; 
	let ymax = colors.A[0].y + design_params.spacing * (design_params.column_num-1); 

	//console.log("xmin = " + xmin + "xmax = " + xmax + "ymin = " + ymin + "ymax = " + ymax)

	// Add rando drags
	for (var i = 0; i < drag_num; i ++) {

		let drop_to_drag = Math.floor(Math.random() * ((design_params.row_num * design_params.column_num)/2 - 1));
		//console.log("drop_to_drag = " + drop_to_drag);
		// get neighbors

		let direction_to_drag = Math.floor(Math.random() * 4); // 4 = direction, up, dwon, right and left
		
		let xx, yy;


		if (direction_to_drag == 1) { // up

			xx = colors.A[drop_to_drag].x;
			yy = colors.A[drop_to_drag].y - design_params.spacing;
			if (yy < ymin) {
				direction_to_drag++;
				yy = colors.A[drop_to_drag].y;
			}

		} else if (direction_to_drag == 2) { // down

			xx = colors.A[drop_to_drag].x;
			yy = colors.A[drop_to_drag].y + design_params.spacing;
			if (yy > ymax) {
				direction_to_drag++;
				yy = colors.A[drop_to_drag].y;
			}

		} else if (direction_to_drag == 3) { // left

			xx = colors.A[drop_to_drag].x - design_params.spacing;
			yy = colors.A[drop_to_drag].y;

			if (xx < xmin) {
				direction_to_drag++;
				xx = colors.A[drop_to_drag].x;
			}


		} else { // right

			xx = colors.A[drop_to_drag].x + design_params.spacing;
			yy = colors.A[drop_to_drag].y;

			if (xx > xmax) {
				xx = colors.A[drop_to_drag].x - design_params.spacing;
			}

		}

		colors.drag.push({x: colors.A[drop_to_drag].x, y: colors.A[drop_to_drag].y, xx: xx, yy: yy});
		// Add drag to colors, x/y to xx/yy

	}

}

function total_extrusion_length() {
	printing_params.liquid.A.length = design_params.row_num * 
									design_params.column_num *
									design_params.droplet_size;

	printing_params.liquid.A.length = design_params.row_num * 
									design_params.column_num *
									design_params.droplet_size;
}