// src/app/api/guide/generate/route.ts
//
// Fetches the master PDF from Supabase storage, watermarks every page with the
// user's personalization data, saves the result to their private storage path,
// and returns a signed download URL valid for 60 minutes.
//
// IMPORTANT: The master PDF must be manually uploaded to Supabase storage at:
//   digital-guides/master/The_Perfectly_Erect_Plan_v22.pdf
// before this feature goes live.

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export async function POST() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("has_digital_guide, digital_guide_name, digital_guide_license_id")
    .eq("id", user.id)
    .single();

  if (!profile?.has_digital_guide) {
    return NextResponse.json(
      { error: "Digital guide not purchased" },
      { status: 403 }
    );
  }

  try {
    // Fetch master PDF from private Supabase storage
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

    // Load and watermark PDF
    const pdfBytes = await masterPdf.arrayBuffer();
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const pages = pdfDoc.getPages();

    const guideName = profile.digital_guide_name ?? "Unknown";
    const licenseId = String(profile.digital_guide_license_id ?? "").slice(0, 8);
    const footerText = `Licensed to: ${guideName} | ${user.email} | License ID: ${licenseId}... | getperfectstack.com | Not for redistribution`;

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

    // Upload watermarked PDF to the user's private storage folder
    const watermarkedBytes = await pdfDoc.save();
    const filePath = `${user.id}/perfect-stack-guide.pdf`;

    const { error: uploadError } = await supabase.storage
      .from("digital-guides")
      .upload(filePath, watermarkedBytes, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      console.error("Failed to upload watermarked PDF:", uploadError.message);
      return NextResponse.json(
        { error: "Failed to save your guide. Please try again." },
        { status: 500 }
      );
    }

    // Generate signed URL valid for 60 minutes
    const { data: signedUrlData, error: signedUrlError } =
      await supabase.storage
        .from("digital-guides")
        .createSignedUrl(filePath, 3600);

    if (signedUrlError || !signedUrlData?.signedUrl) {
      console.error("Failed to create signed URL:", signedUrlError?.message);
      return NextResponse.json(
        { error: "Failed to generate download link. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: signedUrlData.signedUrl });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate your guide. Please try again." },
      { status: 500 }
    );
  }
}
