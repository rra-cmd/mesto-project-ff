// Импорт стилей и модулей (убрать ссылки из HTML)
import "./pages/index.css";
import { cardsData } from "./components/cards.js";
import { openPopup, closePopup, closePopupOnOverlay, closePopupOnButtonClick } from "./components/modal.js";
import { createCard, deleteCard, toggleLike } from "./components/card.js";

// Заносим в неизменяемые переменные все DOM-элементы страницы
const contentContainer = document.querySelector(".content");
const placesList = contentContainer.querySelector(".places__list");
// Попапы
const popupElements = document.querySelectorAll(".popup");
const editProfilePopup = document.querySelector(".popup_type_edit");
const addCardPopup = document.querySelector(".popup_type_new-card");
const imagePopup = document.querySelector(".popup_type_image");
const popupImageElement = document.querySelector(".popup__image");
const popupImageCaption = document.querySelector(".popup__caption");
// Карточки и их свойства
const addCardButton = document.querySelector(".profile__add-button");
const addCardForm = document.forms["new-place"];
const cardNameInput = addCardForm["place-name"];
const cardImageUrlInput = addCardForm["link"];
const closeButtons = document.querySelectorAll(".popup__close");
// Профиль путешественника и его свойства
const profileElement = document.querySelector(".profile");
const editProfileButton = document.querySelector(".profile__edit-button");
const editProfileForm = document.forms["edit-profile"];
const profileName = profileElement.querySelector(".profile__title");
const profileNameInput = editProfileForm["name"];
const profileJob = profileElement.querySelector(".profile__description");
const profileJobInput = editProfileForm["description"];

// Выводим исходный набор карточек при загрузке (обновлении) страницы
cardsData.forEach((cardData) => {
  // Выполняем обход всех элементов поочередно, передеаем каждый в колбек
  const cardElement = createCard(cardData, deleteCard, toggleLike, openImagePopup); // создаем  DOM-элемент карточки
  placesList.append(cardElement);
});

// Редактирование профиля путешественника
  // Функция редактирования профиля
  editProfileButton.addEventListener("click", () => {
    profileNameInput.value = profileName.textContent; // Заполняем форму текущими данными
    profileJobInput.value = profileJob.textContent;
    openPopup(editProfilePopup); // Открываем попап
  });

  // Прикрепляем обработчик к форме: он будет следить за событием “submit” - «отправка»
  editProfileForm.addEventListener("submit", editProfile); 

  // Обработчик нажатия на кнопку редактирования профиля
  function editProfile(evt) {
    evt.preventDefault(); // Эта строчка отменяет стандартную отправку формы
    profileName.textContent = profileNameInput.value; // Получите значение полей jobInput и nameInput из свойства value
    profileJob.textContent = profileJobInput.value; 
    editProfileForm.reset(); // Очищаем форму
    closePopup(editProfilePopup); // Закрываем попап
  };

// Открытие картинки в большом размере
function openImagePopup(imageSrc, imageAlt) {
  popupImageElement.src = imageSrc; // Указываем источник картинки
  popupImageElement.alt = imageAlt; // Указываем описание картинки
  popupImageCaption.textContent = imageAlt; // Название картинки (региона)
  openPopup(imagePopup); // Открываем попап
}

// Обработчик открытия попапа для добавления карточки
addCardButton.addEventListener("click", () => openPopup(addCardPopup));

// Добавление новой карточки
const addNewCard = (evt) => {
    // Отключаем стандартное поведение формы
    evt.preventDefault(); 
    // Создаем объект для новой карточки
    const newCard = {
      name: cardNameInput.value, // Название карточки
      link: cardImageUrlInput.value, // Ссылка на изображение
    };
    // Создаем DOM-элемент карточки
    const cardElement = createCard(newCard, deleteCard, toggleLike, openImagePopup);
    // Добавляем карточку в начало списка
    placesList.prepend(cardElement);
    // Очищаем поля формы
    addCardForm.reset();
    // Закрываем попап
    closePopup(addCardPopup);
};
// Обработчик отправки формы добавления карточки
addCardForm.addEventListener("submit", addNewCard);

// Закрываем попап разными способами
    // Закрыть при нажатии на оверлей
    popupElements.forEach((popup) => {
      popup.addEventListener("mousedown", closePopupOnOverlay); 
    });
    // Закрыть при нажатии на крестик
    closeButtons.forEach((button) => {
      button.addEventListener("click", closePopupOnButtonClick); 
    });