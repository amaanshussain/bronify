export function concatenateArrayBuffers(buffers) {
  let totalLength = buffers.reduce((sum, buf) => sum + buf.byteLength, 0);

  let concatenatedBuffer = new ArrayBuffer(totalLength);

  let view = new Uint8Array(concatenatedBuffer);

  let offset = 0;
  for (let buffer of buffers) {
    view.set(new Uint8Array(buffer), offset);
    offset += buffer.byteLength;
  }

  return concatenatedBuffer;
}

export function formatSongTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const formattedMinutes = String(Math.floor(minutes)).padStart(2, '0');
  const formattedSeconds = String(Math.floor(remainingSeconds)).padStart(2, '0');
  return `${formattedMinutes}:${formattedSeconds}`;
}