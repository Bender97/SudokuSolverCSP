function checkIntegrityByRow(id, value) {
	var col = getCol(id);
	var base = getRow(id);
	var i;
	for (i=0; i<9; i++)
		if (i!=col) {
			var targetCellID = base*9 + i;
			var cell = document.getElementById(targetCellID);
			if (cell!=null && cell.value!="") {
				if (cell.value==value) {
					console.log("INSIDE ROW");
					return targetCellID;	// integrity failure
				}
			}
		}
	return 0;
}

function checkIntegrityByCol(id, value) {
	var col = getCol(id);
	var i;
	for (i=0; i<9; i++) {
		var targetCellID = i*9+col;
		if (targetCellID!=id) {
			var cell = document.getElementById(targetCellID);
			if (cell!=null && cell.value!="") {
				if (cell.value==value) {
					console.log("INSIDE COL");
					return targetCellID;	// integrity failure
				}
			}
		}
	}
	return 0;
}

function getSubTL(id) { // extract sub Top Left cell id
	var row = Math.floor(id/27)*27;
	var col = Math.floor(getCol(id)/3)*3;
	return row+col;
}

function checkIntegrityBySub(id, value) {
	var subTL = getSubTL(id);
	var i, j;
	for (i=subTL; i<subTL+27; i+=9)
		for (j=0; j<3; j++) {
			var targetCellID = i+j;
			if (targetCellID!=id) {
				var cell = document.getElementById(targetCellID);
				if (cell!=null && cell.value!="") {
					if (cell.value==value) {
						console.log("INSIDE SUB");
						return targetCellID;	// integrity failure
					}
				}
			}
		}
	return 0;
}

function checkIntegrity(animate) {
	var cellID = 0;
	var flag;
	for (; cellID<81; cellID++) { // iterate over all cells of the sudoku
		if (flag=checkIntegrityCell(cellID)) {
			
			startAnimationIntegrityError(cellID, flag);
			return flag;
		}
	}
	if (animate) {
		startAnimationConsistent();
	}
	console.log("200 OK");
}

function checkIntegrityCell(cellID) {
	cell = document.getElementById(cellID);

	if (cell!=null && cell.value!="") {
		var checkRow = checkIntegrityByRow(cellID, cell.value);
		if (checkRow) {
			console.log("INTEGRITY ERROR of cell " + cellID + " with value " + cell.value);
			return checkRow;
		}

		var checkCol = checkIntegrityByCol(cellID, cell.value);
		if (checkCol) {
			console.log("INTEGRITY ERROR of cell " + cellID + " with value " + cell.value);
			return checkCol;
		}

		var checkSub = checkIntegrityBySub(cellID, cell.value);
		if (checkSub) {
			console.log("INTEGRITY ERROR of cell " + cellID + " with value " + cell.value);
			return checkSub;
		}
	}
	return 0;
}