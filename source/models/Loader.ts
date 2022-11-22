import { ObservableObject, pause, reactive, options, Reentrance, LoggingLevel, Monitor, Rx } from "reactronic"

export class Loader extends ObservableObject {
  filter: string
  loaded: Array<string>
  monitor: Monitor

  constructor() {
    super()
    this.filter = ""
    this.loaded = []
    this.monitor = Monitor.create("Loader.monitor", -1, -1, 1)
    Rx.getController(this.load).configure({ monitor: this.monitor })
  }

  @reactive
  protected async load(): Promise<void> {
    await pause(100)
    const f = this.filter.toLocaleLowerCase()
    this.loaded = technologies.filter(x => x.toLocaleLowerCase().indexOf(f) >= 0)
  }
}

const technologies = [
  "Nezaboodka",
  "Boocel",
  "Reactronic",
  "Artel",
  "Verstak",
  "And some more products in the future"
]
