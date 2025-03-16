import BoardHeader from "../components/board/BoardHeader";
import BoardContent from "../components/board/BoardContent";

function Board() {
  return (
    <div className="flex h-full flex-col">
      <BoardHeader />
      <BoardContent />
    </div>
  );
}

export default Board;
