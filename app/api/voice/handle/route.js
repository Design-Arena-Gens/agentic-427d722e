export async function POST(request) {
  const form = await request.formData();
  const digits = form.get("Digits");
  const speech = form.get("SpeechResult");

  let message = "Thanks for your response. Our team will reach out soon.";
  if (digits === "1" || (speech && /interest|yes|yeah|okay|ok/i.test(String(speech)))) {
    message = "Great! We will send the brochure on WhatsApp shortly and arrange a callback.";
  }

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Aditi" language="en-IN">${message}</Say>
  <Hangup/>
</Response>`;

  return new Response(twiml, { headers: { "Content-Type": "text/xml" } });
}
