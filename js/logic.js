// Here is were position data from vision is chopped into values that
// form the shape to be printed

// Take center points of shapes from vision.js
// Calculate the shortest path between shapes and decide closed neighbor 
// for each shape

// Cuerdas, only creates a connection between shapes, to its closest neighbor
// Smae neighbor pairing can not be repeated

// After pairs of neighbors are made strings are created between them based on 
// parameters
// This can be done directly into a GCODE string

function closest_neighbor() {
	// Calculate neighbor for each shape
	shapes.forEach(function (item, index, arr) {
	//console.log(item);
	
		var distances = []; // between on point an the rest

		// calculating distances
		for (var i = 0; i < shapes.length ; i++) {
			let delta_x = item.x - shapes[i].x;
			let delta_y = item.y - shapes[i].y;

			//console.log("delta_x = item.x - shapes[i+1].x = " +  item.x + " - " + shapes[i+1].x + " = " + delta_x);
			//console.log("delta_y = item.y - shapes[i+1].y = " +  item.y + " - " + shapes[i+1].y + " = " + delta_y);

			distances[i] = Math.sqrt( delta_x*delta_x + delta_y*delta_y);

			//var next_shape_idx = i+1;
			//console.log("distance ["+ index +" to "+ next_shape_idx + "] = " + distances[i]);
		}

		// Look for smallest distance and assign it as neighbor
		shapes[index].neighbor = index_of_min(distances, 0);
	});
}

// Searches for the minimum value position

function index_of_min(arr) {
    if (arr.length === 0) {
        return -1;
    }

    let min = 0;

    //console.log(arr);
    
    // Set initial min value different from zero
    if (arr[0] != 0) {
    	min = arr[0];
    } else {
    	min = arr[1];
    }

    var min_idx = 0;

    for (var i = 0; i < arr.length; i++) {
        if (arr[i] <= min && arr[i] != 0) {
            min_idx = i;
            min = arr[i];
        }
        //console.log("i = "+ i + "; min_idx = " + min_idx + "; arr[i] = " + arr[i]);
    }
    //console.log("min_idx = " + min_idx);
    return min_idx;
}

function shapes_to_strings(argument) {
	// clear lines array
	strings.length = 0;
	shapes.forEach(function(item, index){

		var add_new_string = true;

			// Let's make sure we dont have already this string
			for (var i = 0; i < strings.length; i++) {
				// console.log(" shapes x =" + shapes[index].x + "; shapes y =" + shapes[index].y);
				// console.log( "strings x1 = " + strings[i].x1 + "; y1 = " + strings[i].y1 + "; x2 = " + strings[i].x2 +"; y2 = " + strings[i].y2);
				// is shape point equat to any of string?
				if ((item.x === strings[i].x1 && item.y === strings[i].y1) || (item.x === strings[i].x2 && item.y === strings[i].y2)) {
					// console.log("EQUAL! P1");
					// is shape neighbor equal to the other string point? this means duplicated line, dont add it!
					if ((shapes[item.neighbor].x == strings[i].x1 && shapes[item.neighbor].y == strings[i].y1) || 
						(shapes[item.neighbor].x == strings[i].x2 && shapes[item.neighbor].y == strings[i].y2)) {
						add_new_string = false;
					}
				}			
			}

		if (add_new_string) {
			strings.push({x1: item.x,y1: item.y,x2: shapes[item.neighbor].x,y2: shapes[item.neighbor].y});
		} 

	});
}

function tangential_point(x1, y1, x2, y2, node_numerator, node_denumerator, tangential_point_lenght) {
	let delta_x = x1-x2;
	let delta_y = y1-y2;
	//console.log("delta_x = " + delta_x + "; delta_y = " + delta_y);
	let l = Math.sqrt(delta_x*delta_x + delta_y*delta_y);
	//console.log("l = " + l);
	let cosX = delta_x / l;
	let sinX = delta_y / l;

	//console.log("sinX = " + sinX + "cosX = " + cosX);

	let l_t = l * node_numerator / node_denumerator;
	//console.log("l_t = " + l_t);

	let x_t = x1 - cosX * l_t;
	let y_t = y1 - sinX * l_t;
	//console.log("x_t = " + x_t + "; y_t = " + y_t);

	let x_p = x_t + tangential_point_lenght*sinX;
	let y_p = y_t - tangential_point_lenght*cosX;

	return {x: x_p, y: y_p};
}

// Perpendicular line to a point
// https://www.mathopenref.com/coordperpendicular.html
// Unsing vectors to find a point along a line
// https://math.stackexchange.com/questions/175896/finding-a-point-along-a-line-a-certain-distance-away-from-another-point