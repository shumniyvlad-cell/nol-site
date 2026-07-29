import { NextResponse } from "next/server";
import { hasRequiredCompanyDetails } from "@/config/site";
import { storeLead } from "@/lib/leads/adapter";
import { checkLeadRateLimit } from "@/lib/leads/rate-limit";
import {
  diagnosticLeadSchema,
  premiereLeadSchema,
  type LeadInput,
} from "@/lib/leads/schema";

export const runtime = "nodejs";

const globalForDuplicates = globalThis as typeof globalThis & {
  nolLeadDuplicates?: Map<string, number>;
};

const duplicateStore =
  globalForDuplicates.nolLeadDuplicates ?? new Map<string, number>();

if (process.env.NODE_ENV !== "production") {
  globalForDuplicates.nolLeadDuplicates = duplicateStore;
}

function getDuplicateKey(lead: LeadInput) {
  return lead.type === "premiere"
    ? `premiere:${lead.email.toLowerCase()}`
    : `diagnostic:${lead.phone}`;
}

export async function POST(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const clientKey = forwardedFor?.split(",")[0]?.trim() || "local";
  const rateLimit = checkLeadRateLimit(clientKey);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        ok: false,
        message: "Слишком много попыток. Попробуйте позже.",
      },
      {
        status: 429,
        headers: {
          "retry-after": String(rateLimit.retryAfterSeconds),
        },
      },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Некорректный формат данных." },
      { status: 400 },
    );
  }

  const submittedType =
    typeof body === "object" && body && "type" in body
      ? (body as { type?: unknown }).type
      : undefined;
  const schema =
    submittedType === "diagnostic"
      ? diagnosticLeadSchema
      : submittedType === "premiere"
        ? premiereLeadSchema
        : null;

  if (!schema) {
    return NextResponse.json(
      { ok: false, message: "Неизвестный тип формы." },
      { status: 400 },
    );
  }

  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        message: "Проверьте заполненные поля.",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 422 },
    );
  }

  if (parsed.data.company) {
    return NextResponse.json({ ok: true });
  }

  if (
    process.env.NODE_ENV === "production" &&
    !hasRequiredCompanyDetails()
  ) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Приём заявок не запущен: сведения оператора персональных данных не настроены.",
      },
      { status: 503 },
    );
  }

  const duplicateKey = getDuplicateKey(parsed.data);
  const previousSubmission = duplicateStore.get(duplicateKey) ?? 0;
  const duplicateWindowMs = 90 * 1000;

  if (Date.now() - previousSubmission < duplicateWindowMs) {
    return NextResponse.json(
      {
        ok: false,
        message: "Эта заявка уже отправлена. Повторять её не нужно.",
      },
      { status: 409 },
    );
  }

  try {
    await storeLead(parsed.data);
    duplicateStore.set(duplicateKey, Date.now());
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Канал приёма заявок пока не подключён. Попробуйте позже или напишите нам напрямую.",
      },
      { status: 503 },
    );
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
