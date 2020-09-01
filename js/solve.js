
function populateCSPWithCurrentValues(csp) {
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
	return csp;
}

function solveDerivedConstraints(csp, isBacktrackingActive) {
	csp = propagateConstraints(csp);
	var singleConstraintsQueue = getQueueOfSingleConstraints(csp);

	while(singleConstraintsQueue.length>0) {
		if (!isBacktrackingActive)
			assignValues(singleConstraintsQueue, csp);
		csp = propagateConstraints(csp);
		singleConstraintsQueue = getQueueOfSingleConstraints(csp);
	}
	return csp;
}

function solveComplexConstraints(csp) {
	
	var sortedConstraintList = getSortedConstraintList(csp);
	//console.log(sortedConstraintList);

	while(sortedConstraintList.length>0) {

		var currentConstraintsList = sortedConstraintList.shift();
		var currentCellID = currentConstraintsList.shift();

		while(currentConstraintsList.length>1) {
			var currentConstraint = currentConstraintsList.shift();
			var backtrackingIsActive = 1;
			
		console.log("imposing value '" + currentConstraint + "' to cell " + currentCellID);

			var temp = csp[currentCellID];

			csp[currentCellID] = [currentConstraint];

			var virtualSolution = solve(csp, backtrackingIsActive);
			if (virtualSolution==null || SudokuIsSolved(virtualSolution))
				csp[currentCellID] = temp;
			else
				return csp;
			
		}


		break;
	}

	console.log("NO SOLUTION FOUND!!");
	return null;	// ERROR
	
}

function removeElem(csp, myID, predecessorID) {
	if (predecessorID==myID) return csp;

	cell = document.getElementById(predecessorID);
	if (cell.value!="") {
		var index = csp[myID].indexOf(parseInt(cell.value));
		if (index>=0)
			csp[myID].splice(index, 1);
	}
	return csp;
}

function propagateByRow(csp, id) {
	var base = getRow(id)*9;
	var i;
	for (i=base; i<base+9; i++)
		csp = removeElem(csp, id, i);
	return csp;
}

function propagateByCol(csp, id) {
	var col = getCol(id);
	var i;
	for (i=col; i<81; i+=9)
		csp = removeElem(csp, id, i);
	return csp;
}

function propagateBySub(csp, id) {
	var subTL = getSubTL(id);
	var i, j;
	for (i=subTL; i<subTL+27; i+=9)
		for (j=0; j<3; j++) {
			var targetCellID = i+j;
			csp = removeElem(csp, id, targetCellID);
		}
		return csp;
}

function propagateConstraints(csp) {
	var i;
	for (i=0; i<81; i++) {
		cell = document.getElementById(i);

		if (cell.value=="") {
			csp = propagateByRow(csp, i);
			csp = propagateByCol(csp, i);
			csp = propagateBySub(csp, i);
		}
	}
	return csp;
}

function checkCellSolved(csp, id) {
	return csp[id].length==1;
}

function SudokuIsSolved(csp) {
	var i;
	for (i=0;i<81;i++)
		if (!checkCellSolved(csp, i)) return 0;
	return 1;
}

function getQueueOfSingleConstraints(csp) {
	var i, queue=[];
	for (i=0; i<81; i++) {
		if (csp[i].length==1 && document.getElementById(i).value=="") queue.push(i);
	}

	return queue;
}

function assignValues(queue, csp) {
	while(queue.length>0) {
		var id = queue.shift();
		var cell = document.getElementById(id);
		cell.value = csp[id][0].toString();
		cell.classList.add("valued");
	}
}

function getSortedConstraintList(csp) {
	var list = [];
	var i=0, len=2;
	
	for (; len<10;len++)
		for (i=0; i<81; i++) {
			if(csp[i].length == len) list.push([i].concat(csp[i]));
		}

	return list;
}

function solve(csp, isBacktrackingActive) {

	console.log("solve called");

	if (!isBacktrackingActive) csp = populateCSPWithCurrentValues(csp);

	csp = solveDerivedConstraints(csp, isBacktrackingActive);

	// if sudoku csp already solved, no need to do complex things
	if(!SudokuIsSolved(csp)) {
		
		// mo so cazzi
		csp = solveComplexConstraints(csp);
		assignValues(csp);
	}

	console.log("sudoku is solved? " + SudokuIsSolved(csp));

}