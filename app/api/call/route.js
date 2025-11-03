export async function POST(request) {
  try {
    const body = await request.json();
    const { to, script, provider = "mock", name = "", leadId = "" } = body || {};

    if (!to || !script) {
      return Response.json({ error: "Missing 'to' or 'script'" }, { status: 400 });
    }

    if (provider === "twilio") {
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      const fromNumber = process.env.TWILIO_FROM_NUMBER;
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL || "";

      if (!accountSid || !authToken || !fromNumber) {
        return Response.json({ error: "Twilio not configured" }, { status: 400 });
      }

      const baseUrl = typeof siteUrl === "string" && siteUrl.includes("http") ? siteUrl : `https://${siteUrl || "agentic-427d722e.vercel.app"}`;
      const voiceUrl = `${baseUrl}/api/voice?leadId=${encodeURIComponent(leadId)}&name=${encodeURIComponent(name)}&script=${encodeURIComponent(script)}`;

      const form = new URLSearchParams();
      form.set("To", to);
      form.set("From", fromNumber);
      form.set("Url", voiceUrl);

      const resp = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Calls.json`, {
        method: "POST",
        headers: {
          "Authorization": `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: form,
      });

      const data = await resp.json();
      if (!resp.ok) {
        return Response.json({ error: data?.message || "Twilio API error" }, { status: 500 });
      }

      return Response.json({ status: data.status || "queued", callSid: data.sid });
    }

    // Mock provider: simulate a 2s call and complete
    await new Promise(r => setTimeout(r, 1200));
    return Response.json({ status: "completed", callSid: `MOCK-${Date.now()}` });
  } catch (err) {
    return Response.json({ error: err?.message || "Unknown error" }, { status: 500 });
  }
}
