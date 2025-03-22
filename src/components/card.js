// Извлечение шаблона карточки из HTML
const cardTemplate = document.querySelector('#card-template').content;

// Создание карточки
export function createCard(cardData, onDeleteCard, onToggleLike, onImageClick) {
    // Копируем шаблон карточки
    const cardElement = cardTemplate.querySelector('.card').cloneNode(true);

    // Устанавливаем свойства карточки: название (локации) и картинку
    const cardTitle = cardElement.querySelector('.card__title');
    cardTitle.textContent = cardData.name; // Устанавливаем название карточки
    
    const cardImage = cardElement.querySelector('.card__image');
    cardImage.src = cardData.link; // Устанавливаем ссылку на картинку
    cardImage.alt = cardData.name; // Устанавливаем описание (подпись) картинки

    // Находим кнопки и вешаем на них обработчики событий
        // Кнопка удаления карточки и обработчик для неё
        const deleteButton = cardElement.querySelector('.card__delete-button');
        deleteButton.addEventListener('click', () => onDeleteCard(cardElement));
    
        // Обработчик для кнопки лайка
        const likeButton = cardElement.querySelector('.card__like-button');
        likeButton.addEventListener('click', () => onToggleLike(likeButton));
        
        // Обработчик нажатия на картинку
        cardImage.addEventListener('click', () => onImageClick(cardData.link, cardData.name));

        // Возвращаем созданную карточку
        return cardElement;
    }
    
// Удаление карточки
export function deleteCard(cardElement) {
    cardElement.remove(); // Удаляем карточку из DOM
}

// Переключение состояния лайка
export function toggleLike(likeButtonElement) {
    likeButtonElement.classList.toggle('card__like-button_is-active'); // Переключаем класс состояния лайка
}