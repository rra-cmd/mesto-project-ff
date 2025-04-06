// Настройки подключения к галерее когорты на сервере
const myCohortUrl = "https://nomoreparties.co/v1/wff-cohort-35";
const myToken = "4ddb7278-1510-470b-b5b0-43ec98cb0e76";

// Обработка ошибок подключения
function checkStatus(res) {
  if (!res.ok) throw new Error(`Ошибка подключения (код: ${res.status})`);
  return res.json();
}

// Общая "обёртка" для запросов
function apiRequest(endpoint, method = "GET", data = null) {
  const config = {
    method: method,
    headers: {
      authorization: myToken,
    },
  };

  if (data) {
    config.headers["Content-Type"] = "application/json";
    config.body = JSON.stringify(data);
  }

  return fetch(`${myCohortUrl}${endpoint}`, config).then(checkStatus);
}

// === Экспортируемые функции, требующие подключения к серверу

// Загрузка с сервера всех карточек из галереи когорты
export function getCards() {
  return apiRequest("/cards");
}

// Удаление с сервера карточки (только ранее созданной пользователем)
export function apiDeleteCard(cardId) {
  return apiRequest(`/cards/${cardId}`, "DELETE");
}

// Создание новой карточки в галерее когорты на сервере
export function addNewCard(name, link) {
  return apiRequest("/cards", "POST", { name, link });
}

// Поставить лайк карточке на сервере
export function addLike(cardId) {
  return apiRequest(`/cards/likes/${cardId}`, "PUT");
}

// Снять лайк карточке на сервере
export function removeLike(cardId) {
  return apiRequest(`/cards/likes/${cardId}`, "DELETE");
}

// Загрузка пользовательских данных
export function getProfileData() {
  return apiRequest("/users/me");
}

// Изменение данных пользователя (поля "имя" и "род занятий")
export function updateProfile(name, about) {
  return apiRequest("/users/me", "PATCH", { name, about });
}

// Изменение картинки профиля пользователя на сервере
export function updateAvatar(url) {
  return apiRequest("/users/me/avatar", "PATCH", { avatar: url });
}
