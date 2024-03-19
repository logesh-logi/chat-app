const users = [];

function userjoin(id, username, room) {
  const user = { id, username, room };
  users.push(user);
  return user;
}

function userLeave(id) {
  const index = users.findIndex((user) => user.id === id);
  //   console.log(index);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

function getRoomUser(room) {
  return users.filter((user) => user.room === room);
}

function getCurrentUser(id) {
  return users.find((user) => user.id === id);
}

module.exports = {
  userjoin,
  getCurrentUser,
  userLeave,
  getRoomUser,
};
