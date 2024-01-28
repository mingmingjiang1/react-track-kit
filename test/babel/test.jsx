import { useCallback } from 'react';
import { test } from './test1';

const handleChange1 = () => {
  console.log(333);
};

function Child({ handleChange1 }) {
  const handleChange = async () => {
    console.log(333);
  };

  async function onAbort() {
    console.log(333);
  }

  return (
    <div
      track-params={{
        event: ['onClick', 'onAbort'],
        track: ['ClickHandler', 'confirm'],
        params: {
          id: '1',
          name: 'jmm',
          age: 12,
        },
      }}
      onAbort={test}
      onClick={handleChange}
      onAuxClick={handleChange1}
    >
      33
    </div>
  );
}

export function Name() {
  const handleChange = async (key) => {
    console.log(333, key);
  };

  async function onAbort(key) {
    console.log(333, key);
  }

  const handleChange2 = useCallback((key) => {
    console.log(333, key);
  }, []);

  return (
    <div
      track-params={{
        event: ['onAnimationEnd', 'onAbort'],
        track: ['ClickHandler', 'confirm'],
        params: {
          id: '1',
          name: 'jmm',
          age: 12,
        },
      }}
      // attr checked
      onAnimationEnd={() => {
        console.log(333);
      }}
      // useCallback checked
      // onAbortCapture={handleChange1}
      //
      onAbort={onAbort}
      onClick={handleChange}
      onAuxClick={handleChange2}
    >
      33
      <Child handleChange1={handleChange1} />
    </div>
  );
}

/* 

async测试
*/
