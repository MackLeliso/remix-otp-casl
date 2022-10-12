const config = require("./config.server");
const client = require("twilio")(config.ACCOUNTSID, config.AUTHTOKEN, {
  lazyLoading: true,
});

export const phoneVerification = async (phone: any) => {
  try {
    client.verify
      .services(config.SERVICESID)
      .verifications.create({
        to: `+251${+phone}`,
        channel: "sms",
      })
      .then((data: any) => {
        console.log(data);
      });
  } catch (error) {
    console.log(error);
  }
};

export const checkPhoneVerification = async (phone: any, code: number) => {
  try {
    const data = client.verify
      .services(config.SERVICESID)
      .verificationChecks.create({
        to: `+251${+phone}`,
        code: code,
      })
      .then((data: any) => {
        console.log(data);
        return data;
      });
    return data;
  } catch (error) {
    console.log(error);
  }
};
