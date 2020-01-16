// UI Class: Handle UI Tasks
class UI {
  constructor() {
    this.tr, (this.currentPageUsers = []);
  }

  static displayUsers(currentPage, list = null) {
    let users = Store.getUsers();

    if (!users.length) {
      this.addNoUserMessage();
    } else if (list) {
      list.forEach(user => this.addUserToList(user));
    } else {
      this.currentPageUsers = users.filter((user, index) => {
        if (
          index + 1 >= 6 * currentPage - 6 + 1 &&
          index + 1 <= currentPage * 6
        ) {
          return user;
        }
      });

      this.currentPageUsers.forEach(user => this.addUserToList(user));
    }
  }

  static reDisplayUsers(currentPage, list = null) {
    this.removeList();
    list
      ? this.displayUsers(currentPage, list)
      : this.displayUsers(currentPage);
  }

  static removeList() {
    document.querySelector('#user-list').innerHTML = '';
  }

  static addUserToList(user) {
    const list = document.querySelector('#user-list');

    const row = document.createElement('tr');
    row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.surname}</td>
            <td>${user.email}</td>
            <td>${user.date}</td>
            <td>
                <span class="btn-edit pencil" title="Edit"></span>
                <span class="btn-delete trash" title="Delete"></span>
            </td>`;

    list.appendChild(row);
  }

  static addNoUserMessage() {
    if (!document.querySelector('#user-list tr.no-users')) {
      const list = document.querySelector('#user-list');

      const row = document.createElement('tr');
      row.className = 'no-users';
      row.innerHTML = '<td colspan="5">Користувачів поки немає.</td>';

      list.appendChild(row);
    }
  }

  static deleteUser(el) {
    if (el.classList.contains('btn-delete')) {
      el.parentElement.parentElement.remove();
    }
  }

  static hideNoUserMessage() {
    let message = document.querySelector('tr.no-users');

    if (message) message.remove();
  }

  static showModal(modal) {
    document.querySelector(modal).style.display = 'grid';
  }

  static closeModal(modal) {
    document.querySelector(modal).style.display = 'none';
  }

  static fadeModal(modal) {
    document.querySelector(modal).classList.add('fade-out');
  }

  static editUser(el) {
    const modalForm = document.querySelector('.modal-form');

    this.tr = el.parentElement.parentElement;
    const tds = this.findTdsText();

    tds.forEach((e, i) => {
      if (modalForm.elements[i]) {
        modalForm.elements[i].value = tds[i];
      }
    });
  }

  static clearFields() {
    document.querySelector('.modal-form').reset();
  }

  static checkEmailValue(email) {
    return RegExp(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    ).test(email.value);
  }

  static isAnyFieldEmpty(form) {
    const [name, surname, email] = form;

    return (
      RegExp(/^\s*$|\s+(?=\s{1,2})/).test(name.value) ||
      RegExp(/^\s*$|\s+(?=\s{1,2})/).test(surname.value) ||
      RegExp(/^\s*$|\s+(?=\s{1,2})/).test(email.value)
    );
  }

  static isAnyFieldOutOfLength(form) {
    const [name, surname, email] = form;

    return (
      name.value.length > 80 ||
      surname.value.length > 80 ||
      email.value.length > 80
    );
  }

  static showAlerts(message, className) {
    const div = document.createElement('div');
    div.className = `alert ${className}`;
    div.appendChild(document.createTextNode(message));

    document.body.appendChild(div);

    document.querySelectorAll('.alert').forEach(element => {
      element.addEventListener('animationend', () => element.remove());
    });
  }

  static findTdsText() {
    const array = [];
    for (let i of this.tr.children) {
      array.push(i.innerHTML);
    }
    return array;
  }

  static changeUserAttributes(user, form) {
    // Grab the object attribute's names

    const { date, ...userFields } = user;

    const keys = Object.keys(userFields);

    // Loop through the names and change the content
    keys.forEach(e => (user[e] = form[e].value));
  }

  static showSearchedUsers(input, currentPage) {
    const users = this.currentPageUsers;

    if (!RegExp(/^\s+$|\s+(?=\s{1,2})/).test(input.value)) {
      const result = users.filter(
        ({ surname }) =>
          RegExp(input.value.toLowerCase()).test(surname.toLowerCase()) &&
          input.value !== ''
      );

      if (!result.length && input.value !== '') {
        this.removeList();
        this.addNoUserMessage();
      } else if (input.value === '') {
        this.reDisplayUsers(currentPage);
      } else {
        this.hideNoUserMessage();
        this.reDisplayUsers(currentPage, result);
      }
    }
  }

  static displayPaginationPages(number) {
    const pagination = document.querySelector('[current-page]');
    pagination.innerHTML = '';

    let className = '';
    for (let i = 1; i <= Store.getUsersMaxPagination(); i++) {
      className =
        i == number ? 'paginationCurrentPage' : 'paginationPageNumber';
      pagination.innerHTML += `<span class=${className}>${i}</span>`;
    }

    document.querySelectorAll('.paginationPageNumber').forEach(element => {
      element.addEventListener('click', event => {
        const number = event.target.innerText;
        UI.displayPaginationPages(number);
        UI.reDisplayUsers(number);
      });
    });
  }
}
