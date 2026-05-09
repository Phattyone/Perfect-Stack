// src/app/api/guide/personalize/route.ts
//
// Sets the user's display name on their guide profile, then immediately
// generates and returns the watermarked PDF download URL.

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Validate request body
  let name: string;
  try {
    const body = await request.json();
    name = typeof body.name === "string" ? body.name.trim() : "";
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  if (name.length > 100) {
    return NextResponse.json(
      { error: "Name must be 100 characters or fewer" },
      { status: 400 }
    );
  }

  // Verify the user has purchased the guide
  const { data: profile } = await supabase
    .from("profiles")
    .select("has_digital_guide, digital_guide_license_id")
    .eq("id", user.id)
    .single();

  if (!profile?.has_digital_guide) {
    return NextResponse.json(
      { error: "Digital guide not purchased" },
      { status: 403 }
    );
  }

  // Save the name
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ digital_guide_name: name })
    .eq("id", user.id);

  if (updateError) {
    console.error("Failed to save guide name:", updateError.message);
    return NextResponse.json(
      { error: "Failed to save your name. Please try again." },
      { status: 500 }
    );
  }

  // Generate the personalized PDF
  try {
    const { data: masterPdf, error: fetchError } = await supabase.storage
      .from("digital-guides")
      .download("master/The_Perfectly_Erect_Plan_v22.pdf");

    if (fetchError || !masterPdf) {
      console.error("Failed to fetch master PDF:", fetchError?.message);
      return NextResponse.json(
        { error: "Guide not available. Please try again later." },
        { status: 500 }
      );
    }

    const pdfBytes = await masterPdf.arrayBuffer();
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const pages = pdfDoc.getPages();

    const licenseId = String(profile.digital_guide_license_id ?? "").slice(0, 8);
    const footerText = `Licensed to: ${name} | ${user.email} | License ID: ${licenseId}... | getperfectstack.com | Not for redistribution`;

    for (const page of pages) {
      const { width } = page.getSize();
      const textWidth = font.widthOfTextAtSize(footerText, 7);
      page.drawText(footerText, {
        x: (width - textWidth) / 2,
        y: 12,
        size: 7,
        font,
        color: rgb(0.4, 0.4, 0.4),
      });
    }

    const watermarkedBytes = await pdfDoc.save();
    const filePath = `${user.id}/perfect-stack-guide.pdf`;

    const { error: uploadError } = await supabase.storage
      .from("digital-guides")
      .upload(filePath, watermarkedBytes, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      console.error("Failed to upload guide:", uploadError.message);
      return NextResponse.json(
        { error: "Failed to save your guide. Please try again." },
        { status: 500 }
      );
    }

    const { data: signedUrlData, error: signedUrlError } =
      await supabase.storage
        .from("digital-guides")
        .createSignedUrl(filePath, 3600);

    if (signedUrlError || !signedUrlData?.signedUrl) {
      console.error("Failed to create signed URL:", signedUrlError?.message);
      return NextResponse.json(
        { error: "Guide saved but download link failed. Use the Download button." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, downloadUrl: signedUrlData.signedUrl });
  } catch (error) {
    console.error("PDF generation error during personalization:", error);
    return NextResponse.json(
      { error: "Failed to generate your guide. Please try again." },
      { status: 500 }
    );
  }
}
