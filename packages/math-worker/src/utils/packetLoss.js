export function checkPacketLoss(lastId, currentId) {
  if (lastId === null) {
    return 0;
  }
  const expectedId = lastId + 1;
  return currentId > expectedId ? currentId - expectedId : 0;
}
