import { db } from "./db.server";

export async function loginOtp(phone: string) {
  try {
    const user = await db.user.findUnique({
      where: {
        phone,
      },
    });

    console.log(user);

    if (user) {
      let generateOtp;
      // if generated otp exist in table regenerate new otp again
      while (true) {
        generateOtp = generateOtpNumber();
        console.log("OTP", generateOtp);
        const checkOtpExist = await db.otp.findUnique({
          where: { otpNumber: generateOtp },
        });
        if (checkOtpExist == null) {
          break;
        } else {
          continue;
        }
      }

      // if phone was not submit previous otp, regenerate new otp again
      // if phone is not available in otp table generate new otp
      const otp = await db.otp.upsert({
        where: {
          phone,
        },
        update: {
          otpNumber: generateOtp,
        },
        create: {
          phone,
          otpNumber: generateOtp,
        },
      });

      // OTP sending API will Implemente here
      if (otp) return { status: 200, message: "otp-sent" };
    } else {
      return {
        status: 404,
        message: "Phone number not registered",
        phone,
      };
    }
  } catch (error: any) {
    console.log(error);
    return { status: 500, message: "Internal server error" };
  }
}

export async function RegistrationOtp(phone: string) {
  try {
    const user = await db.user.findUnique({
      where: {
        phone,
      },
    });
    if (!user) {
      let generateOtp;
      // if generated otp exist in table regenerate new otp again
      while (true) {
        generateOtp = generateOtpNumber();
        console.log("OTP", generateOtp);
        const checkOtpExist = await db.otp.findUnique({
          where: { otpNumber: generateOtp },
        });
        if (checkOtpExist == null) {
          break;
        } else {
          continue;
        }
      }

      // if phone was not submit previous otp, regenerate new otp again
      // if phone is not available in otp table generate new otp

      const otp = await db.otp.upsert({
        where: {
          phone,
        },
        update: {
          otpNumber: generateOtp,
        },
        create: {
          phone,
          otpNumber: generateOtp,
        },
      });

      // OTP sending API will Implemente here
      if (otp) return { status: 200, message: "otp-sent" };
    } else {
      return {
        status: 404,
        message: "Phone number already registered",
        phone,
      };
    }
  } catch (error: any) {
    console.log(error);
    return { status: 500, message: "Internal server error" };
  }
}

export async function verifyOtp(otpNumber: string) {
  try {
    return await db.$transaction(async (tx) => {
      const getotp = await tx.otp.findUnique({
        where: {
          otpNumber,
        },
      });
      if (!getotp) return { message: "Invalid OTP Number" };
      const checkIfOtpExpired = addMinutes(1, getotp?.updatedAt) < new Date();
      // const checkIfOtpExpired = addHours(5, getotp?.updatedAt) > new Date());
      if (checkIfOtpExpired) return { message: "OTP expired" };
      const user = await tx.user.findUnique({
        where: { phone: getotp.phone },
      });
      await tx.otp.delete({ where: { otpNumber } });
      return { status: 200, message: "Approved", data: user };
    });
  } catch (error: unknown) {
    return { status: 500, message: "Internal server error" };
  }
}

export function generateOtpNumber(): string {
  return Math.floor(10000 + Math.random() * 90000).toString();
}

function addMinutes(numOfMin: number, date = new Date()) {
  date.setMinutes(date.getMinutes() + numOfMin);
  return date;
}
// function addHours(numOfHours: number, date = new Date()) {
//   date.setTime(date.getTime() + numOfHours * 60 * 60 * 1000);
//   return date;
// }
