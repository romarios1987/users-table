// Store Class: Handles Storage
class Store {
  static getUsers() {
    let users;
    if (localStorage.getItem('Users') === null) {
      users = [];
    } else {
      users = JSON.parse(localStorage.getItem('Users'));
    }

    return users;
  }

  static addUser(user) {
    const users = Store.getUsers();

    users.push(user);

    localStorage.setItem('Users', JSON.stringify(users));
  }

  static removeUser(email) {
    const users = Store.getUsers();

    users.forEach((user, index) => {
      if (user.email === email) {
        users.splice(index, 1);
      }
    });

    localStorage.setItem('Users', JSON.stringify(users));
  }

  static rePostUsers(users) {
    if (localStorage.getItem('Users') !== null) {
      localStorage.setItem('Users', JSON.stringify(users));
    }
  }

  // Verify if the email already exists
  static emailAlreadyExists(email) {
    // Catch the email of the stored users
    const storeEmails = this.getUsers().map(e => e.email);

    return !storeEmails.includes(email);
  }

  static findUserIndex(email) {
    let index = 0;

    this.getUsers().forEach((e, i) => {
      if (e.email === email) {
        index = i;
      }
    });

    return index;
  }

  static getUsersMaxPagination() {
    return Math.ceil(this.getUsers().length / 6) || 1;
  }
}
