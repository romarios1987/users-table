const date = Date.now();

function correctDate(timestamp) {
  options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false
  };

  let date = new Date();
  date.setTime(timestamp);
  return date.toLocaleDateString('en-US', options);
}

// User Class
class User {
  constructor(name, surname, email) {
    this.name = name;
    this.surname = surname;
    this.email = email;
    this.date = correctDate(Date.now());
  }
}

let currentPage = 1;

// Event: Display Users
document.addEventListener('DOMContentLoaded', () => {
  if (Store.getUsers().length === 0) {
    UI.addNoUserMessage();
  } else {
    UI.hideNoUserMessage();
    UI.displayUsers(currentPage);
  }

  UI.displayPaginationPages(currentPage);
});

// Event: Search Users
document.querySelector('[search-input]').addEventListener('input', e => {
  UI.showSearchedUsers(e.target, currentPage);
});

// Event: Show Modal to Add a Users
document.querySelector('#add-user-btn').addEventListener('click', () => {
  // Change the modal title
  document.querySelector('[modal-title]').innerHTML = 'Добавити користувача';

  UI.clearFields();

  UI.showModal('.modal-container');
});

// Event: Save a new or edited User
document.querySelector('.modal-form').addEventListener('submit', e => {
  e.preventDefault();

  let noUsers = document.querySelector('tr.no-users');
  const list = Store.getUsers();
  const modalForm = document.querySelector('.modal-form');

  const infos = {
    name: modalForm.name.value,
    surname: modalForm.surname.value,
    email: modalForm.email.value
  };

  if (UI.isAnyFieldEmpty(modalForm)) {
    UI.showAlerts('Заповніть усі поля', 'alert-danger');
  } else if (UI.isAnyFieldOutOfLength(modalForm)) {
    UI.showAlerts(
      'Будь ласка, заповніть поля правильним розміром',
      'alert-danger'
    );
  } else if (!UI.checkEmailValue(modalForm.email)) {
    UI.showAlerts('Введіть валідний e-mail', 'alert-danger');
  }
  // Verify the Modal title to see if is a new user
  else if (
    document.querySelector('[modal-title]').innerHTML === 'Добавити користувача'
  ) {
    const user = new User(infos.name, infos.surname, infos.email);

    // Verify if the email already exists
    if (Store.emailAlreadyExists(user.email)) {
      // Add the user to the store
      Store.addUser(user);

      // Show success message
      UI.showAlerts('Користувач доданий з успіхом!', 'alert-success');

      UI.clearFields();

      // Verify if the next user go to a new page
      if (Store.getUsersMaxPagination() !== currentPage) {
        currentPage = Store.getUsersMaxPagination();
        UI.displayPaginationPages(currentPage);
      }

      UI.fadeModal('.modal-container');

      UI.reDisplayUsers(currentPage);

      UI.hideNoUserMessage();
    } else {
      // Alert if the email already exists
      UI.showAlerts('Ця адреса електронної вже існує!', 'alert-danger');
    }
  } else {
    const tds = UI.findTdsText();

    // Verify if the email of the user already exists or it's did not has changed
    if (Store.emailAlreadyExists(infos.email) || tds[2] === infos.email) {
      // Find the index of the edited email
      const i = Store.findUserIndex(tds[2]);

      // Changing the user attributes the new ones
      UI.changeUserAttributes(list[i], modalForm);

      // Re posting the user on the Storage
      Store.rePostUsers(list);

      // Re display the users, close the modal and show success message
      UI.reDisplayUsers(currentPage);
      UI.fadeModal('.modal-container');
      UI.showAlerts('Користувач був відредагований успішно!', 'alert-success');
    } else {
      // Alert if the email already exists
      UI.showAlerts('Ця адреса електронної вже існує!', 'alert-danger');
    }
  }
});

// Event: Remove or Edit a User
document.querySelector('#user-list').addEventListener('click', e => {
  // Verify if the target is the delete button
  if (e.target.title === 'Delete') {
    UI.deleteUser(e.target);

    Store.removeUser(
      e.target.parentElement.previousElementSibling.previousElementSibling
        .textContent
    );

    // Show success message
    UI.showAlerts('Користувача видалено з успіхом!', 'alert-success');

    // If don't has any user in current page, go to the previous
    if (Store.getUsersMaxPagination() < currentPage && currentPage !== 1) {
      currentPage -= 1;
      UI.displayPaginationPages(currentPage);
    }

    UI.reDisplayUsers(currentPage);
    UI.displayPaginationPages(currentPage);
  }
  //Verify if the target is the edit button
  else if (e.target.title === 'Edit') {
    // Show the modal
    UI.showModal('.modal-container');

    // Change the modal title
    document.querySelector('[modal-title]').innerHTML =
      'Редагувати користувача';

    // Open the modal for editing the user
    UI.editUser(e.target);
  }
});

//Event: Cancel Editing/adding user
document
  .querySelector('.modal-actions .cancel')
  .addEventListener('click', e => {
    e.preventDefault();
    document.querySelector('.modal-container').classList.add('fade-out');
  });

// Event: Close Modal
document
  .querySelector('.modal-container')
  .addEventListener('animationend', e => {
    if (e.animationName === 'fade-out') {
      UI.closeModal('.modal-container');
      document.querySelector('.modal-container').classList.remove('fade-out');
    }
  });

// Event: Next page of pagination
document.querySelector('[next-page]').addEventListener('click', () => {
  if (currentPage < Store.getUsersMaxPagination()) {
    currentPage += 1;
    UI.displayPaginationPages(currentPage);
    UI.reDisplayUsers(currentPage);
  }
});

// Event: Previous page of pagination
document.querySelector('[previous-page]').addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage -= 1;
    UI.displayPaginationPages(currentPage);
    UI.reDisplayUsers(currentPage);
  }
});
