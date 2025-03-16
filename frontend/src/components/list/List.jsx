import { Droppable, Draggable } from "react-beautiful-dnd";
import Card from "../card/Card";

function List({
  id,
  title,
  cards = [],
  boardId,
  onOpenCreateCardModal,
  onOpenDeleteModal,
}) {
  id = String(id);
  return (
    <div className="min-w-72 rounded-lg bg-gray-100 p-2">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-semibold">{title}</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenDeleteModal(id)}
            className="text-gray-500 hover:text-red-500"
          >
            ✕
          </button>
        </div>
      </div>
      <Droppable
        droppableId={id}
        type="card"
        direction="vertical"
        isDropDisabled={false}
        isCombineEnabled={false}
        ignoreContainerClipping={false}
      >
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`min-h-[30px] space-y-2 rounded-lg p-2 ${
              snapshot.isDraggingOver ? "bg-gray-200" : ""
            }`}
          >
            {cards.map((card, index) => (
              <Draggable
                key={card.id.toString()}
                draggableId={card.id.toString()}
                index={index}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`${snapshot.isDragging ? "shadow-lg" : ""}`}
                  >
                    <Card
                      {...card}
                      listId={id}
                      cardId={card.id}
                      boardId={boardId}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <button
        onClick={() => onOpenCreateCardModal(id)}
        className="mt-2 w-full rounded px-2 py-1 text-left text-gray-600 hover:bg-gray-200"
      >
        + Добавить карточку
      </button>
    </div>
  );
}

export default List;
