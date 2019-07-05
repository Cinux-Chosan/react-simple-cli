const { getPrototypeOf } = Object;
const ArrayProto = getPrototypeOf([]);

ArrayProto.removeItem = function(...items) {
  items.forEach(el => {
    const index = this.indexOf(el); // -1 会导致 splice 从末尾开始删除元素
    ~index && this.splice(index, 1);
  });
};

ArrayProto.removeBy = function(key, value, strict = true) {
  let index;
  while (~(index = this.findIndexBy(key, value, strict))) {
    this.splice(index, 1);
  }
};

ArrayProto.filterBy = function(key, value, strict = true) {
  // eslint-disable-next-line
  return this.filter(el => (strict ? el[key] === value : el[key] == value));
};

ArrayProto.findBy = function(key, value, strict = true) {
  // eslint-disable-next-line
  return this.find(el => (strict ? el[key] === value : el[key] == value));
};

ArrayProto.findIndexBy = function(key, value, strict = true) {
  // eslint-disable-next-line
  return this.findIndex(el => (strict ? el[key] === value : el[key] == value));
};
