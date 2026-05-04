import { NextResponse } from "next/server";
import { Pool } from "pg";

export const runtime = "nodejs";

type AppointmentPayload = {
  owner?: unknown;
  phone?: unknown;
  pet?: unknown;
  plan?: unknown;
  date?: unknown;
  time?: unknown;
  note?: unknown;
};

const petTypes = new Set(["小型犬", "中型犬", "大型犬", "猫咪"]);
const planNames = new Set([
  "小型犬日常洗护",
  "中型犬全身精护",
  "造型美容套餐",
  "猫咪安抚护理",
  "先咨询"
]);
const timeSlots = new Set([
  "10:00 - 12:00",
  "12:00 - 14:00",
  "14:00 - 16:00",
  "16:00 - 18:00",
  "18:00 - 20:00"
]);

declare global {
  var appointmentsPool: Pool | undefined;
}

function getPool() {
  const connectionString = process.env.SUPABASE_DB_SESSION_POOL_URL;

  if (!connectionString) {
    throw new Error("Missing SUPABASE_DB_SESSION_POOL_URL");
  }

  if (!globalThis.appointmentsPool) {
    globalThis.appointmentsPool = new Pool({
      connectionString,
      max: Number(process.env.SUPABASE_DB_POOL_MAX || 5),
      ssl:
        process.env.SUPABASE_DB_SSL === "false"
          ? false
          : { rejectUnauthorized: false }
    });
  }

  return globalThis.appointmentsPool;
}

function asText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isDateInput(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export async function POST(request: Request) {
  let payload: AppointmentPayload;

  try {
    payload = (await request.json()) as AppointmentPayload;
  } catch {
    return NextResponse.json({ message: "预约信息格式不正确。" }, { status: 400 });
  }

  const owner = asText(payload.owner);
  const phone = asText(payload.phone);
  const pet = asText(payload.pet);
  const plan = asText(payload.plan);
  const date = asText(payload.date);
  const time = asText(payload.time);
  const note = asText(payload.note);

  if (!owner || owner.length > 80) {
    return NextResponse.json({ message: "请填写主人姓名。" }, { status: 400 });
  }

  if (!phone || phone.length < 5 || phone.length > 32) {
    return NextResponse.json({ message: "请填写有效联系电话。" }, { status: 400 });
  }

  if (!petTypes.has(pet) || !planNames.has(plan) || !timeSlots.has(time) || !isDateInput(date)) {
    return NextResponse.json({ message: "预约选项不完整或不正确。" }, { status: 400 });
  }

  try {
    const result = await getPool().query<{ id: string }>(
      `insert into public.appointments
        (owner_name, phone, pet_type, plan_name, visit_date, time_slot, note)
       values ($1, $2, $3, $4, $5, $6, $7)
       returning id`,
      [owner, phone, pet, plan, date, time, note || null]
    );

    return NextResponse.json({ id: result.rows[0]?.id });
  } catch (error) {
    console.error("Failed to create appointment", error);
    return NextResponse.json(
      { message: "预约暂时提交失败，请稍后再试或电话联系门店。" },
      { status: 500 }
    );
  }
}
