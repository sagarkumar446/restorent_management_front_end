import customer from './index'


export const getAllMenuItemApi = async () => {
    const res = await customer().get(`/menu-items`);
    return res.data;
}
