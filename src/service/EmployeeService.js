import employee from "./index"


export const addMenuItemAPi = async (queryData) => {
    return employee().post(`/menu-items?itemName=${queryData.itemName}&description=${queryData.description}&price=${queryData.price}&category=${queryData.category}&veg=${queryData.isveg}&image`, queryData.image);
}