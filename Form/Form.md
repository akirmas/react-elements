# Data Injection

`<Form/>` can serve input of multiple clients.

https://github.com/akirmas/react-components/blob/0c1daa5c41e3f5be86cf5730b0897d5462f3c01f/Form/index.js#L45-L48

That means source of data could be not only parent in any moment. Because source is outbound one of `props` should be event emitter and `<Form/> ` subscribes  (`.addEventListener`). Name of event and property of event with data is any but conventional and stable - (`dataInjecting` or `onData`) and (`data-stack` or `data`) are examples. Two requirements:

1. ```js
   typeof event.data === 'string' // almost JSON
   ```

2. ```js
   data = Object.assign({}, ...JSON.parse(`[${event.data}]`))
   ```

   This will give some freedom to parent. While data is simple json-object nothing  changed but this thing gives string concatenation with delimiter `','`  as object merge and will provide a stack of events in one.

   As an example for parent

https://github.com/akirmas/paymentform/blob/e39f9ab9d51bee4b9b3989852a64cf11acf1930e/src/pages/index.js#L125

```typescript
// parent.js
var stack :string // common not fired stack
stack += (
	stack === ''
    // simple check to avoid double comma 
    || stack.endsWith(',')
    ? ''
    : ','
// new data    
) + data
```

