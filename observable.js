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

  map(projection) {
    const self = this;
    return new Observable(function subscribe(observer){
      const subscription = self.subscribe({
        next(v){
          let value;
          try{
            value = projection(v);
            observer.next(projection(v));
          }catch(e){
            observer.error(e);
          }
        },
        error(err){
          observer.error(err);
          subscription.unsubscribe();
        },
        complete(){
          observer.complete();
        }
      });

      return subscription;
    })
  }

  filter(predicate) {
    const self = this;
    return new Observable(function subscribe(observer){
      const subscription = self.subscribe({
        next(v){
          if(predicate(v)){
            observer.next(v);
          }
        },
        error(err){
          observer.error(err);
          subscription.unsubscribe();
        },
        complete(){
          observer.complete();
        }
      });

      return subscription;
    })
  }


}

const button = document.getElementById("button");

const clicks = Observable.fromEvent(button, "click");


clicks
.map(ev => ev.offsetX)
.filter(offsetX => offsetX > 10)
.subscribe({
  next(v) {
    console.log('next', v);
  },
  complete() {
    console.log('done');
  }
});



// const obs = Observable.timeout(500);

// obs.map(x => x + 1);
// obs.subscribe({
//   next(v) {
//     console.log('next');
//   },
//   complete() {
//     console.log('done');
//   }
// })