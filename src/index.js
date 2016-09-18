import {Observable as O, Subject} from 'rxjs'
import {makeDOMDriver} from '@cycle/dom';
import Cycle from '@cycle/rxjs-run';
import DomTest from './domTestComponent'

function main(sources) {
  return DomTest(sources)
}

const drivers = {
	DOM: makeDOMDriver('#app'),
};

Cycle.run(main, drivers);
