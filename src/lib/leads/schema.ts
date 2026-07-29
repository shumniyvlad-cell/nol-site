import { z } from "zod";

export const premiereLeadSchema = z.object({
  type: z.literal("premiere"),
  email: z
    .string()
    .trim()
    .min(1, "Укажите электронную почту")
    .email("Проверьте адрес электронной почты")
    .max(254, "Адрес слишком длинный"),
  consent: z
    .boolean()
    .refine((value) => value, "Нужно согласие на обработку данных"),
  company: z.string().max(0),
});

const utmSchema = z
  .object({
    source: z.string().max(120).optional(),
    medium: z.string().max(120).optional(),
    campaign: z.string().max(160).optional(),
    content: z.string().max(160).optional(),
    term: z.string().max(160).optional(),
  })
  .optional();

export const diagnosticLeadSchema = z.object({
  type: z.literal("diagnostic"),
  name: z
    .string()
    .trim()
    .min(2, "Укажите имя")
    .max(80, "Имя слишком длинное"),
  phone: z
    .string()
    .trim()
    .regex(
      /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/,
      "Введите телефон полностью",
    ),
  preferredContact: z.enum(["call", "telegram", "whatsapp"], {
    error: "Выберите способ связи",
  }),
  comment: z.string().trim().max(1000, "Комментарий слишком длинный"),
  consent: z
    .boolean()
    .refine((value) => value, "Нужно согласие на обработку данных"),
  company: z.string().max(0),
  answers: z
    .record(z.string(), z.string())
    .refine(
      (answers) => Object.keys(answers).length === 7,
      "Ответьте на все вопросы диагностики",
    ),
  utm: utmSchema,
});

export type PremiereLeadInput = z.infer<typeof premiereLeadSchema>;
export type DiagnosticLeadInput = z.infer<typeof diagnosticLeadSchema>;
export type LeadInput = PremiereLeadInput | DiagnosticLeadInput;
