import singUp from './index'

export const sendOtpApi = async (queryData) => {
     console.log("Query Data in API:", queryData); // Debug log to check the query data
     const res = singUp().post(`/otp/send?to=${queryData}`);
     return res;


}
export const veryfyOtpApi = async (data) => {
     const res = singUp().post(`/otp/verify?otpValue=${data}`);
     return res;

}