class Observable {
  constructor(subscribe) {
    this._subscribe = subscribe;
  }
  subscribe(observer) {
    return this._subscribe(observer);
  }

  static timeout(time) {
    return new Observable(function subscribe(observer) {
      const handle = setTimeout(function() {
        observer.next();
        observer.complete();
       }, time);

      return {
        unsubscribe() {
          clearTimeout(handle);
        }
      }
    });
  }

  static allNumbers() {
    return new Observable(function subscribe(observer){
      for(let num; true; num++){
        observer.next(num);

      }
    })
  }


  static fromEvent(dom, eventName) {
    return new Observable(function subscribe(observer){
      const handler = ev => {
        let observer = null;
        observer.next(ev);
      }
      dom.addEventListener(eventName, handler);

      return {
        unsubscribe() {
          dom.removeEventListener(eventName, handler);
        }
      }
    });
  }
}


const obs = Observable.timeout(500);
obs.subscribe({
  next(v) {
    console.log('next');
  },
  complete() {
    console.log('done');
  }
})