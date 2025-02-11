
// import { Prisma, PrismaClient, Role } from "@repo/db/client";
// import bcrypt from "bcrypt";
// import { error } from "@repo/logs/logs";
// import twilio from "twilio"
// import { OtpVerificationSchema } from "@repo/validations/userSchema";
// const prisma = new PrismaClient();
// import crypto from "crypto"
// import jwt from "jsonwebtoken";
// import { RegisterStoreSchema } from "@repo/validations/registerStoreSchema";

// function generatePassword() {
//     return crypto.randomUUID();
// }

// export async function registerStoreService(input: RegisterStoreSchema) {
//     const { storeName, address, phoneNumber  } = input.body;

//     const existingStore = await prisma.store.findFirst({
//         where : {
//             storeName,
//             address,
//             superAdmin : {phoneNumber}},
//     })

//     if(existingStore) {
//         return { success: false, isExistingStore : true, error : "SuperAdmin and Store Already exists" };

//     }


//     try {
//         const store = await prisma.store.create({
//             data: {
//                 storeName : storeName,
//                 address : address,
//                 superAdmin : {
//                     create : {
//                         phoneNumber,
//                         role : Role.SUPERADMIN,
//                         isApproved : true 
//                     }
//                 }

//             }
//         })

//         return { success: true, message : "Store and SuperAdmin created successfully"};
//     }

//     catch (err: any) {
//         error("Error in creating store", err);

//         return { success: false, error: "Error in registering the store" }
//     }

// }


// export async function loginService(input: User) {
//     const { loginId, password } = input;

//     const user = await prisma.user.findUnique({
//         where: {
//             loginId: loginId
//         }
//     })
//     if (!user) {
//         return { success: false, error: "login id is not correct or user does not exists" }
//     }



//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//         return { success: false, error: "Invalid Password" }
//     }

//     const otp = Math.floor(100000 + Math.random() * 900000).toString();

//     const accountSid = process.env.TWILIO_ACCOUNT_SID;
//     console.log("account SID", accountSid);
//     const authToken = process.env.TWILIO_AUTH_TOKEN;
//     const serviceId = process.env.TWILIO_SERVICE_ID;
//     let smsKey = process.env.SMS_SECRET_KEY;

//     console.log("auth token", authToken);
//     const client = twilio(accountSid, authToken);
//     let phoneNumber = "";
//     if (user) {
//         phoneNumber = user.phoneNumber;
//     }

//     async function createVerification() {

//         if (!serviceId) {
//             throw new Error("TWILIO_SERVICE_ID is not set");
//         }

//         const ttl = 5 * 60 * 1000;
//         const expiresIn = Date.now() + ttl;
//         try {
//             const verification = await client.verify.v2
//                 .services(serviceId)
//                 .verifications.create({
//                     channel: "sms",
//                     to: `+91${phoneNumber}`,
//                 })

//                 const data = `${phoneNumber}.${expiresIn}`
//                 let hash = ''; 
//                 if(smsKey !== undefined){
//                     hash = crypto.createHmac('sha256', smsKey).update(data).digest('hex')

//                 }
//                 const fullHash = `${hash}.${expiresIn}`

//             return {success : true, verificationStatus :verification, hash : fullHash, phoneNumber : phoneNumber}
//         }
//         catch (err) {
//             return { success: false, error: err }
//         }

//     }
 
//     const result = await createVerification();
//     return result

// }


// export async function otpVerificationService(input:OtpVerificationSchema) {
//     const {otp, phoneNumber, fullHash, loginId} = input.body;

//     const accessTokenSecret = process.env.JWT_ACCESS_TOKEN;
//     const refreshTokeSecret = process.env.JWT_REFRESH_TOKEN;
//     const accountSid = process.env.TWILIO_ACCOUNT_SID;
//     const authToken = process.env.TWILIO_AUTH_TOKEN;
//     const serviceId = process.env.TWILIO_SERVICE_ID;
//     const client = twilio(accountSid, authToken);

//      const expire = fullHash.split('.')[1];
//      console.log("expire", expire)
//     let now = Date.now()

//     if(expire){
//         if(now > parseInt(expire)){
//             return {success : false, message : "OTP is expired, Please try sending the OTP again"};
//         }

//     }

//     async function createVerificationCheck() {
//         if (!serviceId) {
//             throw new Error("TWILIO_SERVICE_ID is not set");
//         }

//         const verificationCheck = await client.verify.v2
//           .services(serviceId)
//           .verificationChecks.create({
//             code: otp,
//             to: phoneNumber,
//           });
      
//         console.log(verificationCheck.status);

//           return verificationCheck.status
//       }

//         const result =  await createVerificationCheck();
//         let accessToken = "";
//         let refreshToken = "";
//         if(result === "approved"){
//             if(accessTokenSecret !==undefined){
//                 accessToken = jwt.sign({userId : loginId} ,  accessTokenSecret, {expiresIn : '15min'} );
//             }
//             if(refreshTokeSecret !==undefined){
//                 refreshToken = jwt.sign({userId : loginId}, refreshTokeSecret, {expiresIn : '7d'});
//             }


//             await prisma.user.update({
//                 where : {loginId : loginId},
//                 data : {otp : null, refreshToken}
//             })

//             return {success : "intermediate", accessToken, refreshToken}

//         }
//         else {
//             return {success : false, message : "you have entered the incorrect otp"}
//         }

// }


