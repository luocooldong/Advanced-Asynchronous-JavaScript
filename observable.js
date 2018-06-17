class Observable {
  constructor(subscribe) {
    this._subscribe = subscribe;
  }
  subscribe(observer) {
    return this._subscribe(observer);
  }

  static timeout(time) {

    let fired = false;
    let obs = null;

    const handle = setTimeout(function() {
     fired = true;
     obs.next();
     obs.complete();
    }, time)

    return new Observable(function subscribe(observer) {

      if(fired === true) {
        observer.next();
        observer.complete();
      }
      else {
        obs = observer;
      }
      
      return {
        unsubscribe() {
          clearTimeout(handle);
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