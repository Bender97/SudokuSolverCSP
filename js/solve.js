
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

function solveDerivedConstraints() {
	propagateConstraints();
	var singleConstraintsQueue = getQueueOfSingleConstraints();

	while(singleConstraintsQueue.length>0) {
		assignValues(singleConstraintsQueue);
		propagateConstraints();
		singleConstraintsQueue = getQueueOfSingleConstraints();
	}
}

function solveComplexConstraints() {
	
	var sortedConstraintList = getSortedConstraintList();
	//console.log(sortedConstraintList);

	while(sortedConstraintList.length>0) {

		var currentConst = sortedConstraintList.shift();
		var id = currentConst.shift();

		while(currentConst.length>1) {
			var flag = trySolve(id, currentConst.shift());
		}


		break;
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

function getQueueOfSingleConstraints() {
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
		cell.classList.add("valued");
	}
}

function getSortedConstraintList() {
	var list = [];
	var i=0, len=2;
	
	for (; len<10;len++)
		for (i=0; i<81; i++) {
			if(csp[i].length == len) list.push([i].concat(csp[i]));
		}

	return list;
}

function solve() {

	populateCSPWithCurrentValues();

	solveDerivedConstraints();

	if(!SudokuIsSolved()) {
		
		// mo so cazzi

		solveComplexConstraints();

	}

	console.log("sudoku is solved? " + SudokuIsSolved());

}