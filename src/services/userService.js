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

      const userId =
        Date.now().toString(36) + Math.random().toString(36).substring(2);

      const userToRegister = { ...userData, id: userId };

      users.push(userToRegister);
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));

      resolve(userToRegister);
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
