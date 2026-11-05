export async function loadFile(path, ft) {
  try {
    const response = await fetch(path);
    const text = await response.text();
    return text;
  } catch (err) {
    console.error(err);
    return null;
  }
}
