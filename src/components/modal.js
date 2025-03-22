// Открытие попапа
export function openPopup(popupElement) {
  popupElement.classList.add("popup_is-opened"); // Добавляем класс для отображения попапа
  document.addEventListener("keydown", closePopupOnEsc); // Добавляем обработчик закрытия по клавише Esc
}

// Закрытие попапа
export function closePopup(popupElement) {
  popupElement.classList.remove("popup_is-opened"); // Убираем класс для скрытия попапа
  document.removeEventListener("keydown", closePopupOnEsc); // Убираем обработчик закрытия по Esc
}

// Закрытие попапа по нажатию клавиши Esc
function closePopupOnEsc(evt) {
  if (evt.key === "Escape") {
    // Проверяем, была ли нажата клавиша Esc
    const popup = document.querySelector(".popup_is-opened"); // Ищем открытый попап
    if (popup) {
      closePopup(popup); // Закрываем попап, если он открыт
    }
  }
}

// Закрытие попапа по нажатию на оверлей
export function closePopupOnOverlay(evt) {
  if (evt.target.classList.contains("popup")) {
    // Проверяем, был ли клик по оверлею
    closePopup(evt.target); // Закрываем попап
  }
}

// Закрытие попапа по нажатию на крестик
export function closePopupOnButtonClick(evt) {
  const popup = evt.target.closest(".popup"); // Ищем ближайший попап
  if (popup) {
    // Проверяем, существует ли попап
    closePopup(popup); // Закрываем попап
  }
}