import { NextRequest, NextResponse } from "next/server";
import neynarClient from "@/clients/neynar";
import { isApiErrorResponse } from "@neynar/nodejs-sdk";

export async function GET(request: NextRequest) {
  const fid = (await request.json()) as { fid: number };
  return NextResponse.json({ fid }, { status: 200 });
}

export async function POST(request: NextRequest) {
  const { signerUuid, fids } = (await request.json()) as {
    signerUuid: string;
    fids: number[];
  };

  try {
    const response: any = await neynarClient.followUser(signerUuid, fids);

    return NextResponse.json(
      {
        message: "Follow operation completed",
        success: response.success,
        details: response.details,
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("/api/follow", err);
    if (isApiErrorResponse(err)) {
      return NextResponse.json(
        { ...err.response.data },
        { status: err.response.status },
      );
    } else {
      return NextResponse.json(
        { message: "Something went wrong" },
        { status: 500 },
      );
    }
  }
}
