export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name") || "there";
  const script = searchParams.get("script") || "Hello from Noida Hub.";

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Aditi" language="en-IN">Hello ${name}.</Say>
  <Pause length="1"/>
  <Say voice="Polly.Aditi" language="en-IN">${script}</Say>
  <Pause length="1"/>
  <Gather input="speech dtmf" timeout="5" numDigits="1" action="/api/voice/handle">
    <Say voice="Polly.Aditi" language="en-IN">Press 1 to request a WhatsApp brochure, or say interested.</Say>
  </Gather>
  <Say voice="Polly.Aditi" language="en-IN">Thank you. Goodbye.</Say>
  <Hangup/>
</Response>`;

  return new Response(twiml, { headers: { "Content-Type": "text/xml" } });
}
