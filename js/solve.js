
csp = [];

function populateCSPWithCurrentValues() {
	var i;
	for (i=0; i< 81; i++) {
		var cell = document.getElementById(i);
		var bucket;
		
		if (cell.value!="")
			bucket = [parseInt(cell.value)]; 
		else
			bucket = [1, 2, 3, 4, 5, 6, 7, 8, 9];
		csp.push(bucket);
	}
}

function removeElem(myID, predecessorID) {
	if (predecessorID==myID) return;

	cell = document.getElementById(predecessorID);
	if (cell.value!="") {
		var index = csp[myID].indexOf(parseInt(cell.value));
		if (index>=0)
			csp[myID].splice(index, 1);
	}
	//else {
		//console.log("elem #" + predecessorID + " skipped: empty cell");
	//}
}

function propagateByRow(id) {
	var base = getRow(id)*9;
	var i;
	for (i=base; i<base+9; i++) {
		removeElem(id, i);
	}
}

function propagateByCol(id) {
	var col = getCol(id);
	var i;
	for (i=col; i<81; i+=9) {
		removeElem(id, i);
	}
}

function propagateBySub(id) {
	var subTL = getSubTL(id);
	var i, j;
	for (i=subTL; i<subTL+27; i+=9)
		for (j=0; j<3; j++) {
			var targetCellID = i+j;
			removeElem(id, targetCellID);
		}
}

function propagateConstraints() {
	var i;
	for (i=0; i<81; i++) {
		cell = document.getElementById(i);

		if (cell.value=="") {
			propagateByRow(i);
			propagateByCol(i);
			propagateBySub(i);
		}
	}
}

function checkCellSolved(id) {
	return csp[id].length==1;
}

function SudokuIsSolved() {
	var i;
	for (i=0;i<81;i++)
		if (!checkCellSolved(i)) return 0;
	return 1;
}

function collectValues() {
	var i, queue=[];
	for (i=0; i<81; i++) {
		if (csp[i].length==1 && document.getElementById(i).value=="") queue.push(i);
	}

	return queue;
}

function assignValues(queue) {
	while(queue.length>0) {
		var id = queue.shift();
		var cell = document.getElementById(id);
		cell.value = csp[id][0].toString();
		//console.log("assigned value " + cell.value + " to cell " + cell.id);
		cell.classList.add("valued");
	}
}

function solve() {

	populateCSPWithCurrentValues();

	while(!SudokuIsSolved()) {
		propagateConstraints();
		var queue = collectValues();

		while(queue.length>0) {
			console.log("queue: " + queue);
			assignValues(queue);
			propagateConstraints();
			queue = collectValues();
			console.log("while finished, queue has " + queue.length + " elements");
			//break; 
		}

			// mo so cazzi
		

		break;

	}


}