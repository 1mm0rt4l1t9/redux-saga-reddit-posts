//* Тут всё очевидно, это намного лучше чем бесконечно диспатчить

export const createAction = (type, payload) => {
  return payload === undefined ? { type } : { type, payload }
};

