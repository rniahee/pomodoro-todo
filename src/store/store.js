export class Store {
  #state;
  #listeners = [];

  constructor(initialState) {
    this.#state = initialState;
  }

  getState() {
    return this.#state;
  }

  setState(updater) {
    this.#state = updater(this.#state);
    this.#listeners.forEach((fn) => fn());
  }

  subscribe(listener) {
    this.#listeners.push(listener);
    return () => {
      this.#listeners = this.#listeners.filter((fn) => fn !== listener);
    };
  }
}
