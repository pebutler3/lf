export function watch(obj, getCallback, setCallback) {
  return new Proxy(obj, {
    get(target, key) {
      const value = target[key];
      
      if (getCallback && key in target) {
        getCallback(key, value);
      }
      
      return value;
    },
    
    set(target, key, value) {
      target[key] = value;
      
      if (setCallback) {
        setCallback(key, value);
      }
      
      return true;
    }
  });
}