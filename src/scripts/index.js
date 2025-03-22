// @todo: Темплейт карточки
const cardTemplate = document.querySelector("#card-template").content;

// @todo: DOM узлы
const placesList = document.querySelector(".places__list");

// @todo: Функция создания карточки
function createCard(cardProperties, deleteCardCallback) {
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
  const cardTitle = cardElement.querySelector(".card__title");
  cardTitle.textContent = cardProperties.name;
  const cardImage = cardElement.querySelector(".card__image");
  cardImage.src = cardProperties.link;
  cardImage.alt = cardProperties.name;
  const deleteButton = cardElement.querySelector(".card__delete-button");
  deleteButton.addEventListener("click", () => {
    deleteCardCallback(cardElement);
  });
  return cardElement;
}

// @todo: Функция удаления карточки
function deleteCard(cardElement) {
  cardElement.remove();
}

// @todo: Вывести карточки на страницу
initialCards.forEach((cardProperties) => {
  const newCard = createCard(cardProperties, deleteCard);
  placesList.append(newCard);
});

console.log('Hello, World!');
import './styles/index.css'; // добавьте импорт главного файла стилей 
