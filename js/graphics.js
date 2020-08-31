
	function colour(elem) {
		var handle, i;
		for (i=0; i<4; i++) {
			handle = document.getElementById(elem[i]);
			if (handle!=null) handle.style.background = "red";
		}
	}

	function startAnimationConsistent() {
		// TODO
	}

	function startAnimation(id) {
	  	
	  	row = getRow(parseInt(this.id));
	  	col = getCol(parseInt(this.id));
	  	console.log(this.id + " -- row: " + row + " col: " + col);

	  	var i;
	  	var queue = [];

	  	for (i=1; i<9; i++) {
	  		queue.push(parseRow(row, i, col).concat(parseCol(col, i, row)));
	  		setTimeout(colour, 200*i, (queue.shift()));
	  	}

	}

	function startAnimationIntegrityError(id, target) {
		console.log("called");
		$("#"+id).addClass("inconsistent");
		$("#"+target).addClass("inconsistent");

		setTimeout(function() {
			$("#"+id).removeClass("inconsistent");
			$("#"+target).removeClass("inconsistent");
			$("#"+id).addClass("inconsistent2");
			$("#"+target).addClass("inconsistent2");
		}, 1000);

		setTimeout(function() {

			$("#"+id).removeClass("inconsistent2");
			$("#"+target).removeClass("inconsistent2");
			$("#"+id).addClass("inconsistent");
			$("#"+target).addClass("inconsistent");
		}, 3000);

		setTimeout(function() {
			$("#"+id).removeClass("inconsistent");
			$("#"+target).removeClass("inconsistent");
			$("#"+id).addClass("inconsistent2");
			$("#"+target).addClass("inconsistent2");
		}, 5000);

		setTimeout(function() {

			$("#"+id).removeClass("inconsistent2");
			$("#"+target).removeClass("inconsistent2");
		}, 7000);
	}
