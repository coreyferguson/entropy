
var engineIterationTimeInMilliseconds = 1000;
var numberOfAtoms = 20;
var atoms = [];

var engine = function() {
	moveAtoms();
	paintAtoms();
	setTimeout(engine, engineIterationTimeInMilliseconds);
};

init();
engine();

function init() {
	atoms = [];
	for (var c=0; c<numberOfAtoms; c++) {
		atoms.push({
			id: guid(),
			side: 'left'
		});
	}
}

function moveAtoms() {
	for (var c=0; c<atoms.length; c++) {
		if (Math.random() < 0.1) {
			if (atoms[c].side === 'left') {
				atoms[c] = {id: guid(), side: 'right'};
			} else if (atoms[c].side === 'right') {
				atoms[c] = {id: guid(), side: 'left'};
			}
		}
	}
}

function paintAtoms() {
	// config
	var atomRadius = 5;
	// paint
	var svg = d3.select('svg');
	var circle = svg.selectAll('circle').data(atoms, function(atom) { return atom.id; });
	var circleEnter = circle.enter().append('circle');
	circleEnter.attr('r', atomRadius);
	circleEnter.attr('cx', function(atom, index) {
		if (atom.side === 'left') {
			return 125;
		} else if (atom.side === 'right') {
			return 375;
		}
	});
	circleEnter.attr('cy', function(atom, index) { return 50+index*atomRadius*4; });
	circle.exit().remove();
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