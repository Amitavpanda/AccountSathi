import { info } from "@repo/logs/logs";
import { Request, Response, response } from "express";
// import { registerStoreService } from "../service/registerStore.service.js";


export async function registerStoreHandler(req:Request, res : Response) {
    info("req body", req.body);

    // const response = await registerStoreService(req.body);

    return res.send(response);

}



// export async function loginHandler(req:Request, res : Response) {

//     info("req body", req.body);
//     const response = await loginService(req.body);
//     return res.send(response);

// }

// export async function otpVerificationHandler(req:Request, res : Response) {

//     info("req body", req.body);
//     const response = await otpVerificationService(req.body);
//     const {success, accessToken, refreshToken} = response;

//     if(success == "intermediate"){
//         res.cookie("secretToken1", accessToken, {
//             httpOnly : true,
//             secure : process.env.NODE_ENV === "production",
//             maxAge : 15 * 60 * 1000
//         })
//         res.cookie("secretToken2", refreshToken, {
//             httpOnly : true,
//             secure : process.env.NODE_ENV === "production",
//             maxAge : 7 * 24 * 60 * 60 * 1000 
//         })
//         return {success : true, message : "You are logged in successfully" }
//     }
//     return res.send(response);

// }