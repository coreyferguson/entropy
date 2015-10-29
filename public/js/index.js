require(['js/requirejs-config'], function(config) {
	require([
		'd3',
		'node-uuid',
		'js/entropy-config'
	], function(d3, uuid, config) {

		var container; // container of atoms
		var atoms; // array of atoms within container
		var rows; // number of rows of atoms on each side of container
		var columns; // number of columns of atoms on each side of container
		var containerWidth; // in pixels
		var containerHeight; // in pixels

		init();
		setTimeout(loop, config.loopTimeInMilliseconds);

		function loop() {
			moveAtoms();
			setTimeout(loop, config.loopTimeInMilliseconds);
		}

		function init() {
			container = d3.select('#container');
			atoms = [];
			fillContainerWithGas();
		}

		/**
		 * Fill the container with gas particles
		 */
		function fillContainerWithGas() {
			// Given container and atom padding, determine rows and columns
			// that will fit within the current container.
			containerWidth = container.node().getBoundingClientRect().width;
			containerHeight = container.node().getBoundingClientRect().height;
			console.info('container dimensions: ', containerWidth, containerHeight);
			rows = Math.floor(( 
				(containerHeight - config.containerBuffer*2 - config.atomPadding*2) / 
				(config.atomPadding*2) 
			) + 1);
			columns = Math.floor(( 
				(containerWidth/2 - config.containerBuffer*2 - config.atomPadding*2) / 
				(config.atomPadding*2) 
			) + 1);
			console.info('rows, columns: ', rows, columns);
			var totalAtoms = rows * columns;
			console.info('totalAtoms: ', totalAtoms);

			// Fill container with all atoms on left side (lowest possible entropy)
			// First, create atoms
			for (var c=0; c<totalAtoms; c++) {
				atoms.push(atom('left'));
			}
			// Second, draw them on screen with d3
			var circles = container.selectAll('circle').data(atoms, function(atom) { return atom.id; });
			var circle = circles.enter().append('circle')
				.attr('r', 0)
				.attr('cx', atomX)
				.attr('cy', atomY)
				.attr('fill', '#fff')
			circle.transition().ease('elastic', 1, 2).duration(1000)
				.attr('r', config.atomRadius)
				.attr('fill', '#000');
		}

		/**
		 * Determine which atoms cross over to other side of box and then move them there.
		 */
		function moveAtoms() {
			for (var c=0; c<atoms.length; c++) {
				var atom = atoms[c];
				if (Math.random() <= config.probabilityOfCrossover) {
					if (atom.side === 'left') {
						atom.side = 'right';
					} else {
						atom.side = 'left';
					}
					atom.moving = true;
				} else {
					atom.moving = false;
				}
			}
			var circles = container.selectAll('circle').data(atoms, function(atom) { return atom.id; });
			circles.transition()//.ease('elastic', 1, 2).duration(1000)
				.attr('fill', function(atom) {
					if (atom.moving) {
						return '#f00';
					} else {
						return '#000';
					}
				})
				.attr('cx', function(atom, index) {
					if (atom.moving) {
						return containerWidth/2;
					} else {
						return atomX(atom, index);
					}
				})
				.attr('cy', function(atom, index) {
					if (atom.moving) {
						return containerHeight/2;
					} else {
						return atomY(atom, index);
					}
				})
				.transition()//.ease('elastic', 1, 2).duration(1000)
				.attr('cx', atomX)
				.attr('cy', atomY)
		}

		/**
		 * Create an atom on the given side of the container
		 */
		function atom(side) {
			return {
				id: uuid.v4(),
				side: side
			}
		}

		/**
		 * Calculate X coordinate of given atom.
		 */
		function atomX(atom, index) {
			var x = config.containerBuffer + config.atomPadding + 2*config.atomPadding*( Math.floor(index/rows) );
			if (atom.side === 'left') {
				return x;
			} else { // atom.side === right
				return x + containerWidth/2;
			}
		}

		/**
		 * Calculate Y coordinate of given atom.
		 */
		function atomY(atom, index) {
			return config.containerBuffer + config.atomPadding + 2*config.atomPadding*(index%rows);
		}

	});
});