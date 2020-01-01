import React, { useEffect, useState } from "react";
import { from } from "rxjs";
import { filter, map, delay, mergeMap } from "rxjs/operators";

const numberObservables = from([1, 2, 3, 4, 5]);
const squaredNumber = numberObservables.pipe(
  filter(val => val > 2),
  mergeMap(val => from([val]).pipe(delay(1000 * val))),
  map(val => val * val)
);

const useObservable = (observable, setter) => {
  useEffect(() => {
    let subscription = observable.subscribe(result => {
      setter(result);
    });

    return () => subscription.unsubscribe();
  }, [observable, setter]);
};

const Tick = () => {
  const [currNumber, setCurrNumber] = useState(0);
  useObservable(squaredNumber, setCurrNumber);

  return (
    <div>
      <code>Current number is: {currNumber}</code>
    </div>
  );
};

export default Tick;
