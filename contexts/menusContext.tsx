import React, { createContext, useContext, useState } from "react";
import { supabase } from "@/libs/supabase";
import { Tables } from "@/types/supabase";

type MenusContext = {
  menus: Tables<"menus">[];
  menu: Tables<"menus"> | null;
};

const MenusContext = createContext<MenusContext>({
  menus: [],
  menu: null,
});

type MenusDispatch = {
  getMenus: () => Promise<Tables<"menus">[]>;
  getMenuById: (id: Tables<"menus">["id"]) => Promise<Tables<"menus">>;
  deleteMenus: (menuId: Tables<"menus">["id"]) => Promise<void>;
  postMenus: (
    name: Tables<"menus">["name"],
    memo: Tables<"menus">["memo"]
  ) => Promise<Tables<"menus">[]>;
};

const MenusDispatchContext = createContext<MenusDispatch>({
  getMenus: () => {
    throw Error("no default value");
  },
  getMenuById: () => {
    throw Error("no default value");
  },
  deleteMenus: () => {
    throw Error("no default value");
  },
  postMenus: () => {
    throw Error("no default value");
  },
});

type Props = {
  children: React.ReactNode;
};

export function MenusProvider({ children }: Props) {
  const [menus, setMenus] = useState<Tables<"menus">[]>([]);
  const [menu, setMenu] = useState<Tables<"menus"> | null>(null);

  async function getMenus() {
    const { data, error } = await supabase.from("menus").select("*");
    if (error) throw error;
    setMenus(data);
    return data;
  }

  async function getMenuById(id: Tables<"menus">["id"]) {
    const { data, error } = await supabase
      .from("menus")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    setMenu(data);
    return data;
  }

  async function deleteMenus(menuId: Tables<"menus">["id"]) {
    const { error } = await supabase.rpc("delete_menu", {
      menuid: menuId,
    });
    if (error) throw error;
  }

  async function postMenus(
    name: Tables<"menus">["name"],
    memo: Tables<"menus">["memo"]
  ) {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (!userId) {
      throw new Error("User is not authenticated");
    }
    const { data, error } = await supabase
      .from("menus")
      .insert([{ name, memo, user_id: userId }])
      .select();
    if (error) throw error;
    return data;
  }

  return (
    <MenusContext.Provider value={{ menus, menu }}>
      <MenusDispatchContext.Provider
        value={{
          getMenus,
          getMenuById,
          deleteMenus,
          postMenus,
        }}
      >
        {children}
      </MenusDispatchContext.Provider>
    </MenusContext.Provider>
  );
}

export function useMenus() {
  return useContext(MenusContext);
}

export function useMenusDispatch() {
  return useContext(MenusDispatchContext);
}
