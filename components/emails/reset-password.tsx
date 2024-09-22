import getBaseURL from "@/lib/base-url";
import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

const baseUrl = getBaseURL();

export const ResetPasswordEmail = ({
  name,
  resetPasswordLink,
}: {
  name: string;
  resetPasswordLink: string;
}) => {
  return (
    <Html>
      <Head />
      <Preview>Sprout & Scribble - Reset your password</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src={`${baseUrl}/logo.png`}
            width="275"
            alt="Sprout & Scribble Logo"
          />
          <Section>
            <Text style={text}>Hi {name},</Text>
            <Text style={text}>
              Someone recently requested a password change for your Sprout &
              Scribble account. If this was you, you can set a new password
              here:
            </Text>
            <Section style={verificationSection}>
              <Button style={button} href={resetPasswordLink}>
                Reset password
              </Button>
              <Text style={validityText}>
                (This link is valid for 10 minutes)
              </Text>
            </Section>
            <Text style={text}>
              If you don&apos;t want to change your password or didn&apos;t
              request this, just ignore and delete this message.
            </Text>
            <Text style={text}>Happy Scribbling!</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default ResetPasswordEmail;

const main = {
  backgroundColor: "#f6f9fc",
  padding: "10px 0",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #f0f0f0",
  padding: "45px",
};

const text = {
  fontSize: "16px",
  fontFamily:
    "'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
  fontWeight: "300",
  color: "#404040",
  lineHeight: "26px",
};

const button = {
  backgroundColor: "#E8581C",
  borderRadius: "4px",
  color: "#fff",
  fontFamily: "'Open Sans', 'Helvetica Neue', Arial",
  fontSize: "15px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "210px",
  padding: "14px 7px",
  cursor: "pointer",
};

const verificationSection = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const validityText = {
  ...text,
  margin: "0px",
  textAlign: "center" as const,
};
