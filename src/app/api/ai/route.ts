import { NextResponse } from "next/server";
import { answerTravelQuestion } from "@/lib/travelAssistant";

export async function POST(request: Request) {
  try {
    const body = await request.json() as { question?: unknown; locale?: unknown };
    const question = typeof body.question === "string" ? body.question.trim() : "";
    const locale = body.locale === "en" || body.locale === "ar" ? body.locale : "fr";

    if (!question) {
      return NextResponse.json({ error:"Une question est requise." }, { status:400 });
    }
    if (question.length > 600) {
      return NextResponse.json({ error:"La question est trop longue." }, { status:400 });
    }

    return NextResponse.json(answerTravelQuestion(question, locale));
  } catch {
    return NextResponse.json({ error:"Impossible d’analyser la demande." }, { status:400 });
  }
}
