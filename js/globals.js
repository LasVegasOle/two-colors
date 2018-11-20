// Global variables shared btw js files

// Shapes center point
let colors = {
  A: [],
  B: []
};

// Input params

let design_params = {
  row_num: 0,
  column_num: 0,
  spacing: 0,
  droplet_size: 0,
  'update': function () {
    this.row_num = parseInt(document.getElementById("row_num").value);
    this.column_num = parseInt(document.getElementById("column_num").value);
    this.spacing = parseInt(document.getElementById("spacing").value);
    this.droplet_size = parseFloat(document.getElementById("droplet_mm").value);
  }
}

let printing_params = {
  liquid: {
    A: {
      x: 0,
      y: 0,
      z: 0,
      dip: 0,
      length: 0
    },
    B: {
      x: 0,
      y: 0,
      z: 0,
      dip: 0,
      length: 0
    }
  },
  purge: {
      x: 0,
      y: 0,
      z: 0,
      dip: 0,
      length: 0,
      cycles: 0
  },
  initial_height: 0,
  z_lift_height: 0,
  speed: 0,
  e_speed: 0,
  z_lift_speed: 0,

  'update': function () {
    this.liquid.A.x = parseFloat(document.getElementById("load_a_x").value);
    this.liquid.A.y = parseFloat(document.getElementById("load_a_y").value);
    this.liquid.A.z = parseFloat(document.getElementById("load_a_z").value);
    this.liquid.A.dip = parseFloat(document.getElementById("load_a_dip").value);

    this.liquid.B.x = parseFloat(document.getElementById("load_b_x").value);
    this.liquid.B.y = parseFloat(document.getElementById("load_b_y").value);
    this.liquid.B.z = parseFloat(document.getElementById("load_b_z").value);
    this.liquid.B.dip = parseFloat(document.getElementById("load_b_dip").value);

    this.purge.x = parseFloat(document.getElementById("purge_x").value);
    this.purge.y = parseFloat(document.getElementById("purge_y").value);
    this.purge.z = parseFloat(document.getElementById("purge_z").value);
    this.purge.dip = parseFloat(document.getElementById("purge_dip").value);
    this.purge.length = parseFloat(document.getElementById("purge_length").value);
    this.purge.cycles = parseFloat(document.getElementById("purge_cycles").value);

    this.initial_height = parseFloat(document.getElementById("initial_height").value);
    this.z_lift_height = parseFloat(document.getElementById("z_lift_height").value);
    this.speed = parseFloat(document.getElementById("speed").value);
    this.e_speed = parseFloat(document.getElementById("e_speed").value);
    this.z_lift_speed = parseFloat(document.getElementById("z_lift_speed").value);
  }
}

function init_globals(){

  // Handling events
  // Update values and drawing every time an input changes
  document.getElementById('params').addEventListener('change', eventChangeHandler);

  function eventChangeHandler(e) {

    if (e.target !== e.currentTarget) {

        var item = e.target.id;
        design_params.update();
        printing_params.update();
        two_colors_matrix();
        drawing_matrix();

      }
      e.stopPropagation();
  }

  document.getElementById('config_collapsable').addEventListener('click', eventClick);

  function eventClick(e) {

    if (e.target !== e.currentTarget) {

      if (printing.style.display === "block") {

        printing.style.display = "none";

      } else {

        printing.style.display = "block";

      }

    }

      e.stopPropagation();
  
  }  

  design_params.update();
  printing_params.update();
  two_colors_matrix();
  drawing_matrix();

}
