// Импорт общего файла, подключающего множество стилей из blocks
import "./pages/index.css";

// Импорт функций для попапов
import {
  openPopup, // открывает попап
  closePopup, // закрывает попап
  closePopupByOverlay, // закрывает при клике вне карточки
  closePopupByCloseButton, // закрывает при клике на крестик
} from "./components/modal.js";

// Импорт функций для управления карточками
import {
  createCard, // создаёт DOM карточки
  removeCard, // удаляет карточку из DOM
  handleLikeUpdate, // обновляет лайки
} from "./components/card.js";

// Импорт методов для взаимодействия с API:
import {
  getProfileData, // получает данные профиля
  updateProfile, // обновляет имя пользователя и род занятий (описание)
  updateAvatar, // - обновляет картинку профиля пользователя
  getCards, // получает список карточек
  addNewCard, // добавляет новую карточку
  apiDeleteCard, // удаляет карточку
  addLike, // ставит лайк на карточку
  removeLike, // снимает лайк
} from "./scripts/api.js";

// Импорт способов проверки форм:
import { enableValidation, clearValidation } from "./scripts/validation.js";

// === Поиск элементов в DOM (се элементы сохраняются в переменные для переиспользования)

// Общий контейнер содержимого страницы
const pageContent = document.querySelector(".content");

// Список отображения карточек
const placesList = pageContent.querySelector(".places__list");

// Профиль пользователя и его свойства
const profile = document.querySelector(".profile");
const profileAvatar = document.querySelector(".profile__image"); // Картинка профиля
const profileTitle = profile.querySelector(".profile__title"); // Имя пользователя
const profileDescription = profile.querySelector(".profile__description"); // Описание

// Попапы
const popups = document.querySelectorAll(".popup"); // Все попапы
const popupImage = document.querySelector(".popup_type_image"); // Открытие увеличенного изображения из карточки
const popupNewCard = document.querySelector(".popup_type_new-card"); // Создание карточки
const popupDeleteCard = document.querySelector(".popup_type_confirm-delete"); // Подтверждение удаления карточки
const popupEdit = document.querySelector(".popup_type_edit"); // Редактирование свойств профиля
const popupAvatar = document.querySelector(".popup_type_avatar"); // Изменение картинки профиля

// Кнопки вызова попапов
const editProfileButton = document.querySelector(".profile__edit-button"); // Кнопка редактирования профиля пользователя
const addCardButton = document.querySelector(".profile__add-button"); // Кнопка добавления новой карточки
const editAvatarButton = document.querySelector(".profile__image-edit"); // Кнопка выбора картинки пользователя
const buttonDeleteCard = popupDeleteCard.querySelector(".popup__button"); // Кнопка подтверждения удаления карточки

// Формы и их поля
const formProfile = document.forms["edit-profile"]; // Форма редактирования профиля пользователя
const inputNameProfile = formProfile["name"]; // Поле имени пользователя
const inputDescriptionProfile = formProfile["description"]; // Поле описания пользователя

const formAvatar = document.forms["update-avatar"]; // Форма смены картинки пользователя
const inputFormLinkAvatar = formAvatar["link"]; // Поле ссылки на картинку пользователя

const formCard = document.forms["new-place"]; // Форма добавления карточки
const inputnameCard = formCard["place-name"]; // Поле названия карточки (локации)
const inputLinkFormNewCard = formCard["link"]; // Поле ссылки на изображение для карточки

// Попап с увеличенной картинкой карточки
const image = document.querySelector(".popup__image"); // Увеличенная картинка
const imageCaption = document.querySelector(".popup__caption"); // Подпись к картинке

// === Проверка полей форм

// Объект с классами и селекторами для проверки
const formValidationConfig = {
  formSelector: ".popup__form", // Селектор форм
  inputSelector: ".popup__input", // Селектор полей ввода
  submitButtonSelector: ".popup__button", // Селектор кнопок сохранения
  inactiveButtonClass: "popup__button_disabled", // Класс неактивной кнопки
  inputErrorClass: "popup__input_type_error", // Класс неверно заполненного поля
  errorClass: "popup__error", // Класс для текста пояснения пользователю под неверно заполненным полем
};

// === Работа галереи

// Хранение ID пользователя
let userId;

// Загрузка начальных данных при открытии страницы
Promise.all([getProfileData(), getCards()]) // Загружаем профиль и карточки, ждем отчета об успехе всех загрузок
  .then(([userData, cardsData]) => {
    // После того, как ВСЕ успешно получено с сервера
    userId = userData._id; // Сохраняем ID пользователя

    // Заполняем данные профиля
    profileTitle.textContent = userData.name; // Имя
    profileDescription.textContent = userData.about; // О пользователе
    profileAvatar.style.backgroundImage = `url(${userData.avatar})`; // Картинка пользователя

    // Формируем каждую карточку из ее элементов, расставляем все карточки по порядку
    cardsData.forEach((card) => {
      // Создаём DOM-элемент карточки
      const cardElement = createCard(
        card, // Данные карточки
        userId, // ID пользователя
        openImagePopup, // Функция просмотра картинки в большом размере
        handleLike, // Функция лайка
        handleDeleteCard // Функция удаления
      );
      placesList.append(cardElement); // Добавляем карточку в список
    });
  })
  .catch((err) => console.error("Ошибка: ", err)); // Обработка ошибок

// Обработчик формы редактирования профиля
function submitProfileForm(evt) {
  evt.preventDefault(); // Сбрасываем поведение по умолчанию
  toggleSaveButtonState(true, evt.submitter); // Меняем текст кнопки

  updateProfile(inputNameProfile.value, inputDescriptionProfile.value) // Отправляем данные
    .then((updatedUser) => {
      // При успешном ответе:
      profileTitle.textContent = updatedUser.name; // Обновляем имя
      profileDescription.textContent = updatedUser.about; // Обновляем описание пользователя
      closePopup(popupEdit); // Закрываем попап
      clearValidation(formProfile, formValidationConfig); // Сбрасываем проверку
    })
    .catch(console.error) // Обработка ошибок
    .finally(() => toggleSaveButtonState(false, evt.submitter)); // Восстанавливаем кнопку
}

// Открытие попапа с увеличенным изображением
function openImagePopup(imageSrc, imageAlt) {
  image.src = imageSrc; // Указываем адрес картинки
  image.alt = imageAlt; // Добавляем подпись
  imageCaption.textContent = imageAlt;
  openPopup(popupImage); // Открываем попап
}

// Изменение текста кнопки сохранения
function toggleSaveButtonState(isLoading, button) {
  button.textContent = isLoading ? "Сохранение..." : "Сохранить"; // Текст кнопки сохранания после подтверждения пользователем и до этого
}

// Изменение текста кнопки удаления
function toggleDeleteButtonState(isLoading, button) {
  button.textContent = isLoading ? "Удаление..." : "Да"; // Текст кнопки удаления после подтверждения пользователем и до этого
}

// === Манипуляции с карточками

// FIXME: v6 Переработаны попапы добавления карточки и смены картинки пользователя

// Открытие попапа добавления карточки
addCardButton.addEventListener("click", () => {
  formCard.reset(); // Очистка полей формы
  clearValidation(formCard, formValidationConfig); // Очистка ошибок
  openPopup(popupNewCard);
});

// Открытие попапа изменения аватара
editAvatarButton.addEventListener("click", () => {
  formAvatar.reset(); // Очистка полей формы
  clearValidation(formAvatar, formValidationConfig); // Очистка ошибок
  openPopup(popupAvatar);
});

// Закрытие попапов кликом на фон или крестик
popups.forEach((popup) => popup.addEventListener("mousedown", closePopupByOverlay));
document.querySelectorAll(".popup__close").forEach((btn) => btn.addEventListener("click", closePopupByCloseButton));

// Подключение обработчиков отправки форм
formProfile.addEventListener("submit", submitProfileForm);
formCard.addEventListener("submit", submitNewCardForm);
formAvatar.addEventListener("submit", submitAvatarForm);

// Включение проверки для форм
enableValidation(formValidationConfig);

// Обработчик формы создания новой карточки
function submitNewCardForm(evt) {
  evt.preventDefault();
  toggleSaveButtonState(true, evt.submitter);

  addNewCard(inputnameCard.value, inputLinkFormNewCard.value) // Создаём карточку
    .then((newCard) => {
      const cardElement = createCard(
        // Создаём DOM-элемент
        newCard,
        userId,
        openImagePopup,
        handleLike,
        handleDeleteCard
      );
      placesList.prepend(cardElement); // Добавляем в начало списка
      formCard.reset(); // Очищаем форму
      closePopup(popupNewCard); // Закрываем попап
      clearValidation(formCard, formValidationConfig); // Сбрасываем проверку
    })
    .catch(console.error)
    .finally(() => toggleSaveButtonState(false, evt.submitter));
}

// Обработчик удаления карточки
let currentDeleteHandler = null; // Глобальная переменная для хранения обработчика

function handleDeleteCard(cardElement, cardId) {
  openPopup(popupDeleteCard); // Показываем запрос на подтверждение
  toggleDeleteButtonState(false, buttonDeleteCard); // Сбрасываем текст кнопки на "Да"

  // Если уже есть привязанный обработчик, убираем его
  if (currentDeleteHandler) {
    buttonDeleteCard.removeEventListener("click", currentDeleteHandler);
  }

  // Создаём новый обработчик
  currentDeleteHandler = () => {
    toggleDeleteButtonState(true, buttonDeleteCard); // Меняем текст кнопки на тот, который должен быть, если пользователь подтвердил удаление

    apiDeleteCard(cardId)
      .then(() => {
        removeCard(cardElement); // Удаляем карточку из DOM
        closePopup(popupDeleteCard); // Закрываем попап
      })
      .catch(console.error)
      .finally(() => {
        buttonDeleteCard.removeEventListener("click", currentDeleteHandler); // Убираем обработчик
        currentDeleteHandler = null; // Сбрасываем переменную
      });
  };

  buttonDeleteCard.addEventListener("click", currentDeleteHandler);
}

// Обработчик лайков
function handleLike(evt, likeCounter, cardId) {
  const isActive = evt.target.classList.contains("card__like-button_is-active"); // Проверяем лайк
  const likeMethod = isActive ? removeLike : addLike; // Определяем, что сделать (поставить или убрать лайк)

  likeMethod(cardId) // Отправляем запрос
    .then((updatedCard) => {
      handleLikeUpdate(evt, likeCounter, updatedCard); // Обновляем
    })
    .catch(console.error);
}

// Открытие попапа редактирования профиля
editProfileButton.addEventListener("click", () => {
  // Заполняем поля текущими данными
  inputNameProfile.value = profileTitle.textContent;
  inputDescriptionProfile.value = profileDescription.textContent;

  // FIXME: v6 Добавлен сброс проверки полей
  clearValidation(formProfile, formValidationConfig); // Очистка ошибок валидации

  openPopup(popupEdit);
});

// Обработчик формы смены картинки пользователя
function submitAvatarForm(evt) {
  evt.preventDefault();
  toggleSaveButtonState(true, evt.submitter);

  updateAvatar(inputFormLinkAvatar.value) // Отправляем новую картинку
    .then((updatedUser) => {
      profileAvatar.style.backgroundImage = `url(${updatedUser.avatar})`; // Обновляем картинку
      formAvatar.reset(); // Очищаем форму
      closePopup(popupAvatar); // Закрываем попап
      clearValidation(formAvatar, formValidationConfig); // Сбрасываем проверку
    })
    .catch(console.error)
    .finally(() => toggleSaveButtonState(false, evt.submitter));
}
