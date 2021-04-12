export const createResponse = (message: string, data: any) => ({
  "message": message,
  "data": data
});

export const createError = (status: number, name: string, message: string) => {
  const e = new Error();
  (<any>e).status = status;
  e.name = name;
  e.message = message;
  return e;
};

export const makeid = (length: number, alpahnum_only : boolean = false) => {
  let result = '';
  const characters = !alpahnum_only
      ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789,./;:?><[]{}|`~!@#$%^&*()-_=+'
      : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i += 1) {
      result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
      );
  }
  return result;
};