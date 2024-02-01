import { ChangeEvent, ReactElement, useState, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";

export type ListItemsType = { code: string; name: string };

type ListBtnTypes = {
  text: string;
  openHandler: (e: React.MouseEvent) => void;
};
const ListBtn = ({ text, openHandler }: ListBtnTypes): ReactElement => {
  return (
    <button
      onClick={openHandler}
      type="button"
      className="w-full truncate border-0 outline-none py-2 text-slate-800 rounded-md cursor-pointer text-md bg-slate-100 active:scale-95 transition-transform outline-offset-0 focus:outline-slate-600 duration-100 px-3 flex justify-between items-center"
    >
      <span className="pr-1">{text}</span>
      <FaChevronDown className="text-slate-800" size={12} />
    </button>
  );
};

type ListItemTypes = {
  itemText: string;
  onClick: (e: React.MouseEvent) => void;
};
const ListItem = ({ itemText, onClick }: ListItemTypes): ReactElement => {
  return (
    <li
      className="text-sm py-1 cursor-pointer hover:bg-slate-800 hover:text-white pl-2"
      onClick={onClick}
    >
      {itemText}
    </li>
  );
};

type PropsType = {
  title: string;
  name: string;
  listName: string;
  items: ListItemsType[];
  itemPicker: (item: ListItemsType, name: string) => void;
  customClass?: string;
};
function SearchList({
  title,
  name,
  items,
  listName,
  customClass,
  itemPicker,
}: PropsType): ReactElement {
  const [selected, setSelected] = useState<string>("");
  const [listOpen, setListOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const openHandler = (e: React.MouseEvent) => {
    e.stopPropagation();
    setListOpen((prev) => !prev);
  };
  const changeHandler = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    const closeList = () => {
      setListOpen(false);
    };
    window.addEventListener("click", closeList);
    return () => {
      window.removeEventListener("click", closeList);
    };
  }, []);

  return (
    <div className={`relative ${customClass}`}>
      <span className="text-sm">{title}</span>
      <ListBtn text={listName || selected} openHandler={openHandler} />
      <ul
        className={`absolute overflow-y-auto rounded-md mt-1 w-full bg-slate-100 shadow-md shadow-stone-400 max-h-40 ${
          !listOpen && "scale-y-0"
        } transition-transform origin-top scrollbar z-10`}
      >
        <input
          type="search"
          className="text-sm py-1 bg-slate-200 pl-2 border-0  w-full outline-none"
          placeholder="Search list"
          value={searchTerm}
          onChange={changeHandler}
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
          }}
        />
        {items.map((item) => {
          if (item.name.toLowerCase().includes(searchTerm.toLowerCase())) {
            return (
              <ListItem
                itemText={item.name}
                key={item.code}
                onClick={() => {
                  itemPicker(item, name);
                  setSelected(item.name);
                  setListOpen(false);
                }}
              />
            );
          } else {
            return <></>;
          }
        })}
      </ul>
    </div>
  );
}

export default SearchList;
