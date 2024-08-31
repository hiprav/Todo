export const validemail=(email)=>{
    const reg=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return reg.test(email);
};