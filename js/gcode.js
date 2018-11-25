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
		loading_length = design_params.droplet_size * (design_params.row_num*design_params.column_num/2) + 2;  	// Three is a super random extra loaded liquid just in case
		
		gc += "G92 E"+ Math.round(loading_length*100)/100 +"\n";
		// Retract load liquid
		gc += "G1 E0 F"+ printing_params.e_speed + "\n";
		gc += "G4 P1000 \n";

		gc += "G1 E1 F"+ printing_params.e_speed + "\n";
		gc += "G92 E0 \n";
		gc += "G4 P3000 \n";

		// Undip nozzle
		gc += "G1 Z"+ liquid.z + " F"+ printing_params.speed + "\n";	


	} else {
		// Unload liquid
		gc += "G92 E0 \n";
		loading_length = 2;//design_params.droplet_size * (design_params.row_num*design_params.column_num/2);  	// Three is a super random extra loaded liquid just in case
		// Retract load liquid
		gc += "G1 Z"+ liquid.z +  " E" + Math.round(loading_length*100)/100 + " F"+ 8*printing_params.e_speed + "\n";		
	}
	
	// Move away from bucket to avoid spills 
	gc += "G1 X0 Y0 F" + printing_params.speed + " \n";

	return gc;
}

function purge() {
	var gc = [];

	// Over purge bucket
	gc += "G1 X" + printing_params.purge.x + " Y" + printing_params.purge.y + " Z" + printing_params.purge.z + " F"+ printing_params.speed+ "\n";


	for (var i = 0; i < printing_params.purge.cycles; i++) {

		gc += "G92 E0 \n";

		// Load air
		gc += "G1 E-" + Math.round(printing_params.purge.length*100)/100 + " F"+ printing_params.e_speed + "\n";	

		//Dip
		gc += "G1 Z" + printing_params.purge.dip + " F"+ printing_params.speed+ "\n";
		// Load air
		gc += "G1 E-" + 2*Math.round(printing_params.purge.length*100)/100 + " F"+ printing_params.e_speed + "\n";	
		gc += "G1 E-" + Math.round(printing_params.purge.length*100)/100 + " F"+ printing_params.e_speed + "\n";

		//Blow air in purge
		gc += "G1 Z" + printing_params.purge.z +  " E" + Math.round(printing_params.purge.length*100)/100 + " F"+ 8*printing_params.e_speed + "\n";

	}

	// Over purge bucket
	gc += "G1 X" + printing_params.purge.x + " Y" + printing_params.purge.y + " Z" + printing_params.purge.z + " F"+ printing_params.speed+ "\n";

	// Reset extruder position
	gc += "G92 E0 \n";

	//Recover lost mm while purging
	gc += "G1 E-" + 3*Math.round(printing_params.purge.length*100)/100 + " F"+ printing_params.e_speed + "\n";

	// Reset extruder position
	gc += "G92 E0 \n";

	// Move away from bucket to avoid spills 
	gc += "G1 X0 Y0 F" + printing_params.speed + " \n";

	return gc;
}

function printing_color(color) {

	let extrusion = 0; // First droplet double side
	var gc = [];

	gc += "G92 E0 \n";

	for (var i = 0; i < color.length; i++) {
		// Got to droplet point
		gc += "G1 X"+ color[i].x + 
				" Y"+ color[i].y + 
				" F"+ printing_params.speed + "\n";

		gc += "G1 Z" + printing_params.initial_height + " F"+ printing_params.speed + "\n";

		// Extrude
		extrusion += design_params.droplet_size;

		gc += "G1 E" + Math.round(extrusion*100)/100 +" F"+ printing_params.e_speed + "\n";
		gc += "G4 P250 \n";
		
		// Z lift
		gc += "G1 Z" + printing_params.z_lift_height 
				+ " F"+ printing_params.z_lift_speed + "\n";
	}

	return gc;
}

function dragging() {

	let gc = [];

	for (var i = 0; i < colors.drag.length; i++) {

		// Go on top of first point
		gc += "G1 X" + colors.drag[i].x + " Y" + colors.drag[i].y + " Z" + printing_params.z_lift_height + " F" + printing_params.speed + " \n";

		// Lower
		gc += "G1 Z" + printing_params.initial_height + " F" + printing_params.z_lift_speed + " \n";

		// Drag
		gc += "G1 X" + colors.drag[i].xx + " Y" + colors.drag[i].yy  + " \n";

		// Raise
		gc += "G1 Z" + printing_params.z_lift_height + " F" + printing_params.z_lift_speed + " \n";

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

	gcode += purge();

	// Load #B
	gcode += "; LOADING #B \n";
	gcode += handle_liquid(printing_params.liquid.B, true);

	// Printing #B
	gcode += "; PRINTING #B \n";
	gcode += printing_color(colors.B);

	// Unloading #B
	gcode += "; UNLOADING #B \n";
	gcode += handle_liquid(printing_params.liquid.B, false);

	gcode += purge();

	if(design_params.drag_status) {
		// Dragging
		gcode += "; DRAGGING \n";
		gcode += dragging();
	}

	gcode += purge();

	// End gcode homing printer
	gcode += "G1 X0 Y0 Z100 F5000 \n";
	gcode += "G28 \n";
	gcode += "M84 \n";


	return gcode;
}


function create_file(){
  var output = get_parameters();
  output += build_gcode();
  console.log(output);
  var GCodeFile = new Blob([output], {type: 'text/plain'});
  saveAs(GCodeFile, "twocolors" + '.gcode');
}

function get_parameters(){
var params = [];
  params += "; GCode generated with Two colors dots from www.3digitalcooks.com \n";
  params += "; Number of rows [#]: " + document.getElementById("row_num").value + "\n";
  params += "; Number of columns [#]: " + document.getElementById("column_num").value + "\n";
  params += "; Spacing [mm]: " + document.getElementById("spacing").value + "\n";
  params += "; Drag enabled[x]: " + document.getElementById("drag_status").checked + "\n";

  params += "; Load #A X [mm]: " + document.getElementById("load_a_x").value + "\n";
  params += "; Load #A Y [mm]: " + document.getElementById("load_a_y").value + "\n";
  params += "; Load #A Z [mm]: " + document.getElementById("load_a_z").value + "\n";
  params += "; Load #A DIP [mm]: " + document.getElementById("load_a_dip").value + "\n";  

  params += "; Load #B X [mm]: " + document.getElementById("load_b_x").value + "\n";
  params += "; Load #B Y [mm]: " + document.getElementById("load_b_y").value + "\n";
  params += "; Load #B Z [mm]: " + document.getElementById("load_b_z").value + "\n";
  params += "; Load #B DIP [mm]: " + document.getElementById("load_b_dip").value + "\n";  

  params += "; Purge X [mm]: " + document.getElementById("purge_x").value + "\n";
  params += "; Purge Y [mm]: " + document.getElementById("purge_y").value + "\n";
  params += "; Purge Z [mm]: " + document.getElementById("purge_z").value + "\n";
  params += "; Purge DIP [mm]: " + document.getElementById("purge_dip").value + "\n"; 
  params += "; Purge length [mm]: " + document.getElementById("purge_length").value + "\n";
  params += "; Purge cycles [mm]: " + document.getElementById("purge_cycles").value + "\n";

  params += "; Initial height [mm]: " + document.getElementById("initial_height").value + "\n";
  params += "; Z lift height [mm]: " + document.getElementById("z_lift_height").value + "\n";

  params += "; Speed [mm/min]: " + document.getElementById("speed").value + "\n"; 
  params += "; Extruder speed [mm/min]: " + document.getElementById("e_speed").value + "\n"; 
  params += "; Z lift speed [mm/min]: " + document.getElementById("z_lift_speed").value + "\n"; 

return params;
}