"use strict";

( function() {

Object.assign( gs.history, {
	select:  select,
	create:  create,
	delete:  d3lete,
	move:    move,
	crop:    crop,
	cropEnd: cropEnd,
	slip:    slip,
	paste:   paste,
} );

function paste( data, sign ) {
	if ( sign > 0 ) {
		data.selected.forEach( function( smp ) {
			gs.sample.select( smp, false );
		} );
		data.pasted.forEach( function( smp, i ) {
			var cpy = data.copied[ i ];

			gs.sample.inTrack( smp, cpy.data.track.id );
			gs.sample.when( smp, cpy.when + data.allDuration );
			gs.sample.slip( smp, cpy.offset );
			gs.sample.duration( smp, cpy.duration );
			gs.sample.select( smp, true );
		} );
		wa.composition.add( data.pasted );
	} else {
		data.pasted.forEach( gs.sample.delete );
		data.selected.forEach( function( smp ) {
			gs.sample.select( smp, true );
		} );
	}
}

function select( data ) {
	data.samples.forEach( function( smp ) {
		gs.sample.select( smp );
	} );
}

function create( data, sign ) {
	if ( sign === -1 ) {
		return d3lete( data, +1 );
	}
	data.samples.forEach( function( smp ) {
		wa.composition.add( smp );
		ui.sample.create( smp );
		gs.sample.inTrack( smp, smp.data.track.id );
		gs.sample.when( smp, smp.when );
		gs.sample.duration( smp, smp.duration );
		gs.sample.slip( smp, smp.offset );
		gs.sample.select( smp, smp.data.oldSelected );

		if ( !smp.data.gsfile.nbSamples++ ) {
			ui.file.used( smp.data.gsfile );
		}
	} );
}

function d3lete( data, sign ) {
	if ( sign === -1 ) {
		create( data, +1 );
	} else {
		data.samples.forEach( gs.sample.delete );
	}
}

function move( data, sign ) {
	var sample = data.sample,
		track = data.track * sign;

	gs.samples.selected.when( sample, data.when * sign );
	if ( track ) {
		if ( sample.data.selected ) {
			gs.selectedSamples.forEach( function( smp ) {
				gs.sample.inTrack( smp, smp.data.track.id + track );
			} );
		} else {
			gs.sample.inTrack( sample, sample.data.track.id + track );
		}
	}
	gs.samples.selected.do( sample, function( smp ) {
		wa.composition.update( smp, "mv" );
	} );
}

function crop( data, sign ) {
	var sample = data.sample;

	gs.samples.selected.duration( sample, data.duration * sign );
	gs.samples.selected.when( sample, data.when * sign );
	gs.samples.selected.slip( sample, -data.offset * sign );
	gs.samples.selected.do( sample, function( smp ) {
		wa.composition.update( smp, "mv" );
	} );
}

function cropEnd( data, sign ) {
	gs.samples.selected.duration( data.sample, data.duration * sign );
	gs.samples.selected.do( data.sample, function( smp ) {
		wa.composition.update( smp, "mv" );
	} );
}

function slip( data, sign ) {
	gs.samples.selected.slip( data.sample, data.offset * sign );
	gs.samples.selected.do( data.sample, function( smp ) {
		wa.composition.update( smp, "mv" );
	} );
}

} )();
