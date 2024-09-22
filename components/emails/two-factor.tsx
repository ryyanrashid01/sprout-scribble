import getBaseURL from "@/lib/base-url";
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Button,
} from "@react-email/components";
import * as React from "react";

const baseUrl = getBaseURL();

export default function TwoFactorEmail({
  twoFactorToken,
}: {
  twoFactorToken: string;
}) {
  return (
    <Html>
      <Head />
      <Preview>Sproute & Scribble - Two factor code</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={coverSection}>
            <Section style={imageSection}>
              <Img
                src={`${baseUrl}/logo.png`}
                width="275"
                alt="Sprout & Scribble Logo"
              />
            </Section>
            <Section style={upperSection}>
              <Heading style={h1}>Two factor code for your login</Heading>
              <Text style={mainText}>
                Thanks for starting the two-factor authentication (2FA) setup
                for your Sprout & Scribble account. To enhance your account
                security, please enter the verification code sent to your
                registered email. If you didn&apos;t initiate this process, you
                can safely ignore this message.
              </Text>
              <Section style={verificationSection}>
                <Text style={verifyText}>Two factor code</Text>

                <Text style={codeText}>{twoFactorToken}</Text>
                <Text style={validityText}>
                  (This code is valid for 10 minutes)
                </Text>
              </Section>
            </Section>
            <Hr />
            <Section style={lowerSection}>
              <Text style={cautionText}>
                Sprout & Scribble will never email you and ask you to disclose
                or verify your password, credit card, or banking account number.
              </Text>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#fff",
  color: "#212121",
};

const container = {
  padding: "20px",
  margin: "0 auto",
  backgroundColor: "#E8581C",
};

const h1 = {
  color: "#333",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "20px",
  fontWeight: "bold",
  marginBottom: "15px",
};

const text = {
  color: "#333",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "14px",
  margin: "24px 0",
};

const imageSection = {
  backgroundColor: "#fff",
  display: "flex",
  padding: "20px 0",
  alignItems: "center",
  justifyContent: "center",
};

const coverSection = { backgroundColor: "#fff" };

const upperSection = { padding: "25px 35px" };

const lowerSection = { padding: "25px 35px" };

const validityText = {
  ...text,
  margin: "0px",
  textAlign: "center" as const,
};

const verificationSection = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const verifyText = {
  ...text,
  margin: 0,
  fontWeight: "bold",
  textAlign: "center" as const,
};

const codeText = {
  ...text,
  fontWeight: "bold",
  fontSize: "36px",
  margin: "10px 0",
  textAlign: "center" as const,
};

const mainText = { ...text, marginBottom: "14px" };

const cautionText = { ...text, margin: "0px" };
