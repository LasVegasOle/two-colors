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

function total_extrusion_length() {
	printing_params.liquid.A.length = design_params.row_num * 
									design_params.column_num *
									design_params.droplet_size;

	printing_params.liquid.A.length = design_params.row_num * 
									design_params.column_num *
									design_params.droplet_size;
}