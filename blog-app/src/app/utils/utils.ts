export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export async function catchError<T>(
  promise: Promise<T>
): Promise<[undefined, T] | [Error]> {
  console.log("catchError");
  return promise
    .then((data) => {
      return [undefined, data] as [undefined, T];
    })
    .catch((error) => {
      return [error];
    });
}
