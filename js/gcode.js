// This file creates and safes into a file our GCODE

function handle_liquid(liquid, load) {
	var gc = [];
	let loading_length = 0;

	// Move over liquid reservoir
	gc += "G1 X"+ liquid.x + " Y"+ liquid.y + " Z"+ liquid.z + " F"+ printing_params.speed+ "\n";

	// Dip nozzle
	gc += "G1 Z"+ liquid.dip + " F"+ printing_params.speed + "\n";	


	if(load) {
		// Load liquid
		loading_length = liquid.length + 3;  	// Three is a super random extra loaded liquid just in case
		gc += "G92 E"+ Math.round(loading_length*100)/100 +"\n";
		// Retract load liquid
		gc += "G1 E0 F"+ printing_params.e_speed + "\n";	
	} else {
		// Unload liquid
		gc += "G92 E0 \n";
		loading_length = 5;  	// Three is a super random extra loaded liquid just in case
		// Retract load liquid
		gc += "G1 E" + Math.round(loading_length*100)/100 + " F"+ printing_params.e_speed + "\n";		
	}
	

	// Undip nozzle
	gc += "G1 Z"+ liquid.z + " F"+ printing_params.speed + "\n";	

	return gc;
}

function printing_color(color) {

	let extrusion = 0;
	var gc = [];

	gc += "G92 E0 \n";

	for (var i = 0; i < color.length; i++) {
		// Got to droplet point
		gc += "G1 X"+ color[i].x + 
		" Y"+ color[i].y + 
		" Z"+ printing_params.initial_height + 
		" F"+ printing_params.speed+ "\n";

		// Extrude
		extrusion += design_params.droplet_size;

		gc += "G1 E" + Math.round(extrusion*100)/100 +" F"+ printing_params.e_speed + "\n";
		
		// Z lift
		gc += "G1 Z" + printing_params.z_lift_height 
				+ " F"+ printing_params.z_lift_speed + "\n";
	}

	return gc;
}

function build_gcode(){

	two_colors_matrix();
	total_extrusion_length();

	var gcode = [];

	// Homing
	gcode += "G28 \n";

	// Loading #A
	gcode += "; LOADING #A \n";
	gcode += handle_liquid(printing_params.liquid.A, true);

	// Printing #A
	gcode += "; PRINTING #A \n";
	gcode += printing_color(colors.A);

	// Unload #A
	gcode += "; UNLOADING #A \n";
	gcode += handle_liquid(printing_params.liquid.A, false);

	// Load #B
	gcode += "; LOADING #B \n";
	gcode += handle_liquid(printing_params.liquid.B, true);

	// Printing #B
	gcode += "; PRINTING #B \n";
	gcode += printing_color(colors.B);

	// Unloading #B
	gcode += "; UNLOADING #B \n";
	gcode += handle_liquid(printing_params.liquid.B, false);



	// End gcode homing printer
	gcode += "G28 \n";
	
	return gcode;
}


function create_file(){
  var output = get_parameters();
  output += build_gcode();
  //console.log(output);
  var GCodeFile = new Blob([output], {type: 'text/plain'});
  saveAs(GCodeFile, "twocolors" + '.gcode');
}

function get_parameters(){
var params = [];
  params += "; GCode generated with Two colors dots from www.3digitalcooks.com \n";
  params += "; Number of rows [#]: " + document.getElementById("row_num").value + "\n";
  params += "; Number of columns [#]: " + document.getElementById("column_num").value + "\n";
  params += "; Spacing [mm]: " + document.getElementById("spacing").value + "\n";

  params += "; Load #A X [mm]: " + document.getElementById("load_a_x").value + "\n";
  params += "; Load #A Y [mm]: " + document.getElementById("load_a_y").value + "\n";
  params += "; Load #A Z [mm]: " + document.getElementById("load_a_z").value + "\n";
  params += "; Load #A DIP [mm]: " + document.getElementById("load_a_dip").value + "\n";  

  params += "; Load #B X [mm]: " + document.getElementById("load_b_x").value + "\n";
  params += "; Load #B Y [mm]: " + document.getElementById("load_b_y").value + "\n";
  params += "; Load #B Z [mm]: " + document.getElementById("load_b_z").value + "\n";
  params += "; Load #B DIP [mm]: " + document.getElementById("load_b_dip").value + "\n";  

  params += "; Initial height [mm]: " + document.getElementById("initial_height").value + "\n";
  params += "; Z lift height [mm]: " + document.getElementById("z_lift_height").value + "\n";

  params += "; Speed [mm/min]: " + document.getElementById("speed").value + "\n"; 
  params += "; Extruder speed [mm/min]: " + document.getElementById("e_speed").value + "\n"; 
  params += "; Z lift speed [mm/min]: " + document.getElementById("z_lift_speed").value + "\n"; 

return params;
}