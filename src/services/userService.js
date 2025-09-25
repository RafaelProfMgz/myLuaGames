const USERS_DB_KEY = "users_database";
export const registerUser = (userData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem(USERS_DB_KEY)) || [];

      const userExists = users.some(
        (user) =>
          user.username === userData.username || user.email === userData.email
      );

      if (userExists) {
        return reject(new Error("Usuário ou e-mail já cadastrado."));
      }

      users.push(userData);
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));

      const { password, ...userToReturn } = userData;
      resolve(userToReturn);
    }, 300);
  });
};

export const verifyCredentials = (credentials) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem(USERS_DB_KEY)) || [];
      const user = users.find((u) => u.username === credentials.username);

      if (!user || user.password !== credentials.password) {
        return reject(new Error("Nome de usuário ou senha inválidos."));
      }

      const { password, ...userToReturn } = user;
      resolve(userToReturn);
    }, 300);
  });
};
