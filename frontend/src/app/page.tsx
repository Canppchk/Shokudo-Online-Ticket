import { getAllMenus } from "./api";
import MenuList from "./components/MenuList";

export default async function Home() {
    //TODO:temporarily use json-server (npm run json-server)
    const menus = await getAllMenus();
    console.log(menus)

    return (
        <div>
            <h1 className="text-4xl font-bold m-5">🍚Shokudo System🍚</h1>
            <div className="flex flex-col items-center"> 
                <div className="grid grid-cols-12 gap-4 w-full">
                    <div className="col-span-8">
                        <MenuList menus={menus}/>
                    </div>
                    <div className="col-span-4">
                        <div className="m-5 p-5 rounded bg-white shadow-md flex flex-wrap">
                            カートを表示
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
