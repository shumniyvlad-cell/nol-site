import type { LeadInput } from "./schema";

type StoredLead = LeadInput & {
  createdAt: string;
};

const globalForLeads = globalThis as typeof globalThis & {
  nolDevelopmentLeads?: StoredLead[];
};

const developmentLeads = globalForLeads.nolDevelopmentLeads ?? [];

if (process.env.NODE_ENV !== "production") {
  globalForLeads.nolDevelopmentLeads = developmentLeads;
}

async function sendToWebhook(lead: StoredLead) {
  const webhookUrl = process.env.LEADS_WEBHOOK_URL;

  if (!webhookUrl) {
    return false;
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(process.env.LEADS_WEBHOOK_TOKEN
        ? { authorization: `Bearer ${process.env.LEADS_WEBHOOK_TOKEN}` }
        : {}),
    },
    body: JSON.stringify(lead),
    cache: "no-store",
    signal: AbortSignal.timeout(8_000),
  });

  if (!response.ok) {
    throw new Error(`Lead webhook returned ${response.status}`);
  }

  return true;
}

export async function storeLead(input: LeadInput) {
  const lead: StoredLead = {
    ...input,
    company: "",
    createdAt: new Date().toISOString(),
  };

  if (await sendToWebhook(lead)) {
    return;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("Production lead adapter is not configured");
  }

  developmentLeads.push(lead);
  if (developmentLeads.length > 200) {
    developmentLeads.shift();
  }
}
