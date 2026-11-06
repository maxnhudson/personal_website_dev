export async function loadFile(path: string) {
  try {
    const response = await fetch(path);
    const text = await response.text();
    return text;
  } catch (err) {
    console.error(err);
    return null;
  }
}
