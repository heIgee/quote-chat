export function generateObjectId(): string {
  return [...Array(24)]
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join('');
}
