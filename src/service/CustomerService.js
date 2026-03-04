import customer from './index'


export const getAllMenuItemApi = async () => {
    const res = await customer().get(`/customers/menu`);
    return res.data;
}

export const registerCustomerApi = async (payload) => {
    const res = await customer().post(`/customers/register`, payload);
    return res.data;
}

export const loginCustomerApi = async (payload) => {
    const res = await customer().post(`/customers/login`, payload);
    return res.data;
}

export const getCustomerOrderSummariesApi = async (customerId) => {
    const res = await customer().get(`/customers/${customerId}/orders/summary`);
    return res.data;
}
