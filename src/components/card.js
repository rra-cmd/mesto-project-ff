// Получаем содержимое шаблона карточки из DOM (шаблон уже встроен в HTML)
const templateCard = document.querySelector("#card-template").content;

// Проверяем, ставил ли текущий пользователь лайк карточке
function isCardLiked(cardData, userId) {
  return cardData.likes?.some((like) => like._id === userId) ?? false;
}

// Согласно ответу с сервера устанавливаем состояние лайка  (нажимабельность кнопки лайка) и выставляем счетчик (берем из полученных данных)
export function handleLikeUpdate(evt, likeCounter, res) {
  evt.target.classList.toggle("card__like-button_is-active");
  likeCounter.textContent = res.likes.length;
}

// Создание DOM карточки из шаблона, заполнение элементами (картинка, название, сердечко, счетчик лайков, мусорка только для своих карточек)
export function createCard(cardData, userId, openImagePopup, onLike, onDelete) {
  const card = templateCard.querySelector(".card").cloneNode(true);
  card.dataset.cardId = cardData._id;
  const cardImage = card.querySelector(".card__image");
  cardImage.alt = cardData.name;
  cardImage.src = cardData.link;
  const cardTitle = card.querySelector(".card__title");
  cardTitle.textContent = cardData.name;
  const deleteButton = card.querySelector(".card__delete-button");
  const likeButton = card.querySelector(".card__like-button");
  const likeCounter = card.querySelector(".card__like-count");
  likeCounter.textContent = cardData.likes?.length ?? 0;

  // Устанавливаем значение счетчика лайков (0 если нет данных)
  if (isCardLiked(cardData, userId)) {
    likeButton.classList.add("card__like-button_is-active");
  }

  // Открытие попапа с картинкой при клике на нее
  cardImage.addEventListener("click", () => openImagePopup(cardData.link, cardData.name));

  // Обработка лайка: передаём нажатие на сердечко, счётчик и ID карточки
  likeButton.addEventListener("click", (evt) => onLike(evt, likeCounter, cardData._id));

  // Удаление карточки. Проверяем: если карточку создал пользователь,  добавляем обработчик удаления, иначе удаляем кнопку из DOM
  if (cardData.owner && userId === cardData.owner._id) {
    deleteButton.addEventListener("click", () => onDelete(card, cardData._id));
  } else {
    deleteButton.remove();
  }

  return card;
}
export function removeCard(element) {
  element.remove();
}
