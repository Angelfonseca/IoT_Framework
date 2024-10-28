function mapValues<T, U>(obj: Record<string, T>, f: (value: T, key: string) => U): Record<string, U> {
  return Object.keys(obj).reduce((acc, key) => {
    acc[key] = f(obj[key], key);
    return acc;
  }, {} as Record<string, U>);
}

export default (module: string, types: Record<string, string[]>): Record<string, Record<string, string>> => {
  const newObj: Record<string, Record<string, string>> = {};
  mapValues(types, (names, key) => {
    newObj[key] = {};
    names.forEach((name) => {
      newObj[key][name] = module + ':' + name;
    });
  });
  return newObj;
}
