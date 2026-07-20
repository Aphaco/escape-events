import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_MAIL_API_KEY);

const RECIPIENT_EMAILS = [
  "escapeeventsgh@gmail.com",
  "collinsafako@gmail.com",
];

const FROM_EMAIL =
  "Escape Events <consultation@mail.escapeeventsgh.com>";

const LOGO_URL = "https://escapeeventsgh.com/logo.png";
const WEBSITE_URL = "https://escapeeventsgh.com";

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function value(data, key, fallback = "Not provided") {
  const item = data[key];

  return item === undefined ||
    item === null ||
    String(item).trim() === ""
    ? fallback
    : escapeHtml(item);
}

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: {
        Allow: "POST",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        success: false,
        message: "Method not allowed.",
      }),
    };
  }

  try {
    if (!process.env.RESEND_MAIL_API_KEY) {
      throw new Error(
        "RESEND_MAIL_API_KEY is not configured."
      );
    }

    const data = JSON.parse(event.body || "{}");

    const fullName = value(data, "Full Name");
    const customerEmail = value(data, "Email Address");
    const phoneNumber = value(data, "Phone Number");

    const consultationDate = value(
      data,
      "Preferred Consultation Date"
    );

    const consultationTime = value(
      data,
      "Preferred Consultation Time"
    );

    const eventType = value(data, "Event Type");
    const eventDate = value(data, "Event Date");
    const eventLocation = value(data, "Event Location");
    const budgetRange = value(data, "Budget Range");
    const customBudget = value(data, "Custom Budget");
    const eventVision = value(data, "Event Vision");

    const services = value(
      data,
      "Services Interested In"
    );

    const referralSource = value(
      data,
      "Referral Source"
    );

    const replyTo =
      data["Email Address"] &&
      String(data["Email Address"]).includes("@")
        ? String(data["Email Address"]).trim()
        : undefined;

    const replyLink = replyTo
      ? `mailto:${encodeURIComponent(
          replyTo
        )}?subject=${encodeURIComponent(
          `Re: Your Escape Events consultation request`
        )}`
      : WEBSITE_URL;

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: RECIPIENT_EMAILS,
      replyTo,
      subject: `New consultation request from ${fullName}`,

      html: `
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />
            <title>New Consultation Request</title>
          </head>

          <body
            style="
              margin:0;
              padding:0;
              background:#f4f0f3;
              font-family:Arial, Helvetica, sans-serif;
              color:#211a20;
            "
          >
            <table
              role="presentation"
              width="100%"
              cellspacing="0"
              cellpadding="0"
              border="0"
              style="background:#f4f0f3;"
            >
              <tr>
                <td
                  align="center"
                  style="padding:40px 12px;"
                >
                  <table
                    role="presentation"
                    width="100%"
                    cellspacing="0"
                    cellpadding="0"
                    border="0"
                    style="
                      max-width:680px;
                      background:#ffffff;
                      border-radius:20px;
                      overflow:hidden;
                      border:1px solid #eadde7;
                      box-shadow:0 10px 30px rgba(30,16,27,0.08);
                    "
                  >

                    <!-- HEADER -->
                    <tr>
                      <td
                        align="center"
                        style="
                          padding:38px 28px 34px;
                          background:#171316;
                          border-bottom:5px solid #9e2a89;
                        "
                      >
                        <img
                          src="${LOGO_URL}"
                          alt="Escape Events"
                          width="150"
                          style="
                            display:block;
                            width:150px;
                            max-width:100%;
                            height:auto;
                            margin:0 auto 24px;
                            border:0;
                          "
                        />

                        <div
                          style="
                            font-size:11px;
                            line-height:18px;
                            letter-spacing:3px;
                            text-transform:uppercase;
                            color:#d7a6ce;
                            font-weight:bold;
                          "
                        >
                          New Website Inquiry
                        </div>

                        <h1
                          style="
                            margin:10px 0 0;
                            font-size:30px;
                            line-height:38px;
                            color:#ffffff;
                            font-weight:600;
                          "
                        >
                          New Consultation Request
                        </h1>

                        <p
                          style="
                            margin:12px 0 0;
                            color:#c9c1c7;
                            font-size:14px;
                            line-height:22px;
                          "
                        >
                          A potential client has submitted an inquiry
                          through the Escape Events website.
                        </p>
                      </td>
                    </tr>

                    <!-- CLIENT INFORMATION -->
                    <tr>
                      <td style="padding:32px 32px 0;">
                        <table
                          role="presentation"
                          width="100%"
                          cellspacing="0"
                          cellpadding="0"
                          border="0"
                        >
                          <tr>
                            <td>
                              <div
                                style="
                                  font-size:11px;
                                  letter-spacing:2px;
                                  text-transform:uppercase;
                                  color:#9e2a89;
                                  font-weight:bold;
                                "
                              >
                                Client Information
                              </div>

                              <h2
                                style="
                                  margin:7px 0 20px;
                                  font-size:23px;
                                  line-height:30px;
                                  color:#211a20;
                                "
                              >
                                ${fullName}
                              </h2>
                            </td>
                          </tr>
                        </table>

                        <table
                          role="presentation"
                          width="100%"
                          cellspacing="0"
                          cellpadding="0"
                          border="0"
                          style="
                            background:#faf7f9;
                            border:1px solid #eee2ea;
                            border-radius:14px;
                          "
                        >
                          <tr>
                            <td
                              style="
                                padding:20px;
                                border-bottom:1px solid #eee2ea;
                              "
                            >
                              <div
                                style="
                                  font-size:11px;
                                  color:#867a83;
                                  text-transform:uppercase;
                                  letter-spacing:1px;
                                  margin-bottom:5px;
                                "
                              >
                                Email Address
                              </div>

                              <div
                                style="
                                  font-size:15px;
                                  color:#211a20;
                                "
                              >
                                ${customerEmail}
                              </div>
                            </td>
                          </tr>

                          <tr>
                            <td style="padding:20px;">
                              <div
                                style="
                                  font-size:11px;
                                  color:#867a83;
                                  text-transform:uppercase;
                                  letter-spacing:1px;
                                  margin-bottom:5px;
                                "
                              >
                                Phone Number
                              </div>

                              <div
                                style="
                                  font-size:15px;
                                  color:#211a20;
                                "
                              >
                                ${phoneNumber}
                              </div>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>

                    <!-- CONSULTATION -->
                    <tr>
                      <td style="padding:32px 32px 0;">
                        <div
                          style="
                            font-size:11px;
                            letter-spacing:2px;
                            text-transform:uppercase;
                            color:#9e2a89;
                            font-weight:bold;
                          "
                        >
                          Preferred Consultation
                        </div>

                        <h2
                          style="
                            margin:7px 0 20px;
                            font-size:22px;
                            color:#211a20;
                          "
                        >
                          Consultation Details
                        </h2>

                        <table
                          role="presentation"
                          width="100%"
                          cellspacing="0"
                          cellpadding="0"
                          border="0"
                          style="
                            background:#9e2a89;
                            border-radius:14px;
                          "
                        >
                          <tr>
                            <td
                              width="50%"
                              valign="top"
                              style="
                                padding:20px;
                                border-right:1px solid rgba(255,255,255,0.2);
                              "
                            >
                              <div
                                style="
                                  font-size:11px;
                                  color:#efd8eb;
                                  text-transform:uppercase;
                                  letter-spacing:1px;
                                  margin-bottom:7px;
                                "
                              >
                                Date
                              </div>

                              <div
                                style="
                                  color:#ffffff;
                                  font-size:16px;
                                  font-weight:bold;
                                "
                              >
                                ${consultationDate}
                              </div>
                            </td>

                            <td
                              width="50%"
                              valign="top"
                              style="padding:20px;"
                            >
                              <div
                                style="
                                  font-size:11px;
                                  color:#efd8eb;
                                  text-transform:uppercase;
                                  letter-spacing:1px;
                                  margin-bottom:7px;
                                "
                              >
                                Time
                              </div>

                              <div
                                style="
                                  color:#ffffff;
                                  font-size:16px;
                                  font-weight:bold;
                                "
                              >
                                ${consultationTime}
                              </div>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>

                    <!-- EVENT DETAILS -->
                    <tr>
                      <td style="padding:32px 32px 0;">
                        <div
                          style="
                            font-size:11px;
                            letter-spacing:2px;
                            text-transform:uppercase;
                            color:#9e2a89;
                            font-weight:bold;
                          "
                        >
                          Event Details
                        </div>

                        <h2
                          style="
                            margin:7px 0 20px;
                            font-size:22px;
                            color:#211a20;
                          "
                        >
                          ${eventType}
                        </h2>

                        <table
                          role="presentation"
                          width="100%"
                          cellspacing="0"
                          cellpadding="0"
                          border="0"
                          style="
                            border:1px solid #eee2ea;
                            border-radius:14px;
                            overflow:hidden;
                          "
                        >
                          <tr>
                            <td
                              width="42%"
                              style="
                                padding:15px 18px;
                                background:#faf7f9;
                                border-bottom:1px solid #eee2ea;
                                color:#756971;
                                font-size:13px;
                              "
                            >
                              Event Date
                            </td>

                            <td
                              style="
                                padding:15px 18px;
                                border-bottom:1px solid #eee2ea;
                                font-size:14px;
                                font-weight:bold;
                              "
                            >
                              ${eventDate}
                            </td>
                          </tr>

                          <tr>
                            <td
                              style="
                                padding:15px 18px;
                                background:#faf7f9;
                                border-bottom:1px solid #eee2ea;
                                color:#756971;
                                font-size:13px;
                              "
                            >
                              Event Location
                            </td>

                            <td
                              style="
                                padding:15px 18px;
                                border-bottom:1px solid #eee2ea;
                                font-size:14px;
                                font-weight:bold;
                              "
                            >
                              ${eventLocation}
                            </td>
                          </tr>

                          <tr>
                            <td
                              style="
                                padding:15px 18px;
                                background:#faf7f9;
                                border-bottom:1px solid #eee2ea;
                                color:#756971;
                                font-size:13px;
                              "
                            >
                              Budget Range
                            </td>

                            <td
                              style="
                                padding:15px 18px;
                                border-bottom:1px solid #eee2ea;
                                font-size:14px;
                                font-weight:bold;
                              "
                            >
                              ${budgetRange}
                            </td>
                          </tr>

                          <tr>
                            <td
                              style="
                                padding:15px 18px;
                                background:#faf7f9;
                                border-bottom:1px solid #eee2ea;
                                color:#756971;
                                font-size:13px;
                              "
                            >
                              Custom Budget
                            </td>

                            <td
                              style="
                                padding:15px 18px;
                                border-bottom:1px solid #eee2ea;
                                font-size:14px;
                                font-weight:bold;
                              "
                            >
                              ${customBudget}
                            </td>
                          </tr>

                          <tr>
                            <td
                              style="
                                padding:15px 18px;
                                background:#faf7f9;
                                border-bottom:1px solid #eee2ea;
                                color:#756971;
                                font-size:13px;
                              "
                            >
                              Services
                            </td>

                            <td
                              style="
                                padding:15px 18px;
                                border-bottom:1px solid #eee2ea;
                                font-size:14px;
                                font-weight:bold;
                              "
                            >
                              ${services}
                            </td>
                          </tr>

                          <tr>
                            <td
                              style="
                                padding:15px 18px;
                                background:#faf7f9;
                                color:#756971;
                                font-size:13px;
                              "
                            >
                              Referral Source
                            </td>

                            <td
                              style="
                                padding:15px 18px;
                                font-size:14px;
                                font-weight:bold;
                              "
                            >
                              ${referralSource}
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>

                    <!-- EVENT VISION -->
                    <tr>
                      <td style="padding:32px 32px 0;">
                        <div
                          style="
                            font-size:11px;
                            letter-spacing:2px;
                            text-transform:uppercase;
                            color:#9e2a89;
                            font-weight:bold;
                          "
                        >
                          Vision and Expectations
                        </div>

                        <h2
                          style="
                            margin:7px 0 20px;
                            font-size:22px;
                            color:#211a20;
                          "
                        >
                          Client's Event Vision
                        </h2>

                        <div
                          style="
                            padding:22px;
                            background:#faf7f9;
                            border-left:5px solid #9e2a89;
                            border-radius:0 14px 14px 0;
                            font-size:15px;
                            line-height:25px;
                            color:#41373f;
                          "
                        >
                          ${eventVision}
                        </div>
                      </td>
                    </tr>

                    <!-- REPLY BUTTON -->
                    <tr>
                      <td
                        align="center"
                        style="padding:34px 32px;"
                      >
                        <a
                          href="${replyLink}"
                          style="
                            display:inline-block;
                            background:#9e2a89;
                            color:#ffffff;
                            text-decoration:none;
                            padding:15px 28px;
                            border-radius:50px;
                            font-size:14px;
                            font-weight:bold;
                          "
                        >
                          Reply to ${fullName}
                        </a>

                        <p
                          style="
                            margin:16px 0 0;
                            font-size:12px;
                            line-height:19px;
                            color:#8a7d86;
                          "
                        >
                          Clicking this button will open a reply email
                          addressed to the client.
                        </p>
                      </td>
                    </tr>

                    <!-- FOOTER -->
                    <tr>
                      <td
                        align="center"
                        style="
                          padding:24px 28px;
                          background:#171316;
                          color:#aaa1a8;
                        "
                      >
                        <p
                          style="
                            margin:0 0 8px;
                            font-size:12px;
                            line-height:19px;
                          "
                        >
                          This inquiry was submitted through
                          Escape Events.
                        </p>

                        <a
                          href="${WEBSITE_URL}"
                          style="
                            color:#dca5d2;
                            text-decoration:none;
                            font-size:12px;
                          "
                        >
                          escapeeventsgh.com
                        </a>
                      </td>
                    </tr>

                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error("Resend error:", error);

      return {
        statusCode: 502,
        body: JSON.stringify({
          success: false,
          message: "The email could not be sent.",
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
      }),
    };
  } catch (error) {
    console.error(
      "Consultation function error:",
      error
    );

    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message:
          "Something went wrong while sending the inquiry.",
      }),
    };
  }
};