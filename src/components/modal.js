// Открытие попапа
export function openPopup(element) {
  element.classList.add("popup_is-opened");
  document.addEventListener("keydown", handleEscapePress);
}

// Закрытие попапа
export function closePopup(element) {
  element.classList.remove("popup_is-opened");
  document.removeEventListener("keydown", handleEscapePress);
}

// Закрытие попапа при нажатии кнопки Escape
function handleEscapePress(evt) {
  if (evt.key === "Escape") {
    const popup = document.querySelector(".popup_is-opened");
    if (popup) closePopup(popup);
  }
}

// Закрытие попапа при клике вне карточки или крестика
export function closePopupByOverlay(evt) {
  if (evt.target.classList.contains("popup")) {
    closePopup(evt.target);
  }
}

// Закрытие попапа при клике на крестик
export function closePopupByCloseButton(evt) {
  const popup = evt.target.closest(".popup");
  closePopup(popup);
}
