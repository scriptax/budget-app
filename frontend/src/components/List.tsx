import { ReactElement } from "react";
import { FaChevronDown } from "react-icons/fa";

type ListBtnTypes = {
  text: string;
};
const ListBtn = ({ text }: ListBtnTypes): ReactElement => {
  return (
    <button className="border-0 outline-none w-40 py-2 text-white rounded-md cursor-pointer text-md bg-slate-800 active:translate-y-1 transition-transform duration-100 flex justify-around items-center">
      <span className="pr-1">{text}</span>
      <FaChevronDown color="white" size={12} />
    </button>
  );
};

type ListItemTypes = {
  itemText: string;
};
const ListItem = ({ itemText }: ListItemTypes): ReactElement => {
  return (
    <option className="bg-slate-200 text-black text-sm py-1 cursor-pointer hover:bg-slate-800 hover:text-white pl-2">
      {itemText}
    </option>
  );
};

type PropsType = {
  listName: string;
  items: string[];
};
function List({ items, listName }: PropsType): ReactElement {
  return (
    <label className="m-10">
      {/* <ListBtn text={listName} /> */}
      <select
        className={`border-0 outline-none w-40 px-2 pr-10 py-2 text-white rounded-md cursor-pointer text-md bg-slate-800 active:translate-y-1 transition-transform duration-100 flex justify-around items-center`}
      >
        {items.map((item, index) => (
          <ListItem itemText={item} key={index} />
        ))}
      </select>
    </label>
  );
}

export default List;
