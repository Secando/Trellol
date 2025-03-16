import { api } from "./auth";

export const getBoards = async () => {
  const response = await api.get("/api/boards");
  return response.data;
};

export const createBoard = async (data) => {
  const response = await api.post("/api/boards", data);
  return response.data;
};

export const getBoard = async (id) => {
  const response = await api.get(`/api/boards/${id}`);
  return response.data;
};

export const updateBoard = async ({ id, ...data }) => {
  const response = await api.put(`/api/boards/${id}`, data);
  return response.data;
};

export const getLists = async (boardId) => {
  const response = await api.get(`/api/boards/${boardId}/lists`);
  return response.data;
};

export const createList = async ({ boardId, data }) => {
  const response = await api.post(`/api/boards/${boardId}/lists`, data);
  return response.data;
};

export const deleteList = async ({ boardId, listId }) => {
  const response = await api.delete(`/api/boards/${boardId}/lists/${listId}`);
  return response.data;
};

export const updateListOrder = async ({ boardId, lists }) => {
  //  lists: {sourceIndex: 1, destinationIndex: 0}
  const response = await api.put(`/api/boards/${boardId}/lists/reorder`, {
    lists,
  });
  return response.data;
};

export const createCard = async ({ boardId, listId, data }) => {
  const response = await api.post(
    `/api/boards/${boardId}/lists/${listId}/cards`,
    data,
  );
  return response.data;
};

export const updateCardOrder = async ({ boardId, source, destination }) => {
  const response = await api.put(`/api/boards/${boardId}/cards/reorder`, {
    source,
    destination,
  });
  return response.data;
};

export const deleteCard = async ({ boardId, listId, cardId }) => {
  const response = await api.delete(
    `/api/boards/${boardId}/lists/${listId}/cards/${cardId}`,
  );
  return response.data;
};

export const updateCard = async ({ boardId, listId, cardId, data }) => {
  const response = await api.put(
    `/api/boards/${boardId}/lists/${listId}/cards/${cardId}`,
    data,
  );
  return response.data;
};

export const getAllBoards = async () => {
  const response = await api.get("/api/boards");
  return response.data;
};

export const deleteBoard = async (id) => {
  const response = await api.delete(`/api/boards/${id}`);
  return response.data;
};
