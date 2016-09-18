import {Observable as O} from 'rxjs'
import isolate from '@cycle/isolate'
import {div, button} from '@cycle/dom'
import Immutable from 'immutable'

function main(sources) {
  const {DOM} = sources
  const itemMouseDown$ = DOM.select('.item').events('mousedown')
    .startWith(`start`)
    .do(x => {
      if (x === `start`) console.log(`Starting itemMouseDown$`)
    })
    .filter(x => x !== `start`)
    .finally(() => console.log(`Stopping itemMouseDown$`))
  const itemMouseUp$ = DOM.select('.item').events('mouseup')
    .startWith(`start`)
    .do(x => {
      if (x === `start`) console.log(`Starting itemMouseUp$`)
    })
    .filter(x => x !== `start`)
    .finally(() => console.log(`Stopping itemMouseUp$`))

  const itemMouseClick$ = itemMouseDown$
    .startWith(`start`)
    .do(x => {
      if (x === `start`) console.log(`Starting itemMouseClick$`)
    })
    .filter(x => x !== `start`)
    .finally(() => console.log(`Stopping itemMouseClick$`))
    .switchMap(down => {
      return itemMouseUp$.filter(up => down.target === up.target)
    })

  // const itemMouseClick$ = itemMouseDown$
  // .switchMap(down => {
  //   return DOM.select('.item').events('mouseup').filter(up => down.target === up.target)
  // })

  //const itemMouseClick$ = DOM.select('.item').events('click')
  
  const resetClick$ = DOM.select(`.reset`).events(`click`)
    .startWith(`start`)
    .do(x => {
      if (x === `start`) console.log(`Starting resetClick$`)
    })
    .filter(x => x !== `start`)
    .finally(() => console.log(`Stopping resetClick$`))
  const clickR = itemMouseClick$.map(_ => state => {
      return state.update(`count`, x => x + 1)
  })

  const state$ = resetClick$.startWith(undefined).switchMap(_ => {
    return clickR
      .startWith(Immutable.Map({
        count: 0
      }))
      .scan((acc, f) => f(acc))
  })
  .map(x => x.toJS())
  .publishReplay(1)
  .refCount()

  const vtree$ = state$.map(state => {
    return div(`#testRoot`, [
      button(`.reset`, [`Click here to reset`]),
      div([`Click count: ${state.count}`]),
      button(`.item.class${state.count}`, [`Increment`])
    ])
  })

  return {
    DOM: vtree$,
  }
}

export default (sources, inputs) => isolate(main)(sources, inputs)
//export default main
