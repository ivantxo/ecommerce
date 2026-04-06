import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

export default function SendEmailVerification({
  email,
  code,
}: {
  email: string;
  code: string;
}) {
  return (
    <Html>
      <Preview>New Account Confirmation</Preview>
      <Tailwind>
        <Head />
        <Body className="font-sans bg-white">
          <Container className="max-w-xl">
            <Heading>New Account Confirmation</Heading>
            <Section>
              <Row>
                <Column>
                  <Text className="mb-0 mr-4 text-gray-500 whitespace-nowrap text-nowrap">
                    Thanks for opening an account at CreativeDS, please click
                    the link below so your account can be verified.
                    <a
                      href={`${process.env.production ? process.env.VERCEL_URL : "http://localhost:3000"}/api/verify-email?email=${encodeURIComponent(email)}&code=${code}`}
                    >
                      Verify your email
                    </a>
                  </Text>
                </Column>
              </Row>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
