export function verificationEmailTemplate(
  verificationUrl: string,
): string {
  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Verify your email</title>
  </head>

  <body
    style="
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
      font-family: Arial, Helvetica, sans-serif;
    "
  >
    <div
      style="
        max-width: 600px;
        margin: 40px auto;
        background: #ffffff;
        padding: 40px;
        border-radius: 12px;
      "
    >
      <h1 style="margin-top: 0;">Verify your email</h1>

      <p>
        Thanks for creating your account with FARRA.
      </p>

      <p>
        Please click the button below to verify your email address.
      </p>

      <div style="margin: 30px 0;">
        <a
          href="${verificationUrl}"
          style="
            display: inline-block;
            padding: 12px 24px;
            background-color: #000000;
            color: #ffffff;
            text-decoration: none;
            border-radius: 6px;
          "
        >
          Verify Email
        </a>
      </div>

      <p>
        If you did not create this account, you can safely ignore this email.
      </p>

      <p>
        This verification link will expire after the configured verification
        period.
      </p>
    </div>
  </body>
</html>
`;
}

export function passwordResetEmailTemplate(
  resetUrl: string,
): string {
  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Reset your password</title>
  </head>

  <body
    style="
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
      font-family: Arial, Helvetica, sans-serif;
    "
  >
    <div
      style="
        max-width: 600px;
        margin: 40px auto;
        background: #ffffff;
        padding: 40px;
        border-radius: 12px;
      "
    >
      <h1 style="margin-top: 0;">Reset your password</h1>

      <p>
        We received a request to reset your FARRA account password.
      </p>

      <p>
        Click the button below to choose a new password.
      </p>

      <div style="margin: 30px 0;">
        <a
          href="${resetUrl}"
          style="
            display: inline-block;
            padding: 12px 24px;
            background-color: #000000;
            color: #ffffff;
            text-decoration: none;
            border-radius: 6px;
          "
        >
          Reset Password
        </a>
      </div>

      <p>
        If you did not request a password reset, you can safely ignore this
        email.
      </p>

      <p>
        This password reset link will expire after the configured reset period.
      </p>
    </div>
  </body>
</html>
`;
}