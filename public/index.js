// config
var totalNumberOfAtoms = 495;
var boxBuffer = 15;
var atomRadius = 5;
var atomPadding = 7;
var loopTimeInMilliseconds = 100;
var percentChanceOfGoingThroughSlit = 0.01;

// buffer + padding + rows + columns
var boxLeft = d3.select('#boxLeft');
var boxRight = d3.select('#boxRight');
var boxHeight = boxLeft.node().getBoundingClientRect().height;
var boxWidth = boxLeft.node().getBoundingClientRect().width;
if (boxHeight !== boxRight.node().getBoundingClientRect().height || 
	boxWidth !== boxRight.node().getBoundingClientRect().width) {
	throw new Error('Boxes are not equal in height and width.');
}
var boxRows = Math.floor(( 
	(boxHeight - boxBuffer*2 - atomPadding*2) / 
	(atomPadding*2) 
) + 1);
var boxColumns = Math.floor(( 
	(boxWidth - boxBuffer*2 - atomPadding*2) / 
	(atomPadding*2) 
) + 1);
var maximumAtomsWithinSpaceGiven = boxRows * boxColumns;
if (totalNumberOfAtoms > maximumAtomsWithinSpaceGiven) {
	throw new Error(
		'Number of atoms specified (' + 
			totalNumberOfAtoms + 
			') cannot fit within limited space (' + 
			maximumAtomsWithinSpaceGiven + 
			').');
}

var atomsLeft = [];
var atomsRight = [];
init();
paint();

var loop = function() {
	moveAtoms();
	paint();
	setTimeout(loop, loopTimeInMilliseconds);
}
setTimeout(loop, loopTimeInMilliseconds);

function init() {
	for (var c=0; c<totalNumberOfAtoms; c++) {
		atomsLeft.push(guid())
	}
}

function moveAtoms() {
	var newAtomsLeft = [];
	var newAtomsRight = [];
	for (var c=0; c<atomsLeft.length; c++) {
		var atom = atomsLeft[c];
		if (Math.random() < percentChanceOfGoingThroughSlit) {
			newAtomsRight.push(guid());
		} else {
			newAtomsLeft.push(guid());
		}
	}
	for (var c=0; c<atomsRight.length; c++) {
		var atom = atomsRight[c];
		if (Math.random() < percentChanceOfGoingThroughSlit) {
			newAtomsLeft.push(guid());
		} else {
			newAtomsRight.push(guid());
		}
	}
	atomsLeft = newAtomsLeft;
	atomsRight = newAtomsRight;
}

function paint() {
	// left box
	var circleLeft = boxLeft.selectAll('circle')
		.data(atomsLeft, function(atom) { return atom; });
	circleLeft.enter().append('circle')
		.attr('style', 'fill:blue')
		.attr('r', atomRadius)
		.attr('cx', function(atom, index) {
			return boxBuffer + atomPadding + 2*atomPadding*( Math.floor(index/boxRows) );
		})
		.attr('cy', function(atom, index) {
			return boxBuffer + atomPadding + 2*atomPadding*(index%boxRows);
		});
	circleLeft.exit().remove();
	// right box
	var circleRight = boxRight.selectAll('circle')
		.data(atomsRight, function(atom) { return atom; });
	circleRight.enter().append('circle')
		.attr('style', 'fill:blue')
		.attr('r', atomRadius)
		.attr('cx', function(atom, index) {
			return boxBuffer + atomPadding + 2*atomPadding*( Math.floor(index/boxRows) );
		})
		.attr('cy', function(atom, index) {
			return boxBuffer + atomPadding + 2*atomPadding*(index%boxRows);
		});
	circleRight.exit().remove();
}

function guid() {
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
			.substring(1);
	}
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
		s4() + '-' + s4() + s4() + s4();
}